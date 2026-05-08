# Software Design Document (SDD) — Version 2.0

# White Caves Real Estate CRM Platform

> **Document ID:** WC-SDD-002
> **Version:** 2.0
> **Date:** April 2026
> **Status:** Active
> **Reference Standard:** IEEE Std 1016-2009
> **Supersedes:** `business_docs/12_srs/software-design-document.md` (v1.0)
> **Classification:** Internal — Confidential

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Design Overview](#2-system-design-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Design](#5-database-design)
6. [AI Assistant Architecture](#6-ai-assistant-architecture)
7. [Portal Architecture](#7-portal-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Integration Architecture](#9-integration-architecture)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Design Decisions Summary](#11-design-decisions-summary)

---

## 1. Introduction

### 1.1 Purpose

This SDD v2.0 describes the architecture and detailed design of the White Caves CRM Platform as of April 2026. It extends SDD v1.0 (March 2026) to cover:

- **UnifiedSidebar** architecture — replaces legacy SidebarContainer / EnhancedLeftSidebar
- **40 AI Assistants** across 12 departments (up from 17 in v1.0)
- **Landlord & Tenant Portal** dual-portal design (Phase 2)
- **Phase 3 CRM** — full managing_director superuser experience
- **Redux Toolkit 13-slice** state architecture
- **2 new departments**: Customer Experience (#8B5CF6) and Data & AI (#F97316)

### 1.2 Delta from v1.0

| Area          | v1.0                                     | v2.0                                     |
| ------------- | ---------------------------------------- | ---------------------------------------- |
| Sidebar       | Dual sidebar (SidebarContainer + legacy) | UnifiedSidebar (canonical)               |
| AI Assistants | 17 registered                            | 40 registered (18 active, 22 planned)    |
| Departments   | 10                                       | 12 (+ Customer Experience + Data & AI)   |
| Portals       | Not implemented                          | Landlord + Tenant portal UI MVP complete |
| Redux slices  | ~8                                       | 13                                       |
| Tests         | ~150 files                               | 309 files, 7,744 tests                   |

---

## 2. System Design Overview

### 2.1 Architecture Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                                  │
│  React 18 SPA · TypeScript 5 strict · Vite 7 · styled-components    │
│  Pages → Feature Components → Shared UI Components                  │
│  Redux Toolkit (13 slices) · Framer Motion animations               │
├──────────────────────────────────────────────────────────────────────┤
│  SERVICE LAYER                                                       │
│  Axios API client (interceptors: JWT inject, 401 handle)            │
│  Service modules per domain: authService, leadsService, etc.        │
├──────────────────────────────────────────────────────────────────────┤
│  API LAYER                                                           │
│  Express.js 5 REST API                                               │
│  Middleware pipeline:                                                │
│  cors → helmet → rateLimiter → authMiddleware                       │
│  → requireRole → inputValidation → handler → AppError               │
├──────────────────────────────────────────────────────────────────────┤
│  BUSINESS LOGIC LAYER                                                │
│  Service classes: LeadsService, CommissionService, etc.             │
│  Business rule enforcement (BANT scoring, commission rates)         │
│  Domain events: status change → activity log → notification         │
├──────────────────────────────────────────────────────────────────────┤
│  DATA ACCESS LAYER                                                   │
│  Prisma ORM 6.6 · MongoDB Atlas (UAE region)                        │
│  Indexed queries · Aggregation pipelines · Field projections        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer         | Technology        | Version    | Notes                         |
| ------------- | ----------------- | ---------- | ----------------------------- |
| Frontend      | React             | 18         | Concurrent mode, lazy loading |
| Language      | TypeScript        | 5 (strict) | 0 compile errors              |
| Build tool    | Vite              | 7          | < 18s build                   |
| State         | Redux Toolkit     | Latest     | 13 slices                     |
| Styling       | styled-components | Latest     | Design tokens                 |
| Animations    | Framer Motion     | Latest     |                               |
| HTTP client   | Axios             | Latest     | JWT interceptors              |
| Backend       | Express           | 5          | asyncHandler                  |
| ORM           | Prisma            | 6.6        | MongoDB provider              |
| Database      | MongoDB           | Atlas      | UAE region                    |
| Auth          | JWT + bcrypt      |            | rate-limited                  |
| OAuth         | Firebase Auth     | v9         | Google SSO                    |
| Testing       | Vitest            | Latest     | 309 files, 7,744 tests        |
| E2E           | Playwright        | Latest     | 11 spec files                 |
| Linting       | ESLint + Prettier | Latest     | Husky pre-commit              |
| CI/CD         | GitHub Actions    |            | lint + test + build           |
| Frontend host | Vercel            |            | Edge CDN                      |
| API host      | Railway / Render  |            | Node 20.x LTS                 |

---

## 3. Frontend Architecture

### 3.1 Application Entry & Routing

```
index.html  (inline CSS skeleton for FCP)
  └── main.tsx
        └── App.tsx
              └── BrowserRouter
                    ├── ReduxProvider (store)
                    │   └── ThemeProvider (Gold design tokens)
                    │       ├── /                   → HomePage
                    │       ├── /login              → LoginPage
                    │       ├── /register           → RegisterPage
                    │       ├── /dashboard          → UnifiedDashboardPage (auth)
                    │       ├── /landlord-portal    → LandlordPortalPage (auth+role)
                    │       ├── /tenant-portal      → TenantPortalPage (auth+role)
                    │       ├── /careers            → CareersPage
                    │       └── /404                → NotFoundPage
```

### 3.2 UnifiedDashboardPage Layout

```
UnifiedDashboardPage
  └── AppLayout
        ├── UnifiedSidebar  [LEFT — department navigation]
        │   ├── Logo + collapse toggle (sidebarCollapsed state)
        │   ├── DepartmentList (12 depts from departmentConfig.ts)
        │   ├── GlobalSearch (sidebarSlice.globalSearch)
        │   └── UserProfile
        │
        ├── MainContent  [CENTER — dynamic]
        │   └── DepartmentContentPanel
        │         └── Resolves: deptContent[selectedDept].services[selectedService]
        │               → LeadManagementPage, PropertyManagementPage,
        │                 ClientManagementPage, FinancePage, CompliancePage,
        │                 AnalyticsPage, MarketingPage, SettingsPage ...
        │
        └── AIAssistantSidebar  [RIGHT — 40 assistants]
              ├── Department filter tabs (12)
              ├── AssistantList (filtered)
              └── AssistantChatPanel (selected assistant)
```

**Key rule:** UnifiedSidebar at `src/components/layout/UnifiedSidebar/` is canonical.
EnhancedLeftSidebar and SidebarContainer are **legacy** — do not use in new code.

### 3.3 Redux Store — 13 Slices

| Slice                | Purpose             | Key State                                                     |
| -------------------- | ------------------- | ------------------------------------------------------------- |
| `authSlice`          | User session        | user, token, isAuthenticated                                  |
| `sidebarSlice`       | Navigation state    | selectedDept, selectedService, globalSearch, sidebarCollapsed |
| `leadsSlice`         | Lead pipeline       | leads[], loading, filters                                     |
| `propertiesSlice`    | Property listings   | properties[], loading, filters                                |
| `clientsSlice`       | Client records      | clients[], loading                                            |
| `transactionsSlice`  | Financials          | transactions[], loading                                       |
| `notificationsSlice` | Alerts              | notifications[], unreadCount                                  |
| `favoritesSlice`     | Saved items         | favorites[]                                                   |
| `aiAssistantSlice`   | AI hub              | assistants[], selectedAssistant, chatHistory                  |
| `themeSlice`         | Visual theme        | isDark, colorScheme                                           |
| `filtersSlice`       | Search/filter state | activeFilters{}                                               |
| `reportingSlice`     | KPIs + reports      | kpis{}, dateRange                                             |
| `uiSlice`            | Modal/toast state   | modals{}, toasts[], loading{}                                 |

### 3.4 Source Tree Structure

```
src/
├── pages/
│   ├── HomePage.tsx
│   ├── UnifiedDashboardPage.tsx
│   ├── LandlordPortalPage.tsx
│   ├── TenantPortalPage.tsx
│   └── crm/                        # CRM sub-pages
│
├── components/
│   ├── layout/
│   │   └── UnifiedSidebar/         # CANONICAL sidebar
│   ├── ui/                         # Design system components
│   │   ├── Button/, Card/, Modal/, Table/, Form/
│   │   └── ResponsiveImage/        # srcset + WebP + lazy loading
│   ├── features/                   # Domain-specific
│   │   ├── leads/, properties/, whatsapp/, ai-assistant/
│   └── portals/                    # Landlord + Tenant components
│
├── config/
│   ├── departmentConfig.ts         # CANONICAL — 12 departments
│   └── assistantRegistry.ts        # CANONICAL — 40 assistants
│
├── store/
│   ├── index.ts
│   └── slices/
│       └── aiAssistant/registry.ts # 40 assistants (must sync with config/)
│
├── services/                       # Axios API service modules
├── hooks/                          # Custom React hooks
├── utils/                          # Pure utilities
├── i18n/translations.ts            # English full, Arabic partial
└── data/homeProperties.ts          # Homepage dummy data (10 Dubai properties)
```

### 3.5 Design Token System (Gold Theme)

| Token                      | Value     | Usage                      |
| -------------------------- | --------- | -------------------------- |
| `--color-primary`          | `#D4AF37` | CTAs, active states, brand |
| `--color-primary-dark`     | `#B8930A` | Hover states               |
| `--color-background`       | `#0A0A0A` | Dark canvas                |
| `--color-surface`          | `#141414` | Cards, panels              |
| `--color-surface-elevated` | `#1E1E1E` | Modals, dropdowns          |
| `--color-error`            | `#EF4444` | Errors only                |
| `--font-heading`           | Poppins   | All headings               |
| `--font-body`              | Inter     | All body text              |
| `--border-radius-base`     | `8px`     | Cards, inputs              |

**Phase 6 note:** All tokens use CSS custom properties to enable automatic RTL/Arabic layout switching without component changes.

---

## 4. Backend Architecture

### 4.1 Express Application Structure

```
server/
├── index.ts                  # Bootstrap, middleware, route mounting
├── routes/
│   ├── auth.ts               # /api/auth/*
│   ├── leads.ts              # /api/leads/*
│   ├── properties.ts         # /api/properties/*
│   ├── clients.ts            # /api/clients/*
│   ├── users.ts              # /api/users/*
│   ├── transactions.ts       # /api/transactions/*
│   ├── finance.ts            # /api/finance/*
│   ├── compliance.ts         # /api/compliance/*
│   ├── assistants.ts         # /api/assistants/* (CRUD + plan API)
│   ├── reporting.ts          # /api/reporting/*
│   ├── notifications.ts      # /api/notifications/*
│   ├── favorites.ts          # /api/favorites/*
│   └── jobApplications.ts    # /api/job-applications/*
│
├── middleware/
│   ├── auth.ts               # JWT validation + user context
│   ├── requireRole.ts        # RBAC enforcement
│   ├── rateLimiter.ts        # 5-tier limiting
│   ├── inputValidation.ts    # XSS sanitization + schema validation
│   └── errorHandler.ts       # AppError + asyncHandler
│
├── services/
│   ├── LeadsService.ts
│   ├── CommissionService.ts
│   ├── WhatsAppBotService.ts  # Fully stubbed; Phase 4 implementation
│   └── NotificationService.ts
│
└── lib/
    ├── prisma.ts              # Prisma client singleton
    └── logger.ts              # Structured logging (levels + context)
```

### 4.2 Middleware Pipeline

```
Request
  → CORS (whitelist: whitecaves.ae, staging.whitecaves.ae, localhost:5173)
  → Helmet (CSP, HSTS, X-Frame-Options, HPKP)
  → express.json (1MB body limit)
  → rateLimiter (tier by route)
  → authMiddleware (JWT decode, req.user attached)
  → requireRole (RBAC check)
  → inputValidation (XSS strip, schema validate)
  → Route Handler (wrapped in asyncHandler)
  → AppError global handler (4xx/5xx structured response)
```

### 4.3 Error Handling

```typescript
// Structured error contract
{
  "status": "error",
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Required" }]
}

// All handlers use asyncHandler to catch async errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

### 4.4 RBAC

```
Total roles: 29
Super roles: lion, managing_director (all permissions)
Staff roles: owner, admin, manager, senior_agent, agent
Finance:     finance_manager, finance_officer
Compliance:  compliance_officer, legal_advisor
Marketing:   marketing_manager, marketing_agent
HR:          hr_manager, hr_officer
IT:          it_admin, it_support
Portals:     landlord, tenant
View-only:   viewer, guest
+ 9 additional specialist roles

Enforcement: requireRole([...allowedRoles]) middleware
             requirePermission('leads.delete') for granular control
```

---

## 5. Database Design

### 5.1 Current Prisma Models

```
User            email, password(bcrypt), role(29 roles), name, phone
Property        title, type, price, location, bedrooms, bathrooms, status, agentId
Lead            name, email, phone, status(7 states), score, source, assignedTo
Commission      agentId, dealId, amount, rate, status, approvedBy
Activity        type, entityId, entityType, userId, description, timestamp
Transaction     type, amount, currency, propertyId, clientId, agentId, status
Tenant          userId, propertyId, leaseStart, leaseEnd, rentAmount
JobApplication  name, email, role, resumeUrl, coverLetter, status
```

### 5.2 Phase 2 — New Models Required

```
Contract        type(sale|lease), propertyId, clientId, agentId,
                signedDate, value, status, documentUrls[]
Appointment     leadId, propertyId, agentId, scheduledAt,
                type(viewing|meeting), status, notes
Lease           tenantId, propertyId, startDate, endDate,
                monthlyRent, depositPaid, ejariNumber, status
RentPayment     leaseId, amount, dueDate, paidDate,
                status(pending|paid|overdue), stripePaymentId
MaintenanceReq  propertyId, tenantId, category, description,
                priority(low|medium|high|urgent), status, photoUrls[], resolvedAt
```

### 5.3 Index Strategy

| Model       | Key Indexes                                             |
| ----------- | ------------------------------------------------------- |
| Property    | `status`, `agentId`, `type`, `price`, `location.area`   |
| Lead        | `status`, `assignedTo`, `score`, `source`, `createdAt`  |
| Transaction | `type`, `status`, `agentId`, `createdAt`                |
| User        | `email` (unique), `role`, `isActive`                    |
| Activity    | `entityId+entityType` (compound), `userId`, `createdAt` |
| Lease       | `tenantId`, `propertyId`, `status`, `endDate`           |

---

## 6. AI Assistant Architecture

### 6.1 Dual Registry Rule

Both files must remain in sync at all times:

| File                                       | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `src/config/assistantRegistry.ts`          | UI display, search, icons  |
| `src/store/slices/aiAssistant/registry.ts` | Redux state, routing logic |

### 6.2 Department → Assistant Mapping

| #   | Department          | Color   | Active Assistants            |
| --- | ------------------- | ------- | ---------------------------- |
| 1   | Executive           | #D4AF37 | Zoe                          |
| 2   | Sales               | #10B981 | Sophia, Clara, Hunter, Juno  |
| 3   | Operations          | #3B82F6 | Daisy, Mary, Nancy, Vesta    |
| 4   | Finance             | #F59E0B | Theodora                     |
| 5   | Marketing           | #EC4899 | Olivia, Henry                |
| 6   | Compliance          | #6366F1 | Laila, Evangeline            |
| 7   | Technology          | #14B8A6 | Aurora, Hazel, Willow, Atlas |
| 8   | Communications      | #EF4444 | Nadia, Nina                  |
| 9   | Security            | #6B7280 | Cipher, Sentinel             |
| 10  | Analytics           | #8B5CF6 | Maven, Kairos, Oracle        |
| 11  | Customer Experience | #8B5CF6 | (Phase 9)                    |
| 12  | Data & AI           | #F97316 | (Phase 7)                    |

Total: 40 registered (18 in code; 22 planned via `plans/ai_assistants/`)

### 6.3 Assistant Plan API

```
GET    /api/assistants            Public — list all (no auth)
GET    /api/assistants/:id/plan   Auth — get plan details
POST   /api/assistants            managing_director only
PUT    /api/assistants/:id        managing_director only
DELETE /api/assistants/:id        managing_director only
```

All plan content: XSS-sanitized before storage and retrieval.

---

## 7. Portal Architecture

### 7.1 Landlord Portal Pages

```
LandlordPortalPage
  ├── PortfolioSummary    (total units, occupancy %, gross yield %)
  ├── PropertyList        (per-unit: tenant, rent, status, actions)
  ├── FinancialDashboard  (income chart, yield calculator, expenses)
  ├── DocumentCenter      (Ejari, lease agreements — download)
  ├── MaintenanceTracker  (open/completed requests)
  └── NotificationCenter  (WhatsApp + email + in-app)
```

### 7.2 Tenant Portal Pages

```
TenantPortalPage
  ├── LeaseOverview       (start, end, monthly rent, deposit)
  ├── PaymentCenter       (next due, history, receipts, Stripe checkout)
  ├── EjariSection        (certificate download + QR verify)
  ├── MaintenanceCenter   (new request form, tracker)
  └── DocumentVault       (lease PDF, Ejari, move-in report)
```

---

## 8. Security Architecture

### 8.1 Auth Flow

```
Login request
  → Rate limit: 5 attempts / 15 min per IP
  → bcrypt.compare (rounds=10)
  → JWT signed: { userId, role, email }, expires 7d
  → Response: JWT in Authorization header + secure cookie

Subsequent requests
  → JWT extracted from Authorization header
  → jsonwebtoken.verify (secret from env)
  → req.user = { id, role, email }
  → requireRole middleware enforces RBAC
```

### 8.2 Security Controls Summary

| Control       | Implementation                              | Status |
| ------------- | ------------------------------------------- | ------ |
| Auth          | JWT + bcrypt                                | ✅     |
| RBAC          | requireRole middleware                      | ✅     |
| XSS           | Input sanitization on all POST/PATCH        | ✅     |
| CSRF          | SameSite cookies + CORS whitelist           | ✅     |
| Rate limiting | 5 tiers (api/auth/register/password/strict) | ✅     |
| Body size     | 1MB limit                                   | ✅     |
| Headers       | Helmet (CSP, HSTS, X-Frame)                 | ✅     |
| Webhook       | crypto.timingSafeEqual                      | ✅     |
| npm vulns     | 7 pending (1 critical)                      | ⚠️     |
| 2FA           | Deferred Phase 9                            | ⏳     |

---

## 9. Integration Architecture

### 9.1 WhatsApp (Phase 4)

```
Env:    WHATSAPP_ACCESS_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID,
        WHATSAPP_PHONE_NUMBER_ID

Inbound:  Meta → POST /api/whatsapp/webhook
          → WhatsAppBotService.handleInbound()
          → Intent detection → Route to AI assistant or agent

Outbound: WhatsAppBotService.sendMessage()
          → MetaAPIClient.sendTextMessage()
          → Meta Cloud API → User device
```

### 9.2 Portal Syndication (Phase 8)

```
PropertyFinder: XML feed generated every 4h → SFTP upload → PF ingestion
Bayut:          JSON feed generated every 4h → Bayut API → ingestion
Lead capture:   Portal webhook → POST /api/leads → CRM auto-create
```

### 9.3 Payments (Phase 2)

```
Frontend: Stripe.js (card collection — never touches our server)
  → POST /api/payments/create-intent
  → Stripe SDK: PaymentIntent created
  → Frontend: stripe.confirmPayment()
  → Stripe webhook: POST /api/payments/webhook
  → RentPayment record updated (status: paid)
```

---

## 10. Deployment Architecture

### 10.1 Environments

| Env        | Frontend URL          | API URL                   | Database             |
| ---------- | --------------------- | ------------------------- | -------------------- |
| Dev        | localhost:5173        | localhost:5000            | Atlas Dev / Local    |
| Staging    | staging.whitecaves.ae | staging-api.whitecaves.ae | Atlas Staging        |
| Production | whitecaves.ae         | api.whitecaves.ae         | Atlas UAE Production |

### 10.2 CI/CD Pipeline

```
Developer pushes to main / opens PR:
  1. GitHub Actions: ESLint + Prettier
  2. GitHub Actions: npx vitest run (7,744 tests)
  3. GitHub Actions: npm run build (Vite + tsc)
  4. Vercel: auto-deploy frontend (main branch)
  5. Railway/Render: manual deploy API (release tag)
```

### 10.3 Docker

```
docker-compose.prod.yml
  ├── frontend  (Dockerfile.frontend: Nginx serving dist/)
  └── api       (Dockerfile: Node 20 LTS, server/)

K8s manifests in k8s/:
  ├── frontend-deployment.yaml
  ├── api-deployment.yaml
  └── ingress.yaml (Nginx + TLS)
```

---

## 11. Design Decisions Summary

| ADR      | Decision                       | Rationale                                                  |
| -------- | ------------------------------ | ---------------------------------------------------------- |
| ADR-001  | Gold #D4AF37 brand color       | Luxury positioning; red = semantic errors only             |
| ADR-002  | AI assistant plan CRUD API     | Future-proof assistant customisation per managing_director |
| ADR-002b | RBAC role alias architecture   | Maps 29 roles to permission sets cleanly                   |
| ADR-003  | Prisma + MongoDB               | Flexible schema for varied real estate data                |
| ADR-004  | UnifiedSidebar (replaces dual) | Single source of truth, simpler Redux state                |
| ADR-005  | Redux Toolkit 13 slices        | Predictable state, scales to large team                    |
| ADR-006  | asyncHandler + AppError        | Consistent error shape across all 30+ routes               |
| ADR-007  | CSS custom property tokens     | RTL/Arabic automatic in Phase 6 without component rework   |

Full ADR details: `business/05_srs_and_engineering/architecture-decision-records-index.md`

---

**Document Owner:** White Caves Technology Department
**Review Cycle:** Per phase completion
**Next Update:** Phase 2 backend completion
