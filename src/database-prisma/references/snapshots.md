# DB Snapshots (optional feature)

For projects that offer admin DB snapshot / restore / wipe.

## Shape
- A snapshot is a tarball: `pg_dump` of the database + a copy of uploaded files (e.g. from GCS),
  plus a manifest (schema version, created-at) for compatibility checks on restore.
- Lifecycle states as an enum: `GENERATING → UPLOADING → VALIDATING → READY / INVALID`.
- Operations: create (async background job + status polling), upload-from-disk (signed URL +
  manifest validation), download (signed URL), restore (drop + migrate + import), wipe
  (truncate), delete.

## Critical persistence constraint
The **snapshots table itself must survive a wipe/restore**. Exclude it from the `pg_dump`
used inside the operation, and preserve it (and admin accounts) across drop/migrate/import —
otherwise restoring one snapshot destroys the list of all the others.

## Restore ordering
Import the dump **first**, then UPSERT preserved rows (admins). The reverse order causes
duplicate-key errors.

## Locking
Guard every destructive operation with a **table-based singleton lock** (`_system_lock`), not
`pg_advisory_lock` — advisory locks are session-scoped and break under Prisma's connection
pool. Full pattern: battle-tested-patterns/distributed-lock.md. Audit-log all destructive ops.
