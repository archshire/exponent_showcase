# API Documentation

The HTTP API is documented with **OpenAPI 3.0**, generated directly from the
server's zod validation schemas so the docs stay in sync with the code.

## Interactive docs

With the server running (`pnpm -C apps/server run dev`):

| What | URL |
| --- | --- |
| Swagger UI (browse & try endpoints) | http://localhost:3001/docs |
| Raw OpenAPI spec (JSON) | http://localhost:3001/openapi.json |

> These are **development-only**. They are disabled when `NODE_ENV=production`
> so the API surface isn't publicly browsable.

The raw spec at `/openapi.json` can be imported into Postman/Insomnia or fed to
a client generator (e.g. `openapi-typescript`) to produce typed clients.

## Base URL

```
http://localhost:3001
```

## Authentication

Session auth uses a JWT delivered as an **httpOnly `token` cookie**, set on a
successful `POST /auth/register`, `POST /auth/login`, or the 42 OAuth callback.
The token is also returned in the JSON body of register/login for clients that
prefer to store it themselves.

- Lifetime is configurable via `JWT_EXPIRES_IN` (default `7d`); the cookie's
  `maxAge` tracks the token's expiry.
- Logging in again, logging out, or the token expiring invalidates prior tokens
  (enforced via a per-user `tokenVersion`).

Protected endpoints (`POST /auth/logout`, `GET /auth/me`) require the cookie.

## Error Handling

All error responses use this shape:

```json
{ "error": "Human-readable message." }
```

## Endpoints

Endpoints are documented in full (request bodies, responses, status codes) in
the [Swagger UI](http://localhost:3001/docs). Current surface:

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Log in with email + password |
| POST | `/auth/logout` | Log out the current session |
| GET | `/auth/me` | Get the current user profile |
| GET | `/auth/42` | Begin 42 OAuth login (redirects to 42) |
| GET | `/auth/42/callback` | 42 OAuth callback (redirects back to the client) |

> Google and GitHub OAuth exist in the codebase but are currently disabled —
> only 42 is wired up.

## Versioning

The API is currently unversioned (`v1.0.0` in the spec `info`). A versioning
strategy will be introduced if/when breaking changes are needed.
