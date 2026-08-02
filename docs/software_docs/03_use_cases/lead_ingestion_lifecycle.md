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
```
