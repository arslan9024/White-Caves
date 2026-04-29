# WhatsApp Web Integration Guide

## Overview

This guide documents the WhatsApp Web integration for the Linda AI assistant CRM system. The system enables multi-account WhatsApp management with real-time message tracking, conversation history, and advanced analytics.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         WhatsApp Integration System                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  WhatsApp Web Integration                    │   │
│  │  - Device linking & QR code                  │   │
│  │  - Session management                        │   │
│  │  - Multi-account support                     │   │
│  │  - Event emit system                         │   │
│  └──────────────────────────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────┼──────────────────────────┐   │
│  │                  │                          │    │
│  ▼                  ▼                          ▼    │
│ ┌──────────┐  ┌──────────────┐  ┌───────────┐ │
│ │Conversation│  │ Counter      │  │  Session  │ │
│ │Tracker   │  │ Manager      │  │  Store    │ │
│ └──────────┘  └──────────────┘  └───────────┘ │
│       │               │                 │      │
│       └───────────────┼─────────────────┘      │
│                       ▼                        │
│              MongoDB/Database                 │
│                                                │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. WhatsAppWebIntegration
Main service for WhatsApp Web protocol integration.

**Key Features:**
- QR code generation for device linking
- Session authentication and management
- Multi-account support (up to 50+ accounts)
- Event-based message handling
- Safety limits & rate limiting
- Automatic session recovery on restart

**Key Methods:**
```javascript
// Device linking
await whatsappWeb.initiateDeviceLinking(accountId, phoneNumber)
await whatsappWeb.confirmDeviceLinking(sessionId, authToken, phoneNumber)

// Account management
await whatsappWeb.connect(accountId)
await whatsappWeb.disconnect(accountId)
await whatsappWeb.unlinkAccount(accountId)

// Messaging
await whatsappWeb.sendMessage(accountId, recipientPhone, messageText)
await whatsappWeb.handleIncomingMessage(accountId, messageData)

// Session info
whatsappWeb.getSession(accountId)
whatsappWeb.listAccounts()
```

### 2. ConversationTracker
Manages conversation history and message tracking.

**Key Features:**
- Individual & group conversation support
- Message persistence & search
- Conversation metadata (archived, pinned, muted)
- Unread message tracking
- Conversation statistics
- Full-text search on messages

**Key Methods:**
```javascript
// Conversation management
await conversationTracker.getOrCreateConversation(accountId, recipientPhone)
await conversationTracker.listConversations(accountId)
await conversationTracker.toggleArchive(conversationId, accountId)

// Message handling
await conversationTracker.addMessage(accountId, conversationId, messageData)
await conversationTracker.getMessages(conversationId)
await conversationTracker.markAsRead(conversationId, accountId)

// Search & stats
await conversationTracker.searchConversations(accountId, searchTerm)
await conversationTracker.searchMessages(accountId, searchTerm)
await conversationTracker.getConversationStats(conversationId, accountId)
```

### 3. CounterManager
Tracks daily, weekly, and monthly message counters.

**Key Features:**
- Automatic counter aggregation
- Daily, weekly, monthly, and all-time counters
- Customer segment classification (landlord, tenant, buyer, seller, agent)
- Performance metrics & trends
- Automatic cleanup of old data
- Response rate calculation

**Key Methods:**
```javascript
// Counter operations
await counterManager.incrementCounter(accountId, messageData)
await counterManager.getCounters(accountId, period)

// Period-specific counters
await counterManager.getTodayCounters(accountId)
await counterManager.getThisWeekCounters(accountId)
await counterManager.getThisMonthCounters(accountId)

// Analytics
await counterManager.getCounterTrends(accountId, days)
await counterManager.getPerformanceMetrics(accountId)
await counterManager.getSegmentBreakdown(accountId, period)
```

### 4. SessionStore
Persistent storage for WhatsApp sessions.

**Backends:**
- Memory (default, fast but lost on restart)
- Database (persistent, recommended for production)

**Key Methods:**
```javascript
await sessionStore.save(sessionId, sessionData)
await sessionStore.get(sessionId)
await sessionStore.delete(sessionId)
await sessionStore.getAllSessions()
await sessionStore.getSessionsByAccount(accountId)
await sessionStore.cleanupExpiredSessions()
```

## API Endpoints

### Device Linking

#### POST `/api/whatsapp/link`
Initiate device linking and get QR code.

**Request:**
```json
{
  "accountId": "account_001",
  "phoneNumber": "+971501234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "abc123...",
    "accountId": "account_001",
    "phoneNumber": "+971501234567",
    "qrCode": "data:image/png;base64,...",
    "expiresIn": 300,
    "status": "waiting_for_scan"
  }
}
```

#### POST `/api/whatsapp/confirm-link`
Confirm device linking after QR scan.

**Request:**
```json
{
  "sessionId": "abc123...",
  "authToken": "token...",
  "phoneNumber": "+971501234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountId": "account_001",
    "phoneNumber": "+971501234567",
    "status": "connected",
    "message": "Device successfully linked"
  }
}
```

### Account Management

#### POST `/api/whatsapp/connect`
Connect an authenticated WhatsApp account.

#### POST `/api/whatsapp/disconnect`
Disconnect a WhatsApp account (temporary).

#### POST `/api/whatsapp/unlink`
Permanently unlink a WhatsApp account.

#### GET `/api/whatsapp/accounts`
List all connected accounts.

**Response:**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "accountId": "account_001",
        "phoneNumber": "+971501234567",
        "status": "connected",
        "messageCount": 1234
      }
    ],
    "count": 1
  }
}
```

#### GET `/api/whatsapp/account/:accountId`
Get specific account info.

### Messaging

#### POST `/api/whatsapp/send`
Send a message via WhatsApp.

**Request:**
```json
{
  "accountId": "account_001",
  "recipientPhone": "+971509876543",
  "message": "Hello! This is a test message."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_123...",
    "accountId": "account_001",
    "from": "+971501234567",
    "to": "+971509876543",
    "body": "Hello! This is a test message.",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "sent"
  }
}
```

### Conversations

#### GET `/api/whatsapp/conversations/:accountId`
List conversations for an account.

**Query Parameters:**
- `limit` (default: 50) - Max 200
- `skip` (default: 0) - Pagination offset

#### GET `/api/whatsapp/conversation/:conversationId/messages`
Get messages for a conversation.

**Query Parameters:**
- `limit` (default: 50)
- `skip` (default: 0)

#### GET `/api/whatsapp/conversation/:conversationId/stats`
Get conversation statistics.

**Query Parameters:**
- `accountId` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "conv_123...",
    "totalMessages": 245,
    "incomingMessages": 120,
    "outgoingMessages": 125,
    "firstMessage": "2024-01-01T08:00:00Z",
    "lastMessage": "2024-01-15T15:30:00Z",
    "uniqueSenderCount": 1,
    "averageMessageLength": 45
  }
}
```

#### POST `/api/whatsapp/conversation/:conversationId/mark-read`
Mark all messages in conversation as read.

#### GET `/api/whatsapp/search/conversations`
Search conversations by phone or name.

**Query Parameters:**
- `accountId` (required)
- `q` (required) - Search query
- `limit` (default: 20)
- `skip` (default: 0)

#### GET `/api/whatsapp/search/messages`
Search messages by text.

**Query Parameters:**
- `accountId` (required)
- `q` (required) - Search query
- `conversationId` (optional)
- `limit` (default: 50)
- `skip` (default: 0)

### Counters & Analytics

#### GET `/api/whatsapp/counters/:accountId`
Get all counters for account.

**Query Parameters:**
- `period` (default: 'all') - 'day', 'week', 'month', or 'all'

**Response:**
```json
{
  "success": true,
  "data": {
    "daily": {
      "2024-01-15": {
        "total": 45,
        "direction": {
          "incoming": 23,
          "outgoing": 22
        },
        "segments": {
          "landlord": 15,
          "tenant": 20,
          "agent": 10
        }
      }
    },
    "weekly": { /* ... */ },
    "monthly": { /* ... */ },
    "stats": {
      "totalMessages": 10234,
      "bySegment": { /* ... */ },
      "byDirection": { /* ... */ }
    }
  }
}
```

#### GET `/api/whatsapp/counters/:accountId/today`
Get today's counters only.

#### GET `/api/whatsapp/counters/:accountId/week`
Get this week's counters.

#### GET `/api/whatsapp/counters/:accountId/month`
Get this month's counters.

#### GET `/api/whatsapp/metrics/:accountId`
Get performance metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "total": 45,
      "incoming": 23,
      "outgoing": 22
    },
    "week": {
      "total": 285,
      "average": 40
    },
    "month": {
      "total": 1200,
      "average": 41
    },
    "growth": {
      "daily": 12
    },
    "topSegment": {
      "segment": "tenant",
      "count": 20
    },
    "responseRate": 95
  }
}
```

#### GET `/api/whatsapp/trends/:accountId`
Get counter trends over time.

**Query Parameters:**
- `days` (default: 7) - Number of days to retrieve

#### GET `/api/whatsapp/segments/:accountId`
Get segment breakdown.

**Query Parameters:**
- `period` (default: 'today') - 'today', 'week', 'month', or 'all'

## Implementation in Express

```javascript
const express = require('express');
const { MongoClient } = require('mongodb');
const WhatsAppIntegrationFactory = require('./backend/services/whatsapp');
const { initializeWhatsAppRoutes } = require('./backend/services/whatsapp/routes');

const app = express();

// Initialize WhatsApp integration
let whatsappFactory;

MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) throw err;

  const db = client.db('whatsapp_linda');

  // Create and initialize WhatsApp factory
  whatsappFactory = new WhatsAppIntegrationFactory(db, {
    sessionStoreType: 'database', // Use database for persistence
    maxRetries: 3,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  });

  whatsappFactory.initialize().then(() => {
    console.log('✅ WhatsApp integration ready');

    // Initialize routes
    const whatsappRoutes = initializeWhatsAppRoutes(whatsappFactory);
    app.use('/api/whatsapp', whatsappRoutes);

    // Start server
    app.listen(3001, () => {
      console.log('✅ Server running on port 3001');
    });
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await whatsappFactory.shutdown();
  process.exit(0);
});
```

## Event Handling

The WhatsApp Web integration emits events that can be consumed by other parts of the system:

```javascript
const whatsappWeb = whatsappFactory.getComponent('whatsappWeb');

// When device is linked
whatsappWeb.on('device_linked', (data) => {
  console.log('Device linked:', data.phoneNumber);
  // Notify Linda AI assistant
});

// When message is received
whatsappWeb.on('message_received', (message) => {
  console.log('Message from:', message.from);
  // Process by AI assistant, generate response
});

// When message is sent
whatsappWeb.on('message_sent', (message) => {
  console.log('Message sent to:', message.to);
});

// When account connects
whatsappWeb.on('account_connected', (data) => {
  console.log('Account connected:', data.accountId);
});

// When account disconnects
whatsappWeb.on('account_disconnected', (data) => {
  console.log('Account disconnected:', data.accountId);
});
```

## Data Models

### Session
```javascript
{
  sessionId: String,
  accountId: String,
  phoneNumber: String,
  status: 'linking' | 'authenticated' | 'connected' | 'disconnected',
  qrToken: String,
  authToken: String,
  expiresAt: Date,
  authenticatedAt: Date,
  connectedAt: Date,
  disconnectedAt: Date,
  lastActivity: Date,
  messageCount: Number,
  metadata: Object,
}
```

### Conversation
```javascript
{
  conversationId: String,
  accountId: String,
  recipientPhone: String,
  recipientName: String,
  isGroup: Boolean,
  groupName: String,
  groupMembers: String[],
  messageCount: Number,
  unreadCount: Number,
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    isArchived: Boolean,
    isPinned: Boolean,
    isMuted: Boolean,
    customLabel: String,
  },
}
```

### Message
```javascript
{
  messageId: String,
  conversationId: String,
  accountId: String,
  from: String,
  to: String,
  body: String,
  timestamp: Date,
  type: 'text' | 'image' | 'video' | 'document' | 'audio',
  direction: 'incoming' | 'outgoing',
  status: 'sent' | 'delivered' | 'read',
  mediaUrl: String,
  mediaType: String,
  reactions: Array,
  quotedMessageId: String,
  isEdited: Boolean,
  metadata: {
    isRead: Boolean,
    readAt: Date,
    isStarred: Boolean,
    isForwarded: Boolean,
  },
}
```

### Counter
```javascript
{
  accountId: String,
  counters: {
    daily: {
      '2024-01-15': {
        total: Number,
        direction: { incoming: Number, outgoing: Number },
        segments: { landlord: Number, tenant: Number, ... },
      },
    },
    weekly: { /* similar structure */ },
    monthly: { /* similar structure */ },
  },
  stats: {
    totalMessages: Number,
    bySegment: { landlord: Number, ... },
    byDirection: { incoming: Number, outgoing: Number },
  },
  lastCounterUpdate: Date,
}
```

## Security Considerations

1. **Session Security**
   - Sessions stored encrypted in database
   - Auth tokens rotated on reconnection
   - QR codes expire after 5 minutes
   - Session timeout: 24 hours

2. **Rate Limiting**
   - Max 60 messages per minute per account
   - Daily limit: 1000 messages per account
   - Automatic ban detection

3. **Privacy**
   - Messages encrypted at rest
   - Database access restricted
   - Audit logs for all operations

4. **Meta Compliance**
   - No message scraping
   - Respects read receipts
   - No automated bulk messaging
   - Proper session management

## Troubleshooting

### QR Code Not Scanning
- Ensure account ID is correct
- Check network connectivity
- Verify WhatsApp is latest version on phone
- QR expires after 5 minutes - get new one if needed

### Session Expired
- Re-link device with new QR code
- Check if phone has WhatsApp Web open elsewhere
- Verify session store (database) is accessible

### Messages Not Sending
- Verify account is in 'connected' status
- Check phone has active internet
- Monitor rate limits
- Check for temporary bans

### Counter Data Missing
- Ensure counterManager is initialized
- Check database connections
- Verify message events are being emitted
- Run cleanup for old data manually

## Next Steps

1. **Frontend Dashboard**
   - Create WhatsApp account management UI
   - Build conversation list interface
   - Implement message compose/send UI
   - Create analytics dashboard

2. **AI Assistant Integration**
   - Connect Linda to incoming messages
   - Generate automatic responses
   - Handle multi-turn conversations
   - Track conversation context

3. **Advanced Features**
   - Group message support
   - Media handling (images, documents)
   - Message reactions
   - Read receipts
   - Typing indicators

4. **Analytics Dashboard**
   - Real-time message tracking
   - Customer segment insights
   - Response time metrics
   - Conversation trends
