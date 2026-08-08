# Business-to-Software SRS Bridge Index

**Status:** Active  
**Owner:** Product + Architecture  
**Last Updated:** 2026-08-03

## 1. Purpose

This folder provides the business-to-software SRS bridge for Inception and Elaboration phases.
It translates business intent into software requirement structures aligned with RUP governance.

This folder is also the canonical entrypoint for the **formal business SRS wrapper**.
Counted canonical business requirements are maintained in `../05_requirements/functional-requirements.md`;
this folder summarizes, structures, and bridges them into software-facing SRS/SDD/UC artifacts.

## 2. Canonical contents

- `srs-master.md` — business-oriented SRS structure and coverage baseline
- `software-design-document.md` — business-to-design realization bridge

## 2.1 Authority model

| Artifact | Role | Counting authority |
| --- | --- | --- |
| `../05_requirements/functional-requirements.md` | Atomic business requirement register | **Yes** |
| `srs-master.md` | Formal business SRS wrapper and summary | No — must mirror canonical totals |
| `../../plans/documentation/REQ_CROSSWALK.md` | Business-to-software mapping bridge | No |
| `../05_requirements/REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md` | Taxonomy transition map | No |

Current counted baseline:

- **58** unique canonical business `REQ-*` definitions
- **63** current `REQ-*` headings, including **5** enhanced/duplicate headings that do not increment the canonical total
- **0** canonical software-side `REQ-*` definitions during the business-first expansion phase

## 3. Mandatory integration links

- `../05_requirements/functional-requirements.md`
- `../05_requirements/compliance-requirements.md`
- `../05_requirements/POLICY_CONTROL_INDEX_POL_SEED.md`
- `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../../software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
- `../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `../../plans/INCEPTION_EXIT_READINESS_SCORECARD.md`

## 4. Inception quality checks

This bridge is considered Inception-ready when:

1. business requirements map to software requirement taxonomy,
2. compliance controls map to `POL-*` IDs,
3. top critical journeys map to UC families,
4. traceability references resolve to canonical docs.

For strict counted-SRS readiness, the bridge must also show:

1. the current canonical business `REQ-*` baseline and duplicate/exclusion rules,
2. the approved first-wave target for the full business SRS requirement count,
3. alignment with the 12-department software-side SRS contract.

## 5. Full-SRS upgrade direction

The current `srs-master.md` is still a legacy summary-oriented SRS. The active upgrade direction is:

1. preserve the current 58-REQ business baseline,
2. restructure the business SRS around the same 12 departments used by `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`,
3. grow toward a first complete business SRS target of **420-650** unique business REQs,
4. mirror approved business REQ families into software SRS/SDD/UC/test artifacts without creating competing requirement authorities.

## 6. Related artifacts

- `../04_workflows/TOP_20_CRITICAL_BUSINESS_JOURNEYS_INCEPTION.md`
- `../05_requirements/REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md`
- `../../plans/INCEPTION_BUSINESS_REQUIREMENTS_USECASE_AUDIT_2026-08-03.md`
