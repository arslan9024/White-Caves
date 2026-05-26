# Wave 18.1 — Competitor Parity Execution Backlog

**Wave:** 18.1  
**Focus:** Convert Wave 18 parity findings into execution-ready improvements  
**Status:** 📋 Planned  
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
| W18.1-P0-004 | Lead Capture & Conversion | Build one-click inquiry→viewing path from listing cards and detail page | @Mira + @Una | +25% viewing booking conversion | Route tests + UX flow tests |
| W18.1-P0-005 | Lead Capture & Conversion | Enforce lead SLA timers with escalating nudges to assignee/manager | @Mira + @Katherine | -40% median first-response time | Scheduler tests + dashboard evidence |
| W18.1-P0-006 | Lead Capture & Conversion | Create unified lead timeline across web forms, WhatsApp, calls, tasks | @Mira + @Jaime | +20% lead-to-offer progression | Timeline API tests + CRM UI checks |
| W18.1-P0-007 | CRM Workflow Productivity | Ship one-screen agent task cockpit (today queue, SLA risk, priority) | @Una + @Mira | +35% daily task completion | Component tests + role-access checks |
| W18.1-P0-008 | CRM Workflow Productivity | Add bulk lead actions (assign, stage, reminder, archive) with audit trail | @Mira + @Katherine | -25% repetitive CRM actions per lead | Bulk-action tests + audit evidence |
| W18.1-P0-009 | Mobile CRM & Field Ops | Deliver mobile-first CRM command bar for top 8 field actions | @Tracy + @Una | +35% mobile CRM completion rate | Playwright mobile suite |
| W18.1-P0-010 | Mobile CRM & Field Ops | Add offline-safe draft capture for notes/viewing feedback | @Mira + @Ruchi | 0% data loss incidents in spotty network | PWA cache tests + sync tests |
| W18.1-P0-011 | Listing Quality & Trust | Add listing completeness scoring and remediation checklist | @Mira + @Lea | +30% listing completeness score | Listing score tests + UI checks |
| W18.1-P0-012 | Listing Quality & Trust | Add verification/freshness badges with traceable evidence fields | @Sofia + @Mira | +20% trust interactions on listing pages | Compliance route tests + frontend checks |
| W18.1-P0-013 | Security/Compliance/Audit | Enforce KYC gate before high-risk transaction transitions | @Sofia + @Mira | 100% gated risky transactions | Compliance tests + RBAC tests |
| W18.1-P0-014 | Security/Compliance/Audit | Add permit/BRN/Ejari expiry risk queue with escalation | @Sofia + @Katherine | 0 missed critical expiry alerts | Scheduler + notification tests |
| W18.1-P0-015 | Tenant/Landlord Lifecycle | Expand tenant portal lifecycle (payments, renewals, maintenance SLA) | @Victoria + @Mira | +30% tenant portal MAU | Portal integration tests |
| W18.1-P0-016 | Tenant/Landlord Lifecycle | Expand landlord portfolio health dashboard with issue hotspots | @Victoria + @Mira | +30% landlord portal MAU | Dashboard tests + data contract checks |
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

- [ ] Finalize parity rubric and lock benchmark evidence set
- [ ] Build matrix v2 with workflow-level evidence links
- [ ] Expand gap register to 132-item inventory (P0/P1/P2)
- [ ] Approve top-20 P0 queue and owner assignments
- [ ] Stand up KPI baseline dashboard
- [ ] Start weekly re-benchmark + queue hygiene loop

