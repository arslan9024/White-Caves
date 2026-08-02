# Wave 25 — System Design Document (SDD)

**Wave:** 25  
**Focus:** Portal Syndication, Careers Portal, Community Management & Advanced SEO  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Rachel + @Mira + @Una + @Marissa + @Barbara + @Katherine  
**CONSUMES←:** `business_docs/09_crm_features/portal-syndication.md`, `business_docs/09_crm_features/seo-strategy.md`, `business_docs/09_crm_features/careers.md`, `business_docs/09_crm_features/community-management.md`, `business_docs/08_integrations/integration-map.md`  
**FEEDS→:** Post-launch growth loop; investor reporting; talent pipeline

---

## Objective

Launch the growth-facing surfaces of White Caves: automated property syndication to PropertyFinder and Bayut, an SEO-optimised careers portal for agent recruitment, a resident community management module, and advanced technical SEO with structured data, Core Web Vitals CI gating, and Arabic/English hreflang. This wave completes the public-facing product and makes White Caves discoverable and self-sustaining in the Dubai real estate market.

---

## Scope

### 1. Property Portal Syndication

- Syndication service: generates PF XML feed and Bayut JSON feed from CRM active listings
- Feed cadence: cron every 4 hours (PropertyFinder) and every 6 hours (Bayut)
- Required fields validation before syndication: `trakheesiPermitNumber`, `agentBrn`, `branchId`, `photos ≥ 3`, `description ≥ 100 chars`, `listPrice > 0`
- Sync result stored in `portal_sync_log` collection: `{ portal, listingId, status: success|failed|skipped, errorCode, syncedAt }`
- Portal sync health dashboard: last sync timestamp, success rate, failed listings count — at `/admin/portals`
- Manual re-sync button: `POST /api/v1/portals/sync` (Admin/Lion role)
- Photo ordering: Cloudinary optimised URL used in feed (auto-format, auto-quality, max 1200×800)
- Trakheesi pre-check: if permit expired or not found → mark listing as `syndication_blocked`; surface warning to agent

### 2. Careers Portal

- Public-facing page: `/careers` — SEO-optimised, structured data `JobPosting` JSON-LD
- Job listing CRUD (Admin+): title, department (Sales/Leasing/Operations/Tech/Finance), Dubai location (DIFC/Business Bay/JLT), employment type (full-time/part-time/contract), RERA license required (yes/no), salary range (optional), expiry date
- Candidate application form: CV upload (PDF only, ≤ 5 MB), cover letter (optional), LinkedIn URL, RERA BRN if applicable, reference contacts (2×)
- Application tracking board (Manager view): Kanban — Applied → HR Screening → Interview Scheduled → Offer Extended → Hired / Rejected
- Automated acknowledgement email on application submit (via Resend): within 2 minutes
- Interview scheduling: reuse `/api/v1/viewings` pattern (`type: interview`) with calendar sync
- Application PDF export: generate `application_{candidateId}.pdf` with all submitted data
- RERA license check for agent roles: if `reraRequired: true` → validate BRN format (6-digit numeric)
- Analytics: applications per job, pipeline conversion rate, source attribution (LinkedIn, WhatsApp, direct, referral)

### 3. Community Management (JunoCommunity Module)

- Community announcement board: `POST /api/v1/community/announcements` — title, body (rich text), targetScope (`building_id | floor | all`), pinned flag, expiresAt
- Push notification + WhatsApp dispatch on new announcement (respects user preferences)
- Facility booking: `POST /api/v1/community/bookings` — `facilityType` (pool/gym/meeting_room/BBQ), date, time slot (30-min or 60-min intervals), unit number of requester
- Facility booking rules: max 2 active bookings per unit; 24h cancellation notice required; capacity limit per facility
- Facility calendar view: week view showing all booked slots per facility (read-only for residents, editable for community manager)
- Service charge tracking: `service_charges` collection — `{ unitId, quarter, amount AED, status: pending/paid/overdue, invoiceId }` — displays in landlord portal
- Community event calendar: `POST /api/v1/community/events` — title, description, location, startAt, endAt, maxAttendees, requiresRSVP; RSVP list stored in `event_rsvps`
- Community manager KPI dashboard: open requests, avg resolution time, resident satisfaction score (aggregated from maintenance ratings), events this month, facility utilisation %

### 4. Advanced SEO & Structured Data

- JSON-LD structured data for every page type:
  - Property listing: `RealEstateListing` schema (price, area, beds, baths, address, agent, image, datePosted)
  - Agency homepage: `RealEstateAgent` + `LocalBusiness` schema
  - Blog/market report: `Article` schema
  - Careers: `JobPosting` schema per listing
  - FAQ page: `FAQPage` schema
- Arabic/English hreflang: `<link rel="alternate" hreflang="en" href="...">` and `hreflang="ar"` on all public pages; `x-default` points to English
- Google Business Profile: verified listing spec for White Caves LLC; NAP (Name, Address, Phone) consistency across all pages
- Sitemap: auto-generated `sitemap.xml` includes all public property listings, blog posts, and careers pages — updated on every new listing publish
- `robots.txt`: allow crawl of `/properties/`, `/careers/`, `/blog/`; disallow `/crm/`, `/admin/`, `/api/`
- Core Web Vitals CI: measure on every PR via Lighthouse CI; fail if LCP > 2.5s or CLS > 0.1 on production-representative page
- Image SEO: `alt` text auto-generated from property details (e.g. "2 bedroom apartment for sale in Dubai Marina, White Caves Real Estate"); lazy loading enforced; WebP format via Cloudinary
- Canonical tags on all paginated listing pages
- OpenGraph + Twitter Card meta tags on property detail pages (OG image = first property photo)

---

## Requirement IDs (Wave 25)

| ID | Requirement |
|---|---|
| `REQ-SYN-001` | PropertyFinder XML feed generated and submitted every 4 hours |
| `REQ-SYN-002` | Bayut JSON feed generated and submitted every 6 hours |
| `REQ-SYN-003` | Listing blocked from syndication if Trakheesi permit invalid |
| `REQ-SYN-004` | Portal sync log records success/failed/skipped per listing per run |
| `REQ-SYN-005` | Photos served as Cloudinary-optimised URLs in feed |
| `REQ-CAREER-001` | Careers page renders with `JobPosting` JSON-LD for each listing |
| `REQ-CAREER-002` | Application form: CV upload (PDF ≤ 5 MB), LinkedIn URL, RERA BRN validation |
| `REQ-CAREER-003` | Acknowledgement email delivered within 2 minutes of application |
| `REQ-CAREER-004` | Application Kanban board shows 6-stage pipeline |
| `REQ-COMM-001` | Community announcement dispatched as push + WhatsApp within 30 seconds |
| `REQ-COMM-002` | Facility booking enforces max 2 active per unit + capacity limit |
| `REQ-COMM-003` | Service charge status visible to landlord in portal |
| `REQ-COMM-004` | Community event RSVP list capped at `maxAttendees` |
| `REQ-SEO-001` | All public property listings have `RealEstateListing` JSON-LD |
| `REQ-SEO-002` | Arabic and English hreflang implemented on all public pages |
| `REQ-SEO-003` | Sitemap auto-updated on every new listing publication |
| `REQ-SEO-004` | LCP ≤ 2.5s and CLS ≤ 0.1 on property listing page in Lighthouse CI |
| `REQ-SEO-005` | OG image and Twitter Card meta correct on property detail pages |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/portals/sync` | Admin+ | Trigger manual portal syndication run |
| GET | `/api/v1/portals/sync-log` | Admin+ | Portal sync history |
| GET | `/api/v1/careers` | Public | List active job postings |
| POST | `/api/v1/careers` | Admin+ | Create job posting |
| PATCH | `/api/v1/careers/:id` | Admin+ | Update or close job posting |
| POST | `/api/v1/careers/:id/apply` | Public | Submit application |
| GET | `/api/v1/careers/applications` | Manager+ | List all applications (with filters) |
| PATCH | `/api/v1/careers/applications/:id/stage` | Manager+ | Move application through pipeline |
| POST | `/api/v1/community/announcements` | CommunityManager+ | Create announcement |
| GET | `/api/v1/community/announcements` | Resident+ | List announcements for unit's building |
| POST | `/api/v1/community/bookings` | Resident+ | Book facility slot |
| GET | `/api/v1/community/bookings` | Resident+ | View own bookings |
| DELETE | `/api/v1/community/bookings/:id` | Resident+ | Cancel booking (≥ 24h before) |
| POST | `/api/v1/community/events` | CommunityManager+ | Create community event |
| POST | `/api/v1/community/events/:id/rsvp` | Resident+ | RSVP to event |

---

## SEO Architecture

```
[Vite SSR or Static Generation]
  └── /properties/:slug
        ├── JSON-LD: RealEstateListing
        ├── OG: title="2BR Dubai Marina | White Caves", image={cloudinary}
        ├── <link rel="alternate" hreflang="en" href="/properties/...">
        ├── <link rel="alternate" hreflang="ar" href="/ar/properties/...">
        └── <link rel="canonical" href="/properties/...">

[sitemap.xml — auto-generated on publish]
  ├── /properties/* (active listings)
  ├── /careers/* (open positions)
  └── /blog/* (market reports)
```

---

## Acceptance Gate (Wave-Level)

Wave 25 is complete when:

1. PropertyFinder XML feed generated and validated against PF schema
2. Bayut JSON feed generated and validated
3. Trakheesi permit check blocks listing with expired/missing permit
4. Careers page loads with `JobPosting` JSON-LD and application form functional
5. Acknowledgement email arrives within 2 minutes of test application
6. Community announcement dispatched via push + WhatsApp within 30 seconds
7. Facility booking respects max-2-per-unit and capacity rules
8. All public property detail pages pass JSON-LD validation (Google Rich Results Test)
9. Hreflang validated via Screaming Frog or Ahrefs audit
10. Lighthouse CI: LCP ≤ 2.5s, CLS ≤ 0.1 on property listing page
11. `npm run plans:validate` green
12. Evidence committed to `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
