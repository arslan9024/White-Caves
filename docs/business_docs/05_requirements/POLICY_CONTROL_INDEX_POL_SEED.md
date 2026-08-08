# Policy Control Index (`POL-*`) — Seed Baseline

**Status:** Active / Seed Governance Baseline  
**Owner:** Compliance + Product + Architecture  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Canonical seed `POL-*` control index for business-layer compliance traceability

## 1. Purpose

Establish initial `POL-*` control IDs and owners so compliance obligations are traceable from business policy through SRS/UC/SDD/test/release artifacts.

## 2. Control taxonomy

- `POL-RERA-*` real estate regulatory controls
- `POL-DLD-*` land department and property registration controls
- `POL-EJARI-*` lease registration and tenancy controls
- `POL-PDPL-*` privacy/data protection controls
- `POL-AML-*` anti-money-laundering and risk controls

## 3. Seed control register

| Control ID | Domain | Control Objective | Owner | Primary Evidence | Linked Requirement Targets | Status |
| --- | --- | --- | --- | --- | --- | --- |
| POL-RERA-001 | RERA | Listing and transaction activity must comply with active licensing and permit obligations. | Compliance | License/permit validity reports, audit logs | `FR-CR-*`, `FR-SB-*`, `SEC-AUTH-*` | Seeded |
| POL-DLD-001 | DLD | Property and transaction records must preserve required DLD registration references and traceability. | Compliance + Conveyancing | Transaction records, registration references, reconciliation reports | `FR-LD-*`, `FR-CR-*`, `INT-DLD-*` | Seeded |
| POL-EJARI-001 | Ejari | Lease workflows must enforce Ejari registration checkpoints before legal closure states. | Leasing + Compliance | Lease/Ejari linkage report, exception logs | `FR-LT-*`, `NFR-SLA-*`, `UC-LT-*` | Seeded |
| POL-PDPL-001 | PDPL | Personal data processing requires consent lifecycle, access controls, and retention governance. | Compliance + Security | Consent logs, access logs, retention records | `FR-CR-*`, `SEC-DATA-*`, `OBS-AUDIT-*` | Seeded |
| POL-AML-001 | AML | High-risk financial workflows require KYC/EDD controls and suspicious activity handling paths. | Compliance + Finance | KYC/EDD evidence, alert records, review logs | `FR-FT-*`, `FR-CR-*`, `UC-FT-*` | Seeded |

## 4. Control mapping requirements

For each `POL-*` control, mandatory mappings must exist to:

1. SRS requirement IDs (`FR-*`, `NFR-*`, `SEC-*` where applicable),
2. use-case IDs (`UC-*`) including failure/recovery scenarios,
3. SDD enforcement points (API/state/data/audit),
4. test IDs and release gate evidence.

## 5. Approval and maintenance

- Update cadence: per wave or on regulation change.
- Change governance: no deletion of existing control IDs; deprecate with history note.
- Approval quorum: Compliance + Product + Architecture.

## 6. Linkage

- `./compliance-requirements.md`
- `../../plans/documentation/SRS_10K_HYBRID_REGISTRY_SCHEMA_2026-08-07.md`
- `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../../software_docs/01_requirements_engineering/RUP_INCEPTION_PHASE_MASTER_CHECKLIST.md`
- `../../plans/INCEPTION_EXIT_READINESS_SCORECARD.md`
