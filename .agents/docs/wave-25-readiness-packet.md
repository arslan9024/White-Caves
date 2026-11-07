# Wave 25 — Readiness Packet

**Wave:** 25  
**Focus:** Portal Syndication, Careers Portal, Community Management & Advanced SEO  
**Date:** 2026-06-17  
**Readiness Assessed By:** @Margaret + @Elena

---

## Readiness Score: 75% ✅ (Exceeds 60% Unlock Threshold)

---

## Gate Criteria Checklist

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Business rules documented | ✅ | `portal-syndication.md`, `careers.md`, `community-management.md`, `seo-strategy.md` — all complete |
| 2 | API contract defined | ✅ | 15 endpoints defined in `WAVE_25_SDD.md#api-endpoints` |
| 3 | Data schema defined | ✅ | `portal_sync_log`, `careers`, `applications`, `community_announcements`, `facility_bookings`, `service_charges`, `community_events`, `event_rsvps` schemas implicit in SDD scope |
| 4 | ≥1 test scenario per requirement | ✅ | All 17 backlog items have validation commands |
| 5 | Dependency wave complete or unblocked | 🟡 | W25-008 (announcements) depends on Wave 24 FCM + WhatsApp infrastructure; can run in parallel with announcement dispatch stubbed |
| 6 | SEO free-agent preflight done | ✅ | `@Rachel` SEO strategy spec complete (16 sections); `@Hana` keyword research packet available |
| 7 | Careers spec done | ✅ | `@Rachel` careers.md spec complete with application flow |
| 8 | Community spec done | ✅ | `@Marissa` community-management.md spec complete with all modules |

---

## Source Documents

| Document | Sections Referenced | Readiness |
|---|---|---|
| `business_docs/09_crm_features/portal-syndication.md` | Feed formats, Trakheesi gate, sync cadence | ✅ Complete |
| `business_docs/09_crm_features/seo-strategy.md` | JSON-LD schemas, hreflang, Core Web Vitals targets, keyword clusters | ✅ Complete (16 sections) |
| `business_docs/09_crm_features/careers.md` | Application form, tracking board, RERA BRN validation | ✅ Complete |
| `business_docs/09_crm_features/community-management.md` | Announcement board, facility booking, service charges, events | ✅ Complete |
| `business_docs/08_integrations/integration-map.md` | PropertyFinder, Bayut, Trakheesi, Cloudinary, Resend | ✅ Complete |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| PropertyFinder API schema changes | Medium | High | Version-lock PF feed schema in code; add contract test against schema file |
| DLD Trakheesi API downtime | Medium | Medium | Cache permit validation result for 24h; allow manual override for admin |
| Google Rich Results Test rejection (invalid JSON-LD) | Low | High | Validate JSON-LD in CI using `schema-dts` TypeScript types before merge |
| Careers spam applications | Medium | Low | CAPTCHA on public application form; rate limit to 3 applications/IP/hour |
| Arabic URL routing conflicts with existing React Router | Medium | Medium | Use `/ar/*` prefix with nested `<Routes>` and `i18next` language detection |
| Sitemap size >50K URLs (at scale) | Low | Low | Implement sitemap index file when listing count exceeds 50K |

---

## Recommended Daily Coding Targets

| Day | Tasks | Expected Output |
|---|---|---|
| Day 1 | W25-001, W25-002 | Both portal feeds generating |
| Day 2 | W25-003, W25-004 | Cloudinary URLs in feeds + portal health dashboard |
| Day 3 | W25-005, W25-006 | Careers page live + ack email working |
| Day 4 | W25-007 | Application Kanban board |
| Day 5 | W25-008, W25-009 | Announcements + facility booking |
| Day 6 | W25-010, W25-011, W25-012 | Facility calendar + service charges + events |
| Day 7 | W25-013, W25-014 | JSON-LD structured data + hreflang |
| Day 8 | W25-015, W25-016 | Sitemap + image SEO |
| Day 9 | W25-017 | Closeout + governance |
