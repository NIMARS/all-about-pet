import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as Ev from '../controllers/event.controller';

const r = Router();
r.use(auth);
r.get('/events', Ev.list);
r.post('/events', Ev.create);
r.get('/events/:id', Ev.getById);
r.put('/events/:id', Ev.update);
r.delete('/events/:id', Ev.remove);
export default r;
