# Immutable Sequential Numbering

For human-facing identifiers like `INSP-2026-00142` or `RES-ACME-2026-03`.

## Rules
- **Assigned once, never reassigned.** Once a record has a number, it is immutable — even if the
  record is later rejected or soft-deleted. Numbers are a permanent audit anchor.
- **Gap-free per scope.** Sequence resets per scope (per year, or per client+year, etc.).
  Define the scope explicitly.
- **Race-safe.** Two concurrent creates must not get the same number. Generate inside a
  transaction with a row lock or an atomic counter — never "max(n)+1" read-then-write outside a
  transaction.

## Pattern
```typescript
// Inside a transaction: lock the per-scope counter row, increment, format.
const next = await tx.$queryRaw<{ value: number }[]>`
  UPDATE counters SET value = value + 1
  WHERE scope = ${scope} RETURNING value`;
const code = `INSP-${year}-${String(next[0].value).padStart(5, '0')}`;
```

- Persist a `counters(scope, value)` table; one row per scope.
- Format (prefix, padding) is a constant, not scattered string-building.
