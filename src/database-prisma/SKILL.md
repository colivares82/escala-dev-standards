---
name: database-prisma
description: Conventions for the data layer — Prisma schema modeling, enums, migrations, soft delete, and seeding. Use this whenever editing schema.prisma, creating or running migrations, writing or running seeds, modeling a new entity, or working with PostgreSQL via Prisma. Load it before changing the database in any way. Covers destructive-operation guard rails (especially in production), the production-safety rules (no resets, no deletions, no destructive migrations in prod), and the deterministic-seed rules.
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
npx prisma migrate dev --name "describe_the_change"   # dev only: create + apply migration
npx prisma generate                                    # regenerate client after schema edits
npx prisma migrate deploy                               # ✅ prod/cloud: only safe prod command — applies pending, never drops
npx prisma migrate reset                                # ❌ DEV ONLY — drops & replays the DB. NEVER run in production.
npx prisma db push                                      # ❌ DEV/PROTO ONLY — no migration file generated. NEVER in production.
```
- Name migrations meaningfully. Commit the generated SQL.
- Never edit an applied migration; create a new one.
- Cloud migrations run via the infra script over Cloud SQL Proxy (see infra-deploy-gcp).

## 🔒 Production safety (non-negotiable)

Production data is **never** destroyed, dropped, or reset. Any operation that can cause data loss is strictly forbidden in production environments.

### Forbidden in production
| Command / Operation | Why it's banned |
|---------------------|-----------------|
| `prisma migrate reset` | Drops the entire DB, replays from scratch, wipes all data |
| `prisma db push` (especially `--force-reset`) | Bypasses migration history; can silently drop columns/tables |
| Editing or deleting an applied migration file | Corrupts migration history; next `deploy` will fail or mismatch |
| Running seed scripts | Seeds are destructive — they wipe and replace data |
| `DELETE FROM` / `TRUNCATE` / `DROP TABLE` on business tables | Destroys live data |
| Hard-deleting any entity that uses soft delete | Bypasses the `deletedAt` guard; irrecoverable without a backup |

### Destructive-migration guard rail
If a migration SQL contains `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, or any bulk `DELETE`:
1. **Never apply it directly to production.**
2. Use the **expand → migrate → contract** pattern (add new column/table first, migrate data, then drop the old one in a separate later migration).
3. Require a verified backup or snapshot **before** deploying any prod migration.
4. Review the generated SQL in the migration file — `prisma migrate dev` output must be reviewed before committing.

### The only production-safe workflow
```
1. Verify backup/snapshot exists
2. Review migration SQL for DROP/TRUNCATE/DELETE statements
3. npx prisma migrate deploy   ← only this command touches prod DB
4. npx prisma generate         ← update client if needed
```

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
- Soft delete is mandatory for all business/master-data entities — no hard deletes, ever.
- Production environment variable (`NODE_ENV=production` or equivalent) must be detectable by any script that performs migrations or seeds, and must abort if forbidden operations are attempted in prod.
