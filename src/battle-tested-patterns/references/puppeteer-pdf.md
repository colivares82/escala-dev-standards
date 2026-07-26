# Server-side PDF (Handlebars + Puppeteer)

## Recipe
- **`puppeteer-core`** + **system Chromium** (never the bundled download). In Docker:
  `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`; locally auto-detect Chrome.
- **Handlebars** templates render HTML; Puppeteer prints to PDF.
- **Inline CSS only** — Puppeteer does not process Tailwind; all colors/styles inline in the
  template.
- **Self-contained**: embed images as base64 (fetch bytes via the storage service) so the PDF
  has no external dependencies.
- **Asset paths via `process.cwd()`**, not `__dirname` — compiled output and copied assets sit
  in different `dist/` subtrees.
- **Memory**: Cloud Run ≥ 1Gi; launch args `--no-sandbox --disable-setuid-sandbox
  --disable-dev-shm-usage --disable-gpu`.

## The traps this avoids
- Tailwind classes silently doing nothing in the PDF (→ inline CSS).
- Images missing when the file is moved/emailed (→ base64 embed).
- `__dirname`-based template paths breaking once compiled (→ `process.cwd()`).
- OOM crashes under load (→ 1Gi + the launch args).

## nest-cli asset copying
Ensure `.hbs` and image assets are copied to `dist/` (`assets` in `nest-cli.json`,
`deleteOutDir: false`) — see infra-deploy-gcp/docker.md.
