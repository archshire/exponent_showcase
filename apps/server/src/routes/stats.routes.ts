import { Router, IRouter } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getStatsHandler } from '../controllers/stats.controller';

const router: IRouter = Router();

router.use(requireAuth);
router.get('/', getStatsHandler);

export default router;
