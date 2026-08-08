# Department Operating Map and Automation Readiness

**Status:** Active  
**Owner:** Business & Product Governance  
**Last Updated:** 2026-08-03  
**Purpose:** Provide a practical overview of each operating department, its core workflows, and the most valuable automation and AI opportunities.

This document complements the business operating manual and the AI assistant map by giving each department a concise implementation lens.

## 1) Executive operating view

| Department | Primary mission | Core operating rhythm | Highest-value automation / AI opportunity |
| --- | --- | --- | --- |
| Sales & CRM | Convert leads into deals with strong pipeline visibility | Lead intake, follow-up, viewing coordination, offers, deal progression | AI lead scoring, smart follow-up sequencing, WhatsApp routing |
| Leasing & Tenancy | Manage tenant onboarding, renewals, payments, and legal obligations | Intake, lease issuance, PDC tracking, maintenance, renewals | Tenant portal automation, document generation, reminder workflows |
| Compliance & Legal | Reduce regulatory risk and ensure auditable execution | Policy checks, approvals, notices, dispute handling, retention | Automated compliance checks, document review prompts, audit trail enforcement |
| Finance & Reporting | Maintain accurate financial control and decision-ready reporting | Payment tracking, reconciliation, VAT handling, forecasting | Automated reconciliation, variance analysis, reporting summaries |
| Property & Inventory | Keep property data accurate, quality high, and lifecycle states controlled | Listing creation, review, publication, marketing, handover | Inventory state automation, quality scoring, duplicate detection |
| Marketing & Growth | Drive demand and maintain strong market visibility | Campaign setup, segmentation, lead nurture, content publishing | AI campaign segmentation, content generation, attribution analysis |
| HR & People | Support hiring, onboarding, performance, and workforce governance | Recruitment, onboarding, leave, performance, discipline | Workflow approvals, onboarding automation, policy reminders |
| Operations & Support | Maintain service continuity and cross-functional coordination | Escalations, issue resolution, handover, customer support | Ticket triage, SLA monitoring, supervisor summaries |
| Product & Technology | Deliver systems, integrations, and process reliability | Roadmap execution, change control, release readiness, incident handling | Release automation, dependency visibility, AI-assisted support ops |

## 2) Department detail and workflow focus

### Sales & CRM

- Core workflow: lead capture, assignment, qualification, follow-up, viewing scheduling, offer handling, and deal progression.
- Business expectation: every lead should have a measurable next action and clear ownership.
- Automation opportunities: lead scoring, auto-routing, reminder sequences, offer expiry alerts, and conversation summaries.
- Primary references: [09_crm_features/README.md](./09_crm_features/README.md), [09_crm_features/lead-tracking.md](./09_crm_features/lead-tracking.md), [09_crm_features/task-batching-and-priority-grouping.md](./09_crm_features/task-batching-and-priority-grouping.md)

### Leasing & Tenancy

- Core workflow: leasing intake, contract generation, onboarding, rent collection, maintenance handling, renewals, and closure.
- Business expectation: tenancy lifecycle should be trackable, compliant, and low-friction for both agents and tenants.
- Automation opportunities: portal workflows, reminder messages, document generation, payment status updates, and compliance checkpoints.
- Primary references: [09_crm_features/tenancy-ejari.md](./09_crm_features/tenancy-ejari.md), [04_workflows/](./04_workflows/)

### Compliance & Legal

- Core workflow: policy validation, legal notice generation, approvals, retention, and audit readiness.
- Business expectation: compliance should be embedded into normal workflows rather than handled manually at the end.
- Automation opportunities: approval gates, document checklist prompts, RERA/UAE policy checks, evidence capture, and audit export.
- Primary references: [05_requirements/compliance-requirements.md](./05_requirements/compliance-requirements.md), [09_crm_features/legal-management.md](./09_crm_features/legal-management.md)

### Finance & Reporting

- Core workflow: invoice handling, reconciliation, payout schedules, commissions, VAT reporting, and executive reporting.
- Business expectation: finance outputs should be accurate, timely, and auditable.
- Automation opportunities: account reconciliation, payout validation, variance analysis, recurring report generation, and anomaly alerts.
- Primary references: [07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md](./07_business_model/FINANCE_CLOSE_AND_RECONCILIATION_GOVERNANCE.md), [09_crm_features/financial-reporting.md](./09_crm_features/financial-reporting.md)

### Property & Inventory

- Core workflow: property onboarding, quality review, listing lifecycle management, publication control, and handover readiness.
- Business expectation: property records should be complete, validated, and ready for operations or marketing.
- Automation opportunities: duplicate detection, quality scoring, required-field enforcement, milestone alerts, and handover checklists.
- Primary references: [09_crm_features/sentinel-property.md](./09_crm_features/sentinel-property.md), [09_crm_features/off-plan-projects.md](./09_crm_features/off-plan-projects.md)

### Marketing & Growth

- Core workflow: campaign planning, content production, audience segmentation, outreach orchestration, and performance measurement.
- Business expectation: marketing should be data-driven and tightly connected to lead quality and conversion.
- Automation opportunities: campaign segmentation, A/B testing, content drafting, lead attribution analysis, and performance summaries.
- Primary references: [11_seo/](./11_seo/), [09_crm_features/marketing-automation.md](./09_crm_features/marketing-automation.md)

### HR & People

- Core workflow: recruitment, onboarding, performance management, leave tracking, and disciplinary handling.
- Business expectation: people processes should be fair, consistent, and easy to audit.
- Automation opportunities: onboarding checklists, document collection, approval routing, and policy reminders.
- Primary references: [HR_POLICY_AND_WORKFORCE_INDEX_2026.md](./HR_POLICY_AND_WORKFORCE_INDEX_2026.md), [01_company_structure/](./01_company_structure/)

### Operations & Support

- Core workflow: ticket management, escalations, service requests, and cross-team coordination.
- Business expectation: support and operations should be visible, tracked, and resolved within agreed service levels.
- Automation opportunities: issue triage, SLA monitoring, escalation prompts, and live operational summaries.
- Primary references: [15_release_management/](./15_release_management/), [04_workflows/](./04_workflows/)

## 3) Implementation readiness criteria

A department is considered implementation-ready when:

1. its business outcomes and workflow rules are documented;
2. its primary software requirement or design contract is linked;
3. the most valuable automation trigger is named;
4. the approval, escalation, and audit expectations are clear;
5. the work is connected to a delivery wave or implementation milestone.

## 4) Recommended next moves

- Prioritize the departments with the strongest daily operational impact: Sales & CRM, Leasing & Tenancy, and Finance.
- Link each department plan to a software requirement, design artifact, and implementation wave.
- Treat compliance and audit controls as mandatory implementation gates rather than optional enhancements.
