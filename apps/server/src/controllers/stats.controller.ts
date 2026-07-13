import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getStats } from '../services/stats.service';

export async function getStatsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const stats = await getStats(req.user!.userId);
  res.status(200).json(stats);
}
