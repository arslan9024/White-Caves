# Plans Index

**Last Updated:** 2026-08-08

## Start Here (Canonical)

- [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- [`MASTER_PLAN_36X_600_DETAIL.md`](./MASTER_PLAN_36X_600_DETAIL.md)
- [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- [`WAVE_33_132_EXECUTION_MATRIX.md`](./WAVE_33_132_EXECUTION_MATRIX.md)
- [`waves/README.md`](./waves/README.md)
- [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- [`documentation/README.md`](./documentation/README.md)
- [`INCEPTION_EXIT_READINESS_SCORECARD.md`](./INCEPTION_EXIT_READINESS_SCORECARD.md)
- [`INCEPTION_OPEN_DECISIONS_AND_ASSUMPTIONS_2026-08-03.md`](./INCEPTION_OPEN_DECISIONS_AND_ASSUMPTIONS_2026-08-03.md)
- [`INCEPTION_SCOPE_BOUNDARY_DECISION_PACKET.md`](./INCEPTION_SCOPE_BOUNDARY_DECISION_PACKET.md)
- [`INCEPTION_BUSINESS_REQUIREMENTS_USECASE_AUDIT_2026-08-03.md`](./INCEPTION_BUSINESS_REQUIREMENTS_USECASE_AUDIT_2026-08-03.md)
- [`INCEPTION_FINAL_SIGNOFF_MEMO_2026-08-03.md`](./INCEPTION_FINAL_SIGNOFF_MEMO_2026-08-03.md)
- [`documentation/BUSINESS_DOCS_MAINTENANCE_CLOSEOUT_2026-08-08.md`](./documentation/BUSINESS_DOCS_MAINTENANCE_CLOSEOUT_2026-08-08.md)
- [`session_exports/README.md`](./session_exports/README.md)
- [`session_exports/SESSION_EXPORT_2026-08-03.md`](./session_exports/SESSION_EXPORT_2026-08-03.md)

---

## Current Execution Ladder

| Order | Wave | Focus                                                                | Status      | Bundle                                                 |
| ----- | ---- | -------------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| 1     | 20   | RBAC hardening + audit export security + compliance mutation guards  | ✅ Complete | [`Wave 20`](./waves/WAVE_20_IMPLEMENTATION_BACKLOG.md) |
| 2     | 21   | Finance, UAE VAT, commission engine & compliance reporting           | ✅ Complete | [`Wave 21`](./waves/WAVE_21_IMPLEMENTATION_BACKLOG.md) |
| 3     | 22   | Market intelligence, off-plan, valuation & analytics                 | ✅ Complete | [`Wave 22`](./waves/WAVE_22_IMPLEMENTATION_BACKLOG.md) |
| 4     | 23   | Mobile CRM, PWA offline mode & push notifications                    | 📋 Planned  | [`Wave 23`](./waves/WAVE_23_IMPLEMENTATION_BACKLOG.md) |
| 5     | 24   | WhatsApp automation, AI chat engine & in-app notification centre     | ✅ Complete | [`Wave 24`](./waves/WAVE_24_IMPLEMENTATION_BACKLOG.md) |
| 6     | 25   | Portal syndication, careers, community management & advanced SEO     | ✅ Complete | [`Wave 25`](./waves/WAVE_25_IMPLEMENTATION_BACKLOG.md) |
| 7     | 26   | Production quality, test reliability, TODO resolution & executive UI | ✅ Complete | [`Wave 26`](./waves/WAVE_26_IMPLEMENTATION_BACKLOG.md) |
| 8     | 27   | Autonomous unit test expansion + token standardization               | ✅ Complete | [`Wave 27`](./waves/WAVE_27_IMPLEMENTATION_BACKLOG.md) |
| 9     | 28   | Admin cockpit test suites + strict type refactoring                  | ✅ Complete | [`Wave 28`](./waves/WAVE_28_IMPLEMENTATION_BACKLOG.md) |
| 10    | 29   | Advanced PWA offline write + conflict resilience                     | ✅ Complete | [`Wave 29`](./waves/WAVE_29_IMPLEMENTATION_BACKLOG.md) |
| 11    | 30   | AI predictive UX + auto-form pre-fill                                | ✅ Complete | [`Wave 30`](./waves/WAVE_30_IMPLEMENTATION_BACKLOG.md) |
| 12    | 31   | Corporate credentials & compliance automation                        | 📋 Planned  | [`Wave 31`](./waves/WAVE_31_IMPLEMENTATION_BACKLOG.md) |

---

## Canonical Structure (Confirmed)

| Folder                 | Role                                                       |
| ---------------------- | ---------------------------------------------------------- |
| `docs/plans/`          | Canonical planning trackers + governance                   |
| `docs/plans/waves/`    | Wave execution bundles (SDD / readiness / backlog / tests) |
| `docs/plans/archives/` | Historical or superseded planning artifacts                |
| `docs/business_docs/`  | Business and domain source-of-truth documents              |
| `docs/software_docs/`  | Software architecture and project-management documentation |

---

## Active Dependencies for Planning Quality

- Business completeness source: [`../business_docs/README.md`](../business_docs/README.md)
- Software project-management source: [`../software_docs/INDEX.md`](../software_docs/INDEX.md)
- Cross-doc consistency authority: [`../software_docs/DOCS_INTEGRATION_AND_CONSISTENCY_SYSTEM_2026-08-03.md`](../software_docs/DOCS_INTEGRATION_AND_CONSISTENCY_SYSTEM_2026-08-03.md)
- Governance validation: `npm run plans:validate`
