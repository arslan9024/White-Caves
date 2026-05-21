# Pending Tasks Only

**Last Updated:** 2026-05-21

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)

## Active Pending Plans

| Phase | Plan File                                                                                        | Status                                                                  |
| ----- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| N+1   | Auth/login hardening + route consistency                                                         | ✅ Complete                                                             |
| N+2   | Tenant portal live data parity                                                                   | ✅ Complete                                                             |
| N+3   | Managing-director CRM critical tabs                                                              | ✅ Complete                                                             |
| N+4   | Convert top 3 revenue-impact stub endpoints                                                      | ✅ Complete                                                             |
| N+5   | Test + release hardening                                                                         | ✅ Complete                                                             |
| N+6   | UI architecture hardening: component granularity + event-driven rendering + Arabic RTL readiness | ✅ Complete (RTL + i18n fully wired)                                    |
| N+7   | Subagent next-level upgrade: 90% readiness + full-team collaboration mesh                        | ✅ Completed (May 18, 2026)                                             |
| N+8   | Google social auth production hardening + role-based dashboard redirect consistency              | 🚧 In progress (May 21, 2026)                                           |
| —     | [`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md)               | 🕒 Deferred (Workstream E advisory; owner @Margaret, target 2026-05-23) |
| —     | [`PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md`](./PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md) | ⬜ Planned                                                              |

## Immediate Focus

- [x] Start N+1: Auth/login hardening (owns: @Daniela, @Mira, @Katherine)
- [x] Complete N+1→N+6 bundle (validated together: typecheck ✅, lint ✅, tenant portal tests 36/36 ✅)
- [x] Close Phase 26 Workstream E audit advisory — deferred with owner/date (owner: @Margaret, revisit: 2026-05-23)
- [x] Enforce archive rule — moved superseded `plans/SESSION_*`, `plans/PHASE_2_*` files to `archives/plans/superseded/`
- [x] Keep status consistent across `MASTER_PLAN`, `PROJECT_PROGRESS`, and this file
- [ ] Complete N+8 Google social auth build fix + dashboard redirect consistency validation

## N+1 Completion Summary (2026-05-17)

- `refreshTokenHash` field added to Prisma `User` model (nullable String)
- Login + firebase-sync now issue a 7-day httpOnly `refresh_token` cookie (`{userId}:{rawToken}` format)
- `POST /api/auth/refresh` — verifies cookie, bcrypt-compares token hash, rotates token, returns new JWT
- `POST /api/auth/logout` — clears `refreshTokenHash` in DB + clears cookie
- `authLimiter` applied to `/refresh` endpoint
- 6 new refresh tests + 2 updated logout tests all pass (80 total, 11 pre-existing failures unchanged)

## N+4 Completion Summary (2026-05-17)

- `GET /api/whatsapp/settings` — now reads from `SystemSetting` table (key: `whatsapp_settings`)
- `PUT /api/whatsapp/settings` — now persists phoneNumber/autoReply/businessHours to `SystemSetting`
- `POST /api/whatsapp/session` — generates real sessionId, persists to `SystemSetting` (key: `whatsapp_session`); returns 400 if phoneNumber missing
- `POST /api/payments/create-payment-intent` — returns **402** (Payment Required) instead of 503; adds `code: 'PAYMENT_NOT_CONFIGURED'` for client handling

## Archive Rule

When a phase plan is completed or superseded, move it to `../archives/plans/completed/` or `../archives/plans/superseded/`.

## Completed (Archived)

- [x] [`PHASE_24_MODULE_TRACEABILITY_MATRIX.md`](./PHASE_24_MODULE_TRACEABILITY_MATRIX.md)
- [x] [`PHASE_24_ACCEPTANCE_TEST_PLAN.md`](./PHASE_24_ACCEPTANCE_TEST_PLAN.md)
- [x] [`PHASE_25_OPERATIONAL_VERIFICATION_LOG.md`](./PHASE_25_OPERATIONAL_VERIFICATION_LOG.md)
- [x] [`PHASE_25_EXECUTION_GUIDE.md`](./PHASE_25_EXECUTION_GUIDE.md)
- [x] [`PHASE_23_24_25_IMPLEMENTATION_PLAN.md`](./PHASE_23_24_25_IMPLEMENTATION_PLAN.md)
