# White Caves Real Estate — Master Plan

> **Single Source of Truth** — Updated April 26, 2026  
> **Goal**: #1 Real Estate Platform in Dubai  
> **Status**: Infrastructure ✅ · Phase 1 (Homepage) 🚧 · Phase 2 (Landlord & Tenant Self-Service Portals) 🚧
> **Canonical Path**: `/plans/MASTER_PLAN.md`

---

## 🔢 NEW PRIORITY ORDER (April 2026 Reset)

The development order has been reset to focus on visible, user-facing value first:

| Priority      | Phase       | Description                                                               | Detailed Plan                                              |
| ------------- | ----------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **#1 — Now**  | Phase 1     | Public Homepage — full UI with dummy data                                 | [PHASE_1_HOMEPAGE.md](./PHASE_1_HOMEPAGE.md)               |
| **#2 — Next** | Phase 2     | Landlord & Tenant Self-Service Portals — simple portals for clients       | [PHASE_2_LANDLORD_TENANT.md](./PHASE_2_LANDLORD_TENANT.md) |
| **#3 — High** | Phase 3     | Full CRM — all tabs for `arslanmalikgoraha@gmail.com` (managing_director) | [PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)     |
| **#4–10**     | Phases 4–10 | WhatsApp, Compliance, Arabic, RBAC (Phase 9), PWA, etc.                   | [PHASE_3_AND_BEYOND.md](./PHASE_3_AND_BEYOND.md)           |

> See each phase file for detailed task lists, acceptance criteria, and current status.

---

---

## ✅ Foundation Already Built (Do Not Re-Do)

| Item                   | Description                                                                             | Status |
| ---------------------- | --------------------------------------------------------------------------------------- | ------ |
| TypeScript strict mode | 0 compile errors across all 666 source files                                            | ✅     |
| Build pipeline         | Vite 7 build < 10s, GitHub Actions CI/CD                                                | ✅     |
| Design system          | Gold/dark theme, Poppins/Inter, styled-components, design tokens                        | ✅     |
| Auth infrastructure    | JWT, bcrypt, Firebase OAuth, rate limiting, CORS, Helmet                                | ✅     |
| Database models        | 7 Prisma models (User, Property, Lead, Commission, Activity, Transaction, Tenant)       | ✅     |
| Core backend routes    | leads, properties, agents, transactions, finance, tenants, compliance, crm, reporting   | ✅     |
| CRM dashboard shell    | UnifiedDashboardPage, dual sidebar, 29-role tab mapping                                 | ✅     |
| AI assistant registry  | 17 assistants registered in Redux (Clara, Mary, Nadia, Sophia, Daisy, Zoe, Laila, etc.) | ✅     |
| AI assistant plan API  | /api/assistants CRUD + plan read/write, XSS protection (Phase 0.8)                      | ✅     |
| Homepage shell         | HomePage.tsx with Hero, Features, Locations, Team, Testimonials, ContactCTA sections    | ✅     |
| Homepage dummy data    | HOME_PROPERTIES in src/data/homeProperties.ts (10 Dubai properties)                     | ✅     |
| Seed data              | owner@whitecaves.ae (role: lion/owner) + 6 agents + properties + leads                  | ✅     |
| Security hardening     | Timing-safe webhook, CORS whitelist, Firebase 503, CRM export field projection          | ✅     |
| Code quality           | ESLint, Prettier, husky pre-commit, 299 test files                                      | ✅     |

---

---

## 📊 Architecture Summary (Unchanged)

- **Frontend**: React 18, TypeScript 5 (strict), Redux Toolkit, Vite 7, styled-components, Framer Motion
- **Backend**: Express 5, Prisma 6.6, MongoDB, JWT auth, bcrypt, rate limiting
- **Database**: 7 Prisma models (User, Property, Lead, Commission, Activity, Transaction, Tenant), 40+ indexes
- **RBAC**: 29 roles mapped, `lion` = super user with all 11 tabs
- **AI Assistants**: 17 registered in code (27 documented in business_docs/)
- **CRM Layout**: Dual sidebar (left=departments, right=AI assistants), dynamic center, 11 owner tabs

---

### Phase 1: Pending Tasks

- [x] Auth system — JWT, bcrypt, authMiddleware on all /api routes ✅
- [x] RBAC — requireRole/requirePermission enforced on every route (12 roles, 20+ permissions) ✅
- [x] Error handling — centralized AppError, asyncHandler, structured 422 validation ✅
- [x] Rate limiting — 5 limiters fully operational (api, auth, register, password, strict) ✅
- [x] Input validation & XSS sanitization on all POST/PATCH handlers ✅
- [x] Security hardening — Helmet CSP, CORS whitelist, timing-safe webhooks, 1MB body limit ✅
- [x] Structured server logging — logger with levels and context-aware formatting ✅
- [ ] WhatsApp Account Recovery (LocalAuth, auto-reconnect, heartbeat)
- [x] SEO & Accessibility — meta tags/JSON-LD/OG already excellent; form labels fixed (20+ inputs), aria-labels added, dynamic page titles on all key pages, table aria-labels on 9 tables, ARIA conflicts fixed, dead links converted to real navigation ✅
- [x] ResponsiveImage component (srcset, WebP, lazy loading) — `src/components/ui/ResponsiveImage/`
- [x] Bundle Optimization — lazy-loaded RoleGateway/SpeedInsights/UniversalComponents, split auth-features (32kB) and owner-tabs (158kB) from critical path, fixed stale chunk reference, inline CSS skeleton in index.html ✅
- [ ] Testing Expansion (Vitest 50%+, Playwright E2E, test factories)
- [ ] API & Performance (rate limiting finalized, query optimization, file uploads)
- [ ] CI/CD (GitHub Actions, husky/lint-staged, Swagger/OpenAPI)

---

## 📋 Phase 2: Improvements & Production Hardening (NEW — April 2026)

### 2.1 Stub Endpoints → Full Implementation

- [ ] Contracts CRUD — Prisma model + full /api/contracts (currently 501)
- [ ] Job Applications CRUD — JobApplication model exists, endpoints return 501
- [ ] Appointments CRUD — Prisma model + /api/appointments (currently 501)
- [ ] Tenancy Agreements CRUD — /api/tenancy-agreements (currently 501)
- [ ] Payment Processing — Stripe SDK for /api/payments (currently 503)
- [ ] Property Valuation — ML model for /api/valuation (currently 501)
- [ ] Role Requests — /api/role-requests for self-service role management

### 2.2 File Upload System

- [ ] Multer middleware for multipart uploads
- [ ] S3/Cloud Storage integration
- [ ] File validation (size, MIME, virus scan)
- [ ] Image optimization pipeline (resize, WebP)

### 2.3 CRM Module Backend Integration

- [ ] Connect remaining 9 CRM modules to real APIs (Sophia, Daisy, Olivia, Mary, Nancy, Zoe, Aurora, Hazel, Willow — currently mock data)

### 2.4 i18n (Arabic + English)

- [ ] react-i18next integration + language detection
- [ ] Complete Arabic translations (currently 3/~20 sections)
- [ ] RTL layout support
- [ ] Date/number/currency locale formatting

### 2.5 API Documentation

- [ ] Expand OpenAPI from 10 to 30+ paths
- [ ] Swagger UI at /api-docs
- [ ] Storybook for 15 design system components
- [ ] Auto-validate API responses in tests

### 2.6 Monitoring & Observability

- [ ] Prometheus metrics endpoint
- [ ] Sentry/LogRocket error tracking
- [ ] DB query monitoring, correlation IDs

### 2.7 Security Hardening

- [ ] Fix npm audit vulnerabilities (7 total)
- [ ] 2FA implementation (Twilio/TOTP)
- [ ] firebase-admin SDK configuration
- [ ] Circuit breaker for external APIs

### 2.8 Testing Expansion

- [ ] Vitest coverage 50%+ target
- [ ] Test factories for data creation
- [ ] Full E2E critical path coverage
- [ ] Security/load testing

### 2.9 DevOps & CI/CD

- [ ] GitHub Actions pipeline
- [ ] Docker production optimization
- [ ] K8s manifest validation
- [ ] Dependabot/Renovate automated updates

---

## 🔴 Critical Security Items (from Audit Rounds 66, 69, 70)

- [x] **CRITICAL**: Firebase-sync endpoint — disabled with 503 until firebase-admin SDK configured ✅
- [x] **CRITICAL**: Webhook secret timing-attack vulnerability — uses crypto.timingSafeEqual ✅
- [x] **CRITICAL**: CRM export uses field projection via Prisma select (no data leakage) ✅
- [x] **HIGH**: Auth route ordering — profile/password use authMiddleware; logout now fixed ✅
- [x] **HIGH**: JobApplicants — loading spinner, error banner+retry, empty state ✅
- [x] **HIGH**: Form validation gaps — Edit modals in LeadManagement & PropertyManagement now validate required fields ✅

---

## 📊 Code Quality Metrics (Verified April 10, 2026)

| Metric                   | Target        | Current                  | Status |
| ------------------------ | ------------- | ------------------------ | ------ |
| TypeScript Strict Mode   | 100%          | 100% (0 tsc errors)      | ✅     |
| Build Success Rate       | 100%          | 100% (Vite build 17.86s) | ✅     |
| Production Build Time    | <20s          | 17.86s                   | ✅     |
| Unit Tests               | All pass      | 309 files, 7,744 tests   | ✅     |
| E2E Test Specs           | Full coverage | 11 spec files            | ⏳     |
| npm audit                | 0 vulns       | 7 vulns (1 critical)     | ⚠️     |
| Lighthouse SEO           | >90           | ~95                      | ✅     |
| Lighthouse Accessibility | >90           | ~92                      | ✅     |
| Dead Code Removed        | 0             | ~190KB (24 files)        | ✅     |
| Stale Logs Cleaned       | 0             | 3.0MB (23 files + dir)   | ✅     |
| `any` types              | 0             | ~39 (mostly tests)       | ⏳     |
| Stub endpoints           | 0             | 8 (501/503)              | ⏳     |
| OpenAPI paths            | 30+           | 10                       | ⏳     |
| i18n coverage            | en+ar         | en ✅, ar partial        | ⏳     |

---

## 🏗️ Architecture Summary

- **Frontend**: React 18, TypeScript 5 (strict), Redux Toolkit (13 slices), Vite 7, styled-components
- **Backend**: Express 5, Prisma 6.6, MongoDB, JWT auth, bcrypt, rate limiting
- **Database**: 17 Prisma models (User, Property, Lead, Commission, Contract, Transaction, Message, Conversation, Notification, AuditLog, Document, Favorite, Viewing, Offer, AIAssistant, Integration, Setting), 60+ indexes
- **RBAC**: 24 frontend roles aliased to 12 backend roles, 21 permissions, per-endpoint authorization (ADR-002)
- **Design Tokens**: Centralized at src/styles/theme/ — 90+ colors, 26+ typography, 7 spacing (ADR-007)
- **ADRs**: 7 architecture decision records in docs/adr/
- **AI Assistants**: 24 registered (Nadia=WhatsApp CRM, Clara=Leads, Mary=Inventory, etc.)
- **CRM Layout**: Dual sidebar (left=departments, right=AI assistants), dynamic center, 12 owner tabs
- **Testing**: Vitest + Playwright, load testing framework, accessibility audits
- **DevOps**: Docker, docker-compose, nginx, CI/CD (GitHub Actions → Vercel)

---

## 📝 Archive Reference

Previous MASTER_PLAN versions:

- `/archives/MASTER_PLAN.md` (March 6, 2026 — superseded)
- `/plans/MASTER_PLAN_UPDATED_FEB_2026.md` (Feb 2026 — superseded)
- Session summaries (SESSION_8–SESSION_10) — archived in `/plans/`

Audit reports with pending security fixes:

- `/plans/audit-round-66.md` (16 findings, 4 critical)
- `/plans/audit-round-69.md` (18 findings, 3 critical)
- `/plans/audit-round-70.md` (18 findings, 2 critical)
