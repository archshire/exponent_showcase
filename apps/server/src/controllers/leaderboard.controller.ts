import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getLeaderboard } from '../services/leaderboard.service';

export async function getLeaderboardHandler(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const friendsOnly = req.query.friends === 'true' || req.query.friends === '1';
  const result = await getLeaderboard(req.user!.userId, friendsOnly);
  res.status(200).json(result);
}
