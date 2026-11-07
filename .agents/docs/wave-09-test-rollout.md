# Wave 09 — Test Rollout Plan

**Wave:** 09  
**Focus:** UX Hardening — Skeleton Screens, Accessibility, Mobile, RTL  
**Status:** 🟢 Ready to Execute  
**Date:** 2026-05-22

---

## Test Strategy

Wave 09 is frontend-only. No API or database changes → regression risk is confined to:

1. Layout regressions (components suddenly invisible, misaligned, overflowing)
2. Accessibility regressions (new violations introduced)
3. Redux state regressions (isLoading flag not wired correctly)

---

## Unit Tests (Vitest)

| Test File                                                          | Coverage Target                                                                             | Trigger                                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `src/components/ui/Skeleton/__tests__/Skeleton.test.tsx`           | `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable`, `SkeletonKPI` render correctly | `npm run test:run -- src/components/ui/Skeleton` |
| `src/components/ui/__tests__/EmptyState.test.tsx`                  | EmptyState renders icon + message + CTA; `onAction` called on click                         | `npm run test:run -- src/components/ui`          |
| `src/components/ui/__tests__/ErrorBoundary.test.tsx`               | ErrorBoundary catches thrown error + shows fallback UI                                      | `npm run test:run -- src/components/ui`          |
| `src/pages/crm/__tests__/LeadManagementPage.loading.test.tsx`      | Shows `SkeletonTable` when `leads.isLoading === true`; shows data rows when loaded          | `npm run test:run -- src/pages/crm`              |
| `src/components/owner/tabs/__tests__/OverviewTab.loading.test.tsx` | Shows `SkeletonKPI` tiles when `dashboard.isLoading === true`                               | `npm run test:run -- src/components/owner`       |

---

## Accessibility Audit

| Tool                         | Command                                                                | Pass Condition                   |
| ---------------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| axe-core CLI                 | `npx @axe-core/cli http://localhost:5173`                              | 0 Critical, 0 Serious violations |
| axe-core CLI — property page | `npx @axe-core/cli http://localhost:5173/properties/test-id`           | 0 Critical, 0 Serious violations |
| axe-core CLI — CRM login     | `npx @axe-core/cli http://localhost:5173/crm`                          | 0 Critical, 0 Serious violations |
| Lighthouse                   | `npx lighthouse http://localhost:5173 --only-categories=accessibility` | Score ≥ 95                       |

---

## Playwright E2E Tests

| Test                              | Viewport   | Scenario                                                   | Pass Condition                 |
| --------------------------------- | ---------- | ---------------------------------------------------------- | ------------------------------ |
| `e2e/ux-mobile.spec.ts`           | 375 × 812  | Visit CRM → hamburger visible → tap → drawer slides in     | Drawer visible, no overflow    |
| `e2e/ux-mobile.spec.ts`           | 768 × 1024 | Visit CRM → sidebars collapse to icon-only                 | Sidebars 48px wide             |
| `e2e/ux-rtl.spec.ts`              | 1440 × 900 | Toggle `dir=rtl` on portal pages → check element mirroring | No overflow, correct alignment |
| `e2e/accessibility.audit.spec.ts` | 1440 × 900 | axe scan on main routes                                    | 0 violations                   |

---

## Regression Gate

Run before merging each Wave 09 PR:

```bash
npm run build
npm run lint
npm run quality:quick
npm run test:run -- src/components/ui src/pages/crm src/components/owner
```

All must pass with no new failures.

---

## CI Integration

Wave 09 adds:

1. `e2e/ux-mobile.spec.ts` — new file
2. `e2e/ux-rtl.spec.ts` — new file
3. axe scan wired into `e2e/accessibility.audit.spec.ts` — extended

These tests run in the existing Playwright CI job (`npm run test:e2e`).
