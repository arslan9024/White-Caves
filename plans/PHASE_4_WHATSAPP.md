# Phase 4 — WhatsApp Real Integration

> **Priority**: #4 — High (after Phase 3)
> **Goal**: Replace all WhatsApp stubs with live Meta Cloud API connections; deliver Nina bot and Olivia campaigns
> **Prerequisite**: Phase 3 (Full CRM Super User) must be complete
> **Status**: 🔲 Not Started — `WhatsAppBotService.ts` is fully stubbed (log-only)
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-4--whatsapp-real-integration-after-phase-3) for the summary

---

## Why This Is Phase 4

WhatsApp is White Caves' primary client communication channel in the UAE. Once the CRM is
working for the managing director (Phase 3), activating real WhatsApp messaging unlocks:

- Inbound lead capture from WhatsApp (replaces manual entry)
- Automated first-response bot (Nina) for 24/7 coverage
- Broadcast campaigns (Olivia) to prospects and existing clients

---

## External Dependencies (Required Before Starting)

| Dependency                     | Owner         | Notes                          |
| ------------------------------ | ------------- | ------------------------------ |
| Meta Business WABA account     | Business team | Apply at business.facebook.com |
| WhatsApp Business phone number | Business team | Must be approved by Meta       |
| `WHATSAPP_ACCESS_TOKEN`        | DevOps        | Set in Vercel + `.env`         |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | DevOps        | From Meta Business Manager     |
| `WHATSAPP_PHONE_NUMBER_ID`     | DevOps        | From Meta WhatsApp Manager     |

> **Note**: `WhatsAppBotService.ts` already reads `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, and `WHATSAPP_PHONE_NUMBER_ID` via `MetaAPIClient`. Env vars just need to be populated with real values.

---

## What Already Exists ✅

| Item                                  | Location                                     | Status                         |
| ------------------------------------- | -------------------------------------------- | ------------------------------ |
| `WhatsAppBotService.ts`               | `server/services/WhatsAppBotService.ts`      | ✅ Exists — stubbed (log-only) |
| `MetaAPIClient`                       | `server/services/MetaAPIClient.ts`           | ✅ Exists — HTTP client ready  |
| `NadiaConversation` Prisma model      | `prisma/schema.prisma`                       | ✅ Exists                      |
| `NadiaMessage` Prisma model           | `prisma/schema.prisma`                       | ✅ Exists                      |
| `NadiaConversationQueue` Prisma model | `prisma/schema.prisma`                       | ✅ Exists                      |
| Nadia WhatsApp CRM dashboard          | `src/components/crm/NadiaWhatsAppCRM/`       | ✅ UI exists                   |
| Nina bot CRM dashboard                | `src/components/crm/NinaWhatsAppBotCRM_NEW/` | ✅ UI exists                   |
| Olivia marketing CRM                  | `src/components/crm/OliviaMarketingCRM_NEW/` | ✅ UI exists                   |
| WhatsApp webhook endpoint             | `server/routes/whatsapp.ts` (or `nadia.ts`)  | ✅ Webhook handler exists      |

---

## What Needs To Be Done 🚧

### 4.1 — WhatsApp Cloud API Setup

- [ ] Populate env vars in `.env` and Vercel dashboard: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_PHONE_NUMBER_ID`
- [ ] Remove stub logs from `WhatsAppBotService.sendMessage()` — replace with real `MetaAPIClient.sendTextMessage()` call
- [ ] Remove stub from `WhatsAppBotService.sendTemplateMessage()` — wire to `MetaAPIClient.sendTemplate()`
- [ ] Upgrade webhook verification from token-only to full HMAC-SHA256 (`crypto.createHmac`)
- [ ] Test inbound message receipt: send a message to the WABA number → verify it appears in `NadiaConversation`
- [ ] Test outbound message: call `sendMessage()` → verify recipient receives it on WhatsApp

**Files to update:**

- `server/services/WhatsAppBotService.ts`
- `server/services/MetaAPIClient.ts`
- Webhook route (`server/routes/nadia.ts` or `server/routes/whatsapp.ts`)

---

### 4.2 — Inbound Message Handling & Nadia Inbox

- [ ] On inbound webhook: create/update `NadiaConversation` record in DB
- [ ] Store each message as `NadiaMessage` (direction: inbound/outbound, timestamp, content)
- [ ] Assign unhandled conversations to queue: `NadiaConversationQueue`
- [ ] Real-time update: agent inbox in `NadiaWhatsAppCRM` polls `/api/nadia/conversations` every 30s (or WebSocket)
- [ ] Mark conversation as read when agent opens it
- [ ] Agent reply: POST `/api/nadia/conversations/:id/reply` → calls `WhatsAppBotService.sendMessage()`

**New API endpoints needed:**

```
GET  /api/nadia/conversations              — list open conversations (auth)
GET  /api/nadia/conversations/:id          — conversation detail + messages
POST /api/nadia/conversations/:id/reply    — send reply via WhatsApp
PATCH /api/nadia/conversations/:id/assign  — assign to agent
PATCH /api/nadia/conversations/:id/close   — close conversation
```

---

### 4.3 — Nina Bot (Automated First Response)

**Goal**: Respond automatically to incoming messages, classify intent, and escalate to Nadia when needed.

- [ ] Create `server/services/NinaBotService.ts` with conversation state machine
- [ ] Intent classification (simple keyword matching for Phase 4; upgrade to OpenAI in Phase 10):
  - `property_inquiry` — keywords: buy, rent, apartment, villa, bedroom
  - `viewing_request` — keywords: view, visit, appointment, see
  - `faq` — keywords: price, location, contact, RERA
  - `escalate` — keywords: agent, human, help, complaint
- [ ] Language detection: Arabic vs English (check `lang` field from Meta webhook)
- [ ] Flow: property inquiry → ask budget → ask type → ask area → return 3 matching properties
- [ ] Flow: viewing request → offer available slots → confirm → create `Viewing` record
- [ ] Escalation: confidence < 60% or user says "agent" → set conversation `needsHuman: true` → alert Nadia inbox
- [ ] Lead auto-creation in Clara: on first inbound message, create `Lead` with source `whatsapp`, name/phone from Meta profile

**File to create:** `server/services/NinaBotService.ts`

---

### 4.4 — Olivia Broadcast Campaigns

**Goal**: Targeted WhatsApp message campaigns to segmented lead/client lists.

- [ ] Campaign builder endpoint: `POST /api/campaigns` — body: `{ name, audience, templateId, scheduledAt }`
- [ ] Audience filter options: status, area, budget range, last contact date
- [ ] Recipient list generation: query `Lead` + `Client` models with filters
- [ ] Execution: iterate recipient list, call `WhatsAppBotService.sendTemplateMessage()` per recipient
- [ ] Rate limiting: max 1 message per second (Meta rate limit)
- [ ] Delivery tracking: update `Campaign.stats.sent/delivered/read` via delivery webhook
- [ ] Campaign analytics in `OliviaMarketingCRM_NEW`: sent/delivered/read counts per campaign

**New Prisma model needed:**

```prisma
model Campaign {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  audience    Json
  templateId  String
  status      String   @default("draft") // draft, scheduled, running, completed
  stats       Json     @default("{}")
  scheduledAt DateTime?
  createdAt   DateTime @default(now())
}
```

---

### 4.5 — Email Notification Templates

**Goal**: Supplement WhatsApp with email notifications (new lead, appointment confirmed, contract ready).

- [ ] Evaluate email provider: SendGrid (preferred) or Nodemailer with SMTP
- [ ] Create `server/services/EmailService.ts` with `sendEmail(to, template, data)` method
- [ ] Templates (HTML):
  - `new-lead` — sent to agent on lead assignment
  - `appointment-confirmed` — sent to client with property details
  - `contract-ready` — sent to client with document download link
  - `rent-reminder` — sent to tenant 5 days before due date
- [ ] Trigger email on lead assignment via Olivia broadcast trigger
- [ ] Trigger email on appointment confirmation (Phase 5 viewing booking flow)

---

## Definition of Done — Phase 4

- [ ] `WhatsAppBotService.sendMessage()` sends a real message via Meta Cloud API
- [ ] Inbound messages appear in the Nadia inbox (NadiaWhatsAppCRM) in < 30s
- [ ] Nina bot responds to a "property inquiry" test message with a property listing
- [ ] Nina bot escalates to Nadia when user sends "I want an agent"
- [ ] Olivia can send a broadcast to 3 test leads and delivery status updates
- [ ] No WhatsApp stub logs appear in production
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 4 is complete, move to **[PHASE_5_LEASE.md](./PHASE_5_LEASE.md)** — Full Lease & Tenancy Module.
