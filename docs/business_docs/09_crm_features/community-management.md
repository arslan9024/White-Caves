# Community Management

> **Owner:** @Marissa | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** JunoCommunity module for building announcements, facility bookings and service charges.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM community management feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend resident workflow/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

JunoCommunity manages resident communication, amenities, service charges, and event coordination for buildings and communities.

## Requirement catalog

### REQ-COMM-001: Announcement targeting and board publishing

The system shall publish community announcements and target them by building, floor, or resident group.

**Acceptance criteria:**

- [ ] Announcements can be targeted by building and floor
- [ ] Publish, pin, and archive states are available
- [ ] Resident notifications follow the configured channels

**Evidence:** announcement post record and delivery log.

### REQ-COMM-002: Facility booking and conflict prevention

The system shall allow residents to book facilities while preventing conflicting reservations.

**Acceptance criteria:**

- [ ] Booking slots are enforced by duration and capacity
- [ ] Conflicts are blocked with a clear message
- [ ] Approval workflows are available where needed

**Evidence:** booking record, conflict rejection log, and approval audit.

### REQ-COMM-003: Service charge tracking and escalation

The system shall track service charges, payment status, and arrears escalation.

**Acceptance criteria:**

- [ ] Quarterly invoices are generated per unit
- [ ] Payment and arrears status is visible
- [ ] Escalation rules trigger on overdue balances

**Evidence:** service-charge ledger and escalation log.

### REQ-COMM-004: Event calendar and resident engagement

The system shall manage resident events, RSVP counts, and reminder notifications.

**Acceptance criteria:**

- [ ] Events support capacity and RSVP tracking
- [ ] Reminder notifications are sent to confirmed residents
- [ ] Event metrics are reflected in the dashboard

**Evidence:** event record, RSVP report, and reminder log.

## Traceability

- Maps to `REQ-LP-001`, `REQ-LP-003`, and `REQ-TP-003`
- Aligns to `WC-SRS-012` and resident engagement artifacts
- Feeds announcement, booking, billing, and event validation

## 2. Announcement Board Spec

Announcements should support targeted publishing, pinning, archiving, and role-based moderation.

## 3. Facility Booking Workflow

Community management requirements are now captured in the catalog below, covering announcements, bookings, service charges, and resident engagement.

## 4. Maintenance Escalation Path

- Tenant request -> building manager -> community manager -> developer.
- SLA thresholds and escalation notifications.

## 5. Service Charge Tracking

- Quarterly invoice generation and payment status.
- Arrears escalation ladder.

## 6. Event Calendar and RSVP

- Event creation, capacity limits, attendee tracking.
- Reminder notifications for confirmed residents.

## 7. KPI Dashboard

- Open requests, average resolution time, satisfaction score.
- Booking utilization by facility.

## 8. Acceptance Criteria and Tests

- Announcement targeting works by building/floor.
- Booking conflicts are prevented.
- Escalation workflow executes correctly.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
