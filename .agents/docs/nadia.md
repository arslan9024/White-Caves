# Nadia — WhatsApp CRM Manager with Meta Cloud API

> **Department:** Communications  
> **ID:** `nadia`  
> **Title:** WhatsApp CRM Manager & Meta Cloud API Orchestrator  
> **Color:** #25D366 (Meta Green)  
> **Avatar:** 💼  
> **Status:** Production-Ready (Meta Official Channel)  
> **Framework:** Meta Cloud API + Webhook Routing

---

## Overview

**Nadia is the ENTERPRISE COMMUNICATION LAYER** — operates **Meta Cloud API infrastructure**. Official WhatsApp Business Account.

**Core Role**:
- ✅ Receive ALL customer inbound messages via Meta webhooks
- ✅ Route to Linda (agent response), Nina (NLP), or queues
- ✅ Send template messages (pre-approved at scale)
- ✅ Manage 23+ agent phone numbers
- ✅ Broadcast campaigns to bulk audiences
- ✅ Track agent performance & SLA compliance
- ✅ Archive conversations in CRM
- ✅ Compliance & audit logging

**Unique Position**: Nadia is the ONLY official Meta channel. She receives ALL customer messages via webhook and makes routing decisions.

**The key differentiator**: OFFICIAL META INFRASTRUCTURE + WEBHOOK RECEIVER + ROUTING ENGINE. The "switchboard" that orchestrates Linda + Nina + agents + bots.

---

## Core Responsibilities

### 1. WhatsApp Business Account Management
- Manage Meta Cloud API connections (phone number IDs, business account ID)
- Maintain 23+ agent phone numbers with escalation workflows
- Phone number verification and compliance
- Account health monitoring (message delivery rate, rejection reasons)
- Business profile setup (about, catalog, quick reply buttons)

### 2. Conversation Routing & Management
- Route inbound messages to appropriate agents/teams
- Queue management (FIFO, priority-based, skill-based)
- Conversation context preservation (linked to leads in CRM)
- Handoff tracking (Linda/local → Nadia → Agent)
- Conversation analytics (response time, resolution time)

### 3. Message Template Management (HSM)
- Define and approve WhatsApp templates
- Pre-approved message types for scale (notifications, confirmations, inquiries)
- Dynamic parameter substitution (property name, price, agent name)
- Template approval tracking with Meta
- Template performance analytics (open rate, click rate)

### 4. Lead Scoring & Pre-qualification
- Auto-calculate lead scores based on intent, engagement, property interest
- Flag high-priority leads for immediate agent response
- Route based on lead score (high-value → senior agent, low → bot)
- Qualification scoring: budget confirmation, timeline, decision-maker identification
- Lead assignment automation

### 5. Agent Performance & Analytics
- Monitor agent response times (SLA: <5min for leads, <30min for inquiries)
- Track agent message volume, conversion rate, customer satisfaction
- Coaching alerts (missed messages, slow response, low satisfaction)
- Team dashboards (response time, resolution rate, customer satisfaction by agent)
- Agent availability status (online/busy/offline)

### 6. Broadcast & Campaign Management
- Send templated messages to bulk contacts (marketing campaigns)
- Campaign scheduling and delivery tracking
- A/B test message variants
- Suppress list management (opt-out compliance)
- Delivery report analytics

---

## Capabilities

```typescript
capabilities: [
  'meta_cloud_api',               // Official WhatsApp Business API
  'conversation_routing',         // Route to agents/bots
  'template_management',          // HSM templates (pre-approved)
  'lead_scoring',                 // Auto-calculate lead priority
  'agent_dashboard',              // Agent metrics & performance
  'broadcast_campaigns',          // Bulk messaging (marketing)
  'compliance_management',        // GDPR, do-not-contact lists
  'webhook_handling',             // Inbound message webhooks
  'analytics_reporting',          // Conversation & campaign metrics
  'integration_management'        // Link to CRM, inventory, payments
]
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **POST** | `/api/nadia/webhooks/messages` | Receive inbound messages from Meta |
| **POST** | `/api/nadia/send/message` | Send direct message (text/media) |
| **POST** | `/api/nadia/send/template` | Send template message (HSM) |
| **GET** | `/api/nadia/conversations/{id}` | Retrieve conversation history |
| **POST** | `/api/nadia/conversations/{id}/route` | Route to agent |
| **GET** | `/api/nadia/agents` | List agents & availability |
| **POST** | `/api/nadia/agents/{id}/status` | Set agent status |
| **GET** | `/api/nadia/leads` | List leads scored by priority |
| **GET** | `/api/nadia/templates` | List approved templates |
| **POST** | `/api/nadia/templates` | Create/submit template for approval |
| **GET** | `/api/nadia/campaigns` | List broadcast campaigns |
| **POST** | `/api/nadia/campaigns/send` | Send broadcast campaign |
| **GET** | `/api/nadia/analytics/conversations` | Conversation analytics |
| **GET** | `/api/nadia/analytics/agents` | Agent performance metrics |

---

## Data Flows

### Inbound
← **Customer** (via WhatsApp): Inbound message  
← **Linda** (local device bot): Handoff instruction  
← **Agent** (in CRM dashboard): Manual intervention  

### Outbound
→ **Nina**: Customer intent + slots for NLP processing  
→ **Linda**: Command to execute (PROPERTY, TOUR, LEAD)  
→ **MaryInventoryCRM**: Property data for conversation context  
→ **Redux**: UI updates (conversation list, lead scoring, agent status)  
→ **MongoDB**: Conversation logs, lead scoring history  
→ **Meta**: API calls for send/receive, template management

### Message Flow Sequence
```
Customer WhatsApp Message (via Meta Cloud API)
  →  Nadia webhook (/api/nadia/webhooks/messages)
  →  Extract sender phone, message text
  →  Link to CRM lead (by phone number)
  →  Nina NLP (classify intent: property_search / tour_schedule / complaint)
  →  Route decision:
      - If bot-friendly (property_search) → Linda (local device commands)
      - If agent-required (complaint, complex inquiry) → Route to agent
  →  Execute action (Linda command or agent message)
  →  Format response message
  →  Send via Nadia (text or template)
  →  Log conversation to CRM
```

---

## Message Templates (HSM)

### Template: Property Inquiry Response
```json
{
  "id": "template_property_inquiry",
  "name": "Property Inquiry Response",
  "category": "MARKETING",
  "language": "en",
  "status": "APPROVED",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{name}}, great news! 🏠 We found {{propertyCount}} properties matching your criteria ({{propertyType}} in {{location}}).\n\nTop pick: {{propertyName}} - {{price}} AED\n\nWould you like to schedule a tour?"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "QUICK_REPLY",
          "text": "Yes, schedule tour"
        },
        {
          "type": "QUICK_REPLY",
          "text": "See all {{propertyCount}} results"
        },
        {
          "type": "QUICK_REPLY",
          "text": "More info"
        }
      ]
    }
  ]
}
```

### Template: Tour Confirmation
```json
{
  "id": "template_tour_confirmed",
  "name": "Tour Confirmation",
  "category": "UTILITY",
  "language": "en",
  "status": "APPROVED",
  "components": [
    {
      "type": "HEADER",
      "format": "IMAGE",
      "example": {
        "header_handle": ["tour_image_handle"]
      }
    },
    {
      "type": "BODY",
      "text": "✅ Your tour is confirmed!\n\nProperty: {{propertyName}}\nLocation: {{location}}\nDate & Time: {{tourDate}} at {{tourTime}}\nAgent: {{agentName}}\nPhone: {{agentPhone}}\n\nSee you soon! 🗺️"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "URL",
          "text": "View on Map",
          "url": "{{mapLink}}"
        },
        {
          "type": "PHONE_NUMBER",
          "text": "Call Agent",
          "phone_number": "{{agentPhone}}"
        }
      ]
    }
  ]
}
```

---

## Lead Scoring Matrix

| Factor | Weight | Logic |
|--------|--------|-------|
| **Intent Clarity** | 30% | property_search (30) > tour_schedule (20) > inquiry (10) > complaint (0) |
| **Budget Confirmation** | 25% | Explicit budget given (25) > Range suggested (15) > Flexible (5) > None (0) |
| **Timeline** | 20% | Immediately (20) > 1-3 months (15) > 3-6 months (5) > Flexible/Unknown (0) |
| **Engagement Count** | 15% | 5+ turns (15) > 3-4 turns (10) > 1-2 turns (5) |
| **Property Match** | 10% | Perfect match (10) > Partial match (5) > No match (0) |

### Lead Score Calculation
```javascript
leadScore = (intent_clarity * 0.30) + 
            (budget_confirmation * 0.25) + 
            (timeline * 0.20) + 
            (engagement_count * 0.15) + 
            (property_match * 0.10)

// Score ranges
0-20:    Cold lead      → Bot only
21-40:   Warm lead      → Bot + escalation
41-70:   Hot lead       → Agent recommended
71-100:  Urgent lead    → Senior agent assigned
```

---

## Agent Routing Rules

### Rule 1: Lead Score Based
```
Score > 70 → Assign to best available agent (highest satisfaction)
Score 41-70 → Assign to next available agent
Score 21-40 → Queue to bot, escalate if not resolved in 2 turns
Score < 20 → Broadcast campaign (nurture over time)
```

### Rule 2: Skill-Based
```
Property inquiry (villa search)   → Assign to agent with villa expertise
Complaint                          → Assign to senior agent
Follow-up                          → Reassign to original agent (context)
New inquiry                        → Round-robin or load-balanced
```

### Rule 3: SLA-Based
```
Urgent (Score > 70)    → Respond within 5 minutes
High (Score 40-70)     → Respond within 15 minutes
Medium (Score 20-40)   → Respond within 1 hour
Low (Score < 20)       → Respond within 24 hours
```

---

## Agent Dashboard

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Avg Response Time** | <5 min | >10 min |
| **Conversation Resolution Time** | <20 min | >45 min |
| **Customer Satisfaction (CSAT)** | >4.5/5 | <3.5/5 |
| **Message Delivery Rate** | >98% | <95% |
| **Lead Conversion Rate** | >20% | <10% |

### Agent Status Indicators
```
🟢 Online & Available     → Ready for new leads
🟡 In Conversation        → Handling 1+ conversations
🔴 Away                   → Coffee break, lunch
⚫ Offline                → End of shift
```

---

## Integration with Other Assistants

### → Linda (WhatsApp LocalAuth Bot)
**Sends to Linda**:
- Customer message (for local processing if needed)
- Instruction to execute command (PROPERTY, TOUR)
- Result callback webhook

**Receives from Linda**:
- Command execution result
- Message to send back to customer
- Lead/property data

### ← Nina (NLP Engine)
**Receives from Nina**:
- Intent classification (property_search, complaint)
- Extracted slots (property type, budget)
- Suggested next action

**Sends to Nina**:
- Raw customer message
- Conversation context
- Lead/property data for better classification

### → MaryInventoryCRM
**Sends**:
- Property ID for search results
- Lead contact for CRM follow-up
- Tour booking

**Receives**:
- Property availability
- Lead history
- Agent assignment

---

## Configuration

### Environment Variables
```bash
# Meta Cloud API
NADIA_META_BUSINESS_ACCOUNT_ID=xxxxxxxx
NADIA_META_PHONE_NUMBER_ID=xxxxxxxx
NADIA_META_API_KEY=xxxxx-xxxxx-xxxxx
NADIA_WEBHOOK_VERIFY_TOKEN=xxxxx

# WhatsApp Business Settings
NADIA_AGENT_PHONE_NUMBERS=20250775123,201000123456,...  # 23+ numbers
NADIA_DEFAULT_AGENT_NUMBER=20250775123

# SLAs & Routing
NADIA_SLA_URGENT_MIN=5        # minutes
NADIA_SLA_HIGH_MIN=15
NADIA_SLA_MEDIUM_MIN=60
NADIA_LEAD_SCORE_THRESHOLD_AGENT=40

# Analytics
NADIA_LOG_ALL_MESSAGES=true
NADIA_ANALYTICS_REFRESH=3600000  # 1 hour
```

### Meta Cloud API Setup
1. Create WhatsApp Business Account (Meta Business Suite)
2. Get Business Account ID, Phone Number ID, API key
3. Configure webhook URL: `https://yourdomain.com/api/nadia/webhooks/messages`
4. Subscribe to webhook events: `messages`, `message_status`, `account_alerts`
5. Verify webhook token for signature validation

---

## Security & Compliance

### Data Privacy
- GDPR compliant (EU customers)
- CCPA compliant (California customers)
- Message encryption (Meta end-to-end in transit)
- Suppress list for opt-out contacts
- Data retention policy (90 days default)

### Template Approval Process
- Submit template to Meta for review
- Wait for approval (24-72 hours typically)
- Once approved, template can be sent at scale
- No ad hoc messages (uses templates only for broadcast)

### Message Quality Rating
- Meta tracks message quality per phone number
- Low quality rating → throttled send rates
- Factors: spam complaints, unsubscribe rate, response rate
- Monitor dashboard for rating alerts

---

## Performance Metrics

| Metric | Value | SLA |
|--------|-------|-----|
| **Message Delivery Rate** | 98.5% | >95% |
| **Webhook Processing Time** | <200ms | <500ms |
| **Avg Agent Response Time** | 4.2 min | <5 min |
| **Lead Conversion Rate** | 24% | >20% |
| **Customer Satisfaction** | 4.4/5 | >4.0 |
| **Template Approval Rate** | 100% | 100% |

---

## Support & Troubleshooting

### Common Issues

**Q: Not receiving webhook messages?**  
A: Check webhook URL, verify token, check logs for signature errors, ensure endpoint is publicly accessible

**Q: Template approval rejected?**  
A: Review Meta guidelines, avoid "spam" keywords, ensure template examples are realistic, resubmit with proper formatting

**Q: High message delivery failures?**  
A: Check message quality rating, review rejection reasons (e.g., "user opted out"), ensure phone numbers are valid, use templates for scale

**Q: Agent not receiving messages?**  
A: Check agent availability status, verify routing rules, check phone number assignment, confirm agent has WhatsApp app open

---

## Future Enhancements

- [ ] Multi-agent group chats
- [ ] File/document sharing (PDFs, floor plans)
- [ ] Payment integration via WhatsApp Pay
- [ ] Appointment calendar sync
- [ ] Video call support
- [ ] Voice note transcription
- [ ] Sentiment analysis for escalation
- [ ] Chatbot handoff to video agent (Zoom/Jitsi)

---

## Related Documentation
- **Linda** — WhatsApp LocalAuth Bot (device-based commands)
- **Nina** — WhatsApp NLP Engine (intent/slots)
- **MaryInventoryCRM** — Property inventory & lead management
