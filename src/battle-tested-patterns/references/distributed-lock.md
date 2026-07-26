# Distributed Lock with Prisma

## The trap
`pg_try_advisory_lock` / `pg_advisory_unlock` are **session-scoped**. Prisma's connection pool
does not guarantee the same physical connection for acquire and release, so the unlock can land
on a different session, silently fail, and leave the lock **permanently stuck**. Do not use
advisory locks with Prisma.

## The pattern: table-based singleton lock
A single-row table acts as the lock. Acquire = insert the row; release = delete it. Stale locks
self-heal on the next acquire.

```sql
CREATE TABLE _system_lock (
  id         TEXT PRIMARY KEY DEFAULT 'global',
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```typescript
// Acquire: clear stale (>15 min) then insert the singleton; PK conflict => already locked
async acquire(): Promise<boolean> {
  await this.prisma.$executeRaw`
    DELETE FROM _system_lock WHERE acquired_at < now() - interval '15 minutes'`;
  try {
    await this.prisma.$executeRaw`
      INSERT INTO _system_lock (id) VALUES ('global')`;
    return true;
  } catch { return false; }          // unique violation => locked
}
// Release
async release(): Promise<void> {
  await this.prisma.$executeRaw`DELETE FROM _system_lock WHERE id = 'global'`;
}
```

- **Crash recovery** is automatic: the stale-cleanup on acquire frees a lock abandoned by a
  crashed process — no server restart needed.
- Return HTTP **409** when `acquire()` fails (operation already in progress).
- Use for all destructive system operations (snapshot restore/wipe, bulk migrations).
