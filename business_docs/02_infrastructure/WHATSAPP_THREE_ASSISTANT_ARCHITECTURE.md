# WhatsApp Three-Assistant Architecture
## Linda + Nina + Nadia: Complete Integration Design

**Date**: March 29, 2026  
**Status**: Architecture Ready for Implementation  
**Purpose**: Define distinct roles and integration points for three WhatsApp AI assistants

---

## Executive Summary

White Caves uses **THREE COMPLEMENTARY WhatsApp ASSISTANTS**, each handling a distinct layer:

| Assistant | Layer | Framework | Role |
|-----------|-------|-----------|------|
| **Nadia** 💼 | **Inbound** (Webhook) | Meta Cloud API | Receives ALL customer messages via webhook, routes decisions |
| **Nina** 🧠 | **Processing** (Logic) | Claude NLP + FSM | Classifies intent, extracts entities, builds conversation state |
| **Linda** 🤖 | **Outbound** (Sending) | whatsapp-web.js | Sends messages via agent devices (local client) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ CUSTOMER MESSAGES (Inbound via Meta)                            │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
                    ┌─────────────────▼──────────────────┐
                    │ NADIA WEBHOOK RECEIVER             │
                    │ (Meta Cloud API → CRM)             │
                    │ • Receives all inbound             │
                    │ • Validates signature              │
                    │ • Queues message                   │
                    └─────────────────┬──────────────────┘
                                      │
                    ┌─────────────────▼──────────────────┐
                    │ NINA NLP PROCESSOR                 │
                    │ (Logic Layer - Pure Data)          │
                    │ • Intent classification            │
                    │ • Entity extraction                │
                    │ • State machine mgmt               │
                    │ • Lead scoring                     │
                    └─────────────────┬──────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
    ┌────▼───┐              ┌─────────▼─────┐            ┌────────▼────┐
    │ NADIA  │              │ NADIA ROUTE   │            │ NADIA QUEUE │
    │ ACTION │              │ TO AGENT      │            │ (Bot/Msg)   │
    │ (Send) │              │               │            │             │
    └────┬───┘              └────────┬──────┘            └────────┬────┘
         │                          │                           │
    ┌────▼──────────────┐    ┌──────▼──────────────┐    ┌───────▼──────────┐
    │ LINDA             │    │ LINDA              │    │ NADIA            │
    │ COMMAND           │    │ CUSTOMER           │    │ TEMPLATE SEND    │
    │ (on device)       │◄───┤ MESSAGE            │    │ (marketing/       │
    │                  │    │ (to agent)         │    │  notifications)   │
    └────┬─────────────┘    └──────┬──────────────┘    └───────┬──────────┘
         │                         │                          │
    ┌────▼─────────────────────────▼──────────────────────────▼────┐
    │ AGENT/CUSTOMER RESPONSE (message sent back to customer)      │
    └───────────────────────────────────────────────────────────────┘
```

---

## Layer 1: NADIA (Inbound/Webhook Layer)

### Responsibilities
```
1. Webhook Listener (Meta Cloud API)
   - Receive inbound messages from customers
   - Verify webhook signature (HMAC-SHA256)
   - Parse customer message + metadata (phone, id, timestamp)
   - Queue for processing

2. Routing Decision Engine
   - Route to NINA for NLP (if needs intelligence)
   - Route to LINDA for agent response (if qualified agent)
   - Queue for template response (if marketing)
   - Archive in CRM (all messages)

3. Lead Scoring & Prioritization
   - Score lead by Nina output
   - Assign SLA tier (HIGH/MEDIUM/LOW)
   - Route to appropriate agent pool

4. Template Send (Broadcast)
   - Send pre-approved templates at scale
   - Campaign tracking (sent/delivered/read)
   - Suppress list management

5. Analytics & Reporting
   - Message volume tracking
   - Response time SLA (target <5min)
   - Delivery rate monitoring
   - Agent performance dashboard
```

### Key Endpoints
```
POST   /api/nadia/webhooks/messages              [Receive inbound]
POST   /api/nadia/send/template                  [Send templates]
GET    /api/nadia/conversations/:id              [Conversation history]
POST   /api/nadia/routing/agent-assignment       [Route to agent]
GET    /api/nadia/analytics/sla                  [SLA tracking]
```

### Critical Constraint
```
❌ NADIA DOES NOT:
- Send personal messages (that's LINDA via agent)
- Process NLP (that's NINA)
- Manage local sessions (that's LINDA)
```

---

## Layer 2: NINA (Processing/Logic Layer)

### Responsibilities
```
1. Intent Classification
   - Input: raw customer message
   - Process: Claude 3.5 Sonnet NLP
   - Output: intent (property_search, tour_schedule, lead_qualify, etc.)
   - Confidence: 0-100%

2. Entity Extraction
   - Property: type, location, budget, size
   - Timeline: ASAP, 1-3mo, 3-6mo, flexible
   - Contact: name, phone, email
   - Validation + confidence per entity

3. Conversation State Management
   - Maintain FSM (state machine) per thread
   - Track conversation phase (greeting → qualification → info → booking → follow-up)
   - Remember previous context
   - Suggest next action

4. Flow Design & Testing
   - Visual builder for conversation flows
   - Node types: message, condition, input, action, webhook, handler
   - A/B testing (version branching)
   - Accuracy metrics per flow

5. Lead Qualification Score
   - Combine: intent + entities + engagement + timeline
   - Output: 0-100 score (hot lead if >75)
   - Route high scores to senior agents
```

### Key Endpoints
```
POST   /api/nina/nlp/intent                      [Classify intent]
POST   /api/nina/nlp/entities                    [Extract entities]
GET    /api/nina/flows                           [List flows]
POST   /api/nina/flows/:id/test                  [Test locally]
GET    /api/nina/analytics/accuracy              [Intent accuracy]
```

### Critical Constraint
```
❌ NINA DOES NOT:
- Listen to webhooks (that's NADIA)
- Send messages (that's LINDA or NADIA)
- Manage phone numbers (that's NADIA)
- Process inbound messages directly (NADIA calls NINA)
```

---

## Layer 3: LINDA (Outbound/Sending Layer)

### Responsibilities
```
1. Local WhatsApp Client Management
   - Initialize whatsapp-web.js on agent device
   - QR code generation (valid 30 seconds)
   - Session persistence + encryption
   - Auto-reconnect on disconnect (exponential backoff)
   - Health check ping every 30 seconds

2. Message Sending (Agent → Customer)
   - Send text messages (instant, <1 second latency)
   - Send media (images, documents, videos)
   - No Meta approval needed
   - No rate limits (local client limit)
   - No cost (agent's WhatsApp account)

3. Real Estate Command Execution
   - PROPERTY {type} {location} → property details
   - PRICING {id} → ROI/yield calculations
   - SCHEDULE_TOUR {id} {date} → calendar integration
   - CONTRACT {id} → generate + send PDF
   - FINANCING {budget} → mortgage calculator
   - COMPARABLE {id} → show similar properties
   - LEAD_SCORE {id} → Claude AI qualification
   - Custom commands extensible

4. Contact Management
   - Sync Google Contacts → MongoDB
   - Local contact cache
   - Message history per contact
   - Interaction tracking

5. Session Recovery
   - Manual recovery if device offline
   - Session backup in MongoDB
   - Restore on reconnection
```

### Key Endpoints
```
POST   /api/linda/send-message                   [Send message]
GET    /api/linda/status                         [Session status]
POST   /api/linda/qr-generate                    [New QR code]
POST   /api/linda/commands/execute               [Run command]
GET    /api/linda/contacts                       [List contacts]
POST   /api/linda/session/:id/recover            [Manual recovery]
```

### Critical Constraint
```
❌ LINDA DOES NOT:
- Receive inbound messages (that's NADIA via webhook)
- Process NLP (that's NINA)
- Manage agent performance dashboard (that's NADIA)
- Send templates (that's NADIA)
```

---

## Data Flow Examples

### Example 1: Customer Inquires About Property (Full Flow)

```
STEP 1: Customer sends message via WhatsApp
   Message: "Hi, I'm interested in 2BR villa in Downtown Dubai, 
             my budget is 2M AED"

STEP 2: NADIA receives via webhook
   ├─ Webhook signature verification ✓
   ├─ Parse: customer_phone, message_id, timestamp
   └─ Queue for processing

STEP 3: NADIA calls NINA for processing
   └─ NINA processes and returns:
      {
        intent: "property_search",
        confidence: 95,
        entities: {
          property_type: "villa",
          bedrooms: 2,
          location: "Downtown Dubai",
          budget_aed: 2000000,
          budget_confidence: 90
        },
        timeline: "not_specified",
        lead_score: 82
      }

STEP 4: NADIA routing decision
   └─ Score 82 = HOT LEAD
      └─ Route to senior agent (via LINDA)

STEP 5: NADIA notifies (LINDA on agent device)
   └─ LINDA displays notification:
      "🔥 Hot Lead: 2BR villa, Downtown, 2M AED budget"

STEP 6: Agent (via LINDA) responds
   ├─ Agent types: "Perfect! I have 3 great options for you"
   ├─ Agent executes: /PROPERTY villa downtown 2000000
   ├─ LINDA fetches matching properties from MongoDB
   ├─ LINDA sends formatted response to customer
   └─ NADIA archives conversation

STEP 7: Conversation continues
   └─ Agent might: schedule tour, send contract template, etc.
```

### Example 2: Marketing Campaign (Template Broadcast)

```
STEP 1: Nadia (backend) initiates campaign
   ├─ Select template: "New property listings"
   ├─ Target audience: 5,000 previous inquiries
   └─ Schedule: send now

STEP 2: NADIA sends templates at scale
   ├─ Use Meta Cloud API (pre-approved template)
   ├─ Rate limit: 80 msgs/sec
   ├─ Track: sent/delivered/read/clicked
   └─ Update suppress list (do-not-contact)

STEP 3: Customer receives template
   └─ Template response→ NADIA webhook
      └─ (goes through same flow as Step 2 above)
```

---

## State Machines

### NADIA Routing State Machine
```
         ┌─────────────────────┐
         │  WEBHOOK RECEIVED   │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────────┐
         │  VERIFY SIGNATURE       │
         └──────────┬──────────────┘
                    │
         ┌──────────▼──────────────────┐
         │  CALL NINA NLP PROCESSOR    │
         └──────────┬──────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
INTENT:        INTENT:          INTENT:
PROPERTY_      LEAD_            COMPLAINT
SEARCH         QUALIFY          
    │               │               │
    │      ┌────────▼──────┐       │
    │      │ NINA SCORE >75│       │
    │      │ HOT LEAD      │       │
    │      └────────┬──────┘       │
    │               │              │
    │      ┌────────▼──────────┐   │
    │      │  ROUTE TO AGENT   │   │
    │      │  VIA LINDA        │   │
    │      └────────┬──────────┘   │
    │               │              │
    ├───────────────┼──────────────┤
    │               │              │
QUEUE FOR:  SEND TEMPLATE:   SEND ESCALATION:
BOT FLOW    OR QUEUE         TO SUPPORT TEAM

    │               │              │
    └───────────────┼──────────────┘
                    │
         ┌──────────▼──────────┐
         │  ARCHIVE IN CRM     │
         └─────────────────────┘
```

### NINA Conversation FSM
```
STATE 1: greeting
   └─ Customer: "Hi"
   └─ Intent: contact_establishment
   └─ Action: "Welcome message"

STATE 2: qualification
   └─ Customer: "Looking for villa"
   └─ Intent: property_search
   └─ Slots: property_type, location
   └─ Action: "Ask for budget"

STATE 3: property_info
   └─ Customer: "2M AED budget"
   └─ Intent: lead_qualify
   └─ Slots: budget, timeline
   └─ Action: "Show matching properties"

STATE 4: booking
   └─ Customer: "Can I see it tomorrow?"
   └─ Intent: schedule_tour
   └─ Action: "Book tour, send confirmation"

STATE 5: follow-up
   └─ After tour completion
   └─ Action: "Send financing options"

STATE 6: closed
   └─ Deal won/lost/no-follow-up
   └─ Action: "Archive conversation"
```

---

## Integration Rules (Critical)

### ✅ ALLOWED Data Flows
```
NADIA → NINA                [Route message for processing]
NADIA → LINDA               [Notify agent of new message]
NINA  → NADIA               [Return structured data]
LINDA → NADIA               [Report message sent + status]
LINDA → NINA                [Request command execution]
```

### ❌ FORBIDDEN Data Flows
```
❌ NADIA ↔ LINDA directly     [They communicate via NINA]
❌ NINA → NADIA webhook       [NINA doesn't receive webhooks]
❌ LINDA → webhook            [LINDA doesn't receive webhooks]
❌ LINDA → customer direct    [Messages go through NADIA archive]
```

---

## Key Metrics & SLAs

### NADIA (Inbound/Routing)
```
- Webhook receive latency (target: <100ms)
- Message queue depth (target: <50 pending)
- Routing accuracy (target: >95%)
- Archive reliability (target: 100%)
```

### NINA (Processing)
```
- Intent classification accuracy (target: >90%)
- Entity extraction success rate (target: >85%)
- Processing latency (target: <2 seconds)
- Lead score correlation (target: >80% accurate)
```

### LINDA (Sending)
```
- Message send latency (target: <1 second)
- Session uptime (target: >99%)
- Connection recovery time (target: <10 seconds)
- Contact sync success (target: >99%)
```

---

## Environment Setup

### Configuration Files
```
.env:
- NADIA_META_WABA_ID
- NADIA_META_PHONE_ID
- NADIA_META_ACCESS_TOKEN
- NADIA_WEBHOOK_VERIFY_TOKEN
- NINA_CLAUDE_API_KEY
- LINDA_ENABLE_MULTIACCOUNT
- LINDA_SESSION_DIR

.env.local (per agent):
- LINDA_AGENT_PHONE
- LINDA_SESSION_ID
```

---

## Execution Roadmap

**Phase 1: Setup Nadia**
- [ ] Create Meta Business Account
- [ ] Register WhatsApp Business Account (WABA)
- [ ] Get phone number ID + access token
- [ ] Create webhook listener
- [ ] Test webhook delivery

**Phase 2: Implement Nina**
- [ ] Integrate Claude API
- [ ] Build NLP classifier
- [ ] Create entity extraction
- [ ] Build FSM state machine
- [ ] Create flow builder UI

**Phase 3: Deploy Linda**
- [ ] Clone arslan9024/whatsapp-bot-linda repo
- [ ] Adapt to White Caves paths/models
- [ ] Create QR code system
- [ ] Test local session management
- [ ] Add command executor

**Phase 4: Integration Testing**
- [ ] Full message flow: customer → Nadia → Nina → Linda → customer
- [ ] Template broadcast: Nadia send → customer response → Nadia receive
- [ ] Lead routing: hot lead detection → agent notification
- [ ] SLA monitoring: message timing, agent response

---

## Success Criteria

✅ All three assistants deployed and operational  
✅ Full customer message flow working (webhook to response)  
✅ Intent classification accuracy >90%  
✅ Agent response time <5 minutes (SLA)  
✅ All conversations archived in CRM  
✅ Team dashboard shows real-time metrics  

---

**Status**: Ready for Implementation ✅  
**Next Steps**: Begin Phase 1 (Nadia setup)
