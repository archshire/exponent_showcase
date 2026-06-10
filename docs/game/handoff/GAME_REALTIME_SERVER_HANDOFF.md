# Game Realtime Server Handoff

## Purpose

This document gives the server teammate a practical handoff for the game MVP realtime layer.

It is written for the code area currently represented by:

```text
apps/server
```

The current server package already uses Express and includes `socket.io` as a dependency. This handoff assumes the realtime multiplayer layer will be built there unless the team later chooses a different server boundary.

This is not a database schema document and not an Excalibur implementation document.

## Responsibility Boundary

| Area | Server Owns | Server Does Not Own |
| --- | --- | --- |
| PvP rooms | Creating, joining, closing, renaming, kicking, room visibility, room status. | Visual room page layout. |
| Quick Match | Finding and reserving an available room before confirming success. | Client-side loading animation. |
| Ready flow | Player ready state, countdown start/cancel, transition into match. | Button styling. |
| PvP match authority | Official match state, answer timing, action validity, combat resolution, match outcome. | Excalibur animation or local-only visual effects. |
| Spectators | Viewer admission, viewer cap, read-only sync, match-ended handling. | Spectator visual composition beyond state data. |
| Disconnects/quits | Socket disconnect detection, quit confirmation, D/C attribution, forced PvP forfeit rule. | Player-facing copy beyond specified messages. |
| Capacity protection | Room caps, viewer caps, idle cleanup, load-shedding rules. | Final infrastructure sizing. |
| Persistence triggers | Calling or emitting persistence actions after authoritative events. | Database schema ownership. |

## Core Principle

The server is the authoritative multiplayer referee and room coordinator.

The client may render quickly and animate richly, but PvP truth should come from the server:

- who is in a room.
- whether a match starts.
- whether an answer is accepted.
- which player won a question round.
- whether DEFEND succeeds.
- whether HP changes are official.
- whether a match is completed, voided, or forfeited.

## MVP Realtime Scope

The realtime server should support:

- public and private room creation.
- room join/leave behavior.
- host controls.
- private invites.
- Quick Match allocation.
- room-ready state.
- 3-second ready countdown.
- active PvP match synchronization.
- read-only live spectator view.
- quit overlay coordination.
- disconnect handling.
- replay/rematch request flow.
- capacity protection.
- persistence triggers for database-facing events.

## Room Model

Recommended runtime room state:

```ts
type RoomVisibility = 'public' | 'private';
type RoomStatus = 'waiting' | 'ready_countdown' | 'in_game' | 'closing' | 'closed';

type RealtimeRoom = {
  roomId: string;
  roomName: string;
  visibility: RoomVisibility;
  status: RoomStatus;
  hostPlayerId: string;
  guestPlayerId: string | null;
  playerIds: string[];
  viewerIds: string[];
  maxPlayers: 2;
  maxViewers: 10;
  createdAt: string;
  waitingExpiresAt: string | null;
  quickMatchReservedBy: string | null;
};
```

### Room Rules

- Public rooms are visible in the public lobby.
- Private rooms are hidden from the public lobby and joined through direct invite.
- A room supports exactly two active players.
- Public room rows show room name, host/player name, player count, and `Join`.
- Rooms in `in-game` state may show `View` if spectator capacity is available.
- Waiting rooms auto-close after `2` minutes if no second player joins.
- The lobby may host up to `100` rooms for MVP.
- If the lobby reaches `100` rooms, reject new room creation with a max-room message.

## Quick Match Allocation

Quick Match should be server-owned.

Rules:

- Search available public rooms.
- Prefer the available public room created earliest.
- Do not confirm success until the player slot is actually allocated.
- If another player joins before allocation completes, treat that room as unavailable and continue searching.
- Each room should only be inspected by one Quick Match process at a time.
- If no available room exists, return `No available rooms found.` and allow the client to offer `Private Match` and `Public Match`.
- If the player presses Back while finding a match, cancel Quick Match.

Recommended approach:

- use a short-lived reservation/lock on the room during inspection.
- release the reservation if allocation fails or the player cancels.
- only emit `quick_match_joined` after the guest slot is secured.

## Ready Flow

The server owns ready state.

Rules:

- If only one player is present, the ready button remains visible but disabled.
- When two players are present, both may press ready.
- When both players are ready, start a `3` second countdown.
- Countdown is shown above the ready button on both screens.
- If a player leaves during countdown, cancel the countdown.
- After countdown completes, create/start the match and move the room to `in_game`.

## PvP Match Authority

For PvP, the server should validate and resolve official match state.

Server-owned match responsibilities:

- fight-round timer.
- question-round lifecycle.
- shared attack power timing.
- accepted answer timestamps.
- 150ms same-time answer window.
- answer correctness.
- attack winner.
- DEFEND availability and success.
- stun and `MISSED!` lockout timing.
- streak and revenge state.
- `Additional DMG` carryover.
- HP changes.
- fight-round winner/tie.
- match winner/loser/mutual loss.

The server may call shared TypeScript domain logic for these rules. It should not rely on Excalibur animation completion as the source of truth.

## Input Validation

The server should reject actions that are not legal in the current state.

Examples:

- answer submitted while stunned.
- answer submitted during `MISSED!` vulnerability.
- DEFEND used while unavailable.
- repeated DEFEND spam.
- attack confirmed without a correct answer.
- action from spectator.
- action from a player not in the room/match.
- action after match completion, void, or forfeit.

## Spectator View

Spectator view is:

- live.
- read-only.
- same full player game UI.

Rules:

- Each match allows up to `10` viewers.
- If viewer cap is reached, `View` should be unavailable/greyed out.
- If a player tries to view anyway, return a maximum-viewers message.
- Spectators cannot submit answers, DEFEND, quit, ready, replay, or affect the match.
- If the match ends while a spectator is joining, return `Match has ended!`.
- If a player disconnects mid-game, viewers return to lobby with the D/C message.

## Quit And Disconnect Handling

### PvC

PvC quit is mostly a client/game-domain concern unless PvC is server-hosted later.

Persistence consequence:

- void current PvC match stats.
- do not apply PvP D/C count.
- preserve incomplete tutorial state if scripted tutorial was not completed.

### PvP

The server should own PvP quit and disconnect accountability.

Rules:

- Pressing quit freezes the local match screen with the quit overlay.
- The opponent is notified that the other player pressed quit.
- Quit presses are logged.
- On the third quit press without quitting, warn that pressing quit again will automatically forfeit the game and result in a loss.
- Forced quit-abuse forfeit applies only to PvP.
- Confirmed quit voids match stats and adds to D/C count.
- Dropped connection counts as D/C.
- If a player D/Cs mid-game, all players and viewers return to lobby with `A player D/C the game.`

## Replay / Rematch Flow

PvP result pages include `Replay`.

Server responsibilities:

- receive replay request from initiator.
- start `15` second waiting window.
- notify the other player.
- if both players accept replay, start a `3` second countdown.
- if the waiting window expires, disable replay for that result screen.
- keep replay/rematch state tied to the completed match or room context.

## Capacity Protection

Current MVP placeholder limits:

| Capacity Item | MVP Limit | Status |
| --- | ---: | --- |
| Public/private rooms in lobby | `100` | Provisional. |
| Viewers per live match | `10` | Provisional. |
| Waiting room expiry | `2 minutes` | Design rule. |
| Idle lobby cleanup | `10 minutes` | Design rule. |
| Fixed connected lobby-player cap | none for MVP | Requires validation. |

### Load-Shedding Priority

If server load is high, protect active matches first.

Recommended degradation order:

1. stop admitting new spectators.
2. stop creating new rooms.
3. stop Quick Match allocation.
4. preserve active matches as long as possible.

### Capacity Metrics To Monitor

The server should expose or record:

- active lobby users.
- active rooms.
- active matches.
- active spectators.
- Quick Match attempts and failures.
- failed room joins.
- spectator entry rejections.
- disconnect frequency.
- average match update delay if possible.
- persistence/write failures if known.

## Socket Event Sketch

These names are recommendations, not final API law.

### Client To Server

```text
room:create
room:join
room:leave
room:close
room:rename
room:kick_player
room:invite_friend
quick_match:start
quick_match:cancel
ready:set
match:submit_answer
match:defend
match:quit_pressed
match:quit_confirmed
spectator:join
spectator:leave
replay:request
replay:accept
```

### Server To Client

```text
lobby:rooms_updated
room:joined
room:updated
room:closed
room:error
quick_match:searching
quick_match:joined
quick_match:no_room_found
ready:countdown_started
ready:countdown_cancelled
match:started
match:state_updated
match:question_started
match:question_resolved
match:round_ended
match:completed
match:voided
match:forfeited
match:quit_warning
match:opponent_quit_pressed
match:player_disconnected
spectator:joined
spectator:rejected
replay:requested
replay:countdown_started
replay:expired
```

## Persistence Touchpoints

The server should trigger database persistence for:

- `match_records`.
- `match_question_logs`.
- `player_match_refs`.
- profile updates.
- leaderboard-affecting profile aggregate updates.
- coin ledger entries.
- D/C and quit accountability.
- player activity events.
- engagement metric updates.
- optional room events.

The server should not define database table structure. That belongs to `docs/game/handoff/GAME_DATABASE_HANDOFF.md`.

## Webhook Boundary

This realtime handoff is not automatically a webhook contract.

Most MVP multiplayer behavior should be socket/server behavior, not webhook behavior.

Possible future webhook candidates:

- `match.completed`
- `match.voided`
- `match.forfeited`
- `player.disconnected`
- `friend.request_sent`
- `friend.request_accepted`
- `profile.name_changed`
- `cpu_opponent.unlocked`

Create `GAME_WEBHOOK_HANDOFF.md` only if the team needs external notifications or service-to-service event delivery.

## Open Technical Validation Items

The server teammate should validate:

- whether `100` rooms is safe.
- whether `10` live spectators per match is safe.
- how many simultaneous PvP matches can run smoothly.
- whether match update delay remains acceptable under load.
- whether question logs and analytics writes need batching.
- whether spectator sync should be disabled or reduced under load.
- whether idle lobby cleanup is sufficient without a fixed lobby-player cap.

Until validated, current capacity numbers are MVP placeholders.

## Handoff Summary

The realtime server should make multiplayer trustworthy.

The server coordinates rooms, validates actions, resolves PvP truth, handles spectators, detects disconnects, protects capacity, and triggers persistence.

The game client makes this feel good.

The database preserves what happened.
