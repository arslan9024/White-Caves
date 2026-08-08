# Requirement Taxonomy Mapping (Business `REQ-*` → Software Taxonomy)

**Status:** Active Normalization Map  
**Owner:** Product + Architecture + Compliance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-to-software requirement taxonomy transition map

## 1. Purpose

Map legacy business requirement IDs (`REQ-*`) to the software taxonomy (`FR/BR/NFR/POL/INT/SEC/OBS/AC`) used by canonical SRS/SDD/UC artifacts.

## 2. Mapping rules

| Legacy Pattern | Target Pattern | Meaning |
| --- | --- | --- |
| `REQ-AUTH-*` | `FR-TP-*`, `SEC-AUTH-*`, `AC-TP-*` | authentication and access behavior |
| `REQ-LEAD-*` | `FR-SB-*`, `FR-CC-*`, `NFR-SLA-*`, `AC-SB-*` | lead lifecycle and engagement |
| `REQ-PROP-*` | `FR-PF-*`, `FR-SB-*`, `POL-RERA-*`, `AC-PF-*` | property inventory and publication |
| `REQ-LEASE-*` | `FR-LT-*`, `POL-EJARI-*`, `NFR-SLA-*`, `AC-LT-*` | leasing and tenancy operations |
| `REQ-FIN-*` | `FR-FT-*`, `NFR-PERF-*`, `POL-AML-*`, `AC-FT-*` | finance, commissions, reporting |
| `REQ-COMP-*` | `FR-CR-*`, `POL-*`, `SEC-DATA-*`, `AC-CR-*` | compliance controls and enforcement |

## 3. Example crosswalk entries

| Legacy ID | Suggested New IDs | Notes |
| --- | --- | --- |
| `REQ-AUTH-001` | `FR-TP-001`, `SEC-AUTH-001`, `AC-TP-001` | Login behavior + auth control + acceptance |
| `REQ-LEAD-001` | `FR-SB-001`, `AC-SB-001` | Lead create behavior and acceptance |
| `REQ-LEAD-010` | `FR-CC-010`, `NFR-SLA-010`, `OBS-SLA-010`, `AC-CC-010` | Follow-up reminders tied to SLA telemetry |
| `REQ-PROP-001` | `FR-PF-001`, `AC-PF-001` | Property creation capability |
| `REQ-PROP-004` | `FR-PF-004`, `OBS-AUDIT-004`, `AC-PF-004` | Status transitions with audit trail |

## 4. Normalization policy

- Preserve legacy `REQ-*` IDs as historical aliases (do not delete).
- Introduce canonical IDs in parallel and map both during transition.
- Prefer canonical IDs in new wave documents and software artifacts.

## 5. Completion criteria

This map is complete when:

1. all high-priority `REQ-*` IDs have canonical mapped targets,
2. compliance-facing `REQ-*` IDs map to `POL-*` controls,
3. all mapped entries link to UC and SDD references.

## 6. Linkage

- `./functional-requirements.md`
- `./compliance-requirements.md`
- `./POLICY_CONTROL_INDEX_POL_SEED.md`
- `../../plans/documentation/SRS_10K_ID_ALLOCATION_MATRIX_2026-08-07.md`
- `../../plans/documentation/SRS_10K_HYBRID_REGISTRY_SCHEMA_2026-08-07.md`
- `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `../../plans/INCEPTION_EXIT_READINESS_SCORECARD.md`
