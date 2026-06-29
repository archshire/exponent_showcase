# ---------------------------------------------------------------------------
# Next.js frontend image (standalone output, served by nginx)
# ---------------------------------------------------------------------------
# NEXT_PUBLIC_API_URL is baked at build time. In the compose stack it is "/api"
# so the browser talks to nginx on a single origin (nginx proxies /api and
# /socket.io to the backend).

FROM node:20-bookworm-slim AS builder
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# All workspace members must be present so pnpm can satisfy the frozen lockfile.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/db/package.json packages/db/
COPY apps/client/package.json apps/client/
COPY apps/server/package.json apps/server/
RUN pnpm install --frozen-lockfile

COPY packages ./packages
COPY apps/client ./apps/client

ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter @repo/client build

# --- runtime ---------------------------------------------------------------
FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Standalone server + static assets (tracing root is the repo root, so the
# entry sits at apps/client/server.js inside the standalone bundle).
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

EXPOSE 3000
CMD ["node", "apps/client/server.js"]
