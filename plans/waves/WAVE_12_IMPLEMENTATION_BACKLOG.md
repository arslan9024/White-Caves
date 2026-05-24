# Wave 12 — Implementation Backlog

**Wave:** 12  
**Focus:** Automation Engine  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

## Ordered Tasks

| ID | Priority | Task | Owner | Files | Validation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| W12-001 | P0 | Install cron/document/email template dependencies from approved backlog | @Mira | `package.json` | `npm run build` | Planned |
| W12-002 | P0 | Create `SchedulerService.ts` and register at server startup | @Mira | `server/services/SchedulerService.ts`, `server/index.ts` | `npm run typecheck` | Planned |
| W12-003 | P0 | Implement daily lead-rescore + permit checks + monthly rent generation jobs | @Mira | scheduler + related services | focused service tests | Planned |
| W12-004 | P1 | Implement cron execution audit events in Activity log | @Mira + @Hedy | scheduler + activity model | focused tests | Planned |
| W12-005 | P0 | Create `DocumentService.ts` PDF/Excel generation + streaming endpoints | @Barbara | service + routes | `npm run build` | Planned |
| W12-006 | P1 | Add `server/templates/email/` and event trigger registry wiring | @Mira + @Handlebars | templates + trigger service + routes | focused route tests | Planned |
| W12-007 | P1 | Wire CRM export buttons to new document endpoints | @Una + @Mira | frontend export surfaces | `npm run build` | Planned |
| W12-008 | P0 | Wave-level final validation | @Katherine | — | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` | Planned |

---

## Autopilot Execution

Execute strictly in order W12-001 → W12-008 with per-task validation before advancing.
