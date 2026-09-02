# Wave 46 — Deduplication & Canonicalization Backlog

**Wave:** 46  
**Focus:** Repository structure cleanup, mirror consolidation, and anti-duplication governance  
**Status:** 🟢 Active  
**Date:** 2026-09-03  
**Entry Gate:** Wave 45 planning state acknowledged + Phase 0 baseline inventory captured

---

| ID      | Priority | Task                                                                                                                                     | Owner                  | Validation Command                                   | Status         |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------- | -------------- |
| W46-001 | P0       | Produce baseline duplication inventory (plans/docs/code roots, duplicate filename hotspots, canonical conflict list)                     | @Mira + @Katherine     | Inventory file created + evidence snapshots captured | ✅ Complete    |
| W46-002 | P0       | Define canonical path policy for plans/docs/business docs and mark mirror copies as reference-only where applicable                      | @Ada + @Margaret       | `grep` check shows canonical banners on mirrors      | 🟡 In Progress |
| W46-003 | P0       | Reconcile planning truth set: `plans/MASTER_PLAN.md`, `plans/PENDING_TASKS_ONLY.md`, `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md` | @Margaret + @Katherine | `npm run plans:validate`                             | 🟡 In Progress |
| W46-004 | P1       | Build documentation dedup matrix for `docs/plans/` (active vs archive vs superseded)                                                     | @Margaret              | Matrix with owner/action columns published           | 📋 Planned     |
| W46-005 | P1       | Business docs consolidation decision: choose canonical root and map migration plan with redirects/pointers                               | @Ada + @Sofia          | Decision record + migration map merged               | 📋 Planned     |
| W46-006 | P1       | Frontend overlap audit (`src/`, `app/`, `pages/`) and route-entry conflict report                                                        | @Mira + @Una           | Audit report + conflict list                         | 📋 Planned     |
| W46-007 | P1       | Backend overlap audit (`server/routes`, `server/services`, `api/`) and duplicate handler map                                             | @Mira + @Radia         | Audit report + merge candidates list                 | 📋 Planned     |
| W46-008 | P2       | Execute safe-delete wave for superseded mirrors after link and pointer verification                                                      | @Katherine             | Link check + clean git diff + no broken references   | 📋 Planned     |
| W46-009 | P0       | Add anti-duplication governance checks to CI (duplicate-path lint + canonical tracker consistency checks)                                | @Gwynne + @Katherine   | CI pipeline green with new checks                    | 📋 Planned     |
| W46-010 | P0       | Wave 46 closeout report with before/after metrics (dup count, stub count, file-count delta)                                              | @Margaret + @Katherine | `npm run plans:validate` + closure report published  | 📋 Planned     |

---

## Dependency Order

1. W46-001 (inventory baseline)
2. W46-002 + W46-003 (canonical policy + planning truth sync)
3. W46-004 + W46-005 (docs/business-doc consolidation decision)
4. W46-006 + W46-007 (code overlap audits)
5. W46-008 + W46-009 (cleanup + CI guardrails)
6. W46-010 (closeout and metrics)

---

## Exit Criteria

Wave 46 is complete only when:

1. Canonical path ownership is unambiguous across planning and documentation layers.
2. Planning truth-set files are consistent and validated.
3. Duplicate mirror files are classified and either archived, merged, or flagged with canonical pointers.
4. CI has anti-duplication checks enabled.
5. Closure report shows measurable deduplication improvement.
