# Deduplication Baseline Inventory — 2026-09-03

**Task ID:** W46-001  
**Status:** 🟢 Active  
**Owner:** @Mira + @Katherine (implementation), @Margaret (planning sync)

## Baseline Snapshot

### Key Documentation Root Counts

| Root                  | File Count | Notes                                                               |
| --------------------- | ---------: | ------------------------------------------------------------------- |
| `plans/`              |         12 | Canonical active planning root (small + curated).                   |
| `docs/plans/`         |        876 | Large archive + wave bundles; high drift risk if treated as live.   |
| `docs/business_docs/` |        209 | Active business documentation corpus (includes stubs/pending docs). |
| `software_docs/`      |    MISSING | Referenced in plan text but not present at root path.               |
| `business_docs/`      |    MISSING | Referenced in governance text but not present at root path.         |

### Canonical/Mirror Planning Files Found

| Artifact                     | Locations                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `MASTER_PLAN.md`             | `plans/MASTER_PLAN.md`, `docs/plans/MASTER_PLAN.md`, `docs/plans/archives/MASTER_PLAN.md`, `docs/archives/MASTER_PLAN.md` |
| `PENDING_TASKS_ONLY.md`      | `plans/PENDING_TASKS_ONLY.md`, `docs/plans/PENDING_TASKS_ONLY.md`                                                         |
| `DAILY_MILESTONE_TRACKER.md` | `DAILY_MILESTONE_TRACKER.md`, `docs/plans/DAILY_MILESTONE_TRACKER.md`                                                     |
| `INDEX.md`                   | `plans/INDEX.md`, `docs/plans/INDEX.md`, `docs/INDEX.md`                                                                  |

### Parallel Code Roots

| Root      | File Count |
| --------- | ---------: |
| `src/`    |       3643 |
| `server/` |        636 |
| `app/`    |         21 |
| `api/`    |          9 |
| `pages/`  |          1 |

### Duplicate Filename Hotspots (Top sample)

| File name                 | Count |
| ------------------------- | ----: |
| `index.ts`                |   119 |
| `index.tsx`               |    32 |
| `README.md`               |    28 |
| `index.js`                |    19 |
| `MASTER_PLAN.md`          |     4 |
| `DashboardComponents.css` |     3 |
| `ToolsDashboard.tsx`      |     3 |
| `TopNavbar.tsx`           |     3 |

> Note: duplicate filenames do not always mean duplicate logic, but they are high-probability targets for merge/review.

## Initial Classification Buckets

### Safe-Merge Candidates

- Planning mirrors: `docs/plans/MASTER_PLAN.md`, `docs/plans/PENDING_TASKS_ONLY.md`, `docs/plans/DAILY_MILESTONE_TRACKER.md`
- Duplicate index surfaces: `docs/INDEX.md` vs `plans/INDEX.md`

### Needs-Migration Candidates

- Any still-active planning content under `docs/plans/` that should be canonicalized into `/plans/`.
- Business-doc references that point to non-existing root paths (`software_docs/`, `business_docs/`).

### Needs-Review Candidates

- Parallel runtime roots (`src/`, `app/`, `api/`, `pages/`) for overlap and routing duplication.
- Repeated UI primitives (`TopNavbar`, `ToolsDashboard`, badges, status components) across multiple paths.

### Safe-Delete Candidates (deferred until verification)

- Superseded mirror docs after canonical pointers are added and links are updated.

## Phase 0 Exit Criteria

- [ ] Duplication matrix completed with owner/action per item.
- [ ] Canonical-path banner added to non-canonical mirrors.
- [ ] No unresolved source-of-truth conflicts for planning trackers.

## Validation Evidence Commands

```powershell
# duplicate filenames snapshot
Get-ChildItem -Recurse -File | Group-Object Name | Where-Object { $_.Count -gt 1 }

# key roots size snapshot
Get-ChildItem plans -Recurse -File | Measure-Object
Get-ChildItem docs/plans -Recurse -File | Measure-Object
Get-ChildItem docs/business_docs -Recurse -File | Measure-Object

# canonical file existence check
Test-Path plans/MASTER_PLAN.md
Test-Path docs/plans/MASTER_PLAN.md
```
