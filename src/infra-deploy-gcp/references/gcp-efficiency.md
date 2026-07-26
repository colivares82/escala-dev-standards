# GCP — efficient configuration (cost + performance)

## Cloud Run
- **min-instances**: `0` on dev (scale to zero, no idle cost); `>=1` on prod for hot paths to
  avoid cold starts.
- **max-instances**: cap to bound cost and protect the database from connection storms.
- **concurrency**: tune per workload; lower it for memory-heavy requests.
- **memory**: 1Gi minimum where Puppeteer/Chromium runs (PDF); otherwise size to the service.
- **CPU**: default (throttled when idle) unless a background job needs always-on CPU.
- **region**: pin to one region (e.g. `europe-west1`) for EU/GDPR and to keep Cloud SQL local.

## Cloud SQL (PostgreSQL)
- Right-size the instance tier; start small, scale on evidence.
- **Enable automated daily backups** and verify them in the console.
- Connect via Cloud SQL Proxy / connector — no public IP exposure.
- Same region as Cloud Run.

## Cloud Storage (GCS)
- **Standard** class for active files (photos, uploads).
- **Lifecycle rules** to auto-expire transient objects (e.g. old snapshots).
- **Signed URLs** for direct browser up/download — keep buckets private.
- **CORS** configured for the app domains (run the bucket-CORS script after domain changes).
- Compress images client-side before upload to cut storage + egress + mobile bandwidth.

## Secrets
All secrets in Secret Manager, injected as Cloud Run env vars via CI/CD. Never in code/config.
