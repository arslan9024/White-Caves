# Wave 17 — Implementation Backlog

**Wave:** 17  
**Focus:** Full UI/UX Luxury Upgrade  
**Status:** ✅ Implemented  
**Date:** 2026-05-25

---

| ID      | Priority | Task                                                                                                                                                                                               | Owner              | Validation                                                                     | Status            |
| ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ | ----------------- |
| W17-001 | P0       | Extend `src/styles/tokens.css` with glassmorphism tokens (`--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`), animation duration vars, and full dark-mode token map                 | @Una + @Noura      | `npm run build` + visual smoke check                                           | ✅ Done           |
| W17-002 | P0       | Add Framer Motion `AnimatePresence` page transition layer in `App.tsx`; implement card hover and modal entry animations with `useReducedMotion()` guard                                            | @Una + @Cyra       | `npm run build` + Playwright smoke                                             | ✅ Done           |
| W17-003 | P1       | Upgrade `PropertyCard.tsx` and search results grid with glassmorphism surface, progressive image loading, and luxury micro-interactions                                                            | @Lea + @Tracy      | `npm run build` + component test                                               | ✅ Done           |
| W17-004 | P1       | Apply glassmorphism KPI tile and chart surface styling to CRM dashboard pages (OverviewTab, ZoeExecutiveCRM, MaryPropertyCRM panels)                                                               | @Una + @Lea        | `npm run build` + visual regression check                                      | ✅ Done           |
| W17-005 | P1       | Mobile responsive audit: run Playwright at 375px viewport across all CRM pages; fix layout breaks, overflow, and touch-target sizing                                                               | @Tracy             | Playwright mobile test suite green                                             | ✅ Done           |
| W17-006 | P1       | Install `vite-plugin-pwa`; add `manifest.json` (gold theme, standalone mode); configure Workbox cache-first for static assets and network-first for `/api/*`; verify offline property list caching | @Una + @Ruchi      | Lighthouse PWA score ≥ 90; install-to-home-screen verified                     | ✅ Done (Wave 15) |
| W17-007 | P1       | WCAG 2.2 audit: integrate `@axe-core/playwright` into Playwright suite; fix all Critical/Serious axe violations; verify 8 new WCAG 2.2 AA criteria; RTL parity final pass                          | @Africa + @Sanaa   | Axe: 0 Critical + 0 Serious; Lighthouse a11y ≥ 95                              | ✅ Done           |
| W17-008 | P0       | Add `@lhci/cli` to GitHub Actions workflow; set Lighthouse CI thresholds (performance ≥ 85, accessibility ≥ 90, best-practices ≥ 85, SEO ≥ 85); fail PR on threshold breach                        | @Katherine + @Cyra | CI green on passing page; CI red on synthetic regression                       | ✅ Done           |
| W17-009 | P0       | Final wave validation                                                                                                                                                                              | @Katherine         | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` | ✅ Done           |

---

## Autopilot Trigger

When `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved` is issued for Wave 17, execute tasks W17-001 → W17-009 in order.

```
@Wave17 — AUTOPILOT: execute all tasks
```

Autopilot hard stops: build failure, typecheck failure, security policy violation, explicit human PAUSE.

---

## Task Dependencies

```
W17-001 (tokens) → W17-002 (animations) → W17-003 (property card) → W17-004 (CRM panels)
W17-001 (tokens) → W17-005 (mobile pass) [parallel to W17-002+]
W17-006 (PWA) — independent, can run parallel to W17-003+
W17-007 (WCAG) — best after W17-005 mobile pass
W17-008 (CI gate) — must run last before W17-009 closeout
W17-009 (closeout) — final, depends on all prior tasks
```
