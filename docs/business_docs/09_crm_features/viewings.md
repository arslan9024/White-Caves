# Property Viewings — Business Specification

<!-- markdownlint-disable MD024 MD031 MD032 MD040 MD058 MD060 -->

**Owner:** @Booking (Llama 3.1 70B — Groq Console)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Booking Task 1
**Target:** 10 sections
**API Route:** `/api/viewings`
**Related:** scheduling-calendar.md, leads, properties
**Last Updated:** 2026-08-07
**Next Review:** 2026-08-21
**Source of Truth:** CRM property viewings feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend workflow/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## Overview

The viewings module manages all property viewing appointments — in-person and virtual — from lead request through confirmation, execution, post-viewing feedback, and conversion tracking. It integrates with the agent calendar to prevent double-booking and auto-triggers follow-up workflows after each viewing.

## Requirement catalog

### REQ-VW-001: Viewing scheduling and confirmation

The system shall create and confirm property viewing appointments based on agent availability and property rules.

**Acceptance criteria:**

- [ ] Viewing records store property, lead, agent, start time, duration, and type
- [ ] Confirmed bookings trigger a customer confirmation message
- [ ] The UI prevents invalid scheduling when the slot is already consumed

**Evidence:** viewing record, confirmation message log, and scheduler snapshot.

### REQ-VW-002: Conflict detection and open-house handling

The system shall reject double-booking conflicts while allowing controlled open-house overlaps.

**Acceptance criteria:**

- [ ] Same-agent time overlaps are rejected for standard viewings
- [ ] Same-property time overlaps are rejected unless open-house mode is enabled
- [ ] Conflict messages explain the reason and next available options

**Evidence:** conflict engine log, rejected booking record, and open-house configuration.

### REQ-VW-003: Calendar and ICS synchronization

The system shall generate calendar artifacts and keep external calendar systems aligned.

**Acceptance criteria:**

- [ ] Confirmed bookings generate an .ics file
- [ ] Calendar sync updates reflect confirmation, reschedule, and cancellation events
- [ ] Location and notes are included in the exported calendar item

**Evidence:** ICS artifact, calendar sync log, and external event trace.

### REQ-VW-004: Virtual viewing lifecycle

The system shall support secure virtual viewing links and consent-aware recording behavior.

**Acceptance criteria:**

- [ ] Virtual appointments can generate a meeting link at confirmation time
- [ ] Recording consent is captured before enabling recording
- [ ] Fallback handling is available when physical access is blocked

**Evidence:** meeting link record, consent flag, and fallback handling log.

### REQ-VW-005: Post-viewing feedback and conversion analytics

The system shall request feedback after completed viewings and track conversion outcomes.

**Acceptance criteria:**

- [ ] Feedback prompt is sent after completion
- [ ] Viewing-to-offer metrics are available per property and agent
- [ ] Follow-up tasks are created within the documented SLA

**Evidence:** feedback response record, conversion analytics snapshot, and task queue entry.

## Traceability

- Supports `REQ-LEAD-003` and adjacent lead workflow requirements in `functional-requirements.md`
- Maps to `WC-SRS-011`, `WC-SRS-012`, and scheduling/inbox automation artifacts
- Feeds operations, analytics, and tenant/handover follow-up workflows

**Key Capabilities:**

- Viewing scheduling with agent availability checking
- Conflict detection (agent double-booking, property already booked)
- WhatsApp confirmation and reminder messages
- ICS calendar file generation (.ics export)
- Virtual viewing support (Zoom/Teams link auto-generation)
- Post-viewing feedback collection (1-5 star rating + text)
- Viewing-to-offer conversion rate tracking per property
- Bulk open-house slot creation

---

## Implementation handoff

The planning prompts above are superseded by the requirement catalog in this document. The active specification now covers viewing scheduling, conflict detection, ICS exports, open-house slots, virtual viewings, and post-viewing automation.

## Viewing Schema Contract

- Core fields: `propertyId`, `leadId`, `agentId`, `scheduledAt`, `durationMinutes`, `status`, `type`.
- Optional fields: `zoomLink`, `notes`, `feedbackRating`, `feedbackText`.
- Status enum: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`.

## Scheduling Workflow

1. Lead selects slot from available agent calendar.
2. Conflict check runs for agent and property.
3. Confirmation sent to lead and assigned agent.
4. Reminder sent at 24h and 1h before appointment.
5. Completion prompts feedback and follow-up action creation.

## Conflict Detection Rules

- Reject overlap for same `agentId` and time window.
- Reject overlap for same `propertyId` when exclusive access required.
- Allow controlled overlaps only for open-house flag.
- Surface actionable reason message in UI.

## ICS and Calendar Sync

- Auto-generate `.ics` file on confirmation.
- Include location, unit number, contact details, and notes.
- Integrate with Google/Outlook sync jobs.
- Calendar update webhooks keep CRM state aligned.

## Virtual Viewing Standard

- Generate secure link (Zoom/Teams) at confirmation time.
- Record consent before enabling recording.
- Save meeting URL and recording metadata in viewing record.
- Virtual fallback triggered when in-person access blocked.

## Property Access and Compliance Log

- Track key handover: out time, return time, person responsible.
- Capture building clearance requirements for visitor entry.
- Log incidents (late return, denied access, no key available).
- Require manager sign-off for repeated access issues.

## Post-Viewing Automation

- 30 min after completion: send brochure and summary.
- Create follow-up task due within 48h.
- Update lead stage to `viewed`.
- Trigger conversion event for analytics dashboard.

## KPIs and Acceptance Criteria

- No double-booking for non-open-house appointments.
- > =95% reminders delivered before appointment.
- Feedback captured for >=70% completed viewings.
- Conversion metric available per property and agent.

## Test Scenarios

- Overlap conflict rejection.
- Open-house multi-slot acceptance.
- Virtual viewing creation with recording consent.
- Post-viewing automation chain execution.

## Rollback and Manual Override

- Feature flag for new conflict engine.
- Manual scheduler override limited to manager role.
- Export calendar conflicts report for operations review.
- Requeue failed reminder jobs with idempotent token.
