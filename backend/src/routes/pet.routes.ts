import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as Pet from '../controllers/pet.controller';

const r = Router();
r.use(auth);
r.get('/', Pet.list);
r.post('/', Pet.create);
r.get('/:id', Pet.getById);
r.put('/:id', Pet.update);
r.delete('/:id', Pet.remove);
export default r;