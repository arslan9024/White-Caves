# Scenario Library Master Index

**Status:** Active
**Owner:** Product + Compliance + QA Governance
**Last Updated:** 2026-08-07
**Next Review:** 2026-08-21
**Source of Truth:** Canonical scenario volume and coverage index
**Target:** 10,000 scenarios (implementation-grade)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- scenario-governance and frontend-priority linkage lanes in `docs/plans/waves/WAVE_35_*` through `WAVE_40_*`

## 1. Index purpose

Provide master navigation, scenario counts, quality status, and traceability readiness across all business domains.

## 2. Current implementation status

| Phase | Scope | Planned Count | Implemented Count | Status |
| --- | --- | ---: | ---: | --- |
| Phase A1 | Compliance + Leasing + Finance (critical controls) | 200 | 200 | ✅ Active |
| Phase A2 | Sales + Viewings + Offers + KYC transitions | 300 | 300 | ✅ Active |
| Phase A3 | Operations + Maintenance + Incident workflows | 300 | 300 | ✅ Active |
| Phase B | Core CRM lifecycle full decomposition | 1,200 | 0 | 📋 Planned |
| Phase C | Error/failure/recovery deep matrix | 2,500 | 0 | 📋 Planned |
| Phase D | Long-tail variants + role/locale/time conditions | 5,500 | 0 | 📋 Planned |
| **Total** | **Full A-to-Z Library** | **10,000** | **800** | **In Progress** |

## 3. Scenario batch files

- `batches/SCENARIO_BATCH_A1_COMPLIANCE_LEASING_FINANCE_0001_0200.md`
- `batches/SCENARIO_BATCH_A2_SALES_VIEWINGS_OFFERS_CONVERSION_0201_0500.md`
- `batches/SCENARIO_BATCH_A3_OPERATIONS_MAINTENANCE_INCIDENTS_0501_0800.md`

## 4. Domain allocation map

| Domain | Prefix | Target Count | Primary Owners |
| --- | --- | ---: | --- |
| Compliance & Legal | `SCN-COMP-*` | 1,800 | Compliance + Legal + Governance |
| Leasing & Ejari | `SCN-LEASE-*` | 1,600 | Leasing + Compliance + Operations |
| Sales & Offers | `SCN-SALES-*` | 1,400 | Sales + CRM + Leadership |
| Finance & Reporting | `SCN-FIN-*` | 1,400 | Finance + Compliance + Executive |
| Operations & Maintenance | `SCN-OPS-*` | 1,200 | Operations + Support + QA |
| HR & Workforce | `SCN-HR-*` | 800 | HR + Governance |
| AI & Communications | `SCN-AI-*` | 900 | AI + Comms + Product |
| Integrations & Market | `SCN-INT-*` | 900 | Integration + Research + Strategy |

## 5. Readiness gates per batch

A batch is complete only when:

1. All scenarios are uniquely indexed.
2. 100% have requirement and policy links.
3. 100% include SLA signal and acceptance criteria.
4. 100% include audit/evidence mapping.
5. 100% include UAT/test trace references.
6. Index and coverage matrix are updated.

## 6. Traceability anchor files

- `SCENARIO_TRACEABILITY_MATRIX_SEED_2026-08-03.md`
- `../05_requirements/REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md`
- `../13_testing/uat-scenarios.md`
- `../../plans/waves/README.md`
- `../../plans/documentation/SRS_10K_HYBRID_REGISTRY_SCHEMA_2026-08-07.md`

## 7. Hybrid 10k synchronization

- Scenario totals and batch completion do not directly increment canonical software requirement counts.
- Canonical requirement progress is measured in the hybrid software registry with linked scenario evidence.
- Every batch closeout should include orphan detection for missing requirement/policy/test links.

## 8. Frontend-first impact routing

Scenarios that materially affect UI resilience, accessibility, state behavior, or frontend performance should be tagged for priority linkage to frontend-first waves (`W37`-`W40`) before secondary governance closures.
