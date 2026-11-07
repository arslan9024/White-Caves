# PLANNING_GOVERNANCE

## Implementation Synchronization Report
**Date**: 2026-08-16
**Status**: IN PROGRESS
**Target**: Global Repository and Website Implementation Synchronization

### Active Mandates
- **Refactoring**: All repository components migrating to strict co-located subfolder segregation (`/content-data/`,`/logic/` and `/styles/`).
- **Navigation**: Merging scattered sidebars into `src/layouts/UnifiedWorkspaceLayout.tsx` with Level 5 "[Managing Director Hub]" panel.
- **Aesthetics**: Global enforcement of White Caves Red (`#EF4444`) and Brilliant White (`#FFFFFF`). Circular brand logo container overhang doubled to exactly 50% out of the top navbar frame.
- **Data Access**: Auth layer bypass for `arslanmalikgoraha@gmail.com` (LEVEL 5 MASTER). Auto-hydration of 100 dummy properties and 100 personnel profiles.

### Governance
Adhere strictly to the `CREDIT_PRESERVATION_LAW` guidelines, prioritizing targeted file modification and local compilation validation over broad scanning.

### Chronicle Tips — Applied 2026-08-18

> From `/chronicle tips` pattern analysis of 31 sessions. Follow these rules in every session.

**Rule 1 — No `--no-verify` commits.** Fix the root cause (lint/CSS/build error). Consult `docs/plans/SESSION_TIPS_2026-08-18.md` for the current list of known root causes.

**Rule 2 — Always use a named branch.** Convention: `copilot/wave-NN-<feature-slug>`. Never work directly on `main` or `develop`.

**Rule 3 — Batch `plans/` edits into one session.** All `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, and wave backlog files for a single wave must be updated in one session using the `Planner` agent.

**Rule 4 — Co-generate tests with source files.** When creating a new service or component, run the `QA` agent to scaffold the matching test file in the same session.

**Rule 5 — Start every session with the progress intel brief.** Run `npm run orchestrator:progress:intel:brief` before any planning or code work. See `docs/plans/SESSION_START_CHECKLIST.md`.

**Rule 6 — Delegate doc conflicts to the Architect agent.** For conflicts in `AGENTS.md`, governance, or plan files, use the `Architect` agent. For `package-lock.json`, run `npm install` fresh.

**Rule 7 — Tag completed waves before merging to main.** Run `git tag wave-NN-complete` and update `docs/plans/DEPLOYMENT.md` before any main merge.
