---
name: infra-deploy-gcp
description: Infrastructure, CI/CD, and deployment standards on Google Cloud Platform (Cloud Run + Cloud SQL + Cloud Storage) with GitHub Actions — including the ON-DEMAND cloud provisioning runbook. Use this when the user asks to set up / provision the cloud for a project, and when writing or editing deploy scripts, CI workflows, Dockerfiles, CORS/secrets config, or planning a release. Enforces: main→Production, dev→Development; no build without the 70% coverage gate passing; fully independent dev/prod environments; provisioning is interactive (grill-me intake, credentials entered live into Secret Manager) and never blocks development or GitHub pushes.
---

# Infrastructure & Deployment (GCP)

Targets GCP Cloud Run (services) + Cloud SQL (PostgreSQL) + Cloud Storage (files), shipped by
GitHub Actions.

## Non-negotiables (the deployment contract)

1. **Branch → environment**: `dev` branch deploys to **Development**; `main` branch deploys
   to **Production**. Nothing else deploys. Feature branches run tests only.
2. **Coverage-gated builds**: the test job runs `test:coverage` for client + server; tests
   failing **or coverage < 70%** ⇒ **no build, no deploy** (see testing skill). Only a green
   gate triggers the build+deploy for the branch's environment.
3. **Independent environments**: dev and prod are **separate GCP projects**, each with its
   own service accounts, IAM bindings, Cloud SQL instance, GCS buckets, secrets, and domains.
   Nothing is shared; prod credentials never appear in dev workflows or vice versa.
4. **On-demand provisioning, never a blocker**: pushing to GitHub works from day zero —
   tests always run; deploy jobs **skip themselves** until an environment's vars exist.
   Cloud setup is a separate act, triggered when the user asks, and then MUST follow the
   interactive runbook — `references/cloud-provisioning.md` — so every project is configured
   identically. Provisioning an environment (its GitHub vars) is what activates its deploys.

## Folder discipline
**All infrastructure files live in `/infrastructure/`** (scripts/, config/ gitignored, iac/).
Platform-pinned exceptions stay put: `.github/workflows/`, `client|server/Dockerfile`,
`client/nginx.conf`, root `.dockerignore`.

## Core rules
- **No hardcoded values in scripts.** Project ids/regions → `infrastructure/config/`; secrets →
  **Secret Manager** (never in code or config files).
- **Keyless auth.** GitHub Actions authenticates via **Workload Identity Federation** — no JSON
  service-account keys.
- **Env-driven everything**, including CORS (`CORS_ALLOWED_ORIGINS`).
- **Never set reserved Cloud Run vars** (`PORT`, `K_SERVICE`, ...).
- npm infra scripts call `infrastructure/scripts/` (`"deploy:dev": "bash infrastructure/scripts/deploy.sh dev"`).

## References
- `references/cloud-provisioning.md` — **the on-demand provisioning runbook**: grill-me intake → per-environment sequence → deploy activation.
- `references/workflow-templates/` — copyable GitHub Actions workflows implementing the
  contract (deploy-dev.yml, deploy-prod.yml, pr-checks.yml).
- `references/cicd.md` — pipeline shape, WIF, path filters, branch protection.
- `references/gcp-efficiency.md` — Cloud Run/SQL/GCS tuning for cost + performance.
- `references/docker.md` — multi-stage builds, system Chromium.

## Documentation
Infra changes → `infrastructure/README.md`; architectural → `docs/ARCHITECTURE.md`; GCP
resources → `memory-bank/techContext.md`.
