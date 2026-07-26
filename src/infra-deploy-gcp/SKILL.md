---
name: infra-deploy-gcp
description: Infrastructure, CI/CD, and deployment standards on Google Cloud Platform (Cloud Run + Cloud SQL + Cloud Storage) with GitHub Actions. Use this whenever writing or editing deploy scripts, CI workflows, Dockerfiles, CORS/secrets config, GCP setup, or planning a release — and when tuning cost/performance. Enforces the /infrastructure folder discipline, keyless Workload Identity Federation, env-driven config, and efficient Cloud Run/GCS configuration. Load before any DevOps work.
---

# Infrastructure & Deployment (GCP)

Targets GCP Cloud Run (services) + Cloud SQL (PostgreSQL) + Cloud Storage (files), shipped by
GitHub Actions.

## Folder discipline
**All infrastructure files live in `/infrastructure/`** — not in `client/`, `server/`, or root.

```
infrastructure/
├── scripts/      # deploy.sh, db-migrate.sh, gcp-setup.sh, gcp-secrets.sh, ...
├── config/       # generated, gitignored (.gcp-config, credentials)
└── iac/          # Terraform/Pulumi if/when added
```

Platform-pinned exceptions stay put: `.github/workflows/`, `client|server/Dockerfile`,
`client/nginx.conf`, root `.dockerignore`.

## Core rules
- **No hardcoded values in scripts.** Project ids/regions → `infrastructure/config/`; secrets →
  **Secret Manager** (never in code or config files).
- **Keyless auth.** GitHub Actions authenticates via **Workload Identity Federation** — no JSON
  service-account keys.
- **Env-driven everything**, including CORS (resolved from `CORS_ALLOWED_ORIGINS`).
- **Never set reserved Cloud Run vars** (`PORT`, `K_SERVICE`, ...). Cloud Run injects `PORT`.
- npm infra scripts call into `infrastructure/scripts/`, e.g.
  `"deploy:dev": "bash infrastructure/scripts/deploy.sh dev"`.

## CI/CD
Test job is a hard gate before deploy; health check after deploy; deployment summary emitted.
Path-filtered triggers and branch promotion (`dev` → `main`/release): `references/cicd.md`.

## Efficient configuration
Cloud Run sizing (min-instances, concurrency, memory), Cloud SQL, and GCS lifecycle/CORS/signed
URLs tuned for cost + performance: `references/gcp-efficiency.md`.

## Docker
Multi-stage builds; `node:20-slim`; system Chromium for PDF. Details: `references/docker.md`.

## Environments
| Env | Project | Trigger |
|-----|---------|---------|
| Dev | `<project>-dev` | merge to `dev` |
| Prod | `<project>-prod` | merge to `main` (or `release/*`) |

## Documentation
Infra changes → `infrastructure/README.md`; architectural ones → `docs/ARCHITECTURE.md`; GCP
resource changes → `memory-bank/techContext.md`.
