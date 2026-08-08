# Wave 33 — Implementation Backlog

**Wave:** 33  
**Focus:** Business Docs Canonicalization and Coverage Completion  
**Status:** planned  
**Date:** 2026-08-07  
**Entry Gate:** Wave 32 governance baseline active + readiness above 60%

---

| ID | Priority | Task | Owner | Validation |
| --- | --- | --- | --- | --- |
| W33-001 | P0 | Normalize `docs/business_docs/README.md` metadata, canonical links, and governance language to current 2026 reality | @Ada + @Dena | Markdown diagnostics clean + canonical link review |
| W33-002 | P0 | Rebuild `docs/business_docs/09_crm_features/README.md` from actual 2026 feature inventory | @Dena + @Marissa | Feature index complete + markdown diagnostics clean |
| W33-003 | P0 | Refresh `docs/business_docs/05_requirements/README.md` to reflect current requirement families and downstream traceability surfaces | @Ada + @Mala | Requirement index review + markdown diagnostics clean |
| W33-004 | P0 | Audit and normalize `docs/business_docs/05_requirements/requirements-framework.md` references; retire or replace dead/non-canonical paths | @Mala + @Margaret | No weak references remain unresolved |
| W33-005 | P1 | Expand `docs/business_docs/13_testing/uat-scenarios.md` into a broader scenario posture with exception/regression/compliance guidance | @Katherine + @Salma | Scenario sections published + review checklist added |
| W33-006 | P1 | Refresh `docs/business_docs/15_release_management/README.md` with current release/readiness cadence and future-wave handoff framing | @Gwynne + @Margaret | Release front door updated + markdown diagnostics clean |
| W33-007 | P1 | Surface canonical HR/policy/company-ops entrypoints from within business-doc root navigation | @Dena + @Margaret | HR/policy links visible from canonical business-doc entrypoint |
| W33-008 | P1 | Publish Wave 33 companion coverage artifacts (`BUSINESS_DOC_COVERAGE_MATRIX`, `ACCEPTANCE_CRITERIA_GAP_LOG`) | @Margaret + @Mala | Companion docs published |
| W33-009 | P0 | Sync `docs/plans/WAVE_PROGRESS_SUMMARY.md`, `docs/plans/PENDING_TASKS_ONLY.md`, and `docs/plans/waves/README.md` for Wave 33 registration and status | @Margaret | `npm run plans:validate` |

---

## Sequencing

1. Root entrypoint normalization (`W33-001`)
2. CRM feature and requirements front-door rebuild (`W33-002` to `W33-004`)
3. Scenario and release-governance hardening (`W33-005`, `W33-006`)
4. HR/policy surfacing and companion coverage artifacts (`W33-007`, `W33-008`)
5. Tracker synchronization (`W33-009`)

## Acceptance Gate

Wave 33 is complete only when:

1. Business-doc canonical entrypoints are current and contradiction-free.
2. Major business-doc requirement and feature indexes reflect the real file set.
3. Scenario and release-management surfaces are future-implementation-ready.
4. Tracker references reflect Wave 33 as a registered future documentation wave.
5. `npm run plans:validate` passes.
