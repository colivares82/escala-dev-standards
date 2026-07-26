# GUIDE — Using Escala Dev Standards in a Project

How to consume these standards as a **versioned dependency** in any project — including
retrofitting an existing one (Magupell) and starting new ones from day zero. `README.md`
defines *what* the skills are; this defines *how to use them*.

---

## The model

```
escala-dev-standards (GitHub, versioned)   ← single source of truth you own
        │  npm i -D github:...#vX.Y.Z
        ▼
<project>/node_modules/escala-dev-standards
        │  npx escala-standards-sync   (automated via postinstall)
        ▼
<project>/.clinerules/*.md   → Cline auto-loads every session (always-on rules)
<project> skills             → npx skills add colivares82/escala-dev-standards (on-demand)
```

- **You edit only this repo.** Projects consume a pinned version; updating = bump + sync.
- **Sync is safe by design**: only files carrying the generated marker are ever overwritten
  or removed. Hand-written `.clinerules` files (project domain rules) are never touched.
- **`dist/` is generated** from `src/` by `npm run build`; CI (`verify-build.yml`) fails any
  push where `dist/` is stale, so consumers can never pull drifted rules.

---

## Step 0 — Publish the repo (one time)

```bash
unzip escala-dev-standards.zip && cd escala-dev-standards
git remote add origin git@github.com:colivares82/escala-dev-standards.git
git branch -M main && git push -u origin main
git tag v1.0.0 && git push --tags
```

> If you use a different GitHub name than `colivares82/escala-dev-standards`, find-replace
> that string across the repo (GUIDE, build.sh pointer stubs) before pushing.

---

## Step 1 — Add as a dependency (any project)

```bash
cd <project>
npm i -D github:colivares82/escala-dev-standards#v1.0.0
```

Then in the project's `package.json`:

```jsonc
{
  "scripts": {
    "standards:sync": "escala-standards-sync",
    "postinstall": "escala-standards-sync"        // ← automation: every npm install re-syncs
  },
  // optional — omit to sync ALL rules:
  "escalaStandards": {
    "rules": ["engineering-foundations", "agentic-workflow", "backend-nestjs",
              "frontend-react", "testing"]
  }
}
```

Run it once: `npm run standards:sync`. Commit the resulting `.clinerules/*.md` so the project
is self-contained and reviewable.

**On-demand skills** (full SKILL.md + references, loaded when relevant):

```bash
npx skills add colivares82/escala-dev-standards
```

The skills CLI reads the `src/<skill>/SKILL.md` tree directly — same command as any
third-party skill (e.g. `npx skills add mattpocock/skills` for Grill Me).

---

## Step 2 — Retrofit Magupell (migration)

Magupell already has hand-written `.clinerules`. The sync never touches them — but some are
now **superseded** by generated rules and should be removed manually to avoid two always-on
documents saying overlapping things:

| Existing Magupell file | Action | Superseded by |
|---|---|---|
| `Backend-Development-Standards.md` | **Remove** | `backend-nestjs.md` (generated) |
| `Frontend-Development-Standards.md` | **Remove** | `frontend-react.md` (generated) — note: canonicalized on native `fetch`, matching the shipped code, not the old axios examples |
| `Infrastructure-Standards.md` | **Remove** | `infra-deploy-gcp.md` (pointer) + on-demand skill |
| `EveryNewTask.md` | **Remove** | `agentic-workflow.md` (generated) |
| `MemoryBank.md` | **Remove** | `agentic-workflow.md` (generated) |
| `Mapugell Context and Principles.md` | **KEEP** | project domain — exactly what should stay hand-written |
| `Mapugell Req Funcional.md` / `Req No Funcional.md` | **KEEP** | project requirements |

Sequence:

```bash
cd magupell
npm i -D github:colivares82/escala-dev-standards#v1.0.0
git rm .clinerules/Backend-Development-Standards.md \
       .clinerules/Frontend-Development-Standards.md \
       .clinerules/Infrastructure-Standards.md \
       .clinerules/EveryNewTask.md .clinerules/MemoryBank.md
npm run standards:sync          # generated rules land in .clinerules/
npx skills add colivares82/escala-dev-standards
git add -A && git commit -m "Adopt escala-dev-standards v1.0.0 as always-on rules"
```

Magupell's `memory-bank/`, `docs/`, and specs stay exactly as they are — the skills describe
the same patterns the project already follows, so no code changes are required.

---

## Step 3 — New projects (from day zero)

1. Scaffold the monorepo per `engineering-foundations/references/repo-layout.md`
   (`client/` · `server/` · `shared/`).
2. `npm i -D github:colivares82/escala-dev-standards#v1.0.0` + the `postinstall` script above.
3. `npm run standards:sync` → all 8 rules land in `.clinerules/`.
4. `npx skills add colivares82/escala-dev-standards` (+ third-party: `mattpocock/skills`,
   `obra/superpowers`, `shadcn/ui`).
5. Create `memory-bank/` from `src/agentic-workflow/references/memory-bank-templates/`.
6. First Cline session: it reads `.clinerules` automatically + the Memory Bank per the
   agentic-workflow rule.

---

## Keeping everything consistent (the update loop)

When you learn something new on any project:

1. **Edit `src/` in this repo** (never the copy inside a project).
2. `npm run build` → regenerates `dist/clinerules` (CI enforces this).
3. Commit, push, **tag** (`git tag v1.1.0 && git push --tags`).
4. In each project, when ready to adopt:
   ```bash
   npm i -D github:colivares82/escala-dev-standards#v1.1.0   # bump the pin
   # postinstall runs escala-standards-sync automatically → .clinerules updated
   git diff .clinerules && git commit -am "standards v1.1.0"
   ```

Projects adopt on their own schedule (pinned tags), diffs are reviewable in git, and Cline
always sees whatever version the project has committed — no manual copying, no drift.

---

## Recommended third-party skills (skills.sh)

| Skill (repo) | Why |
|---|---|
| `mattpocock/skills` → grill-me, diagnose, to-prd, handoff, write-a-skill | TS-expert workflow; Grill Me as planned |
| `obra/superpowers` → systematic-debugging, writing-plans, verification-before-completion | Agentic operating loop; pairs with `agentic-workflow` |
| `shadcn/ui` → shadcn | Official patterns for the component layer |
| `anthropics/skills` → skill-creator, frontend-design | Skill authoring + design polish |

Overlap warning: `vercel-react-best-practices` and `webapp-testing` overlap `frontend-react` /
`testing` — cherry-pick; your stack-coupled rules win for standards. The directory has no good
GCP + Prisma + NestJS coverage — that's exactly why those skills are owned here.
