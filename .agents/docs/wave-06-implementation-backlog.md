# WAVE_06_IMPLEMENTATION_BACKLOG.md

## Wave 06 Backlog

## Epic A — Component Granularity Audit

1. Audit `/signin` component tree for decomposition opportunities.
2. Audit `/crm` command center component composition.
3. Audit `UnifiedDashboardPage` and top tabs for oversized rendering responsibilities.
4. Produce component split proposals with before/after boundaries.

## Epic B — Event-Driven Rendering Hardening

5. Audit selector subscriptions for broad rerender triggers.
6. Narrow selectors for auth + CRM + dashboard shell components.
7. Add memoization boundaries for expensive derived UI segments.
8. Keep lazy-render gating for heavy modules and tab-triggered content.

## Epic C — Localization + RTL Readiness

9. Extract hardcoded strings in wave scope components.
10. Add direction-aware spacing/alignment checks.
11. Validate directional icon behavior in RTL.
12. Run Arabic/LTR parity checks for critical routes.

## Epic D — Verification

13. Capture React Profiler baseline and post-change comparison.
14. Run targeted auth + dashboard tests after each micro-slice.
15. Execute manual UX checklist for `/signin` and `/crm`.
16. Record outcomes in deployment/progress logs.

## Definition of Done

- All wave-scope tasks complete with no regression in existing tests.
- Measurable reduction in unnecessary rerenders on critical screens.
- Arabic RTL parity confirmed for critical routes.
- Docs and tracker entries synchronized.
