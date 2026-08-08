# Docs Integration and Consistency System (A-to-Z)

**Status:** Active Governance Specification  
**Last Updated:** 2026-08-03

## 1. Purpose

This specification defines cross-document integration, naming consistency, and traceability rules for
`docs/plans/`, `docs/business_docs/`, and `docs/software_docs/` so implementation can proceed from a
single coherent truth set.

## 2. Canonical source-of-truth hierarchy

1. `docs/plans/` — planning authority (wave sequencing, backlog, readiness, release gates)
2. `docs/business_docs/` — business and policy authority (domain intent, compliance obligations, SOPs)
3. `docs/software_docs/` — software authority (SRS, SDD, UCs, flowcharts, test-readiness contracts)

If conflicts occur:

- planning schedule truth comes from `docs/plans/`,
- business/policy truth comes from `docs/business_docs/`,
- technical design/traceability truth comes from `docs/software_docs/`.

## 3. Cross-document identifier contract

Required ID families:

- `FR-{DEPT}-{NNN}` functional requirement
- `BR-{DEPT}-{NNN}` business rule
- `NFR-{DOMAIN}-{NNN}` non-functional requirement
- `POL-{REG}-{NNN}` compliance requirement
- `AC-{DEPT}-{NNN}` acceptance criterion
- `UC-{DEPT}-{CAPABILITY}-{PROCESS}-{NNN}` use case
- `SDD-{DOMAIN}-{NNN}` architecture design reference
- `TST-{SCOPE}-{NNN}` test case/suite reference
- `WAVE-{NN}-{TASK}` implementation wave linkage

## 4. Mandatory traceability chain

Every implementation-relevant requirement must map through this chain:

1. business policy/intent (`business_docs`)
2. software requirement (`SRS`)
3. behavior contract (`UC`)
4. architecture realization (`SDD`)
5. verification artifact (`test ID`)
6. rollout unit (`wave task`)
7. release gate evidence

## 5. Consistency checks

A documentation baseline is inconsistent if any of the following exist:

- orphan requirement (no linked UC)
- orphan use case (no linked SRS or SDD)
- orphan SDD component (no linked requirement)
- orphan test reference (no linked requirement/UC)
- wave task with no requirement/test linkage

## 6. Link validation rules

All master documents must include:

- inbound linkage (what governs this document),
- outbound linkage (what this document governs),
- update owner and cadence,
- quality gates for implementation readiness.

## 7. Change-management protocol

When changing any master document:

1. update `Last Updated` date,
2. preserve existing IDs (no silent renumbering),
3. append new IDs instead of recycling removed IDs,
4. update affected traceability references,
5. validate index links.

## 8. Review cadence

- Per wave: traceability spot-check for touched scopes
- Weekly: consistency audit on masters (SRS/SDD/UC/frontend/test-readiness)
- Monthly: full cross-folder reconciliation (`plans` ↔ `business_docs` ↔ `software_docs`)

## 9. Acceptance gate for implementation start

Implementation can begin only when:

- targeted scope has no orphan IDs,
- SRS, SDD, and UC links are complete,
- tests are declared for each acceptance criterion,
- wave task mapping is explicit,
- release/rollback references exist.

## 10. Linked authorities

- `./01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `./02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
- `./03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `./frontend/FRONTEND_400_PERCENT_PROGRAM.md`
- `./IMPLEMENTATION_TEST_READINESS_MASTER.md`
- `../business_docs/README.md`
- `../plans/INDEX.md`
- `../plans/MASTER_PLAN_36X_600_DETAIL.md`
