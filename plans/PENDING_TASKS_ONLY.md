# Pending Tasks Only

**Last Updated:** 2026-05-25
**Current Focus:** Wave 13 is next in queue; Waves 14–16 remain sequenced and bundle-backed.

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Wave index: [`waves/README.md`](./waves/README.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

## Implementation Order

`09 → 10 → 11 → 12 → 13 → 14 → 15 → 16`

Advance only when the prior wave is green, the readiness gate is satisfied, and `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` has been issued for that wave.

## Wave Status Board

| Stream | Wave | Objective | Status | Owners | Validation Gate |
| --- | --- | --- | --- | --- | --- |
| S1 | 08 | TypeScript/errors stabilization | ✅ Green | @Mira + @Katherine | TypeScript baseline confirmed green |
| S2 | 09 | UX hardening — loading states, error boundaries, mobile, RTL | ✅ Green | @Una + @Lea + @Tracy + @Inas | Build + lint + targeted tests + tracker sync complete |
| S3 | 10 | Performance + SEO + security uplift | ✅ Green | @Ruchi + @Rachel + @Radia + @Katherine | Lazy loading, SEO meta/structured-data, CSP, rate-limiting, vite chunks complete |
| S4 | 11 | Incomplete features + architecture refactor | ✅ Green | @Ada + @Mira + @Barbara | SchedulerService, DocumentService, email triggers, export routes complete |
| S5 | 12 | Automation engine (cron + docs + email) | ✅ Green | @Cron + @Puppeteer + @Handlebars + @Mira | Rent reminders, lease-expiry reminders, sitemap refresh, P&L report, export routes complete |
| S6 | 13 | Real-time notifications + media + virtual tour | 📋 Planned | @Socket + @Cloudinary + @Pannellum + @Mira | S5 green + readiness 60% + @Ada approval phrase |
| S7 | 14 | Product features closure | 📋 Planned | @LeadScore + @Mortgage + @Zod + @Mira | S6 green + readiness 60% + @Ada approval phrase |
| S8 | 15 | Cache + PWA readiness | 📋 Planned | @Redis + @PWA + @Ruchi + @Una | S7 green + readiness 60% + @Ada approval phrase |
| S9 | 16 | Security hardening + API versioning | 📋 Planned | @S5 + @Radia + @Mira | S8 green + readiness 60% + @Ada approval phrase |

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

## S6 — Wave 13: Real-Time & Media

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

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [ ] Validation command(s) defined in the relevant wave bundle pass
- [ ] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [ ] `npm run plans:validate` passes after tracker updates

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and archive/supersede duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Reference-only docs may support context, but they must not override canonical queue or roadmap decisions.
