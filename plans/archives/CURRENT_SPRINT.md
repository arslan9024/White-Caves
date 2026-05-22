# CURRENT SPRINT — 82% Baseline to 95%+ Production Readiness

**Sprint Goal:** Keep the planning surface small, reduce the remaining TypeScript/backend blockers, and move the project from the current **82% baseline** toward **95%+ production readiness**.
**Date:** 2026-05-22
**Status:** In Progress

---

## P0 Must Ship

| ID  | Milestone                 | Owner Lane | Acceptance Criteria                                                                  | Verification Owner | Status      |
| --- | ------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------------------ | ----------- |
| S0  | Baseline reset            | Lane A     | Canonical roadmap, progress ledger, sprint board, and tracker are aligned            | guardian           | Complete    |
| S1  | Notifications schema fix  | Lane D     | `prisma.notification` is backed by an actual model or the route is refactored safely | QA + Security      | In Progress |
| S2  | Remaining server blockers | Lane D     | The server TypeScript baseline is reduced from 17 errors toward zero                 | QA                 | Ready       |
| S3  | Frontend hotspot cleanup  | Lane B     | Top UI type hotspots are prioritized after server blockers                           | QA                 | Ready       |
| S4  | Release hardening         | Lane E     | Lint/test/build blockers are recorded and triaged without overstating readiness      | guardian           | Ready       |

---

## P1 If Capacity

- refine weighted milestone accounting for the new blocker baseline
- split the remaining server lane into notifications/compliance/linda micro-lanes
- add release evidence links for staging/runtime verification

---

## Dependency Map

1. **S0** must complete before any % claim changes.
2. **S1** should complete before broader backend cleanup because it is the current top blocker.
3. **S2–S4** can run in parallel once the notifications decision is complete.
4. No milestone becomes **Verified** until recorded in `PROJECT_PROGRESS.md`.

---

## Verification Queue

| Item              | Needed Evidence                                                  |
| ----------------- | ---------------------------------------------------------------- |
| Baseline reset    | updated docs + reviewer confirmation                             |
| Notifications fix | schema decision + regenerated Prisma client + typecheck evidence |
| Server blockers   | targeted server typecheck evidence                               |
| Frontend slice    | targeted UI/API verification evidence                            |
| Hardening slice   | lint/test/build/security findings with disposition               |
