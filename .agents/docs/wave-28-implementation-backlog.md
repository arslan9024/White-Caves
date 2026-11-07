# Wave 28 — Implementation Backlog

**Wave:** 28  
**Focus:** Admin Cockpit & Portal Health Unit Test Suites + Strict Type Refactoring  
**Status:** 🟢 Active  
**Date:** 2026-07-29  
**Entry Gate:** Wave 27 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Category                | Priority | Task                                                                                                                                                                             | Owner               | Validation Command                           | Status      |
| ------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------- | ----------- |
| W28-001 | Test Coverage           | P0       | Create `PortalHealthDashboard.test.tsx` verifying portal sync status badges, error logs, and manual re-sync button                                                              | @Katherine + @Una   | `npx vitest run src/components/admin/__tests__/PortalHealthDashboard.test.tsx` | ✅ Complete  |
| W28-002 | Test Coverage           | P0       | Create `useAdminDashboardData.test.ts` testing hook initialization, KPI metrics aggregation, and mock data loading                                                              | @Katherine + @Mira  | `npx vitest run src/components/admin/hooks/__tests__/useAdminDashboardData.test.ts` | ✅ Complete  |
| W28-003 | TypeScript Strictness   | P1       | Refactor `PortalHealthDashboard.tsx` to eliminate explicit `any` types with strong `PortalSyncStatus` interfaces                                                               | @Mira               | `npm run typecheck`                          | ✅ Complete |
| W28-004 | Wave 28 Closeout        | P0       | Governance audit & tracker sync: `npm run plans:validate` green; update `MASTER_PLAN.md` and `PROJECT_PROGRESS.md`                                                               | @Katherine          | `npm run plans:validate`                     | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 28 can be marked complete when:

1. `PortalHealthDashboard.test.tsx` passes cleanly in Vitest.
2. `useAdminDashboardData.test.ts` passes cleanly in Vitest.
3. `npm run typecheck` passes with exit code 0.
4. `npm run plans:validate` passes with exit code 0.
