# Reset game accounts and stats

Run only inside the **game backend** service (`exponent_showcase`) using its
configured DATABASE_URL. This is never run by startup or migrations.

Preview:

```sh
cd /app/apps/server
pnpm exec tsx scripts/reset-player-data.ts
```

Execute the approved reset:

```sh
pnpm exec tsx scripts/reset-player-data.ts --execute
```

Deletes every account except active developer `skyforge`, all recorded matches,
friendships and associated deleted-user data. Resets remaining Aura and CPU wins.
Keeps skyforge's password, linked login, profile preferences and tutorial status.
The transaction aborts if skyforge is missing or is not an active developer.
Restart the backend after completion to clear in-memory sessions and matches;
then restart the gateway if it still holds an old backend address.
