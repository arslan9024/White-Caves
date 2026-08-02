# Wave 18 — Backend Architecture Map (Target Modularization)

**Date:** 2026-05-26  
**Goal:** break backend bootstrap into stable modules for safer CRM/dashboard evolution.

---

## Target Module Topology

1. **`server/bootstrap/appFactory.ts`**
   - Creates Express app and baseline middleware pipeline.
2. **`server/bootstrap/security.ts`**
   - Helmet/CSP/CORS/cookie/sanitization/content-type/rate-limit setup.
3. **`server/bootstrap/routes/publicRoutes.ts`**
   - Public routes only (health, contact, homepage, webhook verify paths).
4. **`server/bootstrap/routes/protectedRoutes.ts`**
   - Auth-gated API route registration map.
5. **`server/bootstrap/routes/privilegedRoutes.ts`**
   - Admin/owner/permission-gated route registration map.
6. **`server/bootstrap/startup.ts`**
   - DB connect, background jobs, orchestrator boot, readiness state management.
7. **`server/bootstrap/httpServer.ts`**
   - HTTP server + socket attachment + bind retry policy.
8. **`server/bootstrap/shutdown.ts`**
   - Signal handlers, graceful drain, DB disconnect, final logging.

---

## Current-to-Target Split Map

| Current Area in `server/index.ts` | Target Module |
| --- | --- |
| request id, helmet, csp, cors, parser, sanitization, content-type checks | `bootstrap/security.ts` |
| `/health`, `/api/health`, `/api/health/db` | `routes/publicRoutes.ts` |
| auth middleware mode switching (prod/dev/test) | `bootstrap/security.ts` + `bootstrap/routes/protectedRoutes.ts` |
| bulk API route mounts | `routes/protectedRoutes.ts` |
| admin/system + privileged operational routes | `routes/privilegedRoutes.ts` |
| production static serving + SPA fallback | `bootstrap/appFactory.ts` |
| startup DB connect + schedulers + orchestrator boot | `bootstrap/startup.ts` |
| bind retry logic + socket attachment | `bootstrap/httpServer.ts` |
| process signal handling + graceful shutdown | `bootstrap/shutdown.ts` |

---

## Contract Boundaries (CRM-Critical)

- Leads contract
- Viewings contract
- Offers contract
- Communications/WhatsApp contract
- Reporting/funnel KPI contract

Each contract should define:
- request/response envelope
- auth/rbac expectations
- validation schema ownership
- error code taxonomy
- versioning path (`/api/v1` primary)

---

## Migration Phases

1. **Phase M1:** extract security + route registrars without behavior changes.
2. **Phase M2:** extract startup/orchestration/shutdown and add readiness state service.
3. **Phase M3:** move inline operational handlers into domain services/routes.
4. **Phase M4:** enforce API contract parity checks for CRM/dashboard-critical domains.

---

## Success Criteria

- Entry file becomes orchestration-only.
- No duplicate route mounts/rate-limit entries.
- Clear public/protected/privileged route grouping.
- DB/readiness behavior explicitly observable for release gates.
