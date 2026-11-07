# Wave 09 — System Design Document (SDD)

**Wave:** 09  
**Focus:** UX Hardening — Loading States, Error Boundaries, RTL, Mobile  
**Status:** 🟢 Ready (S1 Wave 08 baseline green)  
**Date:** 2026-05-22  
**Owners:** @Una + @Lea + @Tracy + @Inas + @Katherine  
**Entry Gate:** S1 green ✅ + `npm run plans:validate` pass ✅ + readiness ≥ 60% ✅  
**Approval:** `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

## Scope

Wave 09 closes the UX polish gap by delivering:

1. **Skeleton loading screens** across all data-bound components (replaces spinners/blank states)
2. **WCAG 2.1 AA accessibility compliance** (axe critical+serious violations resolved)
3. **Mobile CRM responsive layout** (tablet collapse + phone drawer)
4. **Empty / error / loading state library** for all dashboard tiles

Source: [`IMPROVEMENTS_UX.md`](../IMPROVEMENTS_UX.md) items 30–33

---

## Architecture Overview

```
src/components/ui/
  Skeleton/
    Skeleton.tsx           ← base animated rectangle
    SkeletonText.tsx        ← multi-line text placeholder
    SkeletonCard.tsx        ← property card shape
    SkeletonTable.tsx       ← CRM table rows
    SkeletonKPI.tsx         ← dashboard KPI tile
    index.ts               ← barrel export

src/components/ui/
  EmptyState.tsx            ← reusable empty state with icon + CTA
  ErrorBoundary.tsx         ← React error boundary with fallback UI

src/components/crm/
  MobileCRMDrawer.tsx       ← slide-over drawer for < 768px

src/styles/
  skeleton.css              ← pulse animation (gold brand color)
  rtl-overrides.css         ← RTL layout corrections
```

---

## Key Design Decisions

| Decision             | Choice                                           | Reason                                                              |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| Animation color      | Gold at 15% opacity (`rgba(201, 168, 76, 0.15)`) | Matches luxury brand; avoids grey which looks low-quality           |
| Skeleton trigger     | `isLoading` from Redux slice                     | Single source of truth; consistent across all data-bound components |
| Error boundary scope | Per-tab / per-CRM-module                         | Isolates failures; doesn't crash entire app                         |
| Mobile breakpoints   | 375px / 768px / 1024px / 1440px                  | Aligns with `IMPROVEMENTS_UX.md` spec                               |
| RTL direction        | CSS `dir` attribute + CSS logical properties     | Best browser support; avoids layout duplication                     |
| Drawer gesture       | `touchstart`/`touchmove` (no external lib)       | Keeps bundle small; luxury feel                                     |

---

## Component Inventory

### Skeleton Components

| Component       | Used In                                                       | Trigger                |
| --------------- | ------------------------------------------------------------- | ---------------------- |
| `SkeletonCard`  | `PropertyCard.tsx`                                            | `properties.isLoading` |
| `SkeletonTable` | `LeadManagementPage.tsx`, `FavoritesPage.tsx`, all CRM tables | `leads.isLoading`      |
| `SkeletonKPI`   | `OverviewTab.tsx` KPI tiles                                   | `dashboard.isLoading`  |
| `SkeletonText`  | `PropertyDetailPage.tsx` hero text                            | `property.isLoading`   |

### State Components

| Component       | Used In                 | States Covered                            |
| --------------- | ----------------------- | ----------------------------------------- |
| `EmptyState`    | All list/table views    | `empty` (no data), `error` (fetch failed) |
| `ErrorBoundary` | Each CRM module wrapper | React render crash                        |

---

## Non-Functional Requirements

| Requirement              | Target                  | Measurement                         |
| ------------------------ | ----------------------- | ----------------------------------- |
| Lighthouse CLS           | < 0.1                   | `npm run build` + Lighthouse CLI    |
| Lighthouse Accessibility | ≥ 95                    | `npx @axe-core/cli` on built bundle |
| Mobile render (375px)    | No horizontal scroll    | Playwright viewport test            |
| RTL layout               | No overlapping elements | Screenshot comparison               |

---

## Dependencies

- No new npm packages required (skeleton is pure CSS + React)
- Requires Wave 08 S1 baseline to be green (✅ confirmed May 22, 2026)

---

## Validation Commands

```bash
npm run build
npm run lint
npm run test:run -- src/components/ui
npm run quality:quick
```
