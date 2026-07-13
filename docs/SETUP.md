# Setup Guide

## Local Development Setup

### Prerequisites

- Node.js 20+ (LTS)
- pnpm 8+ (package manager for monorepo)
- Git
- Docker & Docker Compose (optional, for containerized development)

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ft_transcendence
   ```

2. **Install pnpm** (if not already installed)

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies** (monorepo workspace)

   ```bash
   pnpm install
   ```

   This automatically installs dependencies for all packages:
   - `apps/client` (Next.js frontend)
   - `apps/server` (Express backend)
   - `packages/db` (Prisma database models)
   - `packages/shared` (Shared TypeScript types)

4. **Environment configuration**
   Create `.env.local` files as needed:

   **apps/server/.env.local**

   ```bash
   EXAMPLE
   NODE_ENV=development
   PORT=3001
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ft_transcendence
   DB_USER=postgres
   DB_PASSWORD=password
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Database setup** (Prisma)

   ```bash
   ```

6. **Start development servers**

   **Option A: Individual terminals**

   ```bash
   # Terminal 1 - Frontend (port 3000)
   cd apps/client
   pnpm dev
   
   # Terminal 2 - Backend (port 3001)
   cd apps/server
   pnpm dev
   ```

   **Option B: Run all at once from root**

   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - API Documentation: `http://localhost:3001/docs` (if Swagger is set up)

## Frontend Setup Details

### Tailwind CSS & shadcn/ui

The frontend uses **Tailwind CSS 4** with **shadcn/ui** for component composition.

**shadcn/ui Configuration:**

- Located in: `apps/client/src/components/ui/`
- Configured with CSS variables for theming
- Import path alias: `@/components`

**Adding new components:**

```bash
cd apps/client
pnpm dlx shadcn@latest add <component-name>
```

Common components to add:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add navigation-menu
```

See [https://ui.shadcn.com](https://ui.shadcn.com) for full component library.

### Project Structure

```bash
apps/client/src/
├── app/              # Next.js App Router
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Shared layout components
│   └── dashboard/   # Feature-specific components
├── lib/             # Utilities & API client
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
└── styles/          # Global styles
```

## Development Tools

### Code Quality

```bash
# Linting (from root or individual package)
pnpm lint

# Linting specific package
cd apps/client && pnpm lint
cd apps/server && pnpm lint
```

### Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration
```

## Docker Setup (Optional)

To run services with Docker Compose:

```bash
docker-compose up -d
```

This starts:

- PostgreSQL database (port 5432)
- Backend server (port 3001)
- Frontend application (port 3000)

Stop services:

```bash
docker-compose down
```

## Troubleshooting

### Issue: pnpm command not found

```bash
npm install -g pnpm
```

### Issue: Dependencies fail to install

```bash
# Clear pnpm store
pnpm store prune

# Delete node_modules
rm -rf node_modules
rm -rf pnpm-lock.yaml

# Reinstall
pnpm install
```

### Issue: Database connection fails

- Verify database is running: `docker-compose ps`
- Check connection credentials in `.env.local`
- Verify `.env.local` is in the correct directory (`apps/server/`)
- Restart database: `docker-compose restart postgres`

### Issue: Prisma client not generated

```bash
```

### Issue: Changes not reflecting in frontend/backend

- Clear Next.js cache: `rm -rf apps/client/.next`
- Restart dev servers
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

## Monorepo Commands

Key commands that work from the root directory:

```bash
# Install all dependencies
pnpm install

# Run dev servers for all packages
pnpm dev

# Run linting across all packages
pnpm lint

# Run tests across all packages
pnpm test

# Build all packages
pnpm build
```

## Database Management

### Prisma Commands

```bash
```
