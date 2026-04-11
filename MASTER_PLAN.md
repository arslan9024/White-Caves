# MASTER PLAN – White Caves

**Last Updated:** 2026-04-11  
**Progress:** █████████░ 88% (Phase 0–0.8 done; Phase 1 at 40%; Phase 2 Research complete; Phase 2 Implementation planned)  
**Target:** 400% platform improvement → #1 Dubai real estate platform  
**Strict policies enforced.**

> **Reference:** For the full historical plan, see `/plans/MASTER_PLAN.md`.  
> **Business docs:** `/business_docs/` (canonical business documentation).  
> **Research docs:** `/business/08_market_research/` (competitor analysis, regulations, technology upgrades).  
> **Architecture decisions:** `/docs/adr/` (7 ADRs).

---

## Latest Audit (April 10, 2026)

| Metric            | Result                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite Build**    | ✅ Passes (17.86s, 0 errors)                                                                                                                                                |
| **TypeScript**    | ✅ 0 errors (`tsc --noEmit`)                                                                                                                                                |
| **Unit Tests**    | ✅ 309 files, 7,744 tests — all passing                                                                                                                                     |
| **E2E Tests**     | 11 spec files (commission, dashboard, auth, a11y, performance)                                                                                                              |
| **npm audit**     | ⚠️ 7 vulnerabilities (1 critical, 5 high, 1 moderate) — fixable via `npm audit fix`                                                                                         |
| **Server Routes** | 20+ full CRUD routes, 8 stub endpoints (501/503)                                                                                                                            |
| **RBAC**          | ✅ Enforced on all authenticated routes (12 roles, 20+ permissions)                                                                                                         |
| **Design System** | 15 components (Alert, Avatar, Badge, Button, Card, Checkbox, Input, etc.)                                                                                                   |
| **Prisma Models** | 15 models (User, Property, Lead, Activity, Transaction, Tenant, Commission, Favorite, SavedSearch, Viewing, Offer, Lease, Maintenance, NadiaConversation + Message + Queue) |
| **i18n**          | English complete (523 lines), Arabic partial (3 sections)                                                                                                                   |
| **OpenAPI**       | 10 paths documented (needs expansion to 30+)                                                                                                                                |

---

## ✅ Completed Phases

- **Phase 0:** `/plans` created, root .md files moved, tasks extracted.
- **Phase 0.2:** `/business_docs/` created (98 files, 15 sections), researched, all department docs in place (RERA, Ejari, WhatsApp, multi-currency). 24 AI assistant profiles documented.
- **Phase 0.5:** Duplicate components removed, Mongoose/Prisma models consolidated, dead code cleaned (~190KB removed), freelancer refs mapped to `affiliated_agent`.
- **Phase 0.75:** CRM dual-sidebar audited, all 26 role tab-mappings verified, responsive collapse confirmed.
- **Phase 1a:** WhatsApp assistant renamed Linda → **Nadia** across 100+ references.
- **Phase 0.6:** Design tokens, component library, AppLayout (TopBar + SidebarContainer + RightPanelContainer), Redux slices (sidebar, aiAssistantDashboard, navigation), public site SEO/a11y, bundle optimization.
- **Phase 0.8:** AI Assistant API — `GET/POST/PUT/DELETE /api/assistants` + `GET /api/assistants/:id/plan` with auth, path validation, XSS sanitisation. Frontend service + Redux async thunks (`fetchAssistantPlan`). `AssistantPlanView` component. Admin `AssistantPlanEditor` (super-user only). ADR-002 written.

---

## ⏳ Phase 1 — Current (40%)

- [x] 1a. Rename WhatsApp assistant → Nadia
- [x] SEO & a11y (meta/OG/JSON-LD, form labels, aria, dynamic titles)
- [x] Bundle optimization (lazy-loading, code-splitting, inline skeleton)
- [x] Auth system complete (JWT + bcrypt + authMiddleware on all /api routes)
- [x] RBAC middleware fully enforced (requireRole, requirePermission on every route)
- [x] Error handling (centralized AppError, asyncHandler, structured 422 validation)
- [x] Rate limiting (5 limiters: api, auth, register, password, strict)
- [x] Input validation & XSS sanitization on all POST/PATCH handlers
- [x] Security hardening (Helmet CSP, CORS whitelist, timing-safe webhooks, body limit 1MB)
- [x] Structured server logging (logger with levels, context-aware formatting)
- [ ] 1. WhatsApp recovery: LocalAuth, auto-reconnect, heartbeat
- [ ] 2. E2E testing: expand Playwright to cover all critical flows
- [ ] 3. File uploads: Multer middleware + S3/local storage integration
- [ ] 4. Bugs: webhook timeout (async), WhatsApp dedup
- [ ] 5. Design polish: full Phase 0.6 compliance audit
- [ ] 6. Expand OpenAPI spec (currently 10 paths, needs 30+)
- [ ] 7. Deployment: Vercel env vars verified, rollback plan documented

---

## 🔬 Phase 2A — Research Implementation (400% Improvement Plan)

> Derived from deep online research conducted April 11, 2026. See `/business/08_market_research/` for full findings.

### Research Topics Completed

- [x] **Dubai real estate regulations** — RERA, Ejari, TRN, escrow accounts, commission caps, licensing
- [x] **Competitor analysis** — PropertyFinder, Bayut, Dubizzle, Yardi, RealCube: features, gaps, positioning
- [x] **WhatsApp Business API** — Automation, templates, two-way messaging, CRM integration, compliance
- [x] **AI assistants in real estate** — Lead scoring, automated follow-ups, document generation, market analysis
- [x] **Multi-currency & payment gateways** — AED/USD/GBP/EUR; Stripe + Checkout.com dual integration
- [x] **MongoDB performance** — Sharding, compound indexes, geospatial indexes, aggregation pipelines
- [x] **Design trends** — 3D tours, AR/VR, WCAG AAA accessibility, luxury UI motion design
- [x] **Security & compliance** — GDPR, UAE PDPL, audit logging, rate limiting, DDoS protection
- [x] **Deployment & scaling** — Vercel vs AWS, CDN, Redis caching, load testing, backup strategies
- [x] **Lead generation & marketing** — SEO schema markup, Google Ads, email drips, social media APIs

### New Documents Created

| Document | Location | Content |
|----------|----------|---------|
| Competitor Analysis | `/business/08_market_research/competitor_analysis.md` | 5 competitors, feature matrix, gap analysis, revenue projections |
| Dubai Regulations | `/business/08_market_research/dubai_regulations.md` | RERA, Ejari, TRN, escrow, AML/KYC checklists |
| Technology Upgrades | `/business/08_market_research/technology_upgrades.md` | Elasticsearch, Redis, GraphQL, S3, WebSocket, SendGrid |
| Lead Scoring Bot (Archer) | `/business/04_ai_assistants/lead_scoring_bot.md` | Multi-signal scoring, ML roadmap, API design |
| Document Generator (Quill) | `/business/04_ai_assistants/document_generator.md` | Smart templates, compliance validation, e-signatures |
| Market Analyst (Oracle) | `/business/04_ai_assistants/market_analyst.md` | CMA, price forecasting, market intelligence |
| Expanded Roles | `/business/09_user_roles_permissions/expanded_roles.md` | 5 new roles, 53 new permissions |
| AR/VR & 3D Tours | `/business/10_design_system/ar_vr_3d_tours.md` | Tour components, panorama, AR staging, VR walkthrough |
| i18n Tokens | `/business/10_design_system/internationalization_tokens.md` | 7 locales, token structure, currency/date formatting |

### Implementation Priorities (400% Improvement Roadmap)

#### Q2 2026 — Search & Performance (Target: +120%)

- [ ] **Elasticsearch integration** — Property search, autocomplete, faceted filters (6 weeks)
- [ ] **Redis caching layer** — API cache, sessions, rate limiting (2.5 weeks)
- [ ] **MongoDB optimization** — Compound indexes, geospatial, aggregation pipelines (1.5 weeks)
- [ ] **Payment processing** — Stripe + Checkout.com dual gateway (3 weeks)

#### Q3 2026 — Features & Marketing (Target: +150%)

- [ ] **Portal syndication** — XML/API feeds for PropertyFinder, Bayut (3 weeks)
- [ ] **3D virtual tours** — Matterport integration, 360° panoramas (2.5 weeks)
- [ ] **Email marketing** — SendGrid integration, drip campaigns, analytics (4 weeks)
- [ ] **SEO overhaul** — Schema markup, dynamic sitemaps, Google Ads tracking (3 weeks)
- [ ] **AI Lead Scoring (Archer)** — Rule-based scoring engine with real-time alerts (4 weeks)

#### Q4 2026 — AI, Mobile & i18n (Target: +130%)

- [ ] **Complete Arabic i18n** — Full translations, RTL layout, locale-aware formatting (4 weeks)
- [ ] **Document Generator (Quill)** — Smart templates, PDF generation, e-signatures (5 weeks)
- [ ] **Market Analyst (Oracle)** — CMA, price forecasting, market dashboards (6 weeks)
- [ ] **Progressive Web App** — Offline support, push notifications, install prompt (4 weeks)
- [ ] **GraphQL API** — Apollo Server gateway alongside REST (6 weeks)
- [ ] **WebSocket real-time** — Socket.IO for notifications, WhatsApp messages (3 weeks)

### New AI Assistants (3 added, total: 27)

| ID | Name | Department | Role |
|----|------|------------|------|
| archer | Archer | Sales/Analytics | Lead Scoring Bot — Multi-signal scoring, ML-based prioritization |
| quill | Quill | Legal/Operations | Document Generator — Smart templates, compliance validation |
| oracle | Oracle | Analytics/Executive | Market Analyst — CMA, price forecasting, market intelligence |

### New Roles (5 added, total: 27)

| Role | Category | Key Permissions |
|------|----------|----------------|
| `compliance_officer` | Compliance | RERA licensing, Trakheesi, Ejari, KYC/AML |
| `marketing_manager` | Marketing | Campaigns, SEO, social media, budget |
| `market_researcher` | Analytics | Market data, CMA, forecasting |
| `it_admin` | Technology | System health, logs, config, backup |
| `document_controller` | Operations | Templates, generation, signatures |

---

## 📋 Phase 2B — Production Hardening (Improvements)

### 2.1 Stub Endpoints → Full Implementation

- [ ] **Contracts CRUD** — Prisma model + full /api/contracts endpoints (currently 501)
- [ ] **Job Applications CRUD** — JobApplication model exists but /api/job-applications returns 501
- [ ] **Appointments CRUD** — Prisma model + /api/appointments (currently 501)
- [ ] **Tenancy Agreements CRUD** — /api/tenancy-agreements endpoints (currently 501)
- [ ] **Payment Processing** — Stripe SDK integration for /api/payments/create-payment-intent (currently 503)
- [ ] **Property Valuation** — ML model integration for /api/valuation/estimate (currently 501)
- [ ] **Role Requests** — /api/role-requests for self-service role management (currently 501)

### 2.2 File Upload System

- [ ] Install & configure Multer middleware for multipart uploads
- [ ] S3 / Cloud Storage integration (property photos, documents, agent profiles)
- [ ] File validation (size limit, MIME type, virus scanning)
- [ ] Image optimization pipeline (resize, WebP conversion)

### 2.3 CRM Module Backend Integration

- [ ] Connect SophiaSalesCRM to real API (currently mock data)
- [ ] Connect DaisyLeasingCRM to real API (currently mock data)
- [ ] Connect OliviaMarketingCRM to real API (currently mock data)
- [ ] Connect MaryInventoryCRM to real API (currently mock data)
- [ ] Connect NancyHRCRM to real API (currently mock data)
- [ ] Connect ZoeExecutiveCRM to real API (currently mock data)
- [ ] Connect AuroraCTODashboard to real API (currently mock data)
- [ ] Connect HazelFrontendCRM to real API (currently mock data)
- [ ] Connect WillowBackendCRM to real API (currently mock data)

### 2.4 Internationalization (i18n)

- [ ] Install react-i18next and configure language detection
- [ ] Complete Arabic translations (currently only 3 sections)
- [ ] Add language selector UI component
- [ ] RTL layout support for Arabic
- [ ] Date/number/currency formatting per locale

### 2.5 API Documentation & Developer Experience

- [ ] Expand OpenAPI spec to cover all 30+ endpoints
- [ ] Add Swagger UI endpoint (`/api-docs`)
- [ ] Set up Storybook for design system components (15 components)
- [ ] Auto-validate API responses against OpenAPI schema in tests

### 2.6 Monitoring & Observability

- [ ] Add Prometheus metrics endpoint (`/metrics`)
- [ ] Integrate error tracking (Sentry or LogRocket)
- [ ] Database query performance monitoring
- [ ] Add structured request tracing (correlation IDs)
- [ ] Alerting rules for error rates > threshold

### 2.7 Security Hardening

- [ ] Fix npm audit vulnerabilities (7 total: lodash, path-to-regexp, picomatch, vite)
- [ ] Implement 2FA (Twilio SMS or TOTP) — auth route placeholder exists
- [ ] Configure firebase-admin SDK for Firebase sync endpoint (currently 503)
- [ ] Add HTTPS redirect enforcement for production
- [ ] API key rotation documentation
- [ ] Circuit breaker for external API calls (WhatsApp, Stripe, Firebase)

### 2.8 Testing Expansion

- [ ] Vitest coverage target: 50%+ (currently running 7,744 tests across 309 files)
- [ ] Add test factories for common test data creation
- [ ] Playwright E2E: full critical path coverage (auth → listing → offer → transaction)
- [ ] Security tests: XSS/injection edge cases, rate limiter bypass attempts
- [ ] Load testing: concurrent operations, stress tests
- [ ] Database transaction edge case tests

### 2.9 DevOps & CI/CD

- [ ] GitHub Actions CI pipeline (lint → typecheck → test → build → deploy)
- [ ] Docker multi-stage production build optimization
- [ ] Kubernetes manifests validation (k8s/ and helm/ exist but need testing)
- [ ] Environment-specific configs (dev, staging, production)
- [ ] Automated dependency updates (Dependabot or Renovate)
- [ ] Pre-commit hooks fully operational (husky + lint-staged configured)

### 2.10 Code Quality

- [ ] Eliminate remaining `any` types (~39 instances, mostly in tests and WhatsApp services)
- [ ] Unify CSS approach (standardize on styled-components, reduce CSS module duplication)
- [ ] Remove remaining console.log/console.warn in favor of structured logger
- [ ] Write ADRs for remaining major decisions (i18n choice, file storage, monitoring)

---

## Feature Status Matrix

| Feature                     | Frontend   | Backend | Tests | Status   |
| --------------------------- | ---------- | ------- | ----- | -------- |
| **Auth (JWT + bcrypt)**     | ✅         | ✅      | ✅    | Complete |
| **RBAC (12 roles)**         | ✅         | ✅      | ✅    | Complete |
| **Properties CRUD**         | ✅         | ✅      | ✅    | Complete |
| **Leads CRUD + Scoring**    | ✅         | ✅      | ✅    | Complete |
| **Transactions**            | ✅         | ✅      | ✅    | Complete |
| **Commissions**             | ✅         | ✅      | ✅    | Complete |
| **Tenants**                 | ✅         | ✅      | ✅    | Complete |
| **Viewings**                | ✅         | ✅      | ✅    | Complete |
| **Offers**                  | ✅         | ✅      | ✅    | Complete |
| **Leases**                  | ✅         | ✅      | ✅    | Complete |
| **Maintenance**             | ✅         | ✅      | ✅    | Complete |
| **Favorites**               | ✅         | ✅      | ✅    | Complete |
| **Saved Searches**          | ✅         | ✅      | ✅    | Complete |
| **Reporting/Analytics**     | ✅         | ✅      | ✅    | Complete |
| **Compliance (RERA/DLD)**   | ✅         | ✅      | ✅    | Complete |
| **Communications**          | ✅         | ✅      | ✅    | Complete |
| **AI Assistants API**       | ✅         | ✅      | ✅    | Complete |
| **Nadia WhatsApp CRM**      | ✅         | ✅      | ✅    | Complete |
| **Design System**           | ✅ (15)    | —       | ✅    | Complete |
| **Contracts**               | ✅         | ⚠️ Stub | —     | Phase 2  |
| **Job Applications**        | ✅         | ⚠️ Stub | —     | Phase 2  |
| **Appointments**            | ✅         | ⚠️ Stub | —     | Phase 2  |
| **Payments (Stripe)**       | ✅         | ⚠️ 503  | —     | Phase 2  |
| **Valuation (ML)**          | ✅         | ⚠️ 501  | —     | Phase 2  |
| **File Uploads**            | —          | —       | —     | Phase 2  |
| **i18n (Arabic)**           | ⚠️ Partial | —       | —     | Phase 2  |
| **Swagger UI**              | —          | —       | —     | Phase 2  |
| **Storybook**               | —          | —       | —     | Phase 2  |
| **Monitoring (Prometheus)** | —          | —       | —     | Phase 2  |

---

## Progress Bar

```
[█████████░] 88%
 Phase0 ████  Phase0.2 ████  Phase0.5 ████  Phase0.75 ████
 Phase0.6 ████  Phase0.8 ████  Phase1 ██░░░  Phase2A ████ (Research)
 Phase2B ░░░░░ (Implementation)
```

**Target: 400% improvement achieved through:**
- Search: +120% (Elasticsearch + Redis + MongoDB optimization)
- Features: +150% (3D tours, portal syndication, payments, email marketing)
- AI & i18n: +130% (3 new AI assistants, Arabic i18n, PWA, GraphQL)

**Working features:** 19/28 complete (68% of all features end-to-end)  
**New features planned:** 15 major features from research (Phase 2A)  
**Infrastructure:** Auth, RBAC, security, validation, logging — all complete  
**Research:** 10 topics researched, 9 new documents created  
**Remaining:** Phase 1 completion + Phase 2A/2B implementation

---

## Strict Policies Checklist (merge to main)

- [x] Build passes (`npm run build`) — ✅ verified April 10, 2026
- [x] Tests pass (`npm run test:run`) — ✅ 309 files, 7,744 tests
- [ ] No `any`, TypeScript strict mode — ⚠️ ~39 instances remain (mostly tests)
- [x] Error boundaries + API error handling on all routes
- [x] MongoDB/Prisma validated and indexed (15 models, proper indexes)
- [x] RBAC active (middleware + frontend guards)
- [x] Design tokens used, unified sidebar + top navbar
- [ ] WCAG 2.1 AA, Lighthouse > 90 — needs full audit
- [ ] No half-features — ⚠️ 9 stub endpoints return 501/503
- [x] ADR written for every significant architectural decision (7 ADRs)

---

## Reference

- `/business_docs/` — 120+ files, 15 sections: business requirements, AI assistant profiles, design system, roles
- `/business/` — Research-driven business docs: competitor analysis, regulations, technology upgrades, new AI assistants
- `/docs/adr/` — 7 Architecture Decision Records
- `/plans/` — full historical plan archive and session summaries
- `/openapi.json` — API specification (10 paths, needs expansion)
- `/k8s/`, `/helm/` — Kubernetes deployment manifests

### Research Sources (April 2026)

| Topic | Key Sources |
|-------|-------------|
| RERA/DLD Regulations | [RERA Dubai Guide](https://metropolitan.realestate/blog/guides/rera-dubai-2025-handbook/), [DLD Escrow](https://teslaproperties.ae/blog/policy-regulation-update-what-investors-need-to-know-about-escrow-dld-rera-in-202526) |
| Competitor Analysis | [PropertyFinder](https://www.propertyfinder.ae), [Bayut](https://www.bayut.com), [Dubizzle](https://www.dubizzle.com) |
| WhatsApp API | [WhatsApp Business API Guide 2025](https://replyagent.com/blog/whatsapp-business-api-complete-guide-2025), [Compliance Checklist](https://www.blog.turaingrp.com/whatsapp-business-api-automation-templates-optin-compliance-checklist/) |
| AI in Real Estate | [Orris AI Guide](https://www.orris.ai/blog/ai-automation-for-real-estate-practical-guide), [Real Estate AI Labs](https://www.realestateailabs.com/) |
| Payment Gateways | [Stripe UAE](https://stripe.dev/blog/getting-started-with-stripe-in-the-uae), [Checkout.com Review](https://wise.com/sg/blog/checkout-com-review) |
| MongoDB | [MongoDB Indexing Best Practices](https://www.mongodb.com/company/blog/performance-best-practices-indexing), [Sharding Guide](https://www.percona.com/blog/mongodb-partitioning-best-practices-for-scalability-and-performance/) |
| Security/GDPR | [GDPR Audit Logs](https://logcentral.io/blog/gdpr-and-audit-logs-balancing-security-monitoring-with-privacy-compliance), [GDPR Real Estate](https://examples.tely.ai/compliance-regtech/master-gdpr-compliant-real-estate-software-essential-best-practices/) |
| Lead Generation | [Placester Guide](https://placester.com/real-estate-marketing-academy/real-estate-lead-generation), [Hootsuite Social](https://blog.hootsuite.com/real-estate-social-media/) |
