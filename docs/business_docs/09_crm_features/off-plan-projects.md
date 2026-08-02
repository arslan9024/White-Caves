# Off-Plan Projects Management — Business Specification

**Owner:** @Maya (Llama 3.1 70B — Groq Console)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Maya Task 1
**Target:** 14 sections
**CRM Module:** AtlasProjectsCRM (src/components/crm/AtlasProjectsCRM/)
**API Base:** `/api/properties?transactionType=primary`, `/api/leasing-inventory`

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

---

## [Action Required: Enforce production-ready engineering constraints] — @Maya Task 1

Paste the output from this prompt into the sections below:

```
@Maya — DRAFT: off-plan-projects.md → spec AtlasProjectsCRM: project schema (developer, project name, location GeoPoint, launch date, estimated completion, totalUnits, availableUnits, paymentPlanOptions array), unit inventory (unitNumber, floor, type: studio/1BR/2BR/3BR/penthouse, BUA sqft, view, listPrice, status: available/reserved/sold/transferred), buyer reservation workflow (EOI deposit receipt → SPA draft → signing appointment → Oqood DLD registration within 60 days → payment milestone schedule), project milestone tracker (construction % from developer API or manual update, estimated handover countdown, delay flag), ROI projection calculator (inputs: purchase price, expected rent per RERA index, service charge/sqft → outputs: gross yield %, net yield %, payback years).
```

## [Action Required: Enforce production-ready engineering constraints] — @Maya Task 2

```
@Maya — DRAFT: handover-management.md → spec VestaHandoverCRM: snagging checklist, snagging report PDF, handover appointment scheduling, punch list tracking, keys & access issuance log, DEWA connection tracker, handover completion certificate.
```

## [Action Required: Enforce production-ready engineering constraints] — @Maya Task 3

```
@Maya — EXPAND: off-plan-projects.md → add payment plan engine: SPA payment schedule table, escrow compliance (Law No. 8 of 2007), cancellation refund table (RERA Article 11), developer credit rating display.
```

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
