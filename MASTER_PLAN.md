# MASTER PLAN – White Caves
**Last Updated:** 2026-04-26  
**Progress:** Foundation ✅ · Phase 1 (Homepage) 🚧 · Phase 2 (Landlord/Tenant Portals) 🔲  
**Priority Reset:** Homepage (Phase 1) → Landlord/Tenant Portals (Phase 2) → Full CRM (Phase 3) → Deferred (Phases 4–8) → RBAC (Phase 9) → PWA (Phase 10)

> **Active phase plans:** See `/plans/` for detailed task lists per phase.  
> **Business docs:** `/business_docs/` (canonical business documentation).  
> **Research docs:** `/business/08_market_research/` (competitor analysis, regulations, technology upgrades).  
> **Architecture decisions:** `/docs/adr/` (7 ADRs).

---

## 🔢 PRIORITY ORDER

| Priority | Phase | Goal | Plan File |
|----------|-------|------|-----------|
| **#1 — Now** | Phase 1 | Public Homepage — full UI with dummy data | [PHASE_1_HOMEPAGE.md](./plans/PHASE_1_HOMEPAGE.md) |
| **#2 — Next** | Phase 2 | Landlord & Tenant Self-Service Portals — simple client-facing login | [PHASE_2_LANDLORD_TENANT.md](./plans/PHASE_2_LANDLORD_TENANT.md) |
| **#3 — High** | Phase 3 | Full CRM — all tabs for `arslanmalikgoraha@gmail.com` (managing_director) | [PHASE_3_CRM_SUPERUSER.md](./plans/PHASE_3_CRM_SUPERUSER.md) |
| **#4–10** | Phases 4–10 | WhatsApp, Compliance, Arabic, RBAC (Phase 9), PWA, etc. | [PHASE_3_AND_BEYOND.md](./plans/PHASE_3_AND_BEYOND.md) |

---

## 👤 Super User

| Detail | Value |
|--------|-------|
| Email | `arslanmalikgoraha@gmail.com` |
| Role | `managing_director` |
| Seed account | `owner@whitecaves.ae` / role `owner` — dummy data only, not the primary super user |

> Run `npm run db:seed` to create both accounts. Never create a second `managing_director` for `arslanmalikgoraha@gmail.com`.

---

## ✅ Foundation Complete (Do Not Re-Do)

- **Phase 0:** `/plans` folder created, root .md files organized.
- **Phase 0.2:** `/business_docs/` created with 98+ files — RERA, Ejari, WhatsApp, multi-currency, 24 AI assistant profiles, 15 sections.
- **Phase 0.5:** Duplicate components removed, dead code cleaned (~190KB), freelancer refs mapped to `affiliated_agent`.
- **Phase 0.75:** CRM dual-sidebar audited, all 29 role tab-mappings verified, responsive collapse confirmed.
- **Phase 1a:** WhatsApp assistant renamed Linda → **Nadia** across 100+ references.
- **Phase 0.6:** Design tokens, component library, AppLayout, Redux slices, SEO/a11y, bundle optimization.
- **Phase 0.8:** AI Assistant API (`/api/assistants`) with XSS protection, AssistantPlanEditor, AssistantPlanView.

---

## 🚧 Active Work

### Phase 1 — Homepage (Priority #1)
See full task list: [plans/PHASE_1_HOMEPAGE.md](./plans/PHASE_1_HOMEPAGE.md)

Key remaining tasks:
- [ ] Featured Properties section visible on homepage (using `HOME_PROPERTIES` dummy data)
- [ ] All section images load correctly (no broken Unsplash URLs)
- [ ] Mobile responsiveness audit at 375px / 768px
- [ ] Contact form shows success state on submit
- [ ] Lighthouse Performance > 90

### Phase 2 — Landlord & Tenant Portals (Priority #2)
See full task list: [plans/PHASE_2_LANDLORD_TENANT.md](./plans/PHASE_2_LANDLORD_TENANT.md)

Key remaining tasks:
- [ ] `/landlord-portal` page with properties, tenants, payments, maintenance tabs
- [ ] `/tenant-portal` page with lease, payments, maintenance, documents tabs
- [ ] Role-based redirect: `landlord` → `/landlord-portal`, `tenant` → `/tenant-portal`
- [ ] `arslanmalikgoraha@gmail.com` (managing_director) signs in → CRM dashboard
- [ ] Add `landlord@whitecaves.ae` and `tenant@whitecaves.ae` to seed

### Phase 3 — Full CRM Super User (Priority #3)
See full task list: [plans/PHASE_3_CRM_SUPERUSER.md](./plans/PHASE_3_CRM_SUPERUSER.md)

Key remaining tasks:
- [ ] Sign-in flow end-to-end: `arslanmalikgoraha@gmail.com` → dashboard
- [ ] All 8 CRM tabs navigate without crashing
- [ ] Properties/Leads/Agents/Users CRUD all work
- [ ] All 13 AI assistant dashboards render without errors
- [ ] Analytics charts render with real or dummy data

---

## 📊 Latest Audit (April 10, 2026)


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

## 🔲 Deferred Phases

Backend integrations, WhatsApp real API, compliance, Arabic RTL, RBAC, and PWA are deferred.  
See: [plans/PHASE_3_AND_BEYOND.md](./plans/PHASE_3_AND_BEYOND.md)

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

## Strict Policies (For Every Merge)

- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test:run`)
- [ ] No `any`, TypeScript strict mode
- [ ] Error boundaries on all lazy-loaded components
- [ ] Design tokens used (gold/dark theme — no hardcoded colors)
- [ ] WCAG 2.1 AA minimum (Accessibility Lighthouse > 90)

---

## Reference

- `/plans/PHASE_1_HOMEPAGE.md` — Homepage detailed task list
- `/plans/PHASE_2_LANDLORD_TENANT.md` — Landlord & Tenant portals task list
- `/plans/PHASE_3_CRM_SUPERUSER.md` — Full CRM for managing_director (Phase 3)
- `/plans/PHASE_3_AND_BEYOND.md` — All deferred phases (WhatsApp, Compliance, Arabic, RBAC Phase 9, PWA)
- `/business_docs/` — business requirements, AI assistant profiles, design system, roles
- `/docs/adr/` — Architecture Decision Records
- `/business/` — Research-driven business docs: competitor analysis, regulations, technology upgrades, new AI assistants
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
