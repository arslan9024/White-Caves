# Wave 11 — Test Rollout

**Wave:** 11  
**Focus:** Incomplete Features Closure + Architecture Refactor  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

## Validation Matrix

| Area | Goal | Validation |
| --- | --- | --- |
| Scheduler foundations | Startup registration, overlap safety, and recurring execution are stable | `npm run typecheck` + focused scheduler/service tests |
| Document generation | PDF/Excel responses stream correctly and do not crash the server | focused document route/service tests + `npm run build` |
| Email wiring | Trigger registry fires from the expected auth/viewing/lease events | focused route tests |
| Architecture refactors | Error handling and service extraction do not regress runtime | `npm run lint && npm run build` |
| Governance closeout | Queue/tracker updates remain canonical | `npm run plans:validate` |

---

## Recommended Execution Order

1. Scheduler cluster (`W11-001` → `W11-006`)
2. Document cluster (`W11-007` → `W11-013`)
3. Email cluster (`W11-014` → `W11-017`)
4. Architecture cluster (`W11-018` → `W11-020`)
5. Final closeout: `npm run typecheck && npm run lint && npm run build && npm run plans:validate`

---

## Focused Test Targets

| Cluster | Suggested focus |
| --- | --- |
| Scheduler | `server/services/**`, `server/routes/**` paths touched by cron or activity logging |
| Documents | `server/services/DocumentService*`, `server/routes/documents*`, affected export UI paths |
| Email | auth/viewings/lease reminder routes and `server/services/emailTriggers*` |
| Architecture | routes/services touched by `AppError`, middleware, or index changes |

---

## Exit Criteria

Wave 11 is ready to close only when:

- all planned Wave 11 tasks have evidence recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- typecheck, lint, build, and focused tests are green for the touched scope
- `npm run plans:validate` passes after tracker updates

