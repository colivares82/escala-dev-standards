---
name: battle-tested-patterns
description: Hard-won implementation patterns and gotchas that are expensive to rediscover — distributed locking with Prisma, authenticated SSE, server-side PDF generation, and immutable sequential numbering. Use this whenever implementing a distributed/critical-section lock, real-time SSE updates, PDF export, or gap-free sequential ids/codes. Load the matching reference before building any of these; each one encodes a specific failure that already bit us once.
---

# Battle-Tested Patterns

A small library of patterns where the obvious approach fails. Read the relevant reference
before implementing — each captures a real failure and its fix.

| Building... | Read | The trap it avoids |
|-------------|------|--------------------|
| A lock / critical section over Postgres | `references/distributed-lock.md` | `pg_advisory_lock` silently breaks under Prisma's pool |
| Real-time push to the browser | `references/sse-auth.md` | `EventSource` can't send `Authorization` |
| Server-side PDF export | `references/puppeteer-pdf.md` | asset paths, Tailwind, memory, embedded images |
| Sequential ids/codes (INV-YYYY-NNN) | `references/sequential-numbering.md` | gaps, races, reassignment |

These are on-demand by design — they don't belong in every context window, only when the
matching feature is in play.
