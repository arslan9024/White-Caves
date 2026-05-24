# /plans — Planning Workspace

**Last Updated:** 2026-05-24  
**Canonical Roadmap:** [`MASTER_PLAN.md`](./MASTER_PLAN.md)

This directory is the implementation planning workspace for White Caves.
Use the canonical tracker set first, then drop into the active wave bundle you are executing.

---

## Start Here

| Purpose | File |
| --- | --- |
| Canonical roadmap | [`MASTER_PLAN.md`](./MASTER_PLAN.md) |
| Canonical implementation queue | [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md) |
| Navigation / folder map | [`INDEX.md`](./INDEX.md) |
| Governance rules | [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md) |
| Wave bundle index | [`waves/README.md`](./waves/README.md) |

---

## Recommended Implementation Flow

1. Review [`MASTER_PLAN.md`](./MASTER_PLAN.md) for roadmap order and wave goals.
2. Open [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md) for the live queue and current entry gate.
3. Open the active bundle in [`waves/README.md`](./waves/README.md).
4. Implement only against the linked source backlog(s) and bundle artifacts.
5. Close out by updating canonical trackers and running `npm run plans:validate`.

---

## Workspace Layout

| Area | What belongs there |
| --- | --- |
| `plans/` root | Canonical trackers, governance, source backlogs, and reference docs still in active use |
| `plans/waves/` | Ordered execution bundles (`SDD`, `READINESS_PACKET`, `IMPLEMENTATION_BACKLOG`, `TEST_ROLLOUT`) |
| `plans/archives/` | Superseded, completed, or renamed planning artifacts |
| `plans/improvements/` | Older improvement/reference packs retained for historical context |
| `plans/implementation/`, `plans/status/`, `plans/documentation/` | Legacy reference material not used as live status authority |

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
- [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)
- [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md)
- [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md)
- [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)
- [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)
- [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md)
- [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md)

---

## Validation

Run after every planning update:

- `npm run plans:validate`

