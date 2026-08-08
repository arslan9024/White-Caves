# Transitional Directory Supersession Map (2026-08-07)

**Status:** Active  
**Owner:** Business Documentation Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Directory-level supersession and consolidation guidance for transitional business-doc folders

## Canonical governance links

- [`README.md`](./README.md)
- [`BUSINESS_DOCS_FULL_UPGRADE_CHECKLIST_2026-08-07.md`](./BUSINESS_DOCS_FULL_UPGRADE_CHECKLIST_2026-08-07.md)
- [`../plans/documentation/REQ_CROSSWALK.md`](../plans/documentation/REQ_CROSSWALK.md)
- [`../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- cleanup/reconciliation lanes in `docs/plans/waves/WAVE_34_*`, `WAVE_36_*`, and `WAVE_40_*`

## Directory supersession matrix

| Transitional folder | Superseding canonical folders | Supersession mode | Current action |
| --- | --- | --- | --- |
| `02_leasing_property_management/` | `09_crm_features/`, `04_workflows/`, `05_requirements/` | Merge and redirect | Preserve historical docs; route new edits to canonical folders |
| `03_regulatory_compliance_legal/` | `05_requirements/`, `09_crm_features/`, `09_user_roles_permissions/` | Policy/requirements split | Keep as historical source; migrate active legal/compliance deltas into canonical lanes |
| `04_marketing_communications/` | `09_crm_features/`, `11_seo/`, `08_integrations_and_research/` | Feature and growth split | Freeze as reference; publish new campaign/communications specs in canonical lanes |
| `10_design_system_and_security/` | `06_design_architecture/`, `05_requirements/`, `09_user_roles_permissions/` | Architecture/security split | Keep authority links only; move active controls and UX-security contracts into canonical lanes |

## Operational rules

1. No new source-of-truth documents should be created inside transitional folders.
2. Transitional files should include supersession notes pointing to canonical targets when edited.
3. Historical artifacts remain readable for audit context and chronology.
4. Crosswalk and SRS evidence must reference canonical destinations, not transitional paths.

## Exit criteria for transitional cleanup

- Every transitional folder has an explicit supersession target and mode.
- Canonical destinations are linked from the business-doc root and checklist.
- New work is consistently authored in canonical folders.
- Remaining transitional docs are either archived or marked as historical/reference-only.
