# Architecture

How the **Exponent** codebase is organised and how a request or game action
flows through it. For the technology rationale and database schema see the
[main README](../README.md); for the concrete endpoint/socket contract see
[API.md](./API.md); for gameplay rules see [PRD.md](./PRD.md).

## Runtime services

The stack runs as four Docker Compose services ([docker-compose.yml](../docker-compose.yml)):

| Service | Image / build | Port(s) | Responsibility |
| --- | --- | --- | --- |
| `nginx` | [infra/nginx](../infra/nginx) | `${HTTP_PORT:-8080}` → 80, `${HTTPS_PORT:-8443}` → 443 | Public HTTPS entrypoint. Terminates TLS, serves the client, proxies `/api/*` (REST + Socket.IO) to the server. |
| `client` | [apps/client](../apps/client) | 3000 (internal) | Next.js frontend (standalone output). |
| `server` | [apps/server](../apps/server) | 3001 (internal) | Express REST API + Socket.IO realtime + live-match runtime. |
| `db` | `postgres:16` | `${POSTGRES_PORT:-5432}` → 5432 | PostgreSQL. |

Named volumes: `postgres_data` (database) and `uploads` (user-uploaded avatars,
served by the server at `/uploads`).

In production the browser only ever talks to nginx on `${HTTPS_PORT}`; nginx
routes page traffic to the client and `/api/*` to the server. Local dev without
Docker runs the client on `:3000` and the server on `:3001` directly.

## Monorepo layout

pnpm workspaces ([pnpm-workspace.yaml](../pnpm-workspace.yaml)):

```
apps/
  client/    Next.js 16 + React 19 frontend
  server/    Express 5 + Socket.IO backend
packages/
  db/        @repo/db — Prisma schema + generated client (shared data layer)
```

`packages/db` is the single database layer: [schema.prisma](../packages/db/prisma/schema.prisma)
is the source of truth for all tables, and the generated client is re-exported
from [packages/db/src/index.ts](../packages/db/src/index.ts) and imported by the
server. Client and server keep independent dependency sets and Docker builds.

## Backend structure (`apps/server/src`)

Layered request pipeline, one concern per directory:

- **[routes/](../apps/server/src/routes)** — Express routers, mounted in
  [index.ts](../apps/server/src/index.ts) (`/auth`, `/profile`, `/friends`,
  `/leaderboard`, `/stats`). Each router applies `requireAuth` where needed.
- **[middleware/](../apps/server/src/middleware)** — `requireAuth` verifies the
  JWT cookie and checks `tokenVersion` for instant session invalidation.
- **[controllers/](../apps/server/src/controllers)** — HTTP glue: parse/validate
  input, call a service, shape the response.
- **[services/](../apps/server/src/services)** — domain logic and the only layer
  that touches Prisma. Includes the game runtime: `live-match.service`
  (authoritative combat), `matchmaking.service` (queues/rooms/ready),
  `cpu-opponent.service`, `question-generator.service`, `match-summary.service`
  (persistence handoff), plus `chat`, `presence`, `friends`, `stats`, etc.
- **[socket/](../apps/server/src/socket)** — Socket.IO wiring: `index.ts`
  (server + auth handshake), `chat.socket`, `game.socket` (matchmaking + live
  match), `socket-auth`.
- **[config/](../apps/server/src/config)** — static game configuration
  (`cpu-opponents`, `cpu-unlock-rules`, `profanity`), env validation (`env.ts`),
  OAuth (`oauth.ts`).

**REST request flow:** browser → nginx (`/api`) → Express → `requireAuth` →
controller → service → Prisma → Postgres.

## Frontend structure (`apps/client/src`)

Next.js App Router:

- **[app/](../apps/client/src/app)** — routes: `auth/` (login, signup), the
  authenticated `dashboard/` (home, `solo`, `matchmaking`, `community` +
  `leaderboard`/`social`, `profile`, `settings`, `stats`), and public
  `privacy`/`terms` legal pages.
- **[game/](../apps/client/src/game)** — the Active Match client. Presentation is
  React + CSS/DOM animation (no separate game engine); all combat truth comes
  from the server.
- **[lib/](../apps/client/src/lib)** — `api` (REST client) and `socket`
  (Socket.IO client) wrappers.
- **[context/](../apps/client/src/context)** — React context providers.
- **[i18n/](../apps/client/src/i18n)** — the six-language translation system
  (`en`, `ms`, `zh`, `es`, `fr`, `ko`); `en` is the source and fallback.
- **[components/](../apps/client/src/components)** — shared UI.

## Realtime & state ownership

One Socket.IO server ([socket/index.ts](../apps/server/src/socket/index.ts))
backs two worlds on a single connection:

- **App sockets** — authenticated via JWT in the handshake; drive presence and
  community chat, and join a per-user room `user:<userId>` for targeted pushes
  (e.g. private-match invites).
- **Game runtime sockets** — matchmaking, ready/countdown, live match, reconnect,
  and rematch handlers.

The server is authoritative: all HP, damage, answer validity, status effects,
round/match winners, and Aura awards are computed server-side and broadcast via
`game.state`; clients are render-only. See [API.md](./API.md) for the full event
list.

**Persistence boundary:**

- **Database** persists source-of-truth records only — `users`, `oauth_accounts`,
  `player_profiles`, `player_friendships`, `pvp_matches`, `player_cpu_progression`.
- **Server runtime memory** owns ephemeral state — matchmaking queues, rooms,
  ready/reconnect timers, active match state, WebSocket sessions, and the
  latest-50 community chat buffer. None of this is persisted; a restart clears it.
