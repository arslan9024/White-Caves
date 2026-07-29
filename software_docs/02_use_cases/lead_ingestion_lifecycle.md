# Use Case: Lead Ingestion Lifecycle — End-to-End Pipeline

**Document Class:** UC-001 (Use Case Specification)  
**Module:** CRM — Lead Capture Engine + Nadia WhatsApp Routing  
**Version:** 2026.07-UC-V1  
**Owner:** @Jaime (Productivity Lead) + @Joelle (ML Lead)  
**RUP Phase:** Elaboration Gate Document  
**Last Updated:** 2026-07-29  
**Status:** ✅ Active — Production Aligned

---

## 1. Use Case Overview

| Attribute | Value |
|---|---|
| **Use Case ID** | UC-001 |
| **Name** | Lead Ingestion Lifecycle |
| **Actor(s)** | External Lead Source, System (Nadia AI), Broker, Managing Director |
| **Trigger** | Inbound lead webhook received from Bayut / Property Finder / Website form / WhatsApp DM |
| **Precondition** | Server is healthy; MongoDB Atlas connected; Nadia WhatsApp session authenticated |
| **Postcondition** | Lead created in DB, SLA timer active, broker notified, WhatsApp acknowledgment sent |
| **SLA Contract** | First-response acknowledgment within **15 minutes** of lead creation timestamp |
| **Priority** | P0 — Mission Critical |

---

## 2. Actors & Stakeholders

```
┌──────────────────────────────────────────────────────────────────┐
│                    LEAD INGESTION ACTORS                         │
├──────────────────────┬───────────────────────────────────────────┤
│  External Actors     │  Internal System Actors                   │
├──────────────────────┼───────────────────────────────────────────┤
│  • Property Finder   │  • Webhook Receiver API                   │
│  • Bayut Portal      │  • Lead Deduplication Engine              │
│  • Website Form      │  • Lead Scoring Algorithm (AI)            │
│  • WhatsApp DM       │  • Nadia WhatsApp AI Responder            │
│  • Walk-in Client    │  • Broker Assignment Router               │
│  • Referral Partner  │  • SLA Monitor (15-min clock)             │
│                      │  • Managing Director Notification Pipe    │
└──────────────────────┴───────────────────────────────────────────┘
```

---

## 3. Main Success Scenario (Happy Path)

### Step 1 — Webhook Ingestion
```
TRIGGER: POST /api/leads/webhook
PAYLOAD: {
  source: "property_finder" | "bayut" | "website" | "whatsapp",
  fullName: string,
  email: string,
  phone: string ("+971XXXXXXXXX"),
  intentType: "buy" | "rent" | "invest",
  budgetAED?: number,
  propertyRef?: string,
  message?: string
}
```
- Server validates payload schema (TypeScript strict types, no `any`)
- If `phone` or `email` missing → reject with `400 Bad Request`
- If `source` is not in allowed enum → reject with `422 Unprocessable Entity`

### Step 2 — Deduplication Check
```
Query: db.leads.findOne({ $or: [{ email }, { phone }] })
```
- **Duplicate found:** Update existing lead record's `updatedAt`, append `source` to `tags[]`, log duplicate event → **skip broker assignment** → return `200 OK { duplicate: true }`
- **No duplicate:** Continue to Step 3

### Step 3 — Lead Record Creation
```javascript
const lead = await prisma.lead.create({
  data: {
    fullName,
    email,
    phone,
    source,
    intentType,
    budgetAED: budgetAED ?? null,
    pipelineStage: 'new',
    leadScore: 0,          // to be computed in Step 4
    slaDeadline: new Date(Date.now() + 15 * 60 * 1000), // +15 min
    createdAt: new Date(),
  }
});
```

### Step 4 — AI Lead Scoring
```
Input: { budgetAED, source, intentType, propertyRef, message }
Algorithm: Weighted multi-factor model (0–100 scale)

Scoring Weights:
  Budget ≥ AED 2,000,000   → +30 points
  Budget ≥ AED 1,000,000   → +20 points
  Source = "referral"      → +25 points
  Source = "walk_in"       → +20 points
  intentType = "buy"       → +15 points
  intentType = "invest"    → +10 points
  Has propertyRef          → +10 points
  Phone verified (+971)    → +5 points

Output: leadScore (0–100), stored on lead record
Hot Lead Threshold: leadScore ≥ 75
```

### Step 5 — Broker Assignment Routing
```
ALGORITHM: Round-robin with priority override
INPUT: lead.intentType, lead.budgetAED, lead.source

1. If budgetAED ≥ AED 5,000,000 → assign to Senior Broker pool (Level 3+)
2. If source = "referral" → assign to referring broker's designated account
3. If intentType = "invest" → assign to Investment Desk pool
4. Default → next available broker in round-robin queue

RESULT: lead.assignedBrokerId = <selected broker ObjectId>
```

### Step 6 — SLA Timer Activation
```
slaDeadline = lead.createdAt + 15 minutes

SLA Monitor checks every 60 seconds:
  IF now > slaDeadline AND pipelineStage === 'new':
    → Escalate: notify assignedBroker + department head
    → Flag lead with tag: "SLA_BREACHED"
    → Log to analytics: sla_breach_count++
```

### Step 7 — Nadia WhatsApp AI Acknowledgment
```
TRIGGER: Lead created successfully (Step 3 complete)
CHANNEL: WhatsApp Business API (via wwebjs / official Business API)

MESSAGE TEMPLATE: "nadia_lead_acknowledgment_v2"
CONTENT:
  "Hi {firstName}! 👋 This is Nadia from White Caves Real Estate.
   Thank you for your interest in {propertyRef or 'Dubai properties'}.
   I'll connect you with one of our expert consultants within the next
   few minutes. 🏙️ Feel free to share more about what you're looking for!"

FALLBACK (if WhatsApp fails): Send email acknowledgment via SMTP
TIMEOUT: 30 seconds → if no delivery receipt, log to error queue
```

### Step 8 — Broker CRM Notification
```
CHANNEL: In-app notification (WebSocket push) + Email
RECIPIENT: assignedBroker + department head (if leadScore ≥ 75)

NOTIFICATION PAYLOAD:
  type: "new_lead_assigned"
  leadId: <ObjectId>
  leadName: fullName
  leadScore: <0–100>
  slaDeadline: <ISO timestamp>
  source: <source>
  budgetAED: <formatted>
```

### Step 9 — Managing Director Visibility
```
TRIGGER: leadScore ≥ 90 (Hot Whale Alert)

MD ALERT PAYLOAD:
  dashboard: ExecutiveFlightDeckView
  metric_tile: "HOT LEAD ALERT"
  data: { leadName, budgetAED, source, assignedBroker }
  color: #EF4444 (White Caves Red pulse animation)
```

---

## 4. Alternative Paths

### 4A — Manual Walk-in Lead Entry
- Broker opens Lead Creation form in CRM
- Fills in lead data manually
- System skips webhook validation (Step 1)
- Continues from Step 2 (Deduplication)
- `source` forced to `"walk_in"`

### 4B — WhatsApp DM Lead Capture (Nadia Direct Routing)
- Client messages Nadia's WhatsApp number
- Nadia AI extracts structured intent via NLP
- Synthesized lead payload submitted to Step 1 webhook internally
- `source` = `"whatsapp"`, `assignedBrokerId` = Nadia's virtual broker slot

### 4C — Property Finder / Bayut Webhook (External Portal)
- Portal sends webhook to `/api/leads/webhook?source=property_finder`
- Payload schema varies by portal (adapter maps to canonical format)
- Portal-specific reference ID stored in `tags[]` for cross-reference

---

## 5. Exception & Error Scenarios

| Scenario | System Response |
|---|---|
| Invalid phone format | `400` — `"Phone must be in format +971XXXXXXXXX"` |
| Duplicate lead (same email + phone) | `200` — Update existing, skip reassignment |
| WhatsApp session disconnected | Log error → fallback to email acknowledgment |
| MongoDB write timeout | `503` — Retry up to 3 times with exponential backoff |
| Broker pool empty | Assign to Managing Director's queue as fallback |
| AI scoring service timeout | Default score of 50 applied; log warning |

---

## 6. Data Contracts

### Inbound Webhook Schema (TypeScript)
```typescript
interface LeadWebhookPayload {
  source: 'bayut' | 'property_finder' | 'website' | 'whatsapp' | 'referral' | 'walk_in';
  fullName: string;
  email: string;
  phone: string;                  // "+971XXXXXXXXX"
  intentType: 'buy' | 'rent' | 'invest' | 'inquire';
  budgetAED?: number;             // optional
  propertyRef?: string;           // optional property code
  message?: string;               // optional message body
  referredBy?: string;            // optional broker ID for referrals
  portalLeadId?: string;          // external portal reference
}
```

### Lead Record Created (Database)
```typescript
interface LeadRecord {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  source: LeadSource;
  intentType: LeadIntent;
  budgetAED: number | null;
  assignedBrokerId: string;
  pipelineStage: PipelineStage;
  leadScore: number;              // 0–100
  slaDeadline: Date;              // createdAt + 15 min
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. SLA Performance Metrics

| Metric | Target | Alert Threshold |
|---|---|---|
| First-response time | ≤ 15 minutes | > 15 min = SLA breach |
| WhatsApp delivery rate | ≥ 98% | < 95% = incident |
| Webhook processing latency | ≤ 500ms | > 2s = P1 alert |
| Lead deduplication accuracy | ≥ 99.5% | < 99% = P1 alert |
| Hot lead (≥75) broker assignment | ≤ 2 minutes | > 5 min = escalation |

---

## 8. Acceptance Criteria

```
[ ] POST /api/leads/webhook returns 201 for valid payload
[ ] Duplicate lead (same email) returns 200 with { duplicate: true }
[ ] leadScore computed within 2 seconds of creation
[ ] slaDeadline set to exactly createdAt + 900000ms (15 minutes)
[ ] WhatsApp acknowledgment sent within 30 seconds of lead creation
[ ] Assigned broker receives in-app notification within 5 seconds
[ ] Hot leads (score ≥ 75) appear on MD flight deck within 10 seconds
[ ] SLA breach triggers escalation notification at t+15min+1sec
```

---

*This use case is governed by `software_docs/core_engineering_manifest.md`. Business domain rules (RERA compliance for lead data retention) are documented in `business_docs/04_workflows/lead-qualification-guide.md`.*
