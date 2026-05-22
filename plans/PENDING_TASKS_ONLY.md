# Pending Tasks Only

**Last Updated:** 2026-05-22

## Canonical Sources

- Roadmap: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Daily tracker: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

## Stream Status Board

| Stream | Objective                                                                                                             | Status      | Owners                    | Validation Gate                                                      |
| ------ | --------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------- | -------------------------------------------------------------------- |
| S1     | Errors stabilization lane (fast/medium/deep buckets)                                                                  | 🔨 Active   | @Mira + @Katherine        | `npm run typecheck && npm run lint && npm run build`                 |
| S2     | [`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md) deferred workstream closeout       | 🕒 Deferred | @Margaret                 | Deferred owner/date remains explicit + revisit date reached          |
| S3     | [`PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md`](./PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md) micro-wave execution | ⬜ Planned  | @Ada + @Margaret + squads | Readiness >=60% + approval phrase + wave bundle linked and validated |

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

## S1 — Errors Stabilization Lane (Active)

### Bucketed Backlog

| Bucket        | Priority | Scope / Blockers                                                                    | Owners             | Validation Commands                                                                                                                                    | Pass Condition                                    |
| ------------- | -------- | ----------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Fast-fix      | P0       | Route-level typing/import drift and strict-mode diagnostics in active touched files | @Mira + @Katherine | `npm run typecheck && npm run test:run -- server/routes/linda.routes.test.ts server/routes/nadia.routes.test.ts server/routes/nadia.assistant.test.ts` | Typecheck clean + targeted assistant tests pass   |
| Medium-fix    | P1       | Notifications + compliance route cohesion and regression-safe refactors             | @Mira + @Katherine | `npm run test:run -- server/routes/henry.routes.test.ts && npm run build`                                                                              | Focused suites pass + build pass                  |
| Deep-refactor | P2       | Cross-module consistency cleanup only after fast/medium queues are green            | @Mira + @Gwynne    | `npm run quality:quick`                                                                                                                                | Lint + build + ops tests pass without regressions |

## S3 — Micro-Wave Queue (Next Phase)

| Wave | Scope                                           | Artifacts                                                                                                                                                                                                                                                        |
| ---- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 08   | Error stabilization + governance hard-gate pass | [`WAVE_08_SDD.md`](./waves/WAVE_08_SDD.md), [`WAVE_08_READINESS_PACKET.md`](./waves/WAVE_08_READINESS_PACKET.md), [`WAVE_08_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_08_IMPLEMENTATION_BACKLOG.md), [`WAVE_08_TEST_ROLLOUT.md`](./waves/WAVE_08_TEST_ROLLOUT.md) |

## Completion Criteria (Hard Rule)

Mark an item complete only when:

- [ ] Validation command(s) defined in this queue pass
- [ ] Evidence is recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
- [ ] `npm run plans:validate` passes after tracker update

## Weekly Planning Hygiene Cycle

- Weekly: prune stale queue items, re-rank blockers by impact, and supersede/archive duplicates.
- Daily: update only canonical trackers (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, `PROJECT_PROGRESS`, `DAILY_MILESTONE_TRACKER`).
- Do not treat downstream legacy phase docs as active status sources.
