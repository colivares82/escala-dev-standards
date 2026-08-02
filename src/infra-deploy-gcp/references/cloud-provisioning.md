# Cloud Provisioning — on-demand, interactive, consistent

Cloud setup is **not a blocker**. Development and GitHub pushes work from day zero: the CI
test gate runs on every push/PR, and the deploy jobs **skip themselves** until the target
environment is provisioned (they check for the environment's vars). Provisioning is a
separate act, triggered when the user asks — e.g. *"set up the cloud for this project"* /
*"provision dev"* — and when triggered it MUST follow this runbook so every project ends up
configured identically.

Environments provision independently: dev first is normal; prod when ready for go-live.

---

## Phase 0 — Interactive intake (grill-me style)

Before touching gcloud, interview the user. **One question at a time**, confirm the collected
plan back before executing anything billable or destructive. Never guess a value that costs
money or grants access.

Ask, in order (offer the default in brackets):
1. Which environment(s) now? [dev only / dev + prod]
2. Base project id? [`<repo-name>`] → derives `<base>-dev` / `<base>-prod` (confirm ids are
   available)
3. GCP billing account to attach? (list them: `gcloud billing accounts list`)
4. Region? [`europe-west1` — keep EU for GDPR unless stated otherwise]
5. GitHub repo (`owner/name`) for WIF binding? [detect from git remote]
6. Which resources does this project need? [Cloud SQL yes/no · GCS buckets (names?) ·
   SMTP/email yes/no · custom domains (which, per env)?]
7. Cloud Run sizing deviations from defaults? [dev: min 0 · prod: min 1 · 1Gi if PDF]

**Credentials & secrets are requested interactively at the moment they're needed** (SMTP
password, third-party API keys). They go **directly into Secret Manager** via stdin — never
into files, chat history summaries, `.env` committed files, or the Memory Bank.

```bash
printf '%s' "$VALUE_FROM_PROMPT" | gcloud secrets create SMTP_PASS --data-file=- --project <p>
```

Generated secrets (e.g. `JWT_SECRET`) are created, not asked: `openssl rand -base64 48`.

Confirm the full plan (projects, region, billing, resources, domains) and get an explicit
"yes" before Phase 1.

---

## Phase 1 — Provisioning sequence (per environment, in order)

Scripted under `infrastructure/scripts/` (gcp-setup.sh, gcp-secrets.sh,
gcp-github-secrets.sh); this is what those scripts must accomplish, each step verified before
the next.

1. **Project**: create `<base>-<env>`, attach billing, enable APIs (Run, SQL Admin, Storage,
   Artifact Registry, Secret Manager, IAM Credentials).
   Verify: `gcloud services list --enabled --project <p>`
2. **Service accounts + IAM**: runtime SA (`cloudsql.client`, bucket-scoped
   `storage.objectAdmin`, `secretmanager.secretAccessor`) and deployer SA (`run.admin`,
   `artifactregistry.writer`, `iam.serviceAccountUser` on runtime SA). **No cross-environment
   roles, ever.**
3. **WIF**: pool + GitHub OIDC provider restricted to `repo:<owner>/<repo>` (ideally per
   branch: `refs/heads/dev` ↔ dev, `refs/heads/main` ↔ prod); bind deployer SA. No JSON keys.
4. **Artifact Registry**: Docker repo in-region.
5. **Cloud SQL** (if needed): instance `<base>-db-<env>`, private connectivity, **automated
   daily backups enabled (verify)**; DB + app user; `DATABASE_URL` → Secret Manager.
   Verify: `db-migrate.sh <env>` applies migrations cleanly.
6. **GCS** (if needed): private buckets, Standard class, in-region, lifecycle rules for
   transient objects, CORS for the env's domains (`gcp-bucket-cors-update.sh <env>`),
   runtime SA scoped to own-project buckets only.
7. **Secret Manager**: all secrets for this env (`DATABASE_URL`, `JWT_SECRET`, `GCS_BUCKET`,
   `SMTP_*`, prod `CORS_ALLOWED_ORIGINS`). Dev and prod values always differ.
8. **GitHub side — this is what activates deploys**: set the environment's Actions vars
   (`<ENV>_PROJECT_ID`, `<ENV>_WIF_PROVIDER`, `<ENV>_DEPLOYER_SA`, `<ENV>_API_URL`,
   `GCP_REGION`) via `gcp-github-secrets.sh`. Enable branch protection (`dev`, `main`
   require `pr-checks`; no direct pushes to `main`).
9. **Activation check**: push a trivial change to the env's branch → coverage gate ✅ →
   build → deploy → `/api/health` returns `{status:"ok", database:"connected"}` → smoke test
   (upload, DB read/write, PDF if applicable) → uptime check + alert on `/api/health`.

Record completion (projects, resources, domains — never secret values) in
`memory-bank/techContext.md`.

---

## Consistency rules (apply to every provisioning, no exceptions)
- Two fully **independent** environments (separate projects, SAs, DBs, buckets, secrets).
- **Keyless** CI (WIF); secrets only in Secret Manager; interactive entry, straight to the vault.
- Same region per project; EU by default.
- Deploy activation is **vars-driven**: provisioning an env is what turns its deploys on —
  the workflows never change.
