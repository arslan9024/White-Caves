# Prospecting and Outbound — Business Specification

**Owner:** @Mary | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** HunterProspecting module for cold-call campaigns, click-to-call logging and DNC registry.
**Status:** ✅ Expanded by @Mary.

CONSUMES←@Anima: business_docs/09_crm_features/secondary-sales.md#pipeline-rules
FEEDS→@Invoice: business_docs/09_crm_features/sentinel-property.md#inventory-finance-bridge

---

## 1. Overview

HunterProspectingCRM enables the sales team to run structured outbound campaigns targeting property owners, expired listing holders, and referral networks. It provides click-to-call integration, outcome logging, territory assignment, and a strict Do-Not-Contact (DNC) registry to ensure compliance with UAE telecommunications regulations.

---

## 2. Prospect Database Fields

```prisma
model Prospect {
  id              String   @id @default(cuid())
  name            String
  phone           String   @unique
  email           String?
  areaOwned       String?
  building        String?
  unitNumber      String?
  source          String   // DLD_ownership|expired_listing|referral|cold_call_list|social_media
  assignedAgentId String?
  lastContactDate DateTime?
  status          String   @default("new")
  // new|contacted|interested|not_interested|callback_requested|DNC
  dncFlag         Boolean  @default(false)
  dncAddedAt      DateTime?
  dncReason       String?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@index([assignedAgentId, status])
  @@index([dncFlag])
}
```

**Source types:**
- `DLD_ownership` — imported from DLD public ownership data (owners who may want to sell/rent)
- `expired_listing` — scraped from PropertyFinder/Bayut (listings that have expired)
- `referral` — recommended by existing client
- `cold_call_list` — purchased data list (must have consent verification note)
- `social_media` — inbound from LinkedIn, Instagram enquiry

---

## 3. Prospecting Campaign Workflow

**Campaign creation:**
1. Manager creates campaign: target criteria (area, source type, status filters)
2. Prospects matching criteria → added to campaign via bulk query
3. Territory assignment: prospects distributed by area/building to agents
4. Agents notified: "You have 25 new prospects in JVC for this week's campaign"

**Agent calling flow:**
1. Agent opens Prospecting tab → sees list of assigned prospects sorted by priority
2. Call script displayed (auto-loaded based on prospect source type)
3. Click-to-call: phone number displayed as `<a href="tel:{phone}">` link; click opens device dialer or softphone
4. Outcome logged immediately (mandatory before next prospect):

| Outcome | Next Action | Stage Update |
|---|---|---|
| Answered + interested | Schedule callback / book viewing | `interested` |
| Answered + not interested | Log + close for this campaign | `not_interested` |
| Voicemail | Schedule WhatsApp fallback in 4h | `contacted` |
| No answer | Schedule retry in 24h (max 3 attempts) | `contacted` |
| DNC requested | Add to DNC registry immediately | `DNC` |

---

## 4. Call Tracking

**Click-to-call integration:**
```ts
// Frontend: opens native dialer or VoIP (Twilio/3CX if configured)
const handleCallClick = (phone: string, prospectId: string) => {
  logCallAttempt(prospectId); // POST /api/prospecting/{id}/calls
  window.location.href = `tel:${phone}`;
};
```

**Call log schema:**
```prisma
model ProspectCall {
  id           String   @id @default(cuid())
  prospectId   String
  agentId      String
  calledAt     DateTime @default(now())
  outcome      String   // answered|voicemail|no_answer|dnc_requested
  durationSecs Int?
  recordingUrl String?  // if VoIP integration active
  notes        String?
}
```

**VoIP integration (optional):** If `TWILIO_ENABLED=true`, calls routed via Twilio with automatic duration logging and recording URL stored.

---

## 5. Post-Call Automation

**On voicemail/no-answer:**
- Cron (15-minute intervals) checks: `lastContactDate < now() - 4h AND status = 'contacted' AND callOutcome = 'voicemail'`
- Triggers: `send_whatsapp_template` → "Hi {name}, I tried calling you earlier regarding your property at {building}. When would be a good time to chat? — {agentName}, White Caves Real Estate"

**On callback requested:**
- Creates task in agent CRM: "Call back {name} at {phone} — requested callback"
- Due: `requestedCallbackTime` if provided, else next business day 10:00 GST

---

## 6. Prospecting KPIs

**Route:** `GET /api/prospecting/kpis?agentId=&campaignId=&period=week|month`

| KPI | Formula |
|---|---|
| Calls per agent per day | Total calls / working days |
| Connect rate % | Answered / Total attempts × 100 |
| Interest rate % | Interested / Answered × 100 |
| Pipeline value generated AED | Sum of deal values for prospects that became leads |
| DNC rate % | DNC requested / Total calls × 100 (target < 2%) |

---

## 7. Do-Not-Contact Registry

**DNC rules (UAE Telecom Regulatory Authority compliance):**
- Any prospect who requests DNC must be added **immediately** (same call)
- DNC agents cannot be assigned to any outbound prospecting campaign
- DNC registry checked before every call attempt (prevents accidental contact)
- DNC export available for compliance audit

```
POST /api/prospecting/:id/dnc → add to DNC (reason required)
GET  /api/prospecting/dnc → list all DNC records
GET  /api/prospecting/dnc/export → CSV export
```

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| DNC flag blocks assignment to campaign | Unit |
| Voicemail outcome triggers WhatsApp in 4h | Integration |
| Connect rate KPI calculated correctly | Unit |
| Bulk territory assignment distributes evenly | Unit |
| DNC export includes all flagged records | Integration |
| 3rd no-answer → prospect status not_interested | Unit |

---

## 9. Security & Compliance

- Prospect data sourced legally (DLD public data, consent-based lists only)
- Cold-call lists must have consent verification note uploaded before import
- All call logs retained for 1 year (TRA requirement)
- DNC registry immutable — no delete; only admin can reverse with manager approval + audit log entry
- PDPL Art 4: data minimisation — collect only phone, name, property reference for cold outreach