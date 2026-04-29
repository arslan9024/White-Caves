# Phase 5 - Testing & Deployment Comprehensive Guide

## Overview

This guide covers all testing, CI/CD, deployment, backend extension, and UI enhancement tasks for the White Caves WhatsApp Dashboard (Phase 5).

## Table of Contents

1. [Testing Infrastructure](#testing-infrastructure)
2. [Deployment Configuration](#deployment-configuration)
3. [Backend Extensions](#backend-extensions)
4. [UI Enhancements](#ui-enhancements)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Production Checklist](#production-checklist)

---

## Testing Infrastructure

### Test Setup

All test files are located in `src/__tests__/`:

```
src/__tests__/
├── setupTests.ts              # Jest configuration
├── utils/
│   └── testUtils.tsx          # Reusable test utilities
├── hooks/
│   ├── useWhatsAppIntegration.test.ts
│   ├── useWhatsAppConversations.test.ts
│   └── useWhatsAppAnalytics.test.ts
├── components/
│   ├── AccountLink.test.tsx
│   └── ChatInterface.test.tsx
├── services/
│   └── whatsapp.service.test.ts
├── api/
│   └── whatsapp-api.test.ts
└── e2e/
    └── whatsapp-dashboard.spec.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test src/__tests__/hooks/useWhatsAppIntegration.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Account"

# Run E2E tests
npm run test:e2e

# Run API tests
npm run test:api
```

### Test Coverage Goals

- **Overall Coverage**: 80%+
- **Components**: 85%+
- **Hooks**: 90%+
- **Services**: 85%+
- **API Routes**: 80%+

### Current Test Suites

#### 1. Unit Tests - Custom Hooks
- `useWhatsAppIntegration.test.ts`
  - Service initialization
  - Account linking/unlinking
  - Lifecycle management
  - Error handling

- `useWhatsAppConversations.test.ts`
  - Conversation fetching
  - Message retrieval
  - Conversation actions (archive, mute, delete)
  - Pagination and filtering

- `useWhatsAppAnalytics.test.ts`
  - Statistics fetching
  - Data aggregation
  - Chart data generation
  - Performance metrics

#### 2. Component Tests
- `AccountLink.test.tsx`
  - Account form rendering
  - Form validation
  - Account linking
  - Success/error states
  - Loading states

- `ChatInterface.test.tsx`
  - Message display
  - Message sending
  - Message editing/deletion
  - Media handling
  - Emoji picker
  - Responsive behavior
  - Accessibility compliance

#### 3. Service Integration Tests
- `whatsapp.service.test.ts`
  - Service initialization
  - Account management (link/unlink/list)
  - Message handling (send/receive/edit/delete)
  - Conversation management
  - Contact management
  - Session management
  - Analytics
  - Media handling
  - Error handling

#### 4. API Tests
- `whatsapp-api.test.ts`
  - Authentication & authorization
  - Account endpoints
  - Conversation endpoints
  - Message endpoints
  - Contact endpoints
  - Analytics endpoints
  - Media endpoints
  - Session endpoints
  - Error handling
  - Data validation
  - Rate limiting

#### 5. E2E Tests
- `whatsapp-dashboard.spec.ts`
  - Dashboard loading
  - Navigation
  - Account linking flow
  - Conversation management
  - Chat interface
  - Message operations
  - Analytics dashboard
  - Settings
  - Responsive design
  - Performance
  - Error handling

---

## Deployment Configuration

### Docker Setup

#### Development Environment

**File**: `docker-compose.dev.yml`

```bash
# Build and start dev environment
docker-compose -f docker-compose.dev.yml up -d

# Stop dev environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

**Services**:
- Frontend (React/Vite on port 5173)
- Backend API (Node.js/Express on port 3000)
- MongoDB (on port 27017)
- Redis (on port 6379)

#### Production Environment

**File**: `docker-compose.prod.yml`

```bash
# Build and start production environment
docker-compose -f docker-compose.prod.yml up -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

**Services**:
- Frontend (nginx on port 80, 443)
- Backend API (Node.js/Express on port 3000)
- MongoDB (on port 27017)
- Redis (on port 6379)
- Prometheus (monitoring)
- Grafana (dashboards)

### Docker Build

```bash
# Build application image
docker build -t white-caves:latest .

# Build with specific tag
docker build -t white-caves:v1.0.0 .

# Build for production
docker build --target production -t white-caves:latest .
```

### Environment Configuration

#### Development (.env.development)

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENVIRONMENT=development

NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://mongodb:27017/white-caves-dev
REDIS_URL=redis://redis:6379
JWT_SECRET=your-dev-secret
WHATSAPP_SESSION_FOLDER=./sessions
LOG_LEVEL=debug
```

#### Production (.env.production)

```env
VITE_API_URL=https://api.whitecaves.com
VITE_WS_URL=wss://api.whitecaves.com
VITE_ENVIRONMENT=production

NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://mongodb:27017/white-caves-prod
REDIS_URL=redis://redis:6379
JWT_SECRET=your-prod-secret
WHATSAPP_SESSION_FOLDER=/data/sessions
LOG_LEVEL=info
```

---

## Backend Extensions

### 1. WebSocket Support

**File**: `server/websocket/websocket.service.ts`

Features:
- Real-time message updates
- Conversation status updates
- Account connection status
- Typing indicators
- Read receipts
- Online/offline status

```typescript
// Usage
const wsService = new WebSocketService();
wsService.emitMessage(conversationId, messageData);
wsService.broadcastConversationUpdate(conversationId, updateData);
```

### 2. Advanced Analytics

**File**: `server/analytics/analytics.service.ts`

Features:
- Real-time message trends
- Response time analytics
- Conversation sentiment analysis
- Contact engagement scoring
- Campaign performance tracking
- Revenue attribution

### 3. File Upload & Storage

**File**: `server/storage/storage.service.ts`

Features:
- Secure file uploads
- Cloud storage integration (S3, Azure)
- File virus scanning
- Thumbnail generation
- Automatic cleanup of old files

### 4. Queue System

**File**: `server/queue/queue.service.ts`

Features:
- Message queue for reliable delivery
- Batch processing
- Retry logic with exponential backoff
- Priority queue support

---

## UI Enhancements

### 1. Media Attachments

**Components**:
- `src/components/WhatsApp/MediaUpload.tsx`
- `src/components/WhatsApp/MediaGallery.tsx`

Features:
- Drag-and-drop file upload
- Image preview
- Video playback
- Document preview
- Progress indicators

### 2. Group Messaging

**Components**:
- `src/components/WhatsApp/GroupChat.tsx`
- `src/components/WhatsApp/GroupSettings.tsx`

Features:
- Create/edit groups
- Add/remove members
- Group settings management
- Group notifications
- Admin controls

### 3. Message Scheduling

**Components**:
- `src/components/WhatsApp/ScheduleMessage.tsx`
- `src/pages/WhatsApp/MessageScheduler.tsx`

Features:
- Schedule messages for future delivery
- Recurring message scheduling
- Time zone support
- Message templates
- Scheduled message management

### 4. Advanced Search

**Components**:
- `src/components/WhatsApp/AdvancedSearch.tsx`
- `src/hooks/useAdvancedSearch.ts`

Features:
- Full-text search
- Filter by date range
- Filter by conversation type
- Filter by message type
- Search history

### 5. Message Reactions

**Components**:
- `src/components/WhatsApp/MessageReactions.tsx`

Features:
- Emoji reactions to messages
- Reaction counters
- Reaction history

### 6. Voice Messages

**Components**:
- `src/components/WhatsApp/VoiceMessageRecorder.tsx`
- `src/components/WhatsApp/VoiceMessagePlayer.tsx`

Features:
- Voice recording
- Voice playback
- Transcription

---

## CI/CD Pipeline

**File**: `.github/workflows/ci-cd.yml`

### Pipeline Stages

1. **Code Quality**
   - ESLint
   - TypeScript compilation check
   - Prettier formatting

2. **Unit Tests**
   - Jest unit tests
   - Coverage reporting
   - Code coverage upload

3. **Build Frontend**
   - Vite build
   - Artifact upload

4. **Build Docker Image**
   - Docker image creation
   - Push to container registry

5. **Deploy to Staging**
   - Automatic deployment on develop branch
   - Smoke tests

6. **Deploy to Production**
   - Manual approval required
   - Automatic deployment on main branch
   - Health checks

7. **Notifications**
   - Slack notifications
   - Email notifications

### Running CI/CD Locally

```bash
# Install GitHub CLI
brew install gh

# Authenticate with GitHub
gh auth login

# Run workflow locally
act -j unit-tests

# Run all workflows
act
```

---

## Production Checklist

### Pre-Deployment

- [ ] All tests passing (>80% coverage)
- [ ] Code review completed
- [ ] Security scan completed
- [ ] Performance benchmarks acceptable
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Backup strategy verified

### Deployment

- [ ] Database backup created
- [ ] Health check passed
- [ ] Smoke tests completed
- [ ] Monitoring alerts configured
- [ ] Log aggregation active
- [ ] CDN cache cleared (if applicable)
- [ ] DNS propagation verified

### Post-Deployment

- [ ] Application health monitored
- [ ] Error rates within acceptable limits
- [ ] Performance metrics normal
- [ ] User feedback collected
- [ ] Rollback plan ready

---

## Monitoring & Logging

### Application Monitoring

**Prometheus Metrics**:
- Request count/latency
- Error rate
- Database connection pool
- Redis connection pool
- WebSocket connections
- Message queue size

**Grafana Dashboards**:
- Application overview
- Performance metrics
- Error tracking
- Resource utilization
- User analytics

### Logging

**Application Logs**:
- Location: `logs/application.log`
- Format: JSON
- Retention: 30 days
- Level: DEBUG (dev), INFO (prod)

**Access Logs**:
- Location: `logs/access.log`
- Format: Apache Combined

---

## Troubleshooting

### Common Issues

#### Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t white-caves:latest .
```

#### Database Connection Issues
```bash
# Check MongoDB connection
docker exec mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker restart mongodb
```

#### High Memory Usage
```bash
# Check container memory
docker stats

# Increase memory limit in docker-compose
# Set memory: 2g
```

---

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Caching with Redis
- Pagination
- Rate limiting

### Infrastructure
- CDN integration
- Load balancing
- Database replication
- Horizontal scaling

---

## Security Considerations

### Application Security
- Input validation & sanitization
- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting
- API authentication

### Infrastructure Security
- HTTPS/TLS
- Environment variable protection
- Database encryption
- File upload security
- DDoS protection

---

## References

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
