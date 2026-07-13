import { Router, IRouter } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getLeaderboardHandler } from '../controllers/leaderboard.controller';

const router: IRouter = Router();

router.use(requireAuth);
router.get('/', getLeaderboardHandler);

export default router;
