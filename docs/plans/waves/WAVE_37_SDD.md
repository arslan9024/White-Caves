# Wave 37 — SDD

**Wave:** 37  
**Title:** Frontend Architecture Decomposition  
**Status:** planned  
**Date:** 2026-08-07  
**Predecessor:** Wave 36 (release-readiness documentation closeout)

---

## 1) Objective

Decompose large frontend orchestration surfaces into maintainable architecture boundaries while preserving behavior and route/security guarantees.

## 2) Scope

### In scope

1. Route/page composition refactor planning and implementation slices.
2. Shared UI abstraction extraction and duplication cleanup.
3. Feature boundary normalization for high-change CRM/dashboard areas.
4. Frontend-first acceptance evidence and rollback triggers.

### Out of scope

- New product feature expansion not tied to architecture debt.
- Backend data-model redesign.

## 3) Primary Deliverables

- Refactor-ready route/module architecture map.
- Backlog tasks with P0 frontend-first cluster ordering.
- Validation and rollback gates for each slice.

## 4) Quality Rules

- Preserve route-level auth/RBAC behavior.
- No hidden behavior changes during decomposition.
- Keep each slice testable and independently reversible.

## 5) Dependencies

- Wave 33-36 tracker and docs canon alignment.
- Existing frontend entry surfaces (`src/App.tsx`, dashboard/portal modules).

## 6) Completion Criteria

1. Frontend-first cluster executed before secondary wave lanes.
2. Architecture decomposition tasks are artifact-backed and validation-gated.
3. Planning trackers synchronized and governance validation passes.
