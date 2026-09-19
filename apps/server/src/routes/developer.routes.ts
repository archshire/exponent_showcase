import { Router, type IRouter } from 'express';
import { prisma } from '@repo/db';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router: IRouter = Router();
router.use(requireAuth);
router.use(async (req: AuthenticatedRequest, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { role: true, status: true } });
  if (user?.role !== 'developer' || user.status !== 'active') {
    res.status(403).json({ error: 'Developer access required.' });
    return;
  }
  next();
});
const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  search: z.string().trim().max(100).default(''),
});
router.get('/users', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid search or page.' }); return; }
  const { page, search } = parsed.data;
  const where = search ? { OR: [
    { username: { contains: search, mode: 'insensitive' as const } },
    { email: { contains: search, mode: 'insensitive' as const } },
  ] } : {};
  const [total, totalUsers, users, totals] = await Promise.all([
    prisma.user.count({ where }), prisma.user.count(),
    prisma.user.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }], skip: (page - 1) * 25, take: 25,
      select: { id: true, username: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true,
        profile: { select: { auraPoints: true, tutorialCompleted: true, lastActiveAt: true,
          cpuProgression: { select: { cpuKey: true, wins: true } } } } } }),
    prisma.playerMatchRecord.aggregate({ _sum: { durationSeconds: true }, _count: true }),
  ]);
  const groups = await prisma.playerMatchRecord.groupBy({ by: ['userId', 'mode', 'result'],
    where: { userId: { in: users.map(u => u.id) } },
    _count: true, _sum: { durationSeconds: true, correctAnswers: true, submittedAttempts: true } });
  const rows = users.map(user => {
    const records = groups.filter(g => g.userId === user.id);
    const count = (result?: string, mode?: string) => records.filter(g => (!result || g.result === result) && (!mode || g.mode === mode)).reduce((n,g) => n + g._count, 0);
    const correct = records.reduce((n,g) => n + (g._sum.correctAnswers ?? 0), 0);
    const attempts = records.reduce((n,g) => n + (g._sum.submittedAttempts ?? 0), 0);
    return { id: user.id, username: user.username, email: user.email, role: user.role, status: user.status,
      createdAt: user.createdAt, lastLoginAt: user.lastLoginAt, lastActiveAt: user.profile?.lastActiveAt ?? null,
      aura: user.profile?.auraPoints ?? 0, tutorialCompleted: user.profile?.tutorialCompleted ?? false,
      cpuWins: Object.fromEntries((user.profile?.cpuProgression ?? []).map(p => [p.cpuKey, p.wins])),
      recordedMatches: count(), pvpMatches: count(undefined,'pvp'), cpuMatches: count(undefined,'pvc'),
      wins: count('win'), losses: count('loss'), draws: count('draw'), voided: count('voided'),
      playSeconds: records.reduce((n,g) => n + (g._sum.durationSeconds ?? 0), 0),
      correctAnswers: correct, submittedAttempts: attempts, accuracy: attempts ? correct / attempts : null };
  });
  res.setHeader('Cache-Control', 'no-store');
  res.json({ rows, total, page, pageSize: 25, totalUsers, recordedParticipations: totals._count,
    totalPlaySeconds: totals._sum.durationSeconds ?? 0 });
});
export default router;
