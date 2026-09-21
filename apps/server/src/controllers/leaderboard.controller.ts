import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getLeaderboard } from '../services/leaderboard.service';

export async function getLeaderboardHandler(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const friendsOnly = req.query.friends === 'true' || req.query.friends === '1';
  const sort = req.query.sort ?? 'aura';
  if (sort !== 'aura' && sort !== 'accuracy') { res.status(400).json({ error: 'Invalid ranking order.' }); return; }
  const result = await getLeaderboard(req.user!.userId, friendsOnly, sort);
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(result);
}
