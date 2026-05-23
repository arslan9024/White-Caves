# White Caves CRM - System Architecture & Design

## Executive Overview
Enterprise-grade CRM architecture designed for 200+ agents, 9,378+ properties, $50M+ annual volume, with WhatsApp-first customer engagement and real-time decision-making dashboards.

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                                │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (React 18 + Redux)  │  Mobile Browser (Responsive)  │
│  Dashboard  │ CRM  │ Reporting    │  WhatsApp (embedded)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/TLS
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                             │
├─────────────────────────────────────────────────────────────────┤
│  API Gateway (Express.js)                                        │
│  ├─ Authentication (JWT + 2FA)                                  │
│  ├─ Rate Limiting & Load Balancing                              │
│  ├─ Request Validation & Error Handling                         │
│  └─ CORS & Security Headers                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   MICROSERVICES TIER                            │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ Lead Service │ │ Property Svc │ │ Finance Svc  │             │
│ │ (Clara)      │ │ (Mary)       │ │ (Theodora)   │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ Leasing Svc  │ │ Comms Svc    │ │ Compliance   │             │
│ │ (Daisy)      │ │ (Linda/Nina) │ │ (Laila)      │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
│ ┌──────────────┐ ┌──────────────┐                              │
│ │ Reporting    │ │ User Mgmt    │                              │
│ │ (Zoe)        │ │ (Nancy)      │                              │
│ └──────────────┘ └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA TIER                                     │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Primary)  │  Redis Cache  │  S3 Storage (Media)       │
│  ├─ Leads           │  ├─ Sessions  │  ├─ Property photos     │
│  ├─ Properties      │  ├─ KPIs      │  ├─ Documents          │
│  ├─ Agents          │  └─ Activity  │  └─ Media assets       │
│  ├─ Transactions    │               │                         │
│  └─ Audit logs      │               │                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY ARCHITECTURAL DECISIONS

### 1. **WhatsApp-First Communication**
- **Why**: 95%+ UAE smartphone penetration, native business use, instant delivery
- **Implementation**: Twilio/WhatsApp Business API integration
- **Features**: Auto-bot responses, human escalation, message history, broadcast campaigns
- **Scalability**: 500+ concurrent conversations, <10s response time

### 2. **Microservices Architecture**
- **Why**: Independent scaling, team autonomy, fault isolation
- **Implementation**: Modular services aligned with business departments
- **Communication**: REST APIs + internal event messaging
- **Deployment**: Docker containers, Kubernetes/Docker Compose orchestration

### 3. **Real-Time Dashboards**
- **Why**: Executive decision-making, operational transparency, instant alerts
- **Implementation**: WebSocket for live updates, Redux for state management
- **Features**: Live KPI refresh, pipeline updates, system alerts
- **Polling**: Fallback to HTTP polling for unstable connections

### 4. **Role-Based Access Control (RBAC)**
- **Why**: Security, compliance, user experience optimization
- **Implementation**: JWT tokens with role claims, middleware validation
- **Roles**: Admin, Executive (Zoe), Department Manager, Agent, Viewer
- **Permissions**: Granular feature access, data scoping by department/agent

### 5. **MongoDB for Flexibility**
- **Why**: Schema flexibility for expanding requirements, document-oriented for nested data
- **Implementation**: Prisma ORM for type safety, MongoDB Atlas for cloud hosting
- **Backup**: Daily automated backups, point-in-time recovery
- **Migration Path**: Can migrate to SQL if needed for complex transactions

### 6. **Asynchronous Processing**
- **Why**: Non-blocking workflows for heavy operations (reports, payments, notifications)
- **Implementation**: Job queue (Bull/Bee-Queue), background workers
- **Examples**: Commission calculation, financial reconciliation, report generation, bulk imports

---

## 📊 DATA MODELS & RELATIONSHIPS

### Core Entity Relationship Diagram

```
Agent (Nancy)
  ├─ Profile, license, performance metrics
  └─ Has Many: Activities, Deals, Teams

Lead (Clara)
  ├─ Contact, qualification score, status
  ├─ Has Many: Activities, Offers, Interactions
  └─ Belongs To: Agent (assigned), Source

Property (Mary)
  ├─ Location, price, features, media
  ├─ Has Many: Photos, Reviews, Viewings
  ├─ Belongs To: Complex (if applicable)
  └─ Related To: Lease (if rented), Owner

Transaction
  ├─ Sale or Lease
  ├─ Parties: Buyer/Tenant, Seller/Owner, Agent
  ├─ Pricing, commission, status
  └─ Related To: Property, Lead, Finance Record

TenantRecord (Daisy)
  ├─ Contact, verification, documents
  ├─ Belongs To: Property, Agent
  ├─ Has Many: Leases, Payments, Maintenance Requests
  └─ Related To: Transaction (move-in date)

FinancialRecord (Theodora)
  ├─ Transaction ID, amount, currency, status
  ├─ Commission detail (agent, %, amount)
  ├─ Payment schedule, escrow account
  └─ Compliance flags (AML, KYC)

Activity
  ├─ Type: call, email, sms, whatsapp, visit
  ├─ Belongs To: Lead, Agent, Property
  ├─ Outcome, notes, timestamp
  └─ Audit trail (who, when, changes)

User (Nancy)
  ├─ Account, authentication, preferences
  ├─ Role, permissions, department
  └─ Related To: Agent (if sales team), Team
```

---

## 🔄 API ARCHITECTURE

### Service Endpoints Overview

```
/api/v1/
├── /auth
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /register
│   ├── POST /2fa-verify
│   └── GET /profile
├── /leads (Clara)
│   ├── GET /leads (search, filter, paginate)
│   ├── POST /leads (create, pre-qualified)
│   ├── PATCH /leads/:id (update status, score)
│   ├── DELETE /leads/:id
│   ├── POST /leads/:id/activities (log call, email, visit)
│   ├── GET /leads/:id/activities (activity timeline)
│   ├── POST /leads/:id/assign (to agent)
│   └── GET /leads/analytics/conversion (reporting)
├── /properties (Mary)
│   ├── GET /properties (advanced search, map view)
│   ├── POST /properties (create, bulk import)
│   ├── PATCH /properties/:id (update, status change)
│   ├── DELETE /properties/:id
│   ├── POST /properties/:id/media (upload photos, videos)
│   ├── GET /properties/:id/media
│   ├── DELETE /properties/:id/media/:mediaId
│   ├── POST /properties/bulk-import (Excel, CSV)
│   ├── GET /properties/export (Excel export)
│   └── GET /properties/analytics (vacancy, ROI, trends)
├── /agents (Nancy)
│   ├── GET /agents (directory, performance)
│   ├── POST /agents (register, license)
│   ├── PATCH /agents/:id (profile update)
│   ├── GET /agents/:id/performance (KPIs, metrics)
│   ├── GET /agents/:id/commissions (payment history)
│   └── GET /agents/:id/leaderboard (ranking)
├── /transactions
│   ├── GET /transactions (filter, search)
│   ├── POST /transactions (create)
│   ├── PATCH /transactions/:id (status update)
│   ├── GET /transactions/:id/timeline (deal progression)
│   └── GET /transactions/analytics (volume, revenue, trends)
├── /tenants (Daisy)
│   ├── GET /tenants
│   ├── POST /tenants (application)
│   ├── PATCH /tenants/:id (profile, lease update)
│   ├── POST /tenants/:id/leases (create)
│   ├── GET /tenants/:id/leases (history)
│   ├── POST /tenants/:id/maintenance-requests
│   ├── GET /tenants/:id/payments (rent history)
│   └── POST /tenants/:id/payments (submit)
├── /finance (Theodora)
│   ├── GET /finance/dashboard (summary KPIs)
│   ├── POST /payments (process payment)
│   ├── GET /payments (reconciliation)
│   ├── POST /commissions/calculate (monthly batch)
│   ├── GET /commissions (reports by agent)
│   ├── POST /escrow (hold funds)
│   ├── GET /finance/reports (P&L, cash flow)
│   └── GET /finance/compliance (AML, audit trail)
├── /communications
│   ├── GET /whatsapp/messages (chat history)
│   ├── POST /whatsapp/messages (send)
│   ├── POST /whatsapp/templates (broadcast)
│   ├── GET /whatsapp/metrics (response time, automation rate)
│   ├── POST /sms/send
│   ├── POST /email/send
│   └── GET /communications/audit (compliance log)
├── /compliance
│   ├── POST /kyc/verify (customer verification)
│   ├── GET /kyc/status
│   ├── POST /aml/screen (sanctions list check)
│   ├── GET /aml/alerts
│   ├── POST /contracts/generate (template-based)
│   └── GET /compliance/audit-trail
└── /reporting (Zoe)
    ├── GET /dashboard/kpis (live executive dashboard)
    ├── GET /reports/sales (pipeline, conversion)
    ├── GET /reports/financial (P&L, cash flow)
    ├── GET /reports/marketing (campaign ROI, lead sources)
    ├── POST /reports/custom (ad-hoc queries)
    └── GET /reports/export (PDF, Excel, PowerPoint)
```

---

## 🔐 SECURITY ARCHITECTURE

### Authentication & Authorization Flow

```
User Login
  ↓
Email + Password Validation
  ↓
JWT Token Generated (15-min expiration)
  ↓
2FA Challenge (SMS or Authenticator)
  ↓
2FA Code Validated
  ↓
Session Created (refresh token, 7-day expiration)
  ↓
User Redirected to Dashboard
  ↓
Each API Request: JWT in Authorization header
  ↓
Middleware: Validate JWT signature, check expiration, verify 2FA
  ↓
RBAC: Check user role + permissions for resource
  ↓
Audit: Log access attempt (success/failure)
```

### Data Security Layers

```
Layer 1: Network
  ├─ HTTPS/TLS encryption (all data in transit)
  ├─ API Gateway (rate limiting, DDoS protection)
  └─ WAF (Web Application Firewall)

Layer 2: Application
  ├─ JWT authentication + 2FA (user identity)
  ├─ RBAC (who can access what)
  ├─ SQL injection prevention (parameterized queries)
  ├─ CORS validation (cross-origin requests)
  └─ CSRF tokens (form submission safety)

Layer 3: Database
  ├─ Encryption at rest (AES-256)
  ├─ Field-level encryption (PII, sensitive data)
  ├─ Access control (admin credentials, minimal privilege)
  ├─ Audit logging (all database changes)
  └─ Backup encryption (offsite, encrypted backups)

Layer 4: Infrastructure
  ├─ Network segmentation (DMZ, internal)
  ├─ VPC (Virtual Private Cloud)
  ├─ Secrets management (API keys, credentials)
  └─ Intrusion detection (monitoring, alerts)
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Frontend Performance
- **Code Splitting**: Lazy-load routes and components
- **Caching**: Browser caching for static assets (1 year)
- **Compression**: Gzip/Brotli compression for all assets
- **CDN**: CloudFlare or AWS CloudFront for media delivery
- **Image Optimization**: WebP format, responsive images, lazy-loading
- **Bundle Size**: Tree-shaking, minification, no unnecessary dependencies

### Backend Performance
- **Database Indexing**: Indexes on frequently searched fields (lead status, property type)
- **Query Optimization**: Projection (select only needed fields), aggregation pipelines
- **Caching**: Redis cache for KPIs, dashboards, frequently accessed data
- **Pagination**: Limit results per page (20-50 records)
- **Connection Pooling**: Reuse database connections
- **Async Operations**: Background jobs for heavy processing

### Infrastructure Performance
- **Load Balancing**: Horizontal scaling, auto-failover
- **Database Replication**: Read replicas for reporting queries
- **Message Queue**: Async job processing (Bull, Bee-Queue)
- **Content Delivery**: CDN for static assets, media files
- **Monitoring**: APM (Application Performance Monitoring) for bottleneck identification
- **Auto-scaling**: Auto-scale containers based on CPU/memory usage

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Container-Based Deployment

```
Development (Local)
  ↓
Docker Compose
  ├─ Frontend (React)
  ├─ Backend (Node.js)
  ├─ MongoDB
  ├─ Redis
  └─ Nginx (reverse proxy)

Staging (Cloud)
  ↓
Docker Images → Container Registry
  ↓
Kubernetes Cluster (or Docker Swarm)
  ├─ Frontend replicas (3)
  ├─ Backend API replicas (5)
  ├─ MongoDB replicaset (3 nodes)
  ├─ Redis (master-slave)
  └─ Nginx ingress controller

Production (Cloud - Multi-Region)
  ↓
Kubernetes Cluster (HA setup)
  ├─ Frontend replicas (5+)
  ├─ Backend API replicas (10+)
  ├─ MongoDB replicaset (5+ nodes)
  ├─ Redis cluster (distributed)
  └─ Nginx ingress + WAF
  
Backup & Monitoring
  ├─ Daily database backups (encrypted, offsite)
  ├─ Application logging (ELK stack or CloudWatch)
  ├─ Error tracking (Sentry, DataDog)
  ├─ Performance monitoring (APM)
  └─ Uptime monitoring (Pingdom, UptimeRobot)
```

### CI/CD Pipeline

```
Code Push to Git
  ↓
GitHub Actions (or similar CI)
  ├─ Lint & Format Check (ESLint, Prettier)
  ├─ TypeScript Compilation
  ├─ Unit Tests (Jest, Vitest)
  ├─ Integration Tests (Vitest)
  └─ Security Scan (OWASP, dependency check)
  
  Success → Build Docker Images
           ↓
           Push to Registry
           ↓
           Deploy to Staging
           ↓
           E2E Tests (Playwright)
           ↓
           Manual Approval (for production)
           ↓
           Deploy to Production
           ↓
           Smoke Tests
           ↓
           Monitor (10 minutes)
           
  Failure → Alert developers, rollback procedures
```

---

## 📈 SCALABILITY PLANNING

### Current Load Estimates
- Users: 200+ agents, 5,000+ customers
- Properties: 9,378 units
- Monthly Leads: 1,500+ new leads
- Concurrent Users: Peak 100-200 simultaneous
- Transactions/Month: 500+ sales + 300+ leases
- Daily API Calls: 50,000+ requests
- Storage: 50GB-100GB (properties, media, documents)

### Scaling Strategy
| Metric | Current | Year 1 Target | Year 2 Target | Year 3 Target |
|--------|---------|---------------|---------------|---------------|
| Agents | 200 | 300 | 500 | 1,000+ |
| Properties | 9,378 | 15,000 | 25,000 | 50,000+ |
| Monthly Leads | 1,500 | 3,000 | 6,000 | 10,000+ |
| Concurrent Users | 100 | 300 | 600 | 1,200+ |
| API Requests/Day | 50K | 150K | 300K | 600K+ |
| Storage | 100GB | 200GB | 500GB | 1TB+ |

### Scaling Actions
- **Year 1**: Add read replicas, implement caching, CDN
- **Year 2**: Database sharding by region/department, microservices expansion
- **Year 3**: Multi-region deployment, AI/ML infrastructure, mobile apps

---

## 🔧 TECHNOLOGY STACK

### Frontend Stack
- **Framework**: React 18 (hooks, functional components)
- **State Management**: Redux Toolkit with Thunk/Saga
- **Styling**: Styled-components + Design tokens system
- **UI Components**: Custom components library, Storybook documentation
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Real-Time**: WebSocket with socket.io-client fallback
- **Maps**: Google Maps API for property locations
- **Testing**: Vitest (unit), Playwright (E2E)
- **Build**: Vite (fast development, optimized production)

### Backend Stack
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js 5
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma 6.6 (MongoDB adapter)
- **Database**: MongoDB (primary), with SQL migration path
- **Caching**: Redis (sessions, KPIs, cache)
- **Job Queue**: Bull (Redis-backed job queue)
- **Validation**: Zod (runtime schema validation)
- **Logging**: Winston/Pino (structured logging)
- **Testing**: Jest/Vitest (unit), Supertest (API), Playwright (E2E)
- **API Docs**: OpenAPI/Swagger
- **Security**: Helmet, rate-limit, cors, hpp
- **Payments**: Stripe SDK, Twilio SDK
- **Email**: SendGrid or Nodemailer
- **WhatsApp**: Twilio WhatsApp Business API

### Infrastructure Stack
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (or Docker Swarm)
- **Cloud**: AWS, Azure, or Google Cloud
- **Database Hosting**: MongoDB Atlas (managed)
- **Cache Hosting**: Redis Cloud or ElastiCache
- **Storage**: AWS S3 or Azure Blob Storage
- **CDN**: CloudFlare or AWS CloudFront
- **Monitoring**: DataDog, New Relic, or CloudWatch
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking**: Sentry
- **CI/CD**: GitHub Actions or GitLab CI
- **Secrets**: AWS Secrets Manager or HashiCorp Vault

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Launch
- [ ] Security audit (penetration testing)
- [ ] Performance load testing (1,000+ concurrent users)
- [ ] Backup & recovery testing
- [ ] Disaster recovery drill
- [ ] Compliance verification (GDPR, RERA, DLD, AML)
- [ ] Data migration (from legacy system)
- [ ] User training & documentation
- [ ] Incident response plan

### Launch Day
- [ ] Database backups verified
- [ ] Monitoring systems active
- [ ] On-call rotation in place
- [ ] Rollback procedures ready
- [ ] Communication channels open (status page, team chat)
- [ ] Phased rollout (internal users first, then agents, then customers)

### Post-Launch
- [ ] Monitor system health (12 hours continuous)
- [ ] Verify all critical workflows
- [ ] Check error rates & performance metrics
- [ ] Customer feedback collection
- [ ] Daily standups (first week)
- [ ] Weekly reviews (first month)

---

## 🎯 Architecture Health Metrics

| Metric | Target | Owner |
|--------|--------|-------|
| API uptime | 99.9% | Aurora (Infrastructure) |
| P95 response time | <200ms | Aurora (Performance) |
| Database query time | <100ms | Aurora (Database) |
| Build time | <5 min | Aurora (CI/CD) |
| Deployment frequency | 1-2x/day | Aurora (Release) |
| Mean time to recovery | <15 min | Aurora (Incident Response) |
| Code coverage | 80%+ | QA/Aurora |
| Type safety | 100% | Aurora (TypeScript strict) |
