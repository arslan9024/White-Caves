# White Caves — Improvements Backlog

> **Created**: April 29, 2026  
> **Source**: Full codebase audit — 38 improvements identified across 8 categories  
> **Status**: Planned — assigned to Phases 3–10  
> **Canonical Master Plan**: [`MASTER_PLAN.md`](./MASTER_PLAN.md)

---

## Purpose

This file is the single consolidated backlog of all improvements identified during the April 2026 codebase audit.
Each item includes: what the problem is, what needs to be done, and which phase it belongs to.

For category-specific deep dives, see the linked detail files:

| Category | File | Count |
|---|---|---|
| 🔴 Critical / Broken | [IMPROVEMENTS_CRITICAL.md](./IMPROVEMENTS_CRITICAL.md) | 5 |
| 🟠 Incomplete Features | [IMPROVEMENTS_INCOMPLETE_FEATURES.md](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) | 7 |
| 🟡 Architecture & Code Quality | [IMPROVEMENTS_ARCHITECTURE.md](./IMPROVEMENTS_ARCHITECTURE.md) | 6 |
| 🟢 Performance & Scalability | [IMPROVEMENTS_PERFORMANCE.md](./IMPROVEMENTS_PERFORMANCE.md) | 4 |
| 🔵 Security | [IMPROVEMENTS_SECURITY.md](./IMPROVEMENTS_SECURITY.md) | 4 |
| 🌐 SEO & Marketing | [IMPROVEMENTS_SEO.md](./IMPROVEMENTS_SEO.md) | 3 |
| 📱 UX & Accessibility | [IMPROVEMENTS_UX.md](./IMPROVEMENTS_UX.md) | 4 |
| 📊 Business & Product | [IMPROVEMENTS_PRODUCT.md](./IMPROVEMENTS_PRODUCT.md) | 5 |
| **Total** | | **38** |

---

## Phase Assignment Summary

| # | Improvement | Category | Phase |
|---|---|---|---|
| 1 | WhatsApp Integration — fully stubbed | 🔴 Critical | Phase 4 |
| 2 | Stripe Payments — returns 503 | 🔴 Critical | Phase 5 |
| 3 | 2FA — returns 501 | 🔴 Critical | Phase 3 |
| 4 | Arabic / RTL — no `ar` key in translations | 🔴 Critical | Phase 8 |
| 5 | AI Assistant Registry gap (10 missing) | 🔴 Critical | Phase 3 |
| 6 | No Job Scheduler / Cron | 🟠 Incomplete | Phase 6 |
| 7 | Document Generation — no PDF engine | 🟠 Incomplete | Phase 7 |
| 8 | Email Service — templates incomplete | 🟠 Incomplete | Phase 4 |
| 9 | Landlord/Tenant Portal — Phase 2 in progress | 🟠 Incomplete | Phase 2 |
| 10 | Virtual Tour / VR — UI only | 🟠 Incomplete | Phase 7 |
| 11 | Property Image Upload — no cloud storage | 🟠 Incomplete | Phase 6 |
| 12 | Notifications — no real-time delivery | 🟠 Incomplete | Phase 4 |
| 13 | No Request Validation Library (Zod) | 🟡 Architecture | Phase 3 |
| 14 | No API Versioning | 🟡 Architecture | Phase 9 |
| 15 | Inconsistent Error Response Format | 🟡 Architecture | Phase 3 |
| 16 | No Pagination on Heavy List Endpoints | 🟡 Architecture | Phase 3 |
| 17 | Redux State Over-Fetching | 🟡 Architecture | Phase 3 |
| 18 | Missing Env Variable Validation at Startup | 🟡 Architecture | Phase 3 |
| 19 | No Response Caching (Redis) | 🟢 Performance | Phase 7 |
| 20 | No Image Optimization Pipeline | 🟢 Performance | Phase 6 |
| 21 | Bundle Size — no code splitting audit | 🟢 Performance | Phase 3 |
| 22 | No DB Connection Pooling Config | 🟢 Performance | Phase 5 |
| 23 | JWT Refresh Token Flow Missing | 🔵 Security | Phase 3 |
| 24 | No CSRF Protection | 🔵 Security | Phase 9 |
| 25 | Rate Limiting — only global, not per-route | 🔵 Security | Phase 3 |
| 26 | Secrets in Seed File | 🔵 Security | Phase 3 |
| 27 | Dynamic OG Meta Tags for Properties | 🌐 SEO | Phase 1 |
| 28 | Sitemap Not Auto-Generated | 🌐 SEO | Phase 6 |
| 29 | No Schema.org Structured Data | 🌐 SEO | Phase 1 |
| 30 | No Loading Skeleton Screens | 📱 UX | Phase 3 |
| 31 | Accessibility Gaps (WCAG 2.1 AA) | 📱 UX | Phase 3 |
| 32 | Mobile CRM Sidebar collapses poorly | 📱 UX | Phase 3 |
| 33 | PWA — no groundwork laid | 📱 UX | Phase 10 |
| 34 | Lead Scoring Not Auto-Triggered | 📊 Product | Phase 3 |
| 35 | Mortgage Calculator — frontend math only | 📊 Product | Phase 5 |
| 36 | No Calendar Integration | 📊 Product | Phase 5 |
| 37 | No Audit Log UI | 📊 Product | Phase 3 |
| 38 | Multi-currency — no live exchange rates | 📊 Product | Phase 7 |

---

## Quick Phase-by-Phase View

### Phase 1 (Homepage) — 2 items
- #27 Dynamic OG meta tags per property detail page
- #29 Schema.org JSON-LD structured data for property listings

### Phase 2 (Landlord/Tenant Portals) — 1 item
- #9 Complete landlord/tenant portal backend integration

### Phase 3 (CRM Full — Managing Director) — 10 items
- #3 2FA implementation (TOTP)
- #5 AI assistant registry — register missing 10 assistants
- #13 Add Zod request validation to all routes
- #15 Standardize error response format
- #16 Enforce pagination on all list endpoints
- #17 Redux — replace full-dataset fetches with paginated server queries
- #18 Startup env variable validation
- #21 Bundle code-splitting audit (Vite `manualChunks`)
- #23 JWT refresh token + httpOnly cookie
- #25 Per-route stricter rate limits (auth endpoints)
- #26 Move seed credentials to `.env` variables
- #30 Skeleton loading screens
- #31 WCAG 2.1 AA accessibility audit + fixes
- #32 Mobile CRM sidebar drawer pattern
- #34 Lead scoring auto-triggered on Lead mutations
- #37 Audit log UI tab in CRM

### Phase 4 (WhatsApp Integration) — 2 items
- #1 WhatsApp real Meta Cloud API implementation
- #8 Email service — wire all domain events to email templates
- #12 Real-time notifications (Socket.io or SSE)

### Phase 5 (Lease & Tenancy) — 3 items
- #2 Stripe payment processing
- #22 DB connection pooling configuration
- #35 Mortgage calculator backend with EIBOR rates
- #36 Google Calendar integration for viewing confirmations

### Phase 6 (Compliance & Regulatory) — 3 items
- #6 Job scheduler / cron (`node-cron`)
- #11 Property image upload (Multer + Cloudinary/S3)
- #20 Image optimization pipeline (WebP, responsive sizes)
- #28 Automated sitemap regeneration on property publish

### Phase 7 (Analytics & Portal Syndication) — 3 items
- #7 Document generation — PDFKit/Puppeteer + ExcelJS
- #10 Virtual tour — integrate Pannellum or Matterport SDK
- #19 Response caching (Redis)
- #38 Multi-currency live exchange rates

### Phase 8 (Arabic RTL & i18n) — 1 item
- #4 Arabic `ar` key in translations + RTL layout

### Phase 9 (Multi-User RBAC) — 2 items
- #14 API versioning (`/api/v1/`)
- #24 CSRF protection

### Phase 10 (PWA) — 1 item
- #33 PWA groundwork (`manifest.json` + service worker)

---

*See individual category files for full implementation details, acceptance criteria, and dependencies.*
