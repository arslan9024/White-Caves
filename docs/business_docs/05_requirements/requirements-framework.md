# Requirements Framework (Business Layer Authority)

**Status:** Active  
**Owner:** Product + Architecture + Compliance Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-layer requirements framework and authority boundaries

This document defines how requirement artifacts in `docs/business_docs/05_requirements/` are structured, governed, and bridged to software implementation artifacts.

## 1. Authority model

| Artifact | Role | Counting authority |
| --- | --- | --- |
| `functional-requirements.md` | Canonical business requirement register (`REQ-*`) | **Yes (business layer)** |
| `requirements-framework.md` | Governance framework, lifecycle, and taxonomy rules | No |
| `../12_srs/srs-master.md` | Business SRS wrapper/summary | No |
| `../../plans/documentation/REQ_CROSSWALK.md` | Business-to-software traceability bridge | No |
| `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md` | Canonical software implementation requirement register | **Yes (software layer)** |

## 2. Requirement taxonomy

Business requirement families in this folder:

- `REQ-*`: Canonical business requirements (intent authority)
- `BR-*`: Business rules
- `NFR-*`: Non-functional expectation anchors
- `POL-*`: Policy/control linkage anchors
- `AC-*`: Acceptance criteria anchors

Software-side large-scale families for the hybrid 10k execution program are governed in:

- `../../plans/documentation/SRS_10K_ID_ALLOCATION_MATRIX_2026-08-07.md`
- `../../plans/documentation/SRS_10K_WRITING_STYLE_GUIDE_2026-08-07.md`
- `../../plans/documentation/SRS_10K_HYBRID_REGISTRY_SCHEMA_2026-08-07.md`

## 3. Canonical document lanes

### 3.1 Functional intent lane

- `functional-requirements.md`
- `business-rules.md`
- `user-stories.md`
- `use-cases.md`

### 3.2 Quality/compliance lane

- `non-functional-requirements.md`
- `performance-requirements.md`
- `security-requirements.md`
- `compliance-requirements.md`

### 3.3 Technical boundary lane

- `system-requirements.md`
- `integration-requirements.md`
- `api-requirements.md`
- `database-requirements.md`

### 3.4 Constraint lane

- `constraints.md`
- `assumptions.md`
- `dependencies.md`

## 4. Frontend-first planning contract

Requirement updates that impact UX, page composition, state flow, resiliency states, accessibility, or runtime performance must explicitly feed frontend-priority waves before secondary lanes.

Mandatory frontend-first traces when relevant:

- `../../plans/waves/WAVE_37_IMPLEMENTATION_BACKLOG.md`
- `../../plans/waves/WAVE_38_IMPLEMENTATION_BACKLOG.md`
- `../../plans/waves/WAVE_39_IMPLEMENTATION_BACKLOG.md`
- `../../plans/waves/WAVE_40_IMPLEMENTATION_BACKLOG.md`

## 5. Traceability contract

Each meaningful requirement update should maintain or add:

1. business source reference (`REQ-*`, `BR-*`, `NFR-*`, `POL-*`, `AC-*`),
2. software realization link (SRS/SDD/UC path),
3. test/UAT evidence link,
4. wave/release linkage,
5. owner and lifecycle status.

Primary bridge targets:

- `../../plans/documentation/REQ_CROSSWALK.md`
- `../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../../software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
- `../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `../13_testing/uat-scenarios.md`

## 6. Lifecycle governance

Requirement lifecycle states:

1. Proposed
2. Reviewed
3. Approved
4. Planned
5. Implemented
6. Verified
7. Released
8. Superseded

Do not hard-delete superseded requirements; preserve audit history and add supersession references.

## 7. Quality gates

A requirement entry is governance-ready only when:

- statement is testable and unambiguous,
- scope and owner are explicit,
- acceptance criteria are measurable,
- policy/compliance references are present where required,
- traceability links resolve to canonical `docs/*` artifacts.

## 8. 10k hybrid SRS alignment

The business layer remains the intent authority, while software-side hybrid registry rows are the canonical large-scale implementation counting authority.

Execution rule:

- business narrative references must not be treated as canonical software-count increments,
- mapped software rows and linked scenarios drive canonical 10k progress accounting,
- crosswalk quality and orphan detection are mandatory at each checkpoint (`C1` to `C10`).

## 9. Related governance artifacts

- `../README.md`
- `README.md`
- `../../plans/MASTER_PLAN.md`
- `../../plans/PENDING_TASKS_ONLY.md`
- `../../plans/waves/README.md`
- `../BUSINESS_DOCS_FULL_UPGRADE_CHECKLIST_2026-08-07.md`
