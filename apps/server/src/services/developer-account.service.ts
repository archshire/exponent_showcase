import bcrypt from 'bcrypt';
import { prisma } from '@repo/db';
import { CPU_OPPONENT_KEYS } from '../config/cpu-opponents.config';

/** Provision once from a server secret; never promote an existing player by name. */
export async function ensureDeveloperAccount(password: string | undefined): Promise<void> {
  if (!password) return;
  const existing = await prisma.user.findUnique({ where: { username: 'skyforge' } });
  if (existing) {
    if (existing.role !== 'developer') throw new Error('Developer username already belongs to a player; refusing to promote it.');
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username: 'skyforge' }, update: {},
    create: {
      username: 'skyforge', email: 'skyforge@developer.invalid', passwordHash, role: 'developer',
      profile: { create: { cpuProgression: { create: CPU_OPPONENT_KEYS.map(cpuKey => ({ cpuKey })) } } },
    },
  });
}
