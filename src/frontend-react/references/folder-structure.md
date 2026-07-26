# Frontend Folder Structure

```
client/src/
├── components/
│   ├── ui/         # primitives (defined once) — see component-architecture.md
│   ├── common/     # shared composites
│   └── <feature>/  # feature components (compose ui/ + common/)
├── config/         # api.config.ts, app.config.ts
├── constants/      # validation, ui, routes, notifications, ...
├── contexts/       # AuthContext, ThemeContext
├── hooks/          # custom hooks (≤80 lines each)
├── pages/          # route-level pages
├── services/       # API services (fetch)
├── styles/         # globals.css (design tokens)
├── types/          # frontend-only types
├── utils/          # pure helpers
└── tests/          # unit/, integration/, e2e/, mocks/, utils/
```

Conventions:
- A feature gets a folder under `components/<feature>/`; its data logic goes in a hook under
  `hooks/`, its API calls in a service under `services/`.
- Nothing reaches across feature folders — share via `common/`, `ui/`, `hooks/`, or `shared/`.
