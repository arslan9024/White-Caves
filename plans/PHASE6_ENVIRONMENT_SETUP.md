# Phase 6: Environment Setup & Configuration Guide

## Prerequisites

### System Requirements
- Node.js 18+ LTS
- npm 9+ or yarn 4+
- MongoDB 5.0+ (for persistence)
- Redis 6.0+ (optional, for caching)
- Git

### Development Tools
- VS Code or similar IDE
- Postman or similar API testing tool
- Docker (optional)

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install socket.io socket.io-client
npm install redis
npm install @types/node
npm install crypto-js bcryptjs
```

### 2. Environment Variables

Create `.env.local` file in project root:

```env
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/white-caves
DB_NAME=white-caves

# Redis
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3001

# Encryption
ENCRYPTION_ENABLED=true
ENCRYPTION_ALGORITHM=aes-256-gcm

# Notifications
NOTIFICATIONS_ENABLED=true
FCM_API_KEY=your-fcm-api-key
FCM_PROJECT_ID=your-fcm-project-id

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_MAX_EVENTS=10000
ANALYTICS_RETENTION_DAYS=30

# File Storage
STORAGE_ENABLED=true
STORAGE_PATH=./uploads
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=jpg,png,gif,pdf,docx,mp3,mp4

# Security
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=7d
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# WhatsApp
WHATSAPP_ENABLED=true
WHATSAPP_API_URL=http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 3. Environment Configuration Files

#### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["node", "vitest/globals"]
  },
  "include": ["server/**/*", "src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Vite Configuration Extension
```javascript
// vite.config.js - add these to existing config
export default {
  // ... existing config
  define: {
    __ENV_PHASE6__: true,
  },
  server: {
    middlewareMode: true,
    proxy: {
      '/api/phase6': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
};
```

---

## Service Configuration

### Queue Service Setup

```typescript
// server/config/queue.config.ts
import MessageQueueService from '../queue/queue.service.js';

const queueService = new MessageQueueService();

// Register workers
queueService.registerWorker(
  'send_whatsapp_message',
  async (data) => {
    const { userId, conversationId, message } = data;
    // Implementation
  },
  10 // max concurrent
);

queueService.registerWorker(
  'send_notification',
  async (data) => {
    const { userId, notification } = data;
    // Implementation
  },
  5
);

queueService.registerWorker(
  'process_file_upload',
  async (data) => {
    const { fileId, userId } = data;
    // Implementation
  },
  3
);

export default queueService;
```

### WebSocket Configuration

```typescript
// server/config/websocket.config.ts
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

const httpServer = createServer();
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  path: '/socket.io',
});

// Configuration
io.engine.opts.maxHttpBufferSize = 1e7; // 10 MB
io.engine.opts.pingInterval = 25000;
io.engine.opts.pingTimeout = 20000;

export default io;
```

### Analytics Configuration

```typescript
// server/config/analytics.config.ts
import AnalyticsService from '../analytics/analytics.service.js';

const analyticsService = new AnalyticsService();

// Track important events
export const trackEventTypes = {
  USER_LOGIN: 'user_login',
  MESSAGE_SENT: 'message_sent',
  FILE_UPLOADED: 'file_uploaded',
  CONVERSATION_CREATED: 'conversation_created',
  SEARCH_EXECUTED: 'search_executed',
  API_CALL: 'api_call',
};

export default analyticsService;
```

### Encryption Configuration

```typescript
// server/config/encryption.config.ts
import EncryptionService from '../security/encryption.service.js';

const encryptionService = new EncryptionService();

export const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
  rsaKeySize: 2048,
  pbkdf2Iterations: 100000,
};

export default encryptionService;
```

### Storage Configuration

```typescript
// server/config/storage.config.ts
const storageConfig = {
  uploadPath: process.env.STORAGE_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  allowedMimeTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword'],
    audio: ['audio/mpeg', 'audio/wav'],
    video: ['video/mp4', 'video/webm'],
  },
  imageQuality: 80,
  imageSizes: {
    thumbnail: { width: 100, height: 100 },
    preview: { width: 400, height: 400 },
    full: { width: 1920, height: 1080 },
  },
};

export default storageConfig;
```

### Notification Configuration

```typescript
// server/config/notification.config.ts
const notificationConfig = {
  providers: {
    push: {
      enabled: true,
      // FCM config
      projectId: process.env.FCM_PROJECT_ID,
      apiKey: process.env.FCM_API_KEY,
    },
    email: {
      enabled: false,
      // SendGrid or Mailgun config
      apiKey: process.env.EMAIL_API_KEY,
      from: 'noreply@whitecaves.com',
    },
    sms: {
      enabled: false,
      // Twilio config
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },
  },
  defaultPreferences: {
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
  },
};

export default notificationConfig;
```

---

## Database Schema

### MongoDB Collections Setup

```javascript
// scripts/init-database.js
import mongoose from 'mongoose';

// Analytics Events Schema
const analyticsSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  timestamp: Date,
  metadata: mongoose.Schema.Types.Mixed,
});

// Notification Log Schema
const notificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  payload: mongoose.Schema.Types.Mixed,
  sentAt: Date,
  status: String,
  error: String,
});

// User Keys Schema
const userKeySchema = new mongoose.Schema({
  userId: String,
  publicKey: String,
  privateKey: String,
  keyId: String,
  createdAt: Date,
  expiresAt: Date,
  isActive: Boolean,
});

// Queue Tasks Schema (optional, for persistence)
const queueTaskSchema = new mongoose.Schema({
  taskId: String,
  type: String,
  data: mongoose.Schema.Types.Mixed,
  priority: String,
  status: String,
  attempts: Number,
  maxAttempts: Number,
  createdAt: Date,
  nextRetry: Date,
  error: String,
});

// File Uploads Schema
const fileUploadSchema = new mongoose.Schema({
  fileId: String,
  userId: String,
  filename: String,
  mimeType: String,
  size: Number,
  storagePath: String,
  metadata: mongoose.Schema.Types.Mixed,
  uploadedAt: Date,
  expiresAt: Date,
});

// Create indexes
analyticsSchema.index({ userId: 1, timestamp: -1 });
notificationSchema.index({ userId: 1, sentAt: -1 });
userKeySchema.index({ userId: 1, isActive: 1 });
queueTaskSchema.index({ status: 1, priority: -1 });
fileUploadSchema.index({ userId: 1, uploadedAt: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsSchema);
const NotificationLog = mongoose.model('NotificationLog', notificationSchema);
const UserKey = mongoose.model('UserKey', userKeySchema);
const QueueTask = mongoose.model('QueueTask', queueTaskSchema);
const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

export {
  AnalyticsEvent,
  NotificationLog,
  UserKey,
  QueueTask,
  FileUpload,
};
```

---

## Server Integration

### Main Server File (`server/index.ts`)

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { phase6Router } from './routes/phase6.routes.js';
import WebSocketService from './websocket/websocket.service.js';
import { presenceService } from './routes/phase6.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  next();
});

// API Routes
app.use('/api/phase6', phase6Router);

// WebSocket Setup
const wsService = new WebSocketService(io);

// Presence tracking
io.on('connection', (socket) => {
  const userId = socket.handshake.headers['x-user-id'] as string;

  if (userId) {
    presenceService.updatePresence(userId, 'online');

    socket.on('disconnect', () => {
      presenceService.updatePresence(userId, 'offline');
    });

    socket.on('typing', ({ conversationId }) => {
      io.emit('user:typing', { userId, conversationId });
    });

    socket.on('stop-typing', ({ conversationId }) => {
      io.emit('user:stop-typing', { userId, conversationId });
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, httpServer, io };
```

---

## Docker Setup (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000 3001

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/white-caves
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

---

## Testing Setup

### Test Environment Variables
Create `.env.test`:
```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/white-caves-test
REDIS_ENABLED=false
WEBSOCKET_ENABLED=false
```

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific service tests
npm test -- phase6.backend.test.ts
```

---

## Performance Optimization

### Production Configuration

```env
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
RATE_LIMIT_MAX_REQUESTS=1000
ANALYTICS_MAX_EVENTS=50000
COMPRESSION_ENABLED=true
```

### Build Optimization
```bash
npm run build
npm run build:prod
```

---

## Deployment Checklist

- [ ] Set all required environment variables
- [ ] Database connection verified
- [ ] Redis connection verified (if enabled)
- [ ] File storage path created and writable
- [ ] SSL/TLS certificates configured
- [ ] Rate limiting enabled
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] CORS properly configured

---

## Monitoring & Health Checks

### Health Check Endpoint
```
GET /api/phase6/health
```

Response:
```json
{
  "status": "healthy",
  "queue": {
    "pending": 5,
    "processing": 2,
    "completed": 1000,
    "failed": 3,
    "dlqSize": 0,
    "totalTasks": 1010
  },
  "presence": {
    "onlineCount": 150,
    "offlineCount": 350,
    "activeTimers": 125,
    "syncStatesTracked": 500
  },
  "timestamp": "2024-01-01T12:34:56Z"
}
```

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check connection string in .env
   - Verify network connectivity

3. **WebSocket Connection Issues**
   - Check CORS configuration
   - Verify socket.io port is open
   - Check firewall settings

4. **Memory Leaks**
   - Monitor with `node --inspect`
   - Use Chrome DevTools for profiling
   - Check for event listener cleanup

---

## Next Steps

1. Install all dependencies
2. Create and configure `.env.local`
3. Run database initialization
4. Start development server
5. Run test suite
6. Begin UI implementation (Phase 6B)

---

**Setup Complete!** ✅  
You're ready to start Phase 6 development.
