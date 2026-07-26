# Design Tokens

All UI styling uses CSS custom properties from `client/src/styles/globals.css`, consumed via
Tailwind classes. **Never hardcode hex colors.**

## Token families
- Colors: `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, ...
- Tailwind mapping: `bg-background`, `text-foreground`, `border-border`, ...
- Charts: `--chart-1` … `--chart-5`
- Sidebar: dedicated `--sidebar-*` tokens
- Dark mode: every token has a `.dark` variant — dark mode is automatic, no per-component work.

## Rules
- Style via Tailwind token classes, not raw hex or inline styles.
- One theme change in `globals.css` must propagate everywhere (it will, if tokens are used).

## The one documented exception
Interactive selected-states on buttons may use explicit Tailwind color classes
(`bg-green-600`, `bg-red-600`) because shadcn's `variant="outline"` overrides token CSS
variables. This is the *only* sanctioned place for non-token colors; document any other at the
point of use.
