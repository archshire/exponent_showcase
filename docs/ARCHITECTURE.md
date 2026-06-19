# Architecture

## System Overview

ft_transcendence is a full-stack web application built with a modern TypeScript monorepo architecture. The system separates concerns into a Next.js frontend, Express backend, and PostgreSQL database.

### Components

- **Frontend/Client** — Next.js 16 SPA with React 19, TypeScript, Tailwind CSS, and shadcn/ui components. Handles user authentication, dashboard, and real-time features.
- **Backend/Server** — Express.js REST API with TypeScript, JWT authentication via cookies, and centralized route/middleware architecture.
- **Database** — PostgreSQL 16 with Prisma ORM for type-safe data access and migrations.
- **Shared Packages** — Monorepo packages for shared TypeScript types (`packages/shared`) and database models (`packages/db`).
- **Infrastructure/DevOps** — Docker Compose for local development, pnpm workspaces for dependency management.
- **Security** — [Description of Security]

### Architecture Diagram

[To be added: Visual architecture diagram showing Next.js → Express → PostgreSQL flow]

## Technology Choices

### Frontend Framework

**Selected:** Next.js 16 with React 19 & TypeScript

**Justification:**
- Server-side rendering and static generation for SEO and performance
- Built-in routing with App Router for scalable page structure
- First-class TypeScript support with excellent DX
- Large ecosystem with rich component libraries
- Ideal for building full-featured web applications

**Styling & Components:**
- **Tailwind CSS 4** — Utility-first CSS framework for consistent, maintainable styling
- **shadcn/ui** — Pre-built accessible components built on Radix UI and Tailwind, reducing boilerplate

**Alternatives Considered:**
- Vue.js with Nuxt — Good choice, but Next.js has stronger TypeScript story and larger ecosystem
- Plain React + Vite — More lightweight but sacrifices built-in routing and SSR benefits

### Backend Framework

**Selected:** Node.js + Express.js with TypeScript

**Justification:**
- [Reason 1]
- [Reason 2]
- [Reason 3]

**Alternatives Considered:**
- NestJS — [Why not selected]
- Fastify — [Why not selected]

### Database

**Selected:** PostgreSQL 16 with Prisma ORM

**Justification:**
- [Reason 1]
- [Reason 2]
- [Reason 3]

**Alternatives Considered:**
- MongoDB — [Why not selected]
- MySQL — [Why not selected]

### Styling & UI

**Selected:** Tailwind CSS 4 + shadcn/ui

**Justification:**
- Utility-first CSS eliminates context switching between CSS files
- CSS variables for theming and dark mode support
- shadcn/ui provides accessible, composable components
- Reduced time spent on UI boilerplate

### Containerization & DevOps

**Selected:** Docker Compose for local development

**Justification:**
- Easy setup for new developers (single `docker-compose up` command)
- Services (PostgreSQL) isolated in containers
- Configuration via environment variables
- Lightweight alternative to full Kubernetes for development

**Current Setup:**
- PostgreSQL 16 container with persistent volumes
- Local file-based backend and frontend (no containerization in dev)
- `.env.local` files for configuration

**Alternatives Considered:**
- Full Docker setup (backend + frontend containerized) — Adds complexity for local dev
- Just running PostgreSQL locally — Less reproducible across team

### Package Management & Monorepo

**Selected:** pnpm with workspaces

**Justification:**
- Monorepo structure keeps related code together
- Shared packages (`db`, `shared`) reduce duplication
- pnpm is faster and more disk-efficient than npm/yarn
- Workspaces allow unified dependency management

### Authentication & Security

**Selected:** [Auth mechanism, API security, Data encryption, Secrets management]

**Justification:**
- [Reason 1]
- [Reason 2]
- [Reason 3]

**Alternatives Considered:**
- [Alternative 1] — [Why not selected]
- [Alternative 2] — [Why not selected]

## Data Flow

Describe how data flows through the system.

[Add description or diagram]

## Scalability Considerations

**Current Phase (MVP):**
- Single Express instance sufficient for prototyping
- Monorepo allows rapid feature development

**Future Scaling:**
- 

## Security Architecture

[Document security measures and approaches]
