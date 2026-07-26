# Constants & Config Layer (no hardcoding, frontend)

## config/
- `config/api.config.ts` — API base URL (from `VITE_API_URL`) and endpoint builders. No URL
  strings scattered in services.
- `config/app.config.ts` — app-level config/flags.

```typescript
// config/api.config.ts
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
export const api = {
  base: BASE,
  reports: `${BASE}/api/reports`,
  report: (id: string) => `${BASE}/api/reports/${id}`,
};
```

## constants/
One module per concern: `validation.ts`, `ui.ts`, `routes.ts`, `notifications.ts`, etc.
- Magic numbers (limits, timeouts, page sizes) → named constants.
- User-facing strings → constants (also the seam for future i18n).
- Route paths → `routes.ts`, never inline string literals.

## Services use config, not literals
```typescript
// services/reportsService.ts
import { api } from '@/config/api.config';
export async function fetchReports(token: string) {
  const res = await fetch(api.reports, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
```
No axios — native `fetch` everywhere, including SSE (see battle-tested-patterns/sse-auth.md).
