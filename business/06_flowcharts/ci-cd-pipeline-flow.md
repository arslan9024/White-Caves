# CI/CD Pipeline Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-CICD-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active (partial — GitHub Actions pending)
> **Owner:** DevOps / Technology Department (Gwynne — Deployment Lead, Lisa — Cloud)
> **Scope:** Developer commit → lint/test → build → staging → manual production release

---

## 1. CI/CD Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WHITE CAVES CI/CD PIPELINE                     │
│                                                                     │
│  Developer                                                          │
│  Machine      → Pre-commit → GitHub → CI Pipeline → Deploy         │
│                 (Husky)     (PR/main)  (Actions)    (Vercel/Railway)│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Developer Workflow (Local)

```
Developer writes code
          │
          ▼
  git add .
  git commit -m "feat: add lead filtering"
          │
          ▼
  [Husky pre-commit hook]
  .husky/pre-commit runs:
          │
          ▼
  lint-staged:
  ├── ESLint: check all staged .ts / .tsx files
  ├── Prettier: format all staged files
  └── TypeScript: tsc --noEmit (type check only — no emit)
          │
          ├── Lint/format errors → Commit blocked
          │   Developer fixes → Retry commit
          │
          ▼
  Commit succeeds
          │
          ▼
  git push origin feature/my-branch
          │
          ▼
  Pull Request opened to main
```

---

## 3. GitHub Actions CI Pipeline (Phase 2 — Planned)

```
PR opened / push to main
          │
          ▼
  .github/workflows/ci.yml triggers:
  
  ┌─────────────────────────────────────────────────────────────┐
  │  JOB 1: lint-and-type-check                                │
  │  ─────────────────────────────────────────────────────────  │
  │  runs-on: ubuntu-latest                                     │
  │  node: 20.x                                                 │
  │                                                             │
  │  steps:                                                     │
  │  1. Checkout code                                          │
  │  2. npm ci (clean install from lockfile)                   │
  │  3. npx eslint . --ext .ts,.tsx                            │
  │  4. npx tsc --noEmit                                       │
  │  ── Fail: PR blocked, developer notified ──                │
  └─────────────────────────────────────────────────────────────┘
          │
          ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  JOB 2: test (runs after lint passes)                      │
  │  ─────────────────────────────────────────────────────────  │
  │  steps:                                                     │
  │  1. Checkout + npm ci                                      │
  │  2. Set environment: NODE_ENV=test, TEST_DB_URL=...        │
  │  3. npx vitest run (7,744 tests)                           │
  │  4. Upload coverage report artifact                        │
  │  ── Fail: PR blocked, test failure annotated ──             │
  └─────────────────────────────────────────────────────────────┘
          │
          ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  JOB 3: build (runs after tests pass)                      │
  │  ─────────────────────────────────────────────────────────  │
  │  steps:                                                     │
  │  1. Checkout + npm ci                                      │
  │  2. npm run build (Vite 7 + tsc)                           │
  │  3. Upload dist/ artifact (for deployment)                 │
  │  Build time target: < 20s                                  │
  │  ── Fail: PR blocked ──                                    │
  └─────────────────────────────────────────────────────────────┘
          │
          ▼
  All 3 jobs pass → PR shows green checkmarks
  Code review by team member required
  PR approved + merged to main
```

---

## 4. Staging Deployment Flow

```
Code merged to main
          │
          ▼
  .github/workflows/deploy-staging.yml triggers:
  
  Frontend:
  ├── Vercel auto-deploy (connected to main branch)
  ├── Build: npm run build (Vite)
  ├── Deploy to: staging.whitecaves.ae
  └── Preview URL generated + posted to PR
          │
          ▼
  Backend:
  ├── [Phase 2] GitHub Actions → deploy to Railway/Render
  ├── Environment: staging
  ├── Database: MongoDB Atlas Staging cluster
  ├── Prisma migrations: npx prisma migrate deploy
  └── API live at: staging-api.whitecaves.ae
          │
          ▼
  Smoke tests run:
  ├── Health check: GET /api/health → 200 OK
  ├── Auth check: POST /api/auth/login → 200
  └── DB check: GET /api/properties → 200 with data
          │
          ├── Smoke test fails → Rollback staging + alert team
          │
          ▼
  Staging validated by QA / developer
```

---

## 5. Production Release Flow

```
Staging validated
          │
          ▼
  Release tag created:
  git tag v1.2.0
  git push origin v1.2.0
          │
          ▼
  .github/workflows/deploy-production.yml triggers:
  (manual approval gate — requires MD or senior engineer sign-off)
          │
          ▼
  Pre-production checklist:
  ☐ All CI jobs passing on release tag
  ☐ Staging smoke tests passing
  ☐ Release notes written (CHANGELOG.md updated)
  ☐ Database migration tested on staging first
  ☐ Feature flags set correctly for production
  ☐ Rollback plan documented
          │
          ▼
  Production deployment:
  
  Frontend:
  ├── Vercel production build triggered
  ├── Build: npm run build
  └── Deploy to: whitecaves.ae
      (Zero-downtime: Vercel atomic deployment)
          │
          ▼
  Backend:
  ├── Blue-green deployment (Phase 7):
  │   Current: Blue (live traffic)
  │   New:     Green (deploy new version)
  │   Switch:  Load balancer routes to Green
  │   Old:     Blue kept warm for 30 min (instant rollback)
  │
  ├── Current Phase 2: Railway rolling restart
  │   → Brief restart (~5s downtime, acceptable)
          │
          ▼
  Database migration (if required):
  npx prisma migrate deploy
  ├── Non-destructive first (additive changes only)
  ├── Destructive migrations (column drops): maintenance window
  └── Rollback: Prisma migrate resolve --rolled-back
          │
          ▼
  Post-deploy verification:
  ├── Health checks × 3 environments
  ├── Sentry (Phase 2): error rate normal?
  ├── Prometheus (Phase 2): API latency normal?
  └── Test critical user flows: login, lead create, property view
          │
          ├── Issues detected → Rollback (Section 6)
          │
          ▼
  Release complete
  Release notes shared with team
  Changelog published
```

---

## 6. Rollback Procedure

```
Production issue detected
          │
          ▼
  Severity assessment:
  ├── CRITICAL (data loss, auth broken, payments failing)
  │   → Immediate rollback — no approval needed
  │
  ├── HIGH (major feature broken, 10%+ users affected)
  │   → Rollback within 30 minutes with MD notification
  │
  └── LOW/MEDIUM → Fix forward with hotfix (Section 7)
          │
          ▼
  ROLLBACK STEPS:
  
  Frontend:
  ├── Vercel dashboard: Instant Rollback to previous deployment
  └── Time to rollback: < 2 minutes
  
  Backend:
  ├── Trigger previous Railway deployment
  └── Time to rollback: < 5 minutes
  
  Database:
  ├── Non-destructive (additive migration): no DB rollback needed
  ├── Destructive migration: restore from Atlas backup
  │   → Point-in-time recovery: RTO 4h, RPO 1h
  └── Test: confirm API responds correctly after DB restore
```

---

## 7. Hotfix Flow

```
Critical bug found in production (not requiring rollback)
          │
          ▼
  Create hotfix branch:
  git checkout -b hotfix/fix-commission-rounding
          │
          ▼
  Minimal fix only (no feature additions)
          │
          ▼
  Hotfix CI runs (same pipeline — fast):
  ├── lint + type check
  ├── Targeted test run: npx vitest run src/...affected files
  └── Build verification
          │
          ▼
  MD or senior engineer reviews + approves
          │
          ▼
  Deploy directly to production (hotfix exception):
  ├── Tag: v1.1.1 (patch version bump)
  └── Bypasses staging delay (documented exception)
          │
          ▼
  Post-deploy monitoring × 30 minutes
  Merge hotfix back to main
```

---

## 8. Environment Variables Management

| Variable Category | Dev | Staging | Production |
|-----------------|-----|---------|-----------|
| Database | `.env.local` | Railway secrets | Railway secrets (prod) |
| JWT secret | `.env.local` | GitHub Secrets | GitHub Secrets (prod) |
| Firebase | `.env.local` | GitHub Secrets | GitHub Secrets (prod) |
| Stripe | `.env.local` (test key) | Test key | Live key |
| WhatsApp | Not set (stub) | Test WABA | Live WABA |
| Sentry | Not set | DSN in secrets | DSN in secrets |

**Rules:**
1. NEVER commit `.env` files (`.gitignore` enforced)
2. NEVER log environment variables
3. Use GitHub Secrets for CI/CD (not hardcoded)
4. Rotate all credentials every 90 days
5. Separate keys per environment (no shared secrets)

---

## 9. Pipeline Status

| Stage | Status | Notes |
|-------|--------|-------|
| Pre-commit (Husky) | ✅ Active | ESLint + Prettier |
| GitHub Actions CI | ⏳ Phase 2 | Workflow files needed |
| Vercel auto-deploy (frontend) | ✅ Active | Connected to main |
| Railway deploy (backend) | Manual | Automated in Phase 2 |
| Staging environment | ✅ Active | staging.whitecaves.ae |
| Production environment | ✅ Active | whitecaves.ae |
| Blue-green deployment | ⏳ Phase 7 | After scale requirement |
| Prometheus monitoring | ⏳ Phase 2 | prom-client needed |
| Sentry error tracking | ⏳ Phase 2 | SDK integration needed |

---

**Document Owner:** DevOps Department (Gwynne + Lisa)
**Related:** `business_docs/14_devops/deployment-runbook.md`, `business_docs/14_devops/incident-response.md`
