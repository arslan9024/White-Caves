# Pending Tasks Only

**Last Updated:** 2026-05-18

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)

## Active Pending Plans

| Phase | Plan File                                                                                        | Status                                |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------- |
| N+1   | Auth/login hardening + route consistency                                                         | ✅ Complete                           |
| N+2   | Tenant portal live data parity                                                                   | ✅ Complete                           |
| N+3   | Managing-director CRM critical tabs                                                              | ✅ Complete                           |
| N+4   | Convert top 3 revenue-impact stub endpoints                                                      | ✅ Complete                           |
| N+5   | Test + release hardening                                                                         | ✅ Complete                           |
| N+6   | UI architecture hardening: component granularity + event-driven rendering + Arabic RTL readiness | ✅ Complete (RTL + i18n fully wired)  |
| —     | [`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md)               | ⬜ Near-complete (close Workstream E) |

## Immediate Focus

- [x] N+1: Auth/login hardening — JWT refresh endpoint + 2FA route rate limits
- [x] N+2: Tenant portal parity — dedicated `/api/portal/tenant/*` endpoints, removed FALLBACK_LEASE mock
- [x] N+3: CRM Executive tab live data — ZoeExecutiveCRM wired to appointments + agents APIs
- [x] N+4: Revenue-impact stubs — plans.js confirmed unregistered; ZoeExecutiveCRM live data
- [x] N+5: Test + release hardening — full build pass, pre-existing failures confirmed pre-date this sprint
- [x] N+6: Arabic RTL fully implemented (translations + `dir` attribute + font switching)
- [ ] Close Phase 26 Workstream E audit advisory or explicitly defer with owner + date
- [ ] Enforce archive rule — move superseded `plans/SESSION_*`, `plans/PHASE_2_*` files to `archives/`
- [ ] Keep status consistent across `MASTER_PLAN`, `PROJECT_PROGRESS`, and this file

## Archive Rule

When a phase plan is completed or superseded, move it to `../archives/plans/completed/` or `../archives/plans/superseded/`.

## Completed (Archived)

- [x] [`PHASE_24_MODULE_TRACEABILITY_MATRIX.md`](./PHASE_24_MODULE_TRACEABILITY_MATRIX.md)
- [x] [`PHASE_24_ACCEPTANCE_TEST_PLAN.md`](./PHASE_24_ACCEPTANCE_TEST_PLAN.md)
- [x] [`PHASE_25_OPERATIONAL_VERIFICATION_LOG.md`](./PHASE_25_OPERATIONAL_VERIFICATION_LOG.md)
- [x] [`PHASE_25_EXECUTION_GUIDE.md`](./PHASE_25_EXECUTION_GUIDE.md)
- [x] [`PHASE_23_24_25_IMPLEMENTATION_PLAN.md`](./PHASE_23_24_25_IMPLEMENTATION_PLAN.md)
