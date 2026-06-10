# Wave 19 — Test Rollout Plan

**Wave:** 19  
**Focus:** Identity & Access v2 + Dashboard Routing + MD Workspace Split + UX Quality Gates  
**Status:** 📋 Planned  
**Date:** 2026-05-26

---

## Validation Matrix

| Area | Requirement IDs | Validation Type | Command / Evidence | Pass Condition |
| --- | --- | --- | --- | --- |
| Planning governance | All | Script validation | `npm run plans:validate` | Passes with zero governance violations |
| Auth core journeys | REQ-IAMV2-001, REQ-IAMV2-002 | Integration + UI tests | Login/signup/forgot-password/biometric flow tests | All positive and negative paths pass |
| Profile completion gate | REQ-IAMV2-003, REQ-IAMV2-004, REQ-IAMV2-005, REQ-IAMV2-006 | Route + form validation tests | First-time vs returning user gate checks by role | Correct route gating and completeness enforcement |
| Post-auth routing | REQ-ROUTEV2-001..004 | Integration tests | Auth-success role resolution + fallback path tests | Deterministic `/crm` routing + safe fallback behavior |
| MD workspace split | REQ-MDIA-001, REQ-MDIA-002 | Navigation + IA tests | Workspace switch and module ownership verification | Exactly two top-level workspaces; no module overlap |
| KPI and AI ownership | REQ-MDIA-003, REQ-MDIA-004 | Spec + functional checks | Workspace KPI rendering and AI command center boundaries | KPI/drill-down contracts and AI centralization hold |
| Executive UX states | REQ-UXMD-001..004 | UI state tests + accessibility + RTL/responsive audits | Loading/error/empty/success/degraded evidence, WCAG 2.2 checks, mobile/tablet + RTL review | State parity and UX discoverability pass quality gate |

---

## Required Regression Coverage

1. Login/signup/forgot-password regressions
2. Profile completion gate regressions by role
3. `/crm` routing and role-resolution regressions
4. Pending approval/missing role/unauthorized-role fallback regressions
5. MD workspace switch and module discoverability regressions

---

## Completion Rules

Wave 19 cannot close unless:

1. all P0 tasks have passing validation evidence
2. required regressions pass with no unresolved blocker
3. evidence is logged in:
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
4. canonical planning stack remains synchronized:
   - `MASTER_PLAN.md`
   - `PENDING_TASKS_ONLY.md`
   - `waves/README.md`
