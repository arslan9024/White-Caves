# White Caves Real Estate — Master Plan

> **Single Source of Truth** — Updated April 10, 2026  
> **Goal**: #1 Real Estate Platform in Dubai  
> **Status**: 85% Overall · Phase 1 at 40% · Phase 2 planned  
> **`as any` in production**: ~39 (mostly tests; 0 in core business logic)

---

## ✅ Completed Phases

| Phase        | Description                                        | Status      | Date     |
| ------------ | -------------------------------------------------- | ----------- | -------- |
| Phase A1     | TypeScript Migration (strict mode, 0 errors)       | ✅ COMPLETE | Feb 2026 |
| Phase A2     | WhatsApp Integration Service (7 routes, Redis)     | ✅ COMPLETE | Feb 2026 |
| Phase 16     | Code Quality & DevOps Hardening (ESLint, Prettier) | ✅ COMPLETE | Mar 2026 |
| Rounds 1-147 | Deep Codebase Audits (security, type safety, a11y) | ✅ COMPLETE | Mar 2026 |

---

## ⏳ Current Transformation (March 2026)

### Phase 0: Root File Cleanup ✅ COMPLETE

- [x] Moved 25+ root .md files to /plans/ and /archives/
- [x] Only README.md remains at root
- [x] Consolidated MASTER_PLAN into single source of truth

### Phase 0.2: Business Documentation → `business_docs/` ⏳ 80% COMPLETE

- [x] Fix duplicate folder numbering (renumbered 01–11 + archives)
- [x] Merge /business/ content INTO /business_docs/ (canonical name) — old /business/ deleted
- [ ] _DEFERRED_: Create 09_user_roles_permissions/ (24 frontend roles → 12 backend roles, 21 permissions, alias mapping documented in ADR-002)
- [ ] _DEFERRED_: Create 10_design_system/ (design tokens, colors, typography, breakpoints)
- [ ] _DEFERRED_: Create individual AI assistant .md files (24 assistants)
- [ ] _DEFERRED_: Add Dubai-specific docs (RERA, Ejari, portal integrations)

### Phase 0.5: Duplicate Elimination & Freelancer Removal ✅ COMPLETE

- [x] Remove freelancer references from production code (mapped to `affiliated_agent` in roles.ts)
- [x] Consolidate duplicate components: deleted dead Button, Modal, Card, Input, Select from `ui/` + `design-system/`
- [x] Redirected Modal imports to canonical `shared/components/ui/Modal/`
- [x] Cleaned barrel exports (`ui/index.ts`, `design-system/index.ts`)
- [x] Deleted dead Modal test file
- [x] Dead code cleanup: AIAssistantCRUD chain (6 files), CreateTenancyAgreement, sessionManager.ts, common/forms/ (14 components), design-system/Radio/
- [x] Dead CSS cleanup: component-utilities.css, MainNavBar.css
- [x] Stale log cleanup: 22 .txt files (2.1MB) + \_build_logs/ (0.9MB) deleted from root
- [x] Cleaned dead Vite chunk config (GracePMODashboard_NEW, IsabelPropertyCRM_NEW)
- [ ] _DEFERRED_: Unify CSS approach (standardize on styled-components)

### Phase 0.75: Dashboard & Layout Compliance ✅ COMPLETE

- [x] Audit CRM dual-sidebar layout — SidebarContainer + AIAssistantsPanel both active, responsive at 1024px/768px
- [x] Removed dead `commissions` tab from lion/owner/secondary-sales-agent (feature removed)
- [x] Added tab mappings for ALL 26 roles (was 8/26 → now 26/26)
- [x] Fixed `getRoleInfo()` fallback — shows humanized role name instead of "Unknown Role"
- [x] Verified all 12 super-user tabs, role-specific views for existing roles
- [x] Responsive sidebar collapse on mobile/tablet confirmed (media queries at 1024px, 768px)
- [ ] Note: DualSidebarLayout component ~~exists but is unused~~ DELETED (custom CSS layout used instead)

### Phase 1a: Rename WhatsApp AI Assistant ✅ COMPLETE

- [x] Rename "Linda" → "Nadia" across 100+ references (~25 source files)
- [x] Rename `LindaWhatsAppCRM_NEW/` folder → `NadiaWhatsAppCRM/`
- [x] Update assistantRegistry, businessModel, Redux slices, dashboard, CSS, business_docs

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
- **DevOps**: Docker, docker-compose, nginx, K8s manifests, CI/CD ready

---

## 📝 Archive Reference

Previous MASTER_PLAN versions:

- `/archives/MASTER_PLAN.md` (March 6, 2026 — superseded)
- `/plans/MASTER_PLAN_UPDATED_FEB_2026.md` (Feb 2026 — superseded)

Audit reports with pending security fixes:

- `/plans/audit-round-66.md` (16 findings, 4 critical)
- `/plans/audit-round-69.md` (18 findings, 3 critical)
- `/plans/audit-round-70.md` (18 findings, 2 critical)
