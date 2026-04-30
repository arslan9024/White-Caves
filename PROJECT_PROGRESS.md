# White Caves Global Agency — Project Progress

> **Updated:** 2026-04-29  
> **Branch:** `copilot/research-implementation-plan-details`  
> **Goal:** Complete the remaining ~40% of the platform with a Red (#E31E24) + White aesthetic.

---

## Phase Status Overview

| Phase    | Title                        | Status         |
| -------- | ---------------------------- | -------------- |
| Phase 1  | Homepage                     | ✅ Done        |
| Phase 2  | Landlord / Tenant Portals    | ✅ Done        |
| Phase 3  | Full CRM — managing_director | 🔄 In Progress |
| Phase 4  | WhatsApp Real Integration    | 📋 Planned     |
| Phase 5  | Lease Management API         | 📋 Planned     |
| Phase 6  | Compliance (AML/KYC/RERA)    | 📋 Planned     |
| Phase 7  | Analytics & Reporting        | 📋 Planned     |
| Phase 8  | Arabic / RTL Support         | 📋 Planned     |
| Phase 9  | Multi-User RBAC              | 📋 Planned     |
| Phase 10 | Progressive Web App (PWA)    | 📋 Planned     |

---

## Milestone Log

### Milestone 1 — Dubai Luxury Hero Upgrade ✅ (2026-04-29)

**Objective:** Apply true Red (#E31E24) + White Dubai Luxury aesthetic to the Homepage Hero section.

**Changes shipped:**

- `src/styles/dubaiLuxuryTheme.css` — Added `--primary-color` (#E31E24), `--primary-color-light`, `--primary-color-dark`, `--primary-color-soft`, `--primary-color-glow` CSS variables. `--accent-color` now overrides to real brand red inside `.dubai-luxury-theme` scope.
- `src/components/homepage/Hero/Hero.css`:
  - Floating shapes → brand red gradient blobs
  - `hero-gradient-overlay` → brand red overlay
  - `hero-market-pill` → brand red border
  - `hero-market-pill-separator` → brand red
  - `hero-stats-grid` → brand red border + brand red glow box-shadow
  - `hero-stat-number` → `--primary-color` (#E31E24)
  - `hero-stat-skeleton` → brand red shimmer animation
- `src/components/homepage/Hero/HeroSearchBar.tsx`:
  - Buy/Rent mode toggle active tab → brand red (`--primary-color`) instead of hardcoded `#E31E24`

**Result:** Hero section is now Red (#E31E24) + White — matching the White Caves brand Red/White aesthetic — while the rest of the app continues to use the White Caves brand red.

---

## Backlog — Next Priorities

### Milestone 2 — CRM Lead Dashboard Integration (Phase 3)

**Objective:** Wire CRM tabs to live Prisma/Express APIs for the `managing_director` user.

**Tasks:**

- [ ] `GET /api/leads` — paginated, sortable, filterable
- [ ] Lead detail drawer with full activity timeline
- [ ] Bulk actions (assign, archive, tag)
- [ ] Real-time WhatsApp message preview per lead

### Milestone 3 — Property Search ↔ CRM Integration

**Objective:** Connect the `/properties` page filter state to the CRM's lead-tracking pipeline.

**Tasks:**

- [ ] "Save search" → creates a CRM lead intent record
- [ ] Property enquiry CTA → prefills lead form
- [ ] Agent assignment visible on property detail page

### Milestone 4 — WhatsApp Real Integration (Phase 4)

**Objective:** Replace mock WhatsApp service with live Meta API calls.

**Tasks:**

- [ ] Verify `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_PHONE_NUMBER_ID` env vars in production
- [ ] End-to-end message send test in staging
- [ ] Webhook receiver for incoming messages
- [ ] Lead auto-create on first inbound message

### Milestone 5 — Arabic / RTL Support (Phase 8)

**Tasks:**

- [ ] `dir="rtl"` toggle on `<html>`
- [ ] RTL-safe Tailwind / CSS overrides
- [ ] Arabic font (IBM Plex Arabic or Cairo)
- [ ] Language switcher in PublicNavbar

---

## Key Architecture Decisions

| Decision                           | Choice                                                                         | Reason                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| CSS variable scoping for brand red | `.dubai-luxury-theme` class                                                    | Keeps brand red intact app-wide; brand tokens scoped                    |
| AI assistant registry              | `src/config/assistantRegistry.ts` + `src/store/slices/aiAssistant/registry.ts` | Single source of truth, 40 assistants, 12 departments                   |
| Portal authentication              | JWT + role guard middleware                                                    | `managing_director` gets 8 CRM tabs; landlord/tenant get scoped portals |
| Database ORM                       | Prisma (28 models)                                                             | Type-safe, auto-generated client, compatible with Neon Postgres         |

---

## Team Roles Reference

| Agent      | Role               | Current Focus                        |
| ---------- | ------------------ | ------------------------------------ |
| @Ada       | Chief Architect    | Architecture decisions & integration |
| @Margaret  | Project Manager    | Sprint planning & milestone tracking |
| @Grace     | Lead Engineer      | Code standards & TypeScript quality  |
| @Una       | CSS / UX           | Dubai Luxury visual design           |
| @Mira      | CTO / API Lead     | REST API design & implementation     |
| @Barbara   | Database Architect | Prisma schema & migrations           |
| @Radia     | Security           | JWT, RBAC, input sanitisation        |
| @Katherine | QA Lead            | Test coverage & bug fixes            |
| @Gwynne    | DevOps             | CI/CD pipelines                      |
| @Rachel    | SEO                | Dubai search ranking optimisation    |

---

_This file is updated at the end of each completed milestone._
