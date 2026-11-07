# 📱 UX & Accessibility Improvements

> **Phase assignments**: Phase 3, Phase 10  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: Medium-High — luxury brand experience requires polished loading states and mobile experience

---

## Item 30 — No Loading Skeleton Screens

**Phase**: Phase 3  
**Current state**: Pages display a spinner (or nothing) while API calls are in flight. Property cards, CRM tables, and dashboard KPIs all flicker into view after the data loads. This feels low-quality for a luxury real estate brand.

### What Needs Doing
- [ ] Create a reusable `Skeleton` base component in `src/components/ui/Skeleton/`:
  - `Skeleton` — generic animated gradient rectangle (pulse animation in CSS)
  - `SkeletonText` — multi-line text placeholder
  - `SkeletonCard` — property card shape skeleton
  - `SkeletonTable` — CRM table row skeletons
  - `SkeletonKPI` — dashboard KPI card skeleton
- [ ] Apply skeletons to:
  - `PropertyCard.tsx` — show `SkeletonCard` while properties are loading
  - `LeadManagementPage.tsx` and all CRM table pages — show `SkeletonTable` rows
  - `OverviewTab.tsx` KPI cards — show `SkeletonKPI`
  - `PropertyDetailPage.tsx` — show skeleton for hero image and details
- [ ] Use `is_loading` from Redux state to conditionally render skeleton vs. content
- [ ] Match skeleton shapes exactly to the real content layout (prevent layout shift on content load)
- [ ] Use the gold/dark theme colors from design tokens for skeleton animation

### Acceptance Criteria
- Opening the Leads tab shows 5 skeleton table rows immediately, replaced by real data when loaded
- No blank white flash or layout shift when data loads
- Skeleton animation uses the gold brand color at low opacity (not grey — matches luxury brand)
- Lighthouse CLS (Cumulative Layout Shift) score stays < 0.1

---

## Item 31 — Accessibility Gaps (WCAG 2.1 AA)

**Phase**: Phase 3  
**Current state**: Lighthouse Accessibility score is ~92 (good but not perfect). Playwright accessibility tests exist (`accessibility.audit.spec.ts`) but axe findings may not all be resolved. WCAG 2.1 AA compliance is required for Dubai government-linked real estate platforms.

### What Needs Doing
- [ ] Run `npx @axe-core/cli https://localhost:5173` and capture the full axe report
- [ ] Fix all **Critical** axe violations first (these cause complete failure for screen readers):
  - Missing form labels on any unlabelled inputs
  - Missing alt text on any `<img>` without descriptive text
  - Color contrast failures (gold on dark must meet 4.5:1 ratio)
  - Missing focus indicators on interactive elements
- [ ] Fix all **Serious** axe violations:
  - Keyboard trap in any modal/dialog — ensure `Escape` closes and focus returns
  - Missing landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`)
  - Interactive elements (custom buttons, dropdowns) missing `role` attributes
- [ ] Add skip-to-content link at the top of every page for keyboard users
- [ ] Test the full property search flow using only keyboard (no mouse)
- [ ] Test using VoiceOver (macOS) or NVDA (Windows) on the homepage and property detail page
- [ ] Run Playwright accessibility tests as part of CI — fail the build on new axe violations

### Acceptance Criteria
- `npx @axe-core/cli` reports zero Critical and zero Serious violations on homepage + property page + CRM login
- Entire homepage and property search flow is fully navigable by keyboard
- Lighthouse Accessibility score ≥ 95

---

## Item 32 — Mobile CRM Sidebar Collapses Poorly on Tablets

**Phase**: Phase 3  
**Current state**: The CRM uses a dual-sidebar layout (left: departments, right: AI assistants). On tablets (768–1024px), both sidebars push the main content to a very narrow column or overflow. On phones (< 768px), the layout breaks entirely.

### What Needs Doing
- [ ] Below 1024px: collapse both sidebars to icon-only mode (48px wide)
- [ ] Below 768px: hide sidebars entirely and replace with a slide-over drawer triggered by a hamburger menu
- [ ] Implement `MobileCRMDrawer.tsx` — a slide-over panel containing:
  - Department navigation tabs
  - AI assistant quick-access list
  - Close button and backdrop overlay
- [ ] Ensure the drawer supports both left-to-right (English) and right-to-left (Arabic) directions
- [ ] The main content area (center pane) should be full-width on mobile
- [ ] Add touch gesture support: swipe-right to open drawer, swipe-left to close
- [ ] Test on real iOS Safari and Android Chrome (or BrowserStack equivalents)

### Acceptance Criteria
- CRM loads correctly at 375px (iPhone SE) — no horizontal scroll, no overlapping elements
- Tapping the hamburger icon opens the sidebar drawer with a smooth animation
- All CRM features are accessible on mobile (swiping, tapping, no hover-only interactions)
- Lighthouse Mobile Performance score for CRM dashboard ≥ 80

---

## Item 33 — PWA — No Groundwork Laid for Phase 10

**Phase**: Phase 10  
**Current state**: No `manifest.json`, no service worker, no `vite-plugin-pwa`. Phase 10 (PWA) is on the roadmap but zero infrastructure exists. Starting Phase 10 without groundwork will require significant rework.

### What Needs Doing (Groundwork Only — Full PWA in Phase 10)
- [ ] Install `vite-plugin-pwa`: `npm install -D vite-plugin-pwa`
- [ ] Add basic `manifest.json` with:
  - App name, short name: "White Caves"
  - Theme color: `#B8941F` (gold)
  - Background color: `#0A0A0A` (dark)
  - Icons: 192×192 and 512×512 PNG versions of the White Caves logo
  - `display: standalone`
  - `start_url: /`
- [ ] Configure `vite-plugin-pwa` in `vite.config.ts` with `registerType: 'autoUpdate'`
- [ ] Implement a basic service worker with cache-first strategy for static assets (JS, CSS, fonts)
- [ ] **Phase 10 full scope** (deferred):
  - Offline property browsing (cache property list page + last 20 viewed properties)
  - Push notifications via Web Push API
  - Add-to-Home-Screen prompt on mobile browsers
  - App install banner for agents on field visits

### Acceptance Criteria (Groundwork)
- App can be installed from Chrome on Android/iOS as a PWA
- `manifest.json` passes Chrome DevTools "Application > Manifest" validation
- Static assets (fonts, CSS) load from service worker cache on second visit
- Full offline mode is NOT required until Phase 10

---

*See [IMPROVEMENTS_PRODUCT.md](./IMPROVEMENTS_PRODUCT.md) for Business & Product improvements.*
