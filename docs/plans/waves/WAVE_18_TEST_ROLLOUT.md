# Wave 18 — Test Rollout Plan

**Wave:** 18  
**Focus:** Workflow Parity Audit + Planning Governance  
**Status:** 📋 Planned  
**Date:** 2026-05-26

---

## Validation Matrix

| Area | Validation Type | Command / Evidence | Pass Condition |
| --- | --- | --- | --- |
| Planning governance | Script validation | `npm run plans:validate` | Passes with no governance violations |
| Canonical navigation integrity | Link/path review | `plans/MASTER_PLAN.md`, `plans/PENDING_TASKS_ONLY.md`, `plans/waves/README.md` | Wave 18 linked consistently in all 3 |
| Matrix evidence quality | Manual audit | `WAVE_18_WORKFLOW_PARITY_MATRIX.md` | Each row has White Caves doc/code/evidence signals |
| Status scoring consistency | Manual audit | Matrix legend and row statuses | Status values only: Included/Partial/Missing/Unknown |
| Gap actionability | Manual audit | Matrix gap register + W18 backlog | Every P0/P1/P2 gap maps to requirement IDs |
| Wave 18.1 execution readiness | Manual audit | `WAVE_18_1_IMPLEMENTATION_BACKLOG.md` | 132-item inventory present + top-20 P0 tasks include owner/metric/validation gate |
| Drift correction | Manual audit | `business_docs/09_crm_features/README.md` | No references to missing files |

---

## Completion Gate Requirements (for downstream implementation waves)

A workflow gap cannot be marked complete unless:

1. **API evidence** exists (route/service tests or endpoint verification)
2. **UI evidence** exists (component/page behavior verified)
3. **RBAC evidence** exists (role access enforced)
4. **Compliance evidence** exists when applicable (RERA/KYC/Ejari/AML checks)
5. Evidence is reflected in:
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
   - relevant wave backlog/test rollout files

---

## Weekly Re-Benchmark Loop

Cadence: Weekly (recommended Monday)

1. Re-check benchmark platform workflows and update matrix deltas.
2. Recompute parity dashboard counts (Included/Partial/Missing/Unknown).
3. Add newly discovered gaps to the next implementation wave backlog.
4. Re-run `npm run plans:validate` after queue/tracker updates.
5. Publish weekly parity summary in `PENDING_TASKS_ONLY.md`.
