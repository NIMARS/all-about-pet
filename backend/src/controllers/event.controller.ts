import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function list(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const { status, date, pet_id } = req.query as Record<string, string | undefined>;

  const myPetIds = await prisma.petOwner.findMany({
    where: { userId },
    select: { petId: true },
  });
  const petIds = myPetIds.map(p => p.petId);

  const where: any = { petId: pet_id ? pet_id : { in: petIds } };
  if (status) where.status = status;
  if (date) where.date = new Date(date);

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: 'asc' },
    include: { pet: { select: { id: true, name: true } } },
  });

  res.json(events);
}

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  event_date: z.coerce.date().optional(),
  date: z.coerce.date().optional(),
  type: z.string().min(1),
  repeat: z.enum(['once','daily','weekly','monthly','yearly']).default('once'),
  status: z.enum(['planned','completed','skipped']).default('planned'),
  pet_id: z.string().uuid(),
  notes: z.string().optional(),
});


export async function create(req: Request, res: Response) {
  const userId = req.user?.sub!;
  
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const when = parsed.data.date ?? parsed.data.event_date!;

  const link = await prisma.petOwner.findUnique({
    where: { userId_petId: { userId, petId: parsed.data.pet_id } },
  });
  if (!link) return res.status(403).json({ message: 'Pet not linked to user' });

  const event = await prisma.event.create({
    data: {
      userId,
      petId: parsed.data.pet_id,
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      date: when,
      notes: parsed.data.notes,
      repeat: parsed.data.repeat,
      status: parsed.data.status,
    },
  });
  res.status(201).json(event);
}

export async function getById(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const ev = await prisma.event.findFirst({
    where: { id: req.params.id, userId },
  });
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  res.json(ev);
}

export async function update(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const ev = await prisma.event.findFirst({
    where: { id: req.params.id, userId },
  });
  if (!ev) return res.status(404).json({ message: 'Event not found' });

  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const updated = await prisma.event.update({
    where: { id: ev.id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      date: parsed.data.date,
      type: parsed.data.type,
      repeat: parsed.data.repeat,
      status: parsed.data.status,
    },
  });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const ev = await prisma.event.findFirst({
    where: { id: req.params.id, userId },
  });
  if (!ev) return res.status(404).json({ message: 'Event not found' });

  await prisma.event.delete({ where: { id: ev.id } });
  res.json({ message: 'Event deleted' });
}