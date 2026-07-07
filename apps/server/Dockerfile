# ---------------------------------------------------------------------------
# Express backend image (modular monolith: REST + Socket.IO + game runtime)
# ---------------------------------------------------------------------------
# Built from the monorepo root so the @repo/db workspace package resolves.
# Runs with tsx because @repo/db's entry is TypeScript (src/index.ts);
# Prisma migrations are applied on container start.

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
# OpenSSL is required for Prisma to detect the right query-engine target.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Manifests first for a cached install layer. All workspace members must be
# present so pnpm can satisfy the frozen lockfile.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/db/package.json packages/db/
COPY apps/server/package.json apps/server/
COPY apps/client/package.json apps/client/
RUN pnpm install --frozen-lockfile

# Sources.
COPY packages ./packages
COPY apps/server ./apps/server

# Generate the Prisma client (server runs via tsx, no build step).
RUN pnpm --filter @repo/db exec prisma generate

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Apply pending migrations, then boot the server. `exec` replaces the shell so
# node runs as PID 1 and receives Docker's SIGTERM directly — required for the
# graceful-shutdown handler (draining HTTP/sockets, closing Prisma) to fire.
CMD ["sh", "-c", "pnpm --filter @repo/db exec prisma migrate deploy && cd apps/server && exec node --import tsx src/index.ts"]
