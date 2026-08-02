# Wave 10 — Readiness Packet

**Wave:** 10  
**Focus:** Performance + SEO + Security Uplift  
**Status:** 📋 Planned  
**Date:** 2026-05-22  
**Readiness Score:** 65% (above 60% unlock threshold — ready to activate when Wave 09 completes)

---

## Gate Checklist

| Gate                      | Check                                                | Status              |
| ------------------------- | ---------------------------------------------------- | ------------------- |
| Wave 09 complete          | UX hardening green                                   | ⬜ Pending Wave 09  |
| `npm run plans:validate`  | Planning governance pass                             | ✅ Confirmed May 22 |
| Business rules documented | `IMPROVEMENTS_PERFORMANCE/SEO/SECURITY.md` specified | ✅                  |
| API contract (sitemap)    | `GET /sitemap.xml` returns XML with property URLs    | ✅ Designed in SDD  |
| Security rules            | CSP policy + rate limit spec                         | ✅ Designed in SDD  |
| Test scenarios            | Lighthouse + npm audit + lint                        | ✅                  |
| Rollback plan             | Revert middleware + SEO components                   | ✅ Low risk         |

---

## Readiness Breakdown

### Business (5/5 — 100%)

- [x] Scope: performance + SEO + security; 3 parallel owners
- [x] Acceptance criteria in IMPROVEMENTS\_\*.md files
- [x] Process rules: each pillar has independent validation
- [x] Ownership: @Ruchi (perf), @Rachel (SEO), @Radia (security)
- [x] Rollback: middleware removal, revert vite config

### API (4/5 — 80%)

- [x] `GET /sitemap.xml` designed
- [x] Rate limit middleware designed (no endpoint changes)
- [x] CSP middleware (headers only)
- [x] Auth rate limit uses existing `/api/auth/*` routes
- [ ] Redis connection config (env vars to be added)

### Data (4/5 — 80%)

- [x] No schema changes (sitemap reads from existing Property model)
- [x] Redis: new connection — no schema
- [x] No migration needed
- [x] No relationship changes
- [ ] Redis TTL strategy for rate limit counters (to finalize in session)

### UX (3/5 — 60%)

- [x] Code splitting: route-level lazy loading (no UX change — just faster load)
- [x] Skeleton loaders (delivered in Wave 09) handle async route loading
- [x] JSON-LD: invisible to user; improves search appearance
- [ ] OG image for social sharing (property photos need OG URL format)
- [ ] Lighthouse run needed to measure current baseline

### QA (4/5 — 80%)

- [x] Lighthouse perf/SEO audit
- [x] `npm audit` zero high/critical
- [x] CSP header presence test
- [x] Rate limit 429 response test
- [ ] Playwright E2E sitemap link check

### Compliance/Sign-Off (2/5 — 40%)

- [x] CSP blocks XSS → improves PDPL compliance
- [x] No RERA/DLD impact
- [ ] @Margaret sign-off
- [ ] @Sofia PDPL impact review
- [ ] @Katherine pre-flight test run

---

## Risk Assessment

| Risk                                      | Likelihood | Impact | Mitigation                                       |
| ----------------------------------------- | ---------- | ------ | ------------------------------------------------ |
| Code splitting breaks lazy module loading | Low        | High   | Test each lazy route in dev before prod          |
| CSP blocks legitimate CDN resources       | Medium     | Medium | Start with `Content-Security-Policy-Report-Only` |
| Redis not available in dev                | Low        | Low    | In-memory fallback already in SDD design         |
| Sitemap exposes private listing data      | Low        | High   | Only include `available` status properties       |
