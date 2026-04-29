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
