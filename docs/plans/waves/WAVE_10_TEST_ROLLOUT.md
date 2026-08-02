# Wave 10 — Test Rollout Plan

**Wave:** 10  
**Focus:** Performance + SEO + Security Uplift  
**Status:** 📋 Planned  
**Date:** 2026-05-22

---

## Test Strategy

Wave 10 spans three pillars with different testing approaches:

| Pillar      | Test Type                                    | Tool                                            |
| ----------- | -------------------------------------------- | ----------------------------------------------- |
| Performance | Lighthouse audit                             | Lighthouse CLI                                  |
| SEO         | Meta tag validation + structured data        | Google Rich Results Test, Lighthouse SEO        |
| Security    | Dependency audit + header check + rate limit | npm audit, supertest, Lighthouse Best Practices |

---

## Performance Tests

| Test                            | Command                                                              | Pass Condition                               |
| ------------------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| Lighthouse performance baseline | `npx lighthouse http://localhost:5173 --only-categories=performance` | Score ≥ 85                                   |
| Bundle size check post-split    | `npm run build` + inspect `dist/assets`                              | No single chunk > 500KB                      |
| Lazy route load time            | Dev tools Network tab — route navigation                             | Route chunk loaded on demand, not at startup |

---

## SEO Tests

| Test                 | Command                                                               | Pass Condition                                             |
| -------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Lighthouse SEO audit | `npx lighthouse http://localhost:5173 --only-categories=seo`          | Score ≥ 90                                                 |
| Sitemap validation   | `curl http://localhost:3001/sitemap.xml \| xmllint --valid --noout -` | Valid XML, contains property URLs                          |
| JSON-LD validation   | Google Rich Results Test                                              | `RealEstateListing` parsed correctly                       |
| robots.txt check     | `curl http://localhost:5173/robots.txt`                               | References sitemap, blocks `/api/`                         |
| Meta tags presence   | `npm run test:run -- src/components/seo`                              | `<title>`, `<meta name="description">`, `og:title` present |

---

## Security Tests

| Test                | Command                                                  | Pass Condition                               |
| ------------------- | -------------------------------------------------------- | -------------------------------------------- |
| Dependency audit    | `npm audit --audit-level high`                           | 0 high/critical vulnerabilities              |
| CSP header present  | `curl -I http://localhost:3001/api/leads`                | `Content-Security-Policy` header in response |
| Auth rate limit 429 | `npm run test:run -- server/routes/auth.test.ts`         | 6th login attempt → 429                      |
| Input sanitization  | `npm run test:run -- server/middleware/sanitize.test.ts` | XSS payload stripped                         |

---

## Regression Gate

Run before merging each Wave 10 PR:

```bash
npm run build
npm run lint
npm audit --audit-level high
npm run quality:quick
```

---

## CI Integration

Wave 10 adds to CI:

1. `npm audit --audit-level high` step in build workflow (fail on high/critical)
2. Lighthouse score assertion in post-deploy check (score ≥ 85 perf, ≥ 90 SEO)
3. `server/middleware/csp.ts` + `server/middleware/sanitize.ts` unit tests
