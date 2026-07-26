# Tech Stack — version-locked manifest

The canonical stack for every Escala project. One source of truth; pin these unless a project's
Memory Bank records a deliberate deviation.

## Runtime & tooling
- **Node.js** 20+
- **npm** workspaces (monorepo)
- **TypeScript** 5.x (strict)
- **Docker** multi-stage builds (`node:20-slim`; system Chromium where PDF generation is needed)

## Frontend (`client/`)
- **React** 18
- **Vite** (dev server + build)
- **Tailwind CSS** 4 + design tokens (scalable CSS foundation; never hand-rolled stylesheets)
- **shadcn/ui** components on **Radix** primitives
- **framer-motion** (animation)
- **lucide-react** (icons)
- **date-fns** (dates/i18n formatting)
- HTTP via native **`fetch`** (no axios), including SSE via `fetch` + `ReadableStream`
- **react-router-dom** (routing)

## Backend (`server/`)
- **NestJS** 11 + TypeScript
- **Prisma** 5.22 ORM
- **PostgreSQL** 14 (Cloud SQL in cloud, local/Docker in dev)
- **JWT** auth (`passport-jwt` + `passport-local`) + **bcrypt**
- **RxJS** for SSE (Subject-per-connection)
- **class-validator** + **class-transformer** (DTO validation)
- **Handlebars** + **puppeteer-core** (server-side PDF, when needed)
- **@nestjs-modules/mailer** + Nodemailer (email, when needed)

## Shared (`shared/`)
- TypeScript types, constants, and validators shared by client and server (e.g. `UserRole`).

## Testing
- **Vitest** + React Testing Library + **MSW** (client)
- **Jest** + NestJS Testing (server)
- **Playwright** (E2E)

## Infrastructure
- **GCP**: Cloud Run + Cloud SQL + Cloud Storage
- **GitHub Actions** CI/CD with **Workload Identity Federation** (keyless)
- **Secret Manager** for all secrets
