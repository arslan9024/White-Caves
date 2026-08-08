# Nina — WhatsApp NLP Engine & Bot Intelligence

<!-- markdownlint-disable MD009 MD022 MD031 MD032 MD040 MD060 -->

> **Department:** Communications  
> **ID:** `nina`  
> **Title:** WhatsApp NLP Engine & Conversation Intelligence  
> **Color:** #06B6D4 (Cyan)  
> **Avatar:** 🧠  
> **Status:** Active — requirement catalog expanded.  
> **Framework:** Claude 3.5 Sonnet NLP + Flow State Machine

---

## Overview

**Nina is the CONVERSATION INTELLIGENCE ENGINE** — operates **purely in logic layer**. No webhooks. No message sending. Pure data processing.

**Core Role**:
- ✅ Classify intent from customer text (Claude NLP)
- ✅ Extract entities (property, budget, timeline, contact)
- ✅ Manage multi-turn conversation state machines
- ✅ Design & test conversation flows (visual builder)
- ✅ Calculate lead qualification scores
- ✅ Analyze conversation accuracy

**Unique Position**: Nina is the TRANSFORMER — takes raw text, extracts meaning, returns structured data for others to act on.

**The key differentiator**: PURE NLP/LOGIC. Nina never talks to customers directly. She only processes data for others (Nadia, Linda) to act on.

---

## Core Responsibilities

### 1. Intent Recognition (NLP)
- Classify customer intent: property_search, lead_qualification, schedule_tour, inquiry, complaint, etc.
- Use Claude 3.5 Sonnet API for context-aware classification
- Support multiple intents from single message
- Confidence scoring for uncertain classifications
- Real estate domain vocabulary optimization

### 2. Slot Filling (Entity Extraction)
- Extract property details: type, location, size, budget, purpose
- Extract timeline: immediately, 1-3 months, 3-6 months, flexible
- Extract contact info: name, phone, email
- Validate extracted entities
- Handle missing slots with clarifying questions

### 3. Multi-Turn Dialogue Management
- Maintain conversation state machine
- Support 5-10+ turn conversations
- Context awareness (remember previous messages)
- Error recovery (misunderstood input)
- Conversation branching based on user intent

### 4. Conversation Flow Design & Testing
- Visual flow builder (drag-drop canvas)
- Node types: message, decision, input, action, webhook, error_handler
- A/B testing support (version branching)
- Automated testing of conversation paths
- Performance analytics per flow

### 5. Bot Analytics & Performance Tracking
- Intent classification accuracy (%) 
- Slot filling success rate (%)
- Conversation completion rate (%)
- Average conversation length (turns)
- Error rate tracking
- User satisfaction metrics

## Requirement catalog

### REQ-NINA-001: Intent classification reliability

The system shall classify inbound messages into supported intents with confidence-scored outputs.

**Acceptance criteria:**

- [ ] Intent results include confidence and model metadata
- [ ] Ambiguous intents trigger fallback/escalation paths
- [ ] Classification outcomes are auditable per conversation

**Evidence:** intent classification report and low-confidence escalation audit.

### REQ-NINA-002: Entity extraction and slot governance

The system shall extract required entities for property and lead workflows with validation rules.

**Acceptance criteria:**

- [ ] Slot extraction returns structured key-value payloads
- [ ] Missing/invalid slots trigger clarifying prompts
- [ ] Extracted entities map to downstream command contracts

**Evidence:** slot extraction test report and command mapping log.

### REQ-NINA-003: Multi-turn flow execution integrity

The system shall execute conversation flows with deterministic state transitions and recovery controls.

**Acceptance criteria:**

- [ ] Flow state transitions are logged with node context
- [ ] Error handlers resolve or escalate failed branches
- [ ] Max-turn and timeout limits are enforced

**Evidence:** flow execution trace and error recovery summary.

### REQ-NINA-004: NLP analytics and optimization loop

The system shall publish NLP performance metrics to support iterative flow improvement.

**Acceptance criteria:**

- [ ] KPI metrics are reportable by flow and intent
- [ ] A/B flow variants track comparative outcomes
- [ ] Improvement actions are linked to observed metrics

**Evidence:** NLP analytics dashboard snapshot and optimization change log.

## Traceability

- Maps to `REQ-AI-001` through `REQ-AI-004` and messaging intelligence controls
- Aligns to `WC-SRS-014` and conversation orchestration artifacts
- Feeds intent routing, lead qualification, and assistant quality validation

---

## Capabilities

```typescript
capabilities: [
  'flow_builder',                 // Visual canvas for flow design
  'nlp_intent_recognition',       // Claude API intent classification
  'slot_filling',                 // Entity extraction & validation
  'multi_turn_dialogue',          // State machine conversation mgmt
  'entity_extraction',            // Parse property/user data
  'flow_versioning',              // A/B test flows, rollback
  'bot_analytics',                // Performance & accuracy metrics
  'conversation_recovery',        // Handle errors gracefully
  'custom_node_types',            // Extensible node library
  'flow_testing'                  // Automated test suite
]
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/api/nina/flows` | List conversation flows |
| **POST** | `/api/nina/flows` | Create new flow |
| **PUT** | `/api/nina/flows/:id` | Update flow |
| **GET** | `/api/nina/flows/:id/versions` | Version history |
| **POST** | `/api/nina/flows/:id/test` | Test flow locally |
| **POST** | `/api/nina/nlp/intent` | Classify user message intent |
| **POST** | `/api/nina/nlp/slots` | Extract entities from message |
| **GET** | `/api/nina/bots` | List running bot instances |
| **POST** | `/api/nina/bots/:id/start` | Start bot |
| **POST** | `/api/nina/bots/:id/stop` | Stop bot |
| **GET** | `/api/nina/analytics/flows/:id` | Flow performance metrics |
| **GET** | `/api/nina/analytics/intents` | Intent distribution |

---

## Data Flows

### Inbound
← **Nadia**: Webhook customer message  
← **Dev Team**: Flow design updates  
← **Linda**: Agent corrections (for feedback learning)

### Outbound
→ **Linda**: Intent + slots for command execution  
→ **Nadia**: Dialog response message  
→ **Redux**: UI updates (flow builder, analytics)  
→ **MongoDB**: Conversation logs, performance data

### Sequence
```
Customer Message (via Nadia webhook)
  →  Nina NLP (intent + slots)
  →  Flow Router (select conversation flow)
  →  Flow Executor (run nodes)
  →  Decision Node (branch on intent)
  →  Action Node (webhook call to property search)
  →  Linda (execute PROPERTY command)
  →  Response Node (format message)
  →  Nadia (send message back to customer)
```

---

## Conversation Flow: Property Inquiry Example

```json
{
  "id": "flow_property_inquiry_v2",
  "name": "Property Inquiry Flow",
  "version": 2,
  "status": "active",
  "nodes": [
    {
      "id": "start",
      "type": "message",
      "text": "Welcome! 🏠 I'm Nina. What are you looking for today?"
    },
    {
      "id": "collect_intent",
      "type": "nlp_intent",
      "intents": ["property_search", "lead_qualification", "schedule_tour"],
      "nextNodes": {
        "property_search": "collect_property_type",
        "schedule_tour": "tour_follow_up",
        "default": "escalate_to_agent"
      }
    },
    {
      "id": "collect_property_type",
      "type": "slot_fill",
      "slot": "property_type",
      "prompt": "What type of property? (Villa/Apartment/Studio/Shop)",
      "validation": ["villa", "apartment", "studio", "shop"],
      "nextNode": "collect_location"
    },
    {
      "id": "collect_location",
      "type": "slot_fill",
      "slot": "location",
      "prompt": "Which area? (Dubai Marina/Downtown/JBR/Your area?)",
      "nextNode": "collect_budget"
    },
    {
      "id": "collect_budget",
      "type": "slot_fill",
      "slot": "budget",
      "prompt": "Budget range? (e.g., 500K-1M AED)",
      "nextNode": "search_properties"
    },
    {
      "id": "search_properties",
      "type": "webhook",
      "url": "/api/linda/commands/execute",
      "params": {
        "command": "PROPERTY",
        "propertyType": "$",
        "location": "$",
        "maxPrice": "$"
      },
      "nextNode": "show_results"
    },
    {
      "id": "show_results",
      "type": "message",
      "text": "Found ",
      "nextNode": "offer_tour"
    },
    {
      "id": "offer_tour",
      "type": "decision",
      "prompt": "Want to schedule a tour?",
      "options": [
        { "label": "Yes", "nextNode": "schedule_tour_node" },
        { "label": "No", "nextNode": "save_contact" }
      ]
    },
    {
      "id": "schedule_tour_node",
      "type": "slot_fill",
      "slot": "preferred_time",
      "prompt": "Preferred time? (Tomorrow 10am / Next week / etc)",
      "nextNode": "confirm_tour"
    },
    {
      "id": "confirm_tour",
      "type": "webhook",
      "url": "/api/linda/commands/execute",
      "params": {
        "command": "SCHEDULE_TOUR",
        "propertyId": "$",
        "time": "$"
      },
      "nextNode": "tour_confirmed"
    },
    {
      "id": "tour_confirmed",
      "type": "message",
      "text": "✅ Tour confirmed! Our agent will meet you ",
      "nextNode": "save_contact"
    },
    {
      "id": "save_contact",
      "type": "action",
      "action": "save_lead_to_crm",
      "params": {
        "phone": "$",
        "name": "$",
        "intent": "$",
        "property": "$",
        "score": "$"
      },
      "nextNode": "end"
    },
    {
      "id": "escalate_to_agent",
      "type": "message",
      "text": "Let me connect you with an agent 👋",
      "nextNode": "end"
    },
    {
      "id": "end",
      "type": "end",
      "text": "Goodbye! 👋"
    }
  ],
  "edges": [
    { "from": "start", "to": "collect_intent" },
    { "from": "collect_intent", "to": "collect_property_type", "condition": "intent == property_search" }
  ]
}
```

---

## NLP Intent Examples

### Intent: property_search
```javascript
{
  id: "intent_property_search",
  name: "property_search",
  keywords: ["show", "property", "villa", "apartment", "flat", "available", "listing"],
  slots: [
    { name: "property_type", type: "enum", values: ["villa", "apartment", "studio", "shop"] },
    { name: "location", type: "string", validation: "emirate_or_area" },
    { name: "budget", type: "range", pattern: "\\d+K-\\d+M" }
  ],
  flow_id: "flow_property_inquiry_v2",
  confidence_threshold: 0.75
}
```

### Intent: lead_qualification
```javascript
{
  id: "intent_qualification",
  name: "lead_qualification",
  keywords: ["interested", "serious", "timeline", "budget", "commitment", "purchase"],
  slots: [
    { name: "timeline", type: "enum", values: ["immediately", "1-3m", "3-6m", "flexible"] },
    { name: "budget", type: "range" },
    { name: "decision_maker", type: "enum", values: ["me", "spouse", "family", "company"] }
  ],
  flow_id: "flow_lead_qualification_v1",
  confidence_threshold: 0.85
}
```

---

## Flow Versioning & A/B Testing

### Version Management
```
flow_property_inquiry_v1 (20% traffic)  → 62% completion rate
flow_property_inquiry_v2 (70% traffic)  → 78% completion rate  ← Active
flow_property_inquiry_v3 (10% traffic)  → Testing new node format
```

### A/B Test Configuration
```javascript
{
  flowId: "flow_property_inquiry",
  testType: "multi_variant",
  variants: [
    { version: "v1", traffic: 0.2, hypothesis: "Original flow" },
    { version: "v2", traffic: 0.7, hypothesis: "Simplified flow with fewer slots" },
    { version: "v3", traffic: 0.1, hypothesis: "AI-powered routing" }
  ],
  metrics: ["completion_rate", "avg_turns", "time_to_conversion"],
  duration: "7 days",
  winnerThreshold: 0.95 // 95% confidence interval
}
```

---

## Analytics Dashboard

| Metric | Value | Trend | Target |
|--------|-------|-------|--------|
| **Intent Accuracy** | 94.3% | ↑ +2.1% | 95% |
| **Slot Fill Success** | 91.7% | ↑ +1.5% | 92% |
| **Conversation Completion** | 78.2% | ↑ +3.2% | 85% |
| **Avg Conversation Length** | 6.3 turns | ↓ -0.5 | <6 |
| **Error Recovery Rate** | 87.4% | ↑ +2% | 90% |

### Intent Distribution (Last 7 Days)
```
property_search:          45% (↑ +5%)
lead_qualification:       28% (↓ -2%)
schedule_tour:            15% (→ stable)
inquiry:                   8% (↓ -1%)
complaint:                 4% (↑ +1%)
```

---

## Integration with Other Assistants

### ← Nadia (CRM Manager)
**Receives**: Customer message via webhook  
**Provides to**: Intent + slots for Linda action  
**Returns**: Dialog response text

### → Linda (Agent Bot)
**Sends**: Command name + parameters  
**Receives**: Command execution result  
**Uses**: For context in next turn

### → Analytics
**Logs**: Intent, slots, flow path, completion  
**Sends**: Performance metrics  
**Uses**: For model improvement

---

## Configuration

### Environment Variables
```bash
# NLP & AI
NINA_ENABLE=true
CLAUDE_API_KEY=xxxxxxx
CLAUDE_MODEL=claude-3.5-sonnet

# Flow Runtime
NINA_FLOW_TIMEOUT=30000        # 30 seconds per conversation
NINA_MAX_TURNS=20              # Max turns per conversation
NINA_CONFIDENCE_THRESHOLD=0.75 # Min confidence for intent

# Analytics
NINA_LOG_CONVERSATIONS=true
NINA_ANALYTICS_REFRESH=3600000 # 1 hour
```

### Flow Node Types

| Node Type | Purpose | Example |
|-----------|---------|---------|
| **message** | Send text to user | "Welcome!" |
| **input** | Collect user input | "What's your budget?" |
| **nlp_intent** | Classify message intent | Detect "property_search" |
| **slot_fill** | Extract entity | Extract property type |
| **decision** | Branch based on condition | If intent == search → go to search |
| **webhook** | Call external API | Call `/api/linda/commands` |
| **action** | Perform internal task | Save lead to CRM |
| **error_handler** | Handle failures | Retry or escalate |
| **end** | Terminate conversation | Exit flow |

---

## Real Estate NLP Optimization

### Domain-Specific Vocabulary
```javascript
// Real estate synonyms optimized
{
  "apartment": ["flat", "unit", "2BR", "studio", "1BR"],
  "villa": ["standalone", "standalone villa", "house"],
  "location": ["Dubai Marina", "Downtown Dubai", "JBR", "Business Bay"],
  "budget": ["AED 500K", "500,000", "price point", "range"],
  "timeline": ["ASAP", "immediately", "soon", "next month"]
}
```

### Pre-trained Models
- ✅ BERT for entity extraction
- ✅ Claude 3.5 Sonnet for context/reasoning
- ✅ Custom property vocabulary
- ✅ Real estate intent classification (97% accuracy)

---

## Performance Metrics

| Metric | Value | SLA |
|--------|-------|-----|
| **Model Inference Time** | <500ms | <1s |
| **Intent Accuracy** | 94% | >90% |
| **Slot Quality** | 91% | >85% |
| **Conversation Success** | 78% | >75% |
| **User Satisfaction** | 4.2/5 | >4.0 |

---

## Support & Troubleshooting

### Common Issues

**Q: Intent classification not working?**  
A: Check Claude API key, verify intent keywords in training data, increase confidence_threshold

**Q: Slot extraction failing?**  
A: Validate format in test, check entity patterns, review conversation context

**Q: Flow stuck in loop?**  
A: Check nextNode configuration, add/enable error handlers, test with mock data

**Q: Analytics not updating?**  
A: Verify logging enabled, check MongoDB connection, restart analytics refresh job

---

## Future Enhancements

- [ ] Multi-language support (Arabic, Urdu, Hindi)
- [ ] Voice-to-text integration
- [ ] Sentiment analysis
- [ ] Contextual memory (remember across sessions)
- [ ] Recommendation engine (suggest properties)
- [ ] Dynamic flow generation (ML-based)
- [ ] Integration with external chatbot platforms

---

## Related Documentation
- **Linda** — WhatsApp LocalAuth Bot manager & command executor  
- **Nadia** — WhatsApp Business CRM with Meta Cloud API  
- **MaryInventoryCRM** — Property inventory for search results
