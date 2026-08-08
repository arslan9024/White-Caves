# Scheduling and Calendar

> **Owner:** @Booking | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** Agent availability config, appointment types and Google/Outlook two-way calendar sync.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM scheduling and calendar feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend calendar workflow/resilience lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The scheduling and calendar module manages availability, appointment creation, reminders, and two-way sync with external calendars.

## Requirement catalog

### REQ-SCH-001: Availability rules and appointment types

The system shall configure working hours, appointment types, and calendar blocks per role.

**Acceptance criteria:**

- [ ] Working hours can be defined per role or department
- [ ] Public holidays and manual blocks are enforced
- [ ] Appointment types are enumerated and selectable

**Evidence:** availability configuration record and appointment type list.

### REQ-SCH-002: Calendar views and conflict prevention

The system shall present day, week, month, and agenda views with conflict prevention rules.

**Acceptance criteria:**

- [ ] Calendar views render the same data set in different layouts
- [ ] Double-booking is blocked for the same agent unless policy allows it
- [ ] Open-house exceptions require explicit capacity configuration

**Evidence:** calendar view snapshot and conflict log.

### REQ-SCH-003: Two-way sync and notification workflow

The system shall sync appointments with Google and Outlook and send reminders on schedule.

**Acceptance criteria:**

- [ ] CRM events push to external calendars
- [ ] External busy slots are ingested back into CRM
- [ ] Reminder notifications are sent at the configured intervals

**Evidence:** sync log, reminder queue, and notification audit.

### REQ-SCH-004: Security, permissions, and timezone correctness

The system shall enforce role-based calendar permissions and timezone-safe scheduling.

**Acceptance criteria:**

- [ ] Agents edit only their own calendars
- [ ] Managers can overlay team calendars
- [ ] UAE timezone handling is consistent across sync and reminders

**Evidence:** permission check, overlay snapshot, and timezone test.

## Traceability

- Maps to `REQ-VW-001`, `REQ-VW-003`, and `REQ-MNT-003`
- Aligns to `WC-SRS-011`, `WC-SRS-012`, and scheduling evidence artifacts
- Feeds appointment, reminder, and sync validation

## 2. Availability Configuration and Appointment Types

Availability rules should be maintained as configurable role templates with explicit exception handling for holidays, travel, and special operations.

## 3. Google Calendar and Outlook Sync Spec

Scheduling calendar requirements are now captured in the catalog below, covering availability rules, calendar views, synchronization, and notification behavior.

## 4. Calendar Views

- Day, week, month, and agenda views.
- Color coding by appointment type and agent.
- Quick filters for department and priority.

## 5. Conflict Prevention

- Hard block double-booking for same agent.
- Property-level overlap rules for exclusive units.
- Open-house exception support with capacity controls.

## 6. Availability Rules

- Working hours template per role.
- Public holiday auto-blocks.
- Manual blocks for leave, training, and travel.

## 7. Notification Workflow

- Reminder schedule: 24h, 1h, 15m.
- Push + email + WhatsApp reminders.
- Missed appointment alerts to manager.

## 8. Two-Way Sync Logic

- CRM-to-Google/Outlook event push.
- External event ingestion as CRM busy slots.
- Conflict reconciliation with source-of-truth policy.

## 9. API Endpoints

- `GET /api/calendar/availability`
- `POST /api/calendar/appointments`
- `PATCH /api/calendar/appointments/:id`
- `POST /api/calendar/sync/google|outlook`

## 10. Security and Permissions

- Agents can edit own calendars only.
- Managers can overlay team calendars.
- Admin can configure global schedule policies.

## 11. Acceptance Criteria

- Appointments sync both directions without duplicates.
- Conflict checks prevent invalid bookings.
- Reminder notifications are sent on schedule.
- Multi-agent overlay works for manager role.

## 12. Test Plan

- Sync create/update/delete scenarios.
- Conflict and open-house exception tests.
- Timezone correctness for UAE locale.
- Reminder queue retry behavior.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
