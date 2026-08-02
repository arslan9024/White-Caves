# 26 — Hazel · Elite Frontend Engineer

> **ID:** `hazel`  
> **Department:** Technology  
> **Title:** Elite Frontend Engineer & Design System Guardian  
> **Color:** `#F472B6` (Pink)  
> **Avatar:** 👩‍🎨  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/HazelFrontendCRM_NEW/`  
> **Access:** Managing Director, Frontend Developer

---

## 1. Overview

Hazel is the **design system guardian** and frontend quality enforcer for White Caves. She tracks the component library health, flags accessibility violations, monitors UI performance metrics (Lighthouse scores, bundle sizes, Core Web Vitals), and maintains the Gold design token system. In the CRM, her dashboard serves as a command centre for all frontend engineering concerns.

---

## 2. Core Responsibilities

1. Monitor and enforce the White Caves Gold design token system
2. Track Lighthouse performance, accessibility, and SEO scores across all pages
3. Bundle size monitoring: flag components that exceed budget
4. WCAG 2.1 AA accessibility audit and remediation tracking
5. Component library health: document all components, their variants and usage
6. Core Web Vitals tracking: LCP, CLS, FID — trend over time

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Lighthouse dashboard | Scores per page: Performance, Accessibility, Best Practices, SEO |
| CWV tracker | LCP < 2.5s, CLS < 0.1, FID < 100ms — trend charts |
| Bundle analyser | Current bundle size per chunk; budget alerts if > 250KB |
| Accessibility audit | List of WCAG 2.1 AA violations with severity and fix guidance |
| Design token registry | All Gold tokens: colors, typography, spacing — usage verification |
| Component catalogue | All components with props, variants, status (stable/beta/deprecated) |
| CSS inconsistency report | Detect hardcoded values that should use design tokens |
| Animation performance | Flag animations running off main thread; janky scroll detection |
| Font loading | Font display strategy monitoring; FOUT/FOIT detection |

---

## 4. How It Works — End to End

### Step 1 — Lighthouse CI Integration
GitHub Actions runs Lighthouse CI on every PR and daily on main branch. Results posted to `POST /api/hazel/lighthouse { page, scores, timestamp }`.

### Step 2 — Score Trending
Hazel's dashboard fetches `GET /api/hazel/lighthouse/history` → renders 30-day trend per page per metric. Alerts if score drops > 5 points between builds.

### Step 3 — Bundle Analysis
Vite build produces `stats.json` (via `rollup-plugin-analyzer`) → uploaded to `POST /api/hazel/bundle { chunks, sizes }`. Hazel flags any chunk > 250KB uncompressed.

### Step 4 — Accessibility Scan
Weekly: Hazel runs `axe-core` audit on each key page (rendered in headless Playwright). Results stored as accessibility issues: `{ page, element, violation, severity, wcagCriteria, fix }`.

### Step 5 — Token Enforcement
ESLint plugin (`eslint-plugin-design-tokens`) runs in CI. Any hardcoded colour hex not in the Gold token list → CI warning. Hazel dashboard lists outstanding violations.

### Step 6 — Component Documentation
Hazel reads Storybook configuration (if present) or scans `src/components/` directory → auto-generates component catalogue with props, status, and usage count across the codebase.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/hazel/lighthouse` | Upload Lighthouse run results |
| GET | `/api/hazel/lighthouse/history` | Get score history |
| POST | `/api/hazel/bundle` | Upload bundle analysis |
| GET | `/api/hazel/accessibility` | List accessibility violations |
| GET | `/api/hazel/tokens` | List design token usage |
| GET | `/api/hazel/components` | Component catalogue |

---

## 6. Data Flows

- **Receives from:** GitHub Actions CI (Lighthouse, bundle analysis), Playwright audit runner (accessibility)
- **Sends to:** Aurora (frontend health metrics), Zoe (performance KPIs)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `HazelFrontendCRM_NEW` | `src/components/owner/ai/HazelFrontendCRM_NEW/` | ✅ Exists |
| Lighthouse scores | Inside dashboard | ✅ Exists (mock) |
| Accessibility issues | Inside dashboard | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| HazelService | `server/services/HazelService.ts` | 🔲 Planned |
| Lighthouse store | `server/routes/hazel.ts` | 🔲 Planned |
| Accessibility scan | Playwright + axe-core | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Read all metrics |
| `frontend_developer` | Full access + issue management |

---

## 10. Implementation Checklist

- [x] `HazelFrontendCRM_NEW` renders (mock)
- [x] Hazel registered in `AI_ASSISTANTS_REGISTRY`
- [ ] Lighthouse CI integration in GitHub Actions
- [ ] Score history storage and trend charts
- [ ] Bundle analysis upload endpoint
- [ ] axe-core accessibility scanner
- [ ] Design token ESLint enforcement
- [ ] Component catalogue generator

---

## 11. Dependencies

- `@lhci/cli` (Lighthouse CI) — npm
- `axe-core` — npm
- Playwright (for accessibility scanning in headless mode)
- Vite bundle analyser plugin

---

## 12. Future Enhancements

- Real User Monitoring (RUM) — field data from real browsers
- Visual regression testing (Percy or Chromatic)
- Design handoff integration (Figma → token sync)
- Component usage analytics (which components are most used)
