import { Router } from 'express';
import * as Auth from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const r = Router();

r.post('/register', Auth.register);
r.post('/login', Auth.login);
r.post('/refresh', Auth.refresh);
r.post('/logout', Auth.logout);
r.get('/profile', auth, Auth.me);

export default r;

