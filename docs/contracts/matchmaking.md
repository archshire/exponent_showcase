# Matchmaking / Pre-Match Contract

## Purpose

Matchmaking owns the room before the fight becomes a Live Match.

It creates or prepares runtime rooms, then hands the room into Live Match when the fight should start.

## Owner

Owner: Matchmaking / Pre-Match Module in the Node.js + Express backend.

Runtime handoff target: Live Match Module.

Realtime transport: Socket.IO/WebSocket.

## Does Not Own

Matchmaking does not own question generation, answer validation, HP truth, damage, CPU behavior, round winners, match winners, post-match persistence, or Excalibur rendering.

Those are owned by Live Match, Question Generator, CPU Opponent, Match Summary, and frontend presentation modules.

## Main Flow

```text
Frontend action -> Matchmaking -> room/session -> Live Match
```

For PvC:

```text
pvc.start -> create PvC runtime room -> create Live Match session -> emit match.started
```

For PvP:

```text
queue/private invite -> create PvP room -> ready/countdown -> create Live Match session
```

The PvC start path is shaped first because it only needs one human player and one server-controlled CPU.

## PvC Start Action

Client sends:

| Field | Meaning |
| --- | --- |
| `playerId` | Human player starting the CPU match. |
| `cpuOpponentKey` | CPU opponent selected by the player. |

Socket event:

```text
pvc.start
```

Backend result:

| Output | Meaning |
| --- | --- |
| `room` | Runtime room created for this PvC match. |
| `liveMatchSession` | Live Match runtime state created for the fight. |
| `room.created` | Matchmaking event confirming the room exists. |
| `match.started` | Matchmaking event confirming handoff to Live Match. |
| Live Match events | Initial authoritative match events from Live Match. |

## Room Shape

| Field | Meaning |
| --- | --- |
| `roomId` | Runtime room id. |
| `matchId` | Match id used by Live Match and later result handoff. |
| `mode` | `pvp` or `pvc`. |
| `status` | `created`, `queueing`, `waiting_ready`, `countdown`, `live`, or `cancelled`. |
| `playerIds` | Human players currently attached to the room. |
| `cpuOpponentKey` | Present for PvC rooms. |
| `readyState` | Future PvP ready-state holder. |
| `countdownState` | Future PvP countdown holder. |

## PvP Draft Flow

PvP currently supports a basic Quick Match queue and Ready flow.

The visible Socket.IO events are:

| Socket Event | Meaning | Current Status |
| --- | --- | --- |
| `queue.join` | Player joins Quick Match queue. If another player is waiting, both are assigned to a PvP room. | Implemented with in-memory queue rooms. |
| `queue.cancel` | Player leaves Quick Match queue before being matched. | Implemented for unmatched queued players. |
| `private_invite.send` | Player challenges an accepted friend. | Placeholder; returns `NOT_IMPLEMENTED`. |
| `private_invite.respond` | Invited friend accepts or declines. | Placeholder; returns `NOT_IMPLEMENTED`. |
| `ready.set` | Player marks Ready in a PvP room. If both are ready, starts 5-second countdown. | Implemented. |
| `ready.stop` | Player cancels the 5-second countdown and resets ready state. | Implemented. |
| `match.leave_prematch` | Player leaves before Active Match starts. Cancels the room and notifies remaining players. | Implemented. |

Future PvP should still support private invites and richer room-leave handling.

## Leave Pre-Match

Current leave behavior:

```text
match.leave_prematch
-> clear any active countdown timer
-> cancel the pre-match room
-> remove queued room from Quick Match queue if needed
-> emit prematch.cancelled
-> emit room.cancelled
```

If another player remains in the room, the cancellation event includes:

```text
Opponent left.
```

This flow is only for pre-match rooms. Once Live Match starts, leaving should be handled by the Live Match reconnect/void flow instead.

## Quick Match Queue

Current MVP queue behavior:

```text
first player queue.join -> queued one-player room
second player queue.join -> assigned into oldest queued room
room moves to waiting_ready
ready.set / ready.stop control countdown
countdown completion hands off to Live Match
```

The queue is backend runtime memory. It is not persisted to PostgreSQL.

## Ready Countdown

Current ready behavior:

```text
ready.set from one player -> update ready.state
ready.set from both players -> emit match.countdown started
5-second in-memory timer -> start PvP Live Match
ready.stop during countdown -> clear timer and reset both players to Not Ready
```

Backend-restart limitation:

- the 5-second countdown timer is currently an in-memory `setTimeout`.
- if the backend process restarts during countdown, the timer is lost.
- future restart-safe behavior should store `countdownEndsAtMs` and recreate/resolve countdowns during backend startup.

## Rejections / Errors

| Code | Meaning |
| --- | --- |
| `INVALID_PAYLOAD` | The client sent missing or invalid fields. |
| `ROOM_CAP_REACHED` | The 50-room cap is full. |
| `INVALID_CPU_OPPONENT` | The selected CPU key does not exist. |
| `ALREADY_QUEUED` | Player is already waiting in Quick Match queue. |
| `NOT_QUEUED` | Player tried to cancel but is not queued. |
| `NOT_ROOM_MEMBER` | Player is not part of the pre-match room. |
| `INVALID_ROOM_STATE` | Room is not in the expected state for the action. |
| `MATCH_ALREADY_STARTED` | Player tried to use a pre-match leave after Live Match started. |
| `NOT_IMPLEMENTED` | The documented PvP flow exists as a placeholder but is not built yet. |

## Open Items

- Wire `pvc.start` from Socket.IO into frontend Active Match navigation.
- Implement private invite actions.
- Implement richer socket-room cleanup when multiple sockets per player exist.
- Mirror stable event payloads into frontend code once the frontend integration starts.
