# Business-to-Software Crosswalk

**Status:** Active  
**Version:** 2026-08-03  
**Purpose:** Map White Caves business capabilities to the software requirements, design artifacts, use cases, workflows, and implementation planning files that support them.

---

## 1) Crosswalk overview

This document helps connect business intent to engineering execution. Each major business domain should have a clear reference path into:

- business requirements;
- software requirements;
- software design artifacts;
- use cases and flowcharts;
- implementation planning and test coverage.

---

## 2) Business domain to implementation map

| Business capability | Primary business doc | Software requirement / design reference | Use case / workflow reference | Planning reference |
| --- | --- | --- | --- | --- |
| Sales and leasing workflow | [Business Operating Manual](../business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md) | [Software Requirements](./01_requirements_engineering/functional_specifications.md) | [Lead-to-Sale Flowchart](../business_docs/04_workflows/lead-to-sale-flowchart.md) | [Master Plan](../plans/MASTER_PLAN.md) |
| Property operations and maintenance | [Business Operating Manual](../business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md) | [Software Design](./02_software_design/) | [Rental Management Flowchart](../business_docs/04_workflows/rental-management-flowchart.md) | [Pending Tasks](../plans/PENDING_TASKS_ONLY.md) |
| Finance and commission control | [Company Profile and Business Baseline](../business_docs/COMPANY_PROFILE_AND_BUSINESS_BASELINE_2026.md) | [Software Requirements](./01_requirements_engineering/functional_specifications.md) | [Finance Reconciliation Flowchart](../business_docs/04_workflows/finance-reconciliation-flowchart.md) | [Wave Readiness and Plans](../plans/waves/README.md) |
| Compliance and legal operations | [HR Policy and Workforce Index](../business_docs/HR_POLICY_AND_WORKFORCE_INDEX_2026.md) | [Software Design](./02_software_design/) | [Compliance and Audit Flowcharts](../business_docs/04_workflows/compliance-audit-flowchart.md) | [Project Management Governance Index](./PROJECT_MANAGEMENT_GOVERNANCE_INDEX_2026-08-02.md) |
| CRM feature delivery | [CRM Features Index](../business_docs/09_crm_features/README.md) | [Software Requirements](./01_requirements_engineering/functional_specifications.md) | [CRM feature workflow docs](../business_docs/09_crm_features/) | [Wave backlog docs](../plans/waves/) |
| AI assistant and automation operations | [AI Automation and Assistant Map](../business_docs/AI_AUTOMATION_AND_ASSISTANT_MAP_2026-08-03.md) | [Software Design](./02_software_design/) | [AI chat and automation docs](../business_docs/09_crm_features/ai-chat.md) | [AI assistant planning docs](../plans/ai_assistants/README.md) |

---

## 3) Traceability expectations

For each major feature or business capability, the implementation should show:

- a business objective;
- a software requirement or design contract;
- a workflow or use case reference;
- test and release evidence.

This keeps the business documentation, software documentation, and implementation plans aligned.

---

## 4) Recommended update pattern for every new feature

1. Start with the business requirement in the business docs.
2. Write or update the matching software requirement.
3. Add or update the relevant software design artifact.
4. Link the workflow or use case.
5. Record the implementation and validation evidence in the plans or wave documentation.

---

## 5) Related documentation

- [Software Docs Index](./INDEX.md)
- [Project Management Governance Index](./PROJECT_MANAGEMENT_GOVERNANCE_INDEX_2026-08-02.md)
- [Business Documentation Index](../business_docs/README.md)
- [Business Operating Manual](../business_docs/BUSINESS_OPERATING_MANUAL_2026-08-03.md)
