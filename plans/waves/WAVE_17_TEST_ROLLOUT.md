# Wave 17 — Test Rollout Plan

**Wave:** 17  
**Focus:** Full UI/UX Luxury Upgrade  
**Status:** 📋 Planned  
**Date:** 2026-05-25

---

## Test Matrix

| Area | Test Type | Validation Command / Tool | Pass Condition |
| --- | --- | --- | --- |
| Design tokens | Visual smoke | `npm run build` + browser DevTools token inspection | All `--glass-*` and `--color-*` vars resolve; no broken `var()` references |
| Framer Motion animations | Playwright smoke | `npm run test:e2e:local` — homepage + CRM hub page transitions | Animations fire; no FOUC; no layout shift on entry |
| Reduced motion | Playwright | Playwright with `prefers-reduced-motion: reduce` media feature | Animations skipped; no static layout breaks |
| Property card luxury upgrade | Component test | `npm run test:run -- src/**/*PropertyCard*` | Glassmorphism surface renders; image loads progressively; hover state correct |
| CRM dashboard glassmorphism | Visual regression | `npm run build` + Playwright screenshot | KPI tiles use glass surface; no color token regression |
| Mobile 375px — all CRM pages | Playwright | `npm run test:e2e:local` at 375px viewport | No horizontal scroll; no overlapping elements; touch targets ≥ 44px |
| Mobile 768px (tablet) | Playwright | Playwright at 768px viewport | Sidebar collapses to icon-only or drawer; content is full-width |
| PWA manifest | Lighthouse PWA | `npx @lhci/cli collect + assert` | PWA score ≥ 90; manifest valid; service worker registered |
| PWA offline | Manual + Lighthouse | Chrome DevTools offline mode | Property list page loads from cache when offline |
| WCAG 2.2 AA — Critical | Axe Playwright | `@axe-core/playwright` in Playwright suite | 0 Critical violations on: homepage, sign-in, CRM hub, property page, lead management |
| WCAG 2.2 AA — Serious | Axe Playwright | Same as above | 0 Serious violations |
| WCAG 2.2 new criteria | Manual + Axe | Playwright + manual keyboard/SR test | Focus Appearance, Target Size, Accessible Authentication — all pass |
| RTL parity | Playwright | Playwright with `dir="rtl"` on `<html>` | Arabic layout mirrors LTR structure; icons flip correctly |
| Lighthouse performance | Lighthouse CI | `@lhci/cli assert` | Performance ≥ 90 on homepage + properties page |
| Lighthouse accessibility | Lighthouse CI | `@lhci/cli assert` | Accessibility ≥ 95 on homepage + CRM login |
| Lighthouse CI gate in PR | GitHub Actions | `.github/workflows/lighthouse.yml` | CI fails PR when threshold breached |
| Regression | `npm run build && npm run plans:validate` | Both pass | No regressions from prior waves |
| TypeScript | `npm run typecheck` | Exit code 0 | No new TS errors introduced |
| Lint | `npm run lint` | Exit code 0 | No new ESLint violations |

---

## Wave Closeout Checklist

- [ ] W17-001 tokens: all `--glass-*` vars present in `src/styles/tokens.css`
- [ ] W17-002 animations: `AnimatePresence` in `App.tsx`; `useReducedMotion()` guard present
- [ ] W17-003 property card: glassmorphism surface + progressive image loading
- [ ] W17-004 CRM panels: KPI tiles use glass surface
- [ ] W17-005 mobile: Playwright mobile suite green at 375px
- [ ] W17-006 PWA: `vite-plugin-pwa` installed; manifest valid; service worker registered
- [ ] W17-007 WCAG: axe 0 Critical + 0 Serious; RTL parity confirmed
- [ ] W17-008 Lighthouse CI: `.github/workflows/lighthouse.yml` added; thresholds enforced
- [ ] W17-009 closeout: `npm run typecheck && npm run lint && npm run build && npm run plans:validate` all pass
- [ ] Evidence recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
