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

| Endpoint | Status | Blocking | Target Phase |
|----------|--------|---------|-------------|
| `/api/contracts` | 501 Not Implemented | Lease management, compliance | Phase 2 |
| `/api/appointments` | 501 Not Implemented | Viewing bookings, calendar | Phase 2 |
| `/api/payments` | 503 Service Unavailable | Tenant rent payment, portal | Phase 2 |
| `/api/valuation` | 501 Not Implemented | Seller appraisal flow | Phase 2 |
| `/api/tenancy-agreements` | 501 Not Implemented | Full lease lifecycle | Phase 2 |
| `/api/role-requests` | Not implemented | Agent self-serve RBAC | Phase 9 |
| `/api/2fa` | 501 Not Implemented | Compliance security | Phase 9 |
| `/api/whatsapp/*` | Stub (logs only) | WhatsApp CRM core feature | Phase 4 |

**Remediation:** Implement Prisma models + full CRUD handlers for Phase 2 items in sprint order.

---

### TD-002: npm Audit Vulnerabilities (7 total, 1 critical)

| Severity | Count | Action |
|---------|-------|--------|
| Critical | 1 | Patch immediately before Phase 2 deploy |
| High | 2 | Patch in Phase 2 security sprint |
| Moderate | 4 | Patch in Phase 2 security sprint |

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

| ID | Description | Resolved | Version |
|----|------------|---------|---------|
| TD-R-001 | Firebase-sync timing attack | March 2026 | v1.1 |
| TD-R-002 | CRM export data leakage via Prisma select | April 2026 | v1.1 |
| TD-R-003 | Auth route ordering bug | April 2026 | v1.1 |
| TD-R-004 | Lead/Property edit modal missing validation | April 2026 | v1.1 |
| TD-R-005 | Dead code — 190KB across 24 files removed | April 2026 | v1.1 |
| TD-R-006 | Stale console.log — 3.0MB cleaned | April 2026 | v1.1 |
| TD-R-007 | TypeScript strict mode — 0 compile errors | March 2026 | v1.0 |

---

## 6. Debt Metrics Dashboard

| Category | Count | Critical | High | Medium | Low |
|---------|-------|---------|------|--------|-----|
| Stub endpoints | 8 | 5 | 3 | 0 | 0 |
| Security vulnerabilities | 7 | 1 | 2 | 4 | 0 |
| Missing models | 11 | 5 | 6 | 0 | 0 |
| Missing libraries | 5 | 1 | 3 | 1 | 0 |
| Test gaps | 4 | 0 | 2 | 2 | 0 |
| DevOps | 3 | 0 | 1 | 1 | 1 |
| **Total** | **38** | **12** | **17** | **8** | **1** |

---

## 7. Resolution Priority Schedule

| Sprint | Debt Items | Rationale |
|--------|-----------|-----------|
| Phase 2 Sprint 1 | TD-001 (contracts, appointments), TD-003 (models), TD-004 (Firebase) | Core portal blockers |
| Phase 2 Sprint 2 | TD-001 (payments, valuation), TD-008 (PDFKit), TD-009 (cron), TD-010 (Stripe) | Revenue features |
| Phase 2 Sprint 3 | TD-002 (npm audit), TD-005 (OpenAPI), TD-016 (Prometheus), TD-017 (Sentry) | Security + observability |
| Phase 3 | TD-011 (any types), TD-014 (E2E), TD-015 (factories), TD-019 (Storybook) | Quality sprint |
| Phase 4 | TD-007 (WhatsApp), TD-009 (Bull queue) | WhatsApp launch |
| Phase 6 | TD-006 (Arabic i18n) | Localisation launch |
| Phase 7 | TD-012 (Redis), TD-013 (Elasticsearch) | Performance at scale |

---

**Document Owner:** Technology Department
**Update Frequency:** Every sprint start (fortnightly)
**Related:** `business/05_srs_and_engineering/srs-v2-2026.md`, `plans/MASTER_PLAN.md`
