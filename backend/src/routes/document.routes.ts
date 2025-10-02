import { Router } from 'express';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import * as Doc from '../controllers/document.controller';

const r = Router();
r.use(auth);
r.post('/documents/:pet_id', upload.single('file'), Doc.upload);
r.get('/documents/:pet_id', Doc.listByPet);
r.delete('/documents/:id', Doc.remove);
export default r;
