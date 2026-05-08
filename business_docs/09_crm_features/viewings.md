# Property Viewings — Business Specification

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
