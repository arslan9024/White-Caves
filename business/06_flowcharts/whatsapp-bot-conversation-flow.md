# WhatsApp Bot Conversation Flow

# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-WA-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Phase 4 Design (currently stub — full implementation Phase 4)
> **Owner:** Communications Department (Nina — WhatsApp Bot Developer, Nadia — WhatsApp CRM Manager)
> **Scope:** Inbound message → intent detection → assistant routing → human handoff → follow-up

---

## 1. WhatsApp Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              WHATSAPP CRM ARCHITECTURE                          │
│                                                                 │
│  User Device ──→ Meta Cloud API ──→ Webhook ──→ Nina (Bot)     │
│                                                                 │
│  Response:  Nina (Bot) ──→ MetaAPIClient ──→ Meta ──→ User     │
│                                                                 │
│  Handoff:   Nina ──→ Nadia (Router) ──→ Human Agent CRM Inbox  │
│                                                                 │
│  Env vars:                                                      │
│    WHATSAPP_ACCESS_TOKEN                                        │
│    WHATSAPP_BUSINESS_ACCOUNT_ID                                 │
│    WHATSAPP_PHONE_NUMBER_ID                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Inbound Message Flow

```
User sends WhatsApp to White Caves business number
          │
          ▼
  Meta Cloud API receives message
          │
          ▼
  POST /api/whatsapp/webhook
  {
    type: "message",
    from: "+971501234567",
    body: "Hi, I'm looking for a villa in DAMAC Hills 2",
    timestamp: "..."
  }
          │
          ▼
  [Webhook signature verification]
  crypto.timingSafeEqual(signature, expected)
          │
          ├── Invalid signature → 403 Forbidden (reject)
          │
          ▼
  Mark message as "read" (send read receipt to Meta)
          │
          ▼
  Lookup contact in CRM:
  ├── Known contact → Load existing lead/client context
  └── Unknown contact → Create new lead (source: whatsapp)
          │
          ▼
  Pass to WhatsAppBotService.handleInbound(message)
```

---

## 3. Intent Detection Flow

```
Message received: "Hi, I'm looking for a villa in DAMAC Hills 2"
          │
          ▼
  Nina Bot — Intent Classification:

  ┌──────────────────────────────────────────────────────────────┐
  │ INTENT CATEGORIES                                            │
  │                                                              │
  │ BUY_PROPERTY     "looking to buy", "purchase", "invest"      │
  │ RENT_PROPERTY    "looking to rent", "apartment for rent"     │
  │ SELL_PROPERTY    "I want to sell my villa"                   │
  │ LANDLORD_SERVICE "manage my property", "find tenants"        │
  │ MAINTENANCE      "broken AC", "water leak", "repair"        │
  │ PAYMENT          "pay rent", "payment issue"                 │
  │ DOCUMENT         "Ejari", "lease copy", "NOC"               │
  │ VALUATION        "how much is my property worth"            │
  │ COMPLAINT        "unhappy", "problem", "complaint"          │
  │ GENERAL_INFO     "office hours", "contact", "address"       │
  │ UNRECOGNIZED     → Fallback to menu                         │
  └──────────────────────────────────────────────────────────────┘
          │
          ▼
  Intent: BUY_PROPERTY (confidence: 0.89)
  → Route to Buyer Journey flow
```

---

## 4. Buyer Journey Bot Flow

```
Intent: BUY_PROPERTY
          │
          ▼
  Nina: "Great! I can help you find your perfect property.
         Let me ask a few quick questions 👇"
          │
          ▼
  Step 1 — Property type:
  "What type of property are you interested in?"
  [1] Villa  [2] Townhouse  [3] Apartment  [4] Commercial
          │
          ▼  User replies: "1" or "Villa"
  Step 2 — Budget:
  "What's your budget? (in AED)"
  [1] Under AED 1M  [2] AED 1M–2M  [3] AED 2M–4M  [4] AED 4M+
          │
          ▼
  Step 3 — Timeline:
  "When are you looking to buy?"
  [1] Immediately  [2] 1–3 months  [3] 3–6 months  [4] Just browsing
          │
          ▼
  Summary confirmed:
  "Perfect! I'm looking for:
   ✅ 3–4BR Villa
   ✅ Budget: AED 2M–4M
   ✅ Timeline: 1–3 months

   Connecting you with our specialist now... 🏠"
          │
          ▼
  [Lead created / updated in CRM]
  score += 25 (WhatsApp engagement + details provided)
          │
          ▼
  Routing decision:
  ├── Working hours (9am–7pm Sun–Thu): → Assign to available agent
  └── After hours: → Queue + send "An agent will call you within 2 hours"
```

---

## 5. Human Handoff Flow

```
Bot completes qualification OR user requests human
("speak to agent", "call me", "human please")
          │
          ▼
  Handoff trigger detected
          │
          ▼
  Nadia (Router) — Agent assignment:

  Assignment rules:
  ├── Language preference: Arabic → Arabic-speaking agent first
  ├── Area specialty: DAMAC Hills 2 → specialist agent
  ├── Availability: online + not in active conversation
  └── Round-robin if all equal
          │
          ▼
  Agent notified in CRM:
  ├── CRM notification: "New WhatsApp lead — [Name] — [Intent]"
  ├── WhatsApp notification to agent's own WhatsApp
  └── Full conversation history visible in CRM inbox
          │
          ▼
  User notified:
  "I'm connecting you with [Agent Name], our villa specialist.
   They'll be with you shortly!
   In the meantime, here are our latest listings:
   👉 whitecaves.ae/properties"
          │
          ▼
  Agent responds directly in WhatsApp Business app
  OR via CRM WhatsApp inbox (Phase 4)
          │
          ▼
  All messages logged in:
  ├── WhatsAppConversation record (Phase 4 model)
  └── Lead activity timeline in CRM
```

---

## 6. After-Hours Flow

```
Message received outside 9am–7pm Sun–Thu
          │
          ▼
  Nina: "Thank you for contacting White Caves! 🌙
         Our team is currently offline but will contact you
         first thing tomorrow morning.

         Our office hours are:
         Sunday–Thursday: 9:00 AM – 7:00 PM
         Friday–Saturday: 10:00 AM – 5:00 PM

         Meanwhile, browse our latest listings:
         👉 whitecaves.ae/properties

         For urgent matters, email us:
         hello@whitecaves.ae"
          │
          ▼
  Lead queued with:
  ├── Status: CONTACTED (bot interaction logged)
  ├── Follow-up task created for next morning 9am
  └── Assigned agent notified of queue
          │
          ▼
  9am next business day:
  Auto-reminder to assigned agent: "Follow up: [Name] WhatsApp inquiry"
```

---

## 7. Existing Tenant / Landlord Flow

```
Known contact messages (tenant or landlord in CRM)
          │
          ▼
  Contact identified by phone number
          │
          ├── Tenant:
          │   Nina: "Welcome back, [Name]! How can I help?
          │           [1] Maintenance request
          │           [2] Rent payment
          │           [3] Document (Ejari/lease)
          │           [4] Other"
          │
          ├── Landlord:
          │   Nina: "Welcome back, [Name]! How can I help?
          │           [1] Property status update
          │           [2] Rent received confirmation
          │           [3] Maintenance update
          │           [4] New listing inquiry
          │           [5] Other"
          │
          └── Agent routes to correct self-service action or human
```

---

## 8. Outbound Campaign Flow

```
Marketing campaign triggered (Olivia — Marketing Manager)
          │
          ▼
  Campaign rules (Meta Business Policy):
  ├── Only message users who have previously messaged White Caves
  ├── Use pre-approved message templates (Meta approval required)
  ├── Include clear opt-out option in every message
  └── Rate limit: max 1 campaign message per user per 24 hours
          │
          ▼
  Template messages sent via Meta:
  "Hi [Name]! 👋 New listings matching your criteria just added!
   📍 3BR Villa, DAMAC Hills 2 — AED 2.1M
   📍 4BR Townhouse, DAMAC Hills 2 — AED 2.8M

   Reply VIEW to see details or STOP to unsubscribe."
          │
          ▼
  User responses handled:
  ├── "VIEW" → Nina sends property details + CTA
  ├── "STOP" → User unsubscribed, CRM updated
  └── Other → Intent detection → normal flow
```

---

## 9. WhatsApp Bot Performance SLAs

| Metric                             | Target                        |
| ---------------------------------- | ----------------------------- |
| First response time (inbound)      | < 10 seconds                  |
| Bot qualification completion rate  | > 70%                         |
| Human handoff time (working hours) | < 5 minutes                   |
| Human handoff time (after hours)   | < 2 hours next day            |
| Campaign open rate target          | > 60% (WhatsApp average ~80%) |
| Opt-out rate target                | < 2% per campaign             |

---

## 10. Phase 4 Implementation Requirements

| Component             | Status            | Notes                                     |
| --------------------- | ----------------- | ----------------------------------------- |
| WhatsAppBotService    | Stub (logs only)  | All methods need Meta API integration     |
| MetaAPIClient         | Interface defined | Needs actual HTTP calls to Meta           |
| Webhook endpoint      | Stub              | Signature validation done; routing needed |
| CRM inbox UI          | Not built         | Multi-agent inbox component needed        |
| Intent classification | Not built         | NLP service or keyword matching           |
| Template management   | Not built         | Meta pre-approval workflow needed         |
| Env vars              | Not configured    | WHATSAPP_ACCESS_TOKEN etc. needed         |

---

**Document Owner:** Communications (Nina + Nadia)
**Related:** `business_docs/04_workflows/whatsapp-bot-flowchart.md`, `server/services/WhatsAppBotService.ts`

---

## 9. WhatsApp Campaign Management

### 9.1 Broadcast Campaign Flow (Phase 4)

```
Marketing Manager (or Olivia AI) creates campaign:
├── Target segment: e.g., "Leads in NURTURING with budget > AED 1.5M"
├── Message template: must be WhatsApp approved (24-hour window rule applies)
├── Scheduled send: e.g., Tuesday 10am (avoid Ramadan timing rules)
└── A/B test: 2 message variants (50/50 split)

Approval workflow:
1. Olivia creates draft campaign
2. MD or Marketing Manager reviews and approves
3. Send scheduled
4. WhatsApp Cloud API sends via approved template
5. Delivery confirmed → logged in CRM per lead

Compliance rules:
- Only send to opted-in contacts
- Must include "Reply STOP to unsubscribe"
- Honour unsubscribes within 24 hours
- Maximum 2 marketing campaigns per contact per week
- PDPL: consent must be recorded with timestamp
```

### 9.2 Message Template Categories

| Category           | Content Type                                   | Approval Required | Examples                                                  |
| ------------------ | ---------------------------------------------- | ----------------- | --------------------------------------------------------- |
| **Utility**        | Transaction updates, appointment confirmations | Meta pre-approval | "Your viewing at DAMAC Hills 2 is confirmed for [DATE]"   |
| **Authentication** | OTP, login codes                               | Meta pre-approval | "Your OTP is [CODE]. Do not share this."                  |
| **Marketing**      | Property promotions, market updates            | Meta pre-approval | "New listing: 4-bed villa in DAMAC Hills 2 from AED 2.1M" |

**Meta Template Approval Process:**

1. Submit template in WhatsApp Business Manager
2. Meta reviews within 24–72 hours
3. If rejected: review rejection reason → edit → resubmit
4. Once approved: template is permanent (edits require re-approval)

### 9.3 Conversation Categories (Meta Billing)

Meta charges per 24-hour "conversation window" (not per message):

| Conversation Type            | Rate (approx.)  | Trigger                         |
| ---------------------------- | --------------- | ------------------------------- |
| User-initiated               | $0.005 (lowest) | Customer messages first         |
| Utility (business-initiated) | $0.02           | Appointment, transaction update |
| Authentication               | $0.02           | OTP                             |
| Marketing                    | $0.05–0.08      | Promotional message             |

**Cost estimate at scale:**

- 1,000 new WhatsApp leads/month × $0.005 = $5/month (user-initiated)
- 500 marketing broadcasts/month × $0.06 = $30/month
- Total: ~$50–100/month at Phase 4 launch scale

---

## 10. WhatsApp Analytics Dashboard

### 10.1 Key Metrics to Track

| Metric                        | Measurement                          | Target   | Action if Below                                  |
| ----------------------------- | ------------------------------------ | -------- | ------------------------------------------------ |
| Message delivery rate         | Delivered / sent                     | > 98%    | Check phone number validity; remove bad numbers  |
| Response rate                 | Leads who replied / leads messaged   | > 60%    | Review message quality, timing, personalisation  |
| Opt-out rate                  | STOP replies / messages sent         | < 2%     | Review frequency; improve content quality        |
| Bot-to-human escalation rate  | Escalations / conversations          | < 30%    | Improve bot BANT questions; expand bot knowledge |
| WhatsApp lead-to-viewing rate | Viewings / WA-sourced leads          | > 25%    | Review qualification questions in bot flow       |
| Response time after handoff   | AVG(first agent reply after handoff) | < 1 hour | Monitor agent WhatsApp inbox responsiveness      |

### 10.2 Reporting in CRM

- **Source attribution:** All leads from WhatsApp have `source: "WHATSAPP"` — tracked through full pipeline
- **Campaign attribution:** Campaign-triggered leads tagged with `campaignId` for ROI measurement
- **Bot vs. agent messages:** `Activity.channel` distinguishes `whatsapp_bot` vs. `whatsapp_agent`
- **Conversation export:** Full conversation transcript exportable as PDF for compliance records

---

**Document Owner:** Technology (@Nina — WhatsApp Bot Agent) + Sales (@Harmony — Agent Relations)
**Version History:** v1.0 April 2026; v2.0 April 2026 (campaign management, analytics)
**Related:** `plans/PHASE_4_WHATSAPP.md`, `business/08_compliance/data-privacy-impact-assessment.md`
