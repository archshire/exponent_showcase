# Developer dashboard

The normal sign-in form accepts an email address or username. Developer accounts land at
`/dashboard/developer` and can return to the game or reopen the dashboard from Home.
The API checks the database role and active account status on every request; ordinary
players receive 403, and unauthenticated requests receive 401. No passwords, password
hashes, tokens or OAuth secrets are returned by the dashboard API.

## Provisioning

Set `DEV_ACCOUNT_PASSWORD` on the backend service to the desired initial password,
then deploy the backend and client. After migrations run, startup creates `skyforge`
with a bcrypt password hash, developer role and normal player profile. The synthetic
email `skyforge@developer.invalid` is used only as the internal account identifier.
The password is not embedded in source code or a database migration.

Provisioning is create-only: existing developer passwords are never reset by startup.
If the name belongs to an ordinary player, provisioning refuses to promote that player.
After successful creation, remove the variable; the account persists in PostgreSQL.
The account can change its password through the usual game settings.

## Statistics

`player_match_records` stores one row per human and match, with a composite primary
key to prevent retry duplication. Both CPU and PvP completed/voided results record
start/end time, duration, outcome, correct answers and attempts. Historical PvP rows
are backfilled by the migration, with null answer counts rather than invented accuracy.
CPU win counts continue to use existing lifetime progression.

Recorded play time is elapsed match duration, including pauses. It excludes menu time,
ongoing matches, CPU matches abandoned without a final summary, and historical CPU
matches whose duration was never saved. This coverage is explained in the dashboard.
The overview counts player participations (two per PvP match), not unique matches.

Search is case insensitive by username/email, with 25 players per page, a refresh
button and expandable account details. All totals are read-only.
