# Maintenance Management — Business Specification

**Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** Tenant maintenance request system with contractor assignment, SLA tracking and landlord approval.
**Status:** ✅ Expanded by @Corinne.

CONSUMES←@Jaime: business_docs/09_crm_features/whatsapp-integration.md#ai-routing
FEEDS→@Rachel: business_docs/09_crm_features/ai-chat.md#search-intent-signals

---

## 1. Overview

The Maintenance Management module handles the full lifecycle of tenant maintenance requests — from submission (portal or WhatsApp) through contractor assignment, landlord cost approval, work completion, and tenant rating. It enforces SLA response times based on priority and alerts stakeholders on breaches.

**Key Capabilities:**
- Multi-channel submission (tenant portal form, WhatsApp bot, agent manual entry)
- AI-powered priority classification from description text
- Approved contractor pool with category-based assignment
- SLA breach alerting with escalation chain
- Landlord cost approval for repairs > AED 500
- Tenant satisfaction rating on resolution

---

## 2. Maintenance Request Schema

```prisma
model MaintenanceTicket {
  id                    String   @id @default(cuid())
  propertyId            String
  tenantId              String
  landlordId            String
  agentId               String
  category              String   // plumbing/electrical/HVAC/structural/appliance/pest/other
  priority              String   // emergency/high/medium/low
  description           String
  photos                String[] // max 5 URLs
  status                String   @default("open")
  // open/assigned/scheduled/in_progress/completed/cancelled
  assignedContractorId  String?
  scheduledAt           DateTime?
  resolvedAt            DateTime?
  resolutionNotes       String?
  tenantRating          Int?     // 1-5
  tenantRatingNote      String?
  invoiceAmount         Float?
  invoiceApproved       Boolean  @default(false)
  invoiceApprovedAt     DateTime?
  slaBreach             Boolean  @default(false)
  slaBreachAlertedAt    DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  @@index([propertyId, status])
  @@index([tenantId, status])
}
```

---

## 3. Priority Classification

### Auto-Classification Rules (keyword matching)
| Keywords | Priority | SLA |
|---|---|---|
| "water leak", "flood", "fire", "gas", "no power" | `emergency` | 4 hours |
| "broken AC", "no hot water", "broken lock", "lift broken" | `high` | 24 hours |
| "tap dripping", "door stiff", "light flickering" | `medium` | 72 hours |
| "light bulb", "paint scratch", "loose hinge" | `low` | 7 days |

**AI enhancement:** If NinaChatbot collects request via WhatsApp, the description is passed to `/api/ai-chat` for intent classification → `maintenancePriority` returned and stored.

**Manual override:** Agent can change priority; override reason logged in audit trail.

---

## 4. Contractor Assignment

### Approved Contractor Pool
```prisma
model Contractor {
  id           String @id @default(cuid())
  name         String
  phone        String
  email        String
  categories   String[]  // categories they handle
  isActive     Boolean  @default(true)
  rating       Float    @default(0)
  completedJobs Int     @default(0)
}
```

**Assignment Logic:**
1. Filter contractors by `category` match
2. Filter by `isActive = true`
3. Sort by: highest rating → then fewest jobs today (load-balancing)
4. Agent confirms assignment (or system auto-assigns for emergency)
5. Contractor notified via WhatsApp template: "New job assigned: {category} at {address}. Contact: {tenantPhone}"

### Work Order PDF
Generated on assignment:
- Ticket ID, property address, tenant contact, description, photos (first 3), scheduled date/time
- Contractor signature block on completion
- Stored: `uploads/maintenance/{ticketId}/work_order.pdf`

---

## 5. SLA Breach Alerting

| Priority | SLA | Breach Alert Recipients | Escalation Alert |
|---|---|---|---|
| Emergency | 4h | Agent + Landlord immediately | Manager at 2h no contractor assigned |
| High | 24h | Agent + Landlord | Manager at 12h |
| Medium | 72h | Agent | Manager at 48h |
| Low | 7 days | Agent | Manager at 5 days |

**Breach alert channels:** WhatsApp template + CRM in-app notification
**SLA clock starts:** On ticket creation (not contractor assignment)

---

## 6. Landlord Cost Approval

**Threshold:** Repairs estimated at > AED 500 require landlord approval before contractor proceeds.

**Workflow:**
1. Contractor submits quote (amount) via CRM portal or agent manual entry
2. If `invoiceAmount > 500`: WhatsApp sent to landlord with description + quote
3. Landlord replies "APPROVE" or "REJECT" (parsed by webhook) — or approves via portal button
4. On APPROVE: `invoiceApproved = true`, contractor can proceed
5. On REJECT: ticket status → `awaiting_landlord_decision`; agent notified to negotiate
6. Auto-approve emergency tickets regardless of cost (agent notified)

**WhatsApp Template (Utility):**
```
"Maintenance required at {propertyAddress}: {description}. 
Contractor quote: AED {amount}. 
Reply APPROVE or REJECT, or login to portal: {portalLink}"
```

---

## 7. Completion and Rating

**On ticket completion:**
1. Contractor or agent marks status → `completed`
2. Resolution notes required (mandatory)
3. WhatsApp sent to tenant: "Your maintenance request #{ticketId} has been resolved. How would you rate the service? Reply 1-5"
4. Tenant rating stored; contractor's average rating updated
5. If rating ≤ 2 → task created for agent to follow up

**API:**
```
POST /api/maintenance → create ticket
GET  /api/maintenance?propertyId=&status= → list tickets
GET  /api/maintenance/:id → ticket detail
PATCH /api/maintenance/:id → update status/assign/resolve
POST /api/maintenance/:id/approve → landlord cost approval
POST /api/maintenance/:id/rate → tenant rating
```

---

## 8. UX States (Mobile-First)

| State | Message | Action |
|---|---|---|
| Submitting | "Submitting request…" + spinner | Disable submit |
| Submitted | "Ticket #{id} created. We'll contact you within {sla}" | Add to My Requests list |
| Contractor assigned | "Contractor {name} has been assigned. Contact: {phone}" | Show contractor card |
| Completed | "Resolved ✅ — How was the service? [1-5 stars]" | Rating widget |
| SLA breach (agent view) | "⚠️ SLA breached — {priority} ticket overdue" | Red badge on ticket |
| Mobile 375px | Tabbed view: Open / In Progress / Completed | Floating "New Request" button |

---

## 9. Unit / Integration Tests

| Test | Coverage |
|---|---|
| "water leak" description → emergency priority | Unit |
| SLA breach email at 4h for emergency | Integration |
| Invoice > AED 500 → landlord WhatsApp sent | Integration |
| Contractor assigned → work order PDF generated | Integration |
| Tenant rating updates contractor average | Unit |
| Emergency auto-approve bypasses cost approval | Unit |

---

## 10. Observability / Metrics

| Metric | Dashboard |
|---|---|
| Open tickets by priority | KPI tiles (red/orange/yellow/green) |
| Average resolution time (all time / this month) | Line chart |
| SLA breach rate | % gauge |
| Tenant satisfaction score | Average stars |
| Most common categories | Bar chart |