# WhatsApp Bot & Communication Workflow Flowcharts

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Owner:** Communications Department (Nina + Nadia)

---

## Workflow 1: Inbound WhatsApp Message Processing

### Overview
Every inbound WhatsApp message flows through a routing engine that decides whether the Nina bot handles it or escalates to a human agent.

```
┌───────────────────────────────────────────────────────────┐
│          INBOUND WHATSAPP MESSAGE FLOW                    │
└───────────────────────────────────────────────────────────┘

Customer sends WhatsApp message
        │
        ▼
[META WEBHOOK]
POST /api/whatsapp/webhook
│ HMAC-SHA256 signature verified (X-Hub-Signature-256)
│ If verification fails → HTTP 400 (reject)
│ If valid → HTTP 200 immediately (< 5 seconds, required by Meta)
        │
        ▼
[MESSAGE PARSED & STORED]
│ Extract: from, message type, content, timestamp, contact name
│ Store in WhatsAppMessage collection
│ Find or create Conversation record for this phone number
        │
        ▼
[IS CONVERSATION ASSIGNED TO HUMAN AGENT?]
        │
        ├── YES → Route to agent's inbox; skip bot
        │         Real-time notification to assigned agent
        │
        └── NO ──▶
                │
                ▼
        [NINA BOT — INTENT CLASSIFICATION]
        │ NLP engine classifies intent:
        │ ├── Property Inquiry (type, price, location)
        │ ├── Availability / Viewing Request
        │ ├── Rental Inquiry
        │ ├── Price / Payment Query
        │ ├── Document Request
        │ ├── Complaint / Issue
        │ ├── General FAQ
        │ └── Unknown / Unrecognised
        │
        ├── Confidence ≥ 60% AND intent is handleable ──▶
        │                │
        │                ▼
        │        [BOT HANDLES AUTOMATICALLY]
        │        │ Property inquiry → Send matching units (3 max)
        │        │ Viewing request → Offer available time slots
        │        │ FAQ → Reply from knowledge base
        │        │ Document request → Send PDF or link
        │        │
        │        ▼
        │        [LEAD PRE-QUALIFICATION]
        │        │ If no existing lead: collect Budget, Type, Timeline
        │        │ Data saved to Clara CRM as new Lead (status: New)
        │        │ Conversation linked to lead record
        │
        └── Confidence < 60% OR unanswerable ──▶
                        │
                        ▼
                [ESCALATION TO HUMAN AGENT]
                See Escalation Workflow below
```

---

## Workflow 2: Nina Bot Conversation Flows

### Property Inquiry Flow
```
Customer: "Hi, I'm looking for a 3-bedroom villa"
        │
        ▼
Nina: "Hello! Welcome to White Caves 🏠
        I can help you find the perfect property.
        
        What is your budget range?
        1️⃣ Under AED 1.5M
        2️⃣ AED 1.5M – 3M  
        3️⃣ AED 3M – 6M
        4️⃣ Over AED 6M"
        │
        ▼ (Customer selects option)
Nina: "Great choice! When are you looking to move?
        1️⃣ As soon as possible
        2️⃣ Within 3 months
        3️⃣ Within 6 months
        4️⃣ Just exploring"
        │
        ▼ (Customer answers)
Nina: "Excellent! Here are 3 villas that match your criteria:
        
        🏡 Villa 1: [Title] — AED X — [Link]
        🏡 Villa 2: [Title] — AED X — [Link]
        🏡 Villa 3: [Title] — AED X — [Link]
        
        Would you like to schedule a viewing?
        1️⃣ Yes, book a viewing
        2️⃣ Send me more options
        3️⃣ Talk to an agent"
```

### Viewing Booking Flow
```
Customer: "Yes, book a viewing" (or "I want to see this property")
        │
        ▼
Nina: "Perfect! Let me check available slots.
        
        Available times:
        1️⃣ Tomorrow (Tue) at 10:00 AM
        2️⃣ Tomorrow (Tue) at 3:00 PM
        3️⃣ Wednesday at 11:00 AM
        4️⃣ Different time?"
        │
        ▼ (Customer selects)
Nina: "Confirmed! ✅
        Viewing: [Property] on [Date] at [Time]
        Agent: [Agent Name]
        📍 [Address]
        
        You'll receive a reminder 1 hour before.
        
        Can I also get your name for the booking?"
        │
        ▼ (Customer provides name)
Nina: "Thank you, [Name]! See you on [Date].
        
        Need anything else? Our team is always here 💬"
        │
        ▼
[SYSTEM ACTIONS]
│ ├── Appointment created in CRM calendar
│ ├── Agent notified with viewing details
│ ├── Reminder WhatsApp scheduled (24h + 1h before)
└── Lead updated with "Viewing" status
```

---

## Workflow 3: Human Agent Escalation

```
[ESCALATION TRIGGER — Any of the following]
│ ├── Customer types "agent", "human", "speak to someone"
│ ├── Bot confidence < 60% for 2 consecutive messages
│ ├── Query type: price negotiation, contract, complaint
│ ├── Customer frustration detected (negative sentiment)
│ └── Customer has sent 5+ messages without resolution
        │
        ▼
Nina: "I'll connect you with one of our specialists right away!
        
        ⏱️ Expected wait: Under 5 minutes.
        
        Our team is available:
        Mon–Sat: 9:00 AM – 9:00 PM (UAE time)
        
        💡 Tip: You can also call us on: +971 4 XXX XXXX"
        │
        ▼
[NADIA — AGENT ROUTING]
│ 1. Find available agent (status: online) in relevant department
│ 2. Assign by: least recent assignment (fairness rotation)
│ 3. If no agent online:
│    └── Add to queue; customer sent queue position update
│    └── First available agent notified when they come online
│ 4. Notify assigned agent: in-app + push notification
│ 5. Agent sees: customer name, conversation history, lead data
        │
        ▼
[AGENT TAKES OVER]
│ Agent reads full conversation context
│ Agent continues in WhatsApp (message appears from same number)
│ Bot is disabled for this conversation until agent closes it
        │
        ▼
[RESOLUTION]
│ Agent resolves query
│ Agent closes conversation (status: Closed)
│ Nina bot: "Thank you for contacting White Caves! 😊
│            How was your experience today?
│            ⭐⭐⭐⭐⭐  Rate us!"
        │
        ▼
[POST-RESOLUTION]
│ Satisfaction survey response stored
│ Conversation archived
│ Lead/activity updated
```

---

## Workflow 4: Broadcast Campaign Flow

```
[MARKETING MANAGER — Campaign Creation]
│ 1. Select campaign type: Property Announcement / Market Update / Follow-up
│ 2. Build audience segment:
│    ├── Lead status filter (e.g., "Qualified, Viewing")
│    ├── Interest filter (e.g., "3BR Villa, Budget AED 1.5M–3M")
│    ├── Last activity filter (e.g., "No contact in 7–30 days")
│    └── Location preference filter
│ 3. Select approved message template
│ 4. Add personalisation variables: {{name}}, {{property_title}}, {{price}}
│ 5. Preview message with sample data
│ 6. Schedule: Send now / Schedule for [date+time]
│ 7. Estimate audience size shown before sending
        │
        ▼
[PRE-SEND VALIDATION]
│ ├── All recipients have WhatsApp number
│ ├── Template is approved by Meta
│ ├── Recipients not in opt-out list
│ └── Daily message limit not exceeded (1,000/number/day)
        │
        ▼
[SEND EXECUTION]
│ Batch processing: max 50 messages per second
│ Each recipient personalised individually
│ Delivery tracking: Sent → Delivered → Read (per recipient)
        │
        ▼
[CAMPAIGN ANALYTICS]
│ Dashboard shows:
│ ├── Total sent, delivered, read
│ ├── Response rate (replied within 48h)
│ ├── Leads created from this campaign
│ └── Conversion to viewing / offer
        │
        ▼
[FOLLOW-UP AUTOMATION]
│ Recipients who replied → Routed to agent inbox
│ Recipients who did not open → Optional: 7-day follow-up
│ Hard bounces (invalid number) → Flagged for data cleanup
```

---

## Workflow 5: Agent Availability & Inbox Management

```
[NADIA — AGENT STATUS MANAGEMENT]

Agent statuses:
┌────────────┬────────────────────────────────────────┐
│ Online     │ Available for new conversation routing │
│ Busy       │ Active in calls; no new routing        │
│ Away       │ Short break; routing paused            │
│ Offline    │ Not on shift; no routing               │
└────────────┴────────────────────────────────────────┘

[CONVERSATION ASSIGNMENT RULES]
│ New conversation → assign to Online agent with fewest open conversations
│ If all Online agents at capacity (> 10 open) → Queue
│ If agent goes Offline with open conversations → Reassign to next Online agent
│ Conversations unaddressed for > 15 minutes → Supervisor alert

[INBOX PRIORITY]
│ 1. Hot leads (score ≥ 90) → Highlighted red
│ 2. Messages awaiting response > 30 min → Highlighted amber
│ 3. New inbound (unread) → Bold
│ 4. All others → Normal
```

---

## Key Performance Indicators

| Metric | Target | Measured By |
|--------|--------|-------------|
| Bot first response time | < 10 seconds | System |
| Bot resolution rate (no escalation needed) | ≥ 70% | System |
| Human escalation response time | < 5 minutes (business hours) | Nadia dashboard |
| Conversation-to-lead rate | ≥ 40% of new inbound | Clara CRM |
| CSAT score (post-chat survey) | ≥ 4.5/5.0 | Customer survey |
| Template approval rate (Meta) | ≥ 95% | WhatsApp dashboard |
| Broadcast open rate | ≥ 60% | Campaign analytics |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Owner:** Communications Department
