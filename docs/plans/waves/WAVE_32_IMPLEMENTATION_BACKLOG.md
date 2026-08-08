# Wave 32 — Implementation Backlog

**Wave:** 32  
**Focus:** Documentation Governance, Traceability & Progress Intelligence  
**Status:** planned  
**Date:** 2026-08-02  
**Entry Gate:** Wave 31 governance hardening active + readiness above 60%

---

| ID | Priority | Task | Owner | Validation |
| --- | --- | --- | --- | --- |
| W32-001 | P0 | Normalize `docs/business_docs/README.md` as canonical business entrypoint and remove stale legacy navigation | @Ada + @Dena | Markdown diagnostics clean + link review |
| W32-002 | P0 | Normalize `docs/software_docs/INDEX.md` and `docs/software_docs/adr/README.md` with canonical/historical separation | @Ada + @Mala | Markdown diagnostics clean + ADR index review |
| W32-003 | P0 | Publish `docs/plans/PROGRESS_DASHBOARD.md` with status pie, lane view, and uplift KPI section | @Margaret + @Cassie | Markdown diagnostics clean + tracker consistency review |
| W32-004 | P0 | Publish `docs/plans/WAVE_PROGRESS_SUMMARY.md` with active/planned wave view and contradiction cleanup notes | @Margaret + @Ghada | Markdown diagnostics clean |
| W32-005 | P1 | Create requirement crosswalk seed between business requirement IDs and software realization IDs | @Margaret + @Mala | Crosswalk file published with initial mappings |
| W32-006 | P1 | Create RBAC role-to-level map bridging business role catalogs and software access levels | @Ada + @Daniela | Mapping file published with canonical notes |
| W32-007 | P1 | Create SLA reconciliation matrix bridging business SLA promises and software operational timers | @Cassie + @Ruchi | Matrix published with threshold notes |
| W32-008 | P1 | Create compliance control matrix linking `COMP-*` controls to design/test surfaces | @Sofia + @Timnit | Matrix published with initial control coverage |
| W32-009 | P0 | Reconcile `PROJECT_PROGRESS.md` with actual wave status and remove false full-completion claims | @Margaret + guardian | Progress tracker updated and contradiction-free |
| W32-010 | P0 | Sync `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, and `waves/README.md` to include Wave 32 | @Margaret | `npm run plans:validate` |

---

## Sequencing

1. Canonical entrypoints (`W32-001`, `W32-002`)
2. Visual progress artifacts (`W32-003`, `W32-004`)
3. Traceability bridge artifacts (`W32-005` to `W32-008`)
4. Tracker reconciliation (`W32-009`, `W32-010`)

## Acceptance Gate

Wave 32 is complete only when:

1. Canonical business and software doc indexes are live.
2. Progress visualization artifacts are published.
3. Initial traceability bridge artifacts exist.
4. Project trackers reflect current wave reality without contradictory completion claims.
5. `npm run plans:validate` passes.
