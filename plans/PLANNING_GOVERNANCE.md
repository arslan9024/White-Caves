# Planning Governance — Single Source of Truth

**Version:** 1.3  
**Last Updated:** 2026-05-24  
**Owner:** Product + Technical Planning

---

## Scope

This governance applies to:

- `plans/*`
- `plans/waves/*`
- planning-linked trackers: `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md`

---

## Folder Layout

| Location | Role |
| --- | --- |
| `plans/MASTER_PLAN.md` | Canonical roadmap and execution order |
| `plans/PENDING_TASKS_ONLY.md` | Canonical live queue |
| `plans/waves/` | Active implementation bundles |
| `plans/INDEX.md`, `plans/README.md` | Navigation only |
| `plans/archives/` | Superseded/completed docs |
| other `plans/*` folders | Reference-only context unless promoted by canonical trackers |

---

## Authority Hierarchy (Canonical Sources)

1. **Portfolio roadmap:** `plans/MASTER_PLAN.md`
2. **Active implementation queue:** `plans/PENDING_TASKS_ONLY.md`
3. **Active wave bundle:** linked `plans/waves/WAVE_##_*` files for the current wave
4. **Operational dashboard:** `PROJECT_PROGRESS.md`
5. **Daily execution log:** `DAILY_MILESTONE_TRACKER.md`
6. **Reference docs:** phase docs, improvement deep-dives, and archived material

If two files disagree, the higher file in this hierarchy wins.

---

## Ownership and Update Cadence

| File | Primary Owner | Update Trigger | Cadence |
| --- | --- | --- | --- |
| `plans/MASTER_PLAN.md` | Architecture + Product | sequence/order/status changes | Weekly or on wave transition |
| `plans/PENDING_TASKS_ONLY.md` | Planning | task completion, gate changes, blockers | Daily |
| `plans/waves/README.md` | Planning | bundle added/removed/renamed | Per change |
| `PROJECT_PROGRESS.md` | Planning | milestone state change | Daily |
| `DAILY_MILESTONE_TRACKER.md` | Execution lead | execution log updates | Daily |
| `plans/INDEX.md` / `plans/README.md` | Planning | navigation changes | Per change |

---

## Active vs Archived Rules

- Active execution bundles live in `plans/waves/`.
- Canonical status lives only in `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, `PROJECT_PROGRESS.md`, and `DAILY_MILESTONE_TRACKER.md`.
- Completed, superseded, or renamed planning docs move to `plans/archives/`.
- Reference docs may remain in `plans/` root for context, but they are not live status sources unless explicitly linked from the canonical stack.
- `plans/` must not contain ad-hoc `Pasted-*` files.

---

## Required Metadata for Active Wave Files

Every active wave document should contain:

- `Wave`
- `Date` or `Last Updated`
- `Status`
- `Focus` or `Objective`
- `Owners`
- entry gate or dependencies
- validation or closeout rules

---

## Status Source Pointers (Mandatory)

Canonical tracker files must link back to:

- `plans/MASTER_PLAN.md`
- `plans/PENDING_TASKS_ONLY.md`

Wave bundles should be reachable from:

- `plans/PENDING_TASKS_ONLY.md`
- `plans/waves/README.md`

---

## Validation and Hygiene

Run:

- `npm run plans:validate`

Hard gate:

- Every planning/tracker update must pass `npm run plans:validate` before it is considered complete.
- Queue or roadmap changes should be mirrored in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md` when execution status changes.
- Broken links, stale dates, and duplicate active wave names are planning defects and must be fixed before further implementation.

Schedule:

- Weekly: roadmap and queue hygiene review
- Weekly: archive sweep for superseded bundles or duplicate active names
- Daily: canonical tracker sync (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`)

