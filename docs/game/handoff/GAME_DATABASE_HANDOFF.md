# Game Database Handoff

## Purpose

This document gives the database teammate a recommended SQL-first persistence contract for the game MVP.

It explains:

- what game data should persist.
- recommended table names.
- recommended column naming.
- recommended SQL data types.
- required versus nullable fields.
- relationships between tables.
- index recommendations.
- where `JSONB` is useful.
- how ORM and migration choices should be handled.
- why each major choice exists.

This is a handoff guide, not a final migration file. Exact SQL syntax, ORM models, migrations, and deployment commands remain implementation decisions.

## Design Principles

| Principle | Recommendation | Why |
| --- | --- | --- |
| Central match truth | Save each match once under a central `match_id`. | Prevents match history from being duplicated differently under each player. |
| Lightweight player references | Player profiles should point to match records instead of storing full match data. | Keeps profile data fast and clean while preserving full match traceability. |
| Runtime is not persistence | Do not save the full live game state as the database schema. | Active combat state contains timers, statuses, animations, and temporary flags that are not all long-term records. |
| Question logs are match-scoped | Persist question logs under `match_id`. | Supports future sensemaking, replay/debugging, stat audit, analytics, and possible anti-cheat review without cluttering profiles. |
| Economy is auditable | Use a coin ledger rather than only mutating balances. | The team can later explain why coins increased or decreased. |
| SQL first, ORM second | Define the schema meaning before choosing Prisma, Drizzle, TypeORM, or raw SQL. | Prevents tooling from shaping the game model prematurely. |

## Recommended Tables

| Table | Stores | Why |
| --- | --- | --- |
| `players` | Stable player identity. | Separates identity from stats, coins, unlocks, and match history. |
| `player_profiles` | Player progression, stats, selected identity items, and coin balance. | Gives fast access to profile/stat screens without recomputing every match. |
| `player_unlocks` | Unlocked CPU opponents, badges, avatars, profile pictures, mascots, and future identity items. | Supports coin-based identity and CPU progression gates. |
| `coin_ledger` | Coin gains and spends. | Creates an audit trail for match rewards, name changes, and unlock purchases. |
| `match_records` | Central match outcome and summary stats. | Source of truth for results, rewards, D/C accountability, and match history. |
| `match_question_logs` | Question-round evidence under a match. | Preserves question asked, correctness, timing, question winner, and winning timing. |
| `player_match_refs` | Lightweight player-to-match references. | Lets each profile show match history without duplicating match records. |
| `player_activity_events` | Internal player-linked engagement events. | Captures what players do for future sense-making without making every activity a public profile stat. |
| `player_engagement_metrics` | Internal summarized engagement data by player. | Gives the team a quick read on retention, mode usage, friction, and feature engagement. |
| `leaderboard_view` | Derived leaderboard rows from player/profile aggregates. | Supports top-20 display, pagination up to top 100, and player rank without duplicating match records. |
| `friend_requests` | Pending, accepted, declined, cancelled, and dismissed friend requests. | Supports the clarified friend request lifecycle. |
| `friendships` | Accepted player friendships. | Supports friend lists, online status display, and private invites. |
| `room_events` | Optional future lobby/room audit events. | Useful later for debugging room behavior, but not required as core MVP persistence. |

## Naming Convention

Use `snake_case` for database tables and columns.

Recommended examples:

```text
player_id
match_id
created_at
updated_at
started_at
ended_at
display_name
hidden_number_id
coin_balance
match_status
match_mode
```

Why:

- SQL conventions commonly use `snake_case`.
- TypeScript can map these to `camelCase` later.
- Explicit names are easier for teammates to understand than vague names like `data`, `info`, or `stats`.

## Recommended SQL Types

| Type | Use For | Why |
| --- | --- | --- |
| `TEXT` | IDs, names, labels, enum-like values. | Flexible and simple for UUIDs, generated IDs, and status labels. |
| `INTEGER` | coins, counts, HP, streaks, timings in milliseconds. | These values are whole numbers. |
| `BOOLEAN` | yes/no flags. | Clear for state flags such as `stats_valid`. |
| `TIMESTAMP` | creation, update, match start, match end times. | Supports history, ordering, and audit. |
| `JSONB` | structured per-player maps and flexible match details. | Useful when keys are player IDs or when structure is nested but still queryable. |

Use real columns for fields that are frequently filtered, joined, or indexed.

Use `JSONB` for grouped structured values that belong to one record.

## JSONB Guidance

`JSONB` is recommended for per-player maps such as:

```text
display_names_at_match_time
round_wins_by_player
final_hp_by_player
correct_answers_by_player
total_questions_by_player
accuracy_by_player
reward_by_player
reward_breakdown_by_player
correct_answer_time_ms_by_player
```

Why:

- These fields are naturally keyed by `player_id`.
- They belong to one match or question log.
- Making separate columns for `player_1` and `player_2` would be brittle.

Avoid `JSONB` for core searchable fields:

```text
player_id
match_id
display_name
hidden_number_id
coin_balance
dc_count
created_at
match_status
```

Why:

- These fields are searched, joined, sorted, or indexed directly.
- They should remain first-class columns.

## Required Versus Nullable Fields

Make a field `NOT NULL` when the record cannot make sense without it.

Examples:

```text
players.player_id
players.hidden_number_id
players.display_name
player_profiles.player_id
match_records.match_id
match_records.match_mode
match_records.match_status
match_records.started_at
```

Allow `NULL` when the value depends on mode or outcome.

Examples:

```text
match_records.winner_id
match_records.loser_id
match_records.cpu_opponent_id
match_records.cpu_opponent_name
match_records.ended_at
match_records.duration_seconds
match_question_logs.question_winner_player_id
match_question_logs.winning_time_ms
```

Why:

- Mutual final-round loss may have no winner.
- PvP matches have no CPU opponent.
- A voided match may not have full completion data.
- Same-time, shock, blocked, or no-winner question outcomes may not have a normal question winner.

## Recommended Relationships

| Relationship | Why |
| --- | --- |
| `player_profiles.player_id` -> `players.player_id` | One profile belongs to one player. |
| `player_unlocks.player_id` -> `players.player_id` | Unlocks belong to a player. |
| `coin_ledger.player_id` -> `players.player_id` | Coin changes must be attributable. |
| `coin_ledger.related_match_id` -> `match_records.match_id` | Match rewards should trace back to a match when relevant. |
| `match_question_logs.match_id` -> `match_records.match_id` | Question logs are child details of a central match. |
| `player_match_refs.match_id` -> `match_records.match_id` | Player history points to the central match truth. |
| `player_match_refs.player_id` -> `players.player_id` | Each player has their own lightweight reference to the match. |
| `player_activity_events.player_id` -> `players.player_id` | Engagement activity belongs to a player. |
| `player_activity_events.match_id` -> `match_records.match_id` | Match-related activity can trace back to central match truth when relevant. |
| `player_engagement_metrics.player_id` -> `players.player_id` | Internal engagement summaries belong to a player. |
| `friend_requests.sender_id` -> `players.player_id` | Friend request sender must be a player. |
| `friend_requests.receiver_id` -> `players.player_id` | Friend request receiver must be a player. |
| `friendships.player_a_id` -> `players.player_id` | Friendship side A must be a player. |
| `friendships.player_b_id` -> `players.player_id` | Friendship side B must be a player. |

## Table Sketches

### `players`

Recommended columns:

```text
player_id TEXT PRIMARY KEY
hidden_number_id INTEGER NOT NULL UNIQUE
display_name TEXT NOT NULL
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
```

Why:

- `player_id` is the internal stable identifier.
- `hidden_number_id` keeps identity unique even when display names duplicate.
- `display_name` is player-facing and may be changed with coins.

### `player_profiles`

Recommended columns:

```text
player_id TEXT PRIMARY KEY
coin_balance INTEGER NOT NULL DEFAULT 0
selected_badge_id TEXT NULL
selected_avatar_id TEXT NULL
name_change_count INTEGER NOT NULL DEFAULT 0
total_matches_played INTEGER NOT NULL DEFAULT 0
wins INTEGER NOT NULL DEFAULT 0
losses INTEGER NOT NULL DEFAULT 0
dc_count INTEGER NOT NULL DEFAULT 0
total_correct_answers INTEGER NOT NULL DEFAULT 0
total_questions_answered INTEGER NOT NULL DEFAULT 0
pvp_matches_played INTEGER NOT NULL DEFAULT 0
pvp_decisive_matches INTEGER NOT NULL DEFAULT 0
pvp_wins INTEGER NOT NULL DEFAULT 0
pvp_losses INTEGER NOT NULL DEFAULT 0
pvp_correct_answers INTEGER NOT NULL DEFAULT 0
pvp_questions_answered INTEGER NOT NULL DEFAULT 0
pvp_current_win_streak INTEGER NOT NULL DEFAULT 0
longest_streak INTEGER NOT NULL DEFAULT 0
longest_streak_match_id TEXT NULL
current_win_streak INTEGER NOT NULL DEFAULT 0
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
```

Why:

- Supports Stats page and public profile summaries.
- Keeps aggregate values fast to read.
- Exact match evidence remains in `match_records` and `match_question_logs`.
- `name_change_count` supports repeatable name-change pricing: first change costs `100` coins, subsequent changes cost `1000` coins.
- PvP leaderboard can derive win rate, accuracy, and current win streak from PvP-specific aggregate fields.
- `pvp_matches_played` is the leaderboard eligibility count for valid completed PvP matches.
- `pvp_decisive_matches` is the win-rate denominator for valid PvP matches that produce a win or loss.

### `leaderboard_view`

Recommended treatment:

```text
leaderboard_view or query, not canonical source of truth
```

Recommended output fields:

```text
rank INTEGER
player_id TEXT
display_name TEXT
hidden_number_id INTEGER
selected_badge_id TEXT NULL
win_rate NUMERIC
accuracy NUMERIC
current_win_streak INTEGER
pvp_matches_played INTEGER
pvp_decisive_matches INTEGER
```

Recommended ranking order:

```text
ORDER BY win_rate DESC, accuracy DESC, current_win_streak DESC
```

Recommended calculations:

```text
win_rate = pvp_wins / pvp_decisive_matches * 100
accuracy = pvp_correct_answers / pvp_questions_answered * 100
```

Why:

- MVP leaderboard ranks should come from PvP profile aggregates rather than duplicated match data.
- The player-facing leaderboard needs rank, win rate, accuracy, and current win streak.
- Displaying a short identity tag through `hidden_number_id` helps distinguish duplicate display names.
- Top `20` and page-down-to-`100` can be implemented as paginated queries over this view.

Notes:

- Only PvP matches count for the MVP leaderboard.
- PvC/Duel CPU leaderboard should be a future separate leaderboard.
- Players should complete at least `10` valid PvP matches before appearing on the leaderboard.
- `pvp_matches_played` controls the `10`-match eligibility rule.
- `pvp_decisive_matches` controls the win-rate denominator.
- If `pvp_decisive_matches` or `pvp_questions_answered` is `0`, use a safe fallback such as `0` or exclude the player until they have enough valid PvP data.
- Voided matches should not improve leaderboard performance stats.
- Mutual final-round loss may count toward PvP completion/eligibility if valid, but should not change leaderboard win/loss rate because it is not a win or loss.
- The database teammate may implement this as a SQL view, materialized view, cached query, or application query depending on performance needs.

### `match_records`

Recommended columns:

```text
match_id TEXT PRIMARY KEY
match_mode TEXT NOT NULL
match_type TEXT NOT NULL
match_status TEXT NOT NULL
void_reason TEXT NOT NULL DEFAULT 'none'
player_ids JSONB NOT NULL
display_names_at_match_time JSONB NOT NULL
cpu_opponent_id TEXT NULL
cpu_opponent_name TEXT NULL
winner_id TEXT NULL
loser_id TEXT NULL
rounds_played INTEGER NOT NULL DEFAULT 0
round_wins_by_player JSONB NOT NULL
final_hp_by_player JSONB NOT NULL
final_round_score TEXT NULL
correct_answers_by_player JSONB NOT NULL
total_questions_by_player JSONB NOT NULL
accuracy_by_player JSONB NOT NULL
longest_streak_by_player JSONB NOT NULL
player_type_by_player JSONB NOT NULL
reward_by_player JSONB NOT NULL
reward_breakdown_by_player JSONB NOT NULL
coins_awarded_by_player JSONB NOT NULL
stats_valid BOOLEAN NOT NULL
dc_or_quit_by_player JSONB NOT NULL
quit_press_count_by_player JSONB NOT NULL
disconnect_event_type TEXT NOT NULL DEFAULT 'none'
started_at TIMESTAMP NOT NULL
ended_at TIMESTAMP NULL
duration_seconds INTEGER NULL
created_at TIMESTAMP NOT NULL
```

Why:

- One central record can reconstruct post-match results.
- JSONB per-player maps avoid duplicating columns for each side.
- `stats_valid` separates outcome/accountability from performance-stat validity.

### `match_question_logs`

Recommended columns:

```text
log_id TEXT PRIMARY KEY
match_id TEXT NOT NULL
fight_round_number INTEGER NOT NULL
question_round_number INTEGER NOT NULL
question_id TEXT NOT NULL
question_text TEXT NOT NULL
correct_answer TEXT NOT NULL
question_mode TEXT NOT NULL
correct_player_ids JSONB NOT NULL
correct_answer_time_ms_by_player JSONB NOT NULL
question_winner_player_id TEXT NULL
winning_time_ms INTEGER NULL
outcome TEXT NOT NULL
created_at TIMESTAMP NOT NULL
```

Why:

- Stores evidence for what happened inside the match.
- Supports future sensemaking without polluting player profiles.
- `correct_answer` is `TEXT` so arithmetic and reaction-sequence answers can both fit.
- `question_winner_player_id` is nullable because some outcomes may be same-time, shock, blocked, or no-winner.

### `coin_ledger`

Recommended columns:

```text
entry_id TEXT PRIMARY KEY
player_id TEXT NOT NULL
amount INTEGER NOT NULL
reason TEXT NOT NULL
related_match_id TEXT NULL
created_at TIMESTAMP NOT NULL
```

Why:

- Coin balance can be audited.
- Match rewards, name changes, and unlock purchases remain explainable.
- Name changes should create a ledger entry with reason such as `name_change`.
- CPU opponent unlocks should create a ledger entry with reason such as `unlock_purchase`.

### `player_unlocks`

Recommended columns:

```text
player_id TEXT NOT NULL
unlock_type TEXT NOT NULL
unlock_id TEXT NOT NULL
unlocked_at TIMESTAMP NOT NULL
```

Recommended unique key:

```text
player_id + unlock_type + unlock_id
```

Why:

- Prevents duplicate unlock records.
- Supports CPU opponents, badges, avatars, profile pictures, mascots, and future identity items.
- CPU opponent unlocks are one-time purchases; an existing row such as `player_id + cpu_opponent + fury` means that opponent is already unlocked.
- Repeatable purchases such as name changes should not be stored here as finite unlocks; they should update `players.display_name`, increment `player_profiles.name_change_count`, and write to `coin_ledger`.

## Version 1 Shop Persistence Rules

Current Version 1 shop offerings:

| Item | Persistence Rule | Coin Rule | Why |
| --- | --- | --- | --- |
| `Change Duelist Name` | Repeatable purchase. Update `players.display_name`, increment `player_profiles.name_change_count`, and write a `coin_ledger` entry. | First change costs `100` coins; subsequent changes cost `1000` coins each. | Name changing is identity customization, not a finite unlock. |
| `Fury` unlock | One-time `player_unlocks` row. | Costs `500` coins and requires prior criteria. | CPU unlock progression should persist as owned access. |
| `Shi-eld` unlock | One-time `player_unlocks` row. | Costs `1000` coins and requires prior criteria. | CPU unlock progression should persist as owned access. |
| `Peasy` unlock | One-time `player_unlocks` row. | Costs `1500` coins and requires prior criteria. | CPU unlock progression should persist as owned access. |
| `Skore` unlock | One-time `player_unlocks` row. | Costs `3000` coins and requires prior criteria. | CPU unlock progression should persist as owned access. |

Gameplay-affecting match modifiers are not part of the current Version 1 shop.

### `player_match_refs`

Recommended columns:

```text
player_id TEXT NOT NULL
match_id TEXT NOT NULL
played_at TIMESTAMP NOT NULL
result TEXT NOT NULL
```

Recommended unique key:

```text
player_id + match_id
```

Why:

- Lets a player profile list match history quickly.
- Keeps full match truth in `match_records`.

### `player_activity_events`

Recommended columns:

```text
event_id TEXT PRIMARY KEY
player_id TEXT NOT NULL
event_type TEXT NOT NULL
session_id TEXT NULL
match_id TEXT NULL
room_id TEXT NULL
metadata JSONB NOT NULL DEFAULT '{}'
occurred_at TIMESTAMP NOT NULL
```

Why:

- Preserves raw player activity for future sense-making.
- Supports analytics without turning internal behavior into player-facing stats.
- `metadata` can hold event-specific details such as CPU opponent, page name, item purchased, quit press count, or error message.
- `match_id` is nullable because some events happen outside a match.

Recommended event examples:

```text
tutorial_started
tutorial_completed
cpu_match_started
cpu_match_completed
pvp_match_started
pvp_match_completed
shop_opened
item_purchased
room_created
room_joined
quick_match_started
quick_match_cancelled
spectator_view_started
rematch_requested
rematch_accepted
match_quit_pressed
match_disconnected
```

### `player_engagement_metrics`

Recommended columns:

```text
player_id TEXT PRIMARY KEY
first_played_at TIMESTAMP NULL
last_played_at TIMESTAMP NULL
total_sessions INTEGER NOT NULL DEFAULT 0
total_play_time_seconds INTEGER NOT NULL DEFAULT 0
tutorial_completed BOOLEAN NOT NULL DEFAULT false
tutorial_retries INTEGER NOT NULL DEFAULT 0
pvc_matches_started INTEGER NOT NULL DEFAULT 0
pvc_matches_completed INTEGER NOT NULL DEFAULT 0
pvp_matches_started INTEGER NOT NULL DEFAULT 0
pvp_matches_completed INTEGER NOT NULL DEFAULT 0
shop_visits INTEGER NOT NULL DEFAULT 0
name_changes_purchased INTEGER NOT NULL DEFAULT 0
cpu_unlocks_purchased INTEGER NOT NULL DEFAULT 0
rooms_created INTEGER NOT NULL DEFAULT 0
rooms_joined INTEGER NOT NULL DEFAULT 0
spectator_views INTEGER NOT NULL DEFAULT 0
rematch_requests_sent INTEGER NOT NULL DEFAULT 0
rematch_requests_accepted INTEGER NOT NULL DEFAULT 0
event_counts_by_type JSONB NOT NULL DEFAULT '{}'
mode_counts JSONB NOT NULL DEFAULT '{}'
cpu_opponent_attempts JSONB NOT NULL DEFAULT '{}'
cpu_opponent_wins JSONB NOT NULL DEFAULT '{}'
updated_at TIMESTAMP NOT NULL
```

Why:

- Gives the team fast internal signals about engagement without querying all raw events every time.
- Keeps public stats separate from internal product analytics.
- JSONB maps are useful for expandable counters such as per-event counts and per-CPU attempts.
- This table should not be exposed directly to players.

### `friend_requests`

Recommended columns:

```text
request_id TEXT PRIMARY KEY
sender_id TEXT NOT NULL
receiver_id TEXT NOT NULL
status TEXT NOT NULL
created_at TIMESTAMP NOT NULL
responded_at TIMESTAMP NULL
```

Why:

- Supports pending, accepted, declined, cancelled, and dismissed request states.

### `friendships`

Recommended columns:

```text
player_a_id TEXT NOT NULL
player_b_id TEXT NOT NULL
created_at TIMESTAMP NOT NULL
```

Recommended unique key:

```text
player_a_id + player_b_id
```

Why:

- Stores accepted friendships separately from requests.
- Implementation should normalize ordering so the same friendship is not saved twice in reverse order.

## Index Recommendations

Recommended starting indexes:

```text
players(hidden_number_id)
player_profiles(player_id)
player_profiles(wins, total_matches_played)
player_profiles(total_correct_answers, total_questions_answered)
player_profiles(current_win_streak)
player_profiles(pvp_wins, pvp_decisive_matches)
player_profiles(pvp_correct_answers, pvp_questions_answered)
player_profiles(pvp_current_win_streak)
match_records(started_at)
match_records(match_mode, match_status)
match_question_logs(match_id)
match_question_logs(match_id, fight_round_number, question_round_number)
player_match_refs(player_id, played_at)
coin_ledger(player_id, created_at)
player_activity_events(player_id, occurred_at)
player_activity_events(event_type, occurred_at)
player_activity_events(match_id)
player_engagement_metrics(player_id)
friend_requests(receiver_id, status)
friend_requests(sender_id, status)
friendships(player_a_id)
friendships(player_b_id)
```

Why:

- Profiles need fast lookup by player.
- Leaderboard queries need fast access to win-rate, accuracy, and current-win-streak source fields.
- Match history needs fast lookup by player and date.
- Question logs need fast lookup by match.
- Engagement events need fast lookup by player, event type, and match when investigating behavior.
- Friend requests need fast lookup by receiver and sender.
- Public profile and pre-match views should avoid scanning full tables.

## ORM Guidance

Do not lock the ORM inside the constitution unless the team has already chosen one.

Acceptable paths:

- raw SQL migrations.
- Prisma.
- Drizzle.
- TypeORM.

Recommended order:

1. Agree on schema meaning.
2. Write SQL-first table/migration recommendations.
3. Let the database teammate translate into the chosen ORM.
4. Keep TypeScript domain types separate from ORM/database models.

Why:

- The game constitution defines meaning.
- The ORM defines implementation mechanics.
- Keeping those separate prevents tool syntax from rewriting game intent.

## Migration Structure

Recommended folder:

```text
packages/db/
├── migrations/
│   ├── 001_create_players.sql
│   ├── 002_create_matches.sql
│   ├── 003_create_match_question_logs.sql
│   ├── 004_create_economy_tables.sql
│   └── 005_create_social_tables.sql
└── README.md
```

Recommended migration order:

1. Create player identity and profile tables.
2. Create match records.
3. Create match question logs.
4. Create economy tables.
5. Create social/friend tables.

Why:

- Profiles depend on players.
- Question logs depend on matches.
- Coin ledger may reference matches.
- Friend systems depend on players.

## Boundary Notes

The database should store durable outcomes and audit evidence.

The database should not own:

- live combat rules.
- Excalibur animation state.
- active power-bar movement.
- temporary stun or `MISSED!` timers, except as part of question log evidence if needed.
- live room allocation logic.

Those belong to the runtime game domain, Excalibur presentation layer, or server layer.

## Handoff Summary

Recommended database teammate task:

Build a SQL-backed persistence layer that supports:

- player identity.
- player profiles and stats.
- central match records.
- match-scoped question logs.
- coin ledger and unlocks.
- friend requests and friendships.
- lightweight player match references.

The highest-priority tables are:

1. `players`
2. `player_profiles`
3. `match_records`
4. `match_question_logs`
5. `coin_ledger`
6. `player_match_refs`

Social and optional audit tables can follow after the core game persistence is stable.
