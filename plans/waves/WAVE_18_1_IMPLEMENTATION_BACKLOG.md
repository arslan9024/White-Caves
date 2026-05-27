# Wave 18.1 — Competitor Parity Execution Backlog

**Wave:** 18.1  
**Focus:** Convert Wave 18 parity findings into execution-ready improvements  
**Status:** 🟢 Ready  
**Date:** 2026-05-26  
**Owners:** @Ada + @Margaret + @Mira + @Katherine + domain leads

---

## Benchmark Scope (Locked)

1. Property Finder (UAE)
2. Bayut / dubizzle (UAE)
3. Houza (UAE)
4. Zillow (US)
5. Rightmove (UK)
6. Compass (luxury brokerage)
7. Salesforce (enterprise CRM)
8. HubSpot (pipeline automation CRM)

---

## Improvement Inventory (132 Total)

| Pillar | Count |
| --- | ---: |
| Search & Discovery | 14 |
| Listing Quality & Trust | 10 |
| Lead Capture & Conversion | 12 |
| CRM Workflow Productivity | 18 |
| WhatsApp/Omnichannel & AI Ops | 12 |
| Tenant/Landlord Lifecycle | 12 |
| Analytics & Revenue Intelligence | 9 |
| Mobile CRM & Field Ops | 8 |
| Performance/Core Web Vitals/PWA | 8 |
| Integrations & Data Platform | 11 |
| Security/Compliance/Audit | 8 |
| SEO/Growth/Marketplace Flywheel | 10 |
| **Total** | **132** |

---

## Prioritization Model (Mandatory)

- **P0:** conversion blockers + trust/compliance blockers + mobile CRM blockers
- **P1:** automation depth + intelligence quality + portal completion
- **P2:** polish and optimization enhancements

Weighted score per task:

- Revenue impact: 35%
- Customer impact: 25%
- Strategic moat: 20%
- Delivery effort: 10%
- Risk/compliance urgency: 10%

---

## Top-20 P0 Execution Queue

| ID | Pillar | Task | Owner | Success Metric | Validation Gate |
| --- | --- | --- | --- | --- | --- |
| W18.1-P0-001 | Search & Discovery | Add intent-aware ranking profile for buy/rent/invest journeys | @Mira + @Lea | +15% qualified click-through to property detail | Search relevance regression tests + `npm run build` |
| W18.1-P0-002 | Search & Discovery | Add advanced search facets (furnishing, handover stage, permit status, fee band) | @Mira + @Lea | +20% filter usage without conversion drop | API filter tests + UI integration tests |
| W18.1-P0-003 | Search & Discovery | Improve map/list synchronization and viewport persistence | @Tracy + @Mira | -30% map abandonment rate | Playwright map-flow tests |
| W18.1-P0-004 | Lead Capture & Conversion | ✅ Build one-click inquiry→viewing path from listing cards and detail page | @Mira + @Una | +25% viewing booking conversion | Route tests + UX flow tests |
| W18.1-P0-005 | Lead Capture & Conversion | ✅ Enforce lead SLA timers with escalating nudges to assignee/manager | @Mira + @Katherine | -40% median first-response time | Scheduler tests + dashboard evidence |
| W18.1-P0-006 | Lead Capture & Conversion | ✅ Create unified lead timeline across web forms, WhatsApp, calls, tasks | @Mira + @Jaime | +20% lead-to-offer progression | Timeline API tests + CRM UI checks |
| W18.1-P0-007 | CRM Workflow Productivity | ✅ Ship one-screen agent task cockpit (today queue, SLA risk, priority) | @Una + @Mira | +35% daily task completion | Component tests + role-access checks |
| W18.1-P0-008 | CRM Workflow Productivity | ✅ Add bulk lead actions (assign, stage, reminder, archive) with audit trail | @Mira + @Katherine | -25% repetitive CRM actions per lead | Bulk-action tests + audit evidence |
| W18.1-P0-009 | Mobile CRM & Field Ops | Deliver mobile-first CRM command bar for top 8 field actions | @Tracy + @Una | +35% mobile CRM completion rate | Playwright mobile suite |
| W18.1-P0-010 | Mobile CRM & Field Ops | Add offline-safe draft capture for notes/viewing feedback | @Mira + @Ruchi | 0% data loss incidents in spotty network | PWA cache tests + sync tests |
| W18.1-P0-011 | Listing Quality & Trust | Add listing completeness scoring and remediation checklist | @Mira + @Lea | +30% listing completeness score | Listing score tests + UI checks |
| W18.1-P0-012 | Listing Quality & Trust | Add verification/freshness badges with traceable evidence fields | @Sofia + @Mira | +20% trust interactions on listing pages | Compliance route tests + frontend checks |
| W18.1-P0-013 | Security/Compliance/Audit | Enforce KYC gate before high-risk transaction transitions | @Sofia + @Mira | 100% gated risky transactions | Compliance tests + RBAC tests |
| W18.1-P0-014 | Security/Compliance/Audit | Add permit/BRN/Ejari expiry risk queue with escalation | @Sofia + @Katherine | 0 missed critical expiry alerts | Scheduler + notification tests |
| W18.1-P0-015 | Tenant/Landlord Lifecycle | ✅ Expand tenant portal lifecycle (payments, renewals, maintenance SLA) | @Victoria + @Mira | +30% tenant portal MAU | Portal integration tests |
| W18.1-P0-016 | Tenant/Landlord Lifecycle | ✅ Expand landlord portfolio health dashboard with issue hotspots | @Victoria + @Mira | +30% landlord portal MAU | Dashboard tests + data contract checks |
| W18.1-P0-017 | WhatsApp/Omnichannel & AI Ops | One-click WhatsApp conversation→lead conversion + ownership routing | @Joelle + @Mira | +20% WA lead creation conversion | WhatsApp route tests |
| W18.1-P0-018 | WhatsApp/Omnichannel & AI Ops | Implement channel orchestration cadence rules (WA/email/call) | @Joelle + @Katherine | +15% follow-up adherence rate | Automation tests + SLA evidence |
| W18.1-P0-019 | Analytics & Revenue Intelligence | Ship funnel economics dashboard (lead→viewing→offer→close) | @Invoice + @Mira | +20% offer submission rate | Reporting tests + KPI dashboard checks |
| W18.1-P0-020 | Analytics & Revenue Intelligence | Add baseline KPI tracker for 90-day target monitoring | @Invoice + @Katherine | Weekly KPI trend published with deltas | Tracker update + `npm run plans:validate` |

---

## 90-Day KPI Targets

1. Lead response time: **-40%**
2. Viewing booking conversion: **+25%**
3. Offer submission rate: **+20%**
4. Listing completeness score: **+30%**
5. Mobile CRM task completion: **+35%**
6. Tenant/landlord portal monthly active usage: **+30%**
7. Organic qualified leads: **+25%**
8. Critical UX/accessibility regressions: **near zero (gated)**

---

## This-Week Execution Checklist

- [x] Finalize parity rubric and lock benchmark evidence set
- [x] Build matrix v2 with workflow-level evidence links
- [x] Expand gap register to 132-item inventory (P0/P1/P2)
- [x] Approve top-20 P0 queue and owner assignments
- [x] Stand up KPI baseline dashboard
- [x] Start weekly re-benchmark + queue hygiene loop

## Session 1 Delivery Evidence

- Lead workflow backend now exposes task cockpit and unified timeline data, supports reminder-based bulk actions, and auto-creates/viewing-links lead inquiries from authenticated viewing requests.
- SchedulerService now registers hourly lead SLA escalation automation and records assignee/manager escalation audit events.
- CRM and portal surfaces now show SLA risk, priority rank, renewal visibility, maintenance SLA counts, issue hotspots, and occupancy risk signals.

---

## Session 2 Plan

**Session:** 2
**Status:** 🟡 In Progress
**Date Planned:** 2026-05-27
**Entry Gate:** Session 1 evidence confirmed ✅ — PROJECT_PROGRESS.md updated ✅

### Entry Gate Confirmation

- [x] W18.1-P0-004/005/006/007/008/015/016 — Session 1 delivery confirmed in PROJECT_PROGRESS.md
- [x] W18.1-P0-014 — Assessed as substantially complete (Wave 4 compliance routes + schedulers). Marked complete.
- [x] `npm run build` green from Session 1 deliverables
- [x] Architecture plan approved by @Ada — 2026-05-27

### Tasks Marked Complete (Prior to Session 2)

| ID | Task | Reason |
|----|------|--------|
| W18.1-P0-014 | Permit/BRN/Ejari expiry risk queue with escalation | Wave 4 fully delivered: `reraExpiryScheduler.js`, `permitAlertScheduler.js`, `propertyPermitEnforcementScheduler.js`, `/api/compliance/permit-alerts`, `/api/compliance/brn-expiry`, `/api/compliance/brn-check` all confirmed in `server/routes/compliance.ts` |

### Session 2 Target Tasks (10 of remaining P0)

| Batch | ID | Task | Owner(s) | Priority | Validation Gate |
|-------|-----|------|----------|----------|-----------------|
| A | W18.1-P0-001 | Intent-aware ranking (buy/rent/invest) | @Mira + @Una | P0 | propertySlice tests + build |
| A | W18.1-P0-002 | Advanced search facets (furnishing, handover, permit, fee) | @Mira + @Una + @Tracy | P0 | PropertyFilterPanel tests + API filter tests + build |
| A | W18.1-P0-003 | Map/list sync + viewport persistence | @Tracy + @Mira | P0 | InteractiveMap tests + Playwright map suite + build |
| B | W18.1-P0-011 | Listing completeness scoring + remediation checklist | @Mira + @Una | P0 | completenessScorer tests + widget tests + build |
| B | W18.1-P0-012 | Verification/freshness badges with evidence fields | @Una + @Mira | P0 | VerificationBadge tests + FreshnessBadge tests + build |
| C | W18.1-P0-017 | One-click WhatsApp conversation→lead conversion + ownership routing | @Mira + @Una | P0 | nadia convert-to-lead tests + ConversationsTab tests + build |
| C | W18.1-P0-019 | Funnel economics dashboard (API wire-up) | @Mira + @Katherine | P0 | FunnelEconomicsDashboard tests + reporting.ts tests + build |
| C | W18.1-P0-020 | Baseline KPI tracker (API wire-up) | @Mira + @Katherine | P0 | KPIBaselineTracker tests + build |
| D | W18.1-P0-013 | KYC gate before high-risk transaction transitions | @Mira + @Sofia + @Katherine | P0 | kyc-gate tests + transactions.test.ts + typecheck + build |
| D | W18.1-P0-009 | Mobile-first CRM command bar (top 8 field actions) | @Tracy + @Una | P0 | MobileCRMCommandBar tests + Playwright mobile suite + build |

### Tasks Deferred to Session 3

| ID | Task | Reason |
|----|------|--------|
| W18.1-P0-010 | Offline-safe draft capture for notes/viewing feedback | PWA complexity — requires IndexedDB spike, sync-conflict resolution strategy, and service worker update. Scheduled as a standalone Session 3 PWA mini-wave. |
| W18.1-P0-018 | Channel orchestration cadence rules (WA/email/call) | Requires a cadence rules engine design (no data model exists yet). @Margaret to roadmap as first item of Session 3 planning. |

### Session 2 Architectural Risks

1. **KYC schema:** `kycStatus` field existence in `prisma/schema.prisma` must be confirmed before P0-013 coding begins.
2. **Funnel reporting performance:** Composite indexes needed on `Lead.createdAt`, `Viewing.leadId`, `Offer.leadId` before P0-019 goes live.
3. **WA lead conversion idempotency:** `nadiaConversation.leadId` FK must be unique-constrained to prevent duplicate lead creation.
4. **Advanced facets schema:** `furnishing`, `handoverStage`, `feeBand` fields on Property model must be verified before P0-002 implementation.

### Session 2 Exit Criteria

- All 10 batch tasks have passing tests (as specified per batch validation gate)
- `npm run typecheck` — 0 errors
- `npm run build` — green
- `npm run plans:validate` — 0 errors
- `PROJECT_PROGRESS.md` updated with Session 2 delivery evidence
- `DAILY_MILESTONE_TRACKER.md` updated
- All Session 2 tasks marked ✅ in this backlog

### 90-Day KPI Progress Check (at Session 2 close)

| KPI | Target | Session 1 Baseline | Session 2 Expected |
|-----|--------|-------------------|--------------------|
| First response time | -40% | Not measured | Measurable via leads.ts timestamps |
| Viewing conversion | +25% | Not measured | Measurable via viewings/leads ratio |
| Listing completeness | +30% | ~62% (hardcoded) | Real score via P0-011 endpoint |
| Mobile CRM sessions | +35% | ~31% (hardcoded) | Partially measurable with P0-009 |
| Offer submission rate | +20% | Not measured | Measurable via P0-019 funnel data |
