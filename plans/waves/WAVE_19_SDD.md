# Wave 19 — System Design Document (SDD)

**Wave:** 19  
**Focus:** Identity & Access v2 + CRM Entry Routing + MD Workspace Split + Executive UX Discoverability  
**Status:** 📋 Planned  
**Date:** 2026-05-26  
**Owners:** @Ada + @Mira + @Una + @Katherine + @Radia

---

## Objective

Design and implement a world-class authentication-to-dashboard journey with explicit profile completion gates, deterministic `/crm` routing, and a clear two-workspace MD information architecture that centralizes AI operations while preserving company/business operational control surfaces.

---

## Scope

1. **Identity & Access v2**
   - Login
   - Signup
   - Forgot-password lifecycle
   - Biometric login
   - Post-login profile completion gate
2. **Post-auth routing**
   - Successful auth → role resolution → `/crm`
   - Guided “complete profile” and “open dashboard” transitions
   - Fallback behavior for pending approval, missing role, and unauthorized role mappings
3. **MD CRM IA split**
   - Workspace A: **Company Structure & Business Process**
   - Workspace B: **AI Command Center**
4. **Dashboard UX quality bar**
   - First-screen executive impact
   - Full state coverage (loading/error/empty/success/degraded)
   - Mobile/tablet + WCAG 2.2 + Arabic/RTL parity
   - High discoverability for major CRM capabilities

---

## Requirement IDs (Wave 19)

### Identity & Access v2

- `REQ-IAMV2-001` Unified auth scope must include login, signup, forgot-password, biometric login, and profile completion gate.
- `REQ-IAMV2-002` Forgot-password flow must include request, verification, reset, success, and lockout/rate-limit behavior.
- `REQ-IAMV2-003` First-time users must be routed to profile completion before full CRM access.
- `REQ-IAMV2-004` Returning users with complete profile must route directly to `/crm`.
- `REQ-IAMV2-005` Profile requirements must be role-aware (client, agent, leadership) with required vs optional fields.
- `REQ-IAMV2-006` Profile completeness rules must explicitly define blocking behavior for CRM access.

### Routing + Access Control

- `REQ-ROUTEV2-001` Auth success must deterministically resolve role before `/crm` routing.
- `REQ-ROUTEV2-002` Pending-approval accounts must route to approval-safe surfaces.
- `REQ-ROUTEV2-003` Missing-role accounts must route to remediation path with explicit user action.
- `REQ-ROUTEV2-004` Unauthorized role mappings must hard-fail into safe fallback route with audit signal.

### MD Workspace Split

- `REQ-MDIA-001` MD dashboard must expose exactly two top-level workspaces.
- `REQ-MDIA-002` Every MD-facing module must map to exactly one workspace.
- `REQ-MDIA-003` Workspace-level KPI definitions and drill-down ownership boundaries must be explicit.
- `REQ-MDIA-004` AI assistant operations must remain centralized under AI Command Center.

### Executive UX + Discoverability

- `REQ-UXMD-001` MD first screen must surface strategic KPIs, urgent actions, system health, and assistant status.
- `REQ-UXMD-002` Both workspaces must support loading/error/empty/success/degraded state patterns.
- `REQ-UXMD-003` UX must preserve mobile/tablet behavior, WCAG 2.2 AA coverage, and Arabic/RTL parity.
- `REQ-UXMD-004` Navigation must make major CRM capabilities discoverable with minimal path ambiguity.

---

## Architecture Constraints

1. Existing creator-email superuser canonicalization to `lion` remains source-of-truth.
2. Existing CRM module registry remains canonical module metadata source.
3. Existing role-resolution and dashboard entry route behavior must be extended, not replaced with conflicting logic.
4. Security controls (rate limits, lockout behavior, auth hardening) must remain consistent with prior waves.

---

## Deliverables

1. Wave 19 planning bundle (SDD, readiness packet, implementation backlog, test rollout)
2. Canonical planning updates in:
   - `plans/MASTER_PLAN.md`
   - `plans/PENDING_TASKS_ONLY.md`
   - `plans/waves/README.md`
3. Requirement-traceable task breakdown for implementation execution
4. Validation gate matrix covering auth, routing, IA split, and UX states

---

## Exit Criteria

Wave 19 planning is complete when:

1. all Wave 19 requirement IDs are referenced by implementation backlog tasks
2. canonical roadmap and queue include Wave 19 in order
3. test rollout defines pass/fail gates for auth, profile gate, routing, workspace split, and UX states
4. `npm run plans:validate` passes
