# CRM Features Index

**Status:** Active / Feature Traceability Uplift Complete  
**Owner:** Product & Domain Delivery  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Yes

This folder is the canonical business-feature index for White Caves CRM modules.
Use it to navigate feature specifications, operational workflows, and domain-level behavior
before moving into software design or implementation artifacts.

## Depends On

- `docs/business_docs/05_requirements/functional-requirements.md`
- `docs/plans/MASTER_PLAN.md`
- canonical runtime contract authority when endpoint claims are documented (`server/routes/*`)

## Feeds

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- future wave implementation backlog packets in `docs/plans/waves/`

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../software_docs/INDEX.md`](../../software_docs/INDEX.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feature lanes

### Core CRM

- `client-management.md` — client records, preferences, relationship history
- `lead-tracking.md` — lead lifecycle, scoring, ownership, and qualification
- `task-batching-and-priority-grouping.md` — priority-led task batching for the CRM Tasks & Actions experience
- `property-management.md` — listings, inventory, publication state, and compliance-sensitive fields
- `sales-pipeline.md` — deal stages, conversion flow, and operational controls
- `commission-tracking.md` — commission lifecycle and payout controls

### Compliance, legal, and regulated operations

- `trakheesi-integration.md` — permit validation, publication gating, and expiry awareness
- `legal-management.md` — contracts, legal notices, and signature workflows
- `dld-integration.md` — DLD/Oqood process and title-transfer contracts
- `tenancy-ejari.md` — Ejari registration, PDC flow, and tenancy lifecycle governance

### Listing, project, and portfolio operations

- `portal-syndication.md` — outbound portal feeds and inbound lead capture expectations
- `sentinel-property.md` — property state machine, quality scoring, and duplicate detection
- `off-plan-projects.md` — off-plan inventory, milestone, and payment-plan behavior
- `landlord-portal.md` / `tenant-portal.md` — portal operating experiences and role-facing workflows

### Communication, AI, and automation

- `whatsapp-integration.md` — message templates, inbox, bot, and broadcast behavior
- `ai-chat.md` — assistant orchestration, provider fallback, and conversation lifecycle
- `follow-up-automation.md` — sequence triggers, pause rules, and conversion follow-up logic
- `email-automation.md` / `marketing-automation.md` — outbound communication and nurture automation

### Analytics and executive intelligence

- `analytics-dashboard.md` — KPI dashboards and analytics behavior
- `agent-performance.md` — productivity and performance metrics
- `financial-reporting.md` — finance outputs and report contracts
- `market-analytics.md` / `market-intelligence.md` — market and pricing decision support

## Supporting workflow references

- [`../04_workflows/lead-to-sale-flowchart.md`](../04_workflows/lead-to-sale-flowchart.md)
- [`../04_workflows/rental-management-flowchart.md`](../04_workflows/rental-management-flowchart.md)
- [`../04_workflows/finance-reconciliation-flowchart.md`](../04_workflows/finance-reconciliation-flowchart.md)

## Documentation expectations

Each feature document should progressively include:

1. feature purpose and business outcome;
2. user stories or actor roles;
3. business rules and validation rules;
4. integration points;
5. KPI/SLA implications where relevant;
6. related requirement, workflow, or traceability links.

## CRM feature upgrade contract

Every feature spec in this folder should now support a direct handoff to implementation by including:

- the linked business requirement IDs;
- the expected user or system actor;
- the core business rule and acceptance criteria;
- the downstream software requirement or SRS mapping;
- the evidence artifact or test surface that will validate delivery.

This makes each CRM feature document usable as an upstream handoff artifact for the SRS and implementation wave planning layers.

## Normalization note

Some files in this folder are legacy package-era or wave-era artifacts (for example package-based
or wave-draft documents). They may remain useful historically, but active source-of-truth feature
guidance should prefer the canonical feature specs and linked requirements docs above.

## Related artifacts

- Business requirements: [`../05_requirements/`](../05_requirements/)
- Business workflows: [`../04_workflows/`](../04_workflows/)
- Software requirements: [`../../software_docs/01_requirements_engineering/functional_specifications.md`](../../software_docs/01_requirements_engineering/functional_specifications.md)
- Progress dashboard: [`../../plans/PROGRESS_DASHBOARD.md`](../../plans/PROGRESS_DASHBOARD.md)
