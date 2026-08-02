# White Caves Real Estate Platform - Architecture Documentation

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
├──────────────────┬──────────────────┬──────────────────┐─────────────┤
│  Web Browser     │  Mobile Web      │  React Native    │  Admin UI   │
│  (React 18.2)    │  (React 18.2)    │  App             │ (React)     │
│                  │                  │  (TBD Phase 3)   │             │
└────────┬─────────┴────────┬─────────┴────────┬─────────┴──────┬──────┘
         │                  │                  │                │
         │                  │                  │                │
         └──────────────────┼──────────────────┴────────────────┘
                            │
                ┌───────────▼────────────┐
                │   PRESENTATION LAYER   │
                │   (Vite + Redux)       │
                │                        │
                │ ┌────────────────────┐ │
                │ │ Redux Store        │ │
                │ │ - wednesday        │ │
                │ │ - aurora           │ │
                │ │ - auth             │ │
                │ │ - biometric        │ │
                │ └────────────────────┘ │
                │                        │
                │ ┌────────────────────┐ │
                │ │ Components         │ │
                │ │ - Zoe Dashboard    │ │
                │ │ - Aurora Dashboard │ │
                │ │ - Login            │ │
                │ │ - Biometric Setup  │ │
                │ └────────────────────┘ │
                └───────────┬────────────┘
                            │
                ┌───────────▼────────────────────────────────────────┐
                │          API GATEWAY (Node.js/Express)             │
                │                                                     │
                │  Route: /api                                       │
                │  ┌───────────────────────────────────────────────┐│
                │  │ Authentication Middleware                     ││
                │  │ - JWT verification                            ││
                │  │ - WebAuthn/Biometric verification             ││
                │  │ - CORS handling                               ││
                │  └───────────────────────────────────────────────┘│
                │  ┌────────────────┬────────────────────────────┐  │
                │  │ Business APIs  │ Monitoring APIs            │  │
                │  ├────────────────┼────────────────────────────┤  │
                │  │ /users         │ /aurora/monitoring/health  │  │
                │  │ /properties    │ /aurora/monitoring/vercel  │  │
                │  │ /leads         │ /aurora/monitoring/mongodb │  │
                │  │ /viewings      │ /aurora/monitoring/services│  │
                │  │ /negotiations  │ /aurora/monitoring/apis    │  │
                │  │ /documents     │ /aurora/monitoring/metrics │  │
                │  │ /biometric/*   │ /aurora/monitoring/alerts  │  │
                │  │ /auth/*        │ /wednesday/plan            │  │
                │  └────────────────┴────────────────────────────┘  │
                │                                                     │
                │  Rate Limiting | Request Validation | Caching      │
                └───────────┬──────────────┬──────────────┬───────────┘
                            │              │              │
        ┌───────────────────┘              │              └──────────────────┐
        │                                  │                                 │
        ▼                                  ▼                                 ▼
┌───────────────┐              ┌────────────────────┐            ┌─────────────────┐
│  BUSINESS     │              │  INFRASTRUCTURE    │            │  EXTERNAL       │
│  SERVICES     │              │  & MONITORING      │            │  SERVICES       │
├───────────────┤              ├────────────────────┤            ├─────────────────┤
│ User Service  │              │ Redis Cache        │            │ Firebase Auth   │
│ Property Svc  │              │ - Session store    │            │ Stripe Payments │
│ Lead Service  │              │ - API response     │            │ WhatsApp API    │
│ Viewing Svc   │              │ - Rate limit count │            │ SendGrid Email  │
│ Negotiation   │              │                    │            │                 │
│ Document Svc  │              │ Monitoring Svc     │            │ Google Storage  │
│               │              │ - Health checks    │            │ Vercel Hosting  │
│ WebAuthn Svc  │              │ - Metrics collect  │            │                 │
│ (Biometric)   │              │ - Alert triggers   │            └─────────────────┘
└───────┬───────┘              └────────┬───────────┘
        │                               │
        │                    ┌──────────┴──────────┐
        │                    │                     │
        ▼                    ▼                     ▼
    ┌───────────────────────────────────────────────────────┐
    │         DATA PERSISTENCE LAYER                        │
    │                                                        │
    │  ┌──────────────┐              ┌──────────────────┐  │
    │  │ MongoDB      │              │ Session Store    │  │
    │  │ Atlas        │              │ (Redis/MongoDB)  │  │
    │  │              │              │                  │  │
    │  │ Collections: │              │ User sessions    │  │
    │  │ - Users      │              │ Biometric state  │  │
    │  │ - Properties │              │ Temp data        │  │
    │  │ - Leads      │              └──────────────────┘  │
    │  │ - Viewings   │                                    │
    │  │ - Negotiations
    │  │ - Documents  │
    │  │ - BiometricStats
    │  │ - AuditLogs  │
    │  └──────────────┘
    │
    │  Replication: 3-node cluster (High Availability)
    │  Backups: Daily, retained 30 days
    │  Encryption: AES-256 at rest, TLS in transit
    └───────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Biometric Authentication Flow

```
User                   Web Browser              API Server           WebAuthn/Biometric
 │                         │                        │                       │
 ├─ Click "Login Biometric"│                        │                       │
 │                         │                        │                       │
 │                         ├─ GET /api/biometric/register-options           │
 │                         │─────────────────────────────────────────────► │
 │                         │                        │                       │
 │                         │                        ├─ Generate challenge   │
 │                         │                        │ ├─ Create publicKey   │
 │                         │◄──── Return Options ───┤ ├─ Set timeout      │
 │                         │                        │                       │
 │◄─ Show Biometric Dialog─┤                        │                       │
 │                         │                        │                       │
 ├─ Face/Fingerprint Scan ─┤                        │                       │
 │                         ├───────────────────────────────── Acquire Sample──►
 │                         │                        │                       │
 │                         │                        │                       │◄─ Validate Sample
 │                         │                        │                       │
 │                         │                        │                       ├─ Check Platform
 │                         │                        │                       │
 │                         │                        │                       ├─ Verify Freshness
 │                         │◄──────── Return Assertion ─────────────────────┤
 │                         │                        │                       │
 │                         ├─ POST /api/biometric/verify                     │
 │                         │ (assertion + challenge response)                │
 │                         │─────────────────────────────────────────────► │
 │                         │                        │                       │
 │                         │                        ├─ Verify signature     │
 │                         │                        │ ├─ Check counter      │
 │                         │                        │ ├─ Update credential  │
 │                         │                        │ ├─ Create JWT token   │
 │                         │◄──── JWT Token + User ─┤                       │
 │                         │       Metadata          │                       │
 │◄─ Auth Success ─────────┤                        │                       │
 │                         │                        │                       │
 ├─ Redirect to Dashboard ─┤                        │                       │
 │                         │                        │                       │

Latency Targets:
- Challenge generation: < 100ms
- Biometric scan: 1-3 seconds (user dependent)
- Signature verification: < 500ms
- Total flow: < 10 seconds
```

### 2. Wednesday Test Plan Execution Flow

```
08:00 AM                         10:00 AM                        12:00 PM
  │                                │                              │
  ├─ Biometric Testing Phase       │                              │
  │ ├─ Platform detection          │                              │
  │ │ ├─ Check Safari (macOS/iOS)  │                              │
  │ │ ├─ Check Chrome (All)        │                              │
  │ │ ├─ Check Edge (Windows)      │                              │
  │ │ └─ Check Firefox (All)       │                              │
  │ │                              │                              │
  │ ├─ Registration Phase          │                              │
  │ │ ├─ 50 enrollments total      │                              │
  │ │ ├─ Face: 25 enrollments      │                              │
  │ │ ├─ Fingerprint: 25 enum      │                              │
  │ │ └─ Target: > 95% success     │                              │
  │ │                              │                              │
  │ ├─ Authentication Phase        │                              │
  │ │ ├─ 50+ login attempts        │                              │
  │ │ ├─ Success rate > 95%        │                              │
  │ │ ├─ Latency p95 < 1000ms      │                              │
  │ │ └─ Error rate < 5%           │                              │
  │ │                              │                              │
  │ └─ Results Logged to DB        │                              │
  │                                │                              │
  ├─ User Journey 1-2 (Agents)    ├─ User Journey 3-4 (Buyers)  │
  │ ├─ Create leads                │ ├─ Browse properties        │
  │ │ ├─ Target: 20 leads          │ │ ├─ Target: 50 views      │
  │ │ ├─ Each with: phone, email   │ │ ├─ Average: 30s per item │
  │ │ └─ Validate WhatsApp sending │ │ └─ UI performance: <2s   │
  │ │                              │ │                          │
  │ ├─ Schedule viewings           │ ├─ Request viewings        │
  │ │ ├─ Target: 10 viewings       │ │ ├─ Target: 5 requests   │
  │ │ ├─ Each: property + date     │ │ └─ Success rate > 90%    │
  │ │ └─ Send calendar invites     │ │                          │
  │ │                              │ ├─ Get agent contact      │
  │ │                              │ │ ├─ Send inquiry messages │
  │ │                              │ │ └─ API latency < 500ms   │
  │ │                              │ │                          │
  │ └─ Performance Check:           │ └─ Performance Check:      │
  │   API: <500ms p95              │   API: <500ms p95         │
  │   DB: <100ms p95               │   DB: <100ms p95          │
  │   Error: <0.5%                 │   Error: <0.5%            │
  │                                │                          │
  │  12:00 PM - 13:00 PM LUNCH     │                          │
  │  - Collect metrics from AM     │                          │
  │  - Review any errors           │                          │
  │  - Adjust thresholds if needed │                          │
  │                                │                          │
  │                                ├─ Afternoon sessions (same tests, higher load)
  │                                │                              │
  │                                │                         18:00 PM
  │                                │                         (End Test)
  │                                │
  │                         Results Analysis
  │                         ├─ Success metrics
  │                         ├─ Error analysis
  │                         ├─ Performance insights
  │                         └─ Recommendations

Real-time Monitoring During Test:
├─ Zoe Dashboard (Business Metrics)
│  ├─ Users registered: 0 → 50 (Face) + 50 (Fingerprint)
│  ├─ Leads created: 0 → 100+
│  ├─ Viewings scheduled: 0 → 30+
│  └─ Success rate: Target 95%+
│
└─ Aurora Dashboard (Technical Metrics)
   ├─ API Latency: P50, P95, P99 trends
   ├─ Error rate: Real-time percentage
   ├─ Database queries: Count & latency
   ├─ Service health: All 11 services
   └─ Concurrent users: Current load
```

### 3. Monitoring & Alert Flow

```
Application Metrics                Redux State              Monitoring API
     │                                  │                          │
     ├─ API request latency             │                          │
     ├─ Database query time             ├─ Store metrics in:       │
     ├─ Error counts                    │  ├─ wednesday slice      │
     ├─ Biometric success rate          │  └─ aurora slice        │
     ├─ Active user count               │                          │
     └─ Service health status           │                          │
           │                             │                          │
           └──────────┬──────────────────┴──────────────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │ Metrics Aggregation  │
            │ (Real-time Window)   │
            └──────────┬───────────┘
                      │
                ┌─────┼─────┐
                │     │     │
                ▼     ▼     ▼
            ┌──────┐ ┌──────┐ ┌──────┐
            │Check │ │Check │ │Check │
            │API   │ │DB    │ │Error │
            │Lat.  │ │Lat.  │ │Rate  │
            └─┬────┘ └─┬────┘ └─┬────┘
              │        │        │
         API Latency   │        │
         P95 > 500ms?  │        │
              │        │        │
              YES      │        │
              │        │        │
              ▼        ▼        ▼
         ┌─────────────────────────────┐
         │ Alert Triggered             │
         │ - Severity: WARNING         │
         │ - Type: HighLatency         │
         │ - Threshold: 500ms exceeded │
         └──────────┬──────────────────┘
                    │
         ┌──────────┼──────────────────┐
         │          │                  │
         ▼          ▼                  ▼
    ┌─────────┐ ┌─────────┐      ┌─────────────┐
    │ Slack   │ │ Email   │      │ PagerDuty   │
    │ #alerts │ │ Alert   │      │ (if critical)
    └─────────┘ └─────────┘      └─────────────┘

Alert Configuration (POST /api/aurora/monitoring/alert-config):
{
  "apiLatency": 500,        // ms
  "dbLatency": 100,         // ms
  "errorRate": 0.5,         // %
  "uptime": 99.9,           // %
  "concurrentUsers": 80     // users
}
```

---

## Component Architecture

### Frontend Components Structure

```
src/
├── features/
│   ├── zoe/
│   │   ├── ZoeExecutiveDashboard.jsx      [Business Dashboard]
│   │   ├── ZoeExecutiveDashboard.css      [Styling]
│   │   ├── ZoeExecutiveDashboard.test.jsx [30+ tests]
│   │   └── components/
│   │       ├── MetricsGrid.jsx
│   │       ├── RequirementsMatrix.jsx
│   │       ├── TimelineProgress.jsx
│   │       ├── EscalationsPanel.jsx
│   │       └── StatusBadges.jsx
│   │
│   ├── aurora/
│   │   ├── AuroraTechnicalDashboard.jsx     [Tech Dashboard]
│   │   ├── AuroraTechnicalDashboard.css     [Styling]
│   │   ├── AuroraTechnicalDashboard.test.jsx [30+ tests]
│   │   └── components/
│   │       ├── SystemHealth.jsx
│   │       ├── LatencyChart.jsx
│   │       ├── ErrorRateChart.jsx
│   │       ├── ServicesTable.jsx
│   │       ├── APIEndpointsTable.jsx
│   │       ├── AlertsPanel.jsx
│   │       └── RefreshControls.jsx
│   │
│   ├── biometric/
│   │   ├── BiometricLoginButton.jsx       [Login UI]
│   │   ├── BiometricSetup.jsx             [Enrollment UI]
│   │   ├── biometricService.js            [WebAuthn logic]
│   │   └── BiometricSetup.test.jsx
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── LogoutButton.jsx
│   │   └── AuthContext.jsx
│   │
│   └── shared/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── Layout.jsx
│
├── store/
│   ├── index.js
│   ├── slices/
│   │   ├── wednesday.slice.js    [Wednesday test state]
│   │   ├── aurora.slice.js       [Monitoring state]
│   │   ├── auth.slice.js         [Authentication state]
│   │   └── biometric.slice.js    [Biometric state]
│   └── middleware/
│       ├── api.middleware.js
│       └── monitoring.middleware.js
│
├── hooks/
│   ├── useMonitoring.js
│   ├── useBiometric.js
│   └── useWednesdayPlan.js
│
└── utils/
    ├── api.js              [API client]
    ├── formatting.js
    └── validators.js
```

### Backend Services Structure

```
api/
├── index.js                       [Main Express app]
├── middleware/
│   ├── auth.middleware.js        [JWT verification]
│   ├── cors.middleware.js        [CORS handling]
│   ├── rateLimit.middleware.js   [Rate limiting]
│   └── errorHandler.middleware.js
│
├── routes/
│   ├── health.routes.js          [GET /api/aurora/monitoring/health]
│   ├── vercel.routes.js          [GET /api/aurora/monitoring/vercel]
│   ├── mongodb.routes.js         [GET /api/aurora/monitoring/mongodb]
│   ├── services.routes.js        [GET /api/aurora/monitoring/services]
│   ├── apis.routes.js            [GET /api/aurora/monitoring/apis]
│   ├── metrics.routes.js         [GET /api/aurora/monitoring/metrics]
│   ├── alerts.routes.js          [GET/POST /api/aurora/monitoring/alerts]
│   ├── wednesday.routes.js       [GET /api/wednesday/plan]
│   └── biometric.routes.js       [POST /api/biometric/verify]
│
├── controllers/
│   ├── monitoring.controller.js  [Health, metrics, alerts logic]
│   ├── biometric.controller.js   [WebAuthn verification]
│   └── wednesday.controller.js   [Test plan execution]
│
├── services/
│   ├── mongodbService.js         [Database queries]
│   ├── vercelService.js          [Vercel API integration]
│   ├── metricsService.js         [Metrics aggregation]
│   ├── webAuthnService.js        [WebAuthn/Biometric]
│   └── cacheService.js           [Redis caching]
│
├── models/
│   ├── User.js
│   ├── Property.js
│   ├── Lead.js
│   ├── Viewing.js
│   ├── Negotiation.js
│   ├── Document.js
│   ├── BiometricStats.js
│   └── AuditLog.js
│
└── utils/
    ├── errorHandler.js
    ├── validators.js
    └── logger.js
```

---

## Technology Stack

### Frontend (Client)
- **Framework:** React 18.2
- **Build Tool:** Vite 7.3.1
- **State Management:** Redux Toolkit 2.7
- **Charts:** Recharts 2.x
- **Forms:** React Hook Form
- **Testing:** Vitest, React Testing Library
- **Styling:** CSS3, PostCSS
- **HTTP Client:** Axios

### Backend (Server)
- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.1
- **API:** RESTful with OpenAPI/Swagger
- **Authentication:** JWT, WebAuthn (FIDO2)
- **Database:** MongoDB Atlas 7.x
- **Caching:** Redis (for sessions, rate limit)
- **Testing:** Jest, Supertest
- **Logging:** Winston, Pino

### Infrastructure
- **Hosting:** Vercel (serverless)
- **Database:** MongoDB Atlas (managed, cloud)
- **Cache:** Redis Cloud / Upstash
- **Email:** SendGrid
- **Payment:** Stripe
- **File Storage:** Google Cloud Storage
- **Authentication:** Firebase Auth
- **Real Estate CRM:** WhatsApp API

### Monitoring & Observability
- **Metrics Collection:** Custom endpoints + Redis cache
- **Monitoring Dashboards:** React components (Zoe, Aurora)
- **Alerting:** Slack, Email, PagerDuty
- **Logs:** Vercel built-in + Winston

---

## Deployment Architecture

```
Development         Staging                   Production
├─ Local dev        ├─ Staging.vercel.app    ├─ white-caves.vercel.app
├─ npm run dev      ├─ Auto-deploy on        ├─ Manual/CI-CD deploy
├─ Mock data        │  develop branch         ├─ Blue-green deployment
└─ localhost:5173   ├─ Real MongoDB (staging)├─ Production MongoDB
                    ├─ Real Firebase (dev)   ├─ Real Firebase (prod)
                    ├─ Webhook testing       └─ All real integrations
                    └─ Smoke tests (auto)

Git Workflow:
┌─────────────────────┐
│  Feature Branches   │
│  (developer/*)      │
└──────────┬──────────┘
           │ (Pull Request)
           ▼
┌─────────────────────┐
│  develop Branch     │
│  (CI/CD Tests)      │
└──────────┬──────────┘
           │ (Code Review OK)
           ▼
┌─────────────────────┐
│  Staging Deploy     │
│  (Auto on develop)  │
└──────────┬──────────┘
           │ (Manual approval)
           ▼
┌─────────────────────┐
│  main Branch        │
│  (Production ready) │
└──────────┬──────────┘
           │ (Auto deploy)
           ▼
┌─────────────────────┐
│  Production Deploy  │
│  (Blue-Green)       │
└─────────────────────┘
```

---

## Scaling & Performance

### Current Metrics (Production)
- Build time: ~10 seconds
- Bundle size: 2.8 MB
- API latency P95: ~300-350ms
- Database latency P95: ~50-85ms
- Concurrent users: Tested up to 100+
- Uptime: 99.9%+

### Capacity Planning (Phase 3+)

| Metric | Current | Phase 3 | Phase 4 |
|--------|---------|---------|---------|
| Monthly Users | <1K | 5K | 50K |
| Daily Active | <100 | 500 | 5K |
| Concurrent | 10 | 50 | 500 |
| Requests/sec | <10 | 50 | 500+ |
| Storage (GB) | <10 | 50 | 500+ |
| Avg API Latency | <200ms | <300ms | <500ms |

### Optimization Roadmap
1. **Caching Layer:** Redis for session + API response caching (Q1 2025)
2. **Database Indexing:** Optimize frequently queried fields (Q1 2025)
3. **CDN:** CloudFlare for static assets (Q2 2025)
4. **Search Engine:** Elasticsearch for property search (Q2 2025)
5. **Message Queue:** Bull/RabbitMQ for async tasks (Q3 2025)
6. **Load Balancing:** Vercel Edge Network auto-scaling (Built-in)

---

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│          Client Layer Security                   │
├──────────────────────────────────────────────────┤
│ • HTTPS (TLS 1.3)                               │
│ • Content Security Policy (CSP)                  │
│ • X-Frame-Options (clickjack protection)         │
│ • X-Content-Type-Options (mime-sniff protect)    │
│ • Referrer-Policy (strict)                       │
│ • WebAuthn biometric authentication              │
└───────────┬────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────┐
│       Application Layer Security                │
├────────────────────────────────────────────────┤
│ • JWT authentication (HS256/RS256)              │
│ • Rate limiting (100 req/min per IP)            │
│ • CORS validation                              │
│ • Input validation & sanitization               │
│ • SQL injection prevention (Mongoose schema)    │
│ • XSS protection (DOMPurify)                   │
│ • CSRF tokens                                  │
└───────────┬────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────┐
│        Data Layer Security                      │
├────────────────────────────────────────────────┤
│ • AES-256 encryption at rest                   │
│ • TLS 1.3 in transit                           │
│ • Database access control lists                 │
│ • Field-level encryption (PII)                  │
│ • Automatic data deletion (GDPR)                │
│ • Audit logging (all changes)                   │
└────────────────────────────────────────────────┘

PII Fields (Encrypted):
├─ User.phone
├─ User.email
├─ User.ssn (if collected)
├─ User.bankDetails
├─ Lead.phone
└─ Lead.email
```

---

## Disaster Recovery & High Availability

```
┌──────────────────────┐
│   Health Monitoring  │
│   (5-min intervals)  │
└──────────┬───────────┘
           │
    ┌──────┴────────┐
    │               │
    ▼               ▼
┌────────┐      ┌────────┐
│ API    │      │ DB     │
│ Status │      │ Status │
└─┬──────┘      └────┬───┘
  │                  │
  ▼                  ▼
┌──────────────────────────────────┐
│  All Healthy?                    │
│  API: 200 OK                     │
│  DB: Responsive                  │
│  Error rate < 1%                 │
└──────┬───────────────────────────┘
       │ YES            │ NO
       │                │
       ▼                ▼
   Continue       ┌──────────────┐
   Operations    │ Alert Team   │
                 │ Auto Scaling │
                 │ Failover     │
                 └──────────────┘

Failover Strategy:
1. Detect: API or database unavailable (30-sec window)
2. Alert: Immediate notification to on-call engineer
3. Action: 
   - Vercel auto-deploys to another edge location
   - MongoDB Atlas auto-failover to secondary
   - Redis session data lost (acceptable)
4. Recovery: Restart failed service, investigate root cause
5. Review: Post-mortem within 24 hours

SLA Targets:
- Uptime: 99.9% (8.76 hours downtime/month acceptable)
- RTO (Recovery Time Objective): < 5 minutes
- RPO (Recovery Point Objective): < 1 minute
- Mean Time Between Failures: > 720 hours
```

---

## API Communication Patterns

### Synchronous Pattern (REST)
```
Client                         Server                    Database
  │                              │                          │
  ├─ POST /api/users             │                          │
  │ (Create new user)            │                          │
  ├──────────────────────────────►                          │
  │                              ├─ Validate input          │
  │                              │ ├─ Hash password         │
  │                              │ ├─ Generate ID           │
  │                              │                          │
  │                              ├─ INSERT users            │
  │                              ├─────────────────────────►
  │                              │                          │
  │                              │◄─── Confirm (201 OK) ────┤
  │                              │     + user object        │
  │◄──────── 201 Created ─────────┤                          │
  │         {user: {...}}         │                          │
  │                              │                          │
Response time: ~100-200ms        (includes DB round trip)
```

### Asynchronous Pattern (WebSocket/SSE - Future)
```
Client (Monitoring Dashboard)    Server    Metrics Aggregator
     │                             │              │
     ├─ Connect: GET /events       │              │
     ├────────────────────────────►             │
     │                             │              │
     │ (WebSocket established)     │              │
     │                             │              │
     │                             ├─ Subscribe to metrics stream
     │                             ├──────────────────────►
     │                             │                      │
     │                             │  (Every 5 seconds)   │
     │                             │◄──── Metrics update──┤
     │                             │                      │
     │◄──────── SSE: metrics ──────┤                      │
     │ {"latency": 250, ...}       │                      │
     │                             │                      │
Response time: <100ms             (server push, real-time)
```

---

## Summary

**Architecture Highlights:**
1. **Scalable:** Serverless Vercel auto-scaling, managed MongoDB
2. **Secure:** End-to-end encryption, WebAuthn biometric, JWT auth
3. **Monitored:** Real-time dashboards (Zoe business, Aurora technical)
4. **Resilient:** Database replication, auto-failover, backup strategy
5. **Performant:** Build time ~10s, API latency <500ms P95
6. **Testable:** 60+ unit tests, integration tests, biometric test suite

**Last Updated:** January 22, 2025  
**Version:** 1.0.0  
**Architecture Owner:** Engineering Team
