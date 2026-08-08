# Wave 32 — Test Rollout

**Wave:** 32  
**Status:** planned  
**Date:** 2026-08-02

---

## Validation Matrix

| Scope | Validation Type | Target | Pass Criteria |
| --- | --- | --- | --- |
| Business docs root | Markdown diagnostics | `docs/business_docs/README.md` | No markdown diagnostics |
| Software docs root | Markdown diagnostics | `docs/software_docs/INDEX.md` | No markdown diagnostics |
| ADR governance | Markdown diagnostics | `docs/software_docs/adr/README.md` | No markdown diagnostics |
| Progress dashboard | Markdown diagnostics | `docs/plans/PROGRESS_DASHBOARD.md` | No markdown diagnostics |
| Wave summary | Markdown diagnostics | `docs/plans/WAVE_PROGRESS_SUMMARY.md` | No markdown diagnostics |
| Tracker alignment | Consistency review | `MASTER_PLAN`, `PENDING_TASKS_ONLY`, `waves/README`, `PROJECT_PROGRESS` | No contradictory active-wave status |
| Governance integrity | Script | `npm run plans:validate` | Pass |

## Suggested Commands

- `npm run plans:validate`
- Markdown diagnostics on all touched planning and documentation files

## Evidence Capture

- Tracker snapshot after synchronization
- Progress dashboard render snapshot
- Wave summary snapshot
- Canonical docs structure confirmation references
