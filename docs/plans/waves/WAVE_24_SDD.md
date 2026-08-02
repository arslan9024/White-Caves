# Wave 24 — System Design Document (SDD)

**Wave:** 24  
**Focus:** WhatsApp Automation, AI Chat Engine & In-App Notification Centre  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Mira + @Joelle + @Una + @Barbara + @Katherine  
**CONSUMES←:** `business_docs/09_crm_features/whatsapp-integration.md`, `business_docs/09_crm_features/ai-chat.md`, `business_docs/09_crm_features/follow-up-automation.md`, `business_docs/08_integrations/integration-map.md`  
**FEEDS→:** Wave 25 (SEO and community features depend on messaging infrastructure); all AI assistants

---

## Objective

Deliver the full AI-powered communications layer for White Caves CRM. This wave completes the WhatsApp Business API integration (inbound + outbound), builds the Nina chatbot conversation engine with property enquiry and maintenance flows, implements the multi-provider AI chat backend with streaming SSE, adds the CRM in-app notification centre, and wires the 7-day lead nurture follow-up sequence engine.

---

## Scope

### 1. WhatsApp Business API — Complete Integration

- Webhook handler `POST /api/v1/webhooks/meta`: verifies `X-Hub-Signature-256`; handles `messages`, `message_status`, `contacts` events
- Inbound message router: classifies intent (property enquiry, maintenance, payment, general) → routes to Nina chatbot or human agent queue
- Outbound message service: `sendWhatsAppTemplate(phoneNumber, templateName, components)` with retry logic (3 attempts, 10-min intervals)
- 24-hour conversation window management: template required outside window; free-form allowed within window
- Message status tracking: `delivered`, `read`, `failed` stored in `whatsapp_messages` collection
- Opt-in/opt-out database: `whatsapp_consent` collection (`phoneNumber`, `optedInAt`, `optedOutAt`, `source`)
- Broadcast campaign sender: segment leads by area/budget/stage → send approved template → track delivery, open, reply rates

### 2. Nina Chatbot — Conversation Engine

- Intent classifier (OpenAI function calling): `property_enquiry`, `maintenance_request`, `payment_enquiry`, `viewing_booking`, `general_greeting`, `human_handoff_request`
- Conversation state machine stored in `ai_conversations` collection with 30-day TTL
- **Property enquiry flow:**
  1. Collect: area preference → budget (AED) → bedrooms → property type
  2. Query `GET /api/v1/properties?area=&minPrice=&maxPrice=&bedrooms=` → return top 3 matches
  3. Present each with address, price, and Cloudinary thumbnail
  4. Offer: "Reply 1/2/3 to see more details" or "Book a viewing"
- **Maintenance request flow:**
  1. Ask: describe issue → send photo
  2. Auto-classify priority: "water leak" = emergency, "broken AC" = high, "light bulb" = low
  3. Create maintenance ticket via `POST /api/v1/maintenance`
  4. Confirm ticket number and SLA: "We'll respond within 4 hours"
- **Human handoff triggers:**
  - Confidence score < 70% on intent classification
  - User sends "human", "agent", "مساعدة", "help"
  - No resolution after 3 consecutive bot turns
  - On handoff: create CRM task for assigned agent; send "Connecting you to an agent now" message
- **Language support:** Arabic and English detected via first message; maintained for conversation duration

### 3. AI Chat Engine — Multi-Provider Streaming Backend

- `POST /api/v1/ai-chat`: non-streaming, returns full completion; used for internal CRM AI tools
- `GET /api/v1/ai-chat/stream/:sessionId`: SSE endpoint; streams token-by-token to browser `EventSource`
- Provider abstraction layer: `PROVIDER` env var → `openai` | `anthropic` | `groq`; same interface for all
- Fallback chain: OpenAI → Anthropic → Groq → canned response + Slack alert
- Context injection per assistant role:
  - Property page: inject property details (price, area, beds, description, last valuation)
  - Lead page: inject lead name, stage, last contact date, assigned agent, viewing history
  - Tenant page: inject active lease details, payment status, open maintenance tickets
- Session persistence: last 20 messages per `sessionId` in MongoDB; 30-day TTL index
- Token budget: standard assistants 1,000 tokens/request; executive assistants 2,000; daily per-assistantId cap via Redis `INCR`

### 4. Follow-Up Automation Sequence Engine

- Sequence builder: trigger types (`lead_stage_changed`, `X_days_since_last_contact`, `lease_expiry_approaching`, `viewing_completed`, `offer_rejected`) × action types (`send_whatsapp_template`, `send_email`, `create_task`, `add_crm_note`)
- Built-in sequence templates:
  - **New lead 7-day nurture:** Day 1 WhatsApp intro + property suggestions → Day 3 follow-up call task → Day 7 email with market report PDF
  - **Lease renewal 90-day:** 90d/60d/30d/7d WhatsApp + email reminders; auto-escalate to manager if no response at 30d
  - **Post-viewing 48h:** 30 min after completion: send property brochure PDF via WhatsApp; 48h: create follow-up call task; update lead stage to `Viewed`
- Execution engine: Node.js cron every 15 minutes; processes `follow_up_queue` collection entries where `scheduledAt <= now AND status = pending`
- Auto-pause: any manual agent activity on the lead within 24 hours pauses active sequences for that lead
- Effectiveness report: per-sequence open rate, reply rate, conversion rate — surfaced in Analytics dashboard

### 5. In-App Notification Centre

- Notification bell icon in top navigation: badge count of unread notifications
- Notification types: `lead_assigned`, `viewing_reminder`, `offer_received`, `lease_expiry_alert`, `maintenance_update`, `system_alert`, `ai_handoff_required`
- `notifications` MongoDB collection: `{ userId, type, title, body, entityType, entityId, readAt, createdAt }`; TTL index: 90 days
- Real-time delivery: Socket.io `notification:{userId}` room; push notification on event emit
- `GET /api/v1/notifications`: paginated (20/page), unread first
- `PATCH /api/v1/notifications/:id/read`: mark single as read
- `PATCH /api/v1/notifications/read-all`: mark all as read
- Notification preferences: per-user settings (`notification_preferences` collection) for each notification type — `in_app`, `push`, `email`, `whatsapp`

---

## Requirement IDs (Wave 24)

| ID | Requirement |
|---|---|
| `REQ-WA-001` | WhatsApp webhook verifies `X-Hub-Signature-256` on every request |
| `REQ-WA-002` | Inbound WhatsApp message classified and routed within 2 seconds |
| `REQ-WA-003` | Nina property enquiry flow collects area/budget/beds and returns ≥1 match |
| `REQ-WA-004` | Maintenance request creates ticket with auto-classified priority |
| `REQ-WA-005` | Human handoff triggered on confidence < 70% OR "human"/"agent" keyword |
| `REQ-WA-006` | Opt-out stored; no further messages sent after opt-out |
| `REQ-WA-007` | Broadcast campaign tracks delivery, read, and reply rates |
| `REQ-AI-001` | AI chat SSE stream delivers first token within 500ms |
| `REQ-AI-002` | Provider fallback chain: OpenAI → Anthropic → Groq → canned response |
| `REQ-AI-003` | Context injected correctly for property, lead, and tenant page assistants |
| `REQ-AI-004` | Session history (last 20 messages) persists across page refreshes |
| `REQ-AI-005` | Daily token cap enforced per assistantId via Redis |
| `REQ-SEQ-001` | New lead 7-day nurture sequence fires correct actions on Days 1, 3, and 7 |
| `REQ-SEQ-002` | Sequence auto-pauses when agent manually contacts lead |
| `REQ-SEQ-003` | Effectiveness report shows open/reply/conversion rates per sequence |
| `REQ-NOTIF-001` | In-app notification bell shows accurate unread count |
| `REQ-NOTIF-002` | Real-time notification delivered via Socket.io within 1 second of event |
| `REQ-NOTIF-003` | Notification preferences respected per user per channel |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/webhooks/meta` | Webhook verify token | Receive WhatsApp events |
| POST | `/api/v1/whatsapp/send` | Agent+ | Send outbound WhatsApp message |
| POST | `/api/v1/whatsapp/broadcast` | Manager+ | Send broadcast campaign |
| GET | `/api/v1/whatsapp/conversations` | Agent+ | List WhatsApp conversations |
| POST | `/api/v1/ai-chat` | Agent+ | Non-streaming AI chat completion |
| GET | `/api/v1/ai-chat/stream/:sessionId` | Agent+ | SSE streaming AI completion |
| GET | `/api/v1/notifications` | Agent+ | Paginated notification list |
| PATCH | `/api/v1/notifications/:id/read` | Agent+ | Mark notification read |
| PATCH | `/api/v1/notifications/read-all` | Agent+ | Mark all notifications read |
| GET | `/api/v1/notification-preferences` | Agent+ | Get user notification prefs |
| PATCH | `/api/v1/notification-preferences` | Agent+ | Update notification prefs |
| GET | `/api/v1/follow-up-sequences` | Manager+ | List all sequences |
| POST | `/api/v1/follow-up-sequences` | Manager+ | Create sequence |
| PATCH | `/api/v1/follow-up-sequences/:id/pause` | Manager+ | Pause sequence for lead |

---

## Acceptance Gate (Wave-Level)

Wave 24 is complete when:

1. WhatsApp webhook receives and processes test inbound message within 2 seconds
2. Nina completes property enquiry flow end-to-end (area → budget → beds → results)
3. Maintenance request creates ticket with correct auto-priority
4. Human handoff fires correctly on all 3 triggers
5. AI chat stream delivers first token < 500ms on OpenAI; fallback chain tested with mock failures
6. New lead 7-day nurture sequence fires all 3 actions on correct schedule
7. In-app notification bell count accurate; real-time delivery verified
8. `npm run plans:validate` green
9. Evidence committed to `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
