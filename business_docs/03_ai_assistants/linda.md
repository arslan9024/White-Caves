# Linda — WhatsApp LocalAuth Bot Manager

> **Department:** Communications  
> **ID:** `linda`  
> **Title:** WhatsApp LocalAuth Bot Manager & Agent Session Manager  
> **Color:** #8B5CF6 (Purple)  
> **Avatar:** 🤖  
> **Status:** Production-Ready (Phase 1-20+ from arslan9024/whatsapp-bot-linda)  
> **Framework:** whatsapp-web.js + LocalAuth

---

## Overview

**Linda is the AGENT-SIDE SESSION MANAGER** — operates **locally on agent devices** using **whatsapp-web.js + LocalAuth**. Zero Meta verification required.

**Core Role**: 
- ✅ Initialize WhatsApp web client on agent devices (1 per agent)
- ✅ Send messages via local client (instant, no Meta approval)
- ✅ Execute real estate commands (PROPERTY, PRICING, FINANCE, etc.)
- ✅ Sync contacts locally
- ✅ Manage sessions & recovery

**Unique Position**: Linda is the **ONLY way agents send messages directly**. No rate limits. No Meta approval. No infrastructure. Just scan QR code.

**The key differentiator**: LOCAL + INSTANT + AGENT-CONTROLLED. Zero Met infrastructure Required.

---

## Core Responsibilities

### 1. Multi-Account Session Management
- Initialize and manage 5-10+ WhatsApp client instances
- Each agent gets their own secure local session
- Sessions persist in encrypted local storage
- Auto-recovery on disconnection (exponential backoff)
- QR code generation for device linking

### 2. Real Estate Command Execution
- **PROPERTY**: Display property details, images, pricing
- **PRICING**: Calculate ROI, rental yields, commission
- **SCHEDULE_TOUR**: Book showings with calendar integration
- **CONTRACT**: Generate and send contract templates
- **FINANCING**: Show mortgage calculator, financing options
- **COMPARABLE**: Show similar properties (comps)
- **LEAD_SCORE**: Qualify leads using AI scoring
- Custom commands extensible by agents

### 3. Contact & Lead Management
- Sync Google Contacts → MongoDB automatically
- Track interaction history with each contact
- AI-based lead scoring (0-100 scale)
- Identify hot leads vs. cold leads
- Route qualified leads to agent pipeline

### 4. AI Opportunity Detection
- Analyze conversation context for buying signals
- Detect urgency markers in messages
- Suggest next steps (call, schedule tour, send contract)
- Learn from agent actions and improve suggestions

### 5. Session Recovery & Persistence
- Local session storage: `./sessions/session-{phoneNumber}/`
- MongoDB backup of all sessions
- Connection monitoring with heartbeat ping every 30 seconds
- Manual recovery endpoint if device goes offline
- Automatic reconnection within 5 seconds

---

## Capabilities

```typescript
capabilities: [
  'local_auth_management',       // Initialize & secure LocalAuth sessions
  'multi_account_coordination',  // Handle 5-10+ agent accounts
  'qr_device_linking',           // Generate QR codes for device setup
  'contact_sync_import',         // Google Contacts → MongoDB sync
  'ai_opportunity_scoring',      // Claude API-powered lead qualification
  'command_execution',           // Real estate specific commands
  'conversation_routing',        // Route messages to handlers
  'session_recovery',            // Auto-reconnect on disconnect
  'group_management',            // Shared group conversations
  'reaction_tracking'            // Emoji reactions & stickers
]
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/api/linda/status` | Check session health |
| **POST** | `/api/linda/qr-generate` | Generate new QR code |
| **GET** | `/api/linda/sessions` | List active sessions |
| **POST** | `/api/linda/send-message` | Send via LocalAuth |
| **GET** | `/api/linda/contacts` | Synced contacts list |
| **POST** | `/api/linda/contacts/sync` | Trigger Google sync |
| **GET** | `/api/linda/commands` | Available commands |
| **POST** | `/api/linda/commands/execute` | Execute command |
| **GET** | `/api/linda/analytics` | Session analytics |
| **POST** | `/api/linda/session/:id/recover` | Manual recovery |

---

## Data Flows

### Inbound
← **Nina**: Qualified leads with intent + slots  
← **Nadia**: Customer messages (forwarded from CRM)  
← **Agent**: Manual command execution

### Outbound
→ **Nadia**: Response message + lead update  
→ **MongoDB**: All messages, commands, contacts  
→ **Redux**: UI state updates

### Sequence
```
Agent Action (Msg/Cmd) 
  →  Linda (LocalAuth send) 
  →  WhatsApp Cloud (WEB)
  →  Customer
  →  WhatsApp Cloud (inbound)
  →  Nadia (webhook)
  →  Nina (NLP)
  →  Linda (notification)
  →  Agent Dashboard
```

---

## Access Control

| Role | Viewable | Accessible | Data Level |
|------|----------|-----------|-----------|
| **Owner** | ✅ | ✅ | Full |
| **Admin** | ✅ | ✅ | Full |
| **Agent** | ✅ | ❌ | Own sessions only |
| **Sales Manager** | ❌ | ❌ | — |
| **Public** | ❌ | ❌ | — |

---

## Database Schema

### LindaSession
```javascript
{
  _id: ObjectId(),
  agentId: "user-123",
  phoneNumber: "+971501234567",
  displayName: "Ahmed - Sales Agent",
  qrCode: "https://...", // QR code URL
  status: "connected", // disconnected, qr-scanning, error
  lastSeen: ISODate(),
  sessionDir: "./sessions/session-971501234567/",
  metadata: { ... },
  createdAt: ISODate()
}
```

### LindaContact
```javascript
{
  _id: ObjectId(),
  sessionId: ObjectId(),
  googleId: "gmail-contact-123",
  name: "Ahmed Al Mazrouei",
  phone: "+971505555555",
  email: "ahmed@email.com",
  property: "dubai-marina-2br", // last discussed
  score: 85, // AI scoring 0-100
  lastInteraction: ISODate(),
  syncedAt: ISODate()
}
```

### LindaCommand
```javascript
{
  _id: ObjectId(),
  sessionId: ObjectId(),
  command: "PROPERTY",
  propertyId: "prop-dubai-marina-001",
  args: { ... },
  result: { success: true, propertyDetails: { ... } },
  executedAt: ISODate(),
  status: "success"
}
```

---

## Real Estate Command Examples

### PROPERTY Command
```
Linda: property dubai-marina-2br

Response: 
🏠 Dubai Marina 2BR Apartment
📍 Marina Crescent
💰 AED 1,200,000
📐 1,050 sqft
🏊 Pool • Gym • Concierge
📞 Call Agent →
```

### PRICING Command
```
Linda: pricing dubai-marina-2br buy

Response:
📊 Dubai Marina 2BR - Investment Analysis

Purchase Price: AED 1,200,000
Annual Rental Yield: AED 78,000 (6.5%)
Avg Monthly Rent: AED 6,500
ROI (5yr): 32.5%

Call agent for financing options →
```

### SCHEDULE_TOUR Command
```
Linda: tour dubai-marina-2br tomorrow 2pm

Response:
✅ Tour Scheduled
📅 Tomorrow, 2:00 PM
📍 Dubai Marina Crescent
✏️ Confirm or reschedule →
```

---

## Integration with Other Assistants

### ↔ Nina (NLP Bot)
**When customer message arrives:**
1. Nadia receives via webhook
2. Nina processes intent/slots
3. Linda executes property search command
4. Result sent back via Nadia

### ↔ Nadia (CRM Manager)
**Data sync:**
1. Linda sends message → Nadia stores in DB
2. Nadia webhook → Linda notification
3. Nadia lead assignment → Linda queue
4. Linda command execution → Nadia logs result

---

## Configuration

### Environment Variables
```bash
# LocalAuth
WHATSAPP_SESSION_DIR=./sessions
WHATSAPP_ENABLED=true
LINDA_ENABLE=true

# Google Contacts Sync
GOOGLE_CONTACTS_API_KEY=...
GOOGLE_SERVICE_ACCOUNT_JSON=...

# AI/ML
CLAUDE_API_KEY=...
OPPORTUNITYSCORER_MODEL=claude-3.5-sonnet

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

### LocalAuth Session Setup (QR Code Flow)
```
1. Agent scans QR code with WhatsApp phone
2. LocalAuth stores credentials locally
3. Sessions persist in ./sessions/session-{phoneNumber}/
4. No password needed; uses WhatsApp protocol directly
5. Auto-refresh every 30 days (WhatsApp requirement)
6. Manual refresh endpoint available if needed
```

---

## Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Session Initialization** | <5 seconds | From QR to connected |
| **Command Execution** | <2 seconds | Property search via API |
| **Message Send** | <1 second | Via LocalAuth client |
| **Contact Sync** | <30 seconds | Google→MongoDB for 100+ contacts |
| **Uptime** | 99%+ | Auto-recovery on disconnect |
| **Rate Limiting** | 1 msg/6 sec per user | WhatsApp web standard |

---

## Real Estate Workflow Example

### Scenario: Agent "Ahmed" Receives New Lead

```
1. Customer (via WhatsApp): "Show me 2BR apartments in Dubai Marina"
   ↓
2. Nadia (webhook): Receives message
   ↓
3. Nina (NLP): Extracts intent="property_search", slots={type: "2BR", location: "Dubai Marina"}
   ↓
4. Linda (notification): "New qualified lead! 2BR apartment search"
   ↓
5. Ahmed (agent): Clicks "View Lead" in Linda dashboard
   ↓
6. Linda executes: property dubai-marina-2br (PROPERTY command)
   ↓
7. Response: Property details, images, pricing
   ↓
8. Ahmed sends via Linda: "This property is perfect! Want to schedule a tour?"
   ↓
9. Customer: "Yes, tomorrow 2pm"
   ↓
10. Ahmed executes: tour dubai-marina-2br tomorrow 2pm (SCHEDULE_TOUR command)
    ↓
11. Result: Tour confirmed, customer notified, calendar updated
    ↓
12. Analytics: Lead scored 92/100, tour converted lead to opportunity
```

---

## Security & Compliance

- ✅ **End-to-End Encryption**: WhatsApp Signal protocol + LocalAuth
- ✅ **Session Isolation**: Each agent session encrypted separately
- ✅ **No Cloud Storage**: Sessions remain local on device (backup in MongoDB encrypted)
- ✅ **Access Control**: Agent can only access own sessions
- ✅ **Audit Trail**: All commands logged with timestamp + executor
- ✅ **RERA Compliance**: No unauthorized contact storage
- ✅ **GDPR**: Easy session deletion + contact purge

---

## Support & Troubleshooting

### Common Issues

**Q: QR code not scanning?**  
A: Ensure WhatsApp App is updated, phone has good light, camera focus is clear

**Q: Session disconnected?**  
A: Linda auto-reconnects within 5 seconds. If persistent, use `/api/linda/session/:id/recover`

**Q: Commands not working?**  
A: Check that property ID is correct and command syntax matches

**Q: Contacts not syncing?**  
A: Verify Google API credentials, restart sync with `/api/linda/contacts/sync`

---

## Future Enhancements

- [ ] Multi-language support (Arabic, Urdu)
- [ ] Voice message transcription
- [ ] Computer vision for property images
- [ ] Integration with property inspection apps
- [ ] Document signing via WhatsApp
- [ ] Payment collection (ePayments integration)
- [ ] Video call integration with WhatsApp calling

---

## Related Documentation
- **Nina** — Conversation flow design & NLP bot development  
- **Nadia** — WhatsApp Business CRM with Meta Cloud API  
- **MaryInventoryCRM** — Property inventory management  
- **ClaraLeadsCRM** — Lead pipeline & conversion funnel
