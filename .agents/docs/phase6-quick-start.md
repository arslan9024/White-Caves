# Phase 6: Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Environment Setup (1 min)

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
# Set NODE_ENV=development
# Set MONGODB_URI=mongodb://localhost:27017/white-caves
```

### Step 2: Start Services (2 min)

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start development server
npm run dev
```

### Step 3: Verify Setup (1 min)

```bash
# Check health endpoint
curl http://localhost:3000/api/phase6/health

# Expected response:
# {
#   "status": "healthy",
#   "queue": {...},
#   "presence": {...},
#   "timestamp": "..."
# }
```

### Step 4: Run Tests (1 min)

```bash
# Run all Phase 6 tests
npm test -- phase6.backend.test.ts
```

---

## 📚 Service Quick Reference

### Message Queue Service

```typescript
import { queueService } from './routes/phase6.routes.js';

// Add task
const taskId = await queueService.addTask(
  'send_message',
  { userId: '123', message: 'Hello' },
  'high'
);

// Get status
const task = queueService.getTaskStatus(taskId);

// Get stats
const stats = queueService.getStats();
```

### Analytics Service

```typescript
import { analyticsService } from './routes/phase6.routes.js';

// Track event
analyticsService.trackEvent('user123', 'message_sent', {
  conversationId: 'conv456',
});

// Get metrics
const metrics = analyticsService.getDashboardMetrics();
```

### Encryption Service

```typescript
import { encryptionService } from './routes/phase6.routes.js';

// Generate keys
const keyPair = encryptionService.generateUserKeyPair('user123');

// Encrypt message
const encrypted = encryptionService.encryptMessage('Hello', key);

// Decrypt message
const decrypted = encryptionService.decryptMessage(encrypted, key);
```

### Presence Service

```typescript
import { presenceService } from './routes/phase6.routes.js';

// Update presence
presenceService.updatePresence('user123', 'online');

// Get online users
const onlineUsers = presenceService.getOnlineUsers();

// Get presence analytics
const analytics = presenceService.getPresenceAnalytics(24);
```

### Notification Service

```typescript
import { notificationService } from './routes/phase6.routes.js';

// Subscribe device
notificationService.subscribeDevice('user123', subscription);

// Send notification
await notificationService.sendMessageNotification('user123', 'John Doe', 'Hello!', 'conv456');
```

---

## 🔌 API Endpoints Summary

### Queue Management

```
POST   /api/phase6/queue/tasks                    Create task
GET    /api/phase6/queue/tasks/:taskId            Get status
GET    /api/phase6/queue/stats                    Get statistics
GET    /api/phase6/queue/dlq                      Get DLQ
POST   /api/phase6/queue/dlq/:taskId/retry        Retry task
```

### Analytics

```
POST   /api/phase6/analytics/events               Track event
GET    /api/phase6/analytics/dashboard            Dashboard metrics
GET    /api/phase6/analytics/users/:userId        User analytics
GET    /api/phase6/analytics/range                Time range
GET    /api/phase6/analytics/export/csv           Export CSV
```

### Notifications

```
POST   /api/phase6/notifications/subscribe        Subscribe device
GET    /api/phase6/notifications/preferences      Get preferences
PUT    /api/phase6/notifications/preferences      Update preferences
GET    /api/phase6/notifications/log              Get log
```

### Encryption

```
POST   /api/phase6/encryption/keys/generate       Generate keys
GET    /api/phase6/encryption/keys/public/:userId Get public key
POST   /api/phase6/encryption/messages/encrypt    Encrypt
POST   /api/phase6/encryption/messages/decrypt    Decrypt
```

### Presence & Sync

```
POST   /api/phase6/presence/update                Update status
GET    /api/phase6/presence/:userId               Get presence
GET    /api/phase6/presence                       Online users
GET    /api/phase6/sync/state                     Get sync state
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run specific service tests
npm test -- --grep "MessageQueueService"
npm test -- --grep "AnalyticsService"
npm test -- --grep "EncryptionService"

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📊 Using Postman

### 1. Import Collection

Create a new Postman collection with these requests:

### 2. Queue Management

**POST** `/api/phase6/queue/tasks`

```json
{
  "type": "send_notification",
  "data": {
    "userId": "user123",
    "message": "Hello World"
  },
  "priority": "high",
  "maxAttempts": 3
}
```

**GET** `/api/phase6/queue/stats`

- Returns queue statistics

### 3. Analytics

**POST** `/api/phase6/analytics/events`

```json
{
  "eventType": "message_sent",
  "metadata": {
    "conversationId": "conv456",
    "hasMedia": true
  }
}
```

**GET** `/api/phase6/analytics/dashboard`

- Returns dashboard metrics

### 4. Notifications

**POST** `/api/phase6/notifications/subscribe`

```json
{
  "subscription": {
    "endpoint": "https://example.com/push",
    "keys": {
      "auth": "auth_key",
      "p256dh": "dh_key"
    }
  }
}
```

---

## 🛠️ Development Workflow

### 1. Starting Development

```bash
# Terminal 1: Start database
mongod

# Terminal 2: Start dev server with hot reload
npm run dev

# Terminal 3: Watch tests
npm run test:watch
```

### 2. Making Changes

1. Edit service file in `server/`
2. Tests auto-run if in watch mode
3. Restart server if needed with `rs`

### 3. Testing Changes

```bash
# Quick test
curl -X GET http://localhost:3000/api/phase6/health

# Use Postman for detailed testing
# See Postman collection above
```

---

## 📈 Performance Monitoring

### Real-time Stats

```bash
# Get queue stats
curl http://localhost:3000/api/phase6/queue/stats | jq

# Get presence stats
curl http://localhost:3000/api/phase6/presence | jq

# Get analytics dashboard
curl http://localhost:3000/api/phase6/analytics/dashboard | jq
```

### Health Check

```bash
# Monitor health continuously
watch -n 5 curl http://localhost:3000/api/phase6/health
```

---

## 🔐 Security Checklist

- [ ] Set JWT_SECRET in .env
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use HTTPS in production
- [ ] Enable encryption for messages
- [ ] Set up audit logging
- [ ] Use strong passwords
- [ ] Rotate keys periodically

---

## 📝 Useful Commands

```bash
# Build for production
npm run build

# Run production build
npm run build && npm start

# Format code
npm run format

# Lint code
npm run lint

# Generate types
npm run types

# Clean build artifacts
npm run clean

# Database initialization
npm run db:init

# Database reset
npm run db:reset

# Run specific test file
npm test -- phase6.backend.test.ts
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Issue: MongoDB connection failed

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /path/to/data
```

### Issue: Tests failing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests again
npm test
```

### Issue: Memory leak

```bash
# Check memory usage
node --inspect-brk server/index.ts

# Open chrome://inspect in Chrome DevTools
```

---

## 📚 Documentation

- **Full Backend Guide:** See `PHASE6_BACKEND_GUIDE.md`
- **Environment Setup:** See `PHASE6_ENVIRONMENT_SETUP.md`
- **Implementation Status:** See `PHASE6_IMPLEMENTATION_STATUS.md`
- **Test Details:** See `src/__tests__/phase6.backend.test.ts`

---

## 🎯 Next Steps

1. ✅ Environment setup complete
2. ✅ Services running
3. ✅ Tests passing
4. ⏭️ Start building UI (Phase 6B)
5. ⏭️ Add database persistence
6. ⏭️ Deploy to production

---

## 💡 Tips & Best Practices

### Service Integration

```typescript
// Always use dependency injection
const queue = new MessageQueueService();
const analytics = new AnalyticsService();

// Pass services around instead of creating new instances
function processMessage(message, queue, analytics) {
  queue.addTask('process', message);
  analytics.trackEvent('user', 'message_processed');
}
```

### Error Handling

```typescript
try {
  const result = encryptionService.decryptMessage(encrypted, key);
} catch (error) {
  logger.error('Decryption failed:', error);
  // Handle gracefully
}
```

### Performance

- Use queue service for async operations
- Cache frequently accessed data
- Monitor queue depth
- Track API response times

### Testing

- Test service methods directly
- Mock dependencies
- Test error scenarios
- Check edge cases

---

## 📞 Support

For issues or questions:

1. Check the logs in `./logs`
2. Review error messages in console
3. Check database connection
4. Verify environment variables
5. Review relevant documentation

---

**Ready to code!** 🎉  
Start with Phase 6B: UI Enhancements
