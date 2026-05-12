# White Caves — Verified Progress Dashboard

> **Last Updated:** May 12, 2026  
> **Canonical roadmap:** `/home/runner/work/White-Caves/White-Caves/plans/MASTER_PLAN.md`

---

## Summary

| Metric                       | Value                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| Stale headline being retired | 40%                                                           |
| Current verified baseline    | Foundation complete; execution verification reset in progress |
| Target verified completion   | 75%                                                           |
| Progress model               | Weighted milestones with evidence                             |
| Verification rule            | No milestone counts without proof                             |

---

## Progress Calculation Rules

1. Only **verified** milestones count toward completion.
2. Starting work does **not** increase the reported percentage.
3. Documentation-only updates may improve clarity, but they do **not** inflate delivery progress.
4. A milestone must include code/doc evidence, acceptance criteria, and a named verifier.
5. Conflicting historic percentages are treated as archived claims unless re-verified.

---

## Verified Milestone Ledger

| Milestone                   | Weight | Current State   | Evidence                                          | Verified By | Notes                                  |
| --------------------------- | ------ | --------------- | ------------------------------------------------- | ----------- | -------------------------------------- |
| Canonical roadmap reset     | 10%    | In Verification | `plans/MASTER_PLAN.md`                            | Pending     | Replaces stale 40% framing             |
| Status doc normalization    | 5%     | In Verification | `PROJECT_OVERVIEW.md`, `PROJECT_PROGRESS.md`      | Pending     | Retires contradictory claims           |
| Multi-agent operating model | 5%     | In Verification | `AGENTS.md`                                       | Pending     | Defines callable-agent pipeline        |
| Sprint board reset          | 5%     | In Verification | `CURRENT_SPRINT.md`, `DAILY_MILESTONE_TRACKER.md` | Pending     | Aligns work with 75% target            |
| Homepage completion lane    | 20%    | Planned         | `src/pages/HomePage.tsx`, homepage components     | Pending     | Search/mobile/a11y/perf verification   |
| Portal completion lane      | 20%    | Planned         | portal pages + portal APIs                        | Pending     | Error/loading/empty state verification |
| CRM real-API lane           | 15%    | Planned         | CRM modules + APIs                                | Pending     | Reduce mock-backed gaps                |
| Hardening lane              | 15%    | Planned         | CI/security/QA evidence                           | Pending     | Build, test, and security proof        |

---

## Active Risks and Blockers

| Blocker                                                                  | Impact                                              | Owner Lane | Status |
| ------------------------------------------------------------------------ | --------------------------------------------------- | ---------- | ------ |
| Historic docs use conflicting percentages                                | Progress reporting is unreliable                    | Lane A     | Active |
| Repository lint has pre-existing errors outside this docs scope          | Full green lint cannot currently prove readiness    | Lane E     | Active |
| Repository tests have pre-existing failures in `PropertySourcingService` | Global test pass is not yet a trustworthy milestone | Lane E     | Active |
| Remaining mock-backed CRM areas are not fully inventoried here           | CRM completion percentage cannot yet be verified    | Lane D     | Active |

---

## Baseline Validation Notes

- `npm run build` succeeded before these documentation updates.
- `npm run lint` failed due to existing issues in legacy WhatsApp/backend files outside this change.
- `npm run test:run` failed due to existing `PropertySourcingService` test failures outside this change.

These issues must be tracked, but they are not being reclassified as caused by this documentation update.
