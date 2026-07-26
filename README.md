# Escala Dev Standards

Portable engineering standards and skills, extracted from the MAGUPELL project and
generalized for reuse across all future projects. Stack-coupled by design — these assume
the fixed Escala stack and bake it in rather than staying framework-agnostic.

> **Status**: Taxonomy locked (8 skills). Authoring not yet started.
> First build target: `engineering-foundations`, end-to-end in both formats.

---

## 1. Why this exists

MAGUPELL produced a large body of hard-won standards, patterns, and gotchas. Rather than
re-deriving them per project, they are extracted once here, reconciled into a single
canonical version per topic (the source docs had drifted — e.g. axios vs `fetch`), and
emitted into the two formats the agentic workflow consumes.

Project-specific material (the leather domain, the 167 requirements, MGL codes, entity
names) is deliberately **excluded** — that belongs in each project's own Memory Bank, not
in a reusable skill.

---

## 2. Packaging model — one source, two channels

Each skill is authored **once** in `src/` and consumed through two channels:

```
escala-dev-standards/
├── src/<skill>/              ← canonical SKILL.md + references/ (on-demand channel:
│                                the skills CLI reads this tree directly)
├── dist/clinerules/<skill>.md ← GENERATED always-on Cline rules (npm run build)
├── scripts/build.sh           ← src → dist (CI verifies dist is never stale)
├── scripts/sync.mjs           ← `escala-standards-sync` bin: installs rules into a
│                                consuming project's .clinerules/ (marker-guarded)
└── .github/workflows/verify-build.yml
```

- **Always-on**: consuming projects add this repo as an npm devDependency and run
  `escala-standards-sync` (see GUIDE.md) — generated rules land in `.clinerules/`, which
  Cline auto-loads every session. Hand-written project rules are never touched.
- **On-demand**: `npx skills add colivares82/escala-dev-standards` — the skills CLI installs
  the `src/` SKILL.md tree, pulled by description match when relevant.

One source of truth (`src/`); `dist/` is a build artifact enforced fresh by CI.

## 3. The eight skills

| # | Skill | `.clinerules` | `SKILL.md` | Scopes to |
|---|-------|:-:|:-:|-----------|
| 1 | `engineering-foundations` | ✅ | ✅ | whole repo |
| 2 | `agentic-workflow` | ✅ | ✅ | whole repo |
| 3 | `backend-nestjs` | ✅ | ✅ | `server/` |
| 4 | `frontend-react` | ✅ | ✅ | `client/` |
| 5 | `database-prisma` | ◐ pointer | ✅ | `server/` |
| 6 | `testing` | ✅ | ✅ | `client/` + `server/` |
| 7 | `infra-deploy-gcp` | ◐ pointer | ✅ | `infrastructure/` |
| 8 | `battle-tested-patterns` | ◐ pointer | ✅ primary | cross-cutting |

`◐ pointer` = a short always-on stub that names the skill and tells the agent to load the
full `SKILL.md` on demand, so heavy detail (PDF recipe, lock implementation) stays out of
every context window.

### 1. engineering-foundations
The always-on baseline that applies to *all* code.
- `SKILL.md`: SOLID, DRY, SRP, composition over inheritance, single responsibility, the
  no-hardcoded-values principle, file-size limits, naming philosophy. DRY is stated here as
  a principle and applies to UI components as much as to functions (see `frontend-react`).
- `references/tech-stack.md`: the version-locked manifest — Node 20+, npm workspaces,
  TypeScript 5.x, React 18 + Vite, Tailwind CSS 4, Radix/shadcn primitives, framer-motion,
  lucide-react, NestJS 11, Prisma 5.22, PostgreSQL 14, Vitest/Jest/Playwright/MSW.
- `references/repo-layout.md`: monorepo (`client/` · `server/` · `shared/`), each package
  owning its own build, Dockerfile, Cloud Run service and **path-filtered** CI trigger; root
  exposing central `npm run dev` (concurrently) and `npm run build`.

### 2. agentic-workflow
How the agent operates.
- Memory Bank system (6 core files, read-all-at-start, `update memory bank` protocol),
  spec-driven loop (agent writes specs + wireframes only → implementation; specs always in
  English; wireframes as standalone HTML at `/specs/mockups/` referenced by path), the docs
  taxonomy convention, and the *Every New Task* pre-flight checklist.

### 3. backend-nestjs
- `SKILL.md`: Controller → Service → Repository, all Prisma confined to repositories,
  ≤300-line files, DTOs + class-validator, naming, anti-patterns table, pre-commit checklist.
- `references/module-template/`: copyable module skeleton.
- `references/error-handling.md`: the NestJS exception-mapping table.
- `references/security-rbac.md`: `JwtAuthGuard` + `RolesGuard`, `@Roles`, `@CurrentUser`,
  role-based data filtering matrix.

### 4. frontend-react
- `SKILL.md`: Component → Hook → Service, component ≤200 / hook ≤80, no-`any`, orchestrator
  pattern, naming. **HTTP via native `fetch` (canonical — reconciled away from the stale
  axios examples).**
- `references/component-architecture.md`: **in-project DRY-for-UI discipline.** A single
  shared primitives layer in `components/ui/` (Button, Label, Card, Input, Badge…) built on
  Radix/shadcn + tokens, defined once and composed everywhere. Global singletons for
  cross-cutting UX — one toast system (`useToast`), one notification bell, one confirm
  dialog — used app-wide, never re-implemented per page or flow. Promotion rule: the moment a
  UI element appears twice, it becomes a shared component. Folder convention:
  `components/ui/` (primitives) vs `components/common/` (shared composites) vs feature folders.
- `references/design-tokens.md`: `globals.css` custom properties, dark mode, the
  `variant="outline"` exception. Tokens are the only styling source — no per-page hex.
- `references/constants-layer.md`: `config/api.config.ts` + `constants/*` (the FE
  implementation of no-hardcoding).
- `references/folder-structure.md`: config / constants / services / hooks / components layers.

### 5. database-prisma
- `SKILL.md`: schema-modeling conventions, enums, migrations workflow, soft delete (`deletedAt`).
- `references/seeding.md`: deterministic demo seeding, destructive-guard rules, never-seed-prod.
- `references/snapshots.md`: immutable snapshot-at-transition + the `pg_dump`-exclusion
  persistence constraint (cross-referenced from `battle-tested-patterns`).

### 6. testing
- `SKILL.md`: Vitest + Jest + Playwright + MSW + RTL, AAA pattern, when-to-test rules, the
  CI gate (tests block deploy).
- `references/coverage.md`: coverage targets and minimum test counts per artifact type.
- `references/factories.md`: the test-data factory pattern.
- `references/patterns.md`: backend service/repo and frontend hook/component examples.

### 7. infra-deploy-gcp
- `SKILL.md`: the `/infrastructure` folder discipline, env-driven config + Secret Manager,
  branch promotion (`dev` → `main`).
- `references/cicd.md`: GitHub Actions + Workload Identity Federation (keyless),
  path-filtered triggers, health-check deploy gates, reserved-env-var warnings.
- `references/gcp-efficiency.md`: Cloud Run tuning (min-instances 0 dev / ≥1 prod,
  concurrency, 1Gi for Puppeteer, max-instance caps), Cloud SQL sizing + daily backups, GCS
  (Standard class, lifecycle expiry, CORS, signed URLs), EU region pinning, client-side
  image compression.
- `references/docker.md`: multi-stage builds, `node:20-slim` + system Chromium.

### 8. battle-tested-patterns
The hard-won, cross-cutting gotchas — on-demand so they never bloat context.
- `references/distributed-lock.md`: table-based `_system_lock` singleton — **not**
  `pg_advisory_lock` (session-scoped, breaks under Prisma's connection pool).
- `references/sse-auth.md`: SSE with auth via `fetch` + `ReadableStream` (native
  `EventSource` can't send `Authorization`); `@Global` notifications module; RxJS
  Subject-per-connection.
- `references/puppeteer-pdf.md`: `puppeteer-core` + system Chromium, Handlebars templates,
  inline CSS, base64-embedded images, `process.cwd()` paths, `deleteOutDir: false`, 1Gi.
- `references/sequential-numbering.md`: immutable, gap-free numbering (e.g. `INSP-YYYY-NNN`).

---

## 4. Coverage map

Proof that every concern has exactly one home (principles live once; implementations live in
their layer).

| Concern | Home |
|---|---|
| Technologies / version-locked stack | `engineering-foundations/references/tech-stack.md` |
| SOLID · DRY · SRP · composition | `engineering-foundations/SKILL.md` |
| No-hardcoded-values *(principle)* | `engineering-foundations/SKILL.md` |
| Constants discipline *(principle)* | `engineering-foundations/SKILL.md` |
| → constants impl (FE) | `frontend-react/references/constants-layer.md` |
| → config impl (BE) | `backend-nestjs` (`.env` + `ConfigService`) |
| File-size limits · naming | `engineering-foundations` (restated per layer) |
| Monorepo + client/server split + central dev/build | `engineering-foundations/references/repo-layout.md` |
| Memory Bank · spec-driven loop · every-new-task | `agentic-workflow/SKILL.md` |
| Controller→Service→Repository · DTOs · exceptions | `backend-nestjs` |
| RBAC · guards · `@CurrentUser` | `backend-nestjs/references/security-rbac.md` |
| Component→Hook→Service · design tokens · `fetch` | `frontend-react` |
| **In-project reusable components (no duplication)** | `frontend-react/references/component-architecture.md` |
| Schema · migrations · soft delete | `database-prisma` |
| Seeding (deterministic, guarded) | `database-prisma/references/seeding.md` |
| Test coverage targets + minimum counts | `testing/references/coverage.md` |
| Test frameworks · factories · AAA | `testing` |
| Automation / CI-CD / WIF / deploy gates | `infra-deploy-gcp/references/cicd.md` |
| GCP efficiency (Cloud Run · GCS · Cloud SQL) | `infra-deploy-gcp/references/gcp-efficiency.md` |
| Docker · Chromium · secrets · CORS | `infra-deploy-gcp` |
| Distributed lock · SSE-auth · PDF · numbering | `battle-tested-patterns/references/*` |

---

## 5. Conventions

- **Stack-coupled, not generic.** Skills bake in the fixed stack; that is what makes them sharp.
- **Domain stripped.** No leather/MAGUPELL specifics — those go in each project's Memory Bank.
- **Reconciled, not copied.** Where source docs conflicted, the canonical version wins
  (e.g. native `fetch`, not axios).
- **Principle once, implementation per layer.** Cross-cutting rules appear once as a
  principle in `engineering-foundations` and once as a concrete implementation in the
  relevant layer skill. DRY is the clearest example: stated in foundations, implemented for
  the backend (shared services/utilities) and for the UI (shared component primitives).
- **Every UI element is reusable, in-project.** No separate library — shared primitives and
  global UX singletons live in `client/src/components/`, defined once and composed
  everywhere. Promote on second use.
- **Pushy descriptions.** `SKILL.md` descriptions state what the skill does *and* when to
  use it, to combat skill under-triggering.

---

## 6. Build order

1. `engineering-foundations` — built first, end-to-end in both formats, as the structural
   reference for everything else.
2. `agentic-workflow`
3. `backend-nestjs` · `database-prisma`
4. `frontend-react` (includes the component-architecture discipline)
5. `testing`
6. `infra-deploy-gcp`
7. `battle-tested-patterns`

Each skill, once authored in `src/`, is emitted to `dist/clinerules/` and `dist/skills/`,
and can be packaged into an installable `.skill` file.
