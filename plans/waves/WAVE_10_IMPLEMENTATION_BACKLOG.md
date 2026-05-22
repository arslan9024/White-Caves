# Wave 10 — Implementation Backlog

**Wave:** 10  
**Focus:** Performance + SEO + Security Uplift  
**Status:** 📋 Planned (activates when Wave 09 green)  
**Date:** 2026-05-22

---

## Pillar A — Performance

| ID      | Priority | Task                                                                                           | Owner         | Files Affected                                                                       | Validation                                           | Status  |
| ------- | -------- | ---------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------- |
| W10-001 | P0       | Run Lighthouse audit on prod build → capture baseline (performance + SEO scores)               | @Ruchi        | —                                                                                    | `npx lighthouse http://localhost:5173 --output json` | Planned |
| W10-002 | P0       | Add route-level code splitting via `React.lazy` + `Suspense` for CRM, portal, and admin routes | @Ruchi        | `src/App.tsx`, `src/router.tsx`                                                      | `npm run build` — check chunk sizes                  | Planned |
| W10-003 | P1       | Add `loading="lazy"` + `fetchpriority="high"` to property images; convert hero images to WebP  | @Ruchi + @Una | `src/components/properties/PropertyCard.tsx`, `PropertyDetailPage.tsx`               | LCP improvement in Lighthouse                        | Planned |
| W10-004 | P1       | Virtual scroll for `LeadManagementPage` table and property grid (> 100 items)                  | @Ruchi        | `src/pages/crm/LeadManagementPage.tsx`, `src/components/properties/PropertyGrid.tsx` | `npm run build` + 375px perf test                    | Planned |
| W10-005 | P2       | Vite config: manual chunk splitting (vendor / crm / portal / public bundles)                   | @Ruchi        | `vite.config.ts`                                                                     | `npm run build` — compare bundle report              | Planned |

## Pillar B — SEO

| ID      | Priority | Task                                                                                           | Owner   | Files Affected                                                    | Validation                               | Status  |
| ------- | -------- | ---------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------- | ---------------------------------------- | ------- |
| W10-006 | P0       | `PageMeta.tsx` component (React Helmet wrapper) — wire to all public-facing pages              | @Rachel | `src/components/seo/PageMeta.tsx`, all page components            | `npm run build` + meta tag check         | Planned |
| W10-007 | P0       | `StructuredData.tsx` — inject `RealEstateListing` JSON-LD on `PropertyDetailPage`              | @Rachel | `src/components/seo/StructuredData.tsx`, `PropertyDetailPage.tsx` | Google Rich Results Test                 | Planned |
| W10-008 | P0       | `GET /sitemap.xml` server route — generates XML from all `available` properties + static pages | @Rachel | `server/routes/sitemap.ts`, `server/index.ts`                     | `curl http://localhost:3001/sitemap.xml` | Planned |
| W10-009 | P1       | `LocalBusiness` JSON-LD on homepage (company name, address, phone, RERA license)               | @Rachel | `src/pages/HomePage.tsx`                                          | Google Rich Results Test                 | Planned |
| W10-010 | P1       | `public/robots.txt` — update to reference sitemap; block `/api/`, `/crm/`, `/portal/`          | @Rachel | `public/robots.txt`                                               | `curl http://localhost:5173/robots.txt`  | Planned |
| W10-011 | P2       | OG meta tags for property detail pages (og:image → property photo URL)                         | @Rachel | `PropertyDetailPage.tsx` + `PageMeta.tsx`                         | Facebook Sharing Debugger                | Planned |

## Pillar C — Security

| ID      | Priority | Task                                                                                                                       | Owner          | Files Affected                                              | Validation                                    | Status  |
| ------- | -------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------- | --------------------------------------------- | ------- |
| W10-012 | P0       | `npm audit --audit-level high` — fix all high/critical dependency vulnerabilities                                          | @Radia         | `package.json`, `package-lock.json`                         | `npm audit` → 0 high/critical                 | Planned |
| W10-013 | P0       | CSP middleware (`server/middleware/csp.ts`) — start in Report-Only mode, then enforce                                      | @Radia         | `server/middleware/csp.ts`, `server/index.ts`               | Browser console 0 CSP violations              | Planned |
| W10-014 | P0       | Input sanitization sweep — add `express-validator` sanitize middleware to all `POST`/`PATCH` routes that accept user input | @Radia + @Mira | `server/routes/*.ts` (targeted)                             | `npm run lint` + targeted route tests         | Planned |
| W10-015 | P1       | Redis-backed rate limiting on `/api/auth/*` routes (brute-force protection)                                                | @Radia         | `server/routes/auth.ts`, `server/middleware/rateLimiter.ts` | `429` test + `npm run quality:quick`          | Planned |
| W10-016 | P2       | Redis-backed rate limiting on all public API routes                                                                        | @Radia         | `server/index.ts`, `server/middleware/rateLimiter.ts`       | Load test 100 req/min → `429` after threshold | Planned |

---

## Execution Order

```
Wave 09 complete →
  Pillar A (parallel): W10-001 → W10-002 → W10-003 → W10-004 → W10-005
  Pillar B (parallel): W10-006 → W10-007 → W10-008 → W10-009 → W10-010 → W10-011
  Pillar C (parallel): W10-012 → W10-013 → W10-014 → W10-015 → W10-016
  → Lighthouse audit post-implementation (gate: perf ≥ 85, SEO ≥ 90)
```

---

## Completion Rule

No item marked complete until:

- Validation command(s) pass
- Evidence in `PROJECT_PROGRESS.md` + `DAILY_MILESTONE_TRACKER.md`
- `npm run plans:validate` passes after tracker update
