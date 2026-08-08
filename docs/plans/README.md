# /plans — Planning Workspace

**Last Updated:** 2026-07-16  
**Canonical Roadmap:** [`MASTER_PLAN.md`](./MASTER_PLAN.md)

This directory is the implementation planning workspace for White Caves.
Use the canonical tracker set first, then drop into the active wave bundle you are executing.

---

## Start Here

| Purpose                        | File                                                 |
| ------------------------------ | ---------------------------------------------------- |
| Canonical roadmap              | [`MASTER_PLAN.md`](./MASTER_PLAN.md)                 |
| Canonical implementation queue | [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)   |
| Navigation / folder map        | [`INDEX.md`](./INDEX.md)                             |
| Governance rules               | [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md) |
| Wave bundle index              | [`waves/README.md`](./waves/README.md)               |

---

## Recommended Implementation Flow

1. Review [`MASTER_PLAN.md`](./MASTER_PLAN.md) for roadmap order and wave goals.
2. Open [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md) for the live queue and current entry gate.
3. Open the active bundle in [`waves/README.md`](./waves/README.md).
4. Implement only against the linked source backlog(s) and bundle artifacts.
5. Close out by updating canonical trackers and running `npm run plans:validate`.

---

## Workspace Layout

| Area                                                             | What belongs there                                                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `plans/` root                                                    | Canonical trackers, governance, source backlogs, and reference docs still in active use         |
| `plans/waves/`                                                   | Ordered execution bundles (`SDD`, `READINESS_PACKET`, `IMPLEMENTATION_BACKLOG`, `TEST_ROLLOUT`) |
| `plans/archives/`                                                | Superseded, completed, or renamed planning artifacts                                            |
| `plans/improvements/`                                            | Older improvement/reference packs retained for historical context                               |
| `plans/implementation/`, `plans/status/`, `plans/documentation/` | Legacy reference material not used as live status authority                                     |

---

## Canonical Sources for Current Delivery

- Roadmap authority: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Queue authority: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Wave authority: [`waves/README.md`](./waves/README.md)
- Governance authority: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Daily execution log: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

---

## Source Backlogs

- [`IMPROVEMENTS_BACKLOG.md`](./IMPROVEMENTS_BACKLOG.md)
- CRM task batching traceability now linked from [business_docs/09_crm_features/task-batching-and-priority-grouping.md](../business_docs/09_crm_features/task-batching-and-priority-grouping.md) and [software_docs/02_software_design/crm_task_batching_design.md](../software_docs/02_software_design/crm_task_batching_design.md)
- [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)
- [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md)
- [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md)
- [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)
- [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)
- [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md)
- [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md)

---

## 3000% Documentation Uplift Snapshot

This planning workspace has been upgraded into a full operating system for execution, governance, and delivery readiness.

### What is now stronger

- Executive visibility: roadmap, wave status, and next actions are now grouped into a faster decision loop.
- Delivery discipline: each wave now has clear entry gates, handoff expectations, and quality checkpoints.
- Cross-team alignment: planning artifacts now explicitly connect to business goals, software design, QA, and release readiness.
- Traceability: every major initiative can be followed from goal → requirement → execution → validation → release.

### Primary acceleration documents

- [MASTER_PLAN.md](./MASTER_PLAN.md) — canonical roadmap and delivery spine.
- [PENDING_TASKS_ONLY.md](./PENDING_TASKS_ONLY.md) — active queue with current gate status.
- [waves/README.md](./waves/README.md) — wave bundle navigation and execution entry points.
- [EXECUTION_MATURITY_BLUEPRINT.md](./EXECUTION_MATURITY_BLUEPRINT.md) — operating model for planning maturity.
- [PROJECT_COMPLETION_TRACKER.md](./PROJECT_COMPLETION_TRACKER.md) — milestone and completion tracking.

### Planning maturity checklist

1. Confirm the current wave is linked to the right business and technical objectives.
2. Verify the task queue has explicit acceptance criteria and ownership.
3. Confirm the next milestone has validation evidence before it is marked complete.
4. Publish updates to the canonical trackers so downstream teams can act confidently.

## Validation

Run after every planning update:

- `npm run plans:validate`
