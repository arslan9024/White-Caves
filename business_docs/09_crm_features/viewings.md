# Property Viewings — Business Specification

<!-- markdownlint-disable MD024 MD031 MD032 MD040 MD058 MD060 -->

**Owner:** @Booking (Llama 3.1 70B — Groq Console)
**Status:** 🟡 STUB — awaiting @Booking Task 1
**Target:** 10 sections
**API Route:** `/api/viewings`
**Related:** scheduling-calendar.md, leads, properties

---

## Overview

The viewings module manages all property viewing appointments — in-person and virtual — from lead request through confirmation, execution, post-viewing feedback, and conversion tracking. It integrates with the agent calendar to prevent double-booking and auto-triggers follow-up workflows after each viewing.

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

## TODO — @Booking Task 1

Paste the output from this prompt into the sections below:

```
@Booking — DRAFT: viewings.md → spec /api/viewings route: viewing schema (propertyId, leadId, agentId, scheduledAt, durationMinutes: default 60, status: scheduled/confirmed/completed/cancelled/no_show, type: in-person/virtual, zoomLink if virtual, notes, feedbackRating 1-5, feedbackText), scheduling flow (lead selects slot from agent availability → confirmation WhatsApp message sent → 24h reminder → post-viewing WhatsApp feedback request), conflict detection (agent double-booking check, property already has confirmed viewing at same time), ICS file generation (.ics export with property address as location), bulk open-house slots (one property, multiple concurrent viewing slots), viewing conversion metric (viewings → offers rate per property, tracked in analytics).
```

## TODO — @Booking Task 2

```
@Booking — DRAFT: scheduling-calendar.md → spec agent calendar: availability config, appointment types, calendar views, multi-agent overlay, Google Calendar sync (OAuth2), Outlook sync (Microsoft Graph API), mobile push notifications.
```

## TODO — @Booking Task 3

```
@Booking — EXPAND: viewings.md → add virtual viewing spec, viewing preparation checklist, property access log, post-viewing automated workflow (send brochure, create follow-up task, update lead stage, prompt agent for verbal feedback).
```

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
