# Phase 25 — Homepage Improvement Execution Guide

**Date:** May 3, 2026  
**Created By:** @Una (Creative Director) + @Mira (Lead Coder)  
**Status:** Execution Ready  
**Build Status:** ✅ PASSING (`npm run build`: 3464 modules)  
**Dev Server:** ✅ RUNNING (`http://localhost:5001/`)

---

## Executive Summary

Phase 25 transforms the White Caves homepage from good to great via 4 P0 improvements (40 hours) + 3 P1 optimizations (15 hours) = **55 total hours, 7-day sprint**. All changes are isolated to frontend (no backend API changes), enabling fast iteration and rollback safety.

**Expected Outcomes:**

- LCP: <2.5s (from current ~3.5s on 5Mbps throttle)
- CLS: <0.1 (stable, no jank)
- Accessibility: WCAG 2.1 AA pass rate >95%
- Mobile conversion: 2-3% improvement (via UX polish)

---

## Phase 25 Workstreams

### Workstream 1: LCP Optimization (P0 — Critical)

**Goal:** Reduce Largest Contentful Paint from ~3.5s to <2.5s.

#### 1.1 Hero Section Above-Fold Audit

**Current Issue:** Hero image (background or img tag) loads from external CDN, blocking render.

**Audit Checklist:**

- [ ] Open `src/pages/HomePage.tsx` → Hero component
- [ ] Identify hero background/image source (check CSS + img tags)
- [ ] Check: is image critical-path (above fold) or deferred?
- [ ] Run DevTools Lighthouse → LCP element → note current element and load time
- [ ] Document findings in PHASE_25_OPTIMIZATION_LOG.md

**Implementation Tasks:**

**1.1.1** Compress hero image (if not already)

```
Owner: @Una (CSS/Images)
Time: 2h
Tasks:
- [ ] Hero image must be <100KB (aim for <50KB with WebP)
- [ ] Use Sharp/ImageMin to compress
- [ ] Create WebP version (fallback to JPG)
- [ ] Update src/components/homepage/Hero/Hero.tsx to use <picture> tag with WebP first
```

**1.1.2** Defer non-critical hero animations

```
Owner: @Framer (Motion Expert)
Time: 3h
Tasks:
- [ ] Move hero animation to "after-load" (use onAnimationComplete or useEffect with delay)
- [ ] Simplify initial render: remove blur/fade effects on first paint
- [ ] Keep animations for interactivity (scroll/hover)
- [ ] Measure: LCP should improve 0.5-1.0s
```

**1.1.3** Add preload hints to index.html

```
Owner: @Rachel (SEO)
Time: 1h
Tasks:
- [ ] Add <link rel="preload" href="/assets/hero.webp" as="image"> to index.html head
- [ ] Add <link rel="preconnect" href="https://fonts.googleapis.com"> for web fonts
- [ ] Add <link rel="dns-prefetch" href="https://api.white-caves.com"> for backend API
```

#### 1.2 Featured Properties Section Lazy Loading

**Current Issue:** Featured properties load on-page (render-blocking), should load after LCP.

**Implementation Tasks:**

**1.2.1** Implement intersection observer for featured section

```
Owner: @Lea (UI Engineer)
Time: 3h
Tasks:
- [ ] Wrap FeaturedPropertiesSection in IntersectionObserver hook
- [ ] Load data only when section enters viewport (50% threshold)
- [ ] Show skeleton loader while loading
- [ ] Test: measure LCP with DevTools (should drop by 0.8-1.2s)
```

**1.2.2** Add skeleton shimmer to property cards

```
Owner: @Una (Design)
Time: 2h
Tasks:
- [ ] Create SkeletonPropertyCard component (matches ProductCard dimensions)
- [ ] Use CSS animation for shimmer effect (no JavaScript)
- [ ] Show 3-4 skeleton placeholders while loading
- [ ] Fade in real cards when data arrives
```

#### 1.3 JavaScript Bundle Optimization

**Current Issue:** Vite chunk warning suggests unused dependencies in critical path.

**Implementation Tasks:**

**1.3.1** Audit bundle for unused imports

```
Owner: @Annie (Compute Specialist)
Time: 2h
Tasks:
- [ ] Run: npx vite build --analyze (or use bundlesize CLI)
- [ ] Identify top 3 largest modules
- [ ] Check: are they used on homepage? Or lazy-loaded?
- [ ] Document findings in optimization log
```

**1.3.2** Tree-shake unused code from HomePage.tsx

```
Owner: @Mira (Lead Coder)
Time: 3h
Tasks:
- [ ] Review imports in HomePage.tsx (all 30+ imports)
- [ ] Remove unused components/utilities
- [ ] Lazy-load heavy components: Testimonials, VirtualTourGallery, OffPlanTracker (use React.lazy)
- [ ] Measure: bundle size reduction + LCP impact
```

**1.3.3** Defer non-critical components (Testimonials, Blog, VirtualTour)

```
Owner: @Lea (UI Engineer)
Time: 2h
Tasks:
- [ ] Wrap Testimonials in <Suspense> + React.lazy
- [ ] Wrap Blog section in <Suspense> + React.lazy
- [ ] Wrap VirtualTourGallery in <Suspense> + React.lazy
- [ ] Add fallback: <Skeleton /> for each
- [ ] Measure: pages/HomePagePerf.test.ts shows LCP <2.5s
```

**Timeline:** 19 hours total (2.5 days)  
**Exit Criteria:** Lighthouse LCP <2.5s, 90+ score

---

### Workstream 2: SEO & External Asset Ownership (P0 — Critical)

**Goal:** Ensure all critical assets are owned/cached by White Caves or CDN, not external 3rd parties.

#### 2.1 Audit External Image Sources

**Current Issue:** Hero image, property images may be sourced from external URLs (unstable, slow, no SLA).

**Audit Checklist:**

**2.1.1** Identify all img src and background-image references

```
Owner: @Fei-Fei (Vision Specialist)
Time: 2h
Tasks:
- [ ] Grep: find all img src="*" in HomePage.tsx + Hero + FeaturedProperties + Locations
- [ ] Find all background-image: url(*) in .css files
- [ ] Classify: internal (/assets/*) vs external (https://...) vs CDN (cloudflare/...) vs data-uri
- [ ] Document in spreadsheet: filename, src, type, size
```

**2.1.2** Move external images to assets

```
Owner: @Fei-Fei (Vision Specialist)
Time: 3h
Tasks:
- [ ] Download all external images to public/assets/homepage/
- [ ] Rename with semantic names (hero.webp, property-1.webp, etc.)
- [ ] Compress using Sharp (target <50KB per image)
- [ ] Create WebP + JPG fallbacks
- [ ] Update all references in code (src="/assets/homepage/hero.webp")
```

**2.1.3** Set up CDN caching for images

```
Owner: @Lisa (Cloud Specialist)
Time: 2h
Tasks:
- [ ] Ensure /assets/* has Cache-Control: public, max-age=31536000 (1 year)
- [ ] Add versioning to filenames (e.g., hero-v1.webp) for cache-busting
- [ ] Test: verify images cached in DevTools Network tab
- [ ] Set up Cloudflare page rules (if using): Cache Level = Cache Everything for /assets
```

#### 2.2 JSON-LD Schema Validation

**Current Issue:** Homepage JSON-LD may have missing or incorrect fields for Google search results.

**Implementation Tasks:**

**2.2.1** Audit current schema (use Google's Structured Data Testing Tool)

```
Owner: @Rachel (SEO Lead)
Time: 1.5h
Tasks:
- [ ] Go to: https://search.google.com/test/rich-results
- [ ] Input homepage URL
- [ ] Check: are there errors or warnings?
- [ ] Document: missing fields, type issues, validation errors
```

**2.2.2** Enhance JSON-LD schema in homepageSeo.ts

```
Owner: @Rachel (SEO Lead)
Time: 2h
Tasks:
- [ ] Add/fix: Organization schema (name, logo, address, phone, email)
- [ ] Add: LocalBusiness schema (if applicable for Dubai)
- [ ] Add: RealEstateAgent schema (team member profiles)
- [ ] Add: BreadcrumbList schema (homepage → properties → detail)
- [ ] Test with Structured Data Tool (should show 0 errors)
```

**2.2.3** Add Open Graph meta tags for social sharing

```
Owner: @Rachel (SEO Lead)
Time: 1h
Tasks:
- [ ] Add: og:title, og:description, og:image, og:url
- [ ] Add: twitter:card, twitter:title, twitter:description
- [ ] Test: use Facebook Sharing Debugger + Twitter Card Validator
```

**Timeline:** 9.5 hours total (1.5 days)  
**Exit Criteria:** Google Rich Results 0 errors, social sharing previews verified

---

### Workstream 3: Error State UX (P0 — Critical)

**Goal:** Handle homepage failures gracefully (API down, no network, timeout).

#### 3.1 Add Error Boundaries

**Current Issue:** If /api/homepage fails, page may blank or show console errors (poor UX).

**Implementation Tasks:**

**3.1.1** Wrap HomePage in ErrorBoundary

```
Owner: @Mira (Lead Coder)
Time: 1h
Tasks:
- [ ] Import ErrorBoundary from src/components/shared/ErrorBoundary
- [ ] Wrap <HomePage /> in src/App.tsx
- [ ] Ensure fallback UI renders (not blank)
```

**3.1.2** Add fallback hero section (no live data)

```
Owner: @Una (Design)
Time: 2h
Tasks:
- [ ] Create StaticHeroFallback component (matches Hero dimensions)
- [ ] Use placeholder image + static "Welcome" text
- [ ] Include call-to-action: "Browse our listings" button
- [ ] Show in ErrorBoundary fallback or on fetch timeout
```

**3.1.3** Add offline detection + messaging

```
Owner: @Mira (Lead Coder)
Time: 1.5h
Tasks:
- [ ] Detect: navigator.onLine status
- [ ] Show banner: "You're offline. Some features may not work." (if offline)
- [ ] Hide live sections (Featured Properties) if offline
- [ ] Show static/cached content instead
```

#### 3.2 API Timeout & Retry Logic

**Implementation Tasks:**

**3.2.1** Add fetch timeout to /api/homepage

```
Owner: @Ruchi (Systems Engineer)
Time: 1h
Tasks:
- [ ] Implement: AbortSignal timeout (3s max)
- [ ] If timeout: dispatch fallback state
- [ ] Log: timeout event to error tracking (Sentry/LogRocket)
```

**3.2.2** Implement exponential backoff retry

```
Owner: @Mira (Lead Coder)
Time: 1.5h
Tasks:
- [ ] Add: retry(3) with exponential backoff (1s, 2s, 4s)
- [ ] On all 3 retries fail: show offline message
- [ ] Display: "Unable to load live data. Please refresh."
```

**Timeline:** 7 hours total (1 day)  
**Exit Criteria:** Error states tested, offline message displays, timeout retry works

---

### Workstream 4: Accessibility Audit & WCAG 2.1 AA (P0 — Critical)

**Goal:** Ensure homepage passes WCAG 2.1 AA compliance (required for enterprise customers).

#### 4.1 Automated Accessibility Audit

**Implementation Tasks:**

**4.1.1** Run Lighthouse accessibility audit

```
Owner: @Africa (Accessibility Lead)
Time: 1h
Tasks:
- [ ] Open DevTools → Lighthouse
- [ ] Run audit (Mobile)
- [ ] Check: Accessibility score (target: >95)
- [ ] Document failures: contrast, labels, ARIA, heading structure
```

**4.1.2** Run axe DevTools manual audit

```
Owner: @Africa (Accessibility Lead)
Time: 2h
Tasks:
- [ ] Install: axe DevTools browser extension
- [ ] Scan homepage for violations
- [ ] Fix: each violation
- [ ] Common issues: missing alt text, color contrast, button labels
```

#### 4.2 Fix Critical Accessibility Issues

**Implementation Tasks:**

**4.2.1** Add alt text to all images

```
Owner: @Una (Design)
Time: 1.5h
Tasks:
- [ ] Audit: find all <img> without alt attribute
- [ ] Add descriptive alt text: "Dubai Marina villa overlooking sea" (not "image.jpg")
- [ ] For decorative images: alt=""
```

**4.2.2** Fix color contrast (text + background)

```
Owner: @Una (Design)
Time: 1.5h
Tasks:
- [ ] Check all text colors vs background
- [ ] Target WCAG AA: 4.5:1 for normal text, 3:1 for large text
- [ ] Use WebAIM Contrast Checker
- [ ] Update CSS if needed
```

**4.2.3** Add ARIA labels + semantic HTML

```
Owner: @Africa (Accessibility Lead)
Time: 2h
Tasks:
- [ ] Ensure: <button>, <a>, <form> elements have accessible names
- [ ] Add: role="navigation", role="contentinfo" where needed
- [ ] Add: aria-label or aria-labelledby for complex sections
- [ ] Use: <main>, <nav>, <header>, <footer> semantic tags
```

**4.2.4** Test keyboard navigation

```
Owner: @Africa (Accessibility Lead)
Time: 1h
Tasks:
- [ ] Unplug mouse, use Tab key only
- [ ] Can you access: search bar, hero CTA, featured properties, contact form?
- [ ] Is focus visible (highlight) on all interactive elements?
- [ ] Fix: missing focus states (outline-color, box-shadow)
```

**4.2.5** Test with screen reader

```
Owner: @Africa (Accessibility Lead)
Time": 1h
Tasks:
- [ ] Use NVDA (Windows) or VoiceOver (Mac)
- [ ] Read through homepage: page structure makes sense?
- [ ] Can user access: search, featured properties, contact form?
- [ ] Fix: aria-hidden, heading hierarchy, list structure
```

**Timeline:** 10 hours total (1.5 days)  
**Exit Criteria:** Lighthouse A11y >95, 0 axe violations, keyboard + screen reader tested

---

## P1 Optimizations (After P0 Complete)

### P1-1: Performance Budget CI Check (3 hours)

- Add Lighthouse CI to CI/CD pipeline
- Fail build if LCP >2.5s, CLS >0.1
- Dashboard: track performance over time

### P1-2: Mobile-First UX Polish (5 hours)

- Test on real iPhone 12/14 (not just DevTools emulation)
- Fix: touch targets (min 44x44px), spacing, scrolling
- Verify: featured properties section responsive (1-2 columns)

### P1-3: Progressive Image Loading (7 hours)

- Implement: LQIP (Low Quality Image Placeholder) strategy
- Show blurred placeholder while image loads
- Fade in real image when ready
- Measure: perceived performance improvement

---

## Phase 25 Execution Schedule

| Day      | Workstream    | Tasks                                 | Hours | Owner                  |
| -------- | ------------- | ------------------------------------- | ----- | ---------------------- |
| Thu 5/3  | 1. LCP Audit  | 1.1.1–1.1.3 Hero optimization         | 6     | @Una, @Framer, @Rachel |
| Fri 5/4  | 1. LCP Defer  | 1.2, 1.3 Lazy load + tree-shake       | 8     | @Lea, @Annie, @Mira    |
| Mon 5/7  | 2. SEO Assets | 2.1 External assets audit + fix       | 5     | @Fei-Fei, @Rachel      |
| Tue 5/8  | 2. SEO Schema | 2.2 JSON-LD + OG tags                 | 3.5   | @Rachel                |
| Wed 5/9  | 3. Error UX   | 3.1, 3.2 Error boundaries + retry     | 7     | @Mira, @Ruchi          |
| Thu 5/10 | 4. A11y Audit | 4.1 Lighthouse + axe scan             | 3     | @Africa                |
| Fri 5/11 | 4. A11y Fixes | 4.2 Alt text, contrast, ARIA, testing | 7     | @Africa, @Una          |

**Total P0 Time:** 40 hours (1 week sprint)  
**P1 Time (optional):** 15 hours (1 week sprint)

---

## Acceptance Criteria (Phase 25 Sign-Off)

### Build & Runtime

- [x] Production build passing (`npm run build`)
- [x] Dev server running (`npm run dev`)
- [ ] No build warnings (circular chunks acceptable but noted)
- [ ] No console errors on homepage

### Performance (LCP P0)

- [ ] LCP <2.5s (measured on 5Mbps throttle, 4G network, iPhone 12)
- [ ] CLS <0.1 (no layout shift during load)
- [ ] FID <100ms (first input delay)
- [ ] Lighthouse Performance >85

### SEO (External Assets P0)

- [ ] All images sourced from /assets/\* or owned CDN (no 3rd party URLs in critical path)
- [ ] JSON-LD schema: 0 errors in Google Structured Data Tool
- [ ] og:image, og:title, og:description set + validated
- [ ] Sitemap includes homepage (already set)

### Error Handling (Error UX P0)

- [ ] ErrorBoundary catches failures gracefully (no blank page)
- [ ] Offline detection + banner displays correctly
- [ ] API timeout triggers fallback state (within 3s)
- [ ] Retry logic: 3 attempts with exponential backoff
- [ ] No console errors when API fails

### Accessibility (WCAG 2.1 AA P0)

- [ ] Lighthouse A11y score >95 (100 ideal)
- [ ] 0 axe critical/serious violations
- [ ] All images have alt text
- [ ] Color contrast: 4.5:1 (normal text), 3:1 (large text)
- [ ] Keyboard navigation: all interactive elements reachable via Tab
- [ ] Screen reader tested: page structure understandable

### Mobile (Responsive P1)

- [ ] Homepage responsive: iPhone 12 + iPad Pro tested
- [ ] Touch targets: min 44x44px
- [ ] Featured properties: 2 columns on mobile (not 1 or 3)
- [ ] No horizontal scroll

---

## Rollback Plan

If any optimization regresses performance:

1. Git revert commit (instant rollback)
2. Diagnose: DevTools Lighthouse + Performance tab
3. Refactor: try different approach
4. Re-test before re-commit

---

## Next Phase (Phase 26)

After Phase 25 complete (homepage polished):

- Phase 26: CRM Dashboard Hardening (role enforcement, API audit)
- Phase 27: Leasing/Ejari Workflow (full lifecycle testing)
- Phase 28: Commission UI Implementation (agent/manager views)

---

## Documentation Artifacts Created

- PHASE_25_EXECUTION_GUIDE.md (this file)
- PHASE_25_OPTIMIZATION_LOG.md (to be created by @Una/@Mira during execution)
- PHASE_25_TEST_RESULTS.md (to be created by @Katherine during QA phase)
- Commit history: all optimization PRs linked to this plan
