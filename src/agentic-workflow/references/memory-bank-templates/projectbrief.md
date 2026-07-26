# Project Brief

**Last Updated**: <date>

## Project
**Name**: <name>
**Owner**: <owner>
**Repository**: <git url>

## Goal
<one-paragraph statement of what this builds and for whom>

## Scope
### In scope
- <feature/module>
### Out of scope (for now)
- <deferred>

## Key constraints
- <e.g. GDPR / EU data, tablet-first, target browsers, no native app>

## Architecture decisions
- Monorepo: client + server + shared
- Stack: React 18 + NestJS 11 + PostgreSQL + Prisma + JWT (see engineering-foundations)
- Patterns: Controller→Service→Repository (BE), Component→Hook→Service (FE)
- Deployment: GCP Cloud Run + GitHub Actions CI/CD
