# Scheduling and Calendar

> **Owner:** @Booking | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** Agent availability config, appointment types and Google/Outlook two-way calendar sync.
> **Status:** Stub -- awaiting expansion by @Booking.

---

## 1. Overview

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 2. Availability Configuration and Appointment Types

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 3. Google Calendar and Outlook Sync Spec

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

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
