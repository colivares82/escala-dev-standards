---
name: database-prisma
description: Conventions for the data layer — Prisma schema modeling, enums, migrations, soft delete, and seeding. Use this whenever editing schema.prisma, creating or running migrations, writing or running seeds, modeling a new entity, or working with PostgreSQL via Prisma. Load it before changing the database in any way. Covers the destructive-operation guard rails and the deterministic-seed rules.
---

# Database & Prisma

The data layer for `server/`. Schema lives in `server/prisma/schema.prisma`; all queries go
through repositories (see backend-nestjs).

## Schema conventions
- **Models**: `PascalCase` singular (`InspectionReport`, `Client`). Fields `camelCase`.
- **Enums** for fixed sets — never free-text status columns. Examples of the shape:
  `UserRole`, `ReportStatus (DRAFT·FINALIZED·APPROVED·REJECTED·SENT)`, domain result enums.
- **Timestamps**: `createdAt @default(now())`, `updatedAt @updatedAt`.
- **Soft delete**: master-data models carry `deletedAt DateTime?`; default queries filter
  `where: { deletedAt: null }`. No hard deletes of business data.
- **Relations** explicit; index foreign keys and common filter columns
  (e.g. `@@index([clientId, status])`).
- **Immutable identifiers** (report numbers, codes) are never reassigned once set
  (see battle-tested-patterns/sequential-numbering.md).

## Migrations
```bash
npx prisma migrate dev --name "describe_the_change"   # dev: create + apply
npx prisma generate                                    # regenerate client after schema edits
npx prisma migrate deploy                               # prod/cloud: non-interactive apply
npx prisma migrate reset                                # DEV ONLY: drop + replay + seed
```
- Name migrations meaningfully. Commit the generated SQL.
- Never edit an applied migration; create a new one.
- Cloud migrations run via the infra script over Cloud SQL Proxy (see infra-deploy-gcp).

## Seeding
Deterministic, idempotent demo data for development. **Destructive** — it wipes and replaces.
Rules, guards, and the never-seed-prod rule: `references/seeding.md`.

## Snapshots (if the project has a DB snapshot/restore feature)
Immutable point-in-time copies with one critical persistence constraint — the snapshots table
must survive a wipe/restore. See `references/snapshots.md`. Use a **table-based lock**, never
`pg_advisory_lock`, for any destructive system operation (battle-tested-patterns).

## Rules
- All Prisma calls in repositories (never in services/controllers).
- No raw SQL unless unavoidable; if used, parameterize.
- Connection strings/credentials from env/Secret Manager — never in code.
