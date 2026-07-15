# Pending Tasks Only

**Last Updated:** 2026-07-14
**Current Focus:** Wave 22 ✅ Complete; Waves 23–25 planned (full four-artifact bundles available); governance sync active.

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Wave index: [`waves/README.md`](./waves/README.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)
- Progress intelligence: [`ORCHESTRATION_UPGRADE_V4.md`](./ORCHESTRATION_UPGRADE_V4.md)

## Implementation Order

`09 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21 → 22 → 23 → 24 → 25`

Advance only when the prior wave is green, the readiness gate is satisfied, and `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved` has been issued for that wave.

## Wave Status Board

| Stream | Wave    | Objective                                                                                        | Status      | Owners                                                 | Validation Gate                                                                                                                        |
| ------ | ------- | ------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| S1     | 08      | TypeScript/errors stabilization                                                                  | ✅ Green    | @Mira + @Katherine                                     | TypeScript baseline confirmed green                                                                                                    |
| S2     | 09      | UX hardening — loading states, error boundaries, mobile, RTL                                     | ✅ Green    | @Una + @Lea + @Tracy + @Inas                           | Build + lint + targeted tests + tracker sync complete                                                                                  |
| S3     | 10      | Performance + SEO + security uplift                                                              | ✅ Green    | @Ruchi + @Rachel + @Radia + @Katherine                 | Lazy loading, SEO meta/structured-data, CSP, rate-limiting, vite chunks complete                                                       |
| S4     | 11      | Incomplete features + architecture refactor                                                      | ✅ Green    | @Ada + @Mira + @Barbara                                | SchedulerService, DocumentService, email triggers, export routes complete                                                              |
| S5     | 12      | Automation engine (cron + docs + email)                                                          | ✅ Green    | @Cron + @Puppeteer + @Handlebars + @Mira               | Rent reminders, lease-expiry reminders, sitemap refresh, P&L report, export routes complete                                            |
| S6     | 13      | Real-time notifications + media + virtual tour                                                   | ✅ Green    | @Socket + @Cloudinary + @Pannellum + @Mira             | Socket auth + notification service + media pipeline + virtual tour integration completed                                               |
| S7     | 14      | Product features closure                                                                         | ✅ Green    | @LeadScore + @Mortgage + @Zod + @Mira                  | S6 green + readiness 90% + @Ada approval phrase                                                                                        |
| S8     | 15      | Cache + PWA readiness                                                                            | ✅ Green    | @Redis + @PWA + @Ruchi + @Una                          | S7 green + readiness 90% + @Ada approval phrase                                                                                        |
| S9     | 16      | Security hardening + API versioning                                                              | ✅ Green    | @S5 + @Radia + @Mira                                   | S8 green + readiness 60% + @Ada approval phrase                                                                                        |
| S10    | 17      | Full UI/UX luxury upgrade (design tokens + glassmorphism + animations + mobile + PWA + WCAG 2.2) | ✅ Green    | @Una + @Lea + @Tracy + @Africa + @Cyra + @Katherine    | Wave 17 implementation + CI Lighthouse thresholds + accessibility/mobile/PWA checks complete                                           |
| S11    | 18      | Workflow parity audit + benchmark gap backlog                                                    | ✅ Green    | @Ada + @Margaret + @Mira + @Katherine                  | Wave 18 parity matrix finalized + canonical queue updates + `npm run plans:validate`                                                   |
| S12    | 18.1    | Competitor parity execution — Session 1 ✅ complete, Session 2 ✅ complete                       | ✅ Complete | @Ada + @Mira + @Una + @Tracy + @Katherine + @Sofia     | Session 1 + Session 2 tests green + build green + `npm run plans:validate`                                                             |
| S13    | 18.1-S3 | Competitor parity execution — Session 3: 2 deferred P0s + top 8 P1s                              | ✅ Complete | @Ada + @Mira + @Joelle + @Katherine + @Victoria + @Una | Session 3 tests green + build green + `npm run plans:validate`                                                                         |
| S14    | 18.2    | Profile-first post-login journey + Dashboard CTA alignment                                       | ✅ Complete | @Ada + @Mira                                           | `useSignIn` tests green + build green                                                                                                  |
| S15    | 19      | Identity & Access v2, routing, MD workspace split, executive UX                                  | ✅ Complete | @Ada + @Mira + @Una + @Katherine                       | W19-001…W19-015 complete; 142 auth/routing tests green; `npm run plans:validate`                                                       |
| S16    | 20      | RBAC hardening + audit export security + OWASP A01 superuser email fix                           | ✅ Complete | @Mira + @Radia + @Katherine                            | 142 auth tests + 37 activities tests green; `npm run plans:validate`                                                                   |
| S17    | 21      | Finance, UAE VAT, commission engine & compliance reporting                                       | ✅ Complete | @Mira + @Barbara + @Katherine                          | Dubai Finance Engine built, 0-token build passes, schema extended                                                                      |
| S18    | 22      | Market intelligence, off-plan projects, property valuation & advanced analytics                  | ✅ Complete | @Mira + @Barbara + @Cassie                             | Wave 21 green + readiness 60% + @Ada approval phrase; [`WAVE_22_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_22_IMPLEMENTATION_BACKLOG.md) |
| S19    | 23      | Mobile CRM, PWA offline mode & push notifications                                                | 📋 Planned  | @Cyra + @Una + @Mira + @Katherine                      | Wave 22 green + readiness 60% + @Ada approval phrase; [`WAVE_23_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_23_IMPLEMENTATION_BACKLOG.md) |
| S20    | 24      | WhatsApp automation, AI chat engine & in-app notification centre                                 | 📋 Planned  | @Mira + @Joelle + @Una                                 | Wave 23 green + readiness 60% + @Ada approval phrase; [`WAVE_24_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_24_IMPLEMENTATION_BACKLOG.md) |
| S21    | 25      | Portal syndication, careers portal, community management & advanced SEO                          | 📋 Planned  | @Mira + @Barbara + @Una + @Rachel                      | Wave 24 green + readiness 60% + @Ada approval phrase; [`WAVE_25_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_25_IMPLEMENTATION_BACKLOG.md) |

### Wave 19 Closeout (Complete)

- **Wave 19 status:** ✅ Complete
- **Scope delivered:** Identity & Access v2, `/crm` routing consistency, MD workspace split, executive dashboard UX parity, state-system parity, traceability matrix, rollout/rollback thresholds.
- **Evidence:** `WAVE_19_IMPLEMENTATION_BACKLOG.md` (W19-001…W19-015 ✅), `server/routes/reporting.test.ts` (32/32 ✅), `src/utils/routing.test.ts`, `src/utils/authSession.test.ts`, `src/pages/UnifiedDashboardPage.test.tsx`, `npm run plans:validate`.

### Wave 22 Closeout (Complete)

- **Wave 22 status:** ✅ Complete
- **Key deliveries:**
  - W22-001/004: Created bulk AVM refresh service and integrated AVM triggers inside property CRUD workflows (`POST /api/properties`, `PUT /api/properties/:id`, `PATCH /api/properties/:id`) in `server/routes/properties.ts`.
  - Configured and scheduled `avm-refresh-monthly` cron job in `SchedulerService.ts`.
  - Verified and passed all 66 market and analytics unit & route tests.
- **Tests:** Compilation, client build, and route tests verified green with exit code 0.

### Wave 21 Closeout (Complete)

- **Wave 21 status:** ✅ Complete
- **Key deliveries:**
  - W21-001/004: Created comprehensive `src/mocks/dubaiFinanceEngine.ts` containing offline calculations for RERA/DLD commission rules.
  - Calculated 5% rent commission, 2% secondary sale commission, and dynamic 3-8% offplan developer rates.
  - Implemented gamified leaderboard levels (Rising Star up to Elite Chairman's Club) scaling commission splits dynamically (50/50 to 80/20).
  - Wired state reducer transitions for AGENT_SUBMITTED ➔ MANAGER_APPROVED ➔ FINANCE_LOCKED ➔ PAYMENT_RELEASED approval flow.
  - Created 4-hour local memory TTL cache for currency conversions (AED, USD, EUR, GBP, INR).
  - Built forecast cash-flow logic, accounts receivable (AR) aging categories, and budget variance metrics.
  - Extended Prisma schema for Commission model with approval metadata and period locks.
- **Tests:** Compilation and client-side production build verified green with exit code 0.

### Wave 20 Closeout (Complete)

- **Wave 20 status:** ✅ Complete
- **Key deliveries:**
  - W20-001: Audit log CSV/XLSX export re-gated from `view_leads` to `view_audit_logs` (OWASP A01)
  - W20-001 RBAC contract tests: 8 ROLE_PERMISSIONS matrix tests via `vi.importActual`
  - W20-002: compliance mutations (`/reports`, `/brn-check`, `/kyc/documents/:id/review`) now enforce explicit manager+ (`owner/manager/admin/finance`) role guards
  - W20-003: PDPL consent create/revoke/delete mutations now enforce explicit manager+ (`owner/manager/admin/finance`) role guards with agent negative-path coverage
  - OWASP A01 fix: hardcoded superuser email removed from source, moved to env vars `CREATOR_SUPERUSER_EMAIL` / `VITE_CREATOR_SUPERUSER_EMAIL`
  - Lazy evaluation pattern applied so `vi.stubEnv` works correctly in tests
  - `.env.example` updated with both server and client env var keys
- **Tests:** prior Wave 20 auth/activities evidence remains green; focused `server/routes/compliance.test.ts` + `server/routes/activities.test.ts` rerun completed with **exit code 0**; `npm run plans:validate` completed with **exit code 0**

### P0 Business Documentation Wave (Complete)

- **Status:** ✅ Complete (2026-06-19)
- **Delivered artifacts:**
  - `business_docs/08_market_research/damac-hills-2-area-playbook.md` (new)
  - `business_docs/04_workflows/leasing-support-operations-playbook.md` (new)
  - `business_docs/09_crm_features/sentinel-property.md` (stub-to-spec replacement)
  - `business_docs/09_crm_features/maintenance.md` (stub-to-spec replacement)
  - `business_docs/09_crm_features/tenancy-ejari.md` (legal notice taxonomy normalized with `legal-management.md`)
- **Validation evidence:**
  - Markdown diagnostics for all touched business docs: **No errors found**
  - Stub marker sweep (`[Action Required: Enforce production-ready engineering constraints]|awaiting expansion|[Pending specific implementation definition per 90% readiness guidelines]|Stub`) for sentinel/maintenance: **No matches**

## Completed Stream History

| Phase  | Objective                                                                                                                                                                           | Status      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| N+1    | Auth/login hardening + route consistency                                                                                                                                            | ✅ Complete |
| N+2    | Tenant portal live data parity                                                                                                                                                      | ✅ Complete |
| N+3    | Managing-director CRM critical tabs                                                                                                                                                 | ✅ Complete |
| N+4    | Convert top 3 revenue-impact stub endpoints                                                                                                                                         | ✅ Complete |
| N+5    | Test + release hardening                                                                                                                                                            | ✅ Complete |
| N+6    | UI architecture hardening + Arabic RTL readiness                                                                                                                                    | ✅ Complete |
| N+7    | Subagent upgrade: readiness + collaboration mesh                                                                                                                                    | ✅ Complete |
| N+8    | Google social auth hardening + dashboard redirect consistency                                                                                                                       | ✅ Complete |
| N+9    | UX loading-state hardening                                                                                                                                                          | ✅ Complete |
| Repo   | Archive/cleanup pass + canonical planning reset                                                                                                                                     | ✅ Complete |
| S1     | Wave 08 stabilization + governance baseline                                                                                                                                         | ✅ Complete |
| S2     | Wave 09 UX hardening + accessibility/mobile/RTL closeout                                                                                                                            | ✅ Complete |
| S3     | Wave 10 performance + SEO + security uplift                                                                                                                                         | ✅ Complete |
| S4     | Wave 11 incomplete features + architecture refactor                                                                                                                                 | ✅ Complete |
| S5     | Wave 12 automation engine (cron + docs + email)                                                                                                                                     | ✅ Complete |
| S6     | Wave 13 real-time notifications + media + virtual tour                                                                                                                              | ✅ Complete |
| S10    | Wave 17 full UI/UX luxury upgrade                                                                                                                                                   | ✅ Complete |
| S11    | Wave 18 workflow parity audit + gap backlog generation                                                                                                                              | ✅ Complete |
| S11-S1 | Wave 18.1 Session 1: Lead workflow automation + tenant/landlord portals                                                                                                             | ✅ Complete |
| S11-S2 | Wave 18.1 Session 2: Search ranking, facets, map sync, listing trust, WA→lead, funnel, KPI, KYC gate, mobile CRM                                                                    | ✅ Complete |
| S11-S3 | Wave 18.1 Session 3: Offline PWA drafts, cadence engine, lead import, audit log UI, agent report, Nina escalation, e-sign, syndication, follow-up automation, Ejari/rent collection | ✅ Complete |

## S2 — Wave 09: UX Hardening (Complete)

**Source:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) items 30–33  
**Bundle:** [`WAVE_09_SDD.md`](./waves/WAVE_09_SDD.md) | [`WAVE_09_READINESS_PACKET.md`](./waves/WAVE_09_READINESS_PACKET.md) | [`WAVE_09_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_09_IMPLEMENTATION_BACKLOG.md) | [`WAVE_09_TEST_ROLLOUT.md`](./waves/WAVE_09_TEST_ROLLOUT.md)

| Task | Scope                               | Priority | Owner                | Validation                        |
| ---- | ----------------------------------- | -------- | -------------------- | --------------------------------- |
| 9-1  | Skeleton component library          | P0       | @Lea                 | `npm run build` + component tests |
| 9-2  | Apply skeletons to key CRM surfaces | P0       | @Lea + @Una          | `npm run build` + visual check    |
| 9-3  | EmptyState + ErrorBoundary wiring   | P0       | @Una + @Lea          | `npm run build`                   |
| 9-4  | Axe a11y audit + critical fixes     | P1       | @Africa + @Katherine | Axe scan clean                    |
| 9-5  | Mobile CRM drawer for < 768px       | P1       | @Tracy               | Playwright mobile check           |
| 9-6  | RTL layout corrections              | P2       | @Inas                | RTL screenshot review + lint      |
| 9-7  | Axe scan wired into CI              | P2       | @Katherine           | CI green                          |

## S3 — Wave 10: Performance + SEO + Security

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) | [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md) | [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)  
**Bundle:** [`WAVE_10_SDD.md`](./waves/WAVE_10_SDD.md) | [`WAVE_10_READINESS_PACKET.md`](./waves/WAVE_10_READINESS_PACKET.md) | [`WAVE_10_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_10_IMPLEMENTATION_BACKLOG.md) | [`WAVE_10_TEST_ROLLOUT.md`](./waves/WAVE_10_TEST_ROLLOUT.md)

| Task | Scope                                          | Priority | Owner          | Validation             |
| ---- | ---------------------------------------------- | -------- | -------------- | ---------------------- |
| 10-1 | Lighthouse audit + lazy loading                | P0       | @Ruchi         | Lighthouse >= 85       |
| 10-2 | SEO metadata + structured data                 | P0       | @Rachel        | `npm run build`        |
| 10-3 | CSP headers + sanitization + dependency review | P1       | @Radia         | lint + security review |
| 10-4 | Public API rate-limiting hardening             | P2       | @Mira + @Radia | typecheck/lint/build   |

## S4 — Wave 11: Incomplete Features + Architecture Refactor

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) | [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)  
**Bundle:** [`WAVE_11_SDD.md`](./waves/WAVE_11_SDD.md) | [`WAVE_11_READINESS_PACKET.md`](./waves/WAVE_11_READINESS_PACKET.md) | [`WAVE_11_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_11_IMPLEMENTATION_BACKLOG.md) | [`WAVE_11_TEST_ROLLOUT.md`](./waves/WAVE_11_TEST_ROLLOUT.md)

Key closures:

- Scheduler foundations + recurring jobs
- Document generation (PDF/Excel)
- Email trigger wiring
- AppError/service-layer/index-audit refactors

## S5 — Wave 12: Automation Engine

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) items 6–8  
**Bundle:** [`WAVE_12_SDD.md`](./waves/WAVE_12_SDD.md) | [`WAVE_12_READINESS_PACKET.md`](./waves/WAVE_12_READINESS_PACKET.md) | [`WAVE_12_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_12_IMPLEMENTATION_BACKLOG.md) | [`WAVE_12_TEST_ROLLOUT.md`](./waves/WAVE_12_TEST_ROLLOUT.md)

| Task | Scope                                      | Priority | Owner               | Validation                                                                     |
| ---- | ------------------------------------------ | -------- | ------------------- | ------------------------------------------------------------------------------ |
| 12-1 | SchedulerService + cron registration       | P0       | @Mira + @Cron       | `npm run typecheck`                                                            |
| 12-2 | DocumentService PDF/Excel streaming routes | P0       | @Mira + @Puppeteer  | `npm run build`                                                                |
| 12-3 | Handlebars templates + trigger registry    | P1       | @Mira + @Handlebars | focused route tests                                                            |
| 12-4 | Wave closeout validation                   | P0       | @Katherine          | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S6 — Wave 13: Real-Time & Media (Complete)

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) items 10–12  
**Bundle:** [`WAVE_13_SDD.md`](./waves/WAVE_13_SDD.md) | [`WAVE_13_READINESS_PACKET.md`](./waves/WAVE_13_READINESS_PACKET.md) | [`WAVE_13_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_13_IMPLEMENTATION_BACKLOG.md) | [`WAVE_13_TEST_ROLLOUT.md`](./waves/WAVE_13_TEST_ROLLOUT.md)

| Task | Scope                                   | Priority | Owner               | Validation                                                                     |
| ---- | --------------------------------------- | -------- | ------------------- | ------------------------------------------------------------------------------ |
| 13-1 | Socket auth + NotificationService       | P0       | @Mira + @Socket     | socket integration tests                                                       |
| 13-2 | Image upload/storage pipeline           | P0       | @Mira + @Cloudinary | route tests + build                                                            |
| 13-3 | Virtual tour integration + lazy loading | P1       | @Una + @Pannellum   | UI smoke + build                                                               |
| 13-4 | Wave closeout validation                | P0       | @Katherine          | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S7 — Wave 14: Product Features

**Sources:** [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md) items 34–38  
**Bundle:** [`WAVE_14_SDD.md`](./waves/WAVE_14_SDD.md) | [`WAVE_14_READINESS_PACKET.md`](./waves/WAVE_14_READINESS_PACKET.md) | [`WAVE_14_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_14_IMPLEMENTATION_BACKLOG.md) | [`WAVE_14_TEST_ROLLOUT.md`](./waves/WAVE_14_TEST_ROLLOUT.md)

| Task | Scope                                   | Priority | Owner              | Validation                                                                     |
| ---- | --------------------------------------- | -------- | ------------------ | ------------------------------------------------------------------------------ |
| 14-1 | Lead auto-rescore workflow              | P0       | @Mira + @LeadScore | scoring tests                                                                  |
| 14-2 | Audit log UI + filtering/pagination     | P0       | @Una + @LeadScore  | build + component tests                                                        |
| 14-3 | Mortgage API + calendar + FX conversion | P1       | @Mira + @Mortgage  | route/integration tests                                                        |
| 14-4 | Wave closeout validation                | P0       | @Katherine         | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S8 — Wave 15: Cache + PWA Readiness

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) + [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)  
**Bundle:** [`WAVE_15_SDD.md`](./waves/WAVE_15_SDD.md) | [`WAVE_15_READINESS_PACKET.md`](./waves/WAVE_15_READINESS_PACKET.md) | [`WAVE_15_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_15_IMPLEMENTATION_BACKLOG.md) | [`WAVE_15_TEST_ROLLOUT.md`](./waves/WAVE_15_TEST_ROLLOUT.md)

| Task | Scope                                  | Priority | Owner           | Validation                                                                     |
| ---- | -------------------------------------- | -------- | --------------- | ------------------------------------------------------------------------------ |
| 15-1 | Redis cache + DB pooling               | P0       | @Ruchi + @Redis | perf + integration checks                                                      |
| 15-2 | PWA manifest/service worker foundation | P1       | @Una + @PWA     | lighthouse + build                                                             |
| 15-3 | Wave closeout validation               | P0       | @Katherine      | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S9 — Wave 16: Security Hardening + API Versioning

**Sources:** [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md) + [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)  
**Bundle:** [`WAVE_16_SDD.md`](./waves/WAVE_16_SDD.md) | [`WAVE_16_READINESS_PACKET.md`](./waves/WAVE_16_READINESS_PACKET.md) | [`WAVE_16_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_16_IMPLEMENTATION_BACKLOG.md) | [`WAVE_16_TEST_ROLLOUT.md`](./waves/WAVE_16_TEST_ROLLOUT.md)

| Task | Scope                                     | Priority | Owner                | Validation                                                                     |
| ---- | ----------------------------------------- | -------- | -------------------- | ------------------------------------------------------------------------------ |
| 16-1 | `/api/v1` compatibility layer + migration | P0       | @Mira + @S5          | route tests                                                                    |
| 16-2 | CSRF + AppError envelope hardening        | P0       | @Radia + @Mira + @S5 | security tests + typecheck                                                     |
| 16-3 | Wave closeout validation                  | P0       | @Katherine           | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S10 — Wave 17: Full UI/UX Luxury Upgrade (Complete)

**Sources:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) | [`ui-ux-specification.md`](../../business_docs/06_design_architecture/ui-ux-specification.md) (Sections 13–17)  
**Bundle:** [`WAVE_17_SDD.md`](./waves/WAVE_17_SDD.md) | [`WAVE_17_READINESS_PACKET.md`](./waves/WAVE_17_READINESS_PACKET.md) | [`WAVE_17_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_17_IMPLEMENTATION_BACKLOG.md) | [`WAVE_17_TEST_ROLLOUT.md`](./waves/WAVE_17_TEST_ROLLOUT.md)

| Task | Scope                                                                    | Priority | Owner              | Validation                                                                     |
| ---- | ------------------------------------------------------------------------ | -------- | ------------------ | ------------------------------------------------------------------------------ |
| 17-1 | Global design token system — glassmorphism + extended palette            | P0       | @Una + @Noura      | `npm run build`                                                                |
| 17-2 | Framer Motion animation layer (page transitions, hover, modals)          | P0       | @Una + @Cyra       | `npm run build` + Playwright smoke                                             |
| 17-3 | Enhanced property card + search results grid (luxury micro-interactions) | P1       | @Lea + @Tracy      | `npm run build` + component tests                                              |
| 17-4 | Luxury CRM dashboard — glassmorphism KPI tiles + charts                  | P1       | @Una + @Lea        | `npm run build` + visual check                                                 |
| 17-5 | Full mobile responsive pass at 375px — all CRM pages                     | P1       | @Tracy             | Playwright mobile suite green                                                  |
| 17-6 | PWA — `vite-plugin-pwa`, manifest, service worker, offline caching       | P1       | @Una + @Ruchi      | Lighthouse PWA ≥ 90                                                            |
| 17-7 | WCAG 2.2 AA final pass + RTL parity                                      | P1       | @Africa + @Sanaa   | Axe 0 Critical + 0 Serious; Lighthouse a11y ≥ 95                               |
| 17-8 | Lighthouse CI gate added to GitHub Actions                               | P0       | @Katherine + @Cyra | CI green; thresholds enforced                                                  |
| 17-9 | Wave closeout validation                                                 | P0       | @Katherine         | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

**Free-Agent Planning (Phase A — run in parallel NOW using free tools):**

| Agent    | Free Tool        | Invocation                                                                                                                                 |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| @Marissa | Google AI Studio | `@Marissa — EXPAND: ui-ux-specification.md → mobile breakpoints, dark-mode token map, form validation, empty state library, skeleton spec` |
| @Noura   | Google AI Studio | `@Noura — DRAFT: design-token-extensions → glassmorphism vars, animation duration tokens, extended palette`                                |
| @Cyra    | Google AI Studio | `@Cyra — DRAFT: framer-motion-animation-guidelines → page transitions, hover, modal entry, reduced-motion handling`                        |
| @Sanaa   | DeepSeek V3      | `@Sanaa — AUDIT: wcag-2.2-gaps → all 8 new WCAG 2.2 AA criteria with acceptance test specs`                                                |
| @Rana    | Google AI Studio | `@Rana — BRIEF: pwa-vs-native → MENA CRM agent mobile usage + PWA service worker scope`                                                    |
| @Yara    | Google AI Studio | `@Yara — RESEARCH: luxury-ux-benchmarks → luxury PropTech UX heuristics + tenant portal benchmarks`                                        |

## S11 — Wave 18: Workflow Parity Audit + Gap Backlog (Planned)

**Sources:** `business_docs/04_workflows/*`, `business_docs/09_crm_features/*`, `business_docs/05_requirements/functional-requirements.md`, `src/config/crmModuleRegistry.tsx`, `server/index.ts`, `server/routes/*`  
**Bundle:** [`WAVE_18_SDD.md`](./waves/WAVE_18_SDD.md) | [`WAVE_18_READINESS_PACKET.md`](./waves/WAVE_18_READINESS_PACKET.md) | [`WAVE_18_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_IMPLEMENTATION_BACKLOG.md) | [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md) | [`WAVE_18_TEST_ROLLOUT.md`](./waves/WAVE_18_TEST_ROLLOUT.md) | [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./waves/WAVE_18_WORKFLOW_PARITY_MATRIX.md)

| Task | Scope                                                                | Priority | Owner                     | Validation                           |
| ---- | -------------------------------------------------------------------- | -------- | ------------------------- | ------------------------------------ |
| 18-1 | Lock benchmark scope (platforms + region + parity model)             | P0       | @Ada + @Margaret          | Scope section finalized in W18 SDD   |
| 18-2 | Build normalized external taxonomy and map top-5 benchmark platforms | P1       | @Margaret                 | Matrix platform snapshot complete    |
| 18-3 | Populate White Caves doc/code/evidence workflow coverage rows        | P0       | @Mira + @Katherine        | 20+ rows scored in parity matrix     |
| 18-4 | Generate P0/P1/P2 implementation gap queue with requirement IDs      | P0       | @Ada + @Mira + @Katherine | Gap summary published in W18 backlog |
| 18-5 | Reconcile doc drift in CRM feature index                             | P1       | @Margaret                 | No stale missing-file refs remain    |
| 18-6 | Planning governance closeout                                         | P0       | @Katherine                | `npm run plans:validate` green       |

### Wave 18.1 — Competitor Parity Execution Queue (new)

- Locked benchmark scope now uses 8 platforms: Property Finder, Bayut/dubizzle, Houza, Zillow, Rightmove, Compass, Salesforce, HubSpot.
- Opportunity inventory fixed at 132 improvements across 12 pillars.
- Top-20 P0 tasks are now execution-ready with owner, success metric, and validation gates.
- 90-day KPI targets are defined and tied to weekly re-benchmark cadence.

### Workflow Parity Dashboard (v1)

- Included: 11
- Partial: 14
- Missing: 2
- Unknown: 0

### Weekly Re-Benchmark Loop

1. Refresh benchmark workflow evidence (top-5 platform snapshot).
2. Recalculate Included/Partial/Missing/Unknown counts.
3. Push new deltas into upcoming implementation backlog.
4. Run `npm run plans:validate` after queue/tracker updates.

---

## S12 — Wave 18.1 Session 2: Competitor Parity Execution

**Source:** [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md) Session 2 Plan
**Entry Gate:** Session 1 evidence confirmed + @Ada architecture plan approved 2026-05-27

| Task         | Scope                                                      | Priority | Owner                       | Validation                                    |
| ------------ | ---------------------------------------------------------- | -------- | --------------------------- | --------------------------------------------- |
| W18.1-P0-001 | Intent-aware ranking for buy/rent/invest                   | P0       | @Mira + @Una                | propertySlice tests + build                   |
| W18.1-P0-002 | Advanced search facets (furnishing, handover, permit, fee) | P0       | @Mira + @Una + @Tracy       | FilterPanel tests + API tests + build         |
| W18.1-P0-003 | Map/list synchronization + viewport persistence            | P0       | @Tracy + @Mira              | InteractiveMap tests + Playwright             |
| W18.1-P0-009 | Mobile CRM command bar (top 8 field actions)               | P0       | @Tracy + @Una               | MobileCRMCommandBar tests + Playwright mobile |
| W18.1-P0-011 | Listing completeness scoring + remediation checklist       | P0       | @Mira + @Una                | completenessScorer tests + widget tests       |
| W18.1-P0-012 | Verification/freshness badges                              | P0       | @Una + @Mira                | badge component tests + build                 |
| W18.1-P0-013 | KYC gate before high-risk transactions                     | P0       | @Mira + @Sofia + @Katherine | kyc-gate tests + typecheck                    |
| W18.1-P0-017 | WhatsApp conversation→lead conversion                      | P0       | @Mira + @Una                | nadia route tests + ConversationsTab tests    |
| W18.1-P0-019 | Funnel economics dashboard (API wire-up)                   | P0       | @Mira + @Katherine          | FunnelEconomicsDashboard tests                |
| W18.1-P0-020 | KPI baseline tracker (API wire-up)                         | P0       | @Mira + @Katherine          | KPIBaselineTracker tests                      |

---

## S13 — Wave 18.1 Session 3: Competitor Parity Execution (P0 Closure + P1 Depth)

**Source:** [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md) Session 3 Plan
**Entry Gate:** Session 2 evidence confirmed + @Ada architecture plan approved 2026-05-28

| Task         | Scope                                                                 | Priority | Owner                       | Validation                                                     |
| ------------ | --------------------------------------------------------------------- | -------- | --------------------------- | -------------------------------------------------------------- |
| W18.1-P0-010 | Offline-safe draft capture (IndexedDB + sync + service worker)        | P0       | @Mira + @Ruchi              | PWA cache tests + sync-conflict tests + Lighthouse PWA ≥ 90    |
| W18.1-P0-018 | Channel orchestration cadence rules engine (WA/email/call)            | P0       | @Joelle + @Margaret + @Mira | Cadence engine tests + admin UI tests + scheduler tests        |
| W18.1-P1-001 | Lead import CSV/XLSX bulk upload + dedup                              | P1       | @Mira + @Katherine          | Import route tests + dedup tests + UI tests                    |
| W18.1-P1-002 | Immutable audit log UI + XLSX export                                  | P1       | @Una + @Mira                | AuditLogUI tests + export route tests + RBAC tests             |
| W18.1-P1-003 | Agent performance report + XLSX/PDF export                            | P1       | @Mira + @Katherine          | Report API tests + export tests + dashboard tests              |
| W18.1-P1-004 | WhatsApp bot escalation hardening (Nina confidence gate + handoff)    | P1       | @Joelle + @Mira             | Nina confidence-gate tests + escalation routing tests          |
| W18.1-P1-005 | Contract e-sign flow completion (signing link + webhook status)       | P1       | @Mira + @Sofia              | Contract signing tests + webhook tests + badge tests           |
| W18.1-P1-006 | Portal syndication baseline (PF/Bayut stub + feature flag)            | P1       | @Mira + @Lea                | Syndication route tests + feature-flag isolation tests         |
| W18.1-P1-007 | CRM follow-up automation depth (escalation tiers + template triggers) | P1       | @Mira + @Margaret           | Follow-up automation tests + escalation tier tests             |
| W18.1-P1-008 | Ejari + rent collection workflow completion                           | P1       | @Victoria + @Mira           | Ejari tracking tests + overdue-collection tests + portal tests |

### Current Open-State Notes

- [ ] **W18.1-P0-010** — IndexedDB draft persistence is in place; sync-conflict handling, service-worker completion, and final PWA validation remain open.
- [ ] **W18.1-P0-018** — Cadence-rule CRUD baseline is in place; admin UI, scheduler completion, and final cadence validation remain open.
- [ ] **W18.1-P1-001** — Lead import CSV/XLSX upload, field mapping, dedup, and row-error reporting remain open.
- [ ] **W18.1-P1-002** — Audit log CSV/XLSX export baseline exists; filterable/paginated UI completion and RBAC validation remain open.
- [ ] **W18.1-P1-003** — Agent performance dashboard and XLSX/PDF export remain open.
- [ ] **W18.1-P1-004** — Structured Nadia escalation logging exists; confidence thresholding and agent handoff completion remain open.
- [ ] **W18.1-P1-005** — Tokenized sign routes/webhook baseline exists; email delivery and contract signing status UI remain open.
- [ ] **W18.1-P1-006** — Feature-flagged syndication queue/status API exists; Property Finder/Bayut provider stub completion remains open.
- [ ] **W18.1-P1-007** — Multi-tier follow-up escalation and template trigger builder remain open.
- [ ] **W18.1-P1-008** — Ejari tracking UI and overdue rent collection queue remain open.

**Latest S13 checkpoint (2026-07-06):**

- `W18.1-P1-004` hardening validated with focused confidence-gate test suite (`whatsappAssistant` + `nadia.routes`, 29/29 passing), targeted lint clean, `npm run typecheck` and `npm run build` green.

---

## S14 — Wave 18.2: Profile-First Post-Login Journey ✅ Complete

**Source:** Post-login UX plan (2026-06-04)
**Entry Gate:** Wave 18.1 S3 in progress; approved as parallel auth/UX hardening

| Task     | Scope                                                                  | Priority | Owner      | Validation                                        |
| -------- | ---------------------------------------------------------------------- | -------- | ---------- | ------------------------------------------------- |
| W18.2-01 | `resolvePostLoginRoute` → `/profile` for CRM-eligible users            | P0       | @Mira      | `useSignIn` routing tests                         |
| W18.2-02 | ProfilePage Dashboard CTA → canonical `/crm` link                      | P0       | @Mira      | Build + visual check                              |
| W18.2-03 | Update routing tests (4 assertions) to match profile-first expectation | P0       | @Katherine | `npm run test:run -- src/hooks/useSignIn.test.ts` |

---

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [x] Validation command(s) defined in the relevant wave bundle pass
- [x] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [x] `npm run plans:validate` passes after tracker updates

---

## S15 — Wave 20: Full Leasing & Tenancy 📋 Planned

**Source:** [`plans/waves/WAVE_20_SDD.md`](./waves/WAVE_20_SDD.md)  
**Entry Gate:** Wave 19 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`  
**Readiness:** 65% (business rules + API contract complete; e-sign integration pending)

| Task                                                                     | Priority | Owner               | Validation                                        |
| ------------------------------------------------------------------------ | -------- | ------------------- | ------------------------------------------------- |
| W20-001 — Tenant application + KYC document upload + expiry-alert engine | P0       | @Mira + @Barbara    | Unit: KYC rules; E2E: application submit          |
| W20-002 — Bilingual tenancy agreement PDF generator                      | P0       | @Mira               | Integration: PDF output with all variable slots   |
| W20-003 — DocuSign/Adobe Sign e-signature webhook wiring                 | P0       | @Mira               | Integration: webhook fires on mock signature      |
| W20-004 — Ejari registration status tracking                             | P0       | @Mira + @Una        | Unit: status transitions; UI: badge rendering     |
| W20-005 — PDC schedule auto-generator                                    | P0       | @Barbara + @Mira    | Unit: schedule math all frequency variants        |
| W20-006 — Bounced cheque workflow → Form 12 legal notice                 | P0       | @Mira + @Katherine  | Integration: bounce → notification → PDF          |
| W20-007 — PDC replacement flow                                           | P1       | @Mira               | Unit: replacement links to original               |
| W20-008 — Lease renewal workflow (90/60/30-day cron + Form 7)            | P0       | @Mira + @Barbara    | Integration: cron intervals; Unit: Form 7 content |
| W20-009 — Early termination + RERA penalty calculator                    | P1       | @Mira               | Unit: RERA Article 11 all cases                   |
| W20-010 — Tenant Portal six-tab UI (all states)                          | P0       | @Una + @Lea         | E2E: all tabs + states                            |
| W20-011 — Landlord Portal (portfolio + PDC calendar + quarterly PDF)     | P0       | @Una + @Mira        | E2E: portfolio view; Unit: quarterly PDF          |
| W20-012 — Maintenance cost approval > AED 500 via WhatsApp               | P1       | @Mira               | Integration: approval flow                        |
| W20-013 — RBAC enforcement for all tenancy roles                         | P0       | @Katherine + @Radia | Integration: boundary tests all roles             |
| W20-015 — Wave 20 closeout + `npm run plans:validate`                    | P0       | @Katherine          | Validation green; trackers updated                |

---

## S16 — Wave 21: Finance, UAE VAT & Commission Engine 📋 Planned

**Source:** [`plans/waves/WAVE_21_SDD.md`](./waves/WAVE_21_SDD.md)  
**Entry Gate:** Wave 20 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`  
**Readiness:** 68% (UAE VAT rules + commission matrix complete; FTA format needs final confirmation)

| Task                                                                          | Priority | Owner              | Validation                                              |
| ----------------------------------------------------------------------------- | -------- | ------------------ | ------------------------------------------------------- |
| W21-001 — UAE VAT engine (5% taxable / 0% exempt)                             | P0       | @Mira + @Barbara   | Unit: VAT calc all transaction types                    |
| W21-002 — Quarterly VAT return (FTA-formatted PDF + Excel)                    | P1       | @Mira              | Integration: VAT return verified against FTA format     |
| W21-003 — Tax Invoice generator (TRN, auto-numbering, Pro Forma, Credit Note) | P0       | @Mira              | Unit: auto-number uniqueness; FTA fields present        |
| W21-004 — Commission auto-calculation + split sum validation                  | P0       | @Barbara + @Mira   | Unit: rate matrix + split sum = 100%                    |
| W21-005 — Commission approval workflow (agent → manager → finance)            | P0       | @Mira + @Katherine | Integration: full chain; RBAC: self-approve blocked     |
| W21-006 — Commission clawback (30-day rule)                                   | P1       | @Mira              | Unit: clawback triggers at days 0, 29, 30, 31           |
| W21-007 — Rolling 12-month cash-flow forecast                                 | P0       | @Barbara + @Mira   | Integration: forecast updates on transaction; UI: chart |
| W21-008 — Monthly P&L + close-month lock                                      | P0       | @Mira + @Barbara   | Integration: close locks period; Unit: P&L math         |
| W21-009 — AR aging report (30/60/90/120+ buckets)                             | P1       | @Mira              | Integration: buckets correct; Export: Excel columns     |
| W21-010 — Budget vs Actual variance report                                    | P1       | @Barbara           | Unit: variance calc; UI: colour-coded                   |
| W21-011 — Immutable ledger (append-only, close-lock enforced)                 | P0       | @Katherine + @Mira | Integration: edit of locked entry returns 403           |
| W21-012 — Multi-currency display (ExchangeRate-API, 4h cache)                 | P1       | @Mira              | Unit: cache TTL + fallback                              |
| W21-013 — Commission statement PDF per agent per period                       | P1       | @Mira              | Integration: PDF totals correct                         |
| W21-014 — Executive P&L dashboard (Owner/MD role-gated)                       | P1       | @Una + @Mira       | E2E: Owner sees P&L; non-owner blocked                  |
| W21-015 — Wave 21 closeout + `npm run plans:validate`                         | P0       | @Katherine         | Validation green; trackers updated                      |

---

## S17 — Wave 22: Market Intelligence, Off-Plan & Analytics 📋 Planned

**Source:** [`plans/waves/WAVE_22_SDD.md`](./waves/WAVE_22_SDD.md)  
**Entry Gate:** Wave 21 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`  
**Readiness:** 62% (analytics spec + off-plan rules complete; AVM data source needs confirmation)

| Task                                                            | Priority | Owner              | Validation                                            |
| --------------------------------------------------------------- | -------- | ------------------ | ----------------------------------------------------- |
| W22-001 — Property AVM (value + confidence + ≥3 comparables)    | P0       | @Mira + @Barbara   | Unit: AVM with known comparable set                   |
| W22-002 — Manual valuation override + manager approval          | P1       | @Mira              | Integration: non-manager rejected 403                 |
| W22-003 — Rental yield calculator (gross + net + payback years) | P1       | @Barbara           | Unit: known inputs → expected outputs                 |
| W22-004 — Monthly AVM refresh cron                              | P1       | @Mira              | Integration: cron updates all active properties       |
| W22-005 — Dubai area price index + RERA rental index by area    | P0       | @Barbara + @Cassie | Integration: 30 neighborhoods present                 |
| W22-006 — Price drop alert (>5% MoM)                            | P1       | @Mira              | Integration: 6% drop fires; 4% does not               |
| W22-007 — Weekly market report PDF + Monday 08:00 email         | P1       | @Mira              | Integration: PDF has 3 chart sections; email received |
| W22-008 — Off-plan project CRUD + unit state machine            | P0       | @Mira + @Barbara   | Unit: all state transitions; E2E: full lifecycle      |
| W22-009 — Oqood 60-day window tracking + breach escalation      | P0       | @Mira + @Katherine | Unit: alert at day 45/59; breach creates manager task |
| W22-010 — Payment milestone schedule + escrow compliance flag   | P1       | @Mira              | Unit: 3 payment plan templates; escrow flag triggers  |
| W22-011 — RERA Article 11 cancellation refund calculator        | P1       | @Barbara           | Unit: all 4 penalty tier boundaries                   |
| W22-012 — ROI projection calculator                             | P1       | @Una + @Mira       | Unit: known inputs produce expected ROI               |
| W22-013 — Nightly analytics aggregation cron → snapshots        | P0       | @Mira + @Barbara   | Integration: snapshot grows by 1/day                  |
| W22-014 — Redis real-time counters (leads/viewings/maintenance) | P0       | @Mira              | Integration: counters survive Redis restart           |
| W22-015 — Bulk data export async job (50K rows + email link)    | P1       | @Mira              | Integration: 10K test export; email with URL          |
| W22-016 — RERA license expiry guard + 90/30-day alerts          | P0       | @Katherine + @Mira | Integration: expired agent cannot receive leads       |
| W22-017 — Agent PIP workflow                                    | P1       | @Una + @Mira       | E2E: PIP create → view → milestone complete           |
| W22-018 — Analytics dashboard UI (KPI tiles + charts + heatmap) | P1       | @Una + @Cassie     | E2E: all widgets render for Owner role                |
| W22-019 — Wave 22 closeout + `npm run plans:validate`           | P0       | @Katherine         | Validation green; trackers updated                    |

---

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and archive/supersede duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Reference-only docs may support context, but they must not override canonical queue or roadmap decisions.

## High-Density Execution Checklist (P0/P1 Finance & RBAC)

- [ ] **100-Role RBAC Matrix Enforcement:**
  - [ ] Validate `ADMIN`, `FINANCE_MANAGER`, `COMPLIANCE_OFFICER` permission sets against explicit endpoints.
  - [ ] Reject all mutations missing `@Ada` 90% gate approval.
- [ ] **Multi-Currency Calculator (AED/USD/EUR/GBP/INR):**
  - [ ] Integrate 4-hour local memory TTL cache for FX rates.
  - [ ] Implement hard calculation tests (precision 4 decimal places).
- [ ] **P0/P1 Finance Modules:**
  - [ ] Calculate 5% rent commission and 2% secondary sale commission with test coverage.
  - [ ] Wire state reducer transitions (AGENT_SUBMITTED ➔ MANAGER_APPROVED ➔ FINANCE_LOCKED ➔ PAYMENT_RELEASED).
