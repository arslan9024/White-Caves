# Wave 19 — System Design Document (SDD)

**Wave:** 19  
**Focus:** Identity & Access v2 + CRM Entry Routing + MD Workspace Split + Executive UX Discoverability  
**Status:** ✅ Complete (implemented + validated)  
**Date:** 2026-06-17  
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
2. Dashboard execution contract:
   - `plans/waves/WAVE_19_DASHBOARD_API_CONTRACT.md`
   - endpoint envelopes, freshness rules, and export reliability thresholds
3. Identity & Access v2 execution contract:
   - `plans/waves/WAVE_19_IDENTITY_ACCESS_V2_CONTRACT.md`
   - unified auth entrypoints, state model, route-resolution and lockout behavior
4. Canonical planning updates in:
   - `plans/MASTER_PLAN.md`
   - `plans/PENDING_TASKS_ONLY.md`
   - `plans/waves/README.md`
5. Requirement-traceable task breakdown for implementation execution
6. Validation gate matrix covering auth, routing, IA split, and UX states

---

## Dashboard Planning Upgrade Addendum (2026-06-17)

### A) Execution sequencing guard

Wave 19 dashboard implementation must execute in this order:

1. close open Wave 18.1 dashboard depth dependency (`W18.1-P1-003`)
2. freeze dashboard API contracts (Wave 19 contract doc)
3. implement dashboard UX discoverability/state parity changes
4. run traceability-aligned tests and rollout checks

### B) Dashboard state-system requirements

For both MD workspaces, each major panel must include:

1. loading state
2. success state
3. empty/no-data state
4. retryable error state
5. degraded-data state with safe fallback messaging

### C) KPI threshold gates (Wave 19 dashboard)

1. Dashboard load p95 <= 2200ms
2. Dashboard API p95 <= 700ms (summary/funnel/KPI)
3. Export completion success >= 98% (rolling 7 days)
4. Freshness SLA >= 95% responses with freshness <= 300s
5. WCAG critical violations = 0 on in-scope dashboard surfaces

---

## Exit Criteria

Wave 19 planning is complete when:

1. all Wave 19 requirement IDs are referenced by implementation backlog tasks
2. canonical roadmap and queue include Wave 19 in order
3. test rollout defines pass/fail gates for auth, profile gate, routing, workspace split, and UX states
4. `npm run plans:validate` passes
5. dashboard API contract is published with envelope + error + freshness rules
6. dashboard rollout and rollback triggers are documented with metric thresholds
