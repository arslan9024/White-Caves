# Wave 25 — Implementation Backlog

**Wave:** 25  
**Focus:** Portal Syndication, Careers Portal, Community Management & Advanced SEO  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Entry Gate:** Wave 24 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Requirement IDs                            | Priority | Task                                                                                                                                                                                                                               | Owner            | Validation Command                                                                                                                           | Status     |
| ------- | ------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| W25-001 | REQ-SYN-001, REQ-SYN-003                   | P0       | Build PropertyFinder XML feed generator: map CRM listing schema to PF XML spec; Trakheesi pre-check blocks syndication if permit invalid; cron every 4 hours                                                                       | @Mira            | Integration: valid listing with permit → XML generated; listing with expired permit → `syndication_blocked`; XML validates against PF schema | 📋 Planned |
| W25-002 | REQ-SYN-002, REQ-SYN-004                   | P0       | Build Bayut JSON feed generator + `portal_sync_log` collection: map CRM listing to Bayut JSON; cron every 6 hours; log success/failed/skipped per run                                                                              | @Mira            | Integration: active listing → synced to Bayut feed; 3-field-missing listing → skipped with reason logged                                     | 📋 Planned |
| W25-003 | REQ-SYN-005                                | P1       | Replace raw photo URLs in portal feeds with Cloudinary-optimised URLs: auto-format + auto-quality + max 1200×800 transform applied at feed generation time                                                                         | @Mira            | Unit: photo URL in feed contains Cloudinary CDN domain with transform params; not raw storage path                                           | 📋 Planned |
| W25-004 | REQ-SYN-001                                | P1       | Build portal sync health dashboard at `/admin/portals`: last sync time per portal, success/failed/skipped counts, failed listing table with error codes, manual re-sync button                                                     | @Una             | E2E: run sync → dashboard shows updated timestamp + counts; click re-sync → new sync run starts                                              | 📋 Planned |
| W25-005 | REQ-CAREER-001, REQ-CAREER-002             | P0       | Build `/careers` public page + `GET /api/v1/careers` endpoint: render active job listings with `JobPosting` JSON-LD; application form with CV upload (PDF ≤ 5 MB, validated), LinkedIn URL, RERA BRN (numeric 6-digit if required) | @Una + @Rachel   | Playwright: visit `/careers` → Google Rich Results Test validates JSON-LD; submit form with PDF → 201 response                               | 📋 Planned |
| W25-006 | REQ-CAREER-003                             | P0       | Send acknowledgement email on application submit: Resend template within 2 minutes; include job title, company name, "We'll be in touch within 5 business days"                                                                    | @Mira            | Integration: submit application → Resend webhook confirms delivery within 2 min in test run                                                  | 📋 Planned |
| W25-007 | REQ-CAREER-004                             | P1       | Build application tracking Kanban board: 6 stages (Applied / HR Screening / Interview Scheduled / Offer Extended / Hired / Rejected); drag-and-drop stage update; `PATCH /api/v1/careers/applications/:id/stage`                   | @Una             | E2E: drag card from Applied to Interview Scheduled → status updated in DB; email notification sent to candidate                              | 📋 Planned |
| W25-008 | REQ-COMM-001                               | P0       | Build community announcement service: `POST /api/v1/community/announcements`; dispatch FCM push + WhatsApp template to target scope (building/floor/all) within 30 seconds                                                         | @Mira            | Integration: create announcement targeting building_id → all residents receive push + WhatsApp within 30s                                    | 📋 Planned |
| W25-009 | REQ-COMM-002                               | P0       | Build facility booking system: `POST /api/v1/community/bookings`; enforce max 2 active bookings per unit; capacity limit per facility; conflict detection for overlapping slots; 24h cancellation policy                           | @Mira + @Barbara | Integration: 3rd booking for same unit → 409 error; overlapping slot → 409; cancel < 24h → 400                                               | 📋 Planned |
| W25-010 | REQ-COMM-002                               | P1       | Build facility calendar view component: week view per facility; booked slots shown with unit number (community manager) or as "Unavailable" (resident); slot selection via click                                                   | @Una + @Marissa  | E2E: community manager view shows unit numbers; resident view shows "Unavailable" for other units' bookings                                  | 📋 Planned |
| W25-011 | REQ-COMM-003                               | P1       | Build service charge tracking: `service_charges` collection + `GET /api/v1/community/service-charges` for landlord portal; quarterly invoice generation; overdue escalation alert                                                  | @Barbara + @Mira | Integration: overdue service charge → landlord WhatsApp alert; landlord portal shows status per unit                                         | 📋 Planned |
| W25-012 | REQ-COMM-004                               | P1       | Build community event CRUD + RSVP system: event creation with `maxAttendees`; `POST /api/v1/community/events/:id/rsvp` — reject if at capacity; RSVP list visible to community manager                                             | @Una             | Integration: RSVP at max capacity → 409; RSVP below capacity → 201; manager sees full RSVP list                                              | 📋 Planned |
| W25-013 | REQ-SEO-001, REQ-SEO-005                   | P0       | Add JSON-LD structured data to all public page types: `RealEstateListing` on property detail, `LocalBusiness`+`RealEstateAgent` on homepage, `JobPosting` on careers, `FAQPage` on FAQ; OG + Twitter Card meta on all pages        | @Rachel + @Una   | Google Rich Results Test: all 4 schema types validate; OG debugger shows correct image/title for property pages                              | 📋 Planned |
| W25-014 | REQ-SEO-002                                | P0       | Implement Arabic/English hreflang on all public pages: `<link rel="alternate" hreflang="en">`, `hreflang="ar"`, `x-default`; create Arabic URL structure `/ar/properties/...` routing                                              | @Rachel + @Tracy | Screaming Frog / Ahrefs audit: all public pages have valid hreflang; no orphaned hreflang pairs                                              | 📋 Planned |
| W25-015 | REQ-SEO-003                                | P1       | Build auto-generated `sitemap.xml`: include active property listings, open job postings, blog posts; update on every `property.published`, `job.published`, `blog.published` event; submit to Google Search Console                | @Rachel          | Playwright: publish new property → `sitemap.xml` contains new URL within 60 seconds                                                          | 📋 Planned |
| W25-016 | REQ-SEO-004                                | P0       | Image SEO: auto-generate `alt` text from property fields for all property images; enforce WebP via Cloudinary; lazy loading on all images below fold; canonical tags on paginated pages                                            | @Rachel + @Cyra  | Axe scan: no missing alt text on property images; Lighthouse image audit green                                                               | 📋 Planned |
| W25-017 | All REQ-SYN, REQ-CAREER, REQ-COMM, REQ-SEO | P0       | Wave 25 closeout: governance validation, tracker sync, `npm run plans:validate` green                                                                                                                                              | @Katherine       | `npm run plans:validate` passes; trackers updated                                                                                            | 📋 Planned |

---

## Dependency Order

1. W25-001 (PF feed) + W25-002 (Bayut feed) → W25-003 (Cloudinary URLs) → W25-004 (portal dashboard)
2. W25-005 (careers page) → W25-006 (email) → W25-007 (Kanban)
3. W25-008 (announcements) → W25-009 (facility booking) → W25-010 (calendar UI) → W25-011 (service charges) → W25-012 (events)
4. W25-013 (JSON-LD) → W25-014 (hreflang) → W25-015 (sitemap) → W25-016 (image SEO)
5. All tasks → W25-017 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 25 can be marked complete only when:

1. PF XML feed validated against PropertyFinder schema
2. Bayut JSON feed validated; sync log accurate
3. Trakheesi permit check blocks listing with expired permit
4. Careers page JSON-LD validates in Google Rich Results Test
5. Acknowledgement email within 2 minutes of test application
6. Community announcement dispatched via push + WhatsApp within 30 seconds
7. Facility booking max-2-per-unit and capacity rules enforced
8. `RealEstateListing` JSON-LD on all public property listings
9. Hreflang correct on English + Arabic pages
10. Sitemap updates within 60 seconds of new listing publication
11. Lighthouse CI: LCP ≤ 2.5s, CLS ≤ 0.1
12. `npm run plans:validate` green
13. Evidence in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
