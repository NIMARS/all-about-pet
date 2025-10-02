import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import ms, { StringValue } from 'ms';
import { z } from 'zod';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? 'dev_access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh';

const ACCESS_TTL = process.env.ACCESS_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TTL || '30d';

const ACCESS_EXPIRES_SEC = resolveExpirySec(process.env.ACCESS_TTL, 15 * 60);
const REFRESH_EXPIRES_SEC = resolveExpirySec(process.env.REFRESH_TTL, 30 * 24 * 60 * 60);

function expiresAtDate(seconds: number) {
  return new Date(Date.now() + seconds * 1000);
}


function resolveExpirySec(input: string | undefined, defSec: number) {
  if (!input) return defSec;
  const n = Number(input);
  if (!Number.isNaN(n)) return Math.max(1, Math.floor(n));
  try { return Math.max(1, Math.floor(ms(input as StringValue) / 1000)); } catch { return defSec; }
}

function setRefreshCookie(res: import('express').Response, refreshToken: string) {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_EXPIRES_SEC * 1000,
    path: '/api/auth/refresh',
  });
}

function clearRefreshCookie(res: import('express').Response) {
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
}

export async function me(req: Request, res: Response) {
  const id = req.user?.sub;
  if (!id) return res.status(401).json({ message: 'Unauthorized' });

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
}


const registerSchema = z.object({
  name: z.string().trim().min(1).optional(),
  nickname: z.string().trim().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(8), 
}).refine(d => !!(d.name ?? d.nickname), {
  message: 'name or nickname is required',
  path: ['name'],
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  // if (!parsed.success) {
  //   return res.status(400).json({
  //     message: 'Validation failed',
  //     errors: parsed.error.flatten(),
  //     raw: req.body, //delete or not? uhm
  //   });
  // }
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const name = (parsed.data.name ?? parsed.data.nickname ?? '').trim();
  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: 'Email already exists' }); //message to error _-_-_

  const hash = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: { email, password: hash, name, role: 'owner' },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccess(user.id, user.role as any);
  const refreshToken = signRefresh(user.id);

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash,
      userAgent: req.headers['user-agent'] ?? 'unknown',
      ip: req.ip,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_SEC * 1000),
    },
  });

  setRefreshCookie(res, refreshToken);
  return res.status(201).json({ accessToken, user });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  userAgent: z.string().optional(),
});

function signAccess(sub: string, role?: string) {
  return jwt.sign({ sub, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_SEC });
}
function signRefresh(sub: string) {
  return jwt.sign({ sub }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_SEC });
}


export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse({ ...req.body, userAgent: req.headers['user-agent'] ?? 'unknown' });
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(parsed.data.password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccess(user.id, user.role as any);
  const refreshToken = signRefresh(user.id);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash,
      userAgent: req.headers['user-agent'] ?? 'unknown',
      ip: req.ip,
      expiresAt: expiresAtDate(REFRESH_EXPIRES_SEC), 
    },
  
  });

  return res.status(201).json({ accessToken, user });
}

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

export async function refresh(req: Request, res: Response) {

  const rt = (req.cookies?.refresh_token as string) ?? req.body?.refreshToken;
  if (!rt) return res.status(400).json({ error: 'No refresh token' });

  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    const payload = jwt.verify(rt, REFRESH_SECRET) as JwtPayload & { sub: string };
    const tokenHash = crypto.createHash('sha256').update(parsed.data.refreshToken).digest('hex');

    const session = await prisma.refreshSession.findFirst({
      where: { userId: payload.sub, tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!session) return res.status(401).json({ error: 'Invalid refresh' });

    await prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date(), rotatedAt: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: 'User missing' });

    const newAccess = signAccess(user.id, user.role as any);
    const newRefresh = signRefresh(user.id);
    const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');

    await prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: newHash,
        userAgent: req.headers['user-agent'] ?? 'unknown',
        ip: req.ip,
        expiresAt: expiresAtDate(REFRESH_EXPIRES_SEC),
      },    
    });

    setRefreshCookie(res, newRefresh);
    return res.json({ accessToken: newAccess });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh' });
  }
}

export async function logout(req: Request, res: Response) {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  if (req.cookies?.refresh_token) {
    const tokenHash = crypto.createHash('sha256').update(req.cookies.refresh_token).digest('hex');
    await prisma.refreshSession.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  clearRefreshCookie(res);
  return res.json({ message: 'Logged out' });
}
