# Live Match Contract

## Purpose

Live Match owns active match truth while a PvP or PvC match is running.

It creates one in-memory runtime session per active match. It receives player/CPU actions, validates timing and legality, applies combat rules, and produces authoritative events for the frontend.

## Owner

Primary owner: `apps/server/src/services/live-match.service.ts`

The service currently returns `LiveMatchEvent[]`. Future Socket.IO handlers should emit those events to connected clients.

## Does Not Own

Live Match does not own:

- page rendering.
- Excalibur animation details.
- database persistence after final result.
- long-term stats or leaderboard queries.
- pre-match queueing and room assignment before `createLiveMatchSession`.

## Participants

| Participant | Role |
| --- | --- |
| Matchmaking Module | Creates/assigns rooms, then hands off to Live Match. |
| Live Match Module | Owns active runtime state and combat truth. |
| Question Generator | Provides prompt truth when Live Match asks. |
| CPU Opponent | Provides CPU behavior decisions when Live Match asks. |
| Socket.IO/WebSocket layer | Future transport layer that will carry actions/events. |
| Active Match Host / Excalibur | Displays authoritative state and sends local player actions. |
| Match Summary Module | Receives final result for persistence and results display. |

## Matchmaking To Live Match

Expected handoff:

| Field | Meaning |
| --- | --- |
| `matchId` | Unique match id. |
| `roomId` | Backend-managed room id. |
| `mode` | `pvp` or `pvc`. |
| `p1CombatantId` | Player 1 id. |
| `p2CombatantId` | Player 2 id for PvP. |
| `cpuOpponentKey` | CPU key for PvC. |
| `nowMs` | Optional server timestamp for deterministic tests. |

Current service entrypoint: `createLiveMatchSession(options)`.

## Browser / Transport To Live Match

Future Socket.IO handlers should translate realtime actions into these service calls.

| Realtime Action | Service Call | Purpose |
| --- | --- | --- |
| `answer.submit` | `submitAnswer(matchId, combatantSlot, submittedAnswer, options)` | Submit an answer for the active question. |
| `defend.activate` | `activateDefend(matchId, combatantSlot, options)` | Try to open the 1-second DEFEND window. |
| match quit / disconnect | Pending service work. | Pause/reconnect/void behavior is not implemented yet. |
| rematch request/respond | Pending service work. | Rematch flow is not implemented yet. |

## Live Match Events

The current service can return these authoritative events:

| Event | Meaning |
| --- | --- |
| `match.started` | Runtime match session was created. |
| `round.prep.started` | Round prep began and question type/difficulty were selected. |
| `question.constructing` | Prompt construction can be shown. |
| `question.started` | 6-second answer timer begins. |
| `answer.accepted` | Answer was eligible and processed. |
| `answer.rejected` | Answer was illegal, late, duplicate, or invalid for phase. |
| `defend.activated` | DEFEND active window started. |
| `defend.blocked` | DEFEND absorbed incoming damage. |
| `missed` | Wrong answer caused `MISSED!` lockout. |
| `stun.applied` | Successful DEFEND stunned attacker. |
| `draw.triggered` | Two correct answers landed within the same-time window. |
| `tie_breaker.applied` | Additional DMG was consumed. |
| `revenge.gauge_changed` | Revenge gauge count changed. |
| `revenge.activated` | Revenge becomes available. |
| `revenge.attack_landed` | Revenge attack landed. |
| `shock.applied` | Question timeout caused `SHOCK!`. |
| `attack.landed` | Damage landed and HP truth changed. |
| `cpu.action.decided` | CPU Opponent returned a decision. |
| `round.ended` | Fight round ended. |
| `match.ended` | Match ended. |
| `results.ready` | Final result payload is ready for results flow. |

Every event includes:

| Field | Meaning |
| --- | --- |
| `name` | Event name. |
| `matchId` | Match id. |
| `roomId` | Room id. |
| `serverTimestampMs` | Server event timestamp. |
| `payload` | Event-specific data. |

## Live Match To Match Summary

When the match is complete, Live Match produces a `FinalMatchResult`.

Important fields:

| Field | Meaning |
| --- | --- |
| `matchId` | Final match id. |
| `roomId` | Room id. |
| `mode` | `pvp` or `pvc`. |
| `status` | Currently `completed`; void support is pending. |
| `startedAtMs` | Runtime start timestamp. |
| `endedAtMs` | Runtime end timestamp. |
| `winnerCombatantId` | Winner id when there is one. |
| `mutualFinalRoundLoss` | True when final round ends tied. |
| `roundWins` | Final round-win count. |
| `combatants` | Per-combatant correct answers, attempts, accuracy, longest streak, and Aura gain. |
| `cpuOpponentKey` | Present for PvC. |
| `pvcPlayerWon` | Present for PvC. |

Match Summary should persist the durable outcome. Live Match should not write PostgreSQL directly.

## Open Items

- Socket.IO handlers still need to be written.
- Reconnect, pause, resume, void, and rematch service functions are pending.
- Match Summary persistence is pending.
- Shared TypeScript contracts are pending in `packages/shared/src/contracts/`.
