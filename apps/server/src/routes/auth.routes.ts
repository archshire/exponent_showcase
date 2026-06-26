import { Router, IRouter } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router: IRouter = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;
