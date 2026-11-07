# WAVE_06_SDD.md

## Wave

- **Wave ID:** 06
- **Title:** Component Granularity + Event-Driven Rendering + Arabic RTL Readiness
- **Date:** 2026-05-18
- **Owner:** Frontend Architecture Squad

## Problem Statement

Current UI has mixed component granularity and uneven rendering boundaries across auth/CRM/dashboard surfaces. This increases risk for Arabic localization and unnecessary rerenders on heavy pages.

## Goals

1. Standardize small, cohesive React component composition.
2. Enforce event-driven rendering boundaries (dispatch -> selector -> targeted rerender).
3. Improve Arabic/RTL readiness for critical routes.

## Scope (Wave 06)

- `/signin`
- `/crm`
- `UnifiedDashboardPage` + top tabs (overview, leads, properties, contracts)
- Shared UI blocks used in those pages

## Non-Goals

- Full repo-wide component decomposition
- Visual redesign of all modules
- New business features

## Architecture Decisions

1. **Component Granularity Rule:** smallest meaningful cohesive components only.
2. **Container/View Separation:** orchestration in hooks/containers, display in leaf components.
3. **Event-Driven Rendering Contract:**
   - user event -> action dispatch -> store update -> selector-based rerender.
4. **Localization Boundary:** all user-facing strings in scoped dictionaries.
5. **RTL Compatibility:** directional layout and icon mirroring rules applied in critical flows.

## Technical Strategy

### A. Baseline

- Capture rerender hotspots using React Profiler on `/signin` and `/crm`.

### B. Decomposition

- Split oversized components where one file handles unrelated concerns.
- Preserve stable props contracts to avoid churn.

### C. Rendering Hardening

- Tighten selectors to avoid broad subscriptions.
- Apply memoization to expensive branches.
- Keep heavy module rendering behind lazy/trigger boundaries.

### D. Localization/RTL

- Extract hardcoded strings in critical flow components.
- Validate RTL parity on auth + CRM shell + key tabs.

## Risks

- Over-fragmentation causing maintainability decline.
- Premature memoization increasing complexity.
- RTL regressions in iconography and spacing.

## Mitigations

- Apply decomposition only when measurable gain exists.
- Profiling-first optimization policy.
- Route-specific RTL checklist in QA.

## Exit Criteria

- Critical routes maintain functional parity and pass tests.
- Profiler evidence shows reduced unnecessary rerenders.
- Arabic/RTL checklist passes for wave scope.
