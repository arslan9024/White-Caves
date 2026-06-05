# Wave 19 — Implementation Backlog

**Wave:** 19  
**Focus:** Identity & Access v2 + `/crm` Routing + MD Workspace Split + Executive UX  
**Status:** 📋 Planned  
**Date:** 2026-05-26

---

| ID | Requirement IDs | Priority | Task | Owner | Validation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| W19-001 | REQ-IAMV2-001 | P0 | Publish unified Identity & Access v2 architecture contract across auth entrypoints | @Ada + @Mira | Contract documented and linked in Wave 19 SDD | 📋 Planned |
| W19-002 | REQ-IAMV2-002 | P0 | Implement/align forgot-password journey states: request, verify, reset, success, lockout/rate-limit handling | @Mira + @Radia | Route/service/UI tests for all states pass | 📋 Planned |
| W19-003 | REQ-IAMV2-003, REQ-IAMV2-004, REQ-IAMV2-006 | P0 | Enforce profile completion gate: first-time to profile completion; returning complete users to `/crm` | @Mira + @Katherine | Auth routing integration tests pass | 📋 Planned |
| W19-004 | REQ-IAMV2-005 | P1 | Define and enforce role-specific profile completeness schema (client/agent/leadership) | @Mira | Schema validation + UI form tests pass | 📋 Planned |
| W19-005 | REQ-ROUTEV2-001 | P0 | Standardize auth-success → role-resolution → `/crm` flow across login variants | @Mira | Route consistency checks + regression tests pass | 📋 Planned |
| W19-006 | REQ-ROUTEV2-002, REQ-ROUTEV2-003, REQ-ROUTEV2-004 | P0 | Implement fallback routing for pending-approval, missing-role, unauthorized-role mapping | @Mira + @Radia | Negative-path auth/routing tests pass | 📋 Planned |
| W19-007 | REQ-MDIA-001, REQ-MDIA-002 | P0 | Split MD dashboard into two top-level workspaces with unique module ownership mapping | @Una + @Mira | IA mapping matrix complete + dashboard navigation tests pass | 📋 Planned |
| W19-008 | REQ-MDIA-003, REQ-MDIA-004 | P1 | Define workspace KPIs, drill-down boundaries, and AI-command centralization rules | @Ada + @Una | KPI/spec acceptance review complete | 📋 Planned |
| W19-009 | REQ-UXMD-001, REQ-UXMD-004 | P1 | Deliver first-screen executive information hierarchy + discoverability rules | @Una + @Lea | UX acceptance checklist + smoke tests pass | 📋 Planned |
| W19-010 | REQ-UXMD-002, REQ-UXMD-003 | P0 | Enforce state-system parity (loading/error/empty/success/degraded), mobile/tablet behavior, WCAG 2.2, RTL parity | @Una + @Katherine | Accessibility + responsive + RTL checks pass | 📋 Planned |
| W19-011 | REQ-IAMV2-*, REQ-ROUTEV2-*, REQ-MDIA-*, REQ-UXMD-* | P0 | Wave closeout governance validation and tracker sync | @Katherine | `npm run plans:validate` + tracker evidence updates | 📋 Planned |

---

## Dependency Order

1. W19-001 → W19-002/W19-003/W19-005
2. W19-003 + W19-004 → W19-006
3. W19-007 → W19-008/W19-009/W19-010
4. All tasks → W19-011

---

## Acceptance Gate (Wave-Level)

Wave 19 can be marked complete only when:

1. Auth/profile/routing regression coverage is green
2. MD split IA is shipped with unambiguous module ownership
3. Executive UX states are complete across both workspaces
4. Evidence is reflected in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
5. `npm run plans:validate` passes
