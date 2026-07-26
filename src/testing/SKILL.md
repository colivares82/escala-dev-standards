---
name: testing
description: Testing standards for both client and server — frameworks, the AAA pattern, when a test is required, minimum counts, factories, and the CI gate. Use this whenever writing or updating tests, adding a service/hook/component/endpoint, fixing a bug (regression test), or setting up a project's test suite. Every code change ships with a test update; load this to know what and how to test.
---

# Testing Standards

Tests are co-located with the code they cover and ship in the same change. Failed tests block
deployment.

## Frameworks
| Framework | Scope |
|-----------|-------|
| **Vitest** + React Testing Library + **MSW** | client unit/component |
| **Jest** + NestJS Testing | server unit/integration |
| **Playwright** | end-to-end |

## When a test is required
- Every new service / hook / component / endpoint.
- Every bug fix → a regression test that fails before the fix.
- Every modified business logic → updated assertions.

## What each test file covers
1. Happy path · 2. Error handling (API failure, validation) · 3. Edge cases (empty, boundary)
· 4. Loading/async states · 5. Role-based behavior (where applicable).

## Pattern: Arrange–Act–Assert
Keep tests readable and isolated; mock the layer below (repository for services, MSW for hooks).
Examples: `references/patterns.md`.

## Minimum counts & coverage
Per-artifact minimums and coverage targets: `references/coverage.md`.

## Test data
Use factories, not inline literals, for entities. See `references/factories.md`.

## Organization
```
client/src/tests/{unit,integration,e2e,mocks,utils}
server/src/<module>/__tests__/<module>.{service,repository}.spec.ts
```

## CI gate
Tests run on every PR (GitHub Actions); they must pass before deploy. Never merge red.

## Commands
```bash
cd server && npm test          # Jest
cd client && npm test          # Vitest
cd client && npm run test:e2e  # Playwright (needs servers running)
# coverage: npm run test:coverage in either package
```
