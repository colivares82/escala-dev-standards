# Coverage — enforced floor, targets, and configuration

## The enforced floor: 70%
70% (lines, statements, functions, branches) is the **minimum acceptable** coverage per
package. It is enforced in the tool configuration, so the plain test command fails below it —
locally, in pre-commit, and in CI (where it gates the build).

### Jest (server) — `server/jest.config.js`
```javascript
module.exports = {
  // ...
  collectCoverage: false, // enabled by the test:coverage script
  coverageThreshold: {
    global: { lines: 70, statements: 70, functions: 70, branches: 70 },
  },
};
```
```jsonc
// server/package.json
"scripts": { "test:coverage": "jest --coverage" }
```

### Vitest (client) — `client/vitest.config.ts`
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: { lines: 70, statements: 70, functions: 70, branches: 70 },
    },
  },
});
```
```jsonc
// client/package.json
"scripts": { "test:coverage": "vitest run --coverage" }
```

## Targets (aim above the floor)
| Layer | Target |
|-------|--------|
| Backend services | 80%+ |
| Backend repositories | 80%+ |
| Frontend hooks | 80%+ |
| Frontend services | 90%+ |
| Frontend components | 70%+ |
| Overall new code | 80%+ |

## Minimum tests per file
| Type | Minimum |
|------|---------|
| Backend service | 8 |
| Backend repository | 5 |
| Backend sub-service | 5 |
| Backend controller | 3 |
| Frontend hook | 5 |
| Frontend service | 5 |
| Frontend component | 3 |

Never lower a configured threshold to make a change pass — add the missing tests. Coverage is
a floor; meaningful assertions beat line-count.
