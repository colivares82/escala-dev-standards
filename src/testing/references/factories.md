# Test Data Factories

Centralize entity construction so tests stay readable and resilient to schema changes.

```typescript
// client/src/tests/utils/factories.ts
export const createClient = (o: Partial<Client> = {}): Client => ({
  id: '1', name: 'Acme', code: 'ACME', deletedAt: null, ...o,
});
export const createReport = (o: Partial<Report> = {}): Report => ({
  id: 'r1', clientId: '1', status: 'DRAFT', ...o,
});
```

Usage:
```typescript
const client = createClient({ code: 'GUCCI' });
const report = createReport({ clientId: client.id, status: 'APPROVED' });
```

Provide a factory per entity type. Override only the fields a test cares about; defaults cover
the rest. Keep factory defaults valid (pass validation) so tests don't fail on unrelated fields.
