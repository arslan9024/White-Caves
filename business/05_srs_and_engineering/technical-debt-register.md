# Technical Debt Register

# White Caves Real Estate Platform

> **Document ID:** WC-TECH-DEBT-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active — Updated Each Sprint
> **Owner:** Technology Department (Aurora + Willow)
> **Classification:** Internal

---

## Purpose

This register tracks all known technical debt, stub implementations, deferred features, and remediation timelines for the White Caves CRM Platform. It is reviewed at the start of each sprint and updated upon debt creation or resolution.

**Debt scoring:** (Impact × Effort) — High/Medium/Low

---

## 1. Critical Debt (Must Resolve Before Production Scale)

### TD-001: Stub API Endpoints (8 active stubs)

| Endpoint                  | Status                  | Blocking                     | Target Phase |
| ------------------------- | ----------------------- | ---------------------------- | ------------ |
| `/api/contracts`          | 501 Not Implemented     | Lease management, compliance | Phase 2      |
| `/api/appointments`       | 501 Not Implemented     | Viewing bookings, calendar   | Phase 2      |
| `/api/payments`           | 503 Service Unavailable | Tenant rent payment, portal  | Phase 2      |
| `/api/valuation`          | 501 Not Implemented     | Seller appraisal flow        | Phase 2      |
| `/api/tenancy-agreements` | 501 Not Implemented     | Full lease lifecycle         | Phase 2      |
| `/api/role-requests`      | Not implemented         | Agent self-serve RBAC        | Phase 9      |
| `/api/2fa`                | 501 Not Implemented     | Compliance security          | Phase 9      |
| `/api/whatsapp/*`         | Stub (logs only)        | WhatsApp CRM core feature    | Phase 4      |

**Remediation:** Implement Prisma models + full CRUD handlers for Phase 2 items in sprint order.

---

### TD-002: npm Audit Vulnerabilities (7 total, 1 critical)

| Severity | Count | Action                                  |
| -------- | ----- | --------------------------------------- |
| Critical | 1     | Patch immediately before Phase 2 deploy |
| High     | 2     | Patch in Phase 2 security sprint        |
| Moderate | 4     | Patch in Phase 2 security sprint        |

**Command to check:** `npm audit`
**Target:** 0 vulnerabilities before production launch

---

### TD-003: Missing Prisma Models

**Needed for Phase 2:**

```
Contract        — sales + lease contracts
Appointment     — property viewing bookings
Lease           — full tenancy lifecycle
RentPayment     — scheduled + ad hoc payments
MaintenanceRequest — landlord/tenant portal requests
```

**Needed for Phase 4:**

```
WhatsAppConversation — message threads, participants
WhatsAppMessage      — individual messages, status
```

**Needed for Phase 5:**

```
AMLRecord       — AML screening results
KYCDocument     — uploaded identity documents
ComplianceAudit — immutable audit entries
```

---

### TD-004: Firebase Admin SDK Not Configured

- **Location:** `server/routes/auth.ts` (Firebase sync endpoint returns 503)
- **Impact:** Firebase OAuth sync disabled; Google OAuth users not persisted to DB
- **Fix:** Configure `FIREBASE_SERVICE_ACCOUNT_KEY` env var + initialize firebase-admin
- **Target:** Phase 2 (security sprint)

---

## 2. High-Priority Debt

### TD-005: OpenAPI Coverage (10 of 30+ paths documented)

- **Location:** `/openapi.json`, `/openapi/` directory
- **Impact:** No Swagger UI; developer experience poor; Phase 8 partners need full spec
- **Fix:** Document all existing endpoints + all Phase 2 new endpoints
- **Target:** Phase 2 completion
- **Current:** 10 paths → **Target:** 30+ paths

---

### TD-006: i18n — Arabic Partial (523 lines file, 0 Arabic keys)

- **Location:** `src/i18n/translations.ts`
- **Impact:** Phase 6 Arabic launch blocked; 30%+ Dubai buyers prefer Arabic
- **Current state:** English full; Arabic i18n file exists but no `ar:` key in translations object
- **Fix:** Add Arabic translation object; integrate react-i18next; add `lang="ar"` + RTL toggle
- **Target:** Phase 6

---

### TD-007: WhatsApp Bot — All Methods Log-Only

- **Location:** `server/services/WhatsAppBotService.ts`
- **Impact:** No real WhatsApp communication possible
- **Current:** All methods stub with `logger.info()` only
- **Fix:** Integrate MetaAPIClient with Meta Cloud API (token + phone number ID)
- **Env vars needed:** `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_PHONE_NUMBER_ID`
- **Target:** Phase 4

---

### TD-008: No ExcelJS / PDFKit for Document Export

- **Location:** Not in `package.json`
- **Impact:** Commission statements, lease agreements, Ejari certificates cannot be generated
- **Fix:** Add `exceljs` + `pdfkit` (or `@react-pdf/renderer`) to dependencies
- **Target:** Phase 2

---

### TD-009: No Cron / Scheduler Library

- **Location:** Not in `package.json`
- **Impact:** No automated tasks: lead dormancy alerts, lease renewal reminders, portal sync
- **Fix:** Add `node-cron` or `bull` (Redis-backed queue) for job scheduling
- **Target:** Phase 2 (cron) → Phase 4 (Bull queue for WhatsApp)

---

### TD-010: Stripe Returns 503

- **Location:** `/api/payments` handler
- **Impact:** Tenant rent payments, deposit processing completely blocked
- **Fix:** Add `stripe` npm package; create PaymentIntent flow; configure `STRIPE_SECRET_KEY`
- **Target:** Phase 2

---

## 3. Medium-Priority Debt

### TD-011: ~39 TypeScript `any` Types (Mostly in Tests)

- **Location:** Various test files (`*.test.ts`, `*.test.tsx`)
- **Impact:** Type safety gaps; occasional runtime surprises
- **Fix:** Replace `any` with proper interfaces/type assertions in test mocks
- **Target:** Phase 3 (code quality sprint)

---

### TD-012: No Redis Caching

- **Impact:** Every property search hits MongoDB; latency will increase with scale
- **Fix:** Add `ioredis` + cache hot data (popular listings, KPI dashboard)
- **Target:** Phase 7

---

### TD-013: No Elasticsearch for Property Search

- **Impact:** MongoDB text search is limited; full-text Arabic search won't work
- **Fix:** Add Elasticsearch (or Typesense) for property + lead search
- **Target:** Phase 7

---

### TD-014: E2E Test Coverage Gap (11 specs, critical paths not fully covered)

- **Current:** 11 Playwright spec files
- **Missing:** Login flow, Landlord portal, Tenant portal, WhatsApp inbox, CRM lead full cycle
- **Fix:** Add 10+ Playwright specs for critical user paths
- **Target:** Phase 3

---

### TD-015: No Test Factories

- **Impact:** Test data created inconsistently; brittle test setup
- **Fix:** Create `tests/factories/` with `createLead()`, `createProperty()`, `createUser()` etc.
- **Target:** Phase 3

---

### TD-016: No Prometheus / Monitoring Endpoint

- **Impact:** Cannot track API latency, error rate, DB query time in production
- **Fix:** Add `prom-client` middleware; expose `/metrics` endpoint; connect Grafana
- **Target:** Phase 2 (DevOps sprint)

---

### TD-017: No Sentry / Error Tracking

- **Impact:** Production errors not captured; bugs found by users instead of team
- **Fix:** Add `@sentry/node` (backend) + `@sentry/react` (frontend)
- **Target:** Phase 2

---

## 4. Low-Priority Debt

### TD-018: GitHub Actions CI/CD Pipeline Not Fully Automated

- **Current:** `lint-staged` + Husky (pre-commit local only)
- **Missing:** Full GitHub Actions workflow for CI + staging deploy
- **Fix:** Add `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`
- **Target:** Phase 2 (DevOps sprint)

---

### TD-019: Storybook Not Set Up

- **Impact:** Design system components not documented interactively
- **Fix:** Add Storybook for 15 core design system components
- **Target:** Phase 3

---

### TD-020: Docker Production Image Not Optimized

- **Current:** `Dockerfile` (prod) and `Dockerfile.frontend` exist
- **Issue:** Multi-stage builds not verified; image sizes not minimized
- **Fix:** Audit Dockerfile for layer caching and size; test production image end-to-end
- **Target:** Phase 2 (DevOps sprint)

---

## 5. Resolved Debt (Archive)

| ID       | Description                                 | Resolved   | Version |
| -------- | ------------------------------------------- | ---------- | ------- |
| TD-R-001 | Firebase-sync timing attack                 | March 2026 | v1.1    |
| TD-R-002 | CRM export data leakage via Prisma select   | April 2026 | v1.1    |
| TD-R-003 | Auth route ordering bug                     | April 2026 | v1.1    |
| TD-R-004 | Lead/Property edit modal missing validation | April 2026 | v1.1    |
| TD-R-005 | Dead code — 190KB across 24 files removed   | April 2026 | v1.1    |
| TD-R-006 | Stale console.log — 3.0MB cleaned           | April 2026 | v1.1    |
| TD-R-007 | TypeScript strict mode — 0 compile errors   | March 2026 | v1.0    |

---

## 6. Debt Metrics Dashboard

| Category                 | Count  | Critical | High   | Medium | Low   |
| ------------------------ | ------ | -------- | ------ | ------ | ----- |
| Stub endpoints           | 8      | 5        | 3      | 0      | 0     |
| Security vulnerabilities | 7      | 1        | 2      | 4      | 0     |
| Missing models           | 11     | 5        | 6      | 0      | 0     |
| Missing libraries        | 5      | 1        | 3      | 1      | 0     |
| Test gaps                | 4      | 0        | 2      | 2      | 0     |
| DevOps                   | 3      | 0        | 1      | 1      | 1     |
| **Total**                | **38** | **12**   | **17** | **8**  | **1** |

---

## 7. Resolution Priority Schedule

| Sprint           | Debt Items                                                                    | Rationale                |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------ |
| Phase 2 Sprint 1 | TD-001 (contracts, appointments), TD-003 (models), TD-004 (Firebase)          | Core portal blockers     |
| Phase 2 Sprint 2 | TD-001 (payments, valuation), TD-008 (PDFKit), TD-009 (cron), TD-010 (Stripe) | Revenue features         |
| Phase 2 Sprint 3 | TD-002 (npm audit), TD-005 (OpenAPI), TD-016 (Prometheus), TD-017 (Sentry)    | Security + observability |
| Phase 3          | TD-011 (any types), TD-014 (E2E), TD-015 (factories), TD-019 (Storybook)      | Quality sprint           |
| Phase 4          | TD-007 (WhatsApp), TD-009 (Bull queue)                                        | WhatsApp launch          |
| Phase 6          | TD-006 (Arabic i18n)                                                          | Localisation launch      |
| Phase 7          | TD-012 (Redis), TD-013 (Elasticsearch)                                        | Performance at scale     |

---

**Document Owner:** Technology Department
**Update Frequency:** Every sprint start (fortnightly)
**Related:** `business/05_srs_and_engineering/srs-v2-2026.md`, `plans/MASTER_PLAN.md`

---

## 8. Debt Prevention Framework

### 8.1 Definition of Done (DoD)

Every user story or technical task is only "done" when ALL of these criteria are met:

```
Code Quality:
☐ TypeScript: 0 `any` types used (or existing `any` documented with TS-FIXME comment)
☐ ESLint: 0 errors, 0 warnings (no `eslint-disable` without explanation comment)
☐ All new functions have JSDoc comments
☐ No dead code (unreachable paths, commented-out code blocks)

Testing:
☐ Unit tests for all new business logic (> 80% line coverage for changed files)
☐ Integration tests for all new API endpoints (at least: success, 401, 403, 400 cases)
☐ No skipped tests (`test.skip`) without issue tracker reference

Security:
☐ `npm audit` passes (0 critical, 0 high vulnerabilities)
☐ No secrets, API keys, or PII in code or git history
☐ RBAC middleware applied to all protected routes
☐ Input validation on all POST/PATCH endpoints (Zod schema)

Performance:
☐ No N+1 queries (use Prisma `include` or batched queries)
☐ New list endpoints support pagination
☐ Database queries use indexes (verify with MongoDB explain())

Documentation:
☐ README updated if setup steps change
☐ OpenAPI JSDoc added for new endpoints
☐ Business docs updated if feature changes a documented process
```

### 8.2 Pre-PR Checklist

Before creating a Pull Request:

```
Self-review:
☐ Read own diff — is every line intentional?
☐ Are there any TODOs that should be tickets first?
☐ Are console.log() statements removed?

Testing:
☐ `npm run test` passes locally
☐ `npm run lint` passes locally
☐ `npm run build` succeeds (TypeScript compile clean)

Security:
☐ `npm audit` run — 0 critical/high

Documentation:
☐ PR description explains what + why (not just what)
☐ Linked to Jira/GitHub issue
```

### 8.3 Architectural Review Triggers

Any of the following require an architectural review meeting (30 min, Aurora + Grace + MD) before implementation:

- Adding a new third-party service or npm package with > 100K weekly downloads
- Changing the authentication or session mechanism
- Adding a new database (even for caching)
- Adding a new background job system
- Changing the API versioning mechanism
- Adding a new payment method
- Any changes to KYC/AML data storage

---

## 9. npm Dependency Health Management

### 9.1 Dependency Audit Schedule

| Action                        | Frequency            | Owner               |
| ----------------------------- | -------------------- | ------------------- |
| `npm audit` run locally       | Every PR             | Developer           |
| `npm audit` in CI pipeline    | Every push to `main` | Automated           |
| Dependabot alerts review      | Weekly               | Ecem (Security)     |
| Full dependency update sprint | Quarterly            | Aurora + Ecem       |
| Major version upgrade review  | Before each Phase    | Architecture review |

### 9.2 Dependency Categories

| Category                         | Policy                                | Example                   |
| -------------------------------- | ------------------------------------- | ------------------------- |
| Security patches (patch version) | Auto-merge if CI passes               | `express 4.18.1 → 4.18.2` |
| Feature updates (minor version)  | Auto-merge if CI passes + Ecem review | `react 18.2.0 → 18.3.0`   |
| Breaking changes (major version) | Manual review + testing sprint        | `react 18 → react 19`     |
| New dependencies                 | Architecture review (see 8.3)         | Any new `npm install`     |

### 9.3 Current Vulnerability Resolution Plan

| Package           | Vulnerability                     | CVSS           | Resolution                      | Target Date                   |
| ----------------- | --------------------------------- | -------------- | ------------------------------- | ----------------------------- |
| `semver`          | Prototype pollution (ReDoS)       | 6.5 (Medium)   | `npm update semver`             | Phase 2 Sprint 1              |
| `tough-cookie`    | Prototype pollution               | 6.5 (Medium)   | Update `axios` (transitive dep) | Phase 2 Sprint 1              |
| `word-wrap`       | ReDoS                             | 5.3 (Medium)   | `npm update word-wrap`          | Phase 2 Sprint 2              |
| `@babel/traverse` | Arbitrary code exec (indirect)    | 9.8 (Critical) | Update babel devDependencies    | Phase 2 Sprint 1 — **URGENT** |
| `ip`              | SSRF bypass                       | 6.5 (Medium)   | Update `zod` or remove `ip`     | Phase 2 Sprint 1              |
| `postcss`         | ReDoS                             | 5.3 (Medium)   | `npm update postcss`            | Phase 2 Sprint 2              |
| `braces`          | Uncontrolled resource consumption | 7.5 (High)     | Update `micromatch`             | Phase 2 Sprint 1              |

**Current count:** 7 open vulnerabilities (1 critical, 2 high, 4 medium) — target 0 before Phase 2 production deployment.

---

## 10. Test Coverage Improvement Plan

### 10.1 Current Coverage (April 2026)

| Module                                       | Lines   | Statements | Branches | Functions | Status       |
| -------------------------------------------- | ------- | ---------- | -------- | --------- | ------------ |
| `routes/auth.ts`                             | 45%     | 43%        | 38%      | 55%       | 🔴 Poor      |
| `routes/leads.ts`                            | 62%     | 60%        | 52%      | 68%       | 🟡 Fair      |
| `routes/properties.ts`                       | 58%     | 56%        | 48%      | 64%       | 🟡 Fair      |
| `routes/aiAssistants.ts`                     | 78%     | 76%        | 70%      | 82%       | 🟢 Good      |
| `middleware/auth.ts`                         | 85%     | 83%        | 78%      | 90%       | 🟢 Good      |
| `middleware/rbac.ts`                         | 72%     | 70%        | 65%      | 76%       | 🟡 Fair      |
| `services/WhatsAppBotService.ts`             | 28%     | 26%        | 22%      | 35%       | 🔴 Poor      |
| `store/slices/aiAssistantDashboardSlice.tsx` | 91%     | 89%        | 85%      | 94%       | 🟢 Excellent |
| **Overall**                                  | **61%** | **59%**    | **52%**  | **68%**   | 🟡 **Fair**  |

### 10.2 Coverage Targets by Phase

| Phase   | Target      | Priority Modules                            |
| ------- | ----------- | ------------------------------------------- |
| Phase 2 | 70% overall | auth.ts, all portal routes                  |
| Phase 3 | 80% overall | leads.ts, transactions.ts, analytics routes |
| Phase 4 | 85% overall | WhatsApp service, webhook handlers          |
| Phase 5 | 90% overall | Full coverage sprint                        |

### 10.3 Test Factory Pattern (Removing `any` Types in Tests)

```typescript
// tests/factories/lead.factory.ts
import { faker } from '@faker-js/faker';
import { Lead, LeadStatus, LeadSource } from '@prisma/client';

export const createTestLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: '+971501234567',
  status: 'NEW' as LeadStatus,
  source: 'WEBSITE' as LeadSource,
  budget: faker.number.int({ min: 500000, max: 5000000 }),
  agentId: faker.string.uuid(),
  createdAt: faker.date.past(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestLeads = (count: number, overrides?: Partial<Lead>): Lead[] =>
  Array.from({ length: count }, () => createTestLead(overrides));
```

---

## 11. Performance Monitoring & Alerting

### 11.1 Prometheus Metrics to Track

```typescript
// metrics.ts — Express middleware
import { Counter, Histogram, Gauge } from 'prom-client';

// API request rate
const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Response time
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1.0, 2.0, 5.0],
});

// Active leads in pipeline
const activePipelineLeads = new Gauge({
  name: 'crm_leads_in_pipeline',
  help: 'Active leads by stage',
  labelNames: ['stage'],
});

// MongoDB query duration
const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['operation', 'collection'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1.0],
});
```

### 11.2 Grafana Alert Rules

| Alert                  | Condition                                                                 | Severity | Response                     |
| ---------------------- | ------------------------------------------------------------------------- | -------- | ---------------------------- |
| API Error Rate High    | `rate(http_requests_total{status_code=~"5.."}[5m]) > 0.01`                | Critical | PagerDuty → on-call engineer |
| Slow API Responses     | `http_request_duration_seconds{quantile="0.95"} > 2`                      | High     | Slack → #engineering         |
| MongoDB Slow Queries   | `db_query_duration_seconds{quantile="0.99"} > 1`                          | High     | Slack → #engineering         |
| Low Disk Space         | `node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1`          | Critical | PagerDuty                    |
| High Memory Usage      | `(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 0.9` | High     | Slack                        |
| SSL Certificate Expiry | `ssl_certificate_expiry_days < 14`                                        | Critical | PagerDuty + Email            |

---

**Document Owner:** Technology Department
**Update Frequency:** Every sprint start (fortnightly); vulnerability table updated immediately on discovery
**Version History:** v1.0 April 2026 (initial); v2.0 April 2026 (expanded with DoD, testing plan, metrics)
**Related Documents:**

- `business/05_srs_and_engineering/srs-v2-2026.md`
- `business/08_market_research/technology_upgrades.md`
- `plans/MASTER_PLAN.md`
