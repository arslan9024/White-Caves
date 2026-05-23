# Wave 10 — System Design Document (SDD)

**Wave:** 10  
**Focus:** Performance + SEO + Security Uplift  
**Status:** 📋 Planned (unlocks when Wave 09 is green)  
**Date:** 2026-05-22  
**Owners:** @Ruchi + @Rachel + @Radia + @Katherine  
**Entry Gate:** Wave 09 green + readiness ≥ 60% + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

## Scope

Wave 10 delivers cross-cutting quality uplift across three pillars:

1. **Performance** — Lighthouse score ≥ 85, code splitting, lazy loading
2. **SEO** — Structured data (JSON-LD), meta tags, sitemap, robots.txt
3. **Security** — CSP headers, dependency audit, input sanitization, Redis rate limiting

Sources:

- [`IMPROVEMENTS_PERFORMANCE.md`](../IMPROVEMENTS_PERFORMANCE.md)
- [`IMPROVEMENTS_SEO.md`](../IMPROVEMENTS_SEO.md)
- [`IMPROVEMENTS_SECURITY.md`](../IMPROVEMENTS_SECURITY.md)

---

## Architecture Overview

### Performance Layer

```
src/
  components/
    LazyRoute.tsx         ← React.lazy wrapper with Suspense
  hooks/
    useVirtualList.ts     ← virtual scroll for large lists (leads/properties)

vite.config.ts            ← code splitting: vendor / crm / portal / public chunks
```

### SEO Layer

```
src/
  components/seo/
    PageMeta.tsx           ← reusable <Helmet> wrapper (title + description + OG)
    StructuredData.tsx     ← injects JSON-LD <script> for property pages
  pages/
    SitemapPage.tsx        ← server-rendered /sitemap.xml route

server/
  routes/
    sitemap.ts             ← GET /sitemap.xml — generates from live property data
```

### Security Layer

```
server/
  middleware/
    csp.ts                 ← Content Security Policy headers
    sanitize.ts            ← express-validator input sanitization middleware
  routes/
    auth.ts                ← Redis-backed brute-force rate limit on /api/auth/*
    api.ts                 ← Redis-backed rate limit on all public API routes
```

---

## Key Design Decisions

| Decision                | Choice                                                    | Reason                                    |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------- |
| Code splitting strategy | Route-level lazy loading (`React.lazy`)                   | Biggest LCP improvement; minimal refactor |
| JSON-LD schema          | `RealEstateListing` + `LocalBusiness`                     | Standard Google-supported schemas         |
| Rate limiting backend   | Redis (ioredis) with in-memory fallback                   | Consistent across multi-instance deploys  |
| Input sanitization      | `express-validator` (already in package.json check first) | Standard Express pattern                  |
| CSP policy              | `default-src 'self'`; allow Vercel analytics, Meta pixel  | Blocks XSS; allows tracking in production |

---

## Non-Functional Targets

| Metric                 | Target                          | Tool                           |
| ---------------------- | ------------------------------- | ------------------------------ |
| Lighthouse Performance | ≥ 85                            | Lighthouse CLI                 |
| Lighthouse SEO         | ≥ 90                            | Lighthouse CLI                 |
| `npm audit`            | 0 high/critical vulnerabilities | `npm audit --audit-level high` |
| CSP violations         | 0 in production                 | Browser console + Sentry       |

---

## Validation Commands

```bash
npm run build
npm run lint
npm audit --audit-level high
npm run quality:quick
npx lighthouse http://localhost:5173 --only-categories=performance,seo
```
