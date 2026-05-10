# Follow-Up Automation — Business Specification

**Owner:** @Hedy | **Tool:** Groq Console (Llama 3.1 70B)
**Purpose:** Automated sequence engine for lead nurture, lease renewal reminders and post-viewing flows.
**Status:** ✅ Expanded by @Hedy.

CONSUMES←@Maya: business_docs/09_crm_features/handover-management.md#audit-events
FEEDS→@Cassie: business_docs/09_crm_features/audit-trail.md#kpi-events

---

## 1. Overview

The Follow-Up Automation engine enables agents and managers to define multi-step sequences that automatically send WhatsApp messages, emails, or create tasks based on CRM triggers. It replaces manual follow-up tracking and ensures no lead or renewal falls through the cracks.

**Key Capabilities:**
- Visual sequence builder with trigger + action steps
- Pre-built sequence templates for common workflows
- Opt-out on any manual agent activity (pause sequence automatically)
- Cron-driven execution engine (every 15 minutes)
- Effectiveness analytics per sequence template

---

## 2. Sequence Builder — Triggers and Actions

### Trigger Types
| Trigger | Parameters | Example |
|---|---|---|
| `lead_stage_changed` | fromStage, toStage | Lead moves to "Viewed" → trigger post-viewing sequence |
| `x_days_since_last_contact` | days | 7 days of silence → trigger re-engagement |
| `lease_expiry_approaching` | daysBeforeExpiry | 90/60/30/7 days before lease end |
| `viewing_completed` | — | Viewing status → completed |
| `offer_rejected` | — | Offer status → rejected |
| `payment_overdue` | daysPastDue | Rent not received after X days |

### Action Types
| Action | Config |
|---|---|
| `send_whatsapp_template` | templateId, variables |
| `send_email` | templateId, subject, variables |
| `create_task` | title, dueInDays, assignTo: 'lead_agent'|'manager' |
| `add_crm_note` | noteText |
| `update_lead_stage` | newStage |
| `notify_agent` | message (in-app notification) |

### Data Schema (Prisma)
```prisma
model FollowUpSequence {
  id          String   @id @default(cuid())
  name        String
  triggerType String
  triggerConfig Json
  steps       Json[]   // ordered array of { delayDays, action, actionConfig }
  isActive    Boolean  @default(true)
  createdBy   String
  createdAt   DateTime @default(now())
}

model FollowUpEnrollment {
  id           String   @id @default(cuid())
  sequenceId   String
  leadId       String
  currentStep  Int      @default(0)
  status       String   @default("active")  // active/paused/completed/opted_out
  nextActionAt DateTime
  pausedReason String?
  enrolledAt   DateTime @default(now())
  completedAt  DateTime?
}
```

---

## 3. Pre-Built Sequence Templates

### Template A — New Lead 7-Day Nurture
```
Step 1 (Day 0):  send_whatsapp_template → "Hi {leadName}! I'm {agentName} from White Caves..."
Step 2 (Day 1):  send_whatsapp_template → Send 3 matched property suggestions
Step 3 (Day 3):  create_task → "Follow-up call to {leadName}" (due same day)
Step 4 (Day 5):  send_email → Market report for {leadArea}
Step 5 (Day 7):  send_whatsapp_template → "Still looking? We have new listings in {area}..."
```

### Template B — Lease Renewal 90-Day Sequence
```
Day -90: send_whatsapp_template → "Your lease expires on {expiryDate}. Interested in renewing?"
Day -60: send_email → Renewal offer letter with new rent (per RERA index)
Day -30: create_task → "Call {tenantName} to confirm renewal decision"
Day -7:  send_whatsapp_template → "Final reminder: lease ends in 7 days. Action required."
Day 0:   notify_agent → "Lease expired — no renewal confirmed for {propertyAddress}"
```

### Template C — Post-Viewing Nurture
```
Step 1 (30 min after viewing): send_whatsapp_template → Send property brochure PDF
Step 2 (Day 2): create_task → "Follow-up call — gauge interest level"
Step 3 (Day 5): send_whatsapp_template → "Did {propertyAddress} meet your requirements?"
Step 4 (Day 10): send_email → Similar properties in same area
```

---

## 4. Execution Engine

**Cron Schedule:** Every 15 minutes (`*/15 * * * *`)

```ts
// server/cron/followUpEngine.ts
async function processFollowUpQueue(): Promise<void> {
  const due = await prisma.followUpEnrollment.findMany({
    where: {
      status: 'active',
      nextActionAt: { lte: new Date() },
    },
    include: { sequence: true, lead: true },
  });

  for (const enrollment of due) {
    const step = enrollment.sequence.steps[enrollment.currentStep];
    await executeAction(step, enrollment.lead);
    await advanceOrComplete(enrollment);
  }
}
```

**Opt-Out on Agent Activity:**
- Any manual agent action (message sent, call logged, note added) for an enrolled lead → set `enrollment.status = 'paused'`, `pausedReason = 'agent_manual_activity'`
- Agent can resume from CRM UI
- If lead converted (stage = Closed Won) → `status = 'opted_out'`

---

## 5. Effectiveness Analytics

**Route:** `GET /api/follow-ups/analytics?sequenceId=&dateRange=`

**Metrics per sequence template:**
| Metric | Calculation |
|---|---|
| Enrollment rate | Enrollments / eligible leads triggered |
| Open rate | WhatsApp read receipts / messages sent |
| Reply rate | Replies received / messages sent |
| Conversion rate | Leads that reached Closed Won / total enrolled |
| Avg steps to conversion | Mean step number at conversion |

Displayed in: `AnalyticsDashboard → Follow-Up Sequences` tab.

---

## 6. API Contract

```
POST /api/follow-ups/sequences → create sequence
GET  /api/follow-ups/sequences → list all sequences
PATCH /api/follow-ups/sequences/:id → update / deactivate

POST /api/follow-ups/enroll → manually enroll a lead
PATCH /api/follow-ups/enrollments/:id/pause
PATCH /api/follow-ups/enrollments/:id/resume
GET  /api/follow-ups/enrollments?leadId= → enrollment status for a lead

GET  /api/follow-ups/analytics?sequenceId=
```

---

## 7. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Cron fires and processes due enrollments | Integration |
| Manual agent activity pauses enrollment | Integration |
| Post-viewing template sends brochure WhatsApp | Integration |
| Conversion → opt-out | Unit |
| Renewal sequence 90-day template correct timing | Unit (date logic) |
| Analytics metrics calculated correctly | Unit |

---

## 8. Rollback / Migration

- New DB tables: `FollowUpSequence`, `FollowUpEnrollment` — added via Prisma migration
- Rollback: `prisma migrate reset` on staging; cron job stops if table missing (graceful no-op)
- Pre-built templates seeded via `prisma/seed.ts`