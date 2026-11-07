# Plans — Canonical Active Execution Index

> **Status:** ACTIVE  
> **Last Updated:** 2026-09-03  
> **Canonical root:** `/plans/` (active execution docs) | `/docs/plans/` (full planning archive + wave bundles)

## Start Here

| File                                                                                                                 | Purpose                                                                                 | Status    |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------- |
| [`MASTER_PLAN.md`](./MASTER_PLAN.md)                                                                                 | Single source of truth for project phase and RUP status                                 | ACTIVE    |
| [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)                                                                   | Live task ledger and backlog                                                            | ACTIVE    |
| [`AEGIS_CURRENT_RUN.md`](./AEGIS_CURRENT_RUN.md)                                                                     | Current autopilot run state                                                             | ACTIVE    |
| [`AUTOPILOT_QUEUE.md`](./AUTOPILOT_QUEUE.md)                                                                         | Autopilot task queue                                                                    | ACTIVE    |
| [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)                                                                 | Governance rules for planning docs                                                      | REFERENCE |
| [`FRONTEND_100_DESIGN_GOALS.md`](./FRONTEND_100_DESIGN_GOALS.md)                                                     | 100 frontend design targets                                                             | REFERENCE |
| [`FUTURE_100_TASKS_BACKLOG.md`](./FUTURE_100_TASKS_BACKLOG.md)                                                       | Long-horizon backlog                                                                    | REFERENCE |
| [`WAVE_46_PLAN_FIRST_PACKET.md`](./WAVE_46_PLAN_FIRST_PACKET.md)                                                     | Plan-first packet for deduplication/canonicalization kickoff                            | ACTIVE    |
| [`DEDUP_INVENTORY_BASELINE_2026-09-03.md`](./DEDUP_INVENTORY_BASELINE_2026-09-03.md)                                 | Phase 0 duplication baseline and evidence matrix                                        | ACTIVE    |
| [`WAVE_46_DOCS_PLANS_DEDUP_MATRIX_2026-09-03.md`](./WAVE_46_DOCS_PLANS_DEDUP_MATRIX_2026-09-03.md)                   | docs/plans classification matrix with owner/action routing                              | ACTIVE    |
| [`WAVE_46_BUSINESS_DOCS_CANONICAL_DECISION_2026-09-03.md`](./WAVE_46_BUSINESS_DOCS_CANONICAL_DECISION_2026-09-03.md) | business-doc canonical root decision and migration map                                  | ACTIVE    |
| [`WAVE_46_FRONTEND_OVERLAP_AUDIT_2026-09-03.md`](./WAVE_46_FRONTEND_OVERLAP_AUDIT_2026-09-03.md)                     | frontend overlap and route-entry conflict audit (`src/app/pages`)                       | ACTIVE    |
| [`WAVE_46_BACKEND_OVERLAP_AUDIT_2026-09-03.md`](./WAVE_46_BACKEND_OVERLAP_AUDIT_2026-09-03.md)                       | backend overlap audit + duplicate handler map (`server/routes`,`server/services`,`api`) | ACTIVE    |
| [`WAVE_46_SAFE_DELETE_REPORT_2026-09-03.md`](./WAVE_46_SAFE_DELETE_REPORT_2026-09-03.md)                             | safe-delete wave execution report + link verification evidence                          | ACTIVE    |
| [`WAVE_46_CI_ANTI_DUP_GUARD_2026-09-03.md`](./WAVE_46_CI_ANTI_DUP_GUARD_2026-09-03.md)                               | CI anti-duplication governance checks implementation + validation evidence              | ACTIVE    |
| [`WAVE_46_CLOSEOUT_REPORT_2026-09-03.md`](./WAVE_46_CLOSEOUT_REPORT_2026-09-03.md)                                   | final Wave 46 closure metrics and completion summary                                    | ACTIVE    |

## Wave Bundles (full archive)

Wave SDD, backlog, readiness, and test-rollout documents live in:

- [`docs/plans/waves/`](../docs/plans/waves/) — 142+ wave bundle files (Wave 01–45+)
- [`docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md`](../docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md) — active deduplication/canonicalization execution backlog

## Full Planning Archive

All historical and extended planning docs live in:

- [`docs/plans/`](../docs/plans/) — 111+ files including AEGIS logs, phase docs, session logs

## Documentation Hierarchy

| Root                   | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `/plans/`              | Active execution entry points (this folder) |
| `/docs/plans/`         | Full planning archive + wave bundles        |
| `/docs/business_docs/` | Business/domain operational docs            |
| `/docs/`               | Software/engineering architecture docs      |
| `/docs/archives/`      | Superseded and historical content           |
