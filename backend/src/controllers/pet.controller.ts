import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function list(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const links = await prisma.petOwner.findMany({
    where: { userId },
    include: { pet: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(links.map(l => l.pet));
}

const petCreateSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  birthday: z.coerce.date().optional(),
  bio: z.string().optional(),
  color: z.string().optional(),
  birthplace: z.string().optional(),
  location: z.string().optional(),
  photo_url: z.string().url().optional(), 
  privacy: z.string().optional(),
});

export async function create(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const parsed = petCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const pet = await prisma.pet.create({
    data: {
      name: parsed.data.name,
      species: parsed.data.species,
      breed: parsed.data.breed,
      birthDate: parsed.data.birthday,
      bio: parsed.data.bio,
      color : parsed.data.color,
      birthplace : parsed.data.birthplace,
      location : parsed.data.location,
      photoUrl : parsed.data.photo_url,
      privacy : parsed.data.privacy,
      owners: {
        create: { userId, role: 'owner' },
      },
    },
  });

  res.status(201).json(pet);
}

export async function getById(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const pet = await prisma.pet.findFirst({
    where: { id: req.params.id, owners: { some: { userId } } },
  });
  if (!pet) return res.status(404).json({ message: 'Not found or access denied' });
  res.json(pet);
}

export async function update(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const exists = await prisma.pet.findFirst({
    where: { id: req.params.id, owners: { some: { userId } } },
  });
  if (!exists) return res.status(404).json({ message: 'Not found or access denied' });

  const parsed = petCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const pet = await prisma.pet.update({
    where: { id: req.params.id },
    data: {
      name: parsed.data.name,
      species: parsed.data.species,
      breed: parsed.data.breed,
      birthDate: parsed.data.birthday,
      bio: parsed.data.bio,
    },
  });

  res.json(pet);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user?.sub!;
  const pet = await prisma.pet.findUnique({ where: { id: req.params.id } });
  if (!pet) return res.status(404).json({ message: 'Pet not found' });

  // admin может удалить любой; иначе — только привязанный
  if ((req.user?.role ?? 'owner') !== 'admin') {
    const link = await prisma.petOwner.findUnique({
      where: { userId_petId: { userId, petId: pet.id } },
    });
    if (!link) return res.status(403).json({ message: 'Access denied to this pet' });
  }

  await prisma.pet.delete({ where: { id: pet.id } });
  res.json({ message: 'Pet deleted successfully' });
}
