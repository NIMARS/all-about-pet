import multer from 'multer';
import { extname, parse } from 'path';
import { mkdirSync } from 'fs';
import path from 'path';

const uploadRoot = path.join(process.cwd(), 'uploads', 'documents');
mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const petId = (req.params as any).pet_id || 'unknown';
    const ext = extname(file.originalname);
    const base = parse(file.originalname).name.replace(/[^\w.-]+/g, '_').slice(0, 80);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${petId}-${unique}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});
