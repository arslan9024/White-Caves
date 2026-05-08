# White Caves Real Estate — Full Architecture Context

> **Purpose:** Single shareable document for architects, agents, and developers who need full context on this codebase before planning upgrades, reviews, or new features.
>
> **Last updated:** April 2026

---

## 1. What the Platform Is

**White Caves Real Estate LLC** is a full-stack, enterprise-grade Dubai luxury real estate platform that combines four systems in one:

| System                   | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| **Public Website**       | Property search, listings, off-plan tracker, mortgage/DLD fee calculators |
| **Multi-Role CRM**       | 23 user roles, 12 departments, 40 named AI assistants                     |
| **Self-Service Portals** | Tenant portal (5 tabs) + Landlord portal (7 tabs)                         |
| **WhatsApp Lead Engine** | Meta WABA API → NLP routing → agent CRM                                   |

**Brand:** Red `#E31E24` + White **ONLY**. No gold, amber, yellow, or navy. The CSS variable `--accent-gold` is also set to `#E31E24`.

---

## 2. Technology Stack

| Layer                | Technology                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend**         | React 18, TypeScript, Vite 7, React Router v7                                                  |
| **State Management** | Redux Toolkit (RTK) + React-Redux 9                                                            |
| **Styling**          | Tailwind CSS + Styled Components v6 + custom CSS design tokens                                 |
| **UI Icons**         | Lucide React                                                                                   |
| **Animation**        | Framer Motion                                                                                  |
| **Charts**           | Recharts                                                                                       |
| **Maps**             | Leaflet + React-Leaflet                                                                        |
| **Backend**          | Node.js 20 + Express 5 (ESM modules, TypeScript)                                               |
| **Database**         | MongoDB via Prisma 6 ORM                                                                       |
| **Auth**             | JWT + bcryptjs + Firebase Auth (social/phone) + WebAuthn biometric passkeys                    |
| **Payments**         | Stripe SDK                                                                                     |
| **Email**            | Resend                                                                                         |
| **Real-time**        | Socket.IO v4 (server + client)                                                                 |
| **WhatsApp**         | Meta WABA API + `whatsapp-web.js`                                                              |
| **Scheduling**       | Internal Node.js schedulers (lead scoring, follow-up cadences, RERA expiry, viewing reminders) |
| **Testing**          | Vitest + Testing Library + Playwright E2E + MSW (API mocking) + Supertest                      |
| **Infra**            | Vercel (primary), Docker (Compose dev/prod), Kubernetes (k8s/ + Helm chart)                    |
| **CI Quality**       | ESLint + Prettier + Husky + lint-staged                                                        |
| **Monitoring**       | `@vercel/speed-insights`, `web-vitals`, SEO asset generation scripts                           |

---

## 3. Monorepo Directory Structure

```
/
├── src/                          ← React frontend (TypeScript)
│   ├── App.tsx                   ← Root router, lazy loading, ProtectedRoute, auth guard
│   ├── index.tsx                 ← React entry point
│   ├── pages/                    ← Route-level page components
│   │   ├── HomePage.tsx          ← Public landing page
│   │   ├── PropertiesPage.tsx    ← Property search/listing
│   │   ├── PropertyDetailPage.tsx
│   │   ├── AboutPage.tsx / ServicesPage.tsx / CareersPage.tsx / ContactPage.tsx
│   │   ├── UnifiedDashboardPage.tsx  ← Main CRM shell for all internal roles
│   │   ├── auth/                 ← SignInPage, ProfilePage, PendingApprovalPage, UAEPassSuccessPage
│   │   ├── buyer/                ← MortgageCalculatorPage, DLDFeesPage, FavoriteListings, SavedSearches
│   │   ├── seller/               ← PricingToolsPage
│   │   ├── landlord/             ← LandlordPortalPage, RentalManagementPage
│   │   ├── tenant/               ← TenantPortalPage
│   │   ├── leasing-agent/        ← TenantScreeningPage, ContractManagementPage
│   │   ├── secondary-sales-agent/ ← SalesPipelinePage
│   │   ├── owner/                ← SystemHealthPage, WhatsAppDashboardPage, etc.
│   │   └── crm/                  ← CRMHubPage, LeadManagementPage, PropertyManagementPage, AgentPerformancePage
│   │
│   ├── components/               ← Feature components organized by domain
│   │   ├── layout/               ← AppLayout, UnifiedSidebar (canonical), DashboardWorkspace,
│   │   │                            PublicLayout, PublicNavbar, MobileMenuDrawer, DepartmentContentPanel
│   │   ├── crm/                  ← 30+ named CRM modules (one per AI assistant)
│   │   │   ├── ClaraLeadsCRM_NEW/
│   │   │   ├── SophiaSalesCRM_NEW/
│   │   │   ├── DaisyLeasingCRM_NEW/   ← 7 tabs, 1885 lines
│   │   │   ├── MaryInventoryCRM_NEW/  ← Intelligent inventory with MaryPipelineTab
│   │   │   ├── TheodoraFinanceCRM_NEW/
│   │   │   ├── OliviaMarketingCRM_NEW/
│   │   │   ├── ZoeExecutiveCRM_NEW/
│   │   │   ├── LailaComplianceCRM_NEW/
│   │   │   ├── AuroraCTODashboard_NEW/
│   │   │   ├── NadiaWhatsAppCRM/
│   │   │   ├── NinaWhatsAppBotCRM_NEW/
│   │   │   ├── NancyHRCRM_NEW/
│   │   │   ├── HazelFrontendCRM_NEW/
│   │   │   ├── WillowBackendCRM_NEW/
│   │   │   └── shared/           ← UniversalAssistantLayout (shell for all CRMs),
│   │   │                            TaskLifecyclePanel, LifecycleNotificationFeed,
│   │   │                            TaskLifecycleBoard, AssistantSidebar, DataGridView, etc.
│   │   ├── portal/
│   │   │   ├── tenant/           ← TenantLeaseTab, TenantPaymentHistoryTab (PDC), TenantMaintenanceTab,
│   │   │   │                        TenantDocumentsTab, TenantKeyHandoverTab
│   │   │   └── landlord/         ← LandlordPropertiesTab, LandlordTenantsTab, LandlordOfferReviewTab,
│   │   │                            LandlordIncomeTab, LandlordPaymentsTab, LandlordMaintenanceTab, LandlordDocumentsTab
│   │   ├── features/
│   │   │   ├── InventoryDashboard/   ← Property inventory pipeline UI
│   │   │   ├── AIAssistantDashboard/ ← 40-assistant hub
│   │   │   ├── DepartmentDashboard/
│   │   │   └── SearchProperties/
│   │   └── (many shared/utility components)
│   │
│   ├── store/                    ← Redux store
│   │   ├── store.tsx             ← Root store configuration
│   │   ├── slices/               ← 30+ domain slices
│   │   │   ├── aiAssistant/      ← types.ts, registry.ts, selectors.ts
│   │   │   ├── aiAssistantDashboardSlice.tsx  ← 40 assistants + task lifecycle
│   │   │   ├── sidebarSlice.ts   ← globalSearch, sidebarCollapsed, selectedService
│   │   │   ├── nadiaSlice.ts     ← WhatsApp conversation state
│   │   │   ├── inventorySlice.tsx
│   │   │   ├── notificationSlice.ts
│   │   │   └── ...
│   │   └── thunks/
│   │
│   ├── config/                   ← Central configuration files
│   │   ├── roles.ts              ← 23 role definitions with permissions + dashboardPath
│   │   ├── departmentConfig.ts   ← SIDEBAR_DEPARTMENTS (canonical sidebar nav)
│   │   ├── assistantRegistry.ts  ← 40 AI assistants × 12 departments (TypeScript)
│   │   ├── navigation.ts         ← Route navigation map
│   │   ├── constants.ts          ← Platform-wide constants
│   │   ├── firebase.ts           ← Firebase app initialization
│   │   └── platformFeatures.ts
│   │
│   ├── styles/                   ← Theme system
│   │   ├── theme/colors.ts       ← Canonical color tokens (role colors, brand colors)
│   │   ├── ThemeProvider.tsx
│   │   └── dubaiLuxuryTheme.css  ← CSS vars (--dubai-luxury-gold = #E31E24)
│   │
│   ├── hooks/                    ← useSocket, and other custom hooks
│   ├── i18n/                     ← Internationalization (Arabic planned in Phase 8)
│   ├── types/                    ← Shared TypeScript types
│   └── utils/                    ← safeStorage, authFetch, logger, etc.
│
├── server/                       ← Express.js API (Node.js 20, ESM, TypeScript)
│   ├── index.ts                  ← Entry point — all middleware + route mounts
│   ├── database.ts               ← Prisma client singleton + MongoDB connection
│   ├── routes/                   ← 60+ route files (one per domain)
│   ├── middleware/
│   │   ├── auth.ts               ← JWT verification
│   │   ├── rbac.ts               ← requireRole / requirePermission
│   │   ├── rateLimiter.ts        ← 6 tier rate limiters (api, auth, register, password, strict, contact)
│   │   ├── errorHandler.ts       ← Centralized AppError class + asyncHandler
│   │   └── requestId.ts          ← Correlation ID on every request/response
│   ├── services/
│   │   ├── ai/                   ← leadScoringEngine, leadAutoRouter, marketAnalyst, leadScoringScheduler
│   │   ├── automation/           ← followUpScheduler (hot/warm/cold cadences)
│   │   ├── compliance/           ← reraExpiryScheduler
│   │   ├── nadia/                ← WhatsApp conversation engine: ninaEngine (NLP), messageProcessor,
│   │   │                            conversationMemory, queueManager, whatsappAssistant
│   │   ├── socketServer.ts       ← Socket.IO real-time event broadcasting
│   │   ├── WhatsAppBotService.ts ← Meta API client (env: WHATSAPP_ACCESS_TOKEN, _BUSINESS_ACCOUNT_ID, _PHONE_NUMBER_ID)
│   │   ├── emailService.ts       ← Resend email sending
│   │   ├── currencyService.ts    ← Live FX rate refresh scheduler
│   │   ├── schedulingService.ts  ← Viewing reminder scheduler
│   │   └── dashboardService.ts
│   ├── config/env.ts             ← Env var validation and export
│   └── utils/logger.ts
│
├── prisma/
│   ├── schema.prisma             ← 28 MongoDB models
│   ├── seed.ts                   ← Base seed data
│   └── seed-enhanced.ts          ← Large/small dataset seeding
│
├── plans/                        ← Living project roadmap (550+ files)
│   ├── MASTER_PLAN.md            ← Single source of truth for project status
│   ├── PENDING_TASKS_ONLY.md
│   ├── INDEX.md
│   ├── departments/              ← 12 department planning docs (01-executive → 12-data-and-ai)
│   ├── PHASE_4_WHATSAPP.md
│   ├── PHASE_5_LEASE.md
│   ├── PHASE_6_COMPLIANCE.md
│   ├── PHASE_7_ANALYTICS.md
│   ├── PHASE_8_ARABIC.md
│   ├── PHASE_9_RBAC.md
│   └── PHASE_10_PWA.md
│
├── business/                     ← Business documentation
│   ├── 05_srs_and_engineering/   ← 5 SRS files
│   ├── 06_flowcharts/            ← 10 process flowcharts
│   ├── 07_strategy/              ← 5 strategy documents
│   ├── 08_compliance/            ← 4 compliance documents
│   └── 09_operations/            ← 4 operations documents
│
├── cypress/ playwright/          ← E2E test suites
├── k8s/ helm/                    ← Kubernetes manifests + Helm chart
├── scripts/                      ← SEO generation, deployment verification, PDF generation
├── docker-compose.yml / .dev / .prod
├── Dockerfile / Dockerfile.frontend / Dockerfile.prod
├── nginx.conf / nginx.prod.conf
├── vercel.json
└── package.json
```

---

## 4. Database Schema — 28 Prisma Models (MongoDB)

### Auth & Users

| Model                | Purpose                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `User`               | All platform users: agents, admins, tenants, landlords. Has `role`, `brnNumber` (RERA), `firebaseUid`, `passwordHash`. |
| `WebAuthnCredential` | Passkey/biometric credentials per user (counter, publicKey, transports).                                               |

### Property & Inventory

| Model      | Purpose                                                                                                                                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Property` | Listings. Key fields: `inventoryStage` (5-stage pipeline), `isLocked` (when offer accepted), `titleDeedMissing`, `landlordPassportMissing`, `ejariMissing`, `rentalPrice`, `commissionPercent`, `availabilityDate`, `municipalityNumber`, `plotNumber`, `rentIndexRef`. |

### CRM / Lead Pipeline

| Model              | Purpose                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Lead`             | Core CRM entity. Has `score` (0–100), `scoreTier` (hot/warm/cold/inactive), `dealType` (lease/sale/buy), `leasingStage` (1–10), `tenantRequirements` (JSON). |
| `LeadScoreHistory` | Full audit log of every score change with `trigger` and `breakdown`.                                                                                         |
| `Activity`         | Event log for all entity changes across the platform.                                                                                                        |
| `Client`           | Converted-from-lead client profiles. Has `category` (buyer/seller/landlord/tenant/investor), `type` (individual/corporate).                                  |
| `ClientProperty`   | Many-to-many junction: Client ↔ Property with `relationship` type.                                                                                           |
| `Communication`    | Call/email/WhatsApp/meeting/note log per client.                                                                                                             |
| `FollowUpSequence` | Multi-step lead nurture sequences (hot/warm/cold cadences).                                                                                                  |
| `FollowUpStep`     | Individual steps: channel (whatsapp/email/call/sms), template, message, result.                                                                              |

### Transactions & Finance

| Model         | Purpose                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Transaction` | Financial transactions (sale/rental/lease) with status workflow.                                                                   |
| `Commission`  | Agent commissions with `vatRate`/`vatAmount` (UAE 5%), `type` (sale/rental/referral). Note: lease commissions use type `'rental'`. |
| `Invoice`     | Invoices with `lineItems` JSON, VAT, `dueDate`.                                                                                    |
| `Expense`     | Company expenses with approval workflow.                                                                                           |

### Leasing

| Model           | Purpose                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Tenant`        | Tenant profile (separate from User): `emiratesId`, `nationality`, `moveInDate`/`moveOutDate`.                            |
| `Offer`         | Offers with `offerType` (lease/sale), `counterHistory` JSON, `rejectionReason`. Acceptance locks the property.           |
| `Lease`         | Full lease: `ejariNumber`/`ejariStatus`, `keyHandoverDate`, `meterReadings` JSON, `nextPaymentDue`, `addendumDocuments`. |
| `LeaseAddendum` | Lease amendments with signature tracking and document URL.                                                               |
| `PDCSchedule`   | Post-dated cheques: `chequeNumber`, `bankName`, `amount`, `dueDate`, `status` (pending/presented/cleared/bounced).       |
| `Maintenance`   | Maintenance requests: category (plumbing/electrical/hvac/etc.), priority, cost, scheduling.                              |

### Scheduling & Documents

| Model               | Purpose                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `Viewing`           | Property viewings with `icsToken` (calendar download), `feedback`, `rating`, `reminderSent`. |
| `AgentAvailability` | Weekly time slots per agent with break times (HH:mm format).                                 |
| `Document`          | Contract/MOU/Form-F/NOC document store with HTML content and version tracking.               |
| `SavedSearch`       | User-saved property filter sets with `alertEnabled` match notifications.                     |
| `Favorite`          | User-saved property listings (unique per user+property).                                     |

### WhatsApp / Nadia

| Model                    | Purpose                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `NadiaConversation`      | WABA conversation threads: `intent`, `leadScore`, `timeline`, `status`, `routedAt`.                        |
| `NadiaMessage`           | Individual messages: `direction` (inbound/outbound), `messageType`, `status` (sent/delivered/read/failed). |
| `NadiaConversationQueue` | Priority queue for agent assignment with SLA `responseTime` tracking.                                      |

### HR

| Model            | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `JobApplication` | Careers page submissions with workflow status (received → hired/rejected). |

---

## 5. Role Architecture — 23 Roles, 7 Categories

Defined in `src/config/roles.ts`. Enforced server-side via RBAC middleware (`server/middleware/rbac.ts`).

| Category       | Role IDs                                                                            |
| -------------- | ----------------------------------------------------------------------------------- |
| **Executive**  | `managing_director`, `real_estate_company`, `property_mgmt_company`                 |
| **Admin**      | `super_admin`                                                                       |
| **Management** | `branch_manager`, `sales_manager`, `leasing_manager`                                |
| **Agent**      | `sales_agent`, `leasing_agent`, `property_manager`, `affiliated_agent`              |
| **Specialist** | `property_consultant`, `mortgage_consultant`, `valuation_expert`, `trustee_officer` |
| **Support**    | `legal_officer`, `finance_officer`, `marketing_manager`, `document_controller`      |
| **Client**     | `developer`, `investor`, `landlord`, `buyer`, `tenant`                              |

**Key legacy aliases** (normalized via `ROLE_KEY_MAP`):

- `owner` → `managing_director`
- `admin` → `super_admin`
- `seller` → `landlord`
- `leasing-agent` → `leasing_agent`

**Routing logic in `App.tsx`:**

- `landlord` role → `/landlord-portal`
- `tenant` role → `/tenant-portal`
- All internal roles → `UnifiedDashboardPage`

---

## 6. AI Assistant Registry — 40 Assistants, 12 Departments

Both registries must stay in sync: `src/config/assistantRegistry.ts` and `src/store/slices/aiAssistant/registry.ts`.

| Dept ID               | Label               | Color     | Key Assistants                                                       |
| --------------------- | ------------------- | --------- | -------------------------------------------------------------------- |
| `communications`      | Communications      | —         | Nadia (WhatsApp CRM), Nina (WhatsApp Bot/NLP)                        |
| `operations`          | Operations          | —         | Mary (Inventory), Vesta (Handover)                                   |
| `sales`               | Sales               | —         | Clara (Leads), Sophia (Sales), Hunter (Prospecting)                  |
| `finance`             | Finance             | —         | Theodora (Finance), Maven (Investment)                               |
| `marketing`           | Marketing           | —         | Olivia (Marketing), Cipher (Market)                                  |
| `executive`           | Executive           | —         | Zoe (Executive), Atlas (Projects), Juno (Community), Kairos (Luxury) |
| `compliance`          | Compliance          | —         | Laila (Compliance), Henry (Audit)                                    |
| `technology`          | Technology          | —         | Hazel (Frontend), Willow (Backend)                                   |
| `legal`               | Legal               | —         | Evangeline (Legal)                                                   |
| `intelligence`        | Intelligence        | —         | Aurora (CTO/Analysis), Sentinel (Property)                           |
| `customer_experience` | Customer Experience | `#8B5CF6` | Linda, Mira                                                          |
| `data_and_ai`         | Data & AI           | `#F97316` | (AI/data assistants)                                                 |

**Total: 40 named assistants** (Nadia, Nina, Mary, Nancy, Daisy, Clara, Sophia, Theodora, Olivia, Zoe, Laila, Aurora, Hazel, Willow, Evangeline, Sentinel, Hunter, Henry, Cipher, Atlas, Vesta, Juno, Kairos, Maven, Linda, Archer, Prism, Sage, Echo, Mira, Rex, Iris, Apex, Halo, Oracle, Flux, Nova, Quill, Lumen, Crest)

**Task lifecycle system** (in `aiAssistantDashboardSlice.tsx`):

- 7 lifecycle stages: `TaskLifecycleStage` enum
- Reducers: `advanceTaskLifecycle`, `addTaskAction`, `setTaskResult` — each auto-fires a notification
- Selectors: `selectTasksByLifecycleStage`, `selectPendingActionsCount`, `selectCompletedTasksCount`
- UI: `TaskLifecyclePanel`, `LifecycleNotificationFeed`, `TaskLifecycleBoard` in `src/components/crm/shared/`

---

## 7. Backend API Surface

### Server Entry Point (`server/index.ts`)

Middleware stack (in order):

1. `requestIdMiddleware` — correlation ID
2. `helmet` — security headers + CSP
3. CORS — configured from `CORS_ORIGINS` env
4. `compression`
5. `morgan` — HTTP request logging
6. Rate limiters (6 tiers): `apiLimiter`, `authLimiter`, `registerLimiter`, `passwordLimiter`, `strictLimiter`, `contactLimiter`
7. `express.json()` body parsing
8. JWT auth middleware (per-route)
9. RBAC (`requireRole` / `requirePermission`) (per-route)

### Route Groups

| Group            | Base Path                         | Key Routes                                                         |
| ---------------- | --------------------------------- | ------------------------------------------------------------------ |
| Auth             | `/api/auth`                       | login, register, profile, logout, password change                  |
| Properties       | `/api/properties`                 | CRUD, search/filter, `/inventory-stats` (GET)                      |
| Leads            | `/api/leads`                      | CRUD, score, bulk ops                                              |
| Agents           | `/api/agents`                     | CRUD, availability                                                 |
| Clients          | `/api/clients`                    | CRUD + communication log                                           |
| Transactions     | `/api/transactions`               | CRUD                                                               |
| Finance          | `/api/finance`                    | Revenue, commissions, expenses                                     |
| Invoices         | `/api/invoices`                   | Standard invoices                                                  |
| Leasing Invoices | `/api/invoices/lease`             | Lease-specific invoices                                            |
| Tenants          | `/api/tenants`                    | CRUD                                                               |
| Leases           | `/api/leases`                     | CRUD, `/:id/addendum`, `/:id/key-handover`, `/:id/pnl`, `/:id/pdc` |
| Offers           | `/api/offers`                     | CRUD, `PATCH /:id` (availability guard), `PATCH /:id/decision`     |
| Viewings         | `/api/viewings`                   | CRUD + agent availability                                          |
| Maintenance      | `/api/maintenance`                | CRUD                                                               |
| Documents        | `/api/documents`                  | Generate, sign, retrieve                                           |
| Compliance       | `/api/compliance`                 | RERA, KYC/AML checks                                               |
| Analytics        | `/api/analytics`                  | Dashboards, metrics                                                |
| Reporting        | `/api/reporting`                  | `/dashboard/leasing`                                               |
| Communications   | `/api/communications`             | Client communication log                                           |
| Currency         | `/api/currency`                   | Live FX rates                                                      |
| Email            | `/api/email`                      | Send email via Resend                                              |
| AI Chat          | `/api/ai-chat`                    | Assistant chat completions                                         |
| Assistants       | `/api/assistants`                 | AI assistant management                                            |
| Nadia / WhatsApp | `/api/nadia`, `/api/meta-webhook` | WhatsApp WABA webhook + routing                                    |
| Favorites        | `/api/favorites`                  | User saved properties                                              |
| Saved Searches   | `/api/saved-searches`             | Search presets + alerts                                            |
| Follow-ups       | `/api/follow-ups`                 | Sequence management                                                |
| Activities       | `/api/activities`                 | Activity feed                                                      |
| Homepage         | `/api/homepage`                   | SEO/public content                                                 |
| Contact          | `/api/contact`                    | Contact form submission                                            |
| Job Applications | `/api/job-applications`           | POST (public) / GET+PATCH (auth+role)                              |

---

## 8. Frontend State — Redux Store (30+ Slices)

| Slice                       | Key State                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `userSlice`                 | `currentUser`, `isLoading`                                                                     |
| `authSlice`                 | Auth thunks (login/logout)                                                                     |
| `propertySlice`             | Property listings, filters, selected property                                                  |
| `crmDataSlice`              | CRM core entities                                                                              |
| `dashboardSlice`            | Dashboard panel configs                                                                        |
| `sidebarSlice`              | `selectedDepartment`, `selectedService`, `globalSearch` (string), `sidebarCollapsed` (boolean) |
| `aiAssistantDashboardSlice` | 40 assistants, task lifecycle (7 stages), notifications                                        |
| `nadiaSlice`                | WhatsApp conversation state                                                                    |
| `notificationSlice`         | Real-time notification queue                                                                   |
| `inventorySlice`            | Property inventory pipeline state                                                              |
| `analyticsSlice`            | Report data                                                                                    |
| `navigationSlice`           | Theme + current route                                                                          |
| `whatsappSlice`             | WhatsApp integration state                                                                     |
| `sidebarUISlice`            | Visual sidebar state                                                                           |
| `leadsSslice`               | Lead list state                                                                                |
| `savedSearchesSlice`        | Saved search management                                                                        |
| `homepageSlice`             | Public page data                                                                               |
| `featuresSlice`             | Feature flags                                                                                  |

**`sidebarSlice` specifics:**

- `selectedService` stores the service label (e.g., `"Lead Management"`)
- `DepartmentContentPanel` uses it as a key into `deptContent.services`
- Actions: `setGlobalSearch`, `clearGlobalSearch`, `setSidebarCollapsed`, `toggleSidebarCollapsed`
- Selectors: `selectGlobalSearch`, `selectSidebarCollapsed`

---

## 9. Active Implemented Systems

### 9.1 Leasing Pipeline (10 Stages)

`Lead.leasingStage` tracks: Lead Acquisition → Matching → Viewing → Offer → Decision → Deposit → Contract → Handover → Payment → P&L

- CRM: `DaisyLeasingCRM_NEW` — 7 full tabs (Leases, Pipeline Kanban, Inquiries, PDC Payments, Maintenance, Renewals, Analytics)
- Data files: `data/leasing.ts` + `data/leasingExtended.ts` (PDC isolated to avoid test mock conflicts)
- API routes: `/api/leases/:id/addendum`, `/api/leases/:id/key-handover`, `/api/leases/:id/pnl`, `/api/leases/:id/pdc`, `PATCH /api/offers/:id/decision`
- Commission type for leases: `'rental'` (not `'lease'`)

### 9.2 Intelligent Inventory (Mary)

`Property.inventoryStage` 5-stage pipeline: `draft_collected` → `verified_active` → `under_offer` → `leased_sold` → `handed_over`

- Property locked when offer accepted (`isLocked = true`, `lockedAt` timestamp)
- Document flags: `titleDeedMissing`, `landlordPassportMissing`, `ejariMissing`
- API: `GET /api/properties/inventory-stats`
- UI: `InventoryDashboard` component + `MaryInventoryCRM_NEW` with `MaryAcquisitionTab` + `MaryPipelineTab`

### 9.3 Nadia WhatsApp Hub

Flow: Meta WABA webhook → Nina NLP engine (intent detection) → Priority queue → Agent assignment → CRM lead creation

- Engine files: `server/services/nadia/` (ninaEngine, messageProcessor, conversationMemory, queueManager, whatsappAssistant)
- Meta API env vars: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_PHONE_NUMBER_ID`
- Models: `NadiaConversation`, `NadiaMessage`, `NadiaConversationQueue`

### 9.4 Lead Scoring Engine

- Score 0–100 with tiers: hot (80+), warm (60–79), cold (<60), inactive
- Breakdown: `{ engagement, demographic, behavioral, source }`
- Triggers: middleware (real-time on lead update), batch (scheduled), manual, override, whatsapp
- Full history in `LeadScoreHistory` model

### 9.5 Follow-up Automation

Multi-cadence sequences (hot/warm/cold) firing on schedule via `followUpScheduler`:

- Channels: whatsapp, email, call, sms
- Template-based or custom messages
- Full step result tracking (`replied`, `no_response`, `bounced`, `call_answered`, etc.)

### 9.6 RERA / DLD Compliance

- Agent `brnNumber` + `brnExpiry` + `reraLicenseNumber` on `User` model
- Property `municipalityNumber`, `plotNumber`, `buildingPermitNumber`, `rentIndexRef`
- Lease `ejariNumber`, `ejariStatus`, `ejariRegistrationDate`, `ejariExpiryDate`
- Scheduler: `reraExpiryScheduler` monitors BRN expiry and fires alerts

### 9.7 Self-Service Portals

**Tenant Portal** (5 tabs):

1. `TenantLeaseTab` — Lease details
2. `TenantPaymentHistoryTab` — PDC schedule toggle, Next Payment Due + Late Fee cards, disabled Pay Now
3. `TenantMaintenanceTab` — Submit form (adds to local list + success message)
4. `TenantDocumentsTab`
5. `TenantKeyHandoverTab`

**Landlord Portal** (7 tabs):

1. `LandlordPropertiesTab`
2. `LandlordTenantsTab`
3. `LandlordOfferReviewTab`
4. `LandlordIncomeTab`
5. `LandlordPaymentsTab`
6. `LandlordMaintenanceTab`
7. `LandlordDocumentsTab`

Both portals have dedicated navbars: White Caves logo + portal type label + user first name + Sign Out.

### 9.8 Real-time (Socket.IO)

`server/services/socketServer.ts` broadcasts CRUD events to all connected clients → Redux receives and updates slices. `useSocket` hook in `src/hooks/` manages connection lifecycle.

### 9.9 WebAuthn Biometric Login

`WebAuthnCredential` model stores passkey public keys. `BiometricLogin` component in `src/features/auth/`. Gracefully degrades if module fails to load.

---

## 10. Layout & Navigation Architecture

### Canonical Layout Components

| Component                  | Location                                        | Role                                                    |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `AppLayout`                | `src/components/layout/AppLayout.tsx`           | Shell for all authenticated internal pages              |
| `UnifiedSidebar`           | `src/components/layout/UnifiedSidebar/`         | **Canonical** sidebar — use this, not legacy components |
| `DashboardWorkspace`       | `src/components/layout/DashboardWorkspace/`     | Content area for the unified dashboard                  |
| `DepartmentContentPanel`   | `src/components/layout/DepartmentContentPanel/` | Renders services for selected sidebar department        |
| `PublicLayout`             | `src/components/layout/PublicLayout.tsx`        | Shell for public-facing pages                           |
| `UniversalAssistantLayout` | `src/components/crm/shared/`                    | Shell/frame for every named CRM module                  |

**Legacy (do not use in new code):** `EnhancedLeftSidebar`, `SidebarContainer`

### Sidebar Department Config

`SIDEBAR_DEPARTMENTS` in `src/config/departmentConfig.ts` is the **single source of truth** for CRM sidebar departments. Keys: `operations`, `finance`, `sales`, `marketing`, `communications`, `compliance`, `technology`, `legal`.

---

## 11. Testing Infrastructure

| Type               | Tool                                                     | Coverage                                                                           |
| ------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Unit + Integration | Vitest + Testing Library + MSW                           | Every route, service, slice, component has paired `.test.ts(x)`                    |
| E2E                | Playwright                                               | Dashboard smoke, accessibility audit (`@axe-core/playwright`), performance layer 5 |
| API                | Supertest                                                | `server/__tests__/`                                                                |
| Security lint      | `eslint-plugin-security`, `eslint-plugin-no-unsanitized` | All TypeScript/JSX files                                                           |

**Key commands:**

```bash
npm run test:run          # Vitest (all unit tests)
npm run test:coverage     # Coverage report
npm run test:e2e          # Playwright E2E
npm run lint              # ESLint
npm run build             # Vite production build
npm run server            # Express API (port 3001 dev, PORT env prod)
npm run dev               # Vite frontend (port 5000)
npm run dev:all           # Both concurrently
npm run db:seed           # Seed MongoDB via Prisma
npm run db:generate       # Regenerate Prisma client
npm run db:push           # Push schema to MongoDB
```

---

## 12. Planned Upgrade Phases (Not Yet Complete)

| Phase        | Focus                                                       | File                          |
| ------------ | ----------------------------------------------------------- | ----------------------------- |
| **Phase 4**  | WhatsApp Bot enhancements (templates, broadcast, analytics) | `plans/PHASE_4_WHATSAPP.md`   |
| **Phase 5**  | Full lease workflow completion                              | `plans/PHASE_5_LEASE.md`      |
| **Phase 6**  | RERA/DLD compliance layer full enforcement                  | `plans/PHASE_6_COMPLIANCE.md` |
| **Phase 7**  | Analytics & reporting engine                                | `plans/PHASE_7_ANALYTICS.md`  |
| **Phase 8**  | Arabic language support (RTL i18n)                          | `plans/PHASE_8_ARABIC.md`     |
| **Phase 9**  | Full RBAC enforcement across all routes + UI                | `plans/PHASE_9_RBAC.md`       |
| **Phase 10** | PWA (Progressive Web App — offline, push notifications)     | `plans/PHASE_10_PWA.md`       |

**Largest gaps identified for next architect sprint:**

1. **RBAC (Phase 9)** — permissions are defined but not consistently enforced on all API routes and UI gating
2. **Arabic/RTL (Phase 8)** — i18n infrastructure exists but translations and RTL layout not implemented
3. **PWA shell (Phase 10)** — no service worker, no offline support, no push notification registration
4. **Assistant mock data** — many of the 40 CRM modules still use local static/demo data rather than live API calls
5. **Analytics engine (Phase 7)** — Recharts components exist but many aggregate endpoints are stubs

---

## 13. Key Environment Variables

```env
# Database
DATABASE_URL=                    # MongoDB connection string

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# WhatsApp (Meta WABA)
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Payments
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=

# Server
PORT=                            # Production port
API_PORT=3001                    # Dev API port
NODE_ENV=
CORS_ORIGINS=                    # Comma-separated allowed origins
```

---

## 14. Business & Compliance Context

- **Jurisdiction:** Dubai, UAE
- **Regulatory bodies:** RERA (Real Estate Regulatory Agency), DLD (Dubai Land Department)
- **UAE-specific features:** Ejari registration (mandatory tenancy contract), PDC (post-dated cheques for rent), BRN (Broker Registration Number), 5% VAT on commercial/agent commissions, DEWA meter readings at handover
- **Currency:** AED (primary), with USD/EUR/GBP/INR support across all monetary fields
- **KYC/AML:** KYC verification step + AML dashboard in `src/components/crm/shared/KYCAMLDashboard.jsx`

---

_This document is auto-generated from codebase analysis. For the authoritative project status and task tracking, refer to [`plans/MASTER_PLAN.md`](./plans/MASTER_PLAN.md)._
