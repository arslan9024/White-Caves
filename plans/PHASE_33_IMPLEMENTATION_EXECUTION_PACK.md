# Phase 33 — Implementation Execution Pack (Gate-to-Code)

> **Phase:** 33 (P0)
> **Date:** May 5, 2026
> **Purpose:** Convert the approved planning context into implementation-ready work packages.
> **Condition:** Execute coding tasks only after governance gate pass (`1000% depth + readiness >=92% + @Ada approval`).

---

## 1) What This Pack Solves

This file translates strategy into direct implementation units for:

1. **Homepage leasing conversion uplift**
2. **Executive superuser identity unification** (`arslanmalikgoraha@gmail.com`)
3. **Leasing E2E continuity across tenant/landlord/agent flows**

---

## 2) Gate Snapshot (Before Coding)

Coding entry condition remains mandatory:

- [ ] 1000% prerequisite documentation depth verified
- [ ] Readiness score >=92% completed and logged with matrix evidence
- [ ] `@Ada — Context Ready (1000% Depth, 92% Readiness) — Coding Phase Approved`

If any unchecked item exists, implementation is paused and routed back to free-agent documentation expansion.

---

## 3) Workstream A — Homepage (Leasing Conversion First)

## A1. Hero + CTA prioritization

**Primary files:**

- `src/pages/HomePage.tsx`
- `src/components/homepage/Hero/Hero.tsx`
- `src/components/homepage/Hero/HeroSearchBar.tsx`

**Implementation tasks:**

- Reorder CTA hierarchy so leasing/rent conversion is primary
- Ensure hero search intent aligns with Dubai leasing use cases
- Verify mobile-first layout at 375/768 for CTA and search visibility

## A2. Event instrumentation for conversion

**Primary files:**

- `src/pages/HomePage.tsx`
- `src/components/homepage/Hero/Hero.tsx`
- `src/components/homepage/Contact/ContactCTA.tsx`
- analytics utility/event tracking layer used in project

**Events required:**

- `homepage_hero_cta_click`
- `homepage_leasing_search_submit`
- `homepage_whatsapp_start`
- `homepage_viewing_request_submit`

## A3. Validation

- Build pass (`npm run build`)
- Homepage route smoke test
- Mobile viewport visual check (375/768/1024/1440)

---

## 4) Workstream B — Executive Identity Unification

## B1. Canonical role behavior

**Primary files (expected):**

- `src/App.tsx`
- `src/config/ROLE_TAB_MAPPING.ts`
- `src/utils/permissions.ts`
- `server/middleware/rbac.ts`
- auth-related route handlers/services where role is interpreted

**Implementation tasks:**

- Preserve backward alias support (`lion`, `managing_director`)
- Normalize runtime authorization semantics to canonical executive behavior
- Guarantee deterministic dashboard entry after login

## B2. Route/rbac parity

- Ensure alias users resolve to same privilege envelope as canonical executive
- Keep legacy alias routes as compatibility redirects only (no divergent behavior)

## B3. Validation

- Sign-in test for `arslanmalikgoraha@gmail.com`
- Protected route behavior test
- Role normalization regression tests for alias values

---

## 5) Workstream C — Leasing End-to-End Continuity

## C1. Lifecycle continuity points

**Business stages to enforce in implementation:**

1. Homepage lead capture
2. Qualification + viewing
3. Offer + contract + Ejari
4. Active lease (payments + maintenance)
5. Renewal/exit

## C2. Integration surfaces

**Primary files/modules (expected):**

- Lead management components/routes
- Viewing/scheduling modules
- Tenancy/Ejari modules
- Tenant portal tabs (`src/components/portal/tenant/*`)
- Landlord portal tabs (`src/components/portal/landlord/*`)

## C3. Validation

- No orphan state transitions between modules
- Required stage transitions logged in activity/audit streams
- Portal continuity checks for tenant + landlord + leasing-agent perspectives

---

## 6) Suggested Implementation Sequence (Post-Gate)

## Day 1 — Identity Core

- Execute Workstream B
- Add/adjust unit tests for alias normalization and route parity

## Day 2 — Homepage Conversion

- Execute Workstream A
- Verify analytics events and mobile UX

## Day 3 — Leasing Continuity Hardening

- Execute Workstream C
- Validate lifecycle transitions across CRM + portals

## Day 4 — QA Sweep

- Regression, lint/build, and critical E2E pass
- Update tracker documents with measured outcomes

---

## 7) Minimum Acceptance for Phase 33 Implementation Start

- [ ] Gate approved by @Ada
- [ ] Execution owner assigned per workstream
- [ ] Test scope declared before coding begins
- [ ] Rollback points identified for each workstream commit

---

## 8) Deliverable Mapping

- Planning artifact: `plans/PHASE_33_PRIORITY_MODULE_HOMEPAGE_SUPERUSER_LEASING.md`
- Execution artifact: `plans/PHASE_33_IMPLEMENTATION_EXECUTION_PACK.md` (this file)
- Tracker updates: `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md`, `plans/PENDING_TASKS_ONLY.md`
