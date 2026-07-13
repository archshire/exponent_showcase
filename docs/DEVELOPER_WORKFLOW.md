# Developer Workflow

## Quick Start

1. **Setup** — Follow [SETUP.md](SETUP.md)
2. **Review** — Read [ARCHITECTURE.md](ARCHITECTURE.md) and [API.md](API.md)
3. **Branch** — See [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for branching and naming conventions
4. **Start** — `pnpm dev` from root (starts frontend & backend)

## Development Servers

```bash
pnpm dev              # Start all servers (port 3000 & 3001)

# Or individually
cd apps/client && pnpm dev   # Frontend only (:3000)
cd apps/server && pnpm dev   # Backend only (:3001)
```

## Frontend Development

```
apps/client/src/
├── app/           # Pages (Next.js App Router)
├── components/    
│   ├── ui/        # shadcn/ui components
│   └── layout/    # Shared layout
├── lib/           # API client, utilities
└── styles/        # Global styles
```

**Add new page:**

- Create folder: `apps/client/src/app/my-page/`
- Add `page.tsx` file
- Next.js creates route automatically

**Add shadcn component:**

```bash
cd apps/client
pnpm dlx shadcn@latest add button
```

## Backend Development

```
apps/server/src/
├── index.ts       # Express setup
├── config/        # Environment config
├── controllers/   # Request handlers
├── services/      # Business logic
├── middleware/    # Auth, validation
└── routes/        # Route definitions
```

**Database access:**

```typescript
import { prisma } from '@repo/db';

const users = await prisma.user.findMany();
```

## Code Quality

```bash
pnpm lint          # Check for issues
pnpm build         # Build for production
```

## Before Committing

- Code works locally
- Linting passes: `pnpm lint`
- Use conventional commits (see [GIT_WORKFLOW.md](GIT_WORKFLOW.md))

```bash
git commit -m "feat(auth): add login endpoint"
```

## Pull Request

1. Push branch: `git push origin feat/my-feat`
2. Open PR with clear description
3. Address review feedback
4. Merge when approved

See [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for detailed process.

## Testing Changes

**Frontend:**

- Test at `http://localhost:3000`
- Browser DevTools (F12) for debugging

**Backend:**

- Use Bruno to test endpoints
- Use Swagger for documentation if necessary
- View logs: `docker-compose logs server`

**Database:**

```bash
cd packages/db
pnpm studio   # View database in Prisma Studio
```

## Help & References

- **Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **API endpoints** → [API.md](API.md)
- **Database schema** → [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- **Git workflow** → [GIT_WORKFLOW.md](GIT_WORKFLOW.md)
- **Setup issues** → [SETUP.md](SETUP.md)
