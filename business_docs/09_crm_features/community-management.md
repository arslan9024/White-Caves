# Community Management (JunoCommunity)

> **Owner:** @Marissa | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Module:** JunoCommunity
> **Status:** Production-ready specification

`CONSUMES←@Annie: business_docs/09_crm_features/tenant-portal.md#ux-requirements`
`FEEDS→@Rachel: business_docs/06_design_architecture/ui-ux-specification.md#seo-ux-copy`

---

## 1. Overview

JunoCommunity is the building/community management layer within White Caves CRM. It enables community managers and building owners to manage resident communications, amenity bookings, maintenance escalations, service charge billing, and community events — all from a single dashboard integrated with the tenant portal.

**In-scope buildings:** Any property tagged `building.hasCommunityModule = true` (typically managed buildings in JBR, JVC, Downtown, Palm Jumeirah, Dubai Marina).

---

## 2. Announcement Board Spec

### 2.1 Data Schema

```ts
interface CommunityAnnouncement {
  id: string;
  buildingId: string;
  targetScope: 'all' | 'floor' | 'unit_list';
  targetFloors?: number[];
  targetUnitIds?: string[];
  title: string;
  body: string;                       // Markdown supported
  category: 'maintenance' | 'event' | 'policy' | 'emergency' | 'general';
  priority: 'normal' | 'urgent';
  isPinned: boolean;
  attachmentUrls: string[];
  authorId: string;                   // community manager
  publishedAt: string | null;
  expiresAt: string | null;
  status: 'draft' | 'published' | 'archived';
  readCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 Announcement Workflow

```
Manager drafts announcement (category + scope + target)
  ↓
Preview rendered in CRM
  ↓
Publish → status = 'published', publishedAt = now()
  ↓
Push notification sent to targeted residents (FCM)
  ↓
Announcement visible in tenant portal "Community" tab
  ↓
Auto-archive when expiresAt passes (nightly cron)
```

### 2.3 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/community/announcements?buildingId=` | tenant+ | List announcements for building |
| POST | `/api/community/announcements` | manager+ | Create announcement |
| PATCH | `/api/community/announcements/:id` | manager+ | Update/pin/archive |
| DELETE | `/api/community/announcements/:id` | manager+ | Delete draft only |
| POST | `/api/community/announcements/:id/read` | tenant | Mark as read (resident) |

---

## 3. Facility Booking Workflow

### 3.1 Facility Schema

```ts
interface Facility {
  id: string;
  buildingId: string;
  name: string;                   // "Swimming Pool", "Gym", "Meeting Room A"
  category: 'pool' | 'gym' | 'meeting_room' | 'bbq_area' | 'tennis_court' | 'other';
  capacity: number;
  slotDurationMinutes: number;    // 60 | 90 | 120
  maxAdvanceBookingDays: number;  // e.g. 14
  requiresApproval: boolean;      // meeting rooms = true
  costPerSlotAED: number;         // 0 for pool/gym
  availableHours: {
    [day: string]: { open: string; close: string }
  };
  maintenanceWindows: Array<{ start: string; end: string; reason: string }>;
}
```

### 3.2 Booking Schema

```ts
interface FacilityBooking {
  id: string;
  facilityId: string;
  tenantId: string;
  unitId: string;
  startAt: string;
  endAt: string;
  attendeeCount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  rejectionReason?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'waived';
  createdAt: string;
}
```

### 3.3 Booking Workflow

```
Tenant selects facility + date/time from portal
  ↓
Conflict check (no overlapping confirmed bookings)
  ↓
If requiresApproval:
  status = 'pending' → manager notified → approves/rejects within 24h
Else:
  status = 'confirmed' immediately
  ↓
Confirmation email + push notification to tenant
  ↓
Cancellation allowed up to 4h before slot (cancellation policy per building)
  ↓
After slot: status = 'completed' (nightly cron)
```

### 3.4 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/community/facilities?buildingId=` | tenant+ | List facilities |
| GET | `/api/community/facilities/:id/availability?date=` | tenant+ | Available slots |
| POST | `/api/community/bookings` | tenant | Create booking |
| GET | `/api/community/bookings?tenantId=` | tenant (own) / manager (all) | List bookings |
| PATCH | `/api/community/bookings/:id/approve` | manager+ | Approve pending |
| PATCH | `/api/community/bookings/:id/cancel` | tenant (own) / manager | Cancel |

---

## 4. Maintenance Escalation Path

```
Tenant submits maintenance request via portal
  ↓
Community Manager reviews (JunoCommunity dashboard)
  ↓
Escalation path:
  Level 1: Building Manager → 24h SLA
  Level 2: Community Manager → 48h SLA
  Level 3: Developer warranty (structural/major) → 7-day SLA
  ↓
Status updates pushed to tenant via push notification + email
  ↓
Completion confirmed by community manager with photo evidence
```

---

## 5. Service Charge Tracking

### 5.1 Service Charge Schema

```ts
interface ServiceChargeInvoice {
  id: string;
  unitId: string;
  buildingId: string;
  periodLabel: string;          // e.g. "Q1 2026"
  periodStart: string;
  periodEnd: string;
  amountAED: number;
  vatAED: number;               // 5% if applicable
  totalAED: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'disputed';
  paidAt?: string;
  paidAmountAED?: number;
  paymentRef?: string;
}
```

### 5.2 Arrears Escalation

| Overdue Days | Action |
|-------------|--------|
| 1–30 | Reminder email + portal banner |
| 31–60 | Manager call task created |
| 61–90 | Formal notice letter via Henry doc generation |
| 90+ | Escalate to legal (Evangeline module) |

---

## 6. Community Events Calendar

```ts
interface CommunityEvent {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  maxCapacity: number | null;
  rsvpDeadline: string | null;
  rsvpCount: number;
  rsvps: Array<{ tenantId: string; name: string; rsvpAt: string }>;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}
```

**RSVP flow:** Tenant clicks "Attend" in portal → RSVP recorded → Confirmation email sent → Capacity check (reject if full) → Reminder 24h before event.

---

## 7. Community Manager KPI Dashboard

| KPI | Formula | Target |
|-----|---------|--------|
| Open maintenance requests | count(status='open') | < 10 per building |
| Avg resolution time | avg(resolvedAt - createdAt) hours | < 48h |
| Resident satisfaction score | avg(tenantRating) | ≥ 4.2 / 5 |
| Facility booking utilisation | bookings / available_slots × 100 | ≥ 60% |
| Service charge collection rate | paid_units / total_units × 100 | ≥ 95% |
| Announcement read rate | readCount / targetResidents × 100 | ≥ 70% |

---

## 8. Validation Rules

| Rule | Logic | Error |
|------|-------|-------|
| Booking conflict | No overlapping confirmed bookings for same facility | 409 |
| Capacity limit | `attendeeCount > facility.capacity` | 422 |
| Advance booking | `startAt > now + maxAdvanceBookingDays` | 422 |
| Cancellation window | `startAt - now < 4h` → block self-cancel | 422 |
| Service charge dispute | Requires `reason` field (min 20 chars) | 400 |

---

## 9. Failure and Edge Handling

| Scenario | Handling |
|----------|----------|
| Booking approved after slot expires | Nightly cron marks as `completed`, no action needed |
| Push notification fails | Fall back to email, log failure |
| Manager approval timeout (24h) | Auto-confirm if `requiresApproval = false`, else re-notify |
| Service charge payment partial | Record `paidAmountAED`, flag as `pending_balance` |

---

## 10. Security & Compliance Controls

- Tenants can only view announcements and bookings for their building
- Managers can manage all buildings in their portfolio only
- No financial data (service charges) exposed in public portal — auth required
- Service charge invoices served as PDFs via Henry doc generation (secure download)

---

## 11. UX States (Mobile + RTL)

| State | Display |
|-------|---------|
| Announcement — urgent | Red banner at top of community tab |
| Facility — fully booked | Slot shown as greyed out, "Unavailable" label |
| Booking — pending approval | Yellow chip "Awaiting Approval" |
| Service charge overdue | Red badge on "My Bills" tab, AED amount in red |
| Event RSVP closed | Button disabled "Registration Closed" |
| RTL (Arabic) | Announcement body renders RTL, facility calendar mirror-flipped |
| Mobile 375px | Announcements as stacked cards, facility calendar as weekly list view |

---

## 12. Tests

| Test | Type | Target |
|------|------|--------|
| Booking conflict rejected | Unit | conflict check |
| Announcement scoped to floor delivered only to floor tenants | Unit | targeting logic |
| RSVP closes at maxCapacity | Unit | capacity check |
| Service charge overdue triggers reminder email | Integration | cron + email |
| Manager approval email sent within 1min | Integration | event handler |
| Tenant sees only own building's data | Integration | RBAC scope |

---

## 13. Rollback / Migration Plan

- All schema fields are additive — existing data unaffected
- Building module flag (`hasCommunityModule`) defaults to `false` — no impact on existing buildings
- Facility booking table independent of core lead/property tables — safe to roll back independently