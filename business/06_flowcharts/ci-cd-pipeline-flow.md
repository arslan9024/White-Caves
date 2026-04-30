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


---

## 9. Branch Strategy

White Caves uses trunk-based development with short-lived feature branches:

### 9.1 Branch Naming Convention

| Branch Type | Pattern | Example |
|------------|---------|---------|
| Feature | `feat/[ticket]-[short-description]` | `feat/WC-145-ejari-tracking` |
| Bug fix | `fix/[ticket]-[short-description]` | `fix/WC-203-lead-score-null-crash` |
| Hotfix (production) | `hotfix/[ticket]-[short-description]` | `hotfix/WC-211-auth-bypass` |
| Release candidate | `release/v[major].[minor].[patch]` | `release/v1.2.0` |
| Docs only | `docs/[short-description]` | `docs/expand-rera-checklist` |
| Chore | `chore/[short-description]` | `chore/update-dependencies` |

**Protected branches:** `main` (production), `staging` (staging environment). Direct push to either is blocked — PRs required.

### 9.2 Branch Lifecycle

```
1. Create feature branch from main (always latest)
   └── git checkout -b feat/WC-145-ejari-tracking

2. Develop + commit (small, focused commits)
   └── git commit -m "feat: add Lease.ejariNumber field + Prisma migration"
   └── git commit -m "feat: add ejari auto-alert when lease active > 30 days"

3. Push + open Draft PR
   └── CI runs automatically on push

4. Self-review + address CI issues
   └── Mark PR ready for review when CI is green

5. Peer review (one reviewer minimum)
   └── Reviewer approves or requests changes

6. Squash merge to main
   └── Merge commit message: "feat: Ejari tracking (#145)"

7. Delete feature branch
8. Staging auto-deploy triggers (within 2 min)
9. Smoke test on staging (5 min)
10. Tag release and deploy to production (next release cycle)
```

---

## 10. Rollback Procedures

### 10.1 Frontend Rollback (Vercel)

```
Scenario: Production deployment broke the homepage

Step 1: Identify bad deployment in Vercel dashboard
   └── Vercel → Deployments → Find last good deployment

Step 2: Instant rollback
   └── Vercel → Deployments → [Last good deployment] → "..." → Promote to Production
   └── Rollback time: < 30 seconds

Step 3: Investigate root cause
   └── Check Sentry for errors in failed deployment
   └── Check git diff between good and bad deployment

Step 4: Fix → new PR → normal deployment process
```

### 10.2 Backend Rollback (Railway/Render)

```
Scenario: API deployment broke authentication

Step 1: Revert deployment in Railway/Render dashboard
   └── Railway → Deployments → [Last good deployment] → Rollback
   └── Rollback time: ~2 minutes

Alternative: Hot-fix branch
   └── git checkout -b hotfix/WC-XXX-auth-fix main~1  (checkout one commit before broken)
   └── git cherry-pick [fix commit]
   └── Push → merge to main via emergency PR (bypasses 1-review requirement with MD approval)

Step 3: Database migration rollback
   └── If migration was part of deployment: prisma migrate resolve --rolled-back [migration-id]
   └── CAUTION: Schema rollback can cause data loss if new columns have data
   └── Always take MongoDB snapshot before applying migrations to production
```

### 10.3 Database Emergency Procedures

```
Scenario: Critical data corruption in MongoDB

Immediate (< 5 minutes):
1. Enable MongoDB Atlas "Pause" cluster (stops all writes, serves reads from snapshot)
2. Notify MD and Tech Lead immediately
3. Assess scope: which collections affected? how many records?

Recovery (< 2 hours):
1. Identify point in time before corruption
2. Use Atlas Point-In-Time Recovery (PITR) to restore to that timestamp
3. Recovery goes to a new cluster (original preserved for forensics)
4. Switch API to point at recovered cluster

PITR window: 7 days (Atlas M10+ tier)
RTO target: 2 hours (before restoration complete)
RPO target: 1 hour (maximum data loss in worst case)
```

---

## 11. Environment Configuration

### 11.1 Environment Variables by Environment

| Variable | Development | Staging | Production |
|---------|------------|---------|-----------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/wc-dev` | Atlas dev cluster | Atlas production cluster |
| `JWT_SECRET` | Dev secret (in .env.local) | Staging secret (Railway secrets) | Production secret (Railway secrets) |
| `FIREBASE_PROJECT_ID` | `wc-development` | `wc-staging` | `wc-production` |
| `WHATSAPP_ACCESS_TOKEN` | Mock token | Sandbox Meta token | Production Meta token |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_test_...` | `sk_live_...` |
| `SENTRY_DSN` | Disabled | Staging Sentry project | Production Sentry project |
| `LOG_LEVEL` | `debug` | `info` | `warn` |
| `CORS_ORIGINS` | `http://localhost:5173` | `https://staging.whitecaves.ae` | `https://whitecaves.ae` |

### 11.2 Secrets Management

**Current:** Railway/Vercel environment variables dashboard (per-environment)
**Phase 5 target:** HashiCorp Vault (self-hosted or HCP Vault) for:
- Automatic secret rotation
- Audit log of all secret accesses
- Fine-grained access: Railway can only read its required secrets
- Break-glass access with MD approval required for production secrets

**Never commit secrets to git:** `.env` is in `.gitignore`. Use `.env.example` with placeholder values for documentation. GitHub secret scanning enabled.

---

**Document Owner:** DevOps (@Gwynne — Deployment Lead, @Lisa — Cloud)
**Version History:** v1.0 April 2026; v2.0 April 2026 (branch strategy, rollback procedures, environment config)
**Related:** `business/05_srs_and_engineering/technical-debt-register.md`, `business/08_market_research/technology_upgrades.md`
