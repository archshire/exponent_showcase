# Exponent — API Reference

The concrete contract for the backend (`apps/server`): REST endpoints and the
Socket.IO realtime protocol. Generated from the route and socket handlers — keep
it in sync when those change.

## Base URL & transport

| Environment | REST base | Notes |
| --- | --- | --- |
| Local dev | `http://localhost:3001` | Server runs directly on `PORT` (3001). |
| Docker | `https://localhost:8443/api` | nginx terminates HTTPS and proxies `/api/*` → server. |

- **Content type:** `application/json` for all request/response bodies (except
  static files under `/uploads`).
- **Errors:** failures return `{ "error": "<human-readable message>" }` with an
  appropriate status (`400` validation, `401` auth, `404` not found, `500`).

## Authentication

REST auth is a **JWT stored in an httpOnly `token` cookie**, set on
`POST /auth/register` and `POST /auth/login` and cleared on `POST /auth/logout`.
Protected routes run through `requireAuth` ([middleware/auth.middleware.ts](../apps/server/src/middleware/auth.middleware.ts)),
which verifies the JWT signature and checks the token's `tokenVersion` against
the user record (a bumped `tokenVersion` force-logs-out all existing sessions).

The cookie's `maxAge` tracks the JWT's own `exp` claim; flags are
`httpOnly`, `sameSite=strict`, and `secure` in production.

---

## REST endpoints

### Auth — `/auth`

| Method | Path | Auth | Body / Query | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | — | `{ username, email, password }` | Create an account; sets session cookie. `username` 3–50 chars `[a-zA-Z0-9_]`, `password` 8–72 chars. |
| POST | `/auth/login` | — | `{ email, password }` | Authenticate; sets session cookie. |
| POST | `/auth/logout` | ✔ | — | Clear the session cookie. |
| GET | `/auth/me` | ✔ | — | Return the current authenticated user. |
| GET | `/auth/42` | — | — | Begin 42 OAuth (redirects to the 42 authorize URL). |
| GET | `/auth/42/callback` | — | `?code&state[&error]` | 42 OAuth callback; on success sets the session cookie and redirects to the app. |

> Google and GitHub OAuth handlers exist but are **commented out** in
> [routes/oauth.routes.ts](../apps/server/src/routes/oauth.routes.ts) — only 42 is wired up.

### Profile — `/profile` (all require auth)

| Method | Path | Body / Query | Purpose |
| --- | --- | --- | --- |
| GET | `/profile/me` | — | Full profile of the authenticated user. |
| GET | `/profile/public` | `?id=` or `?username=` | Public profile of another user. |
| PATCH | `/profile/username` | `{ username }` | Change username. |
| PATCH | `/profile/email` | `{ email }` | Change email. |
| PATCH | `/profile/password` | `{ currentPassword, newPassword }` | Change password (`newPassword` ≥ 8 chars). |
| PATCH | `/profile/language` | `{ languageCode }` | Set preferred UI language. |
| PUT | `/profile/picture` | `{ imageBase64 }` | Upload avatar as a base64 data URL. Larger 8 MB JSON limit; decoded buffer capped at 5 MB. |
| DELETE | `/profile/me` | — | Delete the authenticated account. |

### Friends — `/friends` (all require auth)

| Method | Path | Body / Query | Purpose |
| --- | --- | --- | --- |
| GET | `/friends` | — | List accepted friends. |
| GET | `/friends/search` | `?q=` | Search users by username. |
| GET | `/friends/requests` | — | List incoming friend requests. |
| POST | `/friends/requests` | `{ targetId }` | Send a friend request. |
| POST | `/friends/requests/:requesterId/accept` | — | Accept a request from `requesterId`. |
| POST | `/friends/requests/:requesterId/decline` | — | Decline a request from `requesterId`. |
| DELETE | `/friends/:otherId` | — | Remove an existing friend. |

### Leaderboard — `/leaderboard` (requires auth)

| Method | Path | Query | Purpose |
| --- | --- | --- | --- |
| GET | `/leaderboard` | `?friends=true\|1` | Global ranking; `friends=true` scopes it to the caller's friends. |

### Stats — `/stats` (requires auth)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/stats` | Aggregate stats for the authenticated user (KPIs, CPU mastery, recent matches). |

### Misc

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | — | Liveness/DB health check. |
| GET | `/uploads/*` | — | Static-served uploaded files (e.g. avatars). |

---

## Socket.IO protocol

One Socket.IO server backs two connection worlds
([socket/index.ts](../apps/server/src/socket/index.ts)):

- **Authenticated app sockets** — the client passes its JWT in the handshake.
  Used for **presence** and **community chat**, and joined to a per-user room
  `user:<userId>` so the server can push targeted events (e.g. private-match
  invites).
- **Game runtime sockets** — the live game / matchmaking / match handlers,
  registered by `registerGameRuntimeSocketHandlers`. The real client reuses its
  authenticated socket rather than opening a second connection.

Utility: `ping` → server replies `pong`.

### Chat events — `chat.*`

| Event | Direction | Payload | Purpose |
| --- | --- | --- | --- |
| `chat.history` | client → server | — | Request recent history. |
| `chat.history` | server → client | `Message[]` | Recent messages. |
| `chat.send` | client → server | `{ text }` | Send a message (validated, rate-limited, profanity-filtered). |
| `chat.message` | server → client | `Message` | Broadcast of a new message to the room. |
| `chat.error` | server → client | `{ message }` | Send rejected (empty, too fast, etc.). |

### Game events — `game.*`

**Client → server (inbound)**

| Event | Purpose |
| --- | --- |
| `game.pvc.start` | Start a solo match against a CPU opponent. |
| `game.queue.join` | Join the quick-match queue. |
| `game.ready.set` / `game.ready.stop` | Toggle ready state in the pre-match lobby. |
| `game.prematch.leave` | Leave the pre-match lobby. |
| `game.match.leave` | Leave/forfeit an in-progress match (tears the match down). |
| `game.private.create` | Create a private room (starter picks the arena). |
| `game.private.invite` | Invite an online friend (verifies friendship + presence). |
| `game.private.accept` | Accept a private invite (join as p2/right). |
| `game.private.decline` | Decline a private invite. |
| `game.answer.submit` | Submit an answer to the current question. |
| `game.answer.typing` | Notify the opponent you're typing. |
| `game.defend.activate` | Activate DEFEND (block window). |
| `game.reconnect.resume` | Resume a match after reconnecting. |
| `game.rematch.request` / `game.rematch.accept` / `game.rematch.reject` | Rematch negotiation. |

**Server → client (outbound)**

| Event | Purpose |
| --- | --- |
| `game.state` | Authoritative match snapshot (HP, combatants, arena, event log, etc.). |
| `game.error` | Error/rejection for a game action. |
| `game.answer.typing` | Opponent-is-typing relay. |
| `game.invite.received` | A private-match invite arrived (pushed to `user:<friendId>`). |
| `game.invite.declined` | Your invite was declined. |
| `game.rematch.received` | The opponent requested a rematch. |
| `game.rematch.rejected` | The opponent rejected your rematch request. |

> All game state (HP, damage, status effects, timestamps) is computed
> **server-side** and broadcast via `game.state`; clients are render-only.
