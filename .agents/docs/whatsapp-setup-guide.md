# WhatsApp Backend Integration - Developer Setup Guide

## Prerequisites

- Node.js 16+ installed
- MongoDB instance running
- npm or yarn package manager
- Basic understanding of Express.js

## Step 1: Install Dependencies

The WhatsApp integration requires the following additional packages:

```bash
npm install qrcode crypto --save
```

Already available (no install needed):
- `mongodb` - for database operations
- `events` - for EventEmitter
- `express` - for API routes

## Step 2: Setup MongoDB Connection

### Option A: Local MongoDB
```bash
# Windows - if using MongoDB service
net start MongoDB

# Or run directly
mongod --dbpath C:\data\db
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Set environment variable:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/whatsapp_linda
```

## Step 3: Create API Entry Point

Create `api/whatsapp.js`:

```javascript
const express = require('express');
const { MongoClient } = require('mongodb');
const WhatsAppIntegrationFactory = require('../backend/services/whatsapp');
const { initializeWhatsAppRoutes } = require('../backend/services/whatsapp/routes');

const router = express.Router();
let whatsappFactory = null;
let mongoClient = null;

/**
 * Initialize WhatsApp services (lazy loading)
 */
async function initializeWhatsApp() {
  if (whatsappFactory) {
    return whatsappFactory;
  }

  try {
    // Connect to MongoDB
    mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');

    const db = mongoClient.db('whatsapp_linda');

    // Create indexes for better query performance
    await createIndexes(db);

    // Initialize WhatsApp factory
    whatsappFactory = new WhatsAppIntegrationFactory(db, {
      sessionStoreType: process.env.SESSION_STORE_TYPE || 'database',
      maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '86400000'),
      messageQueueSize: parseInt(process.env.MESSAGE_QUEUE_SIZE || '1000'),
    });

    await whatsappFactory.initialize();
    console.log('✅ WhatsApp integration initialized');

    return whatsappFactory;
  } catch (error) {
    console.error('❌ Failed to initialize WhatsApp:', error);
    throw error;
  }
}

/**
 * Create database indexes for optimal performance
 */
async function createIndexes(db) {
  try {
    // Sessions collection indexes
    await db.collection('whatsapp_sessions').createIndex({ sessionId: 1 }, { unique: true });
    await db.collection('whatsapp_sessions').createIndex({ accountId: 1 });
    await db.collection('whatsapp_sessions').createIndex({ status: 1 });
    await db.collection('whatsapp_sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Counters collection indexes
    await db.collection('whatsapp_counters').createIndex({ accountId: 1 }, { unique: true });

    // Conversations collection indexes
    await db.collection('conversations').createIndex({ conversationId: 1 });
    await db.collection('conversations').createIndex({ accountId: 1 });
    await db.collection('conversations').createIndex({ recipientPhone: 1 });
    await db.collection('conversations').createIndex({ lastMessageTime: -1 });

    // Messages collection indexes
    await db.collection('messages').createIndex({ conversationId: 1 });
    await db.collection('messages').createIndex({ accountId: 1 });
    await db.collection('messages').createIndex({ timestamp: -1 });
    await db.collection('messages').createIndex({ body: 'text' }); // Text index for search

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️  Index creation warning:', error.message);
    // Continue even if indexes fail (might already exist)
  }
}

/**
 * Middleware to ensure WhatsApp is initialized
 */
router.use(async (req, res, next) => {
  try {
    const factory = await initializeWhatsApp();
    req.whatsappFactory = factory;
    next();
  } catch (error) {
    res.status(500).json({ error: 'WhatsApp service unavailable' });
  }
});

/**
 * Mount WhatsApp routes
 */
const whatsappRoutes = initializeWhatsAppRoutes(null);
router.use('/', whatsappRoutes);

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down...');
  
  if (whatsappFactory) {
    await whatsappFactory.shutdown();
  }
  
  if (mongoClient) {
    await mongoClient.close();
    console.log('✅ MongoDB connection closed');
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Shutting down...');
  
  if (whatsappFactory) {
    await whatsappFactory.shutdown();
  }
  
  if (mongoClient) {
    await mongoClient.close();
  }
  
  process.exit(0);
});

module.exports = router;
```

## Step 4: Mount WhatsApp Routes in Main Server

Update your `api/index.js` or main server file:

```javascript
const express = require('express');
const whatsappRouter = require('./whatsapp');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount WhatsApp API
app.use('/api/whatsapp', whatsappRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
```

## Step 5: Configure Environment Variables

Create `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=whatsapp_linda

# WhatsApp Integration
SESSION_STORE_TYPE=database
MAX_RETRIES=3
SESSION_TIMEOUT=86400000
MESSAGE_QUEUE_SIZE=1000

# Server
PORT=3000
NODE_ENV=development

# Optional: Webhook for events
WHATSAPP_WEBHOOK_URL=https://your-domain.com/webhooks/whatsapp
```

## Step 6: Test the Integration

### 1. Start Your Server
```bash
npm run dev
# or
node api/index.js
```

### 2. Test Device Linking
```bash
curl -X POST http://localhost:3000/api/whatsapp/link \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "test_account_001",
    "phoneNumber": "+971501234567"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "sessionId": "abc123...",
    "accountId": "test_account_001",
    "qrCode": "data:image/png;base64,iVBORw0KGgo...",
    "expiresIn": 300,
    "status": "waiting_for_scan"
  }
}
```

### 3. Verify MongoDB Collections
```javascript
// In MongoDB client
use whatsapp_linda
db.whatsapp_sessions.findOne()
db.conversations.findOne()
db.messages.findOne()
db.whatsapp_counters.findOne()
```

## Step 7: Enable Logging

Add to your main server for debugging:

```javascript
// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal error'
  });
});
```

## Step 8: Connect to Frontend (When Ready)

When building frontend components:

```typescript
// frontend/services/whatsapp.service.ts
const API_BASE = 'http://localhost:3000/api/whatsapp';

export const whatsappService = {
  // Device linking
  async initiateLink(accountId: string, phoneNumber: string) {
    const res = await fetch(`${API_BASE}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, phoneNumber }),
    });
    return res.json();
  },

  async confirmLink(sessionId: string, authToken: string, phoneNumber: string) {
    const res = await fetch(`${API_BASE}/confirm-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, authToken, phoneNumber }),
    });
    return res.json();
  },

  // Account management
  async listAccounts() {
    const res = await fetch(`${API_BASE}/accounts`);
    return res.json();
  },

  // Messaging
  async sendMessage(accountId: string, recipientPhone: string, message: string) {
    const res = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, recipientPhone, message }),
    });
    return res.json();
  },

  // Conversations
  async getConversations(accountId: string) {
    const res = await fetch(`${API_BASE}/conversations/${accountId}`);
    return res.json();
  },

  // Analytics
  async getMetrics(accountId: string) {
    const res = await fetch(`${API_BASE}/metrics/${accountId}`);
    return res.json();
  },
};
```

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Use different port
```bash
PORT=3001 npm run dev
```

### QR Code Not Generating
**Solution:** Ensure `qrcode` package is installed
```bash
npm install qrcode
```

### Database Queries Slow
**Solution:** Create indexes (done automatically in setup)
```javascript
// Or manually in MongoDB shell
db.messages.createIndex({ conversationId: 1 })
db.conversations.createIndex({ lastMessageTime: -1 })
```

## Performance Tuning

### 1. Enable Query Logging
```javascript
mongoClient.on('commandSucceeded', (event) => {
  console.log(`[${event.durationMS}ms] ${event.commandName}`);
});
```

### 2. Monitor Memory Usage
```javascript
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(`Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
}, 60000);
```

### 3. Enable Connection Pooling
```javascript
const mongoClient = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

## Security Checklist

- [ ] Environment variables not in version control
- [ ] MongoDB authentication enabled
- [ ] API endpoints authenticated (add auth middleware)
- [ ] HTTPS enabled in production
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Database backup strategy
- [ ] Error logging (no sensitive data)
- [ ] CORS configured properly
- [ ] Session tokens encrypted

## Next Steps

1. ✅ Backend setup complete
2. → Build frontend components
3. → Integrate with Linda AI
4. → Test end-to-end flow
5. → Deploy to production

## Support

If you encounter issues:

1. Check console logs for error messages
2. Verify MongoDB is running and accessible
3. Check environment variables are set
4. Review API endpoint request/response
5. Check browser console for frontend errors
6. See `WHATSAPP_INTEGRATION_README.md` for detailed docs

---

**Setup Complete!** 🎉

You now have a fully functional WhatsApp Web integration backend. Next, build the frontend components to create the user interface.
