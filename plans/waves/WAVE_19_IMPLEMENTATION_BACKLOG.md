# Wave 19 — Implementation Backlog

**Wave:** 19  
**Focus:** Identity & Access v2 + `/crm` Routing + MD Workspace Split + Executive UX  
**Status:** ✅ Complete (execution-enriched)  
**Date:** 2026-06-17

---

| ID      | Requirement IDs                                    | Priority | Task                                                                                                             | Owner               | Validation                                                                                                                                                                                                                  | Status      |
| ------- | -------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| W19-001 | REQ-IAMV2-001                                      | P0       | Publish unified Identity & Access v2 architecture contract across auth entrypoints                               | @Ada + @Mira        | Contract documented and linked in Wave 19 SDD (`WAVE_19_IDENTITY_ACCESS_V2_CONTRACT.md`)                                                                                                                                    | ✅ Complete |
| W19-002 | REQ-IAMV2-002                                      | P0       | Implement/align forgot-password journey states: request, verify, reset, success, lockout/rate-limit handling     | @Mira + @Radia      | Route/service/UI tests for all states pass (`server/routes/auth.test.ts`, `src/hooks/useSignIn.test.ts`)                                                                                                                    | ✅ Complete |
| W19-003 | REQ-IAMV2-003, REQ-IAMV2-004, REQ-IAMV2-006        | P0       | Enforce profile completion gate: first-time to profile completion; returning complete users to `/crm`            | @Mira + @Katherine  | Auth routing integration tests pass (`src/utils/routing.test.ts`, `src/hooks/useSignIn.test.ts`, `server/routes/auth.test.ts`)                                                                                              | ✅ Complete |
| W19-004 | REQ-IAMV2-005                                      | P1       | Define and enforce role-specific profile completeness schema (client/agent/leadership)                           | @Mira               | Schema validation + auth/profile route tests pass (`server/routes/auth.test.ts`, `src/hooks/useSignIn.test.ts`, `src/utils/routing.test.ts`)                                                                                | ✅ Complete |
| W19-005 | REQ-ROUTEV2-001                                    | P0       | Standardize auth-success → role-resolution → `/crm` flow across login variants                                   | @Mira               | Route consistency checks + regression tests pass (`src/utils/authSession.test.ts`, `src/utils/routing.test.ts`, `src/hooks/useSignIn.test.ts`, `server/routes/auth.test.ts`)                                                | ✅ Complete |
| W19-006 | REQ-ROUTEV2-002, REQ-ROUTEV2-003, REQ-ROUTEV2-004  | P0       | Implement fallback routing for pending-approval, missing-role, unauthorized-role mapping                         | @Mira + @Radia      | Negative-path auth/routing tests pass (`src/utils/routing.test.ts`, `src/utils/authSession.test.ts`, `src/hooks/useSignIn.test.ts`)                                                                                         | ✅ Complete |
| W19-007 | REQ-MDIA-001, REQ-MDIA-002                         | P0       | Split MD dashboard into two top-level workspaces with unique module ownership mapping                            | @Una + @Mira        | IA mapping matrix complete + dashboard navigation tests pass (`src/config/crmNavigationSchema.test.ts`, `src/components/dashboard/DashboardSideRail.test.tsx`)                                                              | ✅ Complete |
| W19-008 | REQ-MDIA-003, REQ-MDIA-004                         | P1       | Define workspace KPIs, drill-down boundaries, and AI-command centralization rules                                | @Ada + @Una         | KPI/spec acceptance review complete (`plans/waves/WAVE_19_DASHBOARD_API_CONTRACT.md`) + ownership tests pass (`src/config/crmNavigationSchema.test.ts`)                                                                     | ✅ Complete |
| W19-009 | REQ-UXMD-001, REQ-UXMD-004                         | P1       | Deliver first-screen executive information hierarchy + discoverability rules                                     | @Una + @Lea         | UX acceptance checklist + smoke tests pass (`src/components/dashboard/SuperuserControlCenter.test.tsx`, `src/components/dashboard/DashboardSideRail.test.tsx`, `src/pages/UnifiedDashboardPage.test.tsx`)                   | ✅ Complete |
| W19-010 | REQ-UXMD-002, REQ-UXMD-003                         | P0       | Enforce state-system parity (loading/error/empty/success/degraded), mobile/tablet behavior, WCAG 2.2, RTL parity | @Una + @Katherine   | Targeted executive/MD empty-state checks pass (`src/pages/UnifiedDashboardPage.test.tsx`, `src/components/dashboard/SuperuserControlCenter.test.tsx`) + RTL-safe logical CSS applied (`src/pages/UnifiedDashboardPage.css`) | ✅ Complete |
| W19-011 | REQ-MDIA-003, REQ-MDIA-004, REQ-UXMD-002           | P0       | Lock Wave 19 dashboard API contract and envelope/error/freshness standards (`WAVE_19_DASHBOARD_API_CONTRACT.md`) | @Ada + @Mira        | Contract doc published and linked from bundle (`WAVE_19_SDD.md`, `WAVE_19_READINESS_PACKET.md`, `plans/waves/README.md`)                                                                                                    | ✅ Complete |
| W19-012 | REQ-UXMD-001, REQ-UXMD-002, REQ-UXMD-004           | P1       | Add requirement-to-test traceability matrix for dashboard IA/state-system/discoverability                        | @Katherine          | Trace matrix expanded with test IDs, evidence files, and validation commands in `WAVE_19_TEST_ROLLOUT.md`                                                                                                                   | ✅ Complete |
| W19-013 | REQ-MDIA-003, REQ-UXMD-003                         | P1       | Define dashboard rollout/rollback trigger thresholds (p95 latency, export reliability, freshness SLA)            | @Katherine + @Radia | Threshold gates and rollback matrix documented in `WAVE_19_DASHBOARD_API_CONTRACT.md`                                                                                                                                       | ✅ Complete |
| W19-014 | REQ-MDIA-_, REQ-UXMD-_                             | P0       | Sequence guard: verify `W18.1-P1-003` closure evidence before dashboard implementation start                     | @Mira + @Katherine  | Evidence confirmed: `GET /api/dashboard/agent-performance` (filterable), `POST .../export`, `GET .../export/:jobId` delivered + `server/routes/reporting.test.ts` 32/32 ✅                                                  | ✅ Complete |
| W19-015 | REQ-IAMV2-_, REQ-ROUTEV2-_, REQ-MDIA-_, REQ-UXMD-_ | P0       | Wave closeout governance validation and tracker sync                                                             | @Katherine          | `npm run plans:validate` + tracker evidence updates                                                                                                                                                                         | ✅ Complete |

---

## Dependency Order

1. W19-001 → W19-002/W19-003/W19-005
2. W19-003 + W19-004 → W19-006
3. W19-007 → W19-008/W19-009/W19-010
4. W19-011 + W19-014 → W19-012/W19-013
5. All tasks → W19-015

---

## Acceptance Gate (Wave-Level)

Wave 19 can be marked complete only when:

1. Auth/profile/routing regression coverage is green
2. MD split IA is shipped with unambiguous module ownership
3. Executive UX states are complete across both workspaces
4. Evidence is reflected in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
5. `npm run plans:validate` passes
6. Dashboard API p95 <= 700ms for summary/funnel/KPI endpoints
7. Dashboard load p95 <= 2200ms and export success >= 98% (rolling 7 days)
8. KPI freshness SLA >= 95% within 300s freshness window
