# Phase 2: NADIA Mock Mode Implementation Plan

**Status:** Ready to Start  
**Duration:** 2-3 days  
**Scope:** API endpoints, mock message processing, dashboard UI

---

## 📋 Objectives

1. **Express API Endpoints** (9 endpoints)
   - Create, read, update, delete conversations
   - Message sending and retrieval
   - Queue management
   - Status transitions

2. **Mock Message Processing**
   - Simulate bot responses
   - NLP intent detection (mock data)
   - Lead scoring algorithm
   - Sentiment analysis

3. **Frontend Dashboard**
   - Conversation list and detail view
   - Message history with styling
   - Agent queue tracker
   - Mock message simulator (for manual testing)

4. **Testing & Validation**
   - E2E tests for all endpoints
   - Integration test scenarios
   - Manual testing checklist

---

## 🔧 Technical Stack

- **Backend:** Express 5, Prisma ORM, MongoDB
- **Frontend:** React 18, Redux Toolkit, TypeScript
- **Testing:** Playwright E2E, Vitest unit
- **Database:** MongoDB (already configured)

---

## 📁 File Structure

```
src/
├── server/
│   ├── routes/
│   │   └── nadia/
│   │       ├── conversations.ts       (9 endpoints)
│   │       ├── messages.ts
│   │       └── queue.ts
│   ├── services/
│   │   └── nadia/
│   │       ├── messageProcessor.ts    (mock intent/sentiment)
│   │       ├── leadScorer.ts          (scoring algorithm)
│   │       └── queueManager.ts        (routing logic)
│   └── middleware/
│       └── errorHandler.ts            (error handling)
├── components/
│   └── nadia/
│       ├── ConversationList.tsx       (dashboard)
│       ├── ConversationDetail.tsx     (messages + status)
│       ├── MessageInput.tsx           (send message)
│       ├── MockSimulator.tsx          (test tool)
│       └── QueueTracker.tsx           (agent queue)
├── hooks/
│   └── useNadiaConversations.ts       (data fetching)
└── store/
    └── slices/
        └── nadia.ts                   (Redux state)
```

---

## 📊 API Endpoints (9)

### 1. Create Conversation

```
POST /api/nadia/conversations
Request Body:
{
  "wabaId": "123456",
  "customerPhone": "+971501234567",
  "initialMessage": "I'm interested in properties in Dubai Marina"
}

Response: 201 Created
{
  "id": "conv_xyz123",
  "wabaId": "123456",
  "customerPhone": "+971501234567",
  "status": "active",
  "messages": [],
  "createdAt": "2026-02-01T10:00:00Z"
}
```

### 2. Get Conversation

```
GET /api/nadia/conversations/:conversationId

Response: 200 OK
{
  "id": "conv_xyz123",
  "wabaId": "123456",
  "customerPhone": "+971501234567",
  "status": "active",
  "intent": "property_search",
  "leadScore": 75,
  "messages": [...],
  "queue": null,
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-02-01T10:15:00Z"
}
```

### 3. List Conversations

```
GET /api/nadia/conversations?status=active&sortBy=leadScore&limit=20

Response: 200 OK
{
  "data": [...],
  "pagination": {
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

### 4. Send Message

```
POST /api/nadia/conversations/:conversationId/messages
Request Body:
{
  "content": "Tell me more about the 2BR apartments",
  "direction": "inbound",
  "senderType": "customer",
  "senderPhone": "+971501234567"
}

Response: 201 Created
{
  "id": "msg_abc456",
  "conversationId": "conv_xyz123",
  "content": "Tell me more about the 2BR apartments",
  "direction": "inbound",
  "senderType": "customer",
  "status": "delivered",
  "ninaSentiment": "neutral",
  "ninaEntities": ["property_type", "bedrooms"],
  "timestamp": "2026-02-01T10:05:00Z"
}
```

### 5. Get Messages

```
GET /api/nadia/conversations/:conversationId/messages

Response: 200 OK
{
  "data": [
    { ... message 1 },
    { ... message 2 },
    { ... message 3 }
  ]
}
```

### 6. Update Conversation Status

```
PATCH /api/nadia/conversations/:conversationId
Request Body:
{
  "status": "assigned_to_agent",
  "agentPhone": "+971501111111"
}

Response: 200 OK
{
  "id": "conv_xyz123",
  "status": "assigned_to_agent",
  "agentPhone": "+971501111111",
  "routedAt": "2026-02-01T10:10:00Z"
}
```

### 7. Close Conversation

```
DELETE /api/nadia/conversations/:conversationId
Request Body: { "reason": "sold" }

Response: 200 OK
{
  "id": "conv_xyz123",
  "status": "closed",
  "closedAt": "2026-02-01T11:00:00Z",
  "closedReason": "sold"
}
```

### 8. Get Queue

```
GET /api/nadia/queue?limit=10

Response: 200 OK
{
  "data": [
    {
      "id": "queue_001",
      "conversationId": "conv_xyz123",
      "priority": 1,
      "status": "queued",
      "queuedAt": "2026-02-01T10:05:00Z"
    }
  ]
}
```

### 9. Assign from Queue

```
PATCH /api/nadia/queue/:queueId/assign
Request Body: { "agentPhone": "+971501111111" }

Response: 200 OK
{
  "id": "queue_001",
  "status": "assigned",
  "assignedAt": "2026-02-01T10:15:00Z"
}
```

---

## 🧠 Mock Message Processing

### Intent Detection (Mock)

```typescript
// src/server/services/nadia/messageProcessor.ts

const INTENT_KEYWORDS = {
  property_search: ['property', 'apartment', 'villa', 'land', 'house', 'unit'],
  schedule_tour: ['tour', 'visit', 'see', 'view', 'appointment', 'time'],
  information_request: ['price', 'bedrooms', 'specs', 'details', 'amenities'],
  make_offer: ['offer', 'negotiate', 'buy', 'purchase', 'price'],
};

function detectIntent(messageContent: string): string {
  const lower = messageContent.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return intent;
    }
  }
  return 'general_inquiry';
}
```

### Lead Scoring (Mock)

```typescript
// src/server/services/nadia/leadScorer.ts

function calculateLeadScore(conversation: any): number {
  let score = 50; // Base score

  // Intent bonus
  const intentBonuses = {
    make_offer: +25,
    schedule_tour: +20,
    information_request: +10,
    property_search: +5,
    general_inquiry: 0,
  };
  score += intentBonuses[conversation.intent] || 0;

  // Message frequency
  if (conversation.messages.length > 10) score += 15;
  else if (conversation.messages.length > 5) score += 10;

  // Consistency (messages close together)
  const timespan = getTimespan(conversation);
  if (timespan < 3600 && conversation.messages.length > 3) score += 10;

  // Sentiment
  const positiveCount = conversation.messages.filter(m => m.ninaSentiment === 'positive').length;
  if (positiveCount / conversation.messages.length > 0.5) score += 10;

  return Math.min(100, Math.max(0, score));
}
```

### Sentiment Analysis (Mock)

```typescript
// Mock sentiment keywords
const SENTIMENT_POSITIVE = ['good', 'great', 'love', 'amazing', 'perfect', 'interested'];
const SENTIMENT_NEGATIVE = ['bad', 'hate', 'terrible', 'ugly', 'disappointing'];

function detectSentiment(content: string): string {
  const lower = content.toLowerCase();
  const positiveMatch = SENTIMENT_POSITIVE.some(w => lower.includes(w));
  const negativeMatch = SENTIMENT_NEGATIVE.some(w => lower.includes(w));

  if (positiveMatch && !negativeMatch) return 'positive';
  if (negativeMatch && !positiveMatch) return 'negative';
  return 'neutral';
}
```

---

## 🎨 Frontend Components

### 1. ConversationList.tsx

- Display all conversations in a table
- Filter by status, search by phone
- Sort by leadScore (hot first)
- Show agent assignment status
- Click to open detail view

### 2. ConversationDetail.tsx

- Show conversation metadata
- Display message history (scrollable)
- Message input with send button
- Status badge with transition buttons
- Assign to agent dropdown (if admin)
- Close conversation button

### 3. MockSimulator.tsx

- Dropdown to select test conversation
- Textarea for test message
- Button to "send" (creates message)
- Auto-detect intent, sentiment, score
- Shows JSON response

### 4. QueueTracker.tsx

- List of queued conversations
- Priority number (1 = hottest)
- Time in queue
- Quick assign button
- "Next in line" indicator

---

## 🧪 Testing Plan

### E2E Tests (Playwright)

```typescript
// e2e/nadia.spec.ts

test('Create conversation and send message', async ({ page }) => {
  // 1. POST /api/nadia/conversations
  // 2. Wait for UI to show conversation
  // 3. POST message
  // 4. Verify message appears in UI
  // 5. Verify intent/sentiment detected
  // 6. Verify lead score calculated
});

test('Assign conversation to agent', async ({ page }) => {
  // 1. Create conversation
  // 2. Click "Assign to Agent"
  // 3. Select agent from dropdown
  // 4. Verify status changed to assigned_to_agent
  // 5. Verify routedAt timestamp set
});

test('Queue ranking and assignment', async ({ page }) => {
  // 1. Create 3 conversations with different lead scores
  // 2. Verify queue shows hot leads first
  // 3. Assign top lead to agent
  // 4. Verify assignment timestamp and status
});
```

### Unit Tests (Vitest)

```typescript
// src/server/services/nadia/__tests__/scoreCalculator.test.ts

test('Lead score increases with higher engagement', () => {
  const conv = { messages: Array(15), intent: 'schedule_tour' };
  const score = calculateLeadScore(conv);
  expect(score).toBeGreaterThan(75);
});

test('Intent detection finds keywords', () => {
  const intent = detectIntent('I want to schedule a tour tomorrow');
  expect(intent).toBe('schedule_tour');
});
```

---

## 📋 Implementation Checklist

### Part 1: Backend Setup (Day 1)

- [ ] Create `/api/nadia/*` route files
- [ ] Implement 9 API endpoints
- [ ] Add error handling middleware
- [ ] Add request validation (zod/joi)
- [ ] Connect to MongoDB via Prisma
- [ ] Test all endpoints with Postman/curl

### Part 2: Mock Services (Day 1)

- [ ] Implement intent detection
- [ ] Implement lead scoring
- [ ] Implement sentiment analysis
- [ ] Add to message processing pipeline
- [ ] Unit test all services

### Part 3: Frontend Dashboard (Day 2)

- [ ] Create conversation list page
- [ ] Create conversation detail page
- [ ] Implement message history viewer
- [ ] Add message input with send
- [ ] Add status update buttons
- [ ] Add queue tracker widget

### Part 4: Integration & Testing (Day 2-3)

- [ ] Connect frontend to API
- [ ] Redux state management
- [ ] Loading/error states
- [ ] E2E test all workflows
- [ ] Manual testing checklist
- [ ] Performance validation

### Part 5: Documentation (Day 3)

- [ ] API documentation
- [ ] Mock data generators
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Code examples

---

## 🚀 Go-Live Readiness

**Pre-Deployment Checklist:**

- [ ] All 9 endpoints tested
- [ ] 0 TypeScript errors
- [ ] Build passing
- [ ] E2E tests passing (10/10)
- [ ] Performance tests passed
- [ ] Security review (no SQL injection, XSS, etc.)
- [ ] Error handling comprehensive
- [ ] Logging operational

---

## 📞 Communication Plan

- **Daily standups:** 10 AM (2 min each)
- **Blockers:** Reported immediately in Slack
- **Deliverables:** End of each day in chat
- **Code review:** Before merge to development

---

## 🎯 Success Metrics

| Metric            | Target        | Status               |
| ----------------- | ------------- | -------------------- |
| API endpoints     | 9/9           | 🚧 In Progress       |
| E2E tests         | 10/10 passing | 🚧 In Progress       |
| Frontend features | 5/5 complete  | 🚧 In Progress       |
| TypeScript errors | 0             | ✅ 0                 |
| Build time        | < 30s         | 🚧 Pending Build     |
| Response time     | < 100ms avg   | 🚧 Pending Perf Test |

---

## 📚 Reference Documentation

- **Phase 1:** PHASE_1_NADIA_DATABASE_FOUNDATION.md
- **Architecture:** WHATSAPP_THREE_ASSISTANT_ARCHITECTURE.md
- **NADIA Role:** business_docs/03_ai_assistants/nadia.md
- **Session 7 E2E Tests:** SESSION_7_COMMISSION_INTEGRATION_GUIDE.md (reference)

---

**Ready to implement Phase 2? Run:** `npm run dev` to start dev server

Phase 2 Start Date: [To be scheduled]
