import { Router, IRouter } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router: IRouter = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);

export default router;
