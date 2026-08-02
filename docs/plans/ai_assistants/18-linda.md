# 18 — Linda · WhatsApp LocalAuth Bot Manager

> **ID:** `linda`  
> **Department:** Communications  
> **Title:** WhatsApp LocalAuth Bot Manager & Agent Session Manager  
> **Color:** `#8B5CF6` (Purple)  
> **Avatar:** 🤖  
> **Phase:** Phase 4 (Implemented)  
> **Status:** ✅ Production-ready — route + dashboard + assistant docs confirmed  
> **Access:** Managing Director, Communications Manager, Individual Agents (own session)

---

## 1. Overview

Linda is the **agent-side WhatsApp session manager**. While Nadia operates the official Meta Cloud API channel, Linda manages local WhatsApp Web sessions running on individual agent devices via **whatsapp-web.js + LocalAuth** — requiring zero Meta business verification. Linda lets agents use their personal WhatsApp numbers for CRM-integrated messaging, executes real estate command shortcuts, and manages multi-session orchestration across the entire agent team.

---

## 2. Core Responsibilities

1. Initialize and maintain a WhatsApp Web session per agent device (QR code scan, then persistent)
2. Receive messages on agent's personal number → log in CRM
3. Execute real estate commands: PROPERTY [id], PRICING [area], FINANCE [query]
4. Route commands to the appropriate CRM service and reply with formatted data
5. Manage session health: auto-reconnect on disconnect, heartbeat monitoring
6. Bridge between agent's personal WhatsApp and the CRM conversation log

---

## 3. Capabilities

| Capability                | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| LocalAuth session         | Persistent WhatsApp session (no re-scan after first setup)                      |
| QR code onboarding        | Agent scans QR in CRM → session established                                     |
| Session health monitor    | Heartbeat every 30s; auto-reconnect on disconnect                               |
| CRM command execution     | `PROPERTY [id]` → return property details; `LEAD [phone]` → return lead profile |
| Auto-reply templates      | `GREET`, `SCHEDULE`, `DOCUMENT [type]` → pre-configured reply templates         |
| Message mirroring         | All messages (sent + received) mirrored to CRM conversation log                 |
| Multi-agent orchestration | Manage up to 50 simultaneous agent sessions                                     |
| Session analytics         | Messages sent/received per agent, response time, active hours                   |
| Escalation to Nadia       | If command outside Linda's scope → escalate to Nadia's official channel         |

---

## 4. How It Works — End to End

### Step 1 — Agent Onboarding

Agent logs into CRM → navigates to Linda dashboard → clicks "Connect My WhatsApp" → Linda backend calls `new Client({ authStrategy: new LocalAuth({ clientId: agentId }) })` → QR code rendered in browser → agent scans with WhatsApp → session established.

### Step 2 — Session Persistence

LocalAuth saves session files to `./whatsapp_sessions/{agentId}/`. On server restart, `client.initialize()` restores session automatically — no re-scan needed.

### Step 3 — Incoming Message

Customer messages agent's personal number → `client.on('message', handler)` → Linda receives message object: `{ from, body, timestamp }`. Message stored in `Conversation` model linked to agentId + contactPhone.

### Step 4 — Command Detection

`body.startsWith('/')` or matches command regex: `/^(PROPERTY|LEAD|PRICING|FINANCE)\s+(.+)/i`. Linda routes to appropriate CRM service:

- `PROPERTY [id]` → `GET /api/properties/:id` → formats result
- `PRICING [area]` → `GET /api/properties?area=X&stats=true` → formats avg/min/max
- `LEAD [phone]` → `GET /api/leads?phone=X` → returns lead profile

### Step 5 — Command Reply

Linda formats response into WhatsApp-readable text (no HTML, use emojis and line breaks) → `client.sendMessage(from, formattedResponse)`.

### Step 6 — Heartbeat Monitoring

Every 30 seconds: `SessionMonitor.ping(agentId)`. If no pong in 10s → reconnect attempt. If 3 consecutive failures → alert agent via push notification and log incident.

### Step 7 — Session Handover

If agent off-duty → Linda checks next available agent → routes conversation to their session. Or escalates to Nadia's official channel for Meta template reply.

---

## 5. API Endpoints

| Method | Path                                      | Description             |
| ------ | ----------------------------------------- | ----------------------- |
| GET    | `/api/linda/status`                       | Connection status       |
| GET    | `/api/linda/qr`                           | Current QR code         |
| POST   | `/api/linda/connect`                      | Trigger initialization  |
| POST   | `/api/linda/disconnect`                   | Graceful disconnect     |
| GET    | `/api/linda/stats`                        | Detailed statistics     |
| GET    | `/api/linda/sessions`                     | Active session list     |
| POST   | `/api/linda/send/:conversationId`         | Send message            |
| POST   | `/api/linda/broadcast`                    | Broadcast campaign send |
| POST   | `/api/linda/webhook`                      | Poll-based ingestion    |
| GET    | `/api/linda/conversations`                | List active chats       |
| GET    | `/api/linda/conversations/:phone/history` | Conversation history    |

---

## 6. Data Flows

- **Receives from:** Agent's personal WhatsApp number (via whatsapp-web.js)
- **Sends to:** Nadia (escalations, cross-channel routing), CRM `Conversation` model (message log), Clara (auto-create leads from new contacts)

---

## 7. Frontend Components

| Component            | Path                                 | Status     |
| -------------------- | ------------------------------------ | ---------- |
| Linda dashboard      | `src/pages/owner/` WhatsApp sections | ✅ Exists  |
| Session status panel | QR code + health indicators          | ✅ Exists  |
| Message mirror view  | Conversation list                    | 🔲 Planned |
| Command analytics    | Message stats per agent              | 🔲 Planned |

---

## 8. Backend Services

| Service               | Path                                                | Status         |
| --------------------- | --------------------------------------------------- | -------------- |
| Linda route           | `server/routes/linda.ts`                            | ✅ Implemented |
| WhatsApp core manager | `server/services/whatsapp/linda-core/`              | ✅ Implemented |
| Session storage       | `LINDA_SESSIONS_PATH` (default `./.linda-sessions`) | ✅ Implemented |

---

## 9. Access Control

| Role                     | Access                   |
| ------------------------ | ------------------------ |
| `managing_director`      | All sessions + analytics |
| `communications_manager` | All sessions             |
| `agent`                  | Own session only         |

---

## 10. Implementation Checklist

- [x] Linda route (`server/routes/linda.ts`) exists
- [x] Linda registered in `AI_ASSISTANTS_REGISTRY`
- [x] Install `whatsapp-web.js` package
- [x] Linda core runtime/session bridge implemented in `server/services/whatsapp/linda-core/*`
- [x] Session health monitor + auto-reconnect
- [x] Message mirroring and conversations endpoints
- [x] Session listing + analytics/status endpoints
- [ ] Expand advanced command library coverage (beyond current command handlers)
- [ ] Expand multi-agent orchestration from current target to full 50-session stress profile

---

## 11. Dependencies

- `whatsapp-web.js` npm package (local auth, not Meta approved)
- `qrcode` npm package (QR rendering)
- Nadia (escalation routing)
- `Conversation` + `Message` Prisma models

---

## 12. Future Enhancements

- Linda command plugin system (agents can define custom commands)
- Multi-device session support (when Meta enables it in whatsapp-web.js)
- Session recording + compliance archive
- AI-generated auto-replies when agent is offline
