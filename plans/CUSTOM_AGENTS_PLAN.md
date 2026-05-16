# White Caves — Custom Agents & Subagents Plan

> **Updated:** 2026-05-16  
> **Status:** Active governance guide (supersedes Phase 6–10 tactical snapshot)

---

## Purpose

This file defines how custom agents/subagents are dispatched **today** and how their work maps to canonical planning files.

---

## Canonical References

- Roadmap authority: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Pending queue authority: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Daily execution log: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)
- Agent roster + current free-agent queue: [`../AGENTS.md`](../AGENTS.md)
- Runtime policy authority: [`../.github/copilot-instructions.md`](../.github/copilot-instructions.md)

---

## Dispatch Policy (Current)

1. **Free planning agents (17) remain docs-only** and use free-tier models only.
2. **Premium coding/design requests** are blocked until the exact approval phrase exists:  
   `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
3. Every planning handoff must include:
   - `CONSUMES←@Agent: file#section`
   - `FEEDS→@Agent: file#section`
   - `FEEDS_ACK←@DownstreamAgent: accepted|revise + file#section`
4. Free-agent outputs are synchronized through `AGENTS.md` sprint table and reflected in `PROJECT_PROGRESS.md` / `DAILY_MILESTONE_TRACKER.md`.

---

## Subagent Routing Matrix

| Work Type                                    | Primary Agent(s)                                                | Output Location                                               | Promotion Rule                                               |
| -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Business rules, legal, compliance, KPI specs | @Victoria, @Invoice, @Sofia, @Cassie, @Joelle (+ expanded pool) | `business_docs/`                                              | Must reach 60% readiness evidence before coding              |
| Sprint decomposition and queue maintenance   | @Margaret                                                       | `plans/`, `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md` | Must align with `MASTER_PLAN.md` and `PENDING_TASKS_ONLY.md` |
| Architecture and premium gate decision       | @Ada                                                            | policy declaration in tracker/session                         | Must use exact 60% readiness approval phrase                 |
| Coding implementation                        | Senior coding/design agents                                     | codebase + tests                                              | Allowed only after Gate approval                             |
| QA/runtime guard                             | @Katherine (+ @Gwynne for deployment)                           | tests, runtime guard logs                                     | Required after big premium wave commits                      |

---

## Session Start Checklist for Subagent-Orchestrated Work

- [ ] Target feature/module identified
- [ ] Business docs exist with 60% evidence
- [ ] Plan exists in canonical queue
- [ ] @Margaret sign-off present
- [ ] @Ada exact approval phrase present
- [ ] Daily premium cap logged
- [ ] FEEDS/CONSUMES/FEEDS_ACK chain complete for upstream planning outputs

If any box is unchecked, route back to planning agents (no premium coding).

---

## Notes on Historical Content

The old Phase 6–10 assignment snapshot (May 2026) is now historical context.
Current execution authority has moved to the canonical references above and the active AGENTS roster.
