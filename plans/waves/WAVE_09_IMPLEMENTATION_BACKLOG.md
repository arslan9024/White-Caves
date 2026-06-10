# Wave 09 — Implementation Backlog

**Wave:** 09  
**Focus:** UX Hardening — Skeleton Screens, Accessibility, Mobile, RTL  
**Status:** ✅ Complete  
**Date:** 2026-05-24

---

## Backlog

| ID     | Priority | Task                                                                                                                                                                    | Owner                | Files Affected                                                            | Validation                                               | Status  |
| ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| W9-001 | P0       | Create Skeleton base components (`Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable`, `SkeletonKPI`) in `src/components/ui/Skeleton/` with gold pulse animation | @Lea                 | `src/components/ui/Skeleton/*.tsx`, `src/styles/skeleton.css`             | `npm run build && npm run test:run -- src/components/ui` | ✅ Complete |
| W9-002 | P0       | Apply `SkeletonCard` to `PropertyCard.tsx` while `properties.isLoading`                                                                                                 | @Lea                 | `src/components/properties/PropertyCard.tsx`                              | `npm run build` + visual check                           | ✅ Complete |
| W9-003 | P0       | Apply `SkeletonTable` to `LeadManagementPage.tsx`, `FavoritesPage.tsx`, and all CRM list pages while data loads                                                         | @Lea + @Una          | `src/pages/crm/LeadManagementPage.tsx`, `src/pages/crm/FavoritesPage.tsx` | `npm run build`                                          | ✅ Complete |
| W9-004 | P0       | Apply `SkeletonKPI` to `OverviewTab.tsx` KPI tiles while `dashboard.isLoading`                                                                                          | @Una                 | `src/components/owner/tabs/OverviewTab.tsx`                               | `npm run test:run -- src/components/owner`               | ✅ Complete |
| W9-005 | P0       | Add `EmptyState` component and wire to all list/table views (no data + error states)                                                                                    | @Una + @Lea          | `src/components/ui/EmptyState.tsx`, all CRM list pages                    | `npm run build`                                          | ✅ Complete |
| W9-006 | P1       | Create `ErrorBoundary` component and wrap each CRM module tab                                                                                                           | @Lea                 | `src/components/ui/ErrorBoundary.tsx`, CRM module wrappers                | `npm run build`                                          | ✅ Complete |
| W9-007 | P1       | Run `npx @axe-core/cli` audit → fix all Critical and Serious axe violations (focus on contrast, labels, landmarks)                                                      | @Africa + @Katherine | Various — per axe report                                                  | `npx @axe-core/cli` zero Critical/Serious                | ✅ Complete |
| W9-008 | P1       | Add skip-to-content link + verify full keyboard navigation on homepage + property search                                                                                | @Africa              | `src/App.tsx`, `src/pages/HomePage.tsx`                                   | Manual keyboard test + axe scan                          | ✅ Complete |
| W9-009 | P1       | Mobile CRM sidebar collapse: icon-only at 1024px, `MobileCRMDrawer` slide-over at 768px with swipe gestures                                                             | @Tracy               | `src/components/ui/MobileCRMDrawer.tsx`, CRM layout CSS                   | Playwright 375px viewport test                           | ✅ Complete |
| W9-010 | P2       | RTL layout corrections: scope `rtl-overrides.css` to `[dir=rtl]` selectors; fix element mirroring across portal pages                                                   | @Inas                | `src/styles/rtl-overrides.css`, portal layout files                       | RTL toggle screenshot check + lint                       | ✅ Complete |
| W9-011 | P2       | Wire axe accessibility scan into CI (Playwright `accessibility.audit.spec.ts` — fail on new violations)                                                                 | @Katherine           | `.github/workflows/`, `e2e/accessibility.audit.spec.ts`                   | CI green + axe zero violations                           | ✅ Complete |
| W9-012 | P2       | `PropertyDetailPage.tsx` skeleton for hero image + details section                                                                                                      | @Lea                 | `src/pages/PropertyDetailPage.tsx`                                        | `npm run build`                                          | ✅ Complete |

---

## Execution Order

```
Phase 1 (P0 — skeletons):  W9-001 → W9-002 → W9-003 → W9-004 → W9-005
Phase 2 (P1 — a11y + mobile): W9-006 → W9-007 → W9-008 → W9-009
Phase 3 (P2 — polish):      W9-010 → W9-011 → W9-012
```

---

## Completion Rule

No item marked complete until:

- Validation command(s) pass
- Evidence in `PROJECT_PROGRESS.md` + `DAILY_MILESTONE_TRACKER.md`
- `npm run plans:validate` passes after tracker update
