# Docker

## Principles
- **Multi-stage builds**: build stage compiles; runtime stage is slim (`node:20-slim`).
- **System Chromium for PDF**: install Debian Chromium and set
  `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`; use `puppeteer-core` (never download Chrome).
- **Client image**: build the Vite app, serve via nginx (`client/nginx.conf`), expose `/health`.
- **Server image**: copy `dist/`, Prisma client, and `.hbs`/asset files; run `node dist/...`.
- Keep `.dockerignore` at root (excludes `node_modules`, tests, docs from build context).

## Puppeteer launch args
`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`.
Cloud Run memory ≥ 1Gi (Chromium is memory-hungry).

## nest-cli asset copying (server)
```json
{ "compilerOptions": {
    "deleteOutDir": false,
    "assets": ["**/*.prisma", "**/*.hbs", "pdf/assets/**"],
    "watchAssets": true } }
```
`deleteOutDir: false` avoids a race with `--watch`; assets (.hbs, images) must land in `dist/`.
Template paths resolve via `process.cwd()`, not `__dirname` (see battle-tested-patterns).
