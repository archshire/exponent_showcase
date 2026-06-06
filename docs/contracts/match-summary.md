# Match Summary Contract

## Purpose

Match Summary receives the final Live Match result and turns it into durable PostgreSQL updates plus the payload needed by the results page.

## Owner

Future owner: Match Summary Module in the Node.js + Express backend.

Input producer: Live Match Module.

Database owner: PostgreSQL Database Service.

## Does Not Own

Match Summary does not own active combat, answer timing, HP truth during the match, CPU decisions, Excalibur animation, or realtime question resolution.

Those are owned before the handoff by Live Match.

## Main Input

Live Match should hand off a final result shaped like `FinalMatchResult`.

Important fields:

| Field | Meaning |
| --- | --- |
| `matchId` | Match id to persist for PvP. |
| `mode` | `pvp` or `pvc`. |
| `status` | `completed` now; `voided` should be added when reconnect/quit flows are implemented. |
| `startedAtMs` | Match start timestamp. |
| `endedAtMs` | Match end timestamp. |
| `winnerCombatantId` | Winner player id when applicable. |
| `mutualFinalRoundLoss` | True when both players lose in Final round tie. |
| `combatants` | Runtime stats needed for results display and Aura calculation. |
| `cpuOpponentKey` | CPU key for PvC. |
| `pvcPlayerWon` | Whether human player beat CPU. |

## PvP Persistence

For completed PvP matches, Match Summary should:

| Write | Rule |
| --- | --- |
| `pvp_matches` row | Persist final PvP match history. |
| `player_profiles.aura_points` | Increment each player's total by runtime Aura gain. |

For voided PvP matches, Match Summary should eventually:

| Write | Rule |
| --- | --- |
| `pvp_matches.status` | Store `voided`. |
| `pvp_matches.dc_player_id` | Store disconnected/quitting player when known. |
| `pvp_matches.void_reason` | Store failed reconnect, quit, or equivalent reason. |
| Aura gain | Apply `0 AP`. |

Void support is pending in Live Match.

## PostgreSQL Handoff Contract

The Match Summary service should not directly know the final database client implementation.

Instead, it prepares a typed handoff called `MatchSummaryHandoff`.

That handoff contains:

| Field | Meaning |
| --- | --- |
| `matchId` | The match being summarized. |
| `status` | Completed now; voided later after reconnect/quit flows. |
| `persistencePlan` | The exact durable writes PostgreSQL code should perform. |
| `resultsPayload` | The result data the frontend/results flow can display. |

The PostgreSQL-facing portion is `persistencePlan`.

For PvP, `persistencePlan` gives PostgreSQL:

| Draft | Destination | Meaning |
| --- | --- | --- |
| `pvpMatch` | `pvp_matches` | Final PvP history row: match id, private/public flag, status, players, winner, D/C fields when present, start/end timestamps. |
| `auraUpdates` | `player_profiles.aura_points` | Per-player Aura increments calculated from runtime match counters. |

For PvC, `persistencePlan` gives PostgreSQL:

| Draft | Destination | Meaning |
| --- | --- | --- |
| `cpuProgressUpdate` | `player_cpu_progression` | CPU win increment and unlock-evaluation trigger when the human player wins. |

The current code shape is:

| Type / Function | Purpose |
| --- | --- |
| `buildMatchSummaryHandoff(finalResult)` | Converts Live Match output into persistence + results payloads. |
| `MatchSummaryPersistencePlan` | Describes what PostgreSQL should write. |
| `MatchSummaryRepository` | Future interface for the real PostgreSQL implementation. |
| `persistMatchSummary(handoff, repository)` | Calls the future repository methods without embedding DB client code into Match Summary logic. |

This keeps the boundary clear:

```text
Live Match -> Match Summary -> PostgreSQL repository/database layer
```

Match Summary decides what should be persisted. The future PostgreSQL repository decides how it is written.

## PvC Persistence

For completed PvC wins, Match Summary should:

| Write | Rule |
| --- | --- |
| `player_cpu_progression.wins` | Increment wins for the matching player and CPU. |
| `player_cpu_progression.unlocked_at` | Update unlock state when backend CPU unlock rules are satisfied. |

PvC full match history is not persisted for MVP.

## Results Output

Match Summary should return a result payload for the results page that includes:

| Field | Meaning |
| --- | --- |
| final outcome | Win, loss, mutual final-round loss, or void. |
| correct answers | Runtime correct answer count. |
| attempts | Runtime submitted attempts. |
| accuracy | Runtime accuracy. |
| longest streak | Runtime longest streak. |
| aura gained | Runtime Aura gain for PvP. |
| updated progression | CPU progress/unlock changes for PvC where applicable. |

## Open Items

- PostgreSQL write transaction shape is pending.
- Voided-match result fields are pending reconnect/quit implementation in Live Match.
- CPU unlock evaluation details are pending CPU progress read/query helpers.
