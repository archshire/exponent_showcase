import { prisma } from '@repo/db';

// Explicit maintenance command only. Never import this from application startup.
async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--execute')) throw new Error('Usage: reset-player-data.ts [--execute]');
  const execute = args.includes('--execute');
  const result = await prisma.$transaction(async tx => {
    // Block registrations and stat writes while taking the snapshot and resetting.
    await tx.$executeRawUnsafe('LOCK TABLE users, player_profiles, oauth_accounts, pvp_matches, player_match_records, player_friendships, player_cpu_progression IN ACCESS EXCLUSIVE MODE');
    const developer = await tx.user.findUnique({ where: { username: 'skyforge' } });
    if (!developer || developer.role !== 'developer' || developer.status !== 'active') {
      throw new Error('Reset cancelled: active skyforge developer account not found.');
    }
    const counts = {
      accountsToDelete: await tx.user.count({ where: { id: { not: developer.id } } }),
      matchRecordsToDelete: await tx.playerMatchRecord.count(),
      pvpMatchesToDelete: await tx.pvpMatch.count(),
      friendshipsToDelete: await tx.playerFriendship.count(),
    };
    if (!execute) return { dryRun: true, ...counts };
    await tx.playerMatchRecord.deleteMany();
    await tx.pvpMatch.deleteMany();
    await tx.playerFriendship.deleteMany();
    await tx.user.deleteMany({ where: { id: { not: developer.id } } });
    await tx.playerProfile.updateMany({ data: { auraPoints: 0 } });
    await tx.playerCpuProgression.updateMany({ data: { wins: 0 } });
    // Keep developer identity, credentials, preferences and tutorial completion.
    return { dryRun: false, ...counts, accountsRemaining: await tx.user.count() };
  }, { timeout: 60000 });
  console.log(JSON.stringify(result, null, 2));
  console.log(result.dryRun ? 'Preview only. Add --execute to perform the reset.' : 'Reset complete. Restart the game backend to clear connected sessions and live matches.');
}
main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Reset failed');
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
