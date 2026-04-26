# Phase 2B: NADIA Frontend Integration - Complete Implementation Plan

**Status**: Starting 🚀
**Date**: March 29, 2026
**E2E Test Results**: ✅ 19/19 PASSED
**Backend Status**: Production-ready
**Estimated Duration**: 3-4 hours
**Target Completion**: Same session

---

## Executive Summary

Phase 2B delivers **complete frontend integration** for the NADIA CRM backend. We'll build 5 React components with Redux state management to create a fully functional conversation dashboard, queue manager, and message viewer. All components will be type-safe (TypeScript), styled with your design system, and connected to the backend API.

### Deliverables

- ✅ 5 React components (Dashboard, Queue Manager, Message Viewer, Conversation List, Message Input)
- ✅ Redux integration with API thunks
- ✅ Real-time polling system
- ✅ Full TypeScript coverage (0 errors)
- ✅ Comprehensive documentation with integration examples
- ✅ Production-ready UI/UX with design tokens

---

## Architecture Overview

```
Frontend Flow:
┌─────────────────────────────────────────────────────────┐
│ NADIADashboard (Main Container)                        │
│ ├─ Redux: useAppDispatch, useAppSelector              │
│ ├─ useEffect: Polling intervals                       │
│ ├─ useState: Real-time active conversation            │
│ │                                                      │
│ ├─ ┌────────────────────────────────────────────────┐ │
│ │ │ ConversationListPanel (Left Sidebar)           │ │
│ │ │ ├─ Conversations sorted by priority            │ │
│ │ │ ├─ Status filter (ACTIVE, PENDING, CLOSED)     │ │
│ │ │ ├─ Lead score ranking                          │ │
│ │ │ ├─ SelectConversation on click                 │ │
│ │ └────────────────────────────────────────────────┘ │
│ │                                                      │
│ ├─ ┌────────────────────────────────────────────────┐ │
│ │ │ MessageViewer (Center Pane)                     │ │
│ │ ├─ Conversation header (customer name, status)   │ │
│ │ ├─ Message thread (scrollable)                   │
│ │ ├─ Inline sentiment/intent badges                │
│ │ ├─ MessageInput component at bottom              │
│ │ └────────────────────────────────────────────────┘ │
│ │                                                      │
│ └─ ┌────────────────────────────────────────────────┐ │
│   │ QueueManagerPanel (Right Sidebar)              │ │
│   │ ├─ Queue stats (total, urgent, pending)       │ │
│   │ ├─ Agent assignment interface                 │ │
│   │ ├─ Priority queue visualization               │ │
│   │ ├─ Auto-refresh stats                         │ │
│   └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Redux State:
├─ nadiaConversations: Conversation[]
├─ nadiaMessages: Message[]
├─ nadiaQueue: QueuedConversation[]
├─ selectedConversationId: string
├─ loading: boolean
└─ error: string | null
```

---

## Component Breakdown

### 1. **NADIADashboard** (Main Container)

**File**: `src/components/nadia/NADIADashboard.tsx`
**Responsibility**: Layout, state management, polling orchestration

**Props**: None (top-level component)

**Key Features**:

- 3-panel layout (conversation list | messages | queue)
- Redux state management via thunks
- Polling intervals for real-time updates (2-second interval)
- Active conversation tracking
- Error boundary integration

**Component Structure**:

```typescript
interface NADIADashboardState {
  selectedConversationId: string | null;
  isPolling: boolean;
  pollInterval: NodeJS.Timeout | null;
  error: string | null;
}

// Hooks:
const conversations = useAppSelector(selectNadiaConversations);
const messages = useAppSelector(selectNadiaMessages);
const queue = useAppSelector(selectNadiaQueue);
const dispatch = useAppDispatch();

// useEffect: Setup polling
// useEffect: Cleanup polling on unmount
// useEffect: Track active conversation changes
```

---

### 2. **ConversationListPanel** (Left Sidebar)

**File**: `src/components/nadia/ConversationListPanel.tsx`
**Responsibility**: Display, filter, sort, and select conversations

**Props**:

```typescript
interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
}
```

**Key Features**:

- Display conversations with customer info + last message
- Filter by status (ACTIVE, PENDING, CLOSED, SPAM)
- Sort by leadScore (descending, hot leads first)
- Visual indicators (priority color, unread count, sentiment)
- Search/filter functionality
- Responsive scrolling

**UI Elements**:

- Status badge (color-coded: green=ACTIVE, yellow=PENDING, gray=CLOSED, red=SPAM)
- Lead score bar (0-100 scale)
- Customer name + phone number
- Last message preview (truncated)
- Timestamp
- Unread count badge

**Component Data**:

```typescript
// For each conversation:
{
  customerName: "Ahmed Al-Mansouri",
  customerPhone: "+971501234567",
  status: "ACTIVE",
  leadScore: 85,
  lastMessage: "When can I view the villa?",
  timestamp: "2 mins ago",
  unreadCount: 2,
  priority: "HIGH"
}
```

---

### 3. **MessageViewer** (Center Pane)

**File**: `src/components/nadia/MessageViewer.tsx`
**Responsibility**: Display conversation thread and messages

**Props**:

```typescript
interface MessageViewerProps {
  conversation: Conversation | null;
  messages: Message[];
  loading?: boolean;
  onSendMessage: (content: string, type: MessageType) => void;
}
```

**Key Features**:

- Scrollable message thread
- Message bubbles (customer left, agent right)
- Inline metadata (timestamp, sender, sentiment icon)
- Sentiment badges (😊 positive, 😐 neutral, 😞 negative)
- Intent tags (PROPERTY_INQUIRY, VIEWING_REQUEST, etc.)
- Entity highlighting (property, location, price)
- Message Input component at bottom
- Auto-scroll to latest message

**UI Elements**:

```
┌─────────────────────────────────┐
│ Ahmed Al-Mansouri | +971501234567
│ Status: ACTIVE | Lead Score: 85
├─────────────────────────────────┤
│ Customer:                        │
│ "Hi there, interested in villas" │
│ [😊 Positive] [INQUIRY]         │
│ 2:10 PM                          │
│                                  │
│              Agent Reply:        │
│              "Great! We have..." │
│              [😐 Neutral]        │
│              By: Nadia NLP       │
│              2:12 PM             │
│                                  │
├─────────────────────────────────┤
│ [MessageInput Component]         │
│ Type: [Customer▼] [Agent▼]      │
│ Send button                      │
└─────────────────────────────────┘
```

---

### 4. **MessageInput** (Message Composition)

**File**: `src/components/nadia/MessageInput.tsx`
**Responsibility**: Capture and send messages

**Props**:

```typescript
interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string, type: MessageType) => void;
  loading?: boolean;
  placeholder?: string;
}
```

**Key Features**:

- Textarea for message composition
- Message type selector (CUSTOMER | AGENT)
- Send button with loading state
- Character count (0/500)
- Keyboard shortcut (Ctrl+Enter to send)
- Validation (non-empty content)
- Error display

**UI Elements**:

```
┌────────────────────────────────────────┐
│ Message Type: [Customer ▼]             │
├────────────────────────────────────────┤
│                                        │
│ [Textarea for message composition] │
│ [Type here...]                      │
│                                        │
├────────────────────────────────────────┤
│ 0/500 chars | [Send Button] [Loading] │
└────────────────────────────────────────┘
```

---

### 5. **QueueManagerPanel** (Right Sidebar)

**File**: `src/components/nadia/QueueManagerPanel.tsx`
**Responsibility**: Display queue stats and agent assignment

**Props**:

```typescript
interface QueueManagerPanelProps {
  queue: QueuedConversation[];
  stats: QueueStats;
  onAssignAgent: (queueId: string, agentPhone: string) => void;
  loading?: boolean;
}
```

**Key Features**:

- Queue statistics dashboard
- Priority distribution (URGENT, HIGH, NORMAL, LOW)
- Queued conversations list
- Agent assignment interface (with validation)
- Auto-refresh stats (5-second interval)
- Visual queue depth indicator

**Stats Display**:

```
┌─────────────────────────────────┐
│ 📊 Queue Statistics             │
├─────────────────────────────────┤
│ Total Queued:      15           │
│ 🔴 Urgent:         3            │
│ 🟠 High:           5            │
│ 🟡 Normal:         4            │
│ 🔵 Low:            3            │
│                                  │
│ Avg Response Time: 4 mins       │
│ Agent Availability: 8/10        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ⏳ Oldest in Queue              │
├─────────────────────────────────┤
│ Fatima Al-Karbi                 │
│ Priority: URGENT (15 mins)      │
│ Lead Score: 92/100              │
│                                  │
│ Assign to Agent:                │
│ [Phone: +971501234567]          │
│ [Assign Button]                 │
└─────────────────────────────────┘
```

---

## Redux Integration

### Redux Slice: `nadiaSlice`

**File**: `src/store/slices/nadiaSlice.ts`

**State Structure**:

```typescript
interface NadiaState {
  conversations: Conversation[];
  messages: Message[];
  queue: QueuedConversation[];
  stats: QueueStats;
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
}

// Selectors:
export const selectNadiaConversations = (state: RootState) => state.nadia.conversations;
export const selectNadiaMessages = (state: RootState) => state.nadia.messages;
export const selectNadiaQueue = (state: RootState) => state.nadia.queue;
export const selectNadiaStats = (state: RootState) => state.nadia.stats;
export const selectSelectedConversation = (state: RootState) => {
  const id = state.nadia.selectedConversationId;
  return state.nadia.conversations.find(c => c.id === id) || null;
};
```

### Async Thunks

```typescript
// Thunk signatures:
export const fetchConversations = createAsyncThunk(
  'nadia/fetchConversations',
  async (filters?: { status?: string; skip?: number; limit?: number }) => {
    // API call: GET /api/nadia/conversations
    // Returns: Conversation[]
  }
);

export const fetchMessages = createAsyncThunk(
  'nadia/fetchMessages',
  async (conversationId: string) => {
    // API call: GET /api/nadia/conversations/:id/messages
    // Returns: Message[]
  }
);

export const sendMessage = createAsyncThunk(
  'nadia/sendMessage',
  async (payload: { conversationId: string; content: string; type: MessageType }) => {
    // API call: POST /api/nadia/conversations/:id/messages
    // Returns: Message
  }
);

export const fetchQueue = createAsyncThunk('nadia/fetchQueue', async () => {
  // API call: GET /api/nadia/queue
  // Returns: QueuedConversation[]
});

export const assignAgent = createAsyncThunk(
  'nadia/assignAgent',
  async (payload: { queueId: string; agentPhone: string }) => {
    // API call: PATCH /api/nadia/queue/:id/assign
    // Returns: QueuedConversation
  }
);

export const closeConversation = createAsyncThunk(
  'nadia/closeConversation',
  async (payload: { conversationId: string; reason?: string }) => {
    // API call: PATCH /api/nadia/conversations/:id
    // Returns: Conversation
  }
);
```

---

## Real-Time Updates Strategy

### Polling Approach

```typescript
// In NADIADashboard.tsx
useEffect(() => {
  const pollConversations = () => {
    dispatch(fetchConversations()); // 2-second interval
  };

  const pollQueue = () => {
    dispatch(fetchQueue()); // 5-second interval
  };

  const pollMessages = () => {
    if (selectedConversationId) {
      dispatch(fetchMessages(selectedConversationId)); // 2-second interval
    }
  };

  // Setup intervals
  const conversationInterval = setInterval(pollConversations, 2000);
  const queueInterval = setInterval(pollQueue, 5000);
  const messageInterval = setInterval(pollMessages, 2000);

  // Cleanup
  return () => {
    clearInterval(conversationInterval);
    clearInterval(queueInterval);
    clearInterval(messageInterval);
  };
}, [selectedConversationId]);
```

### Future Enhancement: WebSocket

When ready for production optimization:

- Replace polling with Socket.IO connections
- Real-time message delivery
- Presence indicators
- Typing notifications

---

## API Integration

### Base Configuration

```typescript
// src/services/nadiaAPI.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const NADIA_API = `${API_BASE}/api/nadia`;

// Interceptor for error handling
// Interceptor for loading state
// Auto-retry logic
```

### Endpoint Integration

```typescript
// Conversations
GET    /api/nadia/conversations              → fetchConversations()
GET    /api/nadia/conversations/:id          → getConversation()
PATCH  /api/nadia/conversations/:id          → updateConversation()

// Messages
GET    /api/nadia/conversations/:id/messages → fetchMessages()
POST   /api/nadia/conversations/:id/messages → sendMessage()

// Queue
GET    /api/nadia/queue                      → fetchQueue()
PATCH  /api/nadia/queue/:id/assign           → assignAgent()
```

---

## Type Definitions

```typescript
// src/types/nadia.ts
export interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED' | 'SPAM';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  leadScore: number;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'CUSTOMER' | 'AGENT';
  content: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  intent?: 'PROPERTY_INQUIRY' | 'VIEWING_REQUEST' | 'PURCHASE_INTEREST' | 'COMPLAINT';
  entities?: Record<string, any>;
  leadScore?: number;
  timestamp: Date;
}

export interface QueuedConversation extends Conversation {
  queueId: string;
  sortOrder: number;
  waitTimeMinutes: number;
}

export interface QueueStats {
  total: number;
  byPriority: Record<Priority, number>;
  avgResponseTime: number;
  agentAvailability: number;
}

export type MessageType = 'CUSTOMER' | 'AGENT';
export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
```

---

## Styling Strategy

Using your design system with styled-components:

```typescript
// src/styles/nadia.ts
export const NADIADashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  height: 100vh;
  gap: ${tokens.spacing.md};
  background: ${tokens.colors.background.primary};
`;

export const ConversationListContainer = styled.div`
  background: ${tokens.colors.surface.primary};
  border-right: 1px solid ${tokens.colors.border.subtle};
  overflow-y: auto;
`;

export const MessageViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.colors.surface.secondary};
  border-radius: ${tokens.borderRadius.md};
`;

export const QueueManagerContainer = styled.div`
  background: ${tokens.colors.surface.primary};
  border-left: 1px solid ${tokens.colors.border.subtle};
  padding: ${tokens.spacing.md};
  overflow-y: auto;
`;
```

---

## Implementation Roadmap

### Phase 2B.1: Foundation (30 mins)

- [ ] Create Redux slice (nadiaSlice.ts) with thunks
- [ ] Create type definitions (types/nadia.ts)
- [ ] Create API service layer (services/nadiaAPI.ts)
- [ ] Create styled components (styles/nadia.ts)

### Phase 2B.2: Components (90 mins)

- [ ] Build ConversationListPanel component
- [ ] Build MessageViewer component
- [ ] Build MessageInput component
- [ ] Build QueueManagerPanel component
- [ ] Build NADIADashboard container

### Phase 2B.3: Integration (45 mins)

- [ ] Hook up Redux dispatch/selectors to components
- [ ] Implement polling intervals
- [ ] Connect API calls to thunks
- [ ] Error handling & loading states

### Phase 2B.4: Polish (15 mins)

- [ ] Responsive design testing
- [ ] Accessibility (aria labels, keyboard nav)
- [ ] Performance optimization (memoization)
- [ ] Visual refinements

---

## Success Criteria

✅ All components render without errors
✅ Redux state correctly reflects API data
✅ Polling updates conversations/messages/queue every 2-5 seconds
✅ Agent assignment works end-to-end
✅ Message sending integrates with backend
✅ No TypeScript errors
✅ No ESLint warnings
✅ Mobile responsive (breakpoints: 768px, 1024px)
✅ Accessibility WCAG 2.1 AA compliant
✅ Build passes

---

## File Structure After Phase 2B

```
src/
├── components/
│   └── nadia/
│       ├── NADIADashboard.tsx           ← Main container
│       ├── ConversationListPanel.tsx    ← Left sidebar
│       ├── MessageViewer.tsx            ← Center pane
│       ├── MessageInput.tsx             ← Message composer
│       └── QueueManagerPanel.tsx        ← Right sidebar
├── store/
│   └── slices/
│       └── nadiaSlice.ts                ← Redux state + thunks
├── services/
│   └── nadiaAPI.ts                      ← API integration
├── types/
│   └── nadia.ts                         ← Type definitions
├── styles/
│   └── nadia.ts                         ← Styled components
└── pages/
    └── NadiaPage.tsx                    ← Route integration
```

---

## Demo Data for Context

```typescript
// Mock data for development/testing before API integration
const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    customerPhone: '+971501234567',
    customerName: 'Ahmed Al-Mansouri',
    status: 'ACTIVE',
    priority: 'HIGH',
    leadScore: 85,
    assignedAgent: 'nadia@whiteaves.com',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
    unreadCount: 2,
  },
  // ... more conversations
];
```

---

## Next Steps (After Phase 2B)

### Phase 3: Advanced Features (1-2 weeks)

- [ ] Nina NLP integration (advanced intent detection)
- [ ] Linda WhatsApp LocalAuth integration
- [ ] Meta Business API production credentials
- [ ] Load testing & performance optimization
- [ ] User acceptance testing (UAT)

### Quality Assurance

- [ ] E2E testing with Playwright
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Security audit
- [ ] Performance profiling

---

**Document Created**: March 29, 2026
**Status**: Ready for implementation
**Estimated Completion**: Same session (4 hours max)
**Confidence Level**: High (backend tested, architecture proven)

Let's build! 🚀
