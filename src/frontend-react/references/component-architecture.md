# Component Architecture — in-project reuse

The goal: zero duplicated UI. Every visual element is a reusable component, defined once and
composed everywhere. No published package — this lives inside each project's `client/`.

## Three layers

```
client/src/components/
├── ui/        # primitives — Button, Label, Card, Input, Badge, Dialog, Select...
│              # built on Radix/shadcn + design tokens. The ONLY place these are defined.
├── common/    # shared composites used across features — PageHeader, DataTable,
│              # ConfirmDialog, EmptyState, FilterBar...
└── <feature>/ # feature-specific components that COMPOSE ui/ + common/, never re-style primitives
```

## Rules

1. **Primitives are defined once** in `components/ui/`. Pages and features import them; they
   never hand-roll a styled `<button>` or `<div class="card">`.
2. **Global UX singletons.** Cross-cutting feedback is one shared system used app-wide:
   - one toast/notification system (`useToast`) — not a bespoke toast per page,
   - one notification bell, one confirm dialog, one loading/skeleton convention.
3. **Promote on second use.** The moment a piece of UI appears twice, extract it to `common/`
   (or `ui/` if it's a primitive). Duplication is the trigger to refactor.
4. **Compose, don't restyle.** Feature components assemble primitives and pass props/variants.
   If a new variant is needed, add it to the primitive — don't fork it inline.
5. **Tokens, not hex.** Every shared component styles via design tokens so one theme change
   propagates everywhere (see design-tokens.md).

## Why no separate package
A published library (e.g. `@org/ui`) makes sense only for cross-project reuse. Within a single
project, the `components/ui/` layer gives the same single-source benefit with zero versioning
overhead — and shadcn's copy-in model fits this exactly.
