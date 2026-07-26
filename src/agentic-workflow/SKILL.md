---
name: agentic-workflow
description: How the agent operates on an Escala project across sessions — the Memory Bank system, the spec-driven development loop, the per-task pre-flight, and the docs taxonomy. Use this at the START of every task and whenever beginning, resuming, or planning work, when asked to "update memory bank", when writing a spec or wireframe, or when scaffolding a new project's documentation. This is the operating manual; read it before touching code.
---

# Agentic Workflow

The operating manual for working on an Escala project. It exists because the agent's memory
resets between sessions — the Memory Bank is the only link to prior work, so it must be read
first and kept accurate.

## Memory Bank

A `memory-bank/` folder of Markdown files is the persistent project context. **Read ALL core
files at the start of EVERY task** — not optional.

Six core files, in hierarchy (each builds on the ones above):

1. `projectbrief.md` — foundation: scope, goals, requirements. Source of truth for scope.
2. `productContext.md` — why the project exists, problems solved, UX goals, workflows.
3. `systemPatterns.md` — architecture, key technical decisions, patterns in use.
4. `techContext.md` — technologies, setup, constraints, dependencies (mirrors the stack).
5. `activeContext.md` — current focus, recent changes, next steps, active decisions. Most
   dynamic file; keep it current.
6. `progress.md` — what works, what's left, status, known issues.

Templates for all six: `references/memory-bank-templates/`.

### Update protocol
Update the Memory Bank when: discovering a new pattern, after a significant change, when the
user says **"update memory bank"** (then review ALL files, even unchanged ones), or when
context needs clarifying. Focus on `activeContext.md` and `progress.md` — they track the
present. Never let `activeContext.md`/`progress.md` drift from reality.

## Spec-driven development loop

The agent writes **specs and wireframes only**; implementation follows the spec. The cycle:

1. **Spec first** — write/review the spec before any code. **All implementation specs are
   written in English**, regardless of conversation language. Specs live in `specs/`.
2. **Wireframe (UI changes)** — generate a standalone HTML wireframe at `specs/mockups/`
   (e.g. `specs/mockups/wireframe-<feature>.html`) and reference it by path from the spec.
3. **Implement** — follow the spec + the relevant layer standards strictly.
4. **Test** — write unit/integration tests alongside the code (never after).
5. **Update traceability** — mark addressed requirements in
   `docs/REQUIREMENTS_TRACEABILITY.md`.
6. **Update Memory Bank** — if significant patterns or decisions emerged.

## Every-new-task pre-flight

Before starting any implementation task:
1. Read the Memory Bank (`memory-bank/`).
2. Check the backlog (`docs/BACKLOG.md`) for the current step + dependencies.
3. Read requirements (`docs/REQUIREMENTS_TRACEABILITY.md`) for what's being addressed.
4. Read architecture (`docs/ARCHITECTURE.md`) for patterns and decisions.
5. Follow the standards (the `.clinerules/` pulled from escala-dev-standards).
6. Read the relevant spec.
7. Include tests.

## Docs taxonomy

Keep docs single-sourced and cross-linked, each with one job:
- `ARCHITECTURE.md` — system design, patterns, tech decisions.
- `BACKLOG.md` — all pending work by priority (the "what's next" source of truth).
- `CHANGELOG.md` — history of completed work.
- `REQUIREMENTS_TRACEABILITY.md` — every requirement with status.
- `FUNCTIONAL_GUIDE.md` — what the system does by user role.
- `DATABASE_SCHEMA.md` · `TESTING_GUIDE.md` · `DEPLOYMENT.md` — as needed.

Each doc links to its siblings rather than repeating them.
