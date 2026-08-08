# Scenario Authoring Standard

**Status:** Mandatory Standard  
**Owner:** Product + Compliance + QA  
**Last Updated:** 2026-08-03  
**Next Review:** 2026-08-21  
**Source of Truth:** Scenario authoring and quality-gate standard for business scenario documentation

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- scenario-governance and release-readiness lanes in `docs/plans/waves/WAVE_35_*` and `WAVE_36_*`

## 1. Purpose

Enforce one format for all business scenarios so the library remains complete, searchable, and implementation-ready.

## 2. Scenario template (required)

Every scenario entry must follow this schema:

- `scenario_id` (string, unique)
- `title`
- `domain`
- `capability`
- `journey_ref` (e.g., `JRN-008`)
- `risk_tier` (`COMP`, `FIN`, `OPS`, `SEC`, `UX`)
- `actors` (primary/secondary)
- `trigger`
- `preconditions`
- `main_flow`
- `alternate_flows`
- `failure_flows`
- `recovery_flows`
- `sla_signal`
- `policy_controls` (`POL-*`)
- `requirement_links` (`REQ/FR/BR/NFR/AC`)
- `data_entities`
- `api_touchpoints`
- `audit_events`
- `acceptance_criteria`
- `test_links`
- `owner_team`
- `escalation_path`
- `status` (`active`, `superseded`, `draft`)

## 3. Quality gates

### Gate Q1 — Structural completeness

- All required fields present.
- No empty `main_flow` or `acceptance_criteria`.

### Gate Q2 — Traceability completeness

- At least one requirement link.
- At least one policy control link.
- At least one test/UAT link.

### Gate Q3 — Operational completeness

- Includes alternate, failure, and recovery behavior.
- Includes SLA and escalation path.

### Gate Q4 — Governance completeness

- Scenario included in master index.
- Scenario count updated in coverage matrix.

## 4. ID sequencing policy

- Use 4-digit numeric sequence suffix.
- Never reuse deleted IDs.
- Superseded scenarios retain IDs and add replacement references.

## 5. Change control

When modifying scenarios:

1. Increment `Last Updated` in affected file.
2. Record reason under scenario changelog note.
3. Update `SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md` counts.
4. Update `BUSINESS_DOCS_COVERAGE_MATRIX_2026-08-02.md` scenario coverage row.

## 6. Linkage

- `README.md`
- `SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md`
- `SCENARIO_TRACEABILITY_MATRIX_SEED_2026-08-03.md`
