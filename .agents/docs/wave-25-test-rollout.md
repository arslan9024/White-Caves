# Wave 25 — Test Rollout Plan

**Wave:** 25  
**Focus:** Portal Syndication, Careers Portal, Community Management & Advanced SEO  
**Date:** 2026-06-17  
**QA Owner:** @Katherine + @Vera

---

## Unit Tests

| Test File | Scope | Key Assertions |
|---|---|---|
| `server/services/portalSyndication.pf.test.ts` | PF XML feed | Valid listing generates correct XML; expired permit → skip with error code in log |
| `server/services/portalSyndication.bayut.test.ts` | Bayut JSON feed | Active listing generates correct JSON; missing required field → skipped |
| `server/routes/careers.test.ts` | Careers API | GET public listings: 200; POST apply (valid PDF): 201; POST apply (non-PDF): 400; BRN validation |
| `server/routes/community.test.ts` | Community API | Create announcement: 201; 3rd booking for unit: 409; overlapping slot: 409; RSVP at capacity: 409 |
| `server/services/seoMeta.test.ts` | SEO metadata | Property detail JSON-LD contains required RealEstateListing fields; hreflang links generated |
| `server/services/sitemapGenerator.test.ts` | Sitemap | Contains published listing URL; does not contain draft listing URL; updates within 60s of publish event |

---

## Integration Tests

| Scenario | Steps | Expected Result |
|---|---|---|
| PF feed syndication | Create listing with valid Trakheesi permit → trigger sync | XML feed contains listing; `portal_sync_log` shows `success` |
| PF blocked listing | Create listing with expired permit → trigger sync | Listing `syndication_blocked`; sync log shows `skipped` with `PERMIT_EXPIRED` code |
| Bayut sync | Create listing → trigger Bayut cron | JSON feed contains listing; Cloudinary-optimised photo URL in feed |
| Careers application | POST `/careers/:id/apply` with PDF CV | 201; acknowledgement email sent within 2 min; application in DB |
| BRN validation | Apply for RERA-required job with non-numeric BRN | 400 with validation error |
| Community announcement | POST announcement with `targetScope: building_id` | All residents of building receive push notification |
| Facility booking conflict | Book pool slot 10:00–11:00 → book same slot → | Second booking → 409 with "slot unavailable" |
| Service charge overdue | Set service charge `dueDate` to past + `status: pending` | Alert generated; landlord portal shows overdue status |
| Sitemap update | Publish new property listing | `sitemap.xml` contains new URL within 60 seconds |

---

## End-to-End (Playwright)

| Test ID | Browser | Scenario |
|---|---|---|
| E2E-CAREER-001 | Chrome | Visit `/careers` → open job → fill application form → submit → success screen |
| E2E-CAREER-002 | Chrome | Manager views applications board → drag card from Applied to Interview Scheduled |
| E2E-COMM-001 | Chrome | Community manager posts announcement → resident sees it in portal notification |
| E2E-SEO-001 | Chrome | Visit property listing page → view page source → verify JSON-LD present + valid |
| E2E-SEO-002 | Chrome | Visit English property page → verify hreflang links to Arabic equivalent |

---

## SEO Validation Checklist

- [ ] Google Rich Results Test: `RealEstateListing` schema passes for 3 sample property URLs
- [ ] Google Rich Results Test: `JobPosting` schema passes for 2 sample job URLs
- [ ] Screaming Frog: all public pages have hreflang pair (en + ar); no orphaned pages
- [ ] Google Search Console: sitemap submitted and indexed (0 errors)
- [ ] Lighthouse CI: LCP ≤ 2.5s, CLS ≤ 0.1, Performance ≥ 85 on property listing page
- [ ] Axe: zero missing `alt` text errors on property listing and detail pages
- [ ] OG Debugger (Facebook): property detail OG image and title correct

---

## Regression Checks

- `npm run test:run:unit` — all existing unit tests pass
- `npm run build` — zero TypeScript errors; bundle size ≤ 350 KB gzipped
- `npm run lint` — zero new errors
- Existing property CRUD, lead CRUD, and lease flows unaffected
- Portal feeds do not expose private CRM data (agent notes, internal comments, lead information)

---

## Rollback Plan

1. Portal syndication: set `portals.syndication.enabled = false` in `policy.json` → cron skips feed generation; listings remain in CRM but not pushed to portals
2. Careers: feature flag `careers.public.enabled = false` → `/careers` returns 404; existing applications preserved
3. Community management: `community.enabled = false` → routes return 503; all data preserved
4. SEO: JSON-LD is additive — removing it is a simple script tag deletion; no data risk
5. Sitemap: revert to static `sitemap.xml`; no functional impact
