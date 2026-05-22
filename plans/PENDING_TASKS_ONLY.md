# Pending Tasks Only

**Last Updated:** 2026-05-22
**Acceleration Update:** Wave 09 promoted to Ready (S1 baseline green). Waves 10/11 bundles created.

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

## Stream Status Board

| Stream | Wave | Objective                                            | Status     | Owners                                 | Validation Gate                                                                                 |
| ------ | ---- | ---------------------------------------------------- | ---------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| S1     | 08   | TypeScript/errors stabilization (fast/medium/deep)   | ✅ Green   | @Mira + @Katherine                     | TypeScript 0 errors (client + server) ✅ May 22                                                 |
| S2     | 09   | UX hardening — loading states, error boundaries, RTL | 🟢 Ready   | @Una + @Lea + @Tracy + @Inas           | S1 green ✅ + readiness 72% ✅ + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` |
| S3     | 10   | Performance + SEO + security uplift                  | 📋 Planned | @Ruchi + @Rachel + @Radia + @Katherine | S2 green + readiness 65% ✅ bundle ready + @Ada approval phrase                                 |
| S4     | 11   | Incomplete features + architecture refactor          | 📋 Planned | @Ada + @Mira + @Barbara                | S3 green + readiness 60% ✅ bundle ready + @Ada approval phrase                                 |

## Completed Stream History

| Phase | Objective                                                     | Status                     |
| ----- | ------------------------------------------------------------- | -------------------------- |
| N+1   | Auth/login hardening + route consistency                      | ✅ Complete                |
| N+2   | Tenant portal live data parity                                | ✅ Complete                |
| N+3   | Managing-director CRM critical tabs                           | ✅ Complete                |
| N+4   | Convert top 3 revenue-impact stub endpoints                   | ✅ Complete                |
| N+5   | Test + release hardening                                      | ✅ Complete                |
| N+6   | UI architecture hardening + Arabic RTL readiness              | ✅ Complete                |
| N+7   | Subagent upgrade: readiness + collaboration mesh              | ✅ Complete (May 18, 2026) |
| N+8   | Google social auth hardening + dashboard redirect consistency | ✅ Complete (May 21, 2026) |
| N+9   | UX loading-state hardening                                    | ✅ Complete (May 21, 2026) |
| Repo  | Archive 293 completed docs; clean root; new wave roadmap      | ✅ Complete (May 22, 2026) |
| S1    | Wave 08: TypeScript baseline — 0 errors (client + server)     | ✅ Complete (May 22, 2026) |

## S1 — Wave 08: Errors Stabilization Lane (Active)

### Bucketed Backlog

| Bucket        | Priority | Scope / Blockers                                                                    | Owners             | Validation Commands                                                                                                                                    | Pass Condition                                    |
| ------------- | -------- | ----------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Fast-fix      | P0       | Route-level typing/import drift and strict-mode diagnostics in active touched files | @Mira + @Katherine | `npm run typecheck && npm run test:run -- server/routes/linda.routes.test.ts server/routes/nadia.routes.test.ts server/routes/nadia.assistant.test.ts` | Typecheck clean + targeted assistant tests pass   |
| Medium-fix    | P1       | Notifications + compliance route cohesion and regression-safe refactors             | @Mira + @Katherine | `npm run test:run -- server/routes/henry.routes.test.ts && npm run build`                                                                              | Focused suites pass + build pass                  |
| Deep-refactor | P2       | Cross-module consistency cleanup only after fast/medium queues are green            | @Mira + @Gwynne    | `npm run quality:quick`                                                                                                                                | Lint + build + ops tests pass without regressions |

**Wave 08 Artifacts:**
[`WAVE_08_SDD.md`](./waves/WAVE_08_SDD.md) | [`WAVE_08_READINESS_PACKET.md`](./waves/WAVE_08_READINESS_PACKET.md) | [`WAVE_08_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_08_IMPLEMENTATION_BACKLOG.md) | [`WAVE_08_TEST_ROLLOUT.md`](./waves/WAVE_08_TEST_ROLLOUT.md)

## S2 — Wave 09: UX Hardening (🟢 Ready — S1 green, execute now)

**Source:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) items 30–33  
**Wave Bundle:** [`WAVE_09_SDD.md`](./waves/WAVE_09_SDD.md) | [`WAVE_09_READINESS_PACKET.md`](./waves/WAVE_09_READINESS_PACKET.md) | [`WAVE_09_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_09_IMPLEMENTATION_BACKLOG.md) | [`WAVE_09_TEST_ROLLOUT.md`](./waves/WAVE_09_TEST_ROLLOUT.md)

| Task | Scope                                                                 | Priority | Owner                | Validation                         |
| ---- | --------------------------------------------------------------------- | -------- | -------------------- | ---------------------------------- |
| 9-1  | Skeleton component library (SkeletonCard, SkeletonTable, SkeletonKPI) | P0       | @Lea                 | `npm run build` + component tests  |
| 9-2  | Apply skeletons to PropertyCard, LeadManagementPage, OverviewTab KPIs | P0       | @Lea + @Una          | `npm run build` + visual check     |
| 9-3  | EmptyState + ErrorBoundary components wired to all CRM modules        | P0       | @Una + @Lea          | `npm run build`                    |
| 9-4  | Axe a11y audit + fix Critical/Serious violations                      | P1       | @Africa + @Katherine | `npx @axe-core/cli` → 0 violations |
| 9-5  | Mobile CRM drawer (MobileCRMDrawer.tsx) for < 768px                   | P1       | @Tracy               | Playwright 375px viewport test     |
| 9-6  | RTL layout corrections (`[dir=rtl]` scoped overrides)                 | P2       | @Inas                | RTL screenshot check + lint        |
| 9-7  | Axe scan wired into CI Playwright job                                 | P2       | @Katherine           | CI green + 0 axe violations        |

**Entry gate:** S1 TypeScript baseline green ✅ (0 errors confirmed May 22, 2026)  
**@Ada approval phrase:** `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

## S3 — Wave 10: Performance + SEO + Security (📋 Planned — unlocks when Wave 09 green)

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) | [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md) | [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)  
**Wave Bundle:** [`WAVE_10_SDD.md`](./waves/WAVE_10_SDD.md) | [`WAVE_10_READINESS_PACKET.md`](./waves/WAVE_10_READINESS_PACKET.md) | [`WAVE_10_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_10_IMPLEMENTATION_BACKLOG.md) | [`WAVE_10_TEST_ROLLOUT.md`](./waves/WAVE_10_TEST_ROLLOUT.md)

| Task | Scope                                                       | Priority | Owner          | Validation                                  |
| ---- | ----------------------------------------------------------- | -------- | -------------- | ------------------------------------------- |
| 10-1 | Lighthouse performance audit + lazy-load critical paths     | P0       | @Ruchi         | Lighthouse score >= 85 on prod build        |
| 10-2 | SEO metadata + structured data (JSON-LD) for property pages | P0       | @Rachel        | `npm run build` + meta tag validation       |
| 10-3 | CSP headers + dependency audit + input sanitization sweep   | P1       | @Radia         | `npm audit --audit-level high` + lint clean |
| 10-4 | Redis-backed rate limiting for all public API routes        | P2       | @Mira + @Radia | `npm run quality:quick` + route tests pass  |

**Wave 10 Bundle:** Create `plans/waves/WAVE_10_*` before starting execution.  
**Entry gate:** S2 all-green + readiness >=60% + @Ada approval phrase

## S4 — Wave 11: Incomplete Features + Architecture (📋 Planned — unlocks when Wave 10 green)

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) | [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)  
**Wave Bundle:** [`WAVE_11_SDD.md`](./waves/WAVE_11_SDD.md) | [`WAVE_11_READINESS_PACKET.md`](./waves/WAVE_11_READINESS_PACKET.md) | [`WAVE_11_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_11_IMPLEMENTATION_BACKLOG.md)

Key items:

- **Cron/Scheduler** (Item 6): `node-cron` + `SchedulerService.ts` + rent reminders + lead rescore
- **PDF Engine** (Item 7): `puppeteer` + `exceljs` + contract PDF + Excel exports
- **Email Wiring** (Item 8): wire all orphaned email trigger points
- **Architecture refactors**: `AppError` standardization, service layer extraction, DB index audit

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [ ] Validation command(s) defined in this queue pass
- [ ] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [ ] `npm run plans:validate` passes after tracker update

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and supersede/archive duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Do not treat legacy phase docs as active status sources — all historical docs are in `plans/archives/`.
