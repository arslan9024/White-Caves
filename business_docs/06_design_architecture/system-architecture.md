# System Architecture — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines the technical architecture of the platform

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WHITE CAVES CRM PLATFORM                        │
├──────────────────────┬──────────────────────┬───────────────────────┤
│   CLIENT LAYER       │    API LAYER         │   DATA LAYER          │
│                      │                      │                       │
│ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌───────────────────┐ │
│ │ React 18 SPA     │ │ │ Express.js       │ │ │ MongoDB Atlas     │ │
│ │ TypeScript       │◄──┤ TypeScript       │◄──┤ (Primary DB)      │ │
│ │ Redux Toolkit    │ │ │ REST API         │ │ │                   │ │
│ │ Styled Components│ │ │                  │ │ │ Prisma ORM        │ │
│ └──────────────────┘ │ └──────────────────┘ │ └───────────────────┘ │
│                      │         │            │                       │
│ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌───────────────────┐ │
│ │ Vite Build Tool  │ │ │ Middleware Stack  │ │ │ Cloud Storage     │ │
│ │                  │ │ │ • Auth (JWT)     │ │ │ (S3-compatible)   │ │
│ └──────────────────┘ │ │ • Rate Limiting  │ │ │ Media / Docs      │ │
│                      │ │ • CORS / Helmet  │ │ └───────────────────┘ │
│                      │ │ • Error Handling │ │                       │
│                      │ └──────────────────┘ │                       │
└──────────────────────┴──────────────────────┴───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │       EXTERNAL INTEGRATIONS     │
              ├─────────────────────────────────┤
              │ • WhatsApp Cloud API (Meta)      │
              │ • PropertyFinder API             │
              │ • Bayut API                      │
              │ • Firebase Auth                  │
              │ • Stripe Payments                │
              │ • Exchange Rate API              │
              │ • SendGrid / Email               │
              └─────────────────────────────────┘
```

---

## 2. Frontend Architecture

### Technology Stack

| Component        | Technology                      | Version           |
| ---------------- | ------------------------------- | ----------------- |
| Framework        | React                           | 18.x              |
| Language         | TypeScript                      | 5.x (strict mode) |
| State Management | Redux Toolkit                   | 2.x               |
| Build Tool       | Vite                            | 5.x               |
| Styling          | Styled Components + CSS Modules | 6.x               |
| Routing          | React Router DOM                | 6.x               |
| HTTP Client      | Axios                           | 1.x               |
| Forms            | React Hook Form                 | 7.x               |
| Testing          | Vitest + React Testing Library  | Latest            |

### Application Structure

```
src/
├── App.tsx                   # Root component + router setup
├── components/               # Page-level feature components
│   ├── crm/                  # CRM-specific views
│   │   ├── admin/            # Admin-only components
│   │   ├── leads/            # Lead management components
│   │   ├── properties/       # Property management components
│   │   ├── shared/           # Shared CRM UI elements
│   │   └── whatsapp/         # WhatsApp inbox components
│   └── [other components]
├── shared/
│   └── components/           # Reusable design system components
│       ├── ui/               # Button, Input, Modal, Badge, etc.
│       ├── layout/           # Grid, Flex, Container, Stack
│       ├── dashboard/        # Dashboard layout + navigation
│       ├── data/             # DataTable, StatCard
│       └── properties/       # PropertyCard, PropertyFilters
├── store/                    # Redux store
│   ├── store.tsx             # Store configuration
│   ├── authSlice.tsx         # Auth state
│   ├── crmDataSlice.tsx      # CRM data
│   ├── propertySlice.tsx     # Properties
│   ├── roleSlice.tsx         # Role/permissions
│   └── slices/               # Feature slices
├── services/                 # API service layer
│   ├── authService.ts        # Auth API calls
│   └── assistantsService.ts  # AI assistant API calls
├── utils/                    # Utility functions
│   ├── apiClient.ts          # Axios instance + interceptors
│   ├── authFetch.ts          # Authenticated fetch wrapper
│   ├── permissions.ts        # RBAC permission helpers
│   └── validation.ts         # Form validation helpers
├── types/
│   └── index.ts              # All TypeScript type definitions
└── styles/                   # Global styles and theme tokens
```

### State Management Slices

| Slice                       | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `authSlice`                 | User auth state, JWT token, login/logout |
| `crmDataSlice`              | Leads, clients, transactions             |
| `propertySlice`             | Property listings + filters              |
| `roleSlice`                 | Current user role + permissions          |
| `dashboardSlice`            | Dashboard KPIs and metrics               |
| `analyticsSlice`            | Analytics/reporting data                 |
| `whatsappSlice`             | WhatsApp conversations + messages        |
| `inventorySlice`            | Property inventory management            |
| `aiAssistantDashboardSlice` | AI assistant state                       |
| `notificationSlice`         | In-app notifications                     |
| `sidebarSlice`              | Sidebar open/closed state                |
| `navigationSlice`           | Active route and breadcrumbs             |

---

## 3. Backend Architecture

### Technology Stack

| Component        | Technology         | Version         |
| ---------------- | ------------------ | --------------- |
| Runtime          | Node.js            | 20.x LTS        |
| Framework        | Express.js         | 4.x             |
| Language         | TypeScript         | 5.x             |
| ORM              | Prisma             | 5.x             |
| Database         | MongoDB            | 7.x (via Atlas) |
| Authentication   | JWT (jsonwebtoken) | 9.x             |
| Password Hashing | bcrypt             | 5.x             |
| Validation       | Custom + Zod       | —               |
| Logging          | Winston            | 3.x             |
| Testing          | Jest               | 29.x            |

### API Route Structure

```
server/
├── index.ts                  # Express app + server startup
├── database.ts               # MongoDB connection + Prisma client
├── middleware/
│   ├── auth.ts               # JWT verification middleware
│   ├── errorHandler.ts       # Global error handling + AppError class
│   └── rateLimiter.ts        # express-rate-limit configuration
├── routes/
│   ├── auth.ts               # POST /api/auth/{login,register,logout,refresh}
│   ├── leads.ts              # CRUD /api/leads
│   ├── properties.ts         # CRUD /api/properties
│   ├── agents.ts             # CRUD /api/agents (+ /api/users alias)
│   ├── transactions.ts       # CRUD /api/transactions
│   ├── finance.ts            # /api/finance/{summary,commissions}
│   ├── tenants.ts            # CRUD /api/tenants
│   ├── communications.ts     # /api/communications/messages
│   ├── compliance.ts         # /api/compliance/{status,requirements}
│   ├── reporting.ts          # /api/dashboard/{summary,analytics}
│   ├── crm.ts                # /api/crm/{dashboard,analytics,search}
│   └── assistants.ts         # /api/assistants (AI assistant plans)
├── services/
│   ├── LeadsService.ts       # Lead business logic
│   ├── PropertiesService.ts  # Property business logic
│   ├── WhatsAppBotService.ts # WhatsApp API integration (partial)
│   └── dashboardService.ts   # Dashboard aggregations
├── config/
│   ├── env.ts                # Environment variable validation
│   └── pagination.ts         # Pagination defaults
└── utils/
    ├── apiResponse.ts        # Standardised response helpers
    ├── sanitize.ts           # Input sanitisation
    ├── validate.ts           # Request validation helpers
    └── logger.ts             # Winston logger configuration
```

### Authentication Flow

```
Client                     Server                    Database
  │                           │                          │
  ├── POST /api/auth/login ──▶│                          │
  │   {email, password}       │                          │
  │                           ├── Find user by email ──▶│
  │                           │◀── user record ──────────┤
  │                           ├── bcrypt.compare(password, hash)
  │                           │                          │
  │                           ├── [2FA enabled?]         │
  │                           │   └── Return: needsOtp=true
  │◀── {token, user} ─────────┤                          │
  │    JWT (24h expiry)        │                          │
  │                           │                          │
  ├── GET /api/leads ─────────▶                          │
  │   Authorization: Bearer {token}                      │
  │                           ├── authMiddleware:        │
  │                           │   verify JWT + set req.user
  │                           ├── Route handler ──────── ▶
  │                           │◀── DB results ─────────  │
  │◀── {success, data} ───────┤                          │
```

---

## 4. Database Schema Overview

### Core Collections (MongoDB via Prisma)

```
Users ──────────────── one-to-many ──▶ Leads (assigned)
  │                                     │
  │                                     └── many-to-many ──▶ Properties
  └── one-to-many ──────────────────────▶ Commissions

Properties ─────────── one-to-many ──▶ Leads
  │                                     │
  └── one-to-one ───────────────────── Transactions

Transactions ───────── one-to-many ──▶ Commissions

Tenants ─────────────── one-to-many ──▶ Leases
  │
  └── Lease ───────────── one-to-many ──▶ RentPayments
                  │
                  └── one-to-many ──▶ MaintenanceRequests

Leads ──────────────── one-to-many ──▶ Activities
  │
  └── one-to-many ──▶ Communications (WhatsApp + Email)

Audit trail: Activities table records all system events
```

---

## 5. Security Architecture

### Request Security Layers

```
Internet
  │
  ▼
[Cloudflare / CDN — DDoS protection + WAF]
  │
  ▼
[Load Balancer — HTTPS termination + TLS 1.3]
  │
  ▼
[Express App]
  │
  ├── Helmet (HTTP security headers)
  ├── CORS (whitelist only)
  ├── Rate Limiter (per IP)
  ├── Content-Type enforcement
  ├── Body size limit (1 MB)
  ├── JWT Auth middleware
  ├── Input sanitisation (every route)
  └── Role-based access check (per route)
```

---

## 6. Deployment Architecture

### Environments

| Environment | Purpose                | Database                  | Branch     |
| ----------- | ---------------------- | ------------------------- | ---------- |
| Development | Local dev              | MongoDB local / Atlas Dev | feature/\* |
| Staging     | Pre-production testing | Atlas Staging cluster     | main       |
| Production  | Live platform          | Atlas Production cluster  | release/\* |

### Infrastructure

- **Frontend Hosting:** Vercel (static site deployment with preview URLs per PR)
- **API Hosting:** Railway / Render / AWS ECS (containerised Node.js)
- **Database:** MongoDB Atlas (UAE North region — data residency)
- **File Storage:** AWS S3 or Cloudflare R2 (UAE region)
- **CDN:** Cloudflare (static assets + media)
- **Monitoring:** UptimeRobot + Sentry (error tracking) + Datadog (metrics)

### CI/CD Pipeline

```
Developer pushes code
        │
        ▼
[GitHub Actions CI]
├── npm run lint (ESLint)
├── npm run type-check (tsc --noEmit)
├── npm run test (Vitest + Jest)
└── npm run build (Vite + tsc compile)
        │
        ▼ (all pass)
[Vercel Preview Deploy] ← for PRs
        │
        ▼ (merged to main)
[Staging Deployment] → smoke tests
        │
        ▼ (approved)
[Production Deployment] → zero-downtime rolling update
```

---

## 7. Architecture Decision Records (ADRs)

| ADR     | Decision                                                         | Date     | Status   |
| ------- | ---------------------------------------------------------------- | -------- | -------- |
| ADR-001 | Design system rebrand to gold/dark theme                         | Feb 2026 | Accepted |
| ADR-002 | AI assistant plans served via REST API, stored as Markdown files | Feb 2026 | Accepted |
| ADR-003 | MongoDB over PostgreSQL for flexible document schema             | Jan 2026 | Accepted |
| ADR-004 | WhatsApp Cloud API over on-premise WABA                          | Planned  | Proposed |
| ADR-005 | Cloud object storage for media (not local disk)                  | Planned  | Proposed |
| ADR-006 | Prisma ORM for type-safe MongoDB access                          | Jan 2026 | Accepted |

---

## 8. Frontend Rendering & Event Architecture Standard

### 8.1 Objective

Establish a scalable frontend standard that improves:

- Arabic/RTL localization maintainability
- UI responsiveness and perceived performance
- Rendering efficiency under high dashboard complexity

### 8.2 Component Granularity Policy

The platform adopts **small, cohesive React functional components**.

- Components should represent a stable UI/domain concern (card header, KPI tile body, row actions).
- Avoid excessive micro-fragmentation that increases prop drilling and maintenance overhead.
- Keep business orchestration in container-level components/hooks; keep view components presentational.

### 8.3 Event-Driven Rendering Model

All major UI flows follow event-driven architecture:

```
UI Trigger
  -> Redux/Domain Action
  -> Async Side Effect (API/service) [optional]
  -> Store Mutation
  -> Selector-based Targeted Re-render
  -> User Feedback (loading/success/error)
```

### 8.4 Mandatory Technical Practices

1. **Selector-first subscriptions**

- components read only the slice they need.

2. **Memoization boundaries**

- `React.memo`, `useMemo`, and `useCallback` where rerender pressure is measurable.

3. **Lazy-triggered module rendering**

- render heavy modules only when route/tab/feature trigger is active.

4. **Action-based interaction contracts**

- avoid implicit state coupling across unrelated UI sections.

5. **State locality discipline**

- local UI state stays local; shared domain state lives in store.

### 8.5 Localization and RTL Architecture Hooks

- Translation dictionaries must be consumable at leaf render nodes.
- Direction-aware layout tokens must support runtime RTL switch.
- Component APIs must avoid hardcoded alignment/ordering assumptions.

### 8.6 Verification Requirements

Before marking a migration wave complete:

1. React Profiler evidence for reduced unnecessary rerenders on critical flows.
2. Unit/integration tests unchanged or improved.
3. Arabic RTL visual parity checklist passed for auth + CRM shell + top dashboard tabs.
4. No regression in route-level code splitting and lazy loading behavior.

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
