# System Architecture Diagram
# White Caves Real Estate Platform

> **Document ID:** WC-ARCH-DIA-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Technology Department (Aurora, Atlas)
> **Notation:** ASCII + Mermaid-compatible

---

## 1. System Context Diagram (C4 Level 1)

```
                        ┌─────────────────────────────────────────────────┐
                        │            WHITE CAVES PLATFORM                 │
                        │                                                 │
   ┌──────────┐         │  ┌──────────────────┐   ┌───────────────────┐  │
   │ Property │◄────────┼──│ Public Homepage  │   │ CRM Dashboard     │  │
   │ Buyer    │         │  │ (React SPA)       │   │ (Authenticated)   │  │
   └──────────┘         │  └──────────────────┘   └───────────────────┘  │
                        │                                                 │
   ┌──────────┐         │  ┌──────────────────┐   ┌───────────────────┐  │
   │ Landlord │◄────────┼──│ Landlord Portal  │   │ AI Assistant Hub  │  │
   │          │         │  │ (Self-Service)    │   │ (40 Assistants)   │  │
   └──────────┘         │  └──────────────────┘   └───────────────────┘  │
                        │                                                 │
   ┌──────────┐         │  ┌──────────────────┐   ┌───────────────────┐  │
   │  Tenant  │◄────────┼──│ Tenant Portal    │   │ Express REST API  │  │
   │          │         │  │ (Self-Service)    │   │ (Node.js 20)      │  │
   └──────────┘         │  └──────────────────┘   └───────────────────┘  │
                        │                                                 │
   ┌──────────┐         │  ┌──────────────────┐   ┌───────────────────┐  │
   │  Agent   │◄────────┼──│ CRM Modules      │   │ MongoDB Atlas     │  │
   │          │         │  │ (Leads, Props...) │   │ (UAE Region)      │  │
   └──────────┘         │  └──────────────────┘   └───────────────────┘  │
                        └─────────────────────────────────────────────────┘
                                         │ External Integrations
            ┌────────────────────────────┼────────────────────────┐
            │                            │                        │
    ┌───────▼──────┐         ┌───────────▼────┐         ┌────────▼─────┐
    │ Meta Cloud   │         │ PropertyFinder  │         │ Firebase     │
    │ (WhatsApp)   │         │ + Bayut APIs    │         │ Auth (OAuth) │
    └──────────────┘         └────────────────┘         └──────────────┘
            │
    ┌───────▼──────┐         ┌────────────────┐
    │    Stripe    │         │   SendGrid     │
    │  (Payments)  │         │   (Email)      │
    └──────────────┘         └────────────────┘
```

---

## 2. Container Diagram (C4 Level 2)

```
┌────────────────────────────────────────────────────────────────────────┐
│                         WHITE CAVES PLATFORM                           │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Vercel Edge CDN)                    │  │
│  │                                                                  │  │
│  │  React 18 SPA · TypeScript 5 · Vite 7 · styled-components       │  │
│  │  Redux Toolkit (13 slices) · Framer Motion · Axios              │  │
│  │                                                                  │  │
│  │  Pages: HomePage, UnifiedDashboardPage, LandlordPortal,         │  │
│  │         TenantPortal, LoginPage, RegisterPage, CareersPage       │  │
│  │                                                                  │  │
│  │  whitecaves.ae (prod) · staging.whitecaves.ae (staging)         │  │
│  └──────────────────────────┬──────────────────────────────────────┘  │
│                             │ HTTPS/REST (JSON)                       │
│  ┌──────────────────────────▼──────────────────────────────────────┐  │
│  │                    BACKEND (Railway/Render)                      │  │
│  │                                                                  │  │
│  │  Express.js 5 · Node.js 20 LTS · Prisma 6.6                    │  │
│  │  JWT Auth · bcrypt · Helmet · CORS · Rate Limiting              │  │
│  │                                                                  │  │
│  │  30+ REST API endpoints across 15 route modules                 │  │
│  │  5 middleware layers · asyncHandler · AppError                   │  │
│  │                                                                  │  │
│  │  api.whitecaves.ae (prod) · staging-api.whitecaves.ae           │  │
│  └──────────────────────────┬──────────────────────────────────────┘  │
│                             │ Prisma ORM (BSON/Atlas wire protocol)   │
│  ┌──────────────────────────▼──────────────────────────────────────┐  │
│  │                  DATABASE (MongoDB Atlas — UAE)                  │  │
│  │                                                                  │  │
│  │  Cluster: M10+ (production) · Replica set (3 nodes)             │  │
│  │  8 current models · 40+ indexes                                  │  │
│  │  UAE region — PDPL compliant data residency                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Diagram (C4 Level 3) — Backend

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API COMPONENTS                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE PIPELINE                                 │  │
│  │  cors → helmet → bodyParser → rateLimiter →          │  │
│  │  authMiddleware → requireRole → inputValidation      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────┐ ┌──────▼──────┐ ┌──────────────────────┐ │
│  │ Auth Routes  │ │ Lead Routes │ │ Property Routes      │ │
│  │ login        │ │ CRUD        │ │ CRUD + search        │ │
│  │ register     │ │ pipeline    │ │ media upload (Ph2)   │ │
│  │ logout       │ │ scoring     │ │ portal sync (Ph8)    │ │
│  └──────────────┘ └─────────────┘ └──────────────────────┘ │
│                                                             │
│  ┌──────────────┐ ┌─────────────┐ ┌──────────────────────┐ │
│  │ Finance      │ │ Compliance  │ │ AI Assistants        │ │
│  │ transactions │ │ KYC/AML     │ │ CRUD + plan API      │ │
│  │ commissions  │ │ RERA forms  │ │ XSS protected        │ │
│  │ approvals    │ │ audit trail │ │ managing_dir only    │ │
│  └──────────────┘ └─────────────┘ └──────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SERVICE LAYER                                       │  │
│  │  LeadsService  CommissionService  NotificationSvc   │  │
│  │  WhatsAppBotService (Phase 4)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  DATA ACCESS — Prisma Client (singleton)             │  │
│  │  prisma.user  prisma.lead  prisma.property           │  │
│  │  prisma.transaction  prisma.commission               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Component Architecture

```
App.tsx
  └── BrowserRouter
        └── ReduxProvider
              └── ThemeProvider (Gold tokens)
                    │
                    ├── Route: /
                    │   └── HomePage
                    │         ├── Hero (property showcase)
                    │         ├── FeaturedProperties (homeProperties.ts)
                    │         ├── Locations (DAMAC Hills 2 focus)
                    │         ├── Team section
                    │         ├── Testimonials
                    │         └── ContactCTA → WhatsApp link
                    │
                    ├── Route: /dashboard (auth required)
                    │   └── UnifiedDashboardPage
                    │         └── AppLayout
                    │               ├── UnifiedSidebar [LEFT]
                    │               │   ├── departmentConfig.ts (12 depts)
                    │               │   └── sidebarSlice (navigation state)
                    │               │
                    │               ├── DepartmentContentPanel [CENTER]
                    │               │   └── CRM Modules (role-adaptive)
                    │               │
                    │               └── AIAssistantSidebar [RIGHT]
                    │                   └── assistantRegistry.ts (40 assistants)
                    │
                    ├── Route: /landlord-portal (auth + landlord role)
                    │   └── LandlordPortalPage
                    │
                    └── Route: /tenant-portal (auth + tenant role)
                        └── TenantPortalPage
```

---

## 5. Network Architecture

```
Internet
    │
    ▼
[Cloudflare DDoS / WAF]  ← Phase 7 addition
    │
    ├──→ [Vercel Edge CDN] ──→ React SPA (whitecaves.ae)
    │         (Global CDN nodes, 200+ PoPs)
    │
    └──→ [Load Balancer] ──→ [Express API Instances]
              (Railway/Render)     (Node 20 LTS, auto-scale)
                                         │
                                         ▼
                              [MongoDB Atlas UAE Cluster]
                              (M10+, 3-node replica set)
                                         │
                              [MongoDB Atlas Backup]
                              (continuous, point-in-time)
```

---

## 6. Data Flow Summary

| Flow | Source | Destination | Protocol |
|------|--------|-------------|---------|
| Lead capture (website) | React form | Express POST /api/leads | HTTPS/JSON |
| Lead capture (WhatsApp) | Meta webhook | POST /api/whatsapp/webhook | HTTPS |
| Lead capture (portal) | Bayut/PF webhook | POST /api/leads | HTTPS |
| Property search | React SPA | GET /api/properties | HTTPS/JSON |
| Auth token flow | Login form | POST /api/auth/login → JWT | HTTPS |
| AI assistant plan | Right sidebar | GET /api/assistants/:id/plan | HTTPS |
| Rent payment | Tenant portal | POST /api/payments → Stripe | HTTPS |
| Ejari download | Landlord portal | GET /api/documents/ejari/:id | HTTPS |
| WhatsApp send | Agent CRM | POST /api/whatsapp/send → Meta | HTTPS |

---

## 7. Deployment Environments

| Environment | Frontend | API | Database |
|-------------|---------|-----|----------|
| Dev | localhost:5173 | localhost:5000 | Atlas Dev / local Mongo |
| Staging | staging.whitecaves.ae | staging-api.whitecaves.ae | Atlas Staging |
| Production | whitecaves.ae | api.whitecaves.ae | Atlas UAE Production |

---

**Document Owner:** Technology Department (Atlas — Infrastructure Engineer)
**Last Updated:** April 2026
**Related:** `business_docs/06_design_architecture/system-architecture.md`


---

## 7. Phase 5–7 Architecture Evolution

### 7.1 Phase 5 — Full Multi-User RBAC

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Phase 5 Architecture                              │
│                                                                      │
│  Web Client          Mobile (PWA)       Portal Clients               │
│  (React + Vite)      (Phase 10)         (Tenant/Landlord)            │
│       │                  │                      │                    │
│       └──────────────────┴──────────────────────┘                   │
│                           │                                          │
│                    [Cloudflare WAF + CDN]                            │
│                           │                                          │
│              [Vercel Edge (Frontend) + API Gateway]                  │
│                           │                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Express API (Node.js)                     │    │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌────────────┐  │    │
│  │  │AuthMidd. │ │RBAC Guard  │ │Rate Limit│ │Audit Logger│  │    │
│  │  └──────────┘ └────────────┘ └──────────┘ └────────────┘  │    │
│  │                                                              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌────────────────┐ │    │
│  │  │ Leads    │ │Properties│ │ Finance │ │AI Assistants   │ │    │
│  │  │ Routes   │ │ Routes   │ │ Routes  │ │ Routes (×40)   │ │    │
│  │  └──────────┘ └──────────┘ └─────────┘ └────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                           │                                          │
│          ┌────────────────┼────────────────┐                        │
│          ↓                ↓                ↓                        │
│  [MongoDB Atlas]    [Redis Cache]   [HashiCorp Vault]               │
│  UAE Region         Upstash          Secrets Mgmt                   │
│          │                                                           │
│  [Prisma ORM]                                                       │
│                                                                      │
│  Background Services:                                               │
│  [Bull Queue] ← WhatsApp jobs, email jobs, PDF generation           │
│  [Cron Jobs] ← Lead scoring, data retention, permit checks          │
│  [WebSocket/Socket.IO] ← Live CRM notifications                     │
└──────────────────────────────────────────────────────────────────────┘
```

### 7.2 Phase 7 — AI/Analytics Layer

```
New components added in Phase 7:

┌──────────────────────────────────────────────────┐
│              Data Pipeline (Phase 7)             │
│                                                  │
│  MongoDB Change   DLD Transaction   Portal       │
│  Streams          Feed (SFTP/API)   Activity     │
│       │                 │               │        │
│       └─────────────────┴───────────────┘        │
│                         │                        │
│              [Apache Airflow (Astronomer)]        │
│                         │                        │
│              [dbt transformations]               │
│                         │                        │
│     ┌───────────────────┴──────────────────┐    │
│     ↓                                      ↓    │
│  [PostgreSQL (Analytics DB)]  [Elasticsearch 8]  │
│         │                           │            │
│  [Metabase (BI)]              [Property Search]  │
│  Executive dashboards         Autocomplete       │
│  Agent leaderboards           Faceted filters    │
└──────────────────────────────────────────────────┘

ML Inference Layer:
┌────────────────────────────────────────────────┐
│  [Archer v2 — XGBoost lead scoring]           │
│  [Oracle AVM — property price prediction]     │
│  [Quill NLG — listing copy generation]        │
│  [Nina NLU — WhatsApp intent detection]       │
│  All models served via FastAPI (Python)       │
│  Hosted: Railway Python service               │
│  Model storage: S3                            │
│  SHAP explanations: logged to MongoDB         │
└────────────────────────────────────────────────┘
```

---

## 8. API Gateway Pattern (Phase 6)

When the system grows beyond a single Express application, a lightweight API gateway is introduced:

```
                    API Gateway (Kong or Express Gateway)
                    /api/v1/*
                    │
          ┌─────────┼──────────────────────────┐
          ↓         ↓                          ↓
   Auth Service   Core CRM API          AI Inference API
   (Firebase)     (Node/Express)        (FastAPI/Python)
   Port: 3000     Port: 3001            Port: 8000
                  │
          ┌───────┼────────────┐
          ↓       ↓            ↓
   Portal API   WhatsApp API  Analytics API
   Port: 3002   Port: 3003    Port: 3004
```

**Gateway responsibilities:**
- Authentication verification (verify Firebase JWT before forwarding)
- Rate limiting (single point of enforcement)
- Request logging (all requests logged at gateway)
- SSL termination
- Load balancing (when multiple API instances deployed)

**Phase 6 migration note:** The current single Express app handles all routes. When Phase 6 launches (Arabic locale), it may require a separate localisation service. That is the trigger point for extracting into microservices.

---

## 9. Disaster Recovery Architecture

### 9.1 Recovery Objectives

| Tier | RTO (Recovery Time) | RPO (Data Loss) | Examples |
|------|-------------------|----------------|---------|
| Critical | < 2 hours | < 1 hour | MongoDB data, authentication |
| High | < 4 hours | < 4 hours | API service, WhatsApp |
| Medium | < 24 hours | < 24 hours | Email notifications, analytics |
| Low | < 72 hours | < 72 hours | Virtual tours, static content |

### 9.2 Backup Schedule

| Component | Backup Method | Frequency | Retention | Location |
|---------|-------------|---------|---------|---------|
| MongoDB Atlas | PITR (point-in-time restore) | Continuous | 7 days | Atlas managed (UAE region) |
| MongoDB Atlas | Scheduled snapshot | Daily | 30 days | Atlas managed |
| MongoDB Atlas | Manual snapshot | Before every migration | 90 days | Atlas managed |
| S3 (files) | S3 versioning + cross-region replication | Real-time | 30 days | AWS S3 (UAE + EU) |
| Code | GitHub | Every commit | Permanent | GitHub |
| Secrets | HashiCorp Vault | Vault enterprise replication | Permanent | Multi-AZ |

### 9.3 DR Runbook — MongoDB Failure

```
STAGE 1 — Detection (target: < 5 min after incident)
1. Grafana alert fires: MongoDB connection errors > threshold
2. On-call engineer receives PagerDuty alert
3. Log in to MongoDB Atlas → check cluster health

STAGE 2 — Assessment (target: < 15 min)
4. Determine: node failure (automatic failover) vs. corruption vs. full cluster down
5. If automatic failover in progress: wait (Atlas auto-elects new primary in < 10 seconds)
6. If full cluster down: initiate manual restore

STAGE 3 — Restore (target: < 2 hours)
7. Atlas Dashboard → Restore → Point-In-Time Recovery
8. Select restore point (latest clean point before incident)
9. Restore to NEW cluster (preserve original for forensics)
10. Update MONGODB_URI in Railway/Vercel to point at restored cluster
11. Smoke test: auth → lead creation → search

STAGE 4 — Post-Incident (within 48 hours)
12. Post-mortem document: timeline, root cause, prevention
13. Update runbook if any steps were wrong
14. MD briefing
```

---

**Document Owner:** Technology (@Lisa — Cloud, @Gwynne — DevOps, @Radia — Security)
**Version History:** v1.0 April 2026; v2.0 April 2026 (Phase 5-7 architecture, API gateway, disaster recovery)
**Related:** `business/08_market_research/technology_upgrades.md`, `business/05_srs_and_engineering/srs-v2-2026.md`
