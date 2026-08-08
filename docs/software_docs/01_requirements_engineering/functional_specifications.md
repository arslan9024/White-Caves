# Functional Specifications & Departmental System Bounds — White Caves Real Estate

> **Document Class:** Requirements Engineering (SRS)  
> **Repository Path:** `software_docs/01_requirements_engineering/functional_specifications.md`  
> **Brand Canvas:** White Caves Red (`#EF4444`) | Crisp White (`#FFFFFF`) | Deep Slate Gray (`#1E293B`)  
> **System Architecture:** RUP 4-Tier Component Isolation (View-Logic-Style)  
**Status:** Active / Traceability Expansion Complete  
**Last Updated:** 2026-08-07

---

## Canonical traceability links

- [`../../business_docs/05_requirements/functional-requirements.md`](../../business_docs/05_requirements/functional-requirements.md)
- [`../../business_docs/09_crm_features/README.md`](../../business_docs/09_crm_features/README.md)
- [`../02_software_design/rbac_state_gating.md`](../02_software_design/rbac_state_gating.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`](../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md)

## Purpose of this document

This file translates business-domain requirements into software-facing operating bounds,
departmental system partitions, and access-model assumptions. It should be read alongside the
business requirement catalog rather than as a replacement for it.

## Executive summary

This functional specification exists to convert business requirements into a clear delivery contract for engineering, QA, compliance, and operations. Its purpose is to make each requirement traceable to a use case, design boundary, evidence artifact, and release gate so implementation waves can proceed with less ambiguity and fewer handoff gaps.

## Business-docs bridge

This document is the software realization layer for the business requirement and CRM feature catalogs in the business-docs suite. Each department section must therefore be read with three upstream references in mind:

1. the linked business requirement family in [../../business_docs/05_requirements/functional-requirements.md](../../business_docs/05_requirements/functional-requirements.md);
2. the related CRM feature or workflow in [../../business_docs/09_crm_features/README.md](../../business_docs/09_crm_features/README.md);
3. the downstream implementation evidence expected by the SRS and test-readiness layers.

For implementation readiness, every requirement realization entry should carry:

- the source business requirement ID;
- the owner department and accountable role;
- the software boundary or service contract;
- the validation artifact or test suite;
- the release gate that confirms completion.

This section is now the primary bridge between business intent and engineering execution.

## Enterprise documentation inventories

- [Enterprise SRS inventory](./ENTRPRISE_SRS_INVENTORY_2026-08-06.md) — software-side master catalog and readiness map
- [Business-document inventory](../../business_docs/05_requirements/enterprise-requirement-inventory.md) — upstream business package map and SRS counterpart index
- [Enterprise requirement catalog](./enterprise-requirement-catalog.json) — generated enterprise requirement baseline for implementation planning (program target now aligned to 5000-ID priority-first expansion)

## SRS quality standard and structure

The functional specification is written to follow the quality characteristics of a strong SRS document:

- correctness — requirements reflect the intended business and operational behavior;
- completeness — functional, non-functional, integration, compliance, and observability concerns are represented;
- consistency — terminology, ownership, and state behavior remain coherent across the suite;
- unambiguity — requirements are written in an explicit, testable form rather than vague statements;
- traceability — each requirement can be linked to a use case, design contract, evidence artifact, and release gate;
- verifiability — each requirement is paired with observable acceptance criteria and validation evidence.

This structure also follows the best-practice SRS pattern used in public reference materials: purpose, scope, requirements families, interfaces, constraints, and evidence-driven acceptance criteria.

## Normalization priorities

Wave 32 expands this document toward:

1. explicit requirement realization references;
2. alignment with canonical RBAC/access-level mapping;
3. direct links to use cases, SDDs, and verification surfaces.

## Priority-first expansion program (toward 5000 requirement IDs)

This SRS lane now follows a staged expansion model where business-critical operations are completed first for **MD (`owner`)** and **Leasing Agent (`leasing_agent`)** personas.

### Priority completion order

1. Property listings lifecycle and readiness controls
2. Full leasing operations (qualification, viewing, tenancy/Ejari, active lease)
3. Receipt generation, delivery, archival, and audit continuity

### 5000-ID allocation architecture

| Expansion lane | ID allocation block | Primary focus |
| --- | --- | --- |
| Lane A | `00001-02000` | Listings and listing-to-leasing conversion controls |
| Lane B | `02001-03700` | Leasing full operations and tenancy/Ejari lifecycle |
| Lane C | `03701-04600` | Receipt and finance-operational continuity |
| Lane D | `04601-05000` | Cross-cutting controls, reserves, and governance |

### Uniqueness and quality gates

- Requirement IDs must be globally unique within the canonical owner file.
- Duplicate mirrored references in downstream docs do not increase counted totals.
- Every new requirement ID must include owner role, acceptance criteria, and evidence mapping.
- Priority personas must be explicitly represented in acceptance evidence for lanes A-C.

---

## 🏛️ 1. Primary Corporate Departments (12 Boundaries)

1. **Residential Brokerage Sales Hub**: Drag-and-drop 4-column lead grid, pipeline velocity tracking, broker targets, secondary inventory matching.
2. **Strategic Off-Plan & Development**: Developer relations, launch carousels, tier matrices, unit allocation, SPA generation, construction milestone tracking.
3. **Commercial Real Estate & Investment**: Commercial asset portfolio, ROI calculators, multi-currency treasury, institutional investor pitch decks.
4. **Portfolio Management & Residential Leasing**: High-volume rental dashboard, automated Ejari contract lifecycles, PDC cheque schedule, lease renewals, Form 7 rent increase notices.
5. **Asset Management & Facilities (DH2 Hub)**: 9,378-unit DAMAC Hills 2 master property matrix, cluster tiles, occupancy color badges, maintenance work order kanban.
6. **Revenue, Finance & Treasury**: Automated 4-step financial approval workflow (Agent Submitted ➔ Manager Approved ➔ Finance Locked ➔ Payment Released), AR aging, UAE FTA VAT 5% return export.
7. **Performance Marketing & Lead Acquisition**: Marketing ROI scoreboard, lead capture forms, social campaign publisher, email nurture sequence builder.
8. **Corporate Communications & Client Experience**: Nadia WhatsApp routing pool, 15-minute SLA timer, automated client response tickers.
9. **Executive Office & Strategy**: Managing Director flight deck, cross-department aggregator, global telemetry, 0-token debugging central trace.
10. **Regulatory Affairs & RERA Compliance**: RERA/DLD permit checklist, Form 12 eviction timelines, Form 6 lease contract logs, UAE PDPL data privacy audit.
11. **Conveyancing & Transaction Management**: E-Signature collection flow, title deed transfer tracker, DLD escrow account monitor, Oqood registration.
12. **Technology, AI & Market Intelligence**: AI Assistant Avatar Hub, Sentinel predictive pricing map, IoT property health sensor anomaly heatmaps.

---

## 🔒 2. Role-Based Access Control (RBAC) Hierarchy

```text
LEVEL 5: MASTER (Managing Director / Founder) ──► Full Platform Read/Write/Override + Ghost Session Impersonation
LEVEL 4: EXECUTIVE (CTO, CFO, COO)             ──► Department Oversight + Financial Approvals + Telemetry
LEVEL 3: DEPARTMENT MANAGER                    ──► Team Allocation + Deal Approval + Commission Releases
LEVEL 2: SENIOR / LICENSED BROKER              ──► Active Listing CRUD + Pipeline Management + Lead Intake
LEVEL 1: ASSOCIATE / CLIENT PORTAL             ──► Assigned Listing Views + Self-Service Document Drawer
```

This hierarchy is a software-facing access abstraction and must be reconciled with the richer
business-facing role catalogs in:

- `docs/business_docs/01_company_structure/roles.md`
- `docs/business_docs/09_user_roles_permissions/roles-matrix.md`
- `docs/plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`

---

## 💰 3. 12-Point Financial Module Specifications

- **TRN Invoice Generation**: Auto-generated 15-digit Tax Registration Number invoices with FTA 5% VAT breakdown.
- **Commission Split Calculator**: Gross to Net split calculation with agent accelerator thresholds (e.g. 50/50, 60/40, 70/30).
- **Accounts Receivable (AR) Aging**: 30 / 60 / 90 / 90+ day aging buckets with automated dunning triggers.
- **4-Step State Approval Flow**: Strict state machine transitions preventing payout without Finance Lock.
- **UAE Corporate Tax Calendar**: 9% tax liability calculator for taxable net income exceeding AED 375,000 threshold.

## 🔁 4. Requirement Realization and Traceability Map

The software-facing contract should be read as a realization map for the requirements catalog. Each requirement family must resolve into one or more implementation paths, one use-case family, one design contract or API surface, and one validation artifact before a wave is approved.

### 4.1 Traceability execution contract

Every implementation wave must explicitly define:

1. the requirement IDs being realized;
2. the linked use-case family and scenario variants;
3. the design component, service, API, or state-machine boundary;
4. the test suite or acceptance evidence artifact;
5. the release gate or readiness checkpoint that confirms completion.

### 4.2 Department-level realization matrix

| Domain | Requirement family | Example requirement IDs | Use-case family | Design contract / service | Validation surface |
| --- | --- | --- | --- | --- | --- |
| Sales & Brokerage | Pipeline lifecycle, lead progression, offer negotiation | `FR-SB-001`, `FR-SB-002`, `AC-SB-001` | `UC-SB-*` | `SalesPipelineService`, `OfferWorkflowService` | `sales-pipeline`, `offers-workflow` |
| Leasing & Tenancy | Lease lifecycle, renewals, Ejari, PDC handling | `FR-LT-001`, `BR-LT-001`, `AC-LT-001` | `UC-LT-*` | `TenancyWorkflowService`, `PdcScheduleService` | `tenancy-workflows`, `ejari-pdc` |
| Finance & Treasury | Approval flow, payment release, VAT export | `FR-FT-001`, `FR-FT-002`, `AC-FT-001` | `UC-FT-*` | `FinanceApprovalService`, `VatExportService` | `finance-approval`, `vat-export` |
| Compliance & Risk | RERA, PDPL, audit, escalation | `POL-CR-001`, `SEC-CR-001`, `AC-CR-001` | `UC-CR-*` | `ComplianceWorkflowService`, `AuditLogService` | `compliance-workflows`, `privacy-audit` |
| Communications & Client Care | Webhook intake, routing, SLA escalation | `FR-CC-001`, `INT-CC-001`, `AC-CC-001` | `UC-CC-*` | `ConversationRoutingService`, `WebhookNormalizer` | `whatsapp-routing`, `conversation-events` |
| HR & Workforce | Onboarding, license tracking, approval gating | `FR-HR-001`, `FR-HR-002`, `AC-HR-001` | `UC-HR-*` | `OnboardingWorkflowService`, `WorkforceComplianceService` | `workforce-onboarding`, `license-compliance` |

### 4.3 Evidence contract for each requirement family

Each requirement family must produce at least one of the following evidence artifacts during implementation:

- a state transition or workflow record proving the business rule executed;
- an API response or persisted entity showing the required data contract;
- an audit log or export showing compliance and traceability;
- an E2E or integration test result tied to the requirement ID.

This map should be treated as the minimum traceability shim before any implementation wave is approved and must be mirrored in the linked use-case, SDD, and test-readiness documents.

---

## 5. Implementation-ready requirement catalog excerpt

The following requirement IDs and evidence expectations are intended to be copied into implementation backlog tickets, test plans, and wave-readiness checklists.

| Department | Requirement ID | Requirement statement | Acceptance criteria | Evidence artifact |
| --- | --- | --- | --- | --- |
| Sales & Brokerage | `FR-SB-001` | A lead must be able to move through pipeline stages with immutable history and visible ownership. | The current stage, assigned agent, and last-updated timestamp appear in the record; moving to a new stage creates a new activity entry. | Activity feed entry plus API response or UI state snapshot. |
| Leasing & Tenancy | `FR-LT-001` | Lease lifecycle events must support renewals, Ejari generation, and PDC reminders. | The lease status, next payment date, and Ejari/PDC status are visible; overdue or expiring cases surface an alert. | Workflow record, lease entity payload, or scheduled reminder log. |
| Finance & Treasury | `FR-FT-001` | Financial approvals must enforce the 4-step state machine before payout release. | Payment release is blocked until Finance Lock is completed and the approval chain is recorded. | Approval audit log and payment transaction state. |
| Compliance & Risk | `POL-CR-001` | Regulated actions must produce auditable evidence for RERA, DLD, and PDPL requirements. | Each regulated action generates an immutable audit event with user, timestamp, and decision context. | Audit export or compliance event log. |
| Communications & Client Care | `FR-CC-001` | Incoming client messages must be routed, acknowledged, and escalated within defined SLA thresholds. | A message is assigned to a queue or agent, a response SLA timer is visible, and escalation is triggered on breach. | Conversation event payload and SLA escalation record. |
| HR & Workforce | `FR-HR-001` | Workforce onboarding and license tracking must block non-compliant users from privileged access. | New users cannot gain restricted access until onboarding and license checks pass; non-compliance is visible to managers. | Onboarding workflow state plus access-control evaluation result. |

### 5.1 Expanded departmental requirement catalog

The following department-level requirement families should be treated as the minimum implementation scaffold for backlog creation and readiness reviews.

| Department | Requirement family | Example IDs | Primary acceptance outcome | Evidence artifact |
| --- | --- | --- | --- | --- |
| Sales & Brokerage | Pipeline lifecycle and offer progression | `FR-SB-001`, `FR-SB-002`, `AC-SB-001` | Lead and deal stages update with visible ownership and immutable history. | Activity feed entry plus API/UI state snapshot. |
| Off-Plan & Development | Project launch and unit allocation | `FR-OP-001`, `FR-OP-002`, `AC-OP-001` | Project, unit, and milestone status remain synchronized across listing and reservation flows. | Project snapshot and reservation workflow record. |
| Commercial & Investment | Deal evaluation and portfolio reporting | `FR-CI-001`, `FR-CI-002`, `AC-CI-001` | Investment and commercial opportunities show ROI, status, and required approvals. | Deal record and ROI report export. |
| Leasing & Tenancy | Lease lifecycle, renewal, and PDC handling | `FR-LT-001`, `FR-LT-002`, `AC-LT-001` | Lease status, payment obligations, and Ejari/PDC reminders remain visible and auditable. | Lease workflow record and reminder log. |
| Facilities & Asset Management | Maintenance, occupancy, and work order workflows | `FR-FM-001`, `FR-FM-002`, `AC-FM-001` | Tickets move through assigned states with SLA visibility and contractor handoff. | Work order state record and SLA breach log. |
| Finance & Treasury | Approval gating and payment release | `FR-FT-001`, `FR-FT-002`, `AC-FT-001` | Payments cannot release without completing the full approval chain and lock state. | Approval audit log and payment transaction state. |
| Marketing & Lead Acquisition | Lead capture, campaign tracking, and nurture | `FR-MG-001`, `FR-MG-002`, `AC-MG-001` | Campaign leads are attributed, nurtured, and surfaced to the proper owners. | Lead-source report and nurture automation audit. |
| Communications & Client Care | Messaging routing and SLA escalation | `FR-CC-001`, `FR-CC-002`, `AC-CC-001` | Client messages are routed to the correct queue and escalated on SLA breach. | Conversation event payload and SLA escalation record. |
| Executive & Strategy | Cross-functional dashboards and executive reporting | `FR-EX-001`, `FR-EX-002`, `AC-EX-001` | Executive views aggregate accurate operational and financial status across teams. | Aggregated dashboard snapshot and report export. |
| Compliance & Risk | Regulatory controls and privacy evidence | `POL-CR-001`, `SEC-CR-001`, `AC-CR-001` | Regulated actions log user, timestamp, and decision context for audit review. | Audit export or compliance event log. |
| Conveyancing & Transactions | Transfer, escrow, and document workflow | `FR-CT-001`, `INT-CT-001`, `AC-CT-001` | Transaction steps progress with required documents, approvals, and status visibility. | Transaction workflow event log and document record. |
| Technology, AI & Intelligence | Platform operations, telemetry, and AI service guardrails | `FR-TA-001`, `OBS-TA-001`, `AC-TA-001` | Platform health, AI service availability, and telemetry remain visible and recoverable. | Telemetry log and incident recovery record. |

### 5.2 Evidence expectation per requirement family

Each requirement family must be backed by evidence before a wave is marked ready:

- a workflow state transition or business-rule execution record;
- a persisted entity, API response, or exported report proving the data contract;
- an integration or E2E test tied to the requirement ID and acceptance criteria.

These examples should be mirrored in the linked SRS master, use-case catalog, design artifacts, and test-readiness checklists.

### 5.3 Traceability matrix exemplar

The following traceability pattern should be applied whenever a requirement family is moved into a delivery wave.

| Requirement ID | Use-case family | Design boundary | Validation artifact | Readiness cue |
| --- | --- | --- | --- | --- |
| `FR-SB-001` | `UC-SB-01` | `SalesPipelineService` | `sales-pipeline` integration test | Stage changes and ownership history are visible and persisted. |
| `FR-LT-001` | `UC-LT-02` | `TenancyWorkflowService` | `tenancy-workflows` and `ejari-pdc` tests | Lease lifecycle, Ejari, and PDC reminders appear in the correct state. |
| `FR-FT-001` | `UC-FT-03` | `FinanceApprovalService` | `finance-approval` workflow test | Payment release is blocked until the approval chain is complete. |
| `POL-CR-001` | `UC-CR-04` | `ComplianceWorkflowService` | `privacy-audit` or `audit-export` evidence | Each regulated action leaves immutable audit evidence. |
| `FR-CC-001` | `UC-CC-05` | `ConversationRoutingService` | `whatsapp-routing` E2E test | Routed messages and SLA breaches are visible and escalated correctly. |
| `FR-TA-001` | `UC-TA-06` | `TelemetryService` | `telemetry` and `incident-recovery` checks | Platform health and service recovery are observable. |

This matrix is the minimum evidence bridge between requirements, implementation, QA, and release readiness.

### 5.4 Expanded implementation scaffold for lower-density domains

The following domain-specific requirements should be carried directly into backlog tickets, test plans, and release gates so the SRS suite is not only descriptive but immediately actionable.

| Department | Requirement ID | Requirement statement | Acceptance criteria | Evidence artifact |
| --- | --- | --- | --- | --- |
| Off-Plan & Development | `FR-OP-001` | Project and unit reservations must remain synchronized across listing, pricing, and milestone updates. | A reservation created against a project updates the project unit state, milestone timeline, and reservation history without manual reconciliation. | Reservation workflow record plus project snapshot export. |
| Off-Plan & Development | `FR-OP-002` | Off-plan payment milestones must be traceable to the underlying reservation and approval status. | Each milestone shows amount, due date, status, and approval state, and payout release is blocked until the required approval evidence exists. | Payment milestone ledger and approval audit log. |
| Commercial & Investment | `FR-CI-001` | Commercial deals must show ROI, risk flags, and approval status before being promoted to active pipeline. | Deal cards display expected yield, approval state, and required next action; incomplete deals cannot advance to active. | Deal record and ROI report export. |
| Facilities & Asset Management | `FR-FM-001` | Maintenance work orders must progress through assigned states with clear SLA and contractor handoff. | A ticket must move through open, assigned, in progress, completed, or cancelled with timestamped handoff and breach visibility. | Work order state record and SLA breach log. |
| Marketing & Lead Acquisition | `FR-MG-001` | Campaign audiences must be creatable from area, budget, and lead-stage segments. | A campaign can be saved with at least three segments and a preview summary before launch. | Campaign save event and preview UI data. |
| Conveyancing & Transactions | `FR-CT-001` | Transaction workflows must require the correct documents and transfer state before completion. | A transaction cannot be marked complete until the required document set and transfer state are present and validated. | Transaction workflow log and document checklist record. |
| Technology, AI & Intelligence | `FR-TA-001` | Platform telemetry and AI service health must be observable and recoverable during incidents. | Incident and recovery data are visible to operators and linked to the affected service and alert. | Telemetry log and incident recovery record. |
| Executive & Strategy | `FR-EX-001` | Executive dashboards must aggregate cross-department operational status without manual reconciliation. | Dashboard views reflect current pipeline, financial approvals, and SLA status from the same source-of-truth data set. | Aggregated dashboard snapshot and export. |

This expansion pack should be treated as the implementation-ready bridge from the business SRS suite into backlog generation, QA, and release evidence collection.

### 5.5 Wave-ready traceability map

The following map should be used when a requirement family enters a delivery wave. Each row should be converted into a ticket with an owner, validation artifact, and evidence collection point.

| Wave item | Requirement IDs | Delivery owner | Evidence artifact | Readiness checkpoint |
| --- | --- | --- | --- | --- |
| `WAVE-SRS-001` | `FR-OP-001`, `FR-OP-002` | Off-plan delivery lead | Reservation workflow record + milestone ledger | Reservation and milestone state align without manual reconciliation. |
| `WAVE-SRS-002` | `FR-CI-001` | Commercial finance lead | Deal record + ROI report export | Deal progression is blocked until ROI and approval data are present. |
| `WAVE-SRS-003` | `FR-FM-001` | Facilities operations lead | Work order state log + SLA breach record | Maintenance transitions and SLAs are visible and auditable. |
| `WAVE-SRS-004` | `FR-MG-001` | Marketing operations lead | Campaign preview + save event export | Segments and launch constraints are captured before launch. |
| `WAVE-SRS-005` | `FR-CT-001` | Conveyancing operations lead | Transaction workflow log + document checklist | Completion is blocked until required documents and state are present. |
| `WAVE-SRS-006` | `FR-TA-001` | Platform operations lead | Telemetry log + incident recovery artifact | Operational health and incident recovery are observable. |
| `WAVE-SRS-007` | `FR-EX-001` | Strategy reporting lead | Executive dashboard export + status snapshot | Cross-team status is visible from a shared source of truth. |

---

## 6. Wave-ready implementation checklist

Every implementation wave should be able to answer the following questions before work begins:

1. Which requirement IDs are in scope for this wave?
2. Which use-case family and scenario variants are being exercised?
3. Which design contract, service, or API boundary is responsible for the behavior?
4. Which test artifact or evidence file will validate completion?
5. Which readiness checkpoint or release gate will confirm the wave is done?

### 6.1 Traceability template for ticket creation

Use the following template when creating a delivery ticket or implementation task:

- Requirement IDs: `FR-...`, `BR-...`, `NFR-...`, `POL-...`, `SEC-...`
- Use case family: `UC-...`
- Design contract: service name, route, or state machine boundary
- Validation artifact: unit/integration/E2E test file or export/log artifact
- Readiness gate: evidence attached to the wave checklist or release note

This checklist is the minimum delivery contract for any requirement-driven implementation wave and should be mirrored in the linked SDD, use-case, and test-readiness artifacts.

### 6.2 Readiness gate expectations

A wave should not be considered implementation-ready unless the following are present in the task packet:

1. at least one explicit requirement ID per scoped feature;
2. one linked use-case family and scenario variant;
3. one test or evidence artifact that can demonstrate the requirement; and
4. one release or wave gate that can confirm completion.

If any of these are absent, the work should stay in a readiness-not-met state until the gap is closed.

---

## 7. Delivery handoff and rollout guidance

For each wave, the delivery handoff should include:

1. the requirement IDs in scope;
2. the owning department and implementation lead;
3. the linked use-case family and design boundary;
4. the validation artifact and evidence location;
5. the release gate that will mark the work complete.

### 7.1 Rollout expectation

A feature or workflow is considered ready for rollout only when the requirement IDs, design contract, user-facing behavior, and evidence artifact are all present and aligned. If one of these elements is missing, the wave should remain in a readiness-not-met state until the gap is closed.

---

## 8. Definition of Ready and Definition of Done

### 8.1 Definition of Ready

A work item is ready when:

- the requirement IDs are explicitly listed;
- the acceptance criteria are testable and observable;
- the owning department and implementation lead are identified;
- the linked use-case family and design boundary are known;
- the validation artifact or evidence location is assigned.

### 8.2 Definition of Done

A work item is done when:

- the implementation satisfies the acceptance criteria;
- the evidence artifact is attached or linked;
- the relevant test or verification result is captured;
- the handoff notes confirm the requirement-to-design-to-evidence path is complete.

### 8.3 Cross-team ownership note

Requirement delivery should not be treated as a single-team exercise. Business ownership, implementation ownership, QA ownership, and compliance ownership must all be visible in the wave packet so that handoff gaps are visible before release.

---

## 9. Release gate criteria

A release gate should not pass unless all of the following are true:

1. the requirement IDs in scope are explicitly accounted for;
2. the implementation evidence artifact is attached or linked;
3. the acceptance criteria have been verified by a test or review artifact;
4. the ownership and handoff notes are complete;
5. the release note or wave checklist records the final readiness decision.

If any of these items are missing, the wave remains blocked and should not be promoted to release.
