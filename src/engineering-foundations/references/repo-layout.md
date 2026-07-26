# Repository Layout

## Monorepo with npm workspaces

```
<project>/
├── package.json          # root: workspaces + central scripts
├── client/               # React SPA (Vite)            → Cloud Run (nginx)
├── server/               # NestJS API                  → Cloud Run (node)
├── shared/               # types / constants / validators shared by client + server
├── infrastructure/       # scripts, IaC, deploy (see infra-deploy-gcp)
├── docs/                 # ARCHITECTURE, BACKLOG, CHANGELOG, REQUIREMENTS_TRACEABILITY...
├── specs/                # implementation specs + specs/mockups/ wireframes
├── memory-bank/          # agent persistent context (see agentic-workflow)
└── .clinerules/          # always-on rules pulled from escala-dev-standards
```

## Each package owns its lifecycle

| Concern | Owned per package |
|---------|-------------------|
| Build | `client` (Vite) · `server` (Nest) · `shared` (tsc) |
| Dockerfile | `client/Dockerfile` · `server/Dockerfile` |
| Deploy target | separate Cloud Run service each |
| CI trigger | **path-filtered** — `client/**` only rebuilds the client, etc. |
| Tests | `client` (Vitest) · `server` (Jest) |

## Central orchestration (root `package.json`)

```jsonc
{
  "workspaces": ["client", "server", "shared"],
  "scripts": {
    "dev":   "concurrently -n client,server \"npm:dev -w client\" \"npm:dev -w server\"",
    "build": "npm run build -w shared && npm run build -w server && npm run build -w client",
    "test":  "npm run test -w server && npm run test -w client"
  }
}
```

- `npm run dev` boots client + server together (concurrently).
- `npm run build` builds in dependency order: `shared` → `server` → `client`.
- `shared` builds first because both others import it.

## Rules
- Cross-package code goes in `shared/` — never reach into another package's `src/`.
- Platform-pinned files stay where their tooling requires them (`.github/workflows/`,
  `client/Dockerfile`, `client/nginx.conf`, root `.dockerignore`); everything else
  infra-related lives in `infrastructure/` (see infra-deploy-gcp).
