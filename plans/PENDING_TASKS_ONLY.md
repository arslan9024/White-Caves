# Pending Tasks Only

**Last Updated:** 2026-05-28
**Current Focus:** Wave 18.1 Session 2 complete ✅ — Wave 18.1 Session 3 (P0 closure + top P1s) 🟡 In Progress.

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Wave index: [`waves/README.md`](./waves/README.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

## Implementation Order

`09 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18`

Advance only when the prior wave is green, the readiness gate is satisfied, and `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` has been issued for that wave.

## Wave Status Board

| Stream | Wave | Objective | Status | Owners | Validation Gate |
| --- | --- | --- | --- | --- | --- |
| S1 | 08 | TypeScript/errors stabilization | ✅ Green | @Mira + @Katherine | TypeScript baseline confirmed green |
| S2 | 09 | UX hardening — loading states, error boundaries, mobile, RTL | ✅ Green | @Una + @Lea + @Tracy + @Inas | Build + lint + targeted tests + tracker sync complete |
| S3 | 10 | Performance + SEO + security uplift | ✅ Green | @Ruchi + @Rachel + @Radia + @Katherine | Lazy loading, SEO meta/structured-data, CSP, rate-limiting, vite chunks complete |
| S4 | 11 | Incomplete features + architecture refactor | ✅ Green | @Ada + @Mira + @Barbara | SchedulerService, DocumentService, email triggers, export routes complete |
| S5 | 12 | Automation engine (cron + docs + email) | ✅ Green | @Cron + @Puppeteer + @Handlebars + @Mira | Rent reminders, lease-expiry reminders, sitemap refresh, P&L report, export routes complete |
| S6 | 13 | Real-time notifications + media + virtual tour | ✅ Green | @Socket + @Cloudinary + @Pannellum + @Mira | Socket auth + notification service + media pipeline + virtual tour integration completed |
| S7 | 14 | Product features closure | ✅ Green | @LeadScore + @Mortgage + @Zod + @Mira | S6 green + readiness 60% + @Ada approval phrase |
| S8 | 15 | Cache + PWA readiness | ✅ Green | @Redis + @PWA + @Ruchi + @Una | S7 green + readiness 60% + @Ada approval phrase |
| S9 | 16 | Security hardening + API versioning | ✅ Green | @S5 + @Radia + @Mira | S8 green + readiness 60% + @Ada approval phrase |
| S10 | 17 | Full UI/UX luxury upgrade (design tokens + glassmorphism + animations + mobile + PWA + WCAG 2.2) | ✅ Green | @Una + @Lea + @Tracy + @Africa + @Cyra + @Katherine | Wave 17 implementation + CI Lighthouse thresholds + accessibility/mobile/PWA checks complete |
| S11 | 18 | Workflow parity audit + benchmark gap backlog | ✅ Green | @Ada + @Margaret + @Mira + @Katherine | Wave 18 parity matrix finalized + canonical queue updates + `npm run plans:validate` |
| S12 | 18.1 | Competitor parity execution — Session 1 ✅ complete, Session 2 ✅ complete | ✅ Complete | @Ada + @Mira + @Una + @Tracy + @Katherine + @Sofia | Session 1 + Session 2 tests green + build green + `npm run plans:validate` |
| S13 | 18.1-S3 | Competitor parity execution — Session 3: 2 deferred P0s + top 8 P1s | 🟡 In Progress | @Ada + @Mira + @Joelle + @Katherine + @Victoria + @Una | Session 3 tests green + build green + `npm run plans:validate` |

## Completed Stream History

| Phase | Objective | Status |
| --- | --- | --- |
| N+1 | Auth/login hardening + route consistency | ✅ Complete |
| N+2 | Tenant portal live data parity | ✅ Complete |
| N+3 | Managing-director CRM critical tabs | ✅ Complete |
| N+4 | Convert top 3 revenue-impact stub endpoints | ✅ Complete |
| N+5 | Test + release hardening | ✅ Complete |
| N+6 | UI architecture hardening + Arabic RTL readiness | ✅ Complete |
| N+7 | Subagent upgrade: readiness + collaboration mesh | ✅ Complete |
| N+8 | Google social auth hardening + dashboard redirect consistency | ✅ Complete |
| N+9 | UX loading-state hardening | ✅ Complete |
| Repo | Archive/cleanup pass + canonical planning reset | ✅ Complete |
| S1 | Wave 08 stabilization + governance baseline | ✅ Complete |
| S2 | Wave 09 UX hardening + accessibility/mobile/RTL closeout | ✅ Complete |
| S3 | Wave 10 performance + SEO + security uplift | ✅ Complete |
| S4 | Wave 11 incomplete features + architecture refactor | ✅ Complete |
| S5 | Wave 12 automation engine (cron + docs + email) | ✅ Complete |
| S6 | Wave 13 real-time notifications + media + virtual tour | ✅ Complete |
| S10 | Wave 17 full UI/UX luxury upgrade | ✅ Complete |
| S11 | Wave 18 workflow parity audit + gap backlog generation | ✅ Complete |
| S11-S1 | Wave 18.1 Session 1: Lead workflow automation + tenant/landlord portals | ✅ Complete |
| S11-S2 | Wave 18.1 Session 2: Search ranking, facets, map sync, listing trust, WA→lead, funnel, KPI, KYC gate, mobile CRM | ✅ Complete |
| S11-S3 | Wave 18.1 Session 3: Offline PWA drafts, cadence engine, lead import, audit log UI, agent report, Nina escalation, e-sign, syndication, follow-up automation, Ejari/rent collection | 🟡 In Progress |

## S2 — Wave 09: UX Hardening (Complete)

**Source:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) items 30–33  
**Bundle:** [`WAVE_09_SDD.md`](./waves/WAVE_09_SDD.md) | [`WAVE_09_READINESS_PACKET.md`](./waves/WAVE_09_READINESS_PACKET.md) | [`WAVE_09_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_09_IMPLEMENTATION_BACKLOG.md) | [`WAVE_09_TEST_ROLLOUT.md`](./waves/WAVE_09_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 9-1 | Skeleton component library | P0 | @Lea | `npm run build` + component tests |
| 9-2 | Apply skeletons to key CRM surfaces | P0 | @Lea + @Una | `npm run build` + visual check |
| 9-3 | EmptyState + ErrorBoundary wiring | P0 | @Una + @Lea | `npm run build` |
| 9-4 | Axe a11y audit + critical fixes | P1 | @Africa + @Katherine | Axe scan clean |
| 9-5 | Mobile CRM drawer for < 768px | P1 | @Tracy | Playwright mobile check |
| 9-6 | RTL layout corrections | P2 | @Inas | RTL screenshot review + lint |
| 9-7 | Axe scan wired into CI | P2 | @Katherine | CI green |

## S3 — Wave 10: Performance + SEO + Security

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) | [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md) | [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)  
**Bundle:** [`WAVE_10_SDD.md`](./waves/WAVE_10_SDD.md) | [`WAVE_10_READINESS_PACKET.md`](./waves/WAVE_10_READINESS_PACKET.md) | [`WAVE_10_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_10_IMPLEMENTATION_BACKLOG.md) | [`WAVE_10_TEST_ROLLOUT.md`](./waves/WAVE_10_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 10-1 | Lighthouse audit + lazy loading | P0 | @Ruchi | Lighthouse >= 85 |
| 10-2 | SEO metadata + structured data | P0 | @Rachel | `npm run build` |
| 10-3 | CSP headers + sanitization + dependency review | P1 | @Radia | lint + security review |
| 10-4 | Public API rate-limiting hardening | P2 | @Mira + @Radia | typecheck/lint/build |

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

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 12-1 | SchedulerService + cron registration | P0 | @Mira + @Cron | `npm run typecheck` |
| 12-2 | DocumentService PDF/Excel streaming routes | P0 | @Mira + @Puppeteer | `npm run build` |
| 12-3 | Handlebars templates + trigger registry | P1 | @Mira + @Handlebars | focused route tests |
| 12-4 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S6 — Wave 13: Real-Time & Media (Complete)

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) items 10–12  
**Bundle:** [`WAVE_13_SDD.md`](./waves/WAVE_13_SDD.md) | [`WAVE_13_READINESS_PACKET.md`](./waves/WAVE_13_READINESS_PACKET.md) | [`WAVE_13_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_13_IMPLEMENTATION_BACKLOG.md) | [`WAVE_13_TEST_ROLLOUT.md`](./waves/WAVE_13_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 13-1 | Socket auth + NotificationService | P0 | @Mira + @Socket | socket integration tests |
| 13-2 | Image upload/storage pipeline | P0 | @Mira + @Cloudinary | route tests + build |
| 13-3 | Virtual tour integration + lazy loading | P1 | @Una + @Pannellum | UI smoke + build |
| 13-4 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S7 — Wave 14: Product Features

**Sources:** [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md) items 34–38  
**Bundle:** [`WAVE_14_SDD.md`](./waves/WAVE_14_SDD.md) | [`WAVE_14_READINESS_PACKET.md`](./waves/WAVE_14_READINESS_PACKET.md) | [`WAVE_14_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_14_IMPLEMENTATION_BACKLOG.md) | [`WAVE_14_TEST_ROLLOUT.md`](./waves/WAVE_14_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 14-1 | Lead auto-rescore workflow | P0 | @Mira + @LeadScore | scoring tests |
| 14-2 | Audit log UI + filtering/pagination | P0 | @Una + @LeadScore | build + component tests |
| 14-3 | Mortgage API + calendar + FX conversion | P1 | @Mira + @Mortgage | route/integration tests |
| 14-4 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S8 — Wave 15: Cache + PWA Readiness

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) + [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)  
**Bundle:** [`WAVE_15_SDD.md`](./waves/WAVE_15_SDD.md) | [`WAVE_15_READINESS_PACKET.md`](./waves/WAVE_15_READINESS_PACKET.md) | [`WAVE_15_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_15_IMPLEMENTATION_BACKLOG.md) | [`WAVE_15_TEST_ROLLOUT.md`](./waves/WAVE_15_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 15-1 | Redis cache + DB pooling | P0 | @Ruchi + @Redis | perf + integration checks |
| 15-2 | PWA manifest/service worker foundation | P1 | @Una + @PWA | lighthouse + build |
| 15-3 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S9 — Wave 16: Security Hardening + API Versioning

**Sources:** [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md) + [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)  
**Bundle:** [`WAVE_16_SDD.md`](./waves/WAVE_16_SDD.md) | [`WAVE_16_READINESS_PACKET.md`](./waves/WAVE_16_READINESS_PACKET.md) | [`WAVE_16_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_16_IMPLEMENTATION_BACKLOG.md) | [`WAVE_16_TEST_ROLLOUT.md`](./waves/WAVE_16_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 16-1 | `/api/v1` compatibility layer + migration | P0 | @Mira + @S5 | route tests |
| 16-2 | CSRF + AppError envelope hardening | P0 | @Radia + @Mira + @S5 | security tests + typecheck |
| 16-3 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

## S10 — Wave 17: Full UI/UX Luxury Upgrade (Complete)

**Sources:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) | [`ui-ux-specification.md`](../../business_docs/06_design_architecture/ui-ux-specification.md) (Sections 13–17)  
**Bundle:** [`WAVE_17_SDD.md`](./waves/WAVE_17_SDD.md) | [`WAVE_17_READINESS_PACKET.md`](./waves/WAVE_17_READINESS_PACKET.md) | [`WAVE_17_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_17_IMPLEMENTATION_BACKLOG.md) | [`WAVE_17_TEST_ROLLOUT.md`](./waves/WAVE_17_TEST_ROLLOUT.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 17-1 | Global design token system — glassmorphism + extended palette | P0 | @Una + @Noura | `npm run build` |
| 17-2 | Framer Motion animation layer (page transitions, hover, modals) | P0 | @Una + @Cyra | `npm run build` + Playwright smoke |
| 17-3 | Enhanced property card + search results grid (luxury micro-interactions) | P1 | @Lea + @Tracy | `npm run build` + component tests |
| 17-4 | Luxury CRM dashboard — glassmorphism KPI tiles + charts | P1 | @Una + @Lea | `npm run build` + visual check |
| 17-5 | Full mobile responsive pass at 375px — all CRM pages | P1 | @Tracy | Playwright mobile suite green |
| 17-6 | PWA — `vite-plugin-pwa`, manifest, service worker, offline caching | P1 | @Una + @Ruchi | Lighthouse PWA ≥ 90 |
| 17-7 | WCAG 2.2 AA final pass + RTL parity | P1 | @Africa + @Sanaa | Axe 0 Critical + 0 Serious; Lighthouse a11y ≥ 95 |
| 17-8 | Lighthouse CI gate added to GitHub Actions | P0 | @Katherine + @Cyra | CI green; thresholds enforced |
| 17-9 | Wave closeout validation | P0 | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` |

**Free-Agent Planning (Phase A — run in parallel NOW using free tools):**

| Agent | Free Tool | Invocation |
| --- | --- | --- |
| @Marissa | Google AI Studio | `@Marissa — EXPAND: ui-ux-specification.md → mobile breakpoints, dark-mode token map, form validation, empty state library, skeleton spec` |
| @Noura | Google AI Studio | `@Noura — DRAFT: design-token-extensions → glassmorphism vars, animation duration tokens, extended palette` |
| @Cyra | Google AI Studio | `@Cyra — DRAFT: framer-motion-animation-guidelines → page transitions, hover, modal entry, reduced-motion handling` |
| @Sanaa | DeepSeek V3 | `@Sanaa — AUDIT: wcag-2.2-gaps → all 8 new WCAG 2.2 AA criteria with acceptance test specs` |
| @Rana | Google AI Studio | `@Rana — BRIEF: pwa-vs-native → MENA CRM agent mobile usage + PWA service worker scope` |
| @Yara | Google AI Studio | `@Yara — RESEARCH: luxury-ux-benchmarks → luxury PropTech UX heuristics + tenant portal benchmarks` |

## S11 — Wave 18: Workflow Parity Audit + Gap Backlog (Planned)

**Sources:** `business_docs/04_workflows/*`, `business_docs/09_crm_features/*`, `business_docs/05_requirements/functional-requirements.md`, `src/config/crmModuleRegistry.tsx`, `server/index.ts`, `server/routes/*`  
**Bundle:** [`WAVE_18_SDD.md`](./waves/WAVE_18_SDD.md) | [`WAVE_18_READINESS_PACKET.md`](./waves/WAVE_18_READINESS_PACKET.md) | [`WAVE_18_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_IMPLEMENTATION_BACKLOG.md) | [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md) | [`WAVE_18_TEST_ROLLOUT.md`](./waves/WAVE_18_TEST_ROLLOUT.md) | [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./waves/WAVE_18_WORKFLOW_PARITY_MATRIX.md)

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| 18-1 | Lock benchmark scope (platforms + region + parity model) | P0 | @Ada + @Margaret | Scope section finalized in W18 SDD |
| 18-2 | Build normalized external taxonomy and map top-5 benchmark platforms | P1 | @Margaret | Matrix platform snapshot complete |
| 18-3 | Populate White Caves doc/code/evidence workflow coverage rows | P0 | @Mira + @Katherine | 20+ rows scored in parity matrix |
| 18-4 | Generate P0/P1/P2 implementation gap queue with requirement IDs | P0 | @Ada + @Mira + @Katherine | Gap summary published in W18 backlog |
| 18-5 | Reconcile doc drift in CRM feature index | P1 | @Margaret | No stale missing-file refs remain |
| 18-6 | Planning governance closeout | P0 | @Katherine | `npm run plans:validate` green |

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

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| W18.1-P0-001 | Intent-aware ranking for buy/rent/invest | P0 | @Mira + @Una | propertySlice tests + build |
| W18.1-P0-002 | Advanced search facets (furnishing, handover, permit, fee) | P0 | @Mira + @Una + @Tracy | FilterPanel tests + API tests + build |
| W18.1-P0-003 | Map/list synchronization + viewport persistence | P0 | @Tracy + @Mira | InteractiveMap tests + Playwright |
| W18.1-P0-009 | Mobile CRM command bar (top 8 field actions) | P0 | @Tracy + @Una | MobileCRMCommandBar tests + Playwright mobile |
| W18.1-P0-011 | Listing completeness scoring + remediation checklist | P0 | @Mira + @Una | completenessScorer tests + widget tests |
| W18.1-P0-012 | Verification/freshness badges | P0 | @Una + @Mira | badge component tests + build |
| W18.1-P0-013 | KYC gate before high-risk transactions | P0 | @Mira + @Sofia + @Katherine | kyc-gate tests + typecheck |
| W18.1-P0-017 | WhatsApp conversation→lead conversion | P0 | @Mira + @Una | nadia route tests + ConversationsTab tests |
| W18.1-P0-019 | Funnel economics dashboard (API wire-up) | P0 | @Mira + @Katherine | FunnelEconomicsDashboard tests |
| W18.1-P0-020 | KPI baseline tracker (API wire-up) | P0 | @Mira + @Katherine | KPIBaselineTracker tests |

---

## S13 — Wave 18.1 Session 3: Competitor Parity Execution (P0 Closure + P1 Depth)

**Source:** [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md) Session 3 Plan
**Entry Gate:** Session 2 evidence confirmed + @Ada architecture plan approved 2026-05-28

| Task | Scope | Priority | Owner | Validation |
| --- | --- | --- | --- | --- |
| W18.1-P0-010 | Offline-safe draft capture (IndexedDB + sync + service worker) | P0 | @Mira + @Ruchi | PWA cache tests + sync-conflict tests + Lighthouse PWA ≥ 90 |
| W18.1-P0-018 | Channel orchestration cadence rules engine (WA/email/call) | P0 | @Joelle + @Margaret + @Mira | Cadence engine tests + admin UI tests + scheduler tests |
| W18.1-P1-001 | Lead import CSV/XLSX bulk upload + dedup | P1 | @Mira + @Katherine | Import route tests + dedup tests + UI tests |
| W18.1-P1-002 | Immutable audit log UI + XLSX export | P1 | @Una + @Mira | AuditLogUI tests + export route tests + RBAC tests |
| W18.1-P1-003 | Agent performance report + XLSX/PDF export | P1 | @Mira + @Katherine | Report API tests + export tests + dashboard tests |
| W18.1-P1-004 | WhatsApp bot escalation hardening (Nina confidence gate + handoff) | P1 | @Joelle + @Mira | Nina confidence-gate tests + escalation routing tests |
| W18.1-P1-005 | Contract e-sign flow completion (signing link + webhook status) | P1 | @Mira + @Sofia | Contract signing tests + webhook tests + badge tests |
| W18.1-P1-006 | Portal syndication baseline (PF/Bayut stub + feature flag) | P1 | @Mira + @Lea | Syndication route tests + feature-flag isolation tests |
| W18.1-P1-007 | CRM follow-up automation depth (escalation tiers + template triggers) | P1 | @Mira + @Margaret | Follow-up automation tests + escalation tier tests |
| W18.1-P1-008 | Ejari + rent collection workflow completion | P1 | @Victoria + @Mira | Ejari tracking tests + overdue-collection tests + portal tests |

---

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [x] Validation command(s) defined in the relevant wave bundle pass
- [x] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [x] `npm run plans:validate` passes after tracker updates

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and archive/supersede duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Reference-only docs may support context, but they must not override canonical queue or roadmap decisions.
