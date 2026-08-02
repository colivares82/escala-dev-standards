---
name: testing
description: Testing standards for both client and server — frameworks, the AAA pattern, when a test is required, the ENFORCED 70% coverage gate, factories, and the CI gate. Use this whenever writing or updating tests, adding a service/hook/component/endpoint, fixing a bug (regression test), configuring coverage thresholds, or setting up a project's test suite. Every code change ships with a test update; no build or deploy happens below the coverage floor.
---

# Testing Standards

Tests are co-located with the code they cover and ship in the same change. **Coverage below
the floor fails the run — locally and in CI — which blocks the build and the deploy.**

## Frameworks
| Framework | Scope |
|-----------|-------|
| **Vitest** + React Testing Library + **MSW** | client unit/component |
| **Jest** + NestJS Testing | server unit/integration |
| **Playwright** | end-to-end |

## Coverage gate — ENFORCED
- **Minimum acceptable: 70%** (lines, statements, functions, branches) per package.
- The threshold is configured **in the tool config** (`jest.config.js` coverageThreshold,
  `vitest.config.ts` coverage.thresholds) so `npm test` itself fails below 70 — the same
  command CI runs, so a red suite can never build or deploy.
- 70% is the floor, not the goal — aim for the 80%+ targets in `references/coverage.md`.
- Config snippets and per-artifact targets: `references/coverage.md`.

## What kinds of tests
- **Unit tests: mandatory** for every service, hook, component, and endpoint.
- **Integration tests: included whenever feasible** — multi-component flows on the client,
  controller→service→repository flows on the server. Prefer adding one per feature.
- **Regression test for every bug fix** — it must fail before the fix.
- E2E (Playwright) for the critical user journeys once the app has them.

## What each test file covers
1. Happy path · 2. Error handling (API failure, validation) · 3. Edge cases (empty, boundary)
· 4. Loading/async states · 5. Role-based behavior (where applicable).

## Pattern: Arrange–Act–Assert
Mock the layer directly below (repository for services, MSW for hooks/components). Examples:
`references/patterns.md`.

## Test data
Use factories, not inline literals: `references/factories.md`.

## Organization
```
client/src/tests/{unit,integration,e2e,mocks,utils}
server/src/<module>/__tests__/<module>.{service,repository}.spec.ts
```

## CI gate
GitHub Actions runs `npm run test:coverage` for both packages on every PR and before every
build. **Tests failing OR coverage < 70% ⇒ no build, no deploy.** See
infra-deploy-gcp/references/cicd.md and the workflow templates.

## Commands
```bash
cd server && npm run test:coverage   # Jest, enforces 70% via coverageThreshold
cd client && npm run test:coverage   # Vitest, enforces 70% via coverage.thresholds
cd client && npm run test:e2e        # Playwright (needs servers running)
```
