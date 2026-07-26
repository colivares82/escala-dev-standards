---
name: frontend-react
description: Mandatory standards for all React/TypeScript frontend code in client/. Use this whenever creating or editing a component, hook, page, or frontend service, styling UI, or reviewing client code. Enforces Component→Hook→Service, component ≤200 / hook ≤80 lines, design tokens (never hardcoded hex), native fetch (no axios), the constants/config layers, and the in-project "every UI element is a reusable component" discipline. Read before writing any client/ code.
---

# Frontend Standards (React)

Applies to all code in `client/`. Inherits engineering-foundations; adds frontend specifics.

## The pattern: Component → Hook → Service

```
UI Component (orchestrator, max 200 lines)
 → Custom Hook (state + logic, max 80 lines)
   → API Service (HTTP via fetch)
     → Backend API
```

- **Components** render and orchestrate. Keep them thin; push logic into hooks.
- **Hooks** hold state and logic. One concern per hook; split when over 80 lines.
- **Services** make HTTP calls via **native `fetch`** (no axios) against `config/api.config.ts`.

## File-size limits
Component ≤ **200** · Hook ≤ **80** · any file ≤ **300**. Over the limit → extract
sub-components / split the hook / pull out utilities.

## Reusable components (in-project DRY-for-UI)
Every UI element is a reusable component used consistently everywhere — not redefined per page
or flow. One shared primitives layer, global UX singletons (one toast, one notification bell,
one confirm dialog), and "promote on second use". Full discipline:
`references/component-architecture.md`. **This is the single most important frontend rule.**

## Styling — design tokens only
Never hardcode hex colors. All styling flows through CSS custom properties in
`styles/globals.css`, consumed via Tailwind classes (`bg-background`, `text-foreground`).
Dark mode is automatic via token variants. Details + the one documented exception:
`references/design-tokens.md`.

## No hardcoded values
API URLs and endpoints → `config/api.config.ts`. Magic numbers, strings, routes, options →
`constants/*`. Details: `references/constants-layer.md`.

## Types
No `any`. Use precise types; share cross-stack types from `shared/`. Frontend-only types live
in `client/src/types/`.

## Folder structure
`config/` · `constants/` · `contexts/` · `hooks/` · `pages/` · `services/` · `components/`
(`ui/` primitives, `common/` shared composites, feature folders) · `styles/` · `types/` ·
`utils/` · `tests/`. Details: `references/folder-structure.md`.

## Naming
- Components: `PascalCase.tsx`. Hooks: `useThing.ts`. Services: `thingService.ts`.
- One component per file; default export the component.

## SSE / streaming
Native `EventSource` can't send auth headers — use `fetch` + `ReadableStream`. See
battle-tested-patterns → `sse-auth.md`.

## Pre-commit
- [ ] Component ≤200, hook ≤80, file ≤300
- [ ] No hardcoded hex (tokens only) · no hardcoded URLs/strings (config/constants)
- [ ] Shared primitives reused (no re-rolled buttons/cards/toasts) · no `any`
- [ ] Tests updated
