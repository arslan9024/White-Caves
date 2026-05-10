# Scheduling and Calendar — Business Specification

**Owner:** @Booking | **Tool:** Groq Console (Llama 3.1 70B)
**Purpose:** Agent availability config, appointment types and Google/Outlook two-way calendar sync.
**Status:** ✅ Expanded by @Booking.

CONSUMES←@Victoria: business_docs/09_crm_features/tenancy-ejari.md#scheduling-constraints
FEEDS→@Maya: business_docs/09_crm_features/viewings.md#handover-triggers

---

## 1. Overview

The Scheduling and Calendar module gives every agent a configurable availability calendar with full integration into Google Calendar and Microsoft Outlook (two-way sync). Managers can overlay multiple agent calendars to coordinate team scheduling. All CRM appointments — viewings, client meetings, handovers, RERA inspections — are managed here.

---

## 2. Availability Configuration

### Working Hours (per agent)
```ts
interface AvailabilityConfig {
  agentId: string;
  workingHours: {
    monday: { start: '09:00', end: '18:00' } | null;
    tuesday: { start: '09:00', end: '18:00' } | null;
    wednesday: { start: '09:00', end: '18:00' } | null;
    thursday: { start: '09:00', end: '18:00' } | null;
    friday: { start: '09:00', end: '18:00' } | null;
    saturday: { start: '10:00', end: '16:00' } | null;
    sunday: null;  // off by default
  };
  blockedDates: string[];  // ISO date strings
  slotDurationMinutes: 30 | 60 | 90;
  bufferBetweenAppointments: number;  // minutes
}
```

### UAE Public Holidays 2026 (pre-loaded)
New Year (Jan 1), Prophet's Birthday (Feb 11), Isra Mi'raj (Mar 1), Arab Union Day (Apr 22), Eid Al Fitr (Mar 31 – Apr 2), Commemoration Day (Nov 30), National Day (Dec 2–3), Eid Al Adha (Jun 8–10), Islamic New Year (Jun 27).

### Blocked Slots
Agent can block individual slots (client meeting, personal, prayer time) — shows as "Busy" in external calendar sync.

---

## 3. Appointment Types

| Type | Duration | Color | Attendees |
|---|---|---|---|
| `property_viewing` | 60 min | Gold | Agent + lead + (optional) landlord |
| `client_meeting` | 60 min | Blue | Agent + lead |
| `landlord_meeting` | 45 min | Green | Agent + landlord |
| `rera_inspection` | 90 min | Red | Agent + RERA inspector |
| `property_handover` | 180 min | Purple | Agent + buyer + developer rep |
| `team_meeting` | 60 min | Grey | Internal |
| `dld_transfer` | 120 min | Orange | Agent + buyer + seller + trustee |
| `snagging_reinspection` | 90 min | Yellow | Agent + buyer + developer |

### Conflict Detection
- Agent double-booking → 409 error with conflicting slot details
- Property already has confirmed viewing at same time → 409 with property warning

---

## 4. Calendar Views

**Frontend:** FullCalendar.js v6 (open-source, MIT license)

| View | Description |
|---|---|
| Day | Single agent, hour-by-hour timeline |
| Week | Mon–Sat, all appointment types |
| Month | Overview with event count badges |
| Agenda | List view, next 30 days, sortable |
| Multi-Agent Overlay | Manager/admin only — all agents, color-coded by agent |

**Multi-Agent Overlay:** Available at `/crm/calendar?view=team` — requires `manager` or above role.

---

## 5. Google Calendar Sync

**Auth:** OAuth2 (`googleapis` package, scopes: `calendar.events`, `calendar.readonly`)

**Two-Way Sync:**
1. CRM appointment created → `POST /google/calendar/events` with summary, location (property address), start/end, attendee emails
2. Google event created/updated externally → webhook via Google Calendar Push Notifications → CRM slot marked "blocked" (if not a CRM event)
3. CRM appointment cancelled → `DELETE /google/calendar/events/{eventId}`

**Sync Conflict Resolution:**
- CRM is master of record for property viewings and official appointments
- Google events created outside CRM → imported as "external block" (no edit from CRM side)

**API:**
```
POST /api/calendar/google/connect → OAuth2 flow initiation
GET  /api/calendar/google/events?agentId=&from=&to= → list events
POST /api/calendar/google/sync/:appointmentId → push to Google
DELETE /api/calendar/google/sync/:appointmentId → remove from Google
```

---

## 6. Outlook / Microsoft Graph Sync

**Auth:** Microsoft Graph API, OAuth2 (scopes: `Calendars.ReadWrite`)

Same two-way sync pattern as Google Calendar. Appointment `onlineMeetingUrl` from Teams auto-populated for virtual viewings.

**API:**
```
POST /api/calendar/outlook/connect
GET  /api/calendar/outlook/events?agentId=&from=&to=
POST /api/calendar/outlook/sync/:appointmentId
```

---

## 7. Mobile Push Notification — Appointment Reminders

**Provider:** Firebase Cloud Messaging (FCM)

**Triggers:**
- 24h before appointment → push to agent device: "Tomorrow at 10:00 — Viewing at Palm Jumeirah Villa"
- 30 min before appointment → push + WhatsApp (if agent has phone linked)
- Appointment cancelled → immediate push

**API:**
```
POST /api/notifications/push
Body: { userId, title, body, data: { appointmentId } }
```

---

## 8. ICS Export

**Any appointment exportable to `.ics` file:**
```ts
function generateICS(appointment: Appointment): string {
  // VEVENT with: DTSTART, DTEND, SUMMARY, LOCATION (property address), DESCRIPTION, UID
}
```
Download: `GET /api/viewings/:id/ics` → `Content-Type: text/calendar`

---

## 9. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Double-booking returns 409 | Integration |
| Google Calendar event created on viewing save | Integration |
| Multi-agent overlay returns all agents' appointments | Integration |
| Public holiday slots blocked | Unit |
| ICS file contains correct VEVENT fields | Unit |
| FCM push sent 30 min before appointment | Integration (mocked FCM) |

---

## 10. Rollback / Migration

- `AvailabilityConfig` model added via Prisma migration
- Google/Outlook tokens stored encrypted in `AgentIntegration` table
- Token refresh handled by cron (daily) — expired tokens flagged, agent prompted to reconnect
- Rollback: drop `AgentIntegration` table migration; calendar sync disabled gracefully