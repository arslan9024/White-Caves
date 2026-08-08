# Wave-to-Requirement and Release Mapping

**Status:** Active  
**Owner:** Business & Product Governance  
**Last Updated:** 2026-08-03  
**Purpose:** Provide a simple planning map showing how business requirements and release expectations can be linked to implementation waves.

This document is a lightweight bridge between the business documentation stack and the planning/implementation stack. It is intended to make wave planning, prioritization, and release readiness more traceable.

## 1) Mapping structure

| Wave or initiative | Business goal | Primary business reference | Software or delivery reference | Release expectation |
| --- | --- | --- | --- | --- |
| CRM workflow uplift | Improve lead ownership, actionability, and task batching | [09_crm_features/README.md](./09_crm_features/README.md) | [../software_docs/01_requirements_engineering/functional_specifications.md](../software_docs/01_requirements_engineering/functional_specifications.md) | Deliverable should be testable, auditable, and linked to the next release milestone |
| Leasing and tenancy operations | Improve lifecycle visibility and reduce manual handling | [09_crm_features/tenancy-ejari.md](./09_crm_features/tenancy-ejari.md) | [../software_docs/03_use_cases/](../software_docs/03_use_cases/) | Release should include workflow controls and clear approval evidence |
| Compliance and legal controls | Strengthen regulatory control, auditability, and retention | [05_requirements/compliance-requirements.md](./05_requirements/compliance-requirements.md) | [../software_docs/02_software_design/](../software_docs/02_software_design/) | Release must include audit trail and compliance evidence |
| Finance and reporting | Improve reporting accuracy and reconciliation discipline | [07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md](./07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md) | [../software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md](../software_docs/RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md) | Release should be reviewable by finance leadership and auditable for close processes |
| Inventory and handover | Improve property quality control and lifecycle readiness | [09_crm_features/sentinel-property.md](./09_crm_features/sentinel-property.md) | [../software_docs/04_flowcharts/](../software_docs/04_flowcharts/) | Release should include validation and handover evidence |

## 2) Planning usage guidance

When starting a new wave:

1. Identify the business outcome the wave supports.
2. Link it to the relevant business document and software artifact.
3. Define the acceptance criteria and the evidence needed for release review.
4. Record the delivery owner and the intended release milestone.

## 3) Release readiness questions

Each wave should be able to answer:

- What problem is this wave solving?
- Which business requirement or policy does it support?
- What evidence proves it is complete?
- What release gate or approval step is still required?
