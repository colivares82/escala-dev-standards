---
name: engineering-foundations
description: Core engineering principles and the version-locked tech stack shared by every Escala project. Use this whenever writing, reviewing, structuring, or scaffolding ANY code — backend, frontend, scripts, config — even when the user doesn't explicitly ask for "standards". It defines SOLID/DRY/SRP, the no-hardcoded-values rule, file-size limits, naming philosophy, the fixed stack, and the monorepo layout. Always-on baseline; the layer-specific skills (backend-nestjs, frontend-react, etc.) build on top of it.
---

# Engineering Foundations

The always-on baseline for all code in an Escala project. Layer skills assume these rules and
only add specifics. When a layer skill seems to conflict with this file, the layer skill wins
for its own domain; otherwise this file governs.

## Core principles

1. **No hardcoded values.** URLs, ports, secrets, magic numbers, timeouts, connection strings,
   colors, and user-facing strings never appear inline. Backend → `.env` + `ConfigService`.
   Frontend → `config/` + `constants/` + design tokens. If a literal would change between
   environments or be reused, it is a named constant.
2. **File-size limit.** Hard max **350 lines**, target **250–290**. When exceeded, extract:
   sub-services / repositories (backend), sub-components / hooks (frontend), utilities.
3. **Single Responsibility.** Each file, class, and function has one clear purpose. Controllers
   route, services orchestrate, repositories access data; components render, hooks hold logic,
   services call APIs.
4. **DRY.** Repeated logic becomes a shared utility or service. Repeated UI becomes a shared
   component (see `frontend-react`). The rule "promote on second use" applies everywhere.
5. **SOLID, composition over inheritance.** Depend on abstractions (interfaces), not
   implementations. Prefer composing small pieces over deep class hierarchies.
6. **Test co-location.** Every new or modified unit of logic ships with a test update in the
   same change. No "I'll add tests later".
7. **No `any`.** Use precise types, `unknown` at boundaries, or shared types from `shared/`.

## Naming philosophy

- Files and folders: `kebab-case`.
- Types, classes, components: `PascalCase`.
- Variables, functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`.
- Be descriptive over clever. A name should make the next reader's job easier.
- Layer-specific conventions (suffixes like `Service`/`Repository`/`Dto`, hook `use*`) live in
  the relevant layer skill.

## The stack

This stack is fixed across projects by design — skills are coupled to it. Do not introduce an
alternative for something the stack already covers without an explicit decision recorded in the
project's Memory Bank. Full version manifest: `references/tech-stack.md`.

Summary: TypeScript everywhere · React 19 + Vite (client) · NestJS 11 (server) · Prisma +
PostgreSQL · Tailwind CSS + shadcn/Radix · Vitest/Jest/Playwright · GCP Cloud Run.

## Repository layout

Monorepo with npm workspaces: `client/` · `server/` · `shared/`, each owning its build,
Dockerfile, deploy target, and CI trigger, with a central root `npm run dev` / `npm run build`.
Full layout, workspace wiring, and path-filtered CI: `references/repo-layout.md`.

## Pre-flight (every change)

- [ ] Files under 350 lines
- [ ] No hardcoded values
- [ ] No `any`
- [ ] Tests updated alongside the code
- [ ] Single responsibility preserved (extract if a file is doing two jobs)
