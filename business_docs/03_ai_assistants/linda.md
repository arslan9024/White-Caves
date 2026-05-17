# Linda — WhatsApp LocalAuth Bot Manager

> **Department:** Communications  
> **ID:** `linda`  
> **Title:** WhatsApp LocalAuth Bot Manager & Agent Session Manager  
> **Color:** #8B5CF6 (Purple)  
> **Avatar:** 🤖  
> **Status:** Production-Ready  
> **Dashboard URL:** `/owner/dashboard?tab=linda`  
> **Framework:** whatsapp-web.js + LocalAuth

---

## Overview

**Linda is the agent-side WhatsApp session manager** for White Caves Real Estate LLC. She operates locally on agent devices using `whatsapp-web.js` with `LocalAuth` — requiring zero Meta Business verification and delivering instant, rate-limit-free messaging directly from each agent's WhatsApp number.

**Core Role**:
- ✅ Initialize and maintain WhatsApp web client sessions per agent device (QR code pairing)
- ✅ Send direct messages and property brochures to leads and clients
- ✅ Broadcast to multiple phone numbers simultaneously
- ✅ Execute real estate commands (PROPERTY, PRICING, SCHEDULE_TOUR, CONTRACT, etc.)
- ✅ Sync contacts from Google Contacts → MongoDB
- ✅ AI-powered lead opportunity scoring via Groq
- ✅ Poll inbound messages and route them to the CRM pipeline
- ✅ Auto-recover disconnected sessions with exponential backoff

**Key differentiator**: LOCAL + INSTANT + AGENT-CONTROLLED. Each agent scans a QR code once, and Linda handles all their WhatsApp messaging from the CRM — no Meta approval, no infrastructure, no rate limits (within WhatsApp Web's 1 msg/6 sec per user).

---

## Core Responsibilities

### 1. Multi-Account Session Management
- Each agent has their own isolated LocalAuth session
- Sessions stored in `LINDA_SESSIONS_PATH` (default `./.linda-sessions/`)
- Prisma `LindaSession` model persists session metadata to PostgreSQL
- Auto-reconnect within 5 seconds on disconnection
- Heartbeat ping every 30 seconds to detect silent disconnections
- Manual recovery via `POST /api/linda/session/:id/recover`

### 2. Real Estate Command Execution
| Command | Trigger | Response |
|---------|---------|---------|
| `PROPERTY` | Agent types `property {id}` | Property details, images, pricing (AED) |
| `PRICING` | `pricing {id} {buy\|rent}` | ROI analysis, rental yield, mortgage estimate |
| `SCHEDULE_TOUR` | `tour {id} {date} {time}` | Books viewing slot, sends calendar invite |
| `CONTRACT` | `contract {tenantPhone} {propId}` | Generates tenancy agreement draft |
| `FINANCING` | `financing {propId}` | Mortgage calculator, bank options |
| `COMPARABLE` | `comps {area} {beds}` | Similar listings in the area |
| `LEAD_SCORE` | `score {phone}` | AI qualification score 0–100 |

### 3. Broadcast Campaigns
- `POST /api/linda/broadcast` accepts array of phone numbers + template message
- Supports `LindaBroadcastCampaign` Prisma model for campaign tracking
- Rate-limited to 1 msg / 6 sec per session (WhatsApp Web constraint)
- Campaign analytics: delivered count, failed, pending

### 4. AI Opportunity Scoring
- Analyse conversation context for buying/renting signals
- Detect urgency markers: "moving next month", "mortgage approved", "cash buyer"
- Score leads 0–100; >70 flagged as HOT and escalated to Clara (Leads CRM)
- Powered by Groq API (`opportunityScoring.ts`)

### 5. Contact Sync
- Google Contacts → MongoDB sync on demand via `POST /api/linda/contacts/sync`
- Stores `LindaContact` with `score`, `lastInteraction`, `property` (last discussed)
- De-duplicates on phone number

---

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| **GET** | `/api/linda/health` | None | Simple health check |
| **GET** | `/api/linda/status` | JWT | Session connection status |
| **GET** | `/api/linda/qr` | JWT (Owner) | Current QR code (base64 PNG) |
| **POST** | `/api/linda/connect` | JWT (Owner) | Trigger bot initialization |
| **POST** | `/api/linda/disconnect` | JWT (Owner) | Graceful disconnect |
| **GET** | `/api/linda/stats` | JWT | Detailed session statistics |
| **GET** | `/api/linda/sessions` | JWT | Active bot sessions list |
| **POST** | `/api/linda/send/:conversationId` | JWT | Send message to one contact |
| **POST** | `/api/linda/broadcast` | JWT | Broadcast to multiple phones |
| **POST** | `/api/linda/webhook` | JWT | Poll-based message ingestion |
| **GET** | `/api/linda/conversations` | JWT | List active chats |
| **GET** | `/api/linda/conversations/:phone/history` | JWT | Conversation history |
| **POST** | `/api/linda/ready` | JWT | Readiness check |

---

## Data Models (Prisma)

### LindaSession
```prisma
model LindaSession {
  id          String   @id @default(cuid())
  agentId     String
  phoneNumber String   @unique
  displayName String
  status      String   // connected | disconnected | qr_scanning | error
  qrCode      String?
  sessionDir  String
  metadata    Json?
  lastSeen    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### LindaBroadcastCampaign
```prisma
model LindaBroadcastCampaign {
  id          String   @id @default(cuid())
  name        String
  message     String
  phones      String[]
  sentCount   Int      @default(0)
  failedCount Int      @default(0)
  status      String   @default("pending")  // pending | running | completed | failed
  scheduledAt DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
}
```

### CommunicationTemplate
```prisma
model CommunicationTemplate {
  id        String   @id @default(cuid())
  name      String
  category  String   // property_intro | viewing_confirmation | follow_up | payment_reminder
  body      String   // Supports {{name}}, {{property}}, {{price}}, {{agent}} placeholders
  language  String   @default("en")  // en | ar
  createdAt DateTime @default(now())
}
```

---

## Data Flows

### Inbound Message Flow
```
Customer WhatsApp Message
  → WhatsApp Web Protocol
  → Linda LocalAuth Client (poll via /api/linda/webhook)
  → Nadia (CRM logging + conversation assignment)
  → Nina (NLP intent extraction)
  → Clara (lead score update if qualified)
  → Agent Dashboard (real-time notification)
```

### Outbound Message Flow
```
Agent Action in CRM
  → POST /api/linda/send/:conversationId
  → Linda LocalAuth Client
  → WhatsApp Web Protocol
  → Customer Device
  → Nadia (message log)
  → HenryRecord (audit if contract-related)
```

### Broadcast Flow
```
POST /api/linda/broadcast {phones[], message}
  → LindaBroadcastCampaign created (status: running)
  → Linda sends 1 msg / 6 sec per session
  → Campaign updated (sentCount / failedCount)
  → Notification to agent on completion
```

---

## Access Control (RBAC)

| Role | View Sessions | Send Messages | Broadcast | Connect/Disconnect |
|------|-------------|--------------|-----------|-------------------|
| **Owner** | ✅ All | ✅ | ✅ | ✅ |
| **Admin** | ✅ All | ✅ | ✅ | ✅ |
| **Sales Manager** | ✅ Team | ✅ | ✅ | ❌ |
| **Agent** | Own only | Own only | ❌ | ❌ |
| **Public** | ❌ | ❌ | ❌ | ❌ |

Enforced via `requireMinRole` / `requirePermission` from `server/middleware/rbac.ts`.

---

## Frontend Integration

**Component**: `src/components/crm/LindaAdminCRM_NEW/index.tsx`  
**Redux Slice**: `src/store/slices/lindaSlice.ts`  
**CRM Module Key**: `'linda'` (registered in `CRM_MODULES`)  
**Dashboard URL**: `/owner/dashboard?tab=linda`

### UI Panels
1. **Session Monitor** — live connection status, QR code display, heartbeat indicator
2. **Conversations** — WhatsApp-style chat list with search; click to open ChatInterface
3. **Broadcast** — template selector, phone list upload, campaign progress bar
4. **Contacts** — synced contact list with AI scores; hot leads highlighted
5. **Analytics** — messages sent/received, campaign stats, response rates

---

## Configuration

```bash
# Linda core
LINDA_ENABLE=true
LINDA_SESSIONS_PATH=./.linda-sessions   # LocalAuth session storage

# Google Contacts sync
GOOGLE_CONTACTS_API_KEY=...
GOOGLE_SERVICE_ACCOUNT_JSON=...

# AI opportunity scoring
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-70b-versatile

# PostgreSQL (via Prisma)
DATABASE_URL=postgresql://...
```

---

## Real Estate Workflow: New Lead from WhatsApp

```
1. Customer: "Looking for 2BR apartment in Dubai Marina, budget AED 1.2M"
   ↓
2. Linda (LocalAuth) receives the message
   ↓
3. Nadia logs conversation in CRM, assigns to available agent
   ↓
4. Nina NLP: intent=property_search, {type: "2BR", area: "Dubai Marina", budget: 1200000}
   ↓
5. Linda AI scoring: urgency=high, budget=confirmed → score 82/100 → HOT
   ↓
6. Agent receives notification in Linda dashboard
   ↓
7. Agent clicks PROPERTY command → property details sent via Linda to customer
   ↓
8. Customer: "Can I see it tomorrow 2pm?"
   ↓
9. Agent executes: tour dubai-marina-2br tomorrow 2pm
   ↓
10. Viewing slot created in Booking calendar, confirmation sent to customer
    ↓
11. Clara updates lead stage: Contacted → Viewing Scheduled
    ↓
12. Henry archives viewing confirmation record
```

---

## Integration with Other Assistants

| Assistant | Relationship |
|-----------|-------------|
| **Nadia** | Nadia handles Meta Cloud API (inbound webhooks); Linda handles local agent sends. Both write to the same conversation log |
| **Nina** | Linda passes inbound messages to Nina for NLP processing |
| **Clara** | Linda's AI scores feed Clara's lead pipeline |
| **Henry** | Contract-related messages trigger Henry to archive documents |
| **Daisy** | Linda sends lease signing confirmations on Daisy's behalf |

---

## Performance Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Session initialization | < 5 seconds | QR scan to connected |
| Command execution | < 2 seconds | Property lookup via API |
| Message send | < 1 second | Via LocalAuth client |
| Contact sync (100 contacts) | < 30 seconds | Google → MongoDB |
| Uptime | 99%+ | Auto-reconnect on drop |
| Broadcast throughput | 1 msg / 6 sec | WhatsApp Web standard |

---

## Security & Compliance

- ✅ **End-to-end encryption**: WhatsApp Signal protocol (LocalAuth inherits this)
- ✅ **Session isolation**: Each agent session in separate directory, encrypted locally
- ✅ **No cloud credential storage**: LocalAuth credentials stay on device
- ✅ **RBAC**: Agent can only access own session data
- ✅ **Audit trail**: All commands and messages logged (Nadia + Henry)
- ✅ **RERA compliance**: No unsolicited contact; opt-in required before broadcast
- ✅ **GDPR/UAE PDPL**: Contact data deletable via session purge endpoint

---

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| QR code not scanning | Update WhatsApp app, improve lighting, retry `POST /api/linda/connect` |
| Session disconnected | Auto-reconnects within 5 sec; if persistent call `POST /api/linda/disconnect` then reconnect |
| Message send failing | Check `GET /api/linda/status`; verify session is `connected` |
| Contacts not syncing | Verify Google API credentials; call `POST /api/linda/contacts/sync` |
| Broadcast stuck | Check campaign status via `LindaBroadcastCampaign`; restart if `status: running` > 1 hour |

---

## Future Enhancements

- [ ] Arabic message templates for UAE clients
- [ ] Voice message transcription (Whisper API)
- [ ] Property image auto-attach from Mary's inventory
- [ ] WhatsApp Pay integration for booking deposits
- [ ] Computer vision for auto-tagging property images
- [ ] Integration with Henry for contract signing via WhatsApp
- [ ] Multi-device support (WhatsApp Web multi-device beta)
