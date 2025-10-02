import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const userOwner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: { password: passwordHash, name: 'Owner One', role: Role.owner },
    create:  { email: 'owner@example.com', password: passwordHash, name: 'Owner One', role: Role.owner },
  });

  const pet1 = await prisma.pet.upsert({
    where: { id: '00000000-0000-0000-0000-0000000000a1' },
    update: { name: 'Mia', species: 'cat', color: 'tortoiseshell' },
    create: {
      id: '00000000-0000-0000-0000-0000000000a1',
      name: 'Mia',
      species: 'cat',
      color: 'tortoiseshell',
      owners: { create: { userId: userOwner.id, role: 'owner' } },
    },
  });

  await prisma.event.upsert({
    where: { id: '00000000-0000-0000-0000-0000000000c1' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-0000000000c1',
      userId: userOwner.id,
      petId: pet1.id,
      type: 'visit',
      title: 'Vet check',
      date: new Date(),
      notes: 'seeded',
    },
  });

  const content = Buffer.from('hello world');
  const sha = crypto.createHash('sha256').update(content).digest('hex');
  await prisma.document.upsert({
    where: { sha256: sha },
    update: {},
    create: {
      petId: pet1.id,
      userId: userOwner.id,
      filename: 'hello.txt',
      mimeType: 'text/plain',
      size: content.length,
      sha256: sha,
      url: '/uploads/documents/hello.txt',
      originalName: 'hello.txt',
      description: 'seed file',
    },
  });
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
