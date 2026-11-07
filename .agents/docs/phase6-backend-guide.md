# Phase 6: Backend Extensions - Implementation Guide

## Overview

Phase 6 focuses on extending the backend with advanced features for scalability, security, real-time capabilities, and comprehensive monitoring. This guide covers all new services and their integration.

## Services Architecture

### 1. Message Queue Service

**File:** `server/queue/queue.service.ts`

**Purpose:** Asynchronous task processing with retry logic and priority handling.

**Key Features:**

- Task queuing with priority levels (high, normal, low)
- Automatic retry with exponential backoff
- Dead Letter Queue (DLQ) for failed tasks
- Concurrency control per worker
- Task metrics and statistics
- Graceful shutdown support

**Usage Example:**

```typescript
import MessageQueueService from './queue/queue.service.ts';

const queue = new MessageQueueService();

// Register a worker
queue.registerWorker(
  'send_notification',
  async data => {
    await sendNotification(data);
  },
  5
); // max 5 concurrent tasks

// Add task to queue
const taskId = await queue.addTask(
  'send_notification',
  { userId: '123', message: 'Hello' },
  'high',
  3 // max 3 attempts
);

// Monitor task
const task = queue.getTaskStatus(taskId);

// Get stats
const stats = queue.getStats();
// {
//   pending: 10,
//   processing: 2,
//   completed: 1000,
//   failed: 5,
//   dlqSize: 5,
//   totalTasks: 1017
// }

// Metrics
const metrics = queue.getMetrics();
// {
//   avgProcessingTime: 1234,
//   avgRetries: 0.5,
//   successRate: 0.995
// }
```

**API Endpoints:**

- `POST /api/phase6/queue/tasks` - Add task
- `GET /api/phase6/queue/tasks/:taskId` - Get status
- `GET /api/phase6/queue/stats` - Get statistics
- `GET /api/phase6/queue/dlq` - Get DLQ
- `POST /api/phase6/queue/dlq/:taskId/retry` - Retry from DLQ

### 2. Analytics Service

**File:** `server/analytics/analytics.service.ts`

**Purpose:** Comprehensive event tracking and analytics for user behavior and system performance.

**Key Features:**

- Real-time event tracking
- User analytics (messages, conversations, devices)
- Dashboard metrics
- Time-range analytics
- User behavior pattern detection
- CSV export capability

**Tracked Events:**

- `message_sent` - Message transmission
- `user_login` - User authentication
- `search_query` - Search operations
- `api_call` - API usage tracking
- `conversation_started` - New conversations
- `conversation_ended` - Conversation closure

**Usage Example:**

```typescript
import AnalyticsService from './analytics/analytics.service.ts';

const analytics = new AnalyticsService();

// Track events
analytics.trackEvent('user123', 'message_sent', {
  conversationId: 'conv456',
  hasMedia: true,
});

analytics.trackMessageSent('user123', 'conv456', true);
analytics.trackUserLogin('user123', 'Mobile');
analytics.trackSearch('user123', 'property search', 45);

// Get dashboard metrics
const metrics = analytics.getDashboardMetrics();
// {
//   totalUsers: 500,
//   activeUsers24h: 150,
//   totalConversations: 1200,
//   totalMessages: 50000,
//   avgResponseTime: 234,
//   messagePerHour: 42,
//   topUsers: [...],
//   topConversations: [...]
// }

// Get user analytics
const userAnalytics = analytics.getUserAnalytics('user123');

// Get behavior patterns
const patterns = analytics.getUserBehaviorPatterns('user123');
// {
//   peakHours: [14, 15, 16],
//   averageMessagesPerHour: 8.5,
//   preferredDevices: ['Mobile', 'Web'],
//   averageResponseTime: 345
// }

// Time range analytics
const rangeAnalytics = analytics.getAnalyticsByTimeRange(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

**API Endpoints:**

- `POST /api/phase6/analytics/events` - Track event
- `GET /api/phase6/analytics/dashboard` - Dashboard metrics
- `GET /api/phase6/analytics/users/:userId` - User analytics
- `GET /api/phase6/analytics/users/:userId/patterns` - Behavior patterns
- `GET /api/phase6/analytics/range` - Time range analytics
- `GET /api/phase6/analytics/export/csv` - Export analytics

### 3. Notification Service

**File:** `server/notifications/notification.service.ts`

**Purpose:** Multi-channel notification management with preference control.

**Key Features:**

- Push notification support
- Email notification ready
- SMS notification ready
- User preference management
- Do Not Disturb schedules
- Notification logging
- Per-user notification type control

**Notification Types:**

- Message received
- Conversation invite
- System alerts
- Analytics digests

**Usage Example:**

```typescript
import NotificationService from './notifications/notification.service.ts';

const notifications = new NotificationService();

// Subscribe device
notifications.subscribeDevice('user123', subscription);

// Set preferences
notifications.setPreferences('user123', {
  pushEnabled: true,
  emailEnabled: true,
  doNotDisturb: {
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
  },
  notificationTypes: {
    messageReceived: true,
    conversationInvite: true,
    systemAlert: true,
    analytics: false,
  },
});

// Send notifications
await notifications.sendMessageNotification(
  'user123',
  'John Doe',
  'Hey, are you interested in the property?',
  'conv456'
);

await notifications.sendConversationInviteNotification('user123', 'Jane Smith', 'conv789');

await notifications.sendSystemAlert(
  'user123',
  'System Maintenance',
  'Scheduled maintenance tonight at 2 AM',
  'high'
);

// Bulk notifications
const success = await notifications.sendBulkNotifications(
  ['user1', 'user2', 'user3'],
  'system_alert',
  payload
);

// Get notification log
const logs = notifications.getNotificationLog('user123', 50);

// Stats
const stats = notifications.getStats('user123');
// {
//   totalSent: 450,
//   totalFailed: 2,
//   totalRead: 430,
//   pendingCount: 3
// }
```

**API Endpoints:**

- `POST /api/phase6/notifications/subscribe` - Subscribe device
- `GET /api/phase6/notifications/preferences` - Get preferences
- `PUT /api/phase6/notifications/preferences` - Update preferences
- `GET /api/phase6/notifications/log` - Get notification log
- `GET /api/phase6/notifications/stats` - Get statistics

### 4. Encryption Service

**File:** `server/security/encryption.service.ts`

**Purpose:** End-to-end encryption and data security.

**Key Features:**

- AES-256-GCM symmetric encryption
- RSA-2048 asymmetric encryption
- Digital signatures
- Password-based key derivation (PBKDF2)
- Secure token generation
- Key rotation support
- File encryption ready

**Usage Example:**

```typescript
import EncryptionService from './security/encryption.service.ts';

const encryption = new EncryptionService();

// Generate user key pair
const keyPair = encryption.generateUserKeyPair('user123');
// {
//   publicKey: '-----BEGIN PUBLIC KEY-----...',
//   privateKey: '-----BEGIN PRIVATE KEY-----...',
//   keyId: 'key-1704067200000',
//   createdAt: 2024-01-01T00:00:00Z,
//   expiresAt: 2025-01-01T00:00:00Z
// }

// Get public key
const pubKey = encryption.getUserPublicKey('user456');

// Generate conversation key
const convKey = encryption.generateConversationKey('conv123');

// Encrypt message
const encrypted = encryption.encryptMessage('Secret message', convKey);
// {
//   ciphertext: 'a1b2c3d4...',
//   iv: 'e5f6g7h8...',
//   authTag: 'i9j0k1l2...',
//   algorithm: 'aes-256-gcm',
//   keyId: 'default'
// }

// Decrypt message
const decrypted = encryption.decryptMessage(encrypted, convKey);
// 'Secret message'

// Digital signatures
const signature = encryption.signData('data', privateKey);
const isValid = encryption.verifySignature('data', signature, publicKey);

// Hash data
const hash = encryption.hashData('password', 'sha256');

// Derive key from password
const { key, salt } = encryption.deriveKeyFromPassword('password123');

// Rotate keys
const newKeyPair = encryption.rotateUserKeys('user123');

// Security metrics
const metrics = encryption.getSecurityMetrics();
// {
//   totalUsersWithKeys: 500,
//   activeConversations: 1200,
//   keysExpiringInThirtyDays: 5
// }
```

**API Endpoints:**

- `POST /api/phase6/encryption/keys/generate` - Generate key pair
- `GET /api/phase6/encryption/keys/public/:userId` - Get public key
- `POST /api/phase6/encryption/messages/encrypt` - Encrypt message
- `POST /api/phase6/encryption/messages/decrypt` - Decrypt message
- `GET /api/phase6/encryption/metrics` - Security metrics

### 5. Presence & Sync Service

**File:** `server/presence/presence.service.ts`

**Purpose:** Real-time user presence tracking and data synchronization.

**Key Features:**

- Multi-status presence (online, offline, away, busy)
- Presence history tracking
- Conversation participation tracking
- User location support
- State synchronization
- Presence analytics
- Inactivity detection

**Usage Example:**

```typescript
import PresenceAndSyncService from './presence/presence.service.ts';

const presence = new PresenceAndSyncService();

// Update presence
presence.updatePresence('user123', 'online');
presence.updatePresence('user123', 'away');
presence.updatePresence('user123', 'offline');

// Get presence
const userPresence = presence.getPresence('user123');
// {
//   userId: 'user123',
//   status: 'online',
//   lastSeen: 2024-01-01T12:34:56Z,
//   activeConversations: ['conv1', 'conv2'],
//   device: 'Mobile'
// }

// Get online users
const onlineUsers = presence.getOnlineUsers();

// Conversation tracking
presence.addUserToConversation('user123', 'conv456');
const conversationUsers = presence.getUsersInConversation('conv456');
presence.removeUserFromConversation('user123', 'conv456');

// Location
presence.setUserLocation('user123', 40.7128, -74.006);

// Sync state
const syncState = presence.getSyncState('user123');

// Get changes since sync
const changes = presence.getChangesSinceSync('user123', lastSyncTime);
// {
//   changedConversations: ['conv1', 'conv3'],
//   changedMessages: ['msg5', 'msg7']
// }

// Presence history
const history = presence.getPresenceHistory('user123', 24); // last 24 hours

// Analytics
const analytics = presence.getPresenceAnalytics(24);
// {
//   totalUsers: 500,
//   onlineUsers: 150,
//   avgSessionDuration: 34.5, // minutes
//   peakOnlineTime: 14 // 2 PM
// }

// Health
const health = presence.getHealth();
// {
//   onlineCount: 150,
//   offlineCount: 350,
//   activeTimers: 125,
//   syncStatesTracked: 500
// }
```

**API Endpoints:**

- `POST /api/phase6/presence/update` - Update presence
- `GET /api/phase6/presence/:userId` - Get user presence
- `GET /api/phase6/presence` - Get online users
- `GET /api/phase6/presence/conversations/:conversationId` - Get conversation users
- `GET /api/phase6/sync/state` - Get sync state
- `GET /api/phase6/sync/changes` - Get sync changes
- `GET /api/phase6/presence/:userId/history` - Presence history
- `GET /api/phase6/presence/analytics/summary` - Presence analytics

## Integration with Main Server

### Adding to Express Server

```typescript
import { phase6Router } from './routes/phase6.routes.js';

app.use('/api/phase6', phase6Router);
```

### Worker Setup

```typescript
import { queueService } from './routes/phase6.routes.js';

// Register message sending worker
queueService.registerWorker(
  'send_message',
  async data => {
    const { userId, conversationId, message } = data;
    await sendMessageToWhatsApp(userId, conversationId, message);
  },
  10
);

// Register notification worker
queueService.registerWorker(
  'send_notification',
  async data => {
    const { userId, notification } = data;
    await sendPushNotification(userId, notification);
  },
  5
);

// Register analytics worker
queueService.registerWorker(
  'process_analytics',
  async data => {
    const { event, metadata } = data;
    await storeAnalytics(event, metadata);
  },
  3
);
```

## WebSocket Integration

The services integrate with WebSocket for real-time updates:

```typescript
import { presenceService } from './routes/phase6.routes.js';

wsService.on('user:online', userId => {
  presenceService.updatePresence(userId, 'online');
});

wsService.on('user:offline', userId => {
  presenceService.updatePresence(userId, 'offline');
});

wsService.on('message:sent', (userId, conversationId, hasMedia) => {
  analyticsService.trackMessageSent(userId, conversationId, hasMedia);
  presenceService.updateConversationVersion(userId, conversationId);
});
```

## Database Schema Extensions

### Queue State

```typescript
interface QueueTask {
  id: string;
  type: string;
  data: any;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  nextRetry?: Date;
  error?: string;
}
```

### Analytics Events

```typescript
interface AnalyticsEvent {
  _id: ObjectId;
  userId: string;
  eventType: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### Notifications Log

```typescript
interface NotificationLog {
  _id: ObjectId;
  userId: string;
  type: string;
  payload: PushNotificationPayload;
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed' | 'read';
  error?: string;
}
```

### Encryption Keys

```typescript
interface UserKey {
  _id: ObjectId;
  userId: string;
  publicKey: string;
  privateKey: string;
  keyId: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}
```

## Performance Considerations

### Memory Management

- Queue service uses circular buffer for task storage
- Analytics service maintains max 10,000 events
- Notification logs cleaned after 30 days
- Presence data cleaned for inactive users hourly

### Scalability

- Message queue with priority and concurrency control
- Distributed presence tracking ready
- Analytics aggregation for bulk operations
- Encryption with key rotation support

### Monitoring

```typescript
// Health check endpoint
GET /api/phase6/health
Response: {
  status: 'healthy',
  queue: { ... },
  presence: { ... },
  timestamp: 2024-01-01T12:34:56Z
}
```

## Security Best Practices

1. **Key Management**
   - RSA-2048 for asymmetric encryption
   - AES-256-GCM for symmetric encryption
   - PBKDF2 for password derivation
   - Automatic key rotation

2. **Message Security**
   - End-to-end encryption support
   - Digital signatures for authenticity
   - Authenticated encryption (GCM mode)

3. **Access Control**
   - User authentication required for all endpoints
   - Role-based access control ready
   - Rate limiting recommended

## Testing

See `PHASE6_BACKEND_TESTS.md` for comprehensive test coverage.

## Troubleshooting

### Queue Issues

- Check DLQ for failed tasks
- Review task logs in console
- Verify worker registration

### Analytics Issues

- Verify event tracking is enabled
- Check timezone settings
- Review event format

### Notification Issues

- Check device subscriptions
- Verify user preferences
- Review DND schedules

### Encryption Issues

- Verify key pair generation
- Check key expiration
- Validate signature verification

## Next Steps

1. Implement database persistence for all services
2. Add caching layer (Redis)
3. Set up distributed queue (RabbitMQ/Bull)
4. Implement push notification service integration
5. Add audit logging
6. Set up monitoring and alerting
7. Performance testing and optimization
