# Wave 17 — System Design Document (SDD)

**Wave:** 17  
**Focus:** Full UI/UX Luxury Upgrade (Design Tokens + Animations + Glassmorphism + Mobile + PWA + WCAG 2.2)  
**Status:** ✅ Complete  
**Date:** 2026-05-25  
**Owners:** @Una + @Lea + @Tracy + @Africa + @Cyra + @Noura + @Sanaa + @Katherine  
**Entry Gate:** ✅ Satisfied (Wave 16 green + readiness + coding approval phrase issued)

---

## Scope

Wave 17 completes the luxury brand elevation pass across the full White Caves product surface:

- **17-1:** Global design token system — glassmorphism, extended gold/dark CSS vars
- **17-2:** Framer Motion animation layer — page transitions, card hover, modal entry
- **17-3:** Enhanced property card + search results grid (luxury feel, image loading, micro-interactions)
- **17-4:** Luxury CRM dashboard — glassmorphism KPI tiles, charts, elevated surfaces
- **17-5:** Full mobile responsive pass — every CRM page verified at 375px
- **17-6:** PWA — full add-to-home-screen, offline support, service worker
- **17-7:** WCAG 2.2 final pass + RTL parity audit
- **17-8:** Lighthouse CI gate — ≥ 85 performance, ≥ 90 accessibility, enforced in CI

---

## Source Backlogs

| Source | Items |
| --- | --- |
| [`IMPROVEMENTS_UX.md`](../IMPROVEMENTS_UX.md) | Items 30–33 (UX gaps residual) |
| [`ui-ux-specification.md`](../../business_docs/06_design_architecture/ui-ux-specification.md) | Sections 13–17 (new luxury/animation/PWA/WCAG additions) |
| [`IMPROVEMENTS_PERFORMANCE.md`](../IMPROVEMENTS_PERFORMANCE.md) | PWA groundwork (Item 33) |

---

## Free-Agent Spec Ownership

| Agent | Model | Spec Output |
| --- | --- | --- |
| @Marissa | Gemini 2.0 Flash | `business_docs/06_design_architecture/ui-ux-specification.md` — mobile breakpoints, dark-mode tokens, form validation, empty states, skeleton patterns |
| @Noura | Gemini 2.0 Flash | Design-token CSS var library (`glassmorphism`, extended palette, spacing, animation durations) |
| @Cyra | Gemini 2.0 Flash | Frontend performance checklist + Framer Motion animation guidelines |
| @Sanaa | DeepSeek V3 | WCAG 2.2 audit spec + RTL a11y gap analysis |
| @Rana | Gemini 2.0 Flash | MENA mobile usage stats + PWA vs native spec for CRM agents |
| @Yara | Gemini 2.0 Flash | UX research: luxury buyer journey benchmarks + tenant portal UX heuristics |

**Invocation format (paste into free tool):**
```
@Marissa — EXPAND: business_docs/06_design_architecture/ui-ux-specification.md
→ add mobile breakpoints (375/768/1024/1440px layout spec), dark mode token map,
form validation patterns, empty state library, skeleton loader spec per component type.
CONSUMES←@Noura: design-tokens | FEEDS→@Una: ui-ux-specification.md#implementation-ready
```

---

## Architecture Decisions

### Design Tokens (17-1)

- All tokens live in `src/styles/tokens.css` as CSS custom properties
- Existing tokens from Section 2 of `ui-ux-specification.md` are extended (not replaced)
- New glassmorphism layer tokens: `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`
- Dark mode: CSS `prefers-color-scheme` media query + data-theme attribute toggle

### Animation (17-2)

- Framer Motion v11 — already installed; do not upgrade without advisory check
- Page transitions: `AnimatePresence` wrapping `<Routes>` in `App.tsx`
- Card hover: `whileHover` scale 1.02 + gold border glow (`--shadow-gold`)
- Modal entry: slide-up from y:20 + fade-in opacity 0→1 (200ms)
- Respect `prefers-reduced-motion`: all animations wrapped with `useReducedMotion()` check

### Mobile (17-5)

- Breakpoints: 375px / 768px / 1024px / 1440px
- CSS logical properties throughout (`margin-inline-*`, `padding-inline-*`)
- Every CRM page audited with Playwright at 375px viewport
- Touch targets: minimum 44×44px per WCAG 2.5.5

### PWA (17-6)

- `vite-plugin-pwa` with `registerType: 'autoUpdate'`
- `manifest.json`: theme `#B8941F`, background `#0A0A0A`, `display: standalone`
- Service worker: Workbox cache-first for static assets; network-first for API calls
- Offline: property list page + last 20 viewed properties cached

### WCAG 2.2 (17-7)

- Target: WCAG 2.2 AA compliance
- New success criteria beyond 2.1: 2.4.11 Focus Appearance, 2.5.3 Label in Name, 2.5.7 Dragging Movements, 2.5.8 Target Size Minimum, 3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication
- Automated scan: `@axe-core/playwright` in Playwright suite

### CI Gate (17-8)

- Lighthouse CI (`@lhci/cli`) added to GitHub Actions workflow
- Thresholds: performance ≥ 85, accessibility ≥ 90, best-practices ≥ 85, SEO ≥ 85
- Axe violations: zero Critical, zero Serious — fail build if violated

---

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Framer Motion page transitions cause FOUC | Medium | Test with `AnimatePresence` mode="wait" |
| PWA service worker caches stale API data | High | Use network-first strategy for all `/api/*` routes |
| WCAG 2.2 new criteria increase test surface | Low | Scoped to auth + CRM hub + properties flow first |
| Lighthouse CI flake in low-resource CI runner | Medium | Run with throttling disabled in sandbox; gate on median of 3 runs |
| glassmorphism `backdrop-filter` unsupported in some browsers | Low | `@supports (backdrop-filter: blur())` progressive enhancement |

---

## Dependencies

| Dependency | Version | Purpose | New? |
| --- | --- | --- | --- |
| `framer-motion` | already installed | Animation layer | No |
| `vite-plugin-pwa` | latest | Service worker + manifest | Yes — install during 17-6 |
| `workbox-core` | bundled with vite-plugin-pwa | PWA cache strategies | No (bundled) |
| `@lhci/cli` | latest | Lighthouse CI gate | Yes — install as devDependency during 17-8 |
| `@axe-core/playwright` | latest | Automated WCAG audit in Playwright | Yes — install as devDependency during 17-7 |
