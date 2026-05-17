# Pending Tasks Only

**Last Updated:** 2026-05-18

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)

## Active Pending Plans

| Phase | Plan File                                                                                        | Status                                |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------- |
| N+1   | Auth/login hardening + route consistency                                                         | ⬜ Not started                        |
| N+2   | Tenant portal live data parity                                                                   | ⬜ Not started                        |
| N+3   | Managing-director CRM critical tabs                                                              | ⬜ Not started                        |
| N+4   | Convert top 3 revenue-impact stub endpoints                                                      | ⬜ Not started                        |
| N+5   | Test + release hardening                                                                         | ⬜ Not started                        |
| N+6   | UI architecture hardening: component granularity + event-driven rendering + Arabic RTL readiness | ⬜ Not started                        |
| N+7   | Subagent next-level upgrade: 90% readiness + full-team collaboration mesh                        | ⬜ Not started                        |
| —     | [`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md)               | ⬜ Near-complete (close Workstream E) |
| —     | [`PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md`](./PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md) | ⬜ Planned                            |

## Immediate Focus

- [ ] Start N+1: Auth/login hardening (owns: @Daniela, @Mira, @Katherine)
- [ ] Close Phase 26 Workstream E audit advisory or explicitly defer with owner + date
- [ ] Enforce archive rule — move superseded `plans/SESSION_*`, `plans/PHASE_2_*` files to `archives/`
- [ ] Keep status consistent across `MASTER_PLAN`, `PROJECT_PROGRESS`, and this file
- [ ] Start N+6.A: Component decomposition audit for top 20 high-traffic screens (auth + CRM + dashboards)
- [ ] Start N+6.B: Arabic/RTL localization readiness pass (text extraction, directionality, icon mirroring)
- [ ] Start N+6.C: Event-driven rendering hardening (selector scope, memoization boundaries, lazy-triggered rendering)
- [ ] Start N+7.A: Enforce dual-threshold readiness model (60% unlock, 90% target for large waves)
- [ ] Start N+7.B: Enforce premium routing guardrails (coding/design seniors only; planning remains free-model-only)
- [ ] Start N+7.C: Close tracker sync gap between queue evidence and status dashboards

## Archive Rule

When a phase plan is completed or superseded, move it to `../archives/plans/completed/` or `../archives/plans/superseded/`.

## Completed (Archived)

- [x] [`PHASE_24_MODULE_TRACEABILITY_MATRIX.md`](./PHASE_24_MODULE_TRACEABILITY_MATRIX.md)
- [x] [`PHASE_24_ACCEPTANCE_TEST_PLAN.md`](./PHASE_24_ACCEPTANCE_TEST_PLAN.md)
- [x] [`PHASE_25_OPERATIONAL_VERIFICATION_LOG.md`](./PHASE_25_OPERATIONAL_VERIFICATION_LOG.md)
- [x] [`PHASE_25_EXECUTION_GUIDE.md`](./PHASE_25_EXECUTION_GUIDE.md)
- [x] [`PHASE_23_24_25_IMPLEMENTATION_PLAN.md`](./PHASE_23_24_25_IMPLEMENTATION_PLAN.md)
