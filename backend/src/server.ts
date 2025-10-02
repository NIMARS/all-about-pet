import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './lib/prisma';

import authRoutes from './routes/auth.routes';
import petRoutes from './routes/pet.routes';
import eventRoutes from './routes/event.routes';
import documentRoutes from './routes/document.routes';
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.send('OK');
});
app.get('/', (_req, res) => res.send('🚀 API is alive'));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api', eventRoutes);
app.use('/api', documentRoutes);



app.use('/uploads/documents', express.static(path.join(__dirname, '..', 'uploads', 'documents')));

const PORT = Number(process.env.PORT ?? 5000);
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
