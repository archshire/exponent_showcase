# Railway deployment

Deploy branch `feat/mobile-game` from https://github.com/archshire/exponent_showcase.
The current mobile/voice changes and Railway files must first be committed and pushed to that repository.

Create an empty Railway project, then add PostgreSQL named **Postgres**.
Add three services from the same GitHub repository and branch. Leave each Root Directory at the repository root; the workspace builds need the root lockfile and packages.

| Service name | RAILWAY_DOCKERFILE_PATH | PORT | Healthcheck path |
| --- | --- | --- | --- |
| server | apps/server/Dockerfile | 3001 | /health |
| client | apps/client/Dockerfile | 3000 | / |
| gateway | infra/railway/Dockerfile | 8080 | /health |

Set the Dockerfile path and PORT as service variables. Leave custom build/start commands empty; the Dockerfiles supply them.
Use one server replica: live matches are held in memory. Deployments interrupt active matches.

## Gateway

Under Settings → Networking, generate a public domain targeting port **8080**.
Only the gateway needs public networking. Railway provides HTTPS.

Gateway variables (service names must match the table):

```text
CLIENT_HOST=${{client.RAILWAY_PRIVATE_DOMAIN}}
CLIENT_PORT=3000
SERVER_HOST=${{server.RAILWAY_PRIVATE_DOMAIN}}
SERVER_PORT=3001
PORT=8080
RAILWAY_DOCKERFILE_PATH=infra/railway/Dockerfile
```

## Server

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3001
RAILWAY_DOCKERFILE_PATH=apps/server/Dockerfile
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-GATEWAY-DOMAIN
OAUTH_REDIRECT_BASE_URL=https://YOUR-GATEWAY-DOMAIN/api
```

Set **JWT_SECRET** to a new random secret of at least 32 characters, e.g. generate locally with `openssl rand -hex 32`.
Replace YOUR-GATEWAY-DOMAIN with the generated hostname, without a trailing slash.
Add a persistent volume mounted at **/app/apps/server/uploads** for uploaded profile pictures.
The server applies Prisma migrations automatically at startup; use a fresh Railway database for the first deployment.

42 OAuth is optional for ordinary email/password login. To enable it, set FORTYTWO_CLIENT_ID and FORTYTWO_CLIENT_SECRET and register the callback URL required by the server in your 42 OAuth application.

## Client

Set PORT=3000 and RAILWAY_DOCKERFILE_PATH=apps/client/Dockerfile.
NEXT_PUBLIC_API_URL defaults to /api in the Dockerfile; keep that value.
Do not set it to the server's private hostname: phones cannot reach private Railway addresses.

## Launch and verify

Deploy Postgres, then server and client, then gateway. If the gateway initially fails because a private hostname is not ready, redeploy it after both app services are running.

1. Open https://YOUR-GATEWAY-DOMAIN/api/health and check for a healthy response.
2. Register/sign in, start a training match and verify live answers.
3. Try voice mode over the public HTTPS URL and allow microphone access.
4. Add this public URL to the phone home screen; replace the old local-IP shortcut.

Local accounts and uploads are not automatically copied into Railway.
Check Railway's displayed usage/cost estimate before provisioning.

References:
- https://docs.railway.com/guides/docker-compose
- https://docs.railway.com/variables/reference
- https://docs.railway.com/databases/postgresql
