# Off-Plan Projects Management — Business Specification

<!-- markdownlint-disable MD040 -->

**Owner:** @Maya (Llama 3.1 70B — Groq Console)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Maya Task 1
**Target:** 14 sections
**CRM Module:** AtlasProjectsCRM (src/components/crm/AtlasProjectsCRM/)
**API Base:** `/api/properties?transactionType=primary`, `/api/leasing-inventory`
**Last Updated:** 2026-08-07
**Next Review:** 2026-08-21
**Source of Truth:** CRM off-plan projects feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend state/reliability closure lanes in `docs/plans/waves/WAVE_38_*` through `WAVE_40_*`

---

## Overview

AtlasProjectsCRM manages the full lifecycle of off-plan property projects — from developer launch through buyer reservation, Oqood DLD registration, construction milestone tracking, and final handover. It is used by both sales agents (selling units) and the investment team (portfolio buyers).

**Key Capabilities:**

- Project and unit inventory management
- Buyer reservation and SPA signing workflow
- Oqood DLD registration (mandatory within 60 days of SPA)
- Construction milestone and payment schedule tracking
- Escrow account compliance (Law No. 8 of 2007)
- ROI projection calculator for investor clients
- Cancellation refund engine (RERA Article 11)

## Requirement catalog

### REQ-OFFP-001: Project and unit inventory management

The system shall track off-plan projects, their unit inventory, and structured payment plan options.

**Acceptance criteria:**

- [ ] Projects store developer, launch, completion, and inventory fields
- [ ] Units are tracked with status and reservation lock behavior
- [ ] Payment plan options are represented as milestone arrays

**Evidence:** project record, unit inventory, and payment plan snapshot.

### REQ-OFFP-002: Reservation to SPA workflow

The system shall support the buyer reservation flow from deposit capture through SPA signing and Oqood registration.

**Acceptance criteria:**

- [ ] Reservation requires an EOI deposit reference
- [ ] SPA signing appointment is scheduled before registration
- [ ] Oqood registration is targetable within 60 days

**Evidence:** reservation log and SPA/Oqood timeline.

### REQ-OFFP-003: Milestone tracking and payment engine

The system shall track construction milestones and payment schedules with overdue handling.

**Acceptance criteria:**

- [ ] Milestone percentage and due dates are visible
- [ ] Overdue and variance states are surfaced
- [ ] Buyers receive milestone notifications

**Evidence:** milestone tracker and payment schedule audit.

### REQ-OFFP-004: Escrow, cancellation, and ROI controls

The system shall enforce escrow compliance, calculate cancellation refunds, and provide ROI estimates.

**Acceptance criteria:**

- [ ] Escrow evidence is required before disbursement
- [ ] Refund brackets follow the defined policy rules
- [ ] ROI outputs include gross yield, net yield, and payback period

**Evidence:** escrow validation log, refund worksheet, and ROI report.

## Traceability

- Maps to `REQ-INV-003`, `REQ-VAL-002`, and finance/investment coverage
- Aligns to `WC-SRS-012`, `WC-SRS-014`, and off-plan evidence artifacts
- Feeds reservation, escrow, and investor validation

---

## Implementation handoff

The planning prompts above are superseded by the requirement catalog in this document. The active specification now covers project inventory, reservation workflow, milestone tracking, escrow compliance, cancellation rules, and ROI controls.

## Project Schema

- Fields: developer, projectName, location, launchDate, completionDate, unitCounts.
- Payment plan options stored as structured milestone arrays.
- Project status: prelaunch, launched, selling, sold_out, handover, archived.

## Unit Inventory Model

- Unit attributes: number, type, floor, BUA, view, listPrice, status.
- Reservation lock with timeout and deposit reference.
- Unit history records price and status changes.

## Reservation to SPA Workflow

1. EOI deposit captured.
2. SPA draft generated and reviewed.
3. Signing appointment booked.
4. Oqood registration target within 60 days.
5. Payment milestones activated.

## Milestone Tracking

- Construction progress ingestion (API/manual).
- Delay flag when variance exceeds threshold.
- Auto-notify buyers on milestone status change.

## Payment Plan Engine

- Milestone table includes due date, percentage, amount, status.
- Partial payment tracking and overdue flags.
- Escrow linkage per installment.

## Escrow Compliance

- Enforce Law No. 8 of 2007 checks.
- Validate developer escrow account registration.
- Block disbursement events lacking compliance evidence.

## Cancellation and Refund Rules

- Refund penalty brackets per RERA Article 11.
- Auto-calculate refund amount with policy basis.
- Escalation for disputed cancellation outcomes.

## ROI and Yield Calculator

- Inputs: purchase price, rent projection, service charge.
- Outputs: gross yield, net yield, payback period.
- Scenario mode: conservative/base/optimistic.

## Developer Risk Rating

- Credit rating with audit timestamp.
- Risk badges surfaced in project UI.
- Higher risk triggers additional approval gates.

## API Contract

- `GET /api/offplan/projects`
- `POST /api/offplan/reservations`
- `POST /api/offplan/oqood`
- `PATCH /api/offplan/payments/:id`

## Acceptance Criteria

- Reservation-to-SPA path fully traceable.
- Milestone and payment updates reflected in dashboards.
- Escrow/cancellation compliance logic enforceable.
- ROI outputs available on project detail.

## Test Scenarios

- Reservation expiry and release flow.
- Late payment and escalation branch.
- Oqood deadline warning behavior.
- Cancellation refund calculations across brackets.
