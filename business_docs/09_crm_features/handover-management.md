# Handover Management — Business Specification

**Owner:** @Maya | **Tool:** Groq Console (Llama 3.1 70B)
**Purpose:** VestaHandover module for snagging checklists, punch list tracking and keys issuance log.
**Status:** ✅ Expanded by @Maya.

CONSUMES←@Booking: business_docs/09_crm_features/viewings.md#handover-triggers
FEEDS→@Hedy: business_docs/09_crm_features/handover-management.md#audit-events

---

## 1. Overview

VestaHandoverCRM manages the complete unit handover process from the developer to the buyer/tenant. It covers snagging (defect inspection), punch list tracking, access item issuance, utility connection, and the final handover completion certificate.

**Key Capabilities:**
- Snagging checklist with photo attachments (pass/fail/punch per item)
- Snagging report PDF generation (RERA-standard, defects list + photos)
- Punch list tracking from defect identification to sign-off
- Keys and access items issuance log with serial numbers
- DEWA connection tracker
- Handover completion certificate PDF

---

## 2. Snagging Checklist Template

### Checklist Categories

| Category | Example Items | Status Options |
|---|---|---|
| Walls & Ceilings | Paint quality, cracks, damp patches | `pass` / `fail` / `punch` |
| Flooring | Tiles cracked/loose, grout consistency, levelness | `pass` / `fail` / `punch` |
| Doors & Windows | Frame alignment, seals, lock operation, glass clarity | `pass` / `fail` / `punch` |
| Plumbing | Water pressure, drainage speed, no leaks, hot water | `pass` / `fail` / `punch` |
| Electrical | Socket operation, breaker panel, light switches, earthing | `pass` / `fail` / `punch` |
| HVAC | AC cooling efficiency, filter condition, thermostat | `pass` / `fail` / `punch` |
| Kitchen Appliances | Oven, hob, exhaust, dishwasher, fridge (if included) | `pass` / `fail` / `punch` |
| Bathroom Fittings | Shower pressure, basin seal, toilet flush, mirror | `pass` / `fail` / `punch` |

### Photo Attachment
- Max 5 photos per checklist item (JPEG/PNG, max 10MB each)
- Stored: `uploads/handovers/{handoverId}/snagging/{itemId}_{n}.jpg`
- Displayed as thumbnail gallery in punch list

### Data Schema
```prisma
model HandoverInspection {
  id           String   @id @default(cuid())
  handoverId   String
  category     String
  itemName     String
  status       String   // pass/fail/punch
  notes        String?
  photos       String[]
  inspectedBy  String
  inspectedAt  DateTime @default(now())
}
```

---

## 3. Punch List Tracking and Sign-Off Workflow

### Punch List Lifecycle
```
Defect identified (status: fail/punch)
  → Developer assigned (assignedTo: developerContactId)
  → Fix deadline set (RERA: 30 days from snagging date)
  → Developer marks fixed
  → Re-inspection scheduled (via /api/viewings, type: snagging_reinspection)
  → Agent re-inspects → status: pass
  → Signed off (agent + buyer signature via e-sign)
```

### Escalation
If developer does not respond within **15 days** → automatic WhatsApp to buyer + task to agent → flag for RERA dispute if unresolved at day 30.

### API Contract
```
GET /api/handovers/:id/punch-list → list all punch items
PATCH /api/handovers/punch-list/:itemId → update status, notes
POST /api/handovers/punch-list/:itemId/reinspection → schedule re-inspection
```

---

## 4. Handover Appointment Workflow

Linked to `/api/viewings` (type: `property_handover`):
- **Attendees:** Buyer + agent + developer rep + optional snagging specialist
- **Duration:** 2–4 hours depending on unit size
- **Pre-appointment checklist auto-generated:** Keys retrieved from safe, power + water active, unit cleaned
- **Post-appointment:** Snagging report PDF generated and sent to buyer

---

## 5. Keys & Access Items Issuance Log

| Item | Fields |
|---|---|
| Unit keys | Quantity, serial numbers, issued to (name), issued at (datetime) |
| Mailbox key | Key number, issued |
| Parking remote | Serial, bay number, issued |
| Access card (building) | Card ID, issued |
| Gate fob | Serial, issued |
| Storage locker key | Locker number, key serial, issued |

**API:**
```
POST /api/handovers/:id/keys → log key issuance
GET  /api/handovers/:id/keys → list issued items
PATCH /api/handovers/:id/keys/:itemId → update return status
```

**Missing item alert:** If any item not issued → warning in handover completion screen.

---

## 6. DEWA Connection Tracker

| Field | Description |
|---|---|
| `applicationDate` | Date buyer submitted DEWA connection form |
| `dewReferenceNumber` | DEWA portal reference |
| `meterNumber` | Physical meter ID |
| `activationDate` | Date power/water activated |
| `status` | `pending` / `submitted` / `active` / `reconnection_required` |

**DEWA connection is prerequisite for handover completion** — completion certificate blocked if `status ≠ active`.

---

## 7. Handover Completion Certificate

**Generated via Puppeteer PDF — A4 bilingual format:**
- Property address + unit details
- Buyer name + Emirates ID
- Inspection date + inspector name
- Punch list summary (N items raised, N resolved, N outstanding)
- Keys issued checklist
- DEWA meter number + activation date
- Buyer and agent signature blocks (via e-signature)
- White Caves stamp + date

**Stored:** `uploads/handovers/{handoverId}/completion_certificate.pdf`
**Download:** `GET /api/handovers/:id/certificate`

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Snagging checklist PDF includes all fail items | Integration |
| Punch list 30-day escalation email triggered | Integration |
| Completion cert blocked if DEWA not active | Unit |
| Keys issuance log records all serial numbers | Unit |
| Re-inspection creates viewings slot | Integration |
| Completion cert e-signature flow | Integration |

---

## 9. Observability / Metrics

| Metric | Dashboard |
|---|---|
| Average days from snagging to sign-off | Handover KPI tile |
| Open punch items by developer | Bar chart |
| Handovers completed this month | KPI tile |
| DEWA pending > 14 days | Alert badge |

---

## 10. Rollback / Migration

- `HandoverInspection` + `HandoverKeys` + `HandoverDewa` models added via Prisma migrate
- Certificate PDFs stored in `uploads/` (excluded from git)
- Rollback: reverse migration, no data loss for in-progress handovers (soft archive)