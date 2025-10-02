import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { join } from 'path';
import { unlinkSync, readFileSync } from 'fs';
import crypto from 'crypto';



export async function upload(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const { pet_id } = req.params as { pet_id: string };
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const link = await prisma.petOwner.findUnique({
    where: { userId_petId: { userId, petId: pet_id } },
  });
  if (!link) return res.status(403).json({ message: 'Access denied' });

  const buf = readFileSync(file.path);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');

  const doc = await prisma.document.create({
    data: {
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      sha256: sha,
      url: `/uploads/documents/${file.filename}`,
      petId: pet_id,
      userId,
      description: req.body?.description ?? null,
      originalName: file.originalname ?? null,
    },
  });
  

  res.status(201).json(doc);
}

export async function listByPet(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const { pet_id } = req.params as { pet_id: string };

  const link = await prisma.petOwner.findUnique({
    where: { userId_petId: { userId, petId: pet_id } },
  });
  if (!link) return res.status(403).json({ message: 'Access denied' });

  const docs = await prisma.document.findMany({
    where: { petId: pet_id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(docs);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const { id } = req.params as { id: string };

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  const link = await prisma.petOwner.findUnique({
    where: { userId_petId: { userId, petId: doc.petId! } },
  });
  if (!link) return res.status(403).json({ message: 'Access denied' });

  try {
    const filePath = join(process.cwd(), 'uploads', 'documents', doc.filename);
    unlinkSync(filePath);
  } catch { /* ignore if delted -_- */ }

  await prisma.document.delete({ where: { id } });
  res.json({ message: 'Document deleted' });
}
