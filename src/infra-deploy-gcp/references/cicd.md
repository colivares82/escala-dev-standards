# CI/CD (GitHub Actions + WIF)

## Branch → environment (exact, no exceptions)
| Branch | Deploys to | Workflow |
|--------|-----------|----------|
| `dev` | Development (`<project>-dev`) | `deploy-dev.yml` |
| `main` | **Production** (`<project>-prod`) | `deploy-prod.yml` |
| any PR | nothing — tests only | `pr-checks.yml` |

Copyable templates: `workflow-templates/`. Optional prod safety: add required reviewers to
the GitHub `production` environment for a manual approval gate before the deploy job runs.

**Deploys are vars-activated, never blocking**: each deploy job carries
`if: vars.<ENV>_PROJECT_ID != ''`, so before an environment is provisioned only the test job
runs — pushes work from day zero. Provisioning (see `cloud-provisioning.md`) sets the vars,
which turns that environment's deploys on with zero workflow changes.

## Pipeline shape (both deploy workflows)
1. **Test job — the gate.** `npm run test:coverage` for server and client. Coverage
   thresholds (70%) live in the tool configs, so this job fails on red tests **or** coverage
   below the floor. `needs: test` makes it a hard gate: **no green gate ⇒ no build ⇒ no deploy.**
2. **Build** Docker images (client bakes `VITE_API_URL` for its environment).
3. **Push** to the environment's Artifact Registry.
4. **Deploy** to that environment's Cloud Run (never cross-project).
5. **Health check** on `/api/health` — failure fails the workflow (Cloud Run keeps serving
   the previous revision).
6. **Summary** to GitHub Step Summary.

## Branch protection (required)
- `main` and `dev`: require `pr-checks` to pass before merge; no direct pushes to `main`.
- This means the coverage gate runs twice — at PR time (merge gate) and at deploy time
  (build gate). Both are intentional.

## Keyless auth (WIF)
`google-github-actions/auth` exchanges the workflow's GitHub OIDC token for the environment's
**deployer SA** — separate SA per environment, scoped to `repo:<owner>/<repo>` (ideally per
branch). No JSON keys.

## Path-filtered triggers (optional optimization)
Split workflows per package with `paths: ['server/**', 'shared/**']` etc. so a client-only
change doesn't rebuild the server. Keep the test gate in each.

## Reserved vars
Never set `PORT`, `K_SERVICE`, or other Cloud Run-managed env vars.

## Environment independence checklist (CI view)
- Dev workflow references only `DEV_*` vars; prod only `PROD_*`. No shared secrets.
- Migrations per environment: `infrastructure/scripts/db-migrate.sh <env>` (Cloud SQL Proxy,
  `prisma migrate deploy`).
- Full prerequisites: `bootstrap.md`.
