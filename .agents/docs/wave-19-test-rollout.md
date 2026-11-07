# Wave 19 — Test Rollout Plan

**Wave:** 19  
**Focus:** Identity & Access v2 + Dashboard Routing + MD Workspace Split + UX Quality Gates  
**Status:** ✅ Complete (executed + evidence-backed)  
**Date:** 2026-06-17

---

## Validation Matrix

| Area                    | Requirement IDs                                            | Validation Type                                        | Command / Evidence                                                                         | Pass Condition                                        |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Planning governance     | All                                                        | Script validation                                      | `npm run plans:validate`                                                                   | Passes with zero governance violations                |
| Auth core journeys      | REQ-IAMV2-001, REQ-IAMV2-002                               | Integration + UI tests                                 | Login/signup/forgot-password/biometric flow tests                                          | All positive and negative paths pass                  |
| Profile completion gate | REQ-IAMV2-003, REQ-IAMV2-004, REQ-IAMV2-005, REQ-IAMV2-006 | Route + form validation tests                          | First-time vs returning user gate checks by role                                           | Correct route gating and completeness enforcement     |
| Post-auth routing       | REQ-ROUTEV2-001..004                                       | Integration tests                                      | Auth-success role resolution + fallback path tests                                         | Deterministic `/crm` routing + safe fallback behavior |
| MD workspace split      | REQ-MDIA-001, REQ-MDIA-002                                 | Navigation + IA tests                                  | Workspace switch and module ownership verification                                         | Exactly two top-level workspaces; no module overlap   |
| KPI and AI ownership    | REQ-MDIA-003, REQ-MDIA-004                                 | Spec + functional checks                               | Workspace KPI rendering and AI command center boundaries                                   | KPI/drill-down contracts and AI centralization hold   |
| Executive UX states     | REQ-UXMD-001..004                                          | UI state tests + accessibility + RTL/responsive audits | Loading/error/empty/success/degraded evidence, WCAG 2.2 checks, mobile/tablet + RTL review | State parity and UX discoverability pass quality gate |

---

## Required Regression Coverage

1. Login/signup/forgot-password regressions
2. Profile completion gate regressions by role
3. `/crm` routing and role-resolution regressions
4. Pending approval/missing role/unauthorized-role fallback regressions
5. MD workspace switch and module discoverability regressions

---

## REQ → Test Traceability (Dashboard-Critical)

| Requirement  | Test ID        | Evidence Tests / Files                                                                                | Validation Command                                                                                                                          | Expected Outcome                                                                                       |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| REQ-MDIA-001 | W19-T-MDIA-001 | `src/components/dashboard/DashboardSideRail.test.tsx`                                                 | `npm run test:run -- src/components/dashboard/DashboardSideRail.test.tsx -t "workspaces"`                                                   | exactly two top-level MD workspaces are available and routable                                         |
| REQ-MDIA-002 | W19-T-MDIA-002 | `src/config/crmNavigationSchema.test.ts`                                                              | `npm run test:run -- src/config/crmNavigationSchema.test.ts -t "ownership"`                                                                 | each module is owned by one workspace only; no overlap                                                 |
| REQ-MDIA-003 | W19-T-MDIA-003 | `src/config/crmNavigationSchema.test.ts`                                                              | `npm run test:run -- src/config/crmNavigationSchema.test.ts -t "KPI"`                                                                       | KPI cards render only in assigned workspace with correct drill-down routes                             |
| REQ-MDIA-004 | W19-T-MDIA-004 | `src/config/crmNavigationSchema.test.ts`, `src/components/dashboard/DashboardSideRail.test.tsx`       | `npm run test:run -- src/config/crmNavigationSchema.test.ts src/components/dashboard/DashboardSideRail.test.tsx -t "AI command center"`     | AI orchestration controls appear only in workspace B command center                                    |
| REQ-UXMD-001 | W19-T-UX-001   | `src/components/dashboard/SuperuserControlCenter.test.tsx`, `src/pages/UnifiedDashboardPage.test.tsx` | `npm run test:run -- src/components/dashboard/SuperuserControlCenter.test.tsx src/pages/UnifiedDashboardPage.test.tsx -t "executive"`       | first viewport shows critical KPIs/actions without hidden primary tasks                                |
| REQ-UXMD-002 | W19-T-UX-002   | `src/pages/UnifiedDashboardPage.test.tsx`                                                             | `npm run test:run -- src/pages/UnifiedDashboardPage.test.tsx -t "empty-state"`                                                              | loading/success/empty/error/degraded states all render and recover correctly                           |
| REQ-UXMD-003 | W19-T-UX-003   | `src/pages/UnifiedDashboardPage.test.tsx`, `src/pages/UnifiedDashboardPage.css`                       | `npm run test:run -- src/pages/UnifiedDashboardPage.test.tsx -t "workspaces"`                                                               | WCAG-critical dashboard checks pass, RTL logical styling applied, mobile/tablet key journeys preserved |
| REQ-UXMD-004 | W19-T-UX-004   | `src/components/dashboard/SuperuserControlCenter.test.tsx`, `src/pages/UnifiedDashboardPage.test.tsx` | `npm run test:run -- src/components/dashboard/SuperuserControlCenter.test.tsx src/pages/UnifiedDashboardPage.test.tsx -t "discoverability"` | primary executive tasks reachable in <= 2 navigational actions                                         |

---

## Performance + Reliability Gates

| Gate               | Target                                | Evidence                                           |
| ------------------ | ------------------------------------- | -------------------------------------------------- |
| Dashboard API p95  | <= 700ms                              | route timing logs for summary/funnel/KPI endpoints |
| Dashboard load p95 | <= 2200ms                             | browser perf trace and dashboard render timings    |
| Export reliability | >= 98% success / 7-day rolling        | export job completion logs                         |
| Freshness SLA      | >= 95% of responses <= 300s freshness | freshness field audit in API responses             |

---

## Completion Rules

Wave 19 cannot close unless:

1. all P0 tasks have passing validation evidence
2. required regressions pass with no unresolved blocker
3. dashboard performance and reliability gates are met or risk-accepted with explicit waiver
4. evidence is logged in:
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
5. canonical planning stack remains synchronized:
   - `MASTER_PLAN.md`
   - `PENDING_TASKS_ONLY.md`
   - `waves/README.md`
