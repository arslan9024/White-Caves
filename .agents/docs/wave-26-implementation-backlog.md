# Wave 26 — Implementation Backlog

**Wave:** 26  
**Focus:** Production Quality, Test Reliability, Source TODO Resolution & Executive UI Hardening  
**Status:** 🟢 Active  
**Date:** 2026-07-22  
**Entry Gate:** Wave 25 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Category                | Priority | Task                                                                                                                                                                             | Owner               | Validation Command                           | Status      |
| ------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------- | ----------- |
| W26-001 | Test Reliability        | P0       | Wrap `ToastProvider` globally in `App.tsx` and test wrappers to eliminate unhandled `useToast must be used within ToastProvider` context errors in Vitest runs                   | @Mira + @Una        | `npx vitest run`                             | ✅ Complete |
| W26-002 | Source Code Hygiene     | P1       | Resolve 35 source code `TODO` / `FIXME` / `STUB` items in `codeAnalysisService.js`, `FinanceView.tsx`, and `SalesView.tsx`                                                       | @Mira + @Barbara    | `node scripts/orchestrator/codebase-scan.js` | ✅ Complete |
| W26-003 | Executive UI Hardening  | P0       | Refactor `ProfilePage.tsx` into a high-density executive credential layout with security badges (`Principal Founder`, `System Superuser`, `Level 5 Admin`) & active session logs | @Una                | `npm run build`                              | ✅ Complete |
| W26-004 | Dashboard Consolidation | P0       | Consolidate master cockpit in `UnifiedDashboardPage.tsx` with 5-column `<KPICard>` strip and gamified Chairman's Club leaderboard                                                | @Una + @Mala        | `npm run build`                              | ✅ Complete |
| W26-005 | Test DOM Matchers       | P1       | Resolve Vitest DOM matcher query ambiguities in `LeadsTab.test.tsx` and `BiometricSetup.test.tsx`                                                                                | @Katherine          | `npx vitest run`                             | ✅ Complete |
| W26-006 | Documentation Depth     | P2       | Expand 91 under-specified business documentation files across `business_docs/02_infrastructure/` to 100% section coverage                                                        | @Sofia + @Invoice   | `npm run plans:validate`                     | ✅ Complete |
| W26-007 | Wave 26 Closeout        | P0       | Governance audit & tracker sync: `npm run plans:validate` green; update `MASTER_PLAN.md` and `PROJECT_PROGRESS.md`                                                               | @Katherine          | `npm run plans:validate`                     | ✅ Complete |
| W26-008 | Business Engine         | P0       | Implement 180-day 70/30 onboarding buffer & dynamic slab tiers (Tier 1 50% to Tier 4 70%) in `dubaiFinanceEngine.ts` and `commissionEngine.ts`                                   | @Invoice + @Barbara | `npm run build`                              | ✅ Complete |
| W26-009 | Deal Attribution        | P0       | Implement Multi-Agent Deal Attribution engine (Direct 100%, Internal Split 50/50, Referral 10/90) with point weighting calculations                                              | @Invoice + @Mira    | `npm run build`                              | ✅ Complete |
| W26-010 | Leaderboard Engine      | P0       | Implement Dual-Track Leaderboard (Track A Sales GWC vs Track B Leasing Volume) with automated milestone rewards (Cave Master AED 2500, Chairman's Circle 75% lock)               | @Una + @Invoice     | `npm run build`                              | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 26 can be marked complete when:

1. `ToastProvider` is active across all React component routes and test contexts.
2. 35 source code TODOs are resolved or migrated to formal tracking tickets.
3. `ProfilePage.tsx` displays Level 5 Founder badges and session audit logs.
4. `UnifiedDashboardPage.tsx` renders executive KPI cards and leaderboard without errors.
5. All Vitest test suites run green with 0 unhandled errors.
6. `npm run plans:validate` passes with exit code 0.
