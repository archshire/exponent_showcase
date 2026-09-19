// Run against a disposable migrated database, never production.
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import { prisma } from '@repo/db';
import { ensureDeveloperAccount } from '../src/services/developer-account.service';
import { loginUser, registerUser } from '../src/services/auth.service';
import developerRoutes from '../src/routes/developer.routes';
import { buildMatchSummaryHandoff, persistMatchSummary } from '../src/services/match-summary.service';

async function main() {
  assert.equal(process.env.NODE_ENV, 'test', 'Use a disposable test database');
  const password = 'Developer_test_123';
  await ensureDeveloperAccount(password);
  await ensureDeveloperAccount('Must_not_reset_password');
  const login = await loginUser({ email: 'skyforge', password });
  assert.ok('token' in login);
  assert.ok('error' in await loginUser({ email: 'skyforge', password: 'wrong' }));
  const player = await registerUser({ username: 'observer_test', email: 'observer@example.test', password });
  assert.ok('token' in player);
  const normal = await prisma.user.findUniqueOrThrow({ where: { username: 'observer_test' } });
  assert.equal(normal.role, 'player');
  const final: any = {
    matchId: 'record-test', roomId: 'record-room', mode: 'pvc', status: 'completed',
    startedAtMs: 1000, endedAtMs: 126000, winnerSlot: 'p2', winnerCombatantId: 'cpu:min',
    mutualFinalRoundLoss: false, roundWins: { p1: 0, p2: 2 }, tiedRoundCount: 0,
    cpuOpponentKey: 'min', pvcPlayerWon: false,
    combatants: {
      p1: { slot: 'p1', combatantId: normal.id, driver: 'human', hp: 0, correctAnswers: 3, submittedAttempts: 4, accuracy: .75, longestStreak: 2, auraGain: 0 },
      p2: { slot: 'p2', combatantId: 'cpu:min', driver: 'cpu', hp: 50, correctAnswers: 5, submittedAttempts: 5, accuracy: 1, longestStreak: 5, auraGain: 0 },
    },
  };
  const handoff = buildMatchSummaryHandoff(final);
  await persistMatchSummary(handoff);
  await persistMatchSummary(handoff);
  assert.equal(await prisma.playerMatchRecord.count(), 1, 'Retry duplicates play time');
  const app = express(); app.use(cookieParser()); app.use('/developer', developerRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  const url = `http://127.0.0.1:${address.port}/developer/users`;
  try {
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await fetch(url, { headers: { cookie: `token=${player.token}` } })).status, 403);
    const headers = { cookie: `token=${login.token}` };
    const response = await fetch(url + '?search=OBSERVER', { headers });
    assert.equal(response.status, 200);
    const data: any = await response.json();
    assert.equal(data.total, 1); assert.equal(data.rows[0].playSeconds, 125);
    assert.equal(data.rows[0].accuracy, .75); assert.equal(data.rows[0].losses, 1);
    assert.equal(data.rows[0].cpuMatches, 1);
    assert.ok(!JSON.stringify(data).includes('passwordHash'));
    assert.equal((await fetch(url + '?page=-1', { headers })).status, 400);
    const empty: any = await (await fetch(url + '?search=nobody', { headers })).json();
    assert.equal(empty.total, 0);
    await prisma.user.update({where:{username:'skyforge'}, data:{role:'player'}});
    assert.equal((await fetch(url, {headers})).status, 403, 'Role changes must take effect immediately');
    await assert.rejects(ensureDeveloperAccount(password), /refusing to promote/);
    await prisma.user.update({where:{username:'skyforge'},data:{role:'developer'}});
    console.log('PASS developer provisioning, username login, authorization, search, duration, accuracy and retry deduplication.');
  } finally { server.close(); await prisma.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
