import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  acceptRequest,
  declineRequest,
  listFriends,
  listIncomingRequests,
  removeFriend,
  searchPlayers,
  sendRequest,
  isServiceError,
} from '../services/friends.service';

export async function getFriends(req: AuthenticatedRequest, res: Response): Promise<void> {
  const friends = await listFriends(req.user!.userId);
  res.status(200).json({ friends });
}

export async function getRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
  const requests = await listIncomingRequests(req.user!.userId);
  res.status(200).json({ requests });
}

export async function search(req: AuthenticatedRequest, res: Response): Promise<void> {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const results = await searchPlayers(req.user!.userId, q);
  res.status(200).json({ results });
}

const sendSchema = z.object({ targetId: z.string().min(1, 'A target player is required.') });

export async function createRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  const result = await sendRequest(req.user!.userId, parsed.data.targetId);
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(201).json({ status: result.status });
}

export async function accept(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await acceptRequest(req.user!.userId, String(req.params.requesterId ?? ''));
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ message: 'Friend request accepted.' });
}

export async function decline(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await declineRequest(req.user!.userId, String(req.params.requesterId ?? ''));
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ message: 'Friend request declined.' });
}

export async function remove(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await removeFriend(req.user!.userId, String(req.params.otherId ?? ''));
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ message: 'Friend removed.' });
}
