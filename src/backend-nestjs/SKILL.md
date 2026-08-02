---
name: backend-nestjs
description: Mandatory standards for all NestJS/TypeScript backend code in server/. Use this whenever creating or editing a backend module, controller, service, repository, DTO, guard, or Prisma query — or when reviewing backend code. Enforces Controller→Service→Repository, all Prisma confined to repositories, ≤350-line files (10% tolerance, hard cap 385), DTO validation, the NestJS exception map, RBAC guards, soft delete, and the anti-patterns to avoid. Read before writing any server/ code.
---

# Backend Standards (NestJS)

Applies to all code in `server/`. Inherits engineering-foundations; adds backend specifics.

## The pattern: Controller → Service → Repository

```
Request → Controller (HTTP only: routing, guards, validation)
        → Service (business logic, orchestration)
        → Repository (ALL Prisma queries / data access)
        → Response
```

- **Controllers**: routing, param extraction, guards, response shaping. **No business logic,
  no Prisma.**
- **Services**: business rules and orchestration. Delegate data access to repositories.
- **Repositories**: **every** Prisma call lives here. No `prisma.*` outside `*.repository.ts`.

## Module structure

```
server/src/<module>/
├── <module>.controller.ts        # HTTP layer (max 290 lines)
├── <module>.service.ts           # business logic (max 350 lines)
├── <module>.module.ts            # DI registration (~30 lines)
├── dto/
│   ├── index.ts                  # barrel export
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   └── <entity>-filter.dto.ts
├── repositories/
│   └── <module>.repository.ts    # ALL Prisma (max 235 lines)
├── services/                     # sub-services when service > 350 lines
│   └── <domain>.service.ts
└── __tests__/
    ├── <module>.service.spec.ts
    └── <module>.repository.spec.ts
```

Copyable skeleton: `references/module-template/`.

## DTOs & validation
All inputs validated via DTOs with `class-validator` decorators. Never accept `any` request
bodies. Filter/query params get their own `*-filter.dto.ts`.

## Error handling
Use NestJS built-in exceptions consistently — full map and examples in
`references/error-handling.md`. Never catch-and-swallow; let the exception layer respond.

## Security & RBAC
Controllers use `@UseGuards(JwtAuthGuard, RolesGuard)` (both, always) + `@Roles(...)` +
`@CurrentUser()`. Data is filtered by role (admin sees all; owner-scoped roles see only their
own; org-scoped roles see only their organization's records). Details and the filtering matrix:
`references/security-rbac.md`.

## Soft delete
All master-data entities use a `deletedAt` field. Default queries exclude soft-deleted rows.
No hard deletes of business data.

## No hardcoded values
URLs, ports, secrets, timeouts → `.env` + `ConfigService`. Roles → the shared `UserRole` enum,
never string literals.

## Naming
- Files: `kebab-case` (`clients.service.ts`, `clients.repository.ts`).
- Classes: `PascalCase` + suffix (`ClientsController`, `ClientsService`, `ClientsRepository`,
  `CreateClientDto`, `ClientsModule`).
- Methods: CRUD `findAll/findOne/create/update/remove`; domain verbs (`finalize`, `approve`);
  queries `findBy<Field>`.
- Endpoints: plural resources (`/clients`), actions as `PATCH /:id/<action>`
  (`/reports/:id/finalize`), nesting `/<parent>/:id/<child>`.

## Anti-patterns

| Don't | Do |
|-------|----|
| Prisma in controllers/services | Prisma in repositories |
| Business logic in controllers | Business logic in services |
| `any` request params | Typed DTOs |
| String literals for roles | `UserRole` enum |
| God services (350+ lines) | Extract sub-services + repositories |
| `console.log` | NestJS `Logger` |
| Skip tests for "simple" changes | Test every change |

## Pre-commit
- [ ] Files ≤ 350 lines target (hard cap 385 = +10%); controller ≤ 290, service ≤ 350, repository ≤ 235 · no Prisma outside repositories · no business logic in controllers
- [ ] All inputs DTO-validated · RBAC guards in place · no `any` · no hardcoded values
- [ ] Tests updated · `npm run build` passes · `npm test` passes
