# Planning Governance — Single Source of Truth

**Version:** 1.2  
**Last Updated:** 2026-05-22  
**Owner:** Product + Technical Planning

---

## Scope

This governance applies to:

- `plans/*`
- `business_docs/*` (planning-linked strategic docs)
- `server/routes/plans.js` and `src/server/services/PlanService.js`

---

## Authority Hierarchy (Canonical Sources)

1. **Portfolio Roadmap (canonical):** `plans/MASTER_PLAN.md`
2. **Active sprint/phase execution (canonical):** latest active `plans/PHASE_*.md`
3. **Pending queue (canonical):** `plans/PENDING_TASKS_ONLY.md`
4. **Operational dashboard (canonical):** `PROJECT_PROGRESS.md`
5. **Daily execution log:** `DAILY_MILESTONE_TRACKER.md`
6. **Historical records:** `archives/plans/completed/` and `archives/plans/superseded/`

If two files disagree, the higher file in this hierarchy wins.

---

## Ownership and Update Cadence

| File                          | Primary Owner          | Update Trigger                 | Cadence                       |
| ----------------------------- | ---------------------- | ------------------------------ | ----------------------------- |
| `plans/MASTER_PLAN.md`        | Architecture + Product | Priority/order/status change   | Weekly or on phase transition |
| `plans/PENDING_TASKS_ONLY.md` | Planning               | Task completion or new blocker | Daily                         |
| `PROJECT_PROGRESS.md`         | Planning               | Milestone state change         | Daily                         |
| `DAILY_MILESTONE_TRACKER.md`  | Execution lead         | End-of-day execution log       | Daily                         |
| `plans/INDEX.md`              | Planning               | Active/superseded list changes | Per change                    |

---

## Active vs Archived Rules

- Active execution docs remain in `plans/`.
- Completed phase plans move to `archives/plans/completed/`.
- Superseded/duplicate/ad-hoc artifacts move to `archives/plans/superseded/`.
- `plans/` must not contain `Pasted-*` files.

---

## Required Metadata for Active Phase Files

Every active `PHASE_*.md` must contain:

- Date or Last Updated
- Status
- Objective
- Deliverables
- Exit Criteria
- Dependencies
- Owners
- Validation Gates

Use `plans/PHASE_PLAN_TEMPLATE.md` for new phase files.

---

## Status Source Pointers (Mandatory)

All tracker files must include a `Status Source Pointers` section linking:

- `plans/MASTER_PLAN.md`
- `plans/PENDING_TASKS_ONLY.md`
- `PROJECT_PROGRESS.md` (operational dashboard)
- active `plans/PHASE_*.md` (current execution stream)

---

## Validation and Hygiene

Run:

- `npm run plans:validate`

Hard gate:

- Every planning/tracker update must pass `npm run plans:validate` before being considered complete.
- If validation fails, treat status updates as invalid until corrected and revalidated.

Schedule:

- Weekly active-file metadata/link review
- Monthly archive sweep for superseded files
- Weekly planning hygiene cycle: prune stale queue items, re-rank blockers by impact, and de-activate legacy docs from active status paths
- Daily rule: update canonical trackers only (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`)
