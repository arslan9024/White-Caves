# Pending Tasks Only

**Last Updated:** 2026-05-22

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

## Stream Status Board

| Stream | Wave | Objective                                            | Status     | Owners                    | Validation Gate                                      |
| ------ | ---- | ---------------------------------------------------- | ---------- | ------------------------- | ---------------------------------------------------- |
| S1     | 08   | TypeScript/errors stabilization (fast/medium/deep)   | 🔨 Active  | @Mira + @Katherine        | `npm run typecheck && npm run lint && npm run build` |
| S2     | 09   | UX hardening — loading states, error boundaries, RTL | 📋 Planned | @Una + @Lea + @Katherine  | S1 green + readiness >=60% + @Ada approval phrase    |
| S3     | 10   | Performance + SEO + security uplift                  | 📋 Planned | @Ruchi + @Rachel + @Radia | S2 green + readiness >=60% + @Ada approval phrase    |
| S4     | 11   | Incomplete features + architecture refactor          | 🔮 Backlog | @Ada + @Mira              | S3 green + readiness >=60% + @Ada approval phrase    |

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

## S1 — Wave 08: Errors Stabilization Lane (Active)

### Bucketed Backlog

| Bucket        | Priority | Scope / Blockers                                                                    | Owners             | Validation Commands                                                                                                                                    | Pass Condition                                    |
| ------------- | -------- | ----------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Fast-fix      | P0       | Route-level typing/import drift and strict-mode diagnostics in active touched files | @Mira + @Katherine | `npm run typecheck && npm run test:run -- server/routes/linda.routes.test.ts server/routes/nadia.routes.test.ts server/routes/nadia.assistant.test.ts` | Typecheck clean + targeted assistant tests pass   |
| Medium-fix    | P1       | Notifications + compliance route cohesion and regression-safe refactors             | @Mira + @Katherine | `npm run test:run -- server/routes/henry.routes.test.ts && npm run build`                                                                              | Focused suites pass + build pass                  |
| Deep-refactor | P2       | Cross-module consistency cleanup only after fast/medium queues are green            | @Mira + @Gwynne    | `npm run quality:quick`                                                                                                                                | Lint + build + ops tests pass without regressions |

**Wave 08 Artifacts:**
[`WAVE_08_SDD.md`](./waves/WAVE_08_SDD.md) | [`WAVE_08_READINESS_PACKET.md`](./waves/WAVE_08_READINESS_PACKET.md) | [`WAVE_08_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_08_IMPLEMENTATION_BACKLOG.md) | [`WAVE_08_TEST_ROLLOUT.md`](./waves/WAVE_08_TEST_ROLLOUT.md)

## S2 — Wave 09: UX Hardening (Planned — unlocks when S1 green)

**Source:** [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) items 30–33

| Task | Scope                                                         | Priority | Owner       | Validation                                |
| ---- | ------------------------------------------------------------- | -------- | ----------- | ----------------------------------------- |
| 9-1  | Loading skeleton + Suspense error boundaries in CRM modules   | P0       | @Lea        | `npm run build` + visual regression check |
| 9-2  | RTL (Arabic) layout consistency pass across all portal pages  | P1       | @Inas       | RTL toggle screenshot check + lint        |
| 9-3  | Mobile 375px / 768px viewport layout fixes (critical paths)   | P1       | @Tracy      | Playwright viewport tests                 |
| 9-4  | Empty/error/loading states for all data-bound dashboard tiles | P2       | @Una + @Lea | `npm run quality:quick`                   |

**Wave 09 Bundle:** Create `plans/waves/WAVE_09_*` before starting execution.  
**Entry gate:** S1 all-green + `npm run plans:validate` pass + `@Ada — Context Ready (100% Planning Readiness) — Coding Phase Approved`

## S3 — Wave 10: Performance + SEO + Security (Planned — unlocks when S2 green)

**Sources:** [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) | [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md) | [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)

| Task | Scope                                                       | Priority | Owner          | Validation                                  |
| ---- | ----------------------------------------------------------- | -------- | -------------- | ------------------------------------------- |
| 10-1 | Lighthouse performance audit + lazy-load critical paths     | P0       | @Ruchi         | Lighthouse score >= 85 on prod build        |
| 10-2 | SEO metadata + structured data (JSON-LD) for property pages | P0       | @Rachel        | `npm run build` + meta tag validation       |
| 10-3 | CSP headers + dependency audit + input sanitization sweep   | P1       | @Radia         | `npm audit --audit-level high` + lint clean |
| 10-4 | Redis-backed rate limiting for all public API routes        | P2       | @Mira + @Radia | `npm run quality:quick` + route tests pass  |

**Wave 10 Bundle:** Create `plans/waves/WAVE_10_*` before starting execution.  
**Entry gate:** S2 all-green + readiness >=60% + @Ada approval phrase

## S4 — Wave 11: Incomplete Features + Architecture (Backlog)

**Sources:** [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) | [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)

Decompose into tasks once S3 is in flight. Create `plans/waves/WAVE_11_*` bundle at that time.

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [ ] Validation command(s) defined in this queue pass
- [ ] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [ ] `npm run plans:validate` passes after tracker update

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and supersede/archive duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Do not treat legacy phase docs as active status sources — all historical docs are in `plans/archives/`.
