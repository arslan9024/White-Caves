# Authoritative Documentation Map

**Status:** Active  
**Owner:** Documentation Governance  
**Last Updated:** 2026-08-07  
**Purpose:** Give contributors a simple map of the current product domains, the canonical docs for each domain, and the minimum evidence expected before work is considered complete.

_Note:_ Filename keeps the original date token for backward compatibility; header metadata is the canonical freshness indicator.

---

## 1) Canonical rule

When a feature, workflow, or rollout is being worked on, use the following order:

1. Business intent and policy — business docs
2. Implementation contract — software docs
3. Execution and wave planning — planning docs
4. Release and rollout evidence — release notes and validation artifacts

If a document conflicts with the canonical planning or architecture stack, the planning stack and software design stack win.

---

## 2) Current product feature map

| Product domain | Business reference | Software reference | Planning reference | Release evidence required |
| --- | --- | --- | --- | --- |
| CRM operations | [business_docs/09_crm_features/README.md](./business_docs/09_crm_features/README.md) | [software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md](./software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md) | [plans/PENDING_TASKS_ONLY.md](./plans/PENDING_TASKS_ONLY.md) | Release note + validation evidence |
| Leasing and tenancy | [business_docs/09_crm_features/tenancy-ejari.md](./business_docs/09_crm_features/tenancy-ejari.md) | [software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md](./software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md) | [plans/waves/README.md](./plans/waves/README.md) | Release note + compliance validation |
| Compliance and legal | [business_docs/05_requirements/compliance-requirements.md](./business_docs/05_requirements/compliance-requirements.md) | [software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md](./software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md) | [plans/MASTER_PLAN.md](./plans/MASTER_PLAN.md) | Release note + audit or policy evidence |
| Finance and reporting | [business_docs/07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md](./business_docs/07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md) | [software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md](./software_docs/02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md) | [plans/MASTER_PLAN.md](./plans/MASTER_PLAN.md) | Release note + reporting validation |
| Inventory and off-plan | [business_docs/09_crm_features/sentinel-property.md](./business_docs/09_crm_features/sentinel-property.md) | [software_docs/04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md](./software_docs/04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md) | [plans/WAVE_PROGRESS_SUMMARY.md](./plans/WAVE_PROGRESS_SUMMARY.md) | Release note + workflow validation |
| AI assistants and automation | [business_docs/AI_AUTOMATION_AND_ASSISTANT_MAP_2026-08-03.md](./business_docs/AI_AUTOMATION_AND_ASSISTANT_MAP_2026-08-03.md) | [software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md](./software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md) | [plans/MASTER_PLAN.md](./plans/MASTER_PLAN.md) | Release note + fallback validation |

---

## 3) Minimum evidence for each feature or wave

Every feature should leave behind the following before it is considered ready:

- a business reference or policy reference;
- a software requirement or design contract;
- a planning or wave linkage;
- validation evidence such as test output, lint/build results, or acceptance review;
- a release note or rollout note describing impact and fallback behavior.

---

## 4) Consolidation guidance

To reduce documentation drift:

- prefer the canonical business, software, and planning files listed here;
- keep legacy material only when it provides historical context;
- mark older duplicate material as historical instead of letting it compete with active source-of-truth docs.

### Backend runtime authority note (2026-08-07)

- Canonical backend runtime and route registration authority is `server/` (entrypoint: `server/index.ts`).
- `src/server/` is treated as legacy/compatibility material unless explicitly referenced by an active wave task.
- API contract reconciliation work must validate endpoint references against `server/routes/*` first.

---

## 5) Related docs

- [README.md](./README.md)
- [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
- [IMPLEMENTATION_EXECUTION_PLAYBOOK_2026-08-03.md](./IMPLEMENTATION_EXECUTION_PLAYBOOK_2026-08-03.md)
- [business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md](./business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md)
- [software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md](./software_docs/BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md)
- [RELEASE_AND_ROLLOUT_NOTES_TEMPLATE_2026-08-06.md](./RELEASE_AND_ROLLOUT_NOTES_TEMPLATE_2026-08-06.md)
- [UPGRADE_REFERENCE_READINESS_SCORECARD_2026-08.md](./UPGRADE_REFERENCE_READINESS_SCORECARD_2026-08.md)
