# White Caves Real Estate — Master Plan

> **Single Source of Truth** — Updated April 29, 2026  
> **Goal**: #1 Real Estate Platform in Dubai  
> **Status**: Infrastructure ✅ · Phase 1 (Homepage) 🚧 · Phase 2 (Landlord & Tenant Self-Service Portals) 🚧 _(UI MVP + focused tests complete; integration and polish pending)_
> **Canonical Path**: `/plans/MASTER_PLAN.md`

---

## 🔢 NEW PRIORITY ORDER (April 2026 Reset)

The development order has been reset to focus on visible, user-facing value first:

| Priority      | Phase       | Description                                                                     | Detailed Plan                                              |
| ------------- | ----------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **#1 — Now**  | Phase 1     | Public Homepage — full UI with dummy data                                       | [PHASE_1_HOMEPAGE.md](./PHASE_1_HOMEPAGE.md)               |
| **#2 — Now**  | Phase 2     | Landlord & Tenant Self-Service Portals — UI MVP complete, integration remaining | [PHASE_2_LANDLORD_TENANT.md](./PHASE_2_LANDLORD_TENANT.md) |
| **#3 — High** | Phase 3     | Full CRM — all tabs for `arslanmalikgoraha@gmail.com` (managing_director)       | [PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)     |
| **#4–10**     | Phases 4–10 | WhatsApp, Compliance, Arabic, RBAC (Phase 9), PWA, etc.                         | [PHASE_3_AND_BEYOND.md](./PHASE_3_AND_BEYOND.md)           |

> See each phase file for detailed task lists, acceptance criteria, and current status.

---

---

## ✅ Foundation Already Built (Do Not Re-Do)

| Item                   | Description                                                                                                                        | Status |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| TypeScript strict mode | 0 compile errors across all 666 source files                                                                                       | ✅     |
| Build pipeline         | Vite 7 build < 10s, GitHub Actions CI/CD                                                                                           | ✅     |
| Design system          | Gold/dark theme, Poppins/Inter, styled-components, design tokens                                                                   | ✅     |
| Auth infrastructure    | JWT, bcrypt, Firebase OAuth, rate limiting, CORS, Helmet                                                                           | ✅     |
| Database models        | 28 Prisma models (User, Property, Lead, Lease, Maintenance, Commission, Activity, Transaction, Tenant, Client, Document, and more) | ✅     |
| Core backend routes    | leads, properties, agents, transactions, finance, tenants, compliance, crm, reporting                                              | ✅     |
| CRM dashboard shell    | UnifiedDashboardPage, dual sidebar, 29-role tab mapping                                                                            | ✅     |
| AI assistant registry  | 40 assistants registered in Redux (Clara, Mary, Nadia, Sophia, Daisy, Zoe, Laila, etc.)                                            | ✅     |
| AI assistant plan API  | /api/assistants CRUD + plan read/write, XSS protection (Phase 0.8)                                                                 | ✅     |
| Homepage shell         | HomePage.tsx with Hero, Features, Locations, Team, Testimonials, ContactCTA sections                                               | ✅     |
| Homepage dummy data    | HOME_PROPERTIES in src/data/homeProperties.ts (10 Dubai properties)                                                                | ✅     |
| Seed data              | owner@whitecaves.ae (role: lion/owner) + 6 agents + properties + leads                                                             | ✅     |
| Security hardening     | Timing-safe webhook, CORS whitelist, Firebase 503, CRM export field projection                                                     | ✅     |
| Code quality           | ESLint, Prettier, husky pre-commit, 299 test files                                                                                 | ✅     |

---

---

## 📊 Architecture Summary (Unchanged)

- **Frontend**: React 18, TypeScript 5 (strict), Redux Toolkit, Vite 7, styled-components, Framer Motion
- **Backend**: Express 5, Prisma 6.6, MongoDB, JWT auth, bcrypt, rate limiting
- **Database**: 28 Prisma models (User, Property, Lead, Commission, Activity, Transaction, Tenant), 40+ indexes
- **RBAC**: 29 roles mapped, `lion` = super user with all 11 tabs
- **AI Assistants**: 40 registered in code (27 documented in business_docs/)
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
- [ ] Testing Expansion (Vitest 50%+, Playwright E2E, test factories) _(portal-focused suites now expanded and passing)_
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

- [x] Custom LanguageContext with `t()`, `formatCurrency/Date/Number`, RTL toggling, localStorage persistence ✅
- [x] Complete Arabic translations — 13 sections (common, navigation, property, uae, search, appointment, agent, chatbot, forms, dashboard, footer, company, hero, nav) ✅
- [x] RTL layout support — `dir="rtl"` on `<html>`, `src/styles/rtl.css` global utility overrides ✅
- [x] Arabic font (Cairo) loaded via Google Fonts in `index.html` ✅
- [x] Date/number/currency locale formatting via `Intl` APIs ✅
- [x] Language detection from localStorage with fallback to English ✅
- [x] `LanguageSwitcher` component — EN↔AR globe-icon toggle in `PublicNavbar` ✅
- [x] `PublicNavbar` — all nav labels use `t()` (Home, Properties, Services, Company, Contact, List Property, Sign In) ✅
- [x] `Hero` section — all user-facing strings use `t()` (title, description, CTAs, stats, trust badges) ✅
- [ ] RTL layout polish — remaining pages (Properties, About, Services, Contact, Portals)
- [ ] Arabic content in remaining homepage sections (Features, Locations, Testimonials, Team, Footer)

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

- [x] Portal-focused Vitest coverage expanded with landlord + tenant portal suites (139 focused portal tests passing)
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

| Metric                   | Target        | Current                                                | Status |
| ------------------------ | ------------- | ------------------------------------------------------ | ------ |
| TypeScript Strict Mode   | 100%          | 100% (0 tsc errors)                                    | ✅     |
| Build Success Rate       | 100%          | 100% (Vite build 17.86s)                               | ✅     |
| Production Build Time    | <20s          | 17.86s                                                 | ✅     |
| Unit Tests               | All pass      | 309 files, 7,744 tests                                 | ✅     |
| E2E Test Specs           | Full coverage | 11 spec files                                          | ⏳     |
| npm audit                | 0 vulns       | 7 vulns (1 critical)                                   | ⚠️     |
| Lighthouse SEO           | >90           | ~95                                                    | ✅     |
| Lighthouse Accessibility | >90           | ~92                                                    | ✅     |
| Dead Code Removed        | 0             | ~190KB (24 files)                                      | ✅     |
| Stale Logs Cleaned       | 0             | 3.0MB (23 files + dir)                                 | ✅     |
| `any` types              | 0             | ~39 (mostly tests)                                     | ⏳     |
| Stub endpoints           | 0             | 8 (501/503)                                            | ⏳     |
| OpenAPI paths            | 30+           | 10                                                     | ⏳     |
| i18n coverage            | en+ar         | en ✅, ar ✅ (13 sections, LanguageSwitcher in navbar) | ✅     |

---

## 🏗️ Architecture Summary

- **Frontend**: React 18, TypeScript 5 (strict), Redux Toolkit (13 slices), Vite 7, styled-components
- **Backend**: Express 5, Prisma 6.6, MongoDB, JWT auth, bcrypt, rate limiting
- **Database**: 28 Prisma models (User, Property, Lead, Lease, Maintenance, Commission, Contract, Transaction, Client, Tenant, Document, Favorite, Viewing, Offer, JobApplication, Communication, Invoice, Expense, and more), 60+ indexes
- **RBAC**: 24 frontend roles aliased to 12 backend roles, 21 permissions, per-endpoint authorization (ADR-002)
- **Design Tokens**: Centralized at src/styles/theme/ — 90+ colors, 26+ typography, 7 spacing (ADR-007)
- **ADRs**: 7 architecture decision records in docs/adr/
- **AI Assistants**: 40 registered in both registries (Nadia=WhatsApp CRM, Clara=Leads, Mary=Inventory, etc.)
- **CRM Layout**: Dual sidebar (left=departments, right=AI assistants), dynamic center, 12 owner tabs
- **Testing**: Vitest + Playwright, load testing framework, accessibility audits
- **DevOps**: Docker, docker-compose, nginx, CI/CD (GitHub Actions → Vercel)

---

---

## 🔧 Improvements Backlog (April 2026 — 38 Items)

> Full audit of the codebase identified **38 specific improvements** across 8 categories.
> All items are documented with problem statement, detailed tasks, and acceptance criteria.
> See [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md) for the master list.

### Phase-by-Phase Assignments

| Phase                | Improvement Items                                                                                                                                                                                                                                                                                                                   | Count |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Phase 1 (Homepage)   | Dynamic OG meta tags (#27), Schema.org JSON-LD (#29)                                                                                                                                                                                                                                                                                | 2     |
| Phase 2 (Portals)    | Complete landlord/tenant portal backend (#9)                                                                                                                                                                                                                                                                                        | 1     |
| Phase 3 (CRM)        | 2FA (#3), AI registry gap (#5), Zod validation (#13), Error format (#15), Pagination (#16), Redux over-fetch (#17), Env validation (#18), Bundle split (#21), JWT refresh (#23), Auth rate limits (#25), Seed secrets (#26), Skeletons (#30), Accessibility (#31), Mobile CRM sidebar (#32), Lead scoring (#34), Audit log UI (#37) | 16    |
| Phase 4 (WhatsApp)   | WhatsApp real API (#1), Email templates (#8), Real-time notifications (#12)                                                                                                                                                                                                                                                         | 3     |
| Phase 5 (Lease)      | Stripe payments (#2), DB connection pooling (#22), Mortgage calculator backend (#35), Calendar integration (#36)                                                                                                                                                                                                                    | 4     |
| Phase 6 (Compliance) | Job scheduler/cron (#6), Image upload + cloud storage (#11), Image optimization pipeline (#20), Auto sitemap (#28)                                                                                                                                                                                                                  | 4     |
| Phase 7 (Analytics)  | PDF/Excel document generation (#7), Virtual tour viewer (#10), Redis response caching (#19), Multi-currency rates (#38)                                                                                                                                                                                                             | 4     |
| Phase 8 (Arabic RTL) | Arabic translations + RTL layout (#4)                                                                                                                                                                                                                                                                                               | 1     |
| Phase 9 (RBAC)       | API versioning (#14), CSRF protection (#24)                                                                                                                                                                                                                                                                                         | 2     |
| Phase 10 (PWA)       | PWA manifest + service worker (#33)                                                                                                                                                                                                                                                                                                 | 1     |

### Category Files

| Category                       | File                                                                         | Items |
| ------------------------------ | ---------------------------------------------------------------------------- | ----- |
| 🔴 Critical / Broken           | [IMPROVEMENTS_CRITICAL.md](./IMPROVEMENTS_CRITICAL.md)                       | 5     |
| 🟠 Incomplete Features         | [IMPROVEMENTS_INCOMPLETE_FEATURES.md](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) | 7     |
| 🟡 Architecture & Code Quality | [IMPROVEMENTS_ARCHITECTURE.md](./IMPROVEMENTS_ARCHITECTURE.md)               | 6     |
| 🟢 Performance & Scalability   | [IMPROVEMENTS_PERFORMANCE.md](./IMPROVEMENTS_PERFORMANCE.md)                 | 4     |
| 🔵 Security                    | [IMPROVEMENTS_SECURITY.md](./IMPROVEMENTS_SECURITY.md)                       | 4     |
| 🌐 SEO & Marketing             | [IMPROVEMENTS_SEO.md](./IMPROVEMENTS_SEO.md)                                 | 3     |
| 📱 UX & Accessibility          | [IMPROVEMENTS_UX.md](./IMPROVEMENTS_UX.md)                                   | 4     |
| 📊 Business & Product          | [IMPROVEMENTS_PRODUCT.md](./IMPROVEMENTS_PRODUCT.md)                         | 5     |

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
