# Seeding

The seed produces deterministic demo data so every developer and CI run starts from an
identical, known state.

## Principles
- **Deterministic**: same data every run (fixed ids/values), so tests and screenshots are
  stable. Avoid random data unless seeded with a fixed RNG.
- **Idempotent by replacement**: the seed wipes existing data (except `_prisma_migrations`)
  and re-inserts. Running it twice yields the same DB.
- **Realistic distributions**: when data feeds analytics/charts, seed realistic spreads (e.g.
  conformance 70/20/10, varied volumes) so dashboards populate meaningfully.
- **Cover roles & edge cases**: include at least one inactive user, one of each role, and
  records in every workflow state.

## Commands
```bash
npx prisma db seed            # local — DESTRUCTIVE (wipes all data)
bash infrastructure/scripts/db-seed.sh dev   # dev cloud via Cloud SQL Proxy — DESTRUCTIVE
```

## Guard rails — CRITICAL
- **Never seed production.** No `db:seed:prod` without an explicit interactive confirmation,
  and even then prefer a controlled import. Production data is not recoverable from a wipe.
- The cloud seed script targets dev by default; prod must be a separate, guarded path.
- Document seed credentials in the project (a shared dev password is fine for demo accounts;
  never reuse it anywhere real).
