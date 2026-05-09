# Activity Feed — Business Specification

**Owner:** @Hedy | **Tool:** Groq Console (Llama 3.1 70B)
**Purpose:** CRM activity timeline showing all agent and system events in real time.
**Status:** ✅ Expanded by @Hedy.

CONSUMES←@Maya: business_docs/09_crm_features/handover-management.md#audit-events
FEEDS→@Cassie: business_docs/09_crm_features/audit-trail.md#kpi-events

---

## 1. Overview

The Activity Feed is the CRM's live event timeline — a reverse-chronological stream of every meaningful action taken by agents, tenants, landlords, and automated system workflows. It drives both the **company-wide feed** (visible to managers and admins) and the **personal feed** (visible to each agent for their own activity).

**Key Capabilities:**
- Real-time event push via WebSocket (personal + company feed)
- Infinite-scroll pagination (20 items per page)
- Feed search + filter by activity type
- Daily activity digest email
- Deep-link from each activity card to the relevant entity

---

## 2. Activity Event Types and Display Templates

**Route:** `GET /api/activities?feedType=personal|company&type=&page=&limit=20`

| Event Type | Display Text Template | Deep-Link |
|---|---|---|
| `lead_created` | `{agent} added lead {leadName}` | `/crm/leads/{leadId}` |
| `lead_stage_changed` | `{agent} moved {leadName} to {newStage}` | `/crm/leads/{leadId}` |
| `property_listed` | `{agent} listed {propertyAddress}` | `/properties/{propertyId}` |
| `viewing_scheduled` | `{agent} scheduled viewing for {leadName} at {propertyAddress}` | `/crm/viewings/{viewingId}` |
| `viewing_completed` | `Viewing completed — {leadName} rated {rating}★` | `/crm/viewings/{viewingId}` |
| `offer_submitted` | `{agent} submitted offer AED {amount} on {propertyAddress}` | `/crm/offers/{offerId}` |
| `offer_accepted` | `Offer accepted — {leadName} × {propertyAddress}` | `/crm/offers/{offerId}` |
| `lease_signed` | `{agent} signed lease for {propertyAddress}` | `/crm/leases/{leaseId}` |
| `payment_received` | `Rent payment of AED {amount} received from {tenantName}` | `/crm/leases/{leaseId}/payments` |
| `payment_overdue` | `⚠️ Rent overdue — {tenantName} at {propertyAddress}` | `/crm/leases/{leaseId}/payments` |
| `maintenance_opened` | `{tenant} submitted maintenance request #{ticketId}` | `/crm/maintenance/{ticketId}` |
| `maintenance_resolved` | `Maintenance #{ticketId} resolved — rated {rating}★` | `/crm/maintenance/{ticketId}` |
| `document_signed` | `{documentType} signed by all parties for {propertyAddress}` | `/crm/documents/{documentId}` |
| `commission_disbursed` | `Commission AED {amount} disbursed to {agentName}` | `/crm/commissions/{commissionId}` |
| `user_joined` | `{userName} joined the platform as {role}` | `/admin/users/{userId}` |
| `handover_completed` | `Unit {unitNumber} handed over to {buyerName}` | `/crm/handovers/{handoverId}` |

**Data Schema:**
```prisma
model ActivityEvent {
  id         String   @id @default(cuid())
  type       String                           // event type key
  actorId    String?                          // userId (null for system events)
  actorName  String
  entityType String
  entityId   String
  entityName String                           // display name for template
  metadata   Json?                            // extra fields for template interpolation
  feedScope  String   @default("company")     // personal | company | system
  createdAt  DateTime @default(now())
  @@index([actorId, createdAt])
  @@index([feedScope, createdAt])
}
```

---

## 3. Activity Card Component Spec

```tsx
// src/components/crm/ActivityFeed/ActivityCard.tsx
interface ActivityCardProps {
  event: ActivityEvent;
  isPersonal?: boolean;
}
```

**Layout (52px height min):**
```
[Avatar circle 36px]  [Action sentence bold]
                       [Entity deep-link underlined]
                       [Relative time "2 hours ago"] — tooltip: absolute ISO timestamp
```

- **Avatar:** User initials in gold circle; system events use White Caves logo icon
- **Action sentence:** Rendered from template with entity name bolded
- **Deep-link:** Navigates to entity page; opens in same tab
- **Relative time:** `date-fns formatDistanceToNow()` with `addSuffix: true`; absolute on hover
- **Hover state:** Background shifts to `rgba(201,168,76,0.08)` (gold tint)

---

## 4. Personal vs Company Feed

| Scope | Who Sees It | Content |
|---|---|---|
| **Personal** | Agent (own) | Only events where `actorId === currentUser.id` |
| **Company** | Manager, Admin, Superuser | All events across all agents |
| **System** | Admin, Superuser | Automated events (payment reminders, cron jobs) |

Agents cannot access company feed — 403 returned.

---

## 5. Pagination — Infinite Scroll

```
GET /api/activities?feedType=personal&cursor=<lastEventId>&limit=20
Response: { events: ActivityEvent[], nextCursor: string | null, hasMore: boolean }
```

Frontend triggers next page when last card scrolls into viewport (IntersectionObserver). Loading state: skeleton cards (3 × shimmer animation).

---

## 6. Feed Search + Filter

- **Search:** `GET /api/activities?q=<text>` — searches `actorName`, `entityName`, `metadata`
- **Filter by type:** `?type=lease_signed,payment_received` (comma-separated)
- **Date range:** `?startDate=&endDate=`
- Results sorted: newest first (non-negotiable)

---

## 7. Daily Activity Digest Email

**Schedule:** Sent at 08:00 GST every weekday to agents + managers

**Content:**
- Yesterday's summary: N leads added, N viewings, N leases signed, N payments received
- Agent's personal top event (highest impact)
- Link to full company feed

**API:**
```
POST /api/activities/digest/send (internal cron trigger — not public)
```

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Template interpolation for all 16 event types | Unit |
| Agent cannot access company feed (403) | Integration |
| Pagination cursor returns correct next page | Integration |
| WebSocket pushes event within 200ms | Integration |
| Digest email generated with correct counts | Unit |
| Empty feed shows empty state component | Unit (React) |