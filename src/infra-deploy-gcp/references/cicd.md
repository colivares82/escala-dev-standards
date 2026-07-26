# CI/CD (GitHub Actions + WIF)

## Pipeline shape
1. **Test** (hard gate) — run server + client tests. Failure blocks everything downstream.
2. **Build** — Docker images for changed packages.
3. **Push** — to Artifact Registry.
4. **Deploy** — to Cloud Run (dev or prod by branch).
5. **Verify** — curl the `/api/health` endpoint; fail the job if unhealthy.
6. **Summary** — write a GitHub Step Summary (versions, URLs).

## Keyless auth
Use **Workload Identity Federation**: the workflow exchanges its GitHub OIDC token for GCP
credentials. No long-lived JSON keys in secrets.

## Path-filtered triggers
Only rebuild what changed:
```yaml
on:
  push:
    branches: [dev]
    paths: ['server/**', 'shared/**']   # backend workflow
# separate workflow for client/** + shared/**
```

## Branch promotion
- `dev` branch → dev Cloud Run.
- `main` (or `release/*`) → prod Cloud Run.
- Migrations run via `infrastructure/scripts/db-migrate.sh <env>` over Cloud SQL Proxy
  (`prisma migrate deploy`, non-interactive).

## Reserved vars
Never set `PORT`, `K_SERVICE`, or other Cloud Run-managed env vars.
