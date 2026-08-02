# 17 — Nadia · WhatsApp Meta Cloud API Manager

> **ID:** `nadia`  
> **Department:** Communications  
> **Title:** WhatsApp CRM Manager & Meta Cloud API Orchestrator  
> **Color:** `#25D366` (Meta Green)  
> **Avatar:** 💼  
> **Phase:** Phase 4 (High Priority)  
> **Status:** ✅ In Code — `src/components/owner/ai/NadiaWhatsAppCRM/`; backend stub only  
> **Access:** Managing Director, Communications Manager, Assigned Agents

---

## 1. Overview

Nadia is the **official enterprise WhatsApp layer** for White Caves. She operates via Meta's Cloud API (official WhatsApp Business API), providing the highest deliverability, template message support, and full compliance with Meta's policies. She receives every inbound customer WhatsApp message via Meta webhooks, routes it to Nina for intent classification, routes to the correct agent inbox, and sends outbound messages at scale including broadcast campaigns. Every other assistant that needs to send a WhatsApp message routes through Nadia.

---

## 2. Core Responsibilities

1. Receive all inbound WhatsApp messages via Meta webhooks (`POST /api/whatsapp/webhook`)
2. Route inbound messages: → Nina (intent classification) → Agent inbox (human response)
3. Send outbound messages: one-to-one, template messages, broadcast campaigns
4. Manage the agent inbox: conversations, read/unread status, agent assignment
5. Track message delivery status: sent → delivered → read
6. Auto-create leads in Clara from new WhatsApp contacts

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Inbound webhook | Receive Meta payload, verify HMAC signature, parse message |
| Agent inbox | Multi-agent inbox: unread count, conversation list, message thread |
| Message routing | New contact → Nina → agent assignment or Nina bot response |
| Template messaging | Send pre-approved templates: property details, viewing reminders, payment alerts |
| Broadcast campaigns | Send template to filtered audience (Olivia campaigns, Daisy rent reminders) |
| Media messages | Send property images, PDFs, location pins via WhatsApp |
| Read receipts | Track ✓✓ (delivered) and blue ✓✓ (read) |
| Contact management | Profile per WhatsApp contact: name, phone, lead link |
| Escalation | If Nina confidence < 60% → route to human agent immediately |
| Auto-lead creation | New WhatsApp contact initiates conversation → auto-create lead in Clara |

---

## 4. How It Works — End to End

### Step 1 — Inbound Message
Customer sends WhatsApp message → Meta delivers to `POST /api/whatsapp/webhook`.

### Step 2 — Signature Verification
`crypto.timingSafeEqual(HMAC-SHA256(payload, webhookSecret), x-hub-signature-256)`. If fails → 401 rejected.

### Step 3 — Message Parsing
Extract: `from` (phone number), `message.text.body`, `timestamp`, `waId` (WhatsApp ID). Look up existing lead or create new contact record.

### Step 4 — Intent Classification
Message body passed to Nina's `classifyIntent()` → returns: `{ intent: 'property_inquiry', entities: { area: 'Marina', budget: 2000000 }, confidence: 0.85 }`.

### Step 5 — Routing Decision
- `confidence >= 0.75` AND `intent = 'property_inquiry'` → Nina bot responds with property list
- `confidence >= 0.75` AND `intent = 'viewing_request'` → Nina books viewing
- `confidence < 0.60` OR `intent = 'escalate'` → route to human agent inbox
- New contact → auto-create lead in Clara with `source: 'whatsapp'`

### Step 6 — Agent Response
Agent sees conversation in Nadia inbox → types reply → `POST /api/whatsapp/messages { to: phone, type: 'text', body: '...' }` → Meta Cloud API sends it.

### Step 7 — Template Message
Daisy triggers rent reminder → `POST /api/whatsapp/messages { to: phone, type: 'template', templateName: 'rent_reminder', params: [tenantName, amount, dueDate] }`.

### Step 8 — Delivery Tracking
Meta sends delivery webhook → `PATCH /api/whatsapp/messages/:waId { status: 'delivered' }`. Blue tick → `{ status: 'read' }`.

### Step 9 — Broadcast Campaign
Olivia creates campaign → audience list → `POST /api/whatsapp/broadcast { templateId, recipients: [phoneList], schedule: '2026-05-01T09:00' }` → Nadia queues and sends with rate-limiting (Meta allows 80 msg/sec per number).

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/whatsapp/webhook` | Meta inbound message webhook |
| GET | `/api/whatsapp/webhook` | Meta webhook verification challenge |
| POST | `/api/whatsapp/messages` | Send message (text, template, media) |
| GET | `/api/whatsapp/conversations` | List all conversations |
| GET | `/api/whatsapp/conversations/:id` | Get single conversation thread |
| POST | `/api/whatsapp/broadcast` | Create broadcast campaign |
| GET | `/api/whatsapp/broadcast/:id/stats` | Delivery stats per campaign |

---

## 6. Data Flows

- **Receives from:** Meta Cloud API webhooks (inbound), all assistants (outbound message triggers)
- **Sends to:** Nina (intent classification), Clara (new leads), Agent inbox (escalated conversations), Meta Cloud API (outbound)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `NadiaWhatsAppCRM` | `src/components/owner/ai/NadiaWhatsAppCRM/` | ✅ Exists (mock UI) |
| Agent inbox view | Inside `NadiaWhatsAppCRM` | ✅ Exists (static) |
| Broadcast builder | Inside `NadiaWhatsAppCRM` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| WhatsAppBotService | `server/services/WhatsAppBotService.ts` | ⚠️ Stubbed — `sendMessage()` logs only |
| Webhook handler | `server/routes/whatsapp.ts` or `linda.ts` | ✅ Exists (partial) |
| Conversation model | Prisma `Conversation` + `Message` models | ✅ Exists in schema |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full inbox + broadcast + analytics |
| `communications_manager` | Full inbox + broadcast |
| `agent` | Own assigned conversations only |

---

## 10. Implementation Checklist

- [x] `NadiaWhatsAppCRM` component registered and renders
- [x] Prisma `Conversation` + `Message` models exist
- [x] Webhook route exists (HMAC verification ✅)
- [ ] **CRITICAL**: Implement `WhatsAppBotService.sendMessage()` with real Meta Cloud API call
- [ ] Implement `sendTemplateMessage()` with template name + params
- [ ] Implement `handleIncomingMessage()` — parse, route, store
- [ ] Real-time inbox update via WebSocket (Phase 4)
- [ ] Broadcast campaign queueing with rate limiting
- [ ] Delivery status webhook handler
- [ ] Register `WHATSAPP_BOT_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in env

---

## 11. Dependencies

- Meta Business WABA account + approved phone number (external — Phase 4)
- Nina (intent classification)
- Clara (auto-lead creation)
- Socket.io (real-time inbox — Phase 4)

---

## 12. Future Enhancements

- Multi-language message routing (Arabic messages → Arabic-speaking agent)
- Sentiment analysis on conversations (Nina enhancement)
- Automated CSAT survey after conversation close
- WhatsApp Payments integration (Phase 10)
