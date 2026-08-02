# Wave 18 — Server Gap Report (CRM + Dashboard Upgrade)

**Date:** 2026-05-26  
**Scope:** `/tmp/workspace/arslan9024/White-Caves/server/index.ts` + `/tmp/workspace/arslan9024/White-Caves/server/routes/*`  
**Objective:** classify current backend readiness for CRM/dashboard modernization and identify immediate blockers.

---

## 1) Current Server Surface Snapshot

- API mount points in `server/index.ts`: **80** (`app.use('/api...')` declarations).
- Route files in `server/routes`: **132** total.
  - TypeScript route files: **96**
  - JavaScript route files: **36**
  - `.d.ts` route typing files: **3**
  - Route tests in `server/routes`: **39** (`*.test.ts|*.test.js`)
- Centralized auth/rbac/security middleware exists and is active (`auth.ts`, `rbac.ts`, `rateLimiter.ts`, `csp.ts`, `errorHandler.ts`).

---

## 2) Endpoint Readiness Matrix (Executive Summary)

| Domain | Representative Routes | Readiness | Notes |
| --- | --- | --- | --- |
| Auth & identity | `/api/auth/*`, `/api/users/*`, role requests | Partial | Core JWT/rate limits exist; profile/routing parity and full IAMv2 flow still pending in Wave 19 queue. |
| CRM core | `/api/leads`, `/api/properties`, `/api/agents`, `/api/crm` | Included/Partial | Production routes exist; several parity workflows still backlog-bound (import depth, SLA orchestration, timeline unification). |
| Dashboard/reporting | `/api/dashboard`, `/api/reports`, `/api/analytics` | Partial | Core surfaces exist; funnel economics/KPI trend automation requires expansion. |
| Communications | `/api/communications`, `/api/nadia`, `/api/linda`, `/api/webhooks/meta` | Partial | Multi-channel routing exists; conversion-to-lead orchestration still gap. |
| Leasing/tenant/landlord | `/api/leases`, `/api/portal/tenant`, `/api/landlord`, `/api/invoices/lease` | Partial | Good route coverage; rent-collection + Ejari lifecycle closure remains prioritized gap. |
| Compliance & governance | `/api/compliance`, scheduler/compliance services | Partial | Framework in place; stronger KYC transition gating and expiry automation closure required. |
| System reliability | `/health`, `/api/health`, `/api/health/db` | Partial | Health endpoints exist; startup behavior with DB outage remains high-risk for runtime operations. |

---

## 3) Confirmed Gap Findings (Now)

### P0 (Critical)

1. **Monolithic bootstrap in `server/index.ts`**
   - Middleware, routing, stubs, startup orchestration, schedulers, and infra lifecycle are tightly coupled in one entry file.
   - Impact: high change risk and regression risk in CRM/dashboard server upgrades.

2. **DB-failure startup mode allows API process up but data-dependent routes degrade at runtime**
   - Current startup logs warning and still binds server when DB connection fails.
   - Impact: uptime metric can appear healthy while business flows fail.

3. **High-priority parity gaps still partially implemented**
   - Lead import depth, KYC gate rigor, WhatsApp conversion workflows, rent/Ejari/permit lifecycle completion.

### P1 (Important)

4. **Mixed JS/TS route surface (96 TS / 36 JS)**
   - Increases drift and contract consistency risk.

5. **Inline/stub logic in server entrypoint for operational features**
   - Some WhatsApp/admin/system routes and heuristic endpoints are still embedded in bootstrap rather than bounded modules.

6. **Health visibility needs dependency-level operational semantics**
   - Current health endpoints are present but not yet enough to distinguish degraded service classes for SLO governance.

### P2 (Optimization)

7. **Versioning migration needs tighter operational policy**
   - Compatibility proxy exists, but migration sequencing and legacy deprecation milestones need explicit gating.

8. **Backlog-to-route traceability can be strengthened**
   - Useful for weekly parity re-score and release governance evidence generation.

---

## 4) Risk Heatmap

| Risk Area | Severity | Probability | Why |
| --- | --- | --- | --- |
| Auth/profile routing regressions during IAMv2 | High | Medium | Cross-cutting role and redirect behavior spans frontend + backend contracts. |
| DB outage behavior masked by process uptime | High | Medium | Startup tolerates DB failure; critical routes still require DB. |
| Compliance workflow incompleteness (KYC/Ejari/permit) | High | Medium | Directly tied to legal/operational exposure. |
| CRM parity delays in lead/WhatsApp funnel | High | Medium | Revenue impact and response SLA impact. |
| Monolith entrypoint regression blast radius | Medium | High | Frequent edits to central file increase conflict and defect risk. |
| Mixed JS/TS route drift | Medium | Medium | Type safety and validation consistency are uneven. |

---

## 5) Immediate Corrective Actions Completed in this iteration

- Removed duplicate rate-limit mount for `/api/auth/refresh` in `/tmp/workspace/arslan9024/White-Caves/server/index.ts`.
- Removed duplicate `/api/assistants` mount in `/tmp/workspace/arslan9024/White-Caves/server/index.ts`.

---

## 6) Acceptance Gate for Gap Report

- [x] Endpoint inventory summarized from live code.
- [x] Readiness classes assigned (Included/Partial/Missing intent level).
- [x] Risk heatmap documented.
- [x] P0/P1/P2 findings extracted for execution backlog.
