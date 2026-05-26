# Wave 18 — System Design Document (SDD)

**Wave:** 18  
**Focus:** Real-Estate Platform Workflow Parity Audit + Gap Backlog Generation  
**Status:** 📋 Planned  
**Date:** 2026-05-26  
**Owners:** @Ada + @Margaret + @Mira + @Sofia + @Victoria + @Invoice + @Katherine

---

## Objective

Create a benchmarked, evidence-backed workflow parity model comparing White Caves against top real-estate platforms, then convert uncovered gaps into executable planning artifacts and wave backlogs.

---

## Locked Scope (Wave 18.1 Defaults)

### Platform Set (v2)

1. Property Finder (UAE)
2. Bayut / dubizzle (UAE)
3. Houza (UAE challenger UX)
4. Zillow (US product benchmark)
5. Rightmove (UK listing benchmark)
6. Compass (luxury brokerage workflow benchmark)
7. Salesforce (enterprise CRM workflow benchmark)
8. HubSpot (automation + pipeline UX benchmark)

### Region

- Primary: Dubai/UAE workflows
- Secondary: global parity for CRM automation, funnel management, and enterprise workflow depth

### Parity Model

- **UAE-adapted parity (default):** White Caves does not require pixel/process cloning if business outcome and compliance obligations are equivalent or stronger for UAE regulations.

---

## External Workflow Taxonomy (Normalized)

W18 taxonomy standardizes all benchmarks into the same process model:

1. Lead capture
2. Lead qualification/scoring
3. Listing lifecycle
4. Viewing scheduling & feedback
5. Offers/negotiation
6. Contracts & document lifecycle
7. Payments & finance workflows
8. Leasing & Ejari workflows
9. Maintenance & tenant support
10. Renewals
11. Compliance/KYC/AML
12. Reporting & analytics
13. Communications (WhatsApp/email)
14. Tenant/Landlord portals
15. Admin ops & governance

---

## White Caves Source-of-Truth Inputs

- Canonical planning stack:
  - `plans/MASTER_PLAN.md`
  - `plans/PENDING_TASKS_ONLY.md`
  - `plans/waves/README.md`
- Workflow docs:
  - `business_docs/04_workflows/*`
  - `business_docs/09_crm_features/*`
  - `business_docs/05_requirements/functional-requirements.md`
- Implementation surfaces:
  - `src/config/crmModuleRegistry.tsx`
  - `server/index.ts`
  - `server/routes/*`

---

## Core Artifact in Wave 18

- [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./WAVE_18_WORKFLOW_PARITY_MATRIX.md)
- [`WAVE_18_SERVER_GAP_REPORT.md`](./WAVE_18_SERVER_GAP_REPORT.md)
- [`WAVE_18_SERVER_REMEDIATION_BACKLOG.md`](./WAVE_18_SERVER_REMEDIATION_BACKLOG.md)
- [`WAVE_18_BACKEND_ARCHITECTURE_MAP.md`](./WAVE_18_BACKEND_ARCHITECTURE_MAP.md)
- [`WAVE_18_COMPETITOR_PARITY_WEEKLY_DELTA.md`](./WAVE_18_COMPETITOR_PARITY_WEEKLY_DELTA.md)
- [`WAVE_18_KPI_DASHBOARD_BASELINE.md`](./WAVE_18_KPI_DASHBOARD_BASELINE.md)

This matrix is the canonical scoring surface with:

- standardized workflow rows
- benchmark platform columns
- White Caves doc/code coverage columns
- validation evidence column
- prioritized gap classification (P0/P1/P2)

---

## Key Design Decisions

1. **Documentation drift is corrected before scoring** (avoid false positives).
2. **Coverage requires both doc + code signal** for “Included”.
3. **Status scale is strict:** Included | Partial | Missing | Unknown.
4. **Unknown is acceptable in v1** when public evidence is weak; it must be converted into a follow-up evidence task.
5. **Gap output is backlog-ready** with impacted modules, dependencies, and acceptance criteria.

---

## Priority Framework

- **P0**: compliance/legal/revenue-critical workflows (KYC, AML, Ejari, payment controls, commission integrity)
- **P1**: conversion/retention operations (viewings, offers, reminders, comms, renewals)
- **P2**: UX/reporting/admin optimization enhancements

### Weighted Prioritization Formula

- Revenue impact: 35%
- Customer impact: 25%
- Strategic moat: 20%
- Delivery effort: 10%
- Risk/compliance urgency: 10%

---

## Opportunity Inventory Scope

Wave 18.1 converts parity findings into a structured **132-item** opportunity register across 12 pillars:

1. Search & Discovery (14)
2. Listing Quality & Trust (10)
3. Lead Capture & Conversion (12)
4. CRM Workflow Productivity (18)
5. WhatsApp/Omnichannel & AI Ops (12)
6. Tenant/Landlord Lifecycle (12)
7. Analytics & Revenue Intelligence (9)
8. Mobile CRM & Field Ops (8)
9. Performance/Core Web Vitals/PWA (8)
10. Integrations & Data Platform (11)
11. Security/Compliance/Audit (8)
12. SEO/Growth/Marketplace Flywheel (10)

---

## Execution Roadmap (Phases A–F)

### Phase A — Benchmark & Scoring Baseline (2 weeks)

1. Lock parity rubric
2. Capture competitor evidence per workflow
3. Score White Caves Included/Partial/Missing/Unknown
4. Rank gaps by business impact
5. Freeze P0/P1/P2 queue with owners and validation gates

Deliverable: Wave 18 parity matrix v2 + prioritized gap queue.

### Phase B — Revenue-Critical Parity First (6–8 weeks)

- Discovery + matching quality
- Conversion funnel clarity (lead→viewing→offer)
- CRM productivity cockpit + bulk workflows

Deliverable: uplift in response speed, booking rate, and offer rate.

### Phase C — Trust, Quality, Compliance Leadership (4–6 weeks)

- Listing verification + freshness + completeness scoring
- Agent credibility surfaces
- Compliance and document confidence indicators

Deliverable: increased trust and reduced operational risk.

### Phase D — Tenant/Landlord Experience Superiority (4–6 weeks)

- Full lifecycle portal parity (payments, renewals, maintenance, documents)
- Proactive lifecycle communication
- Landlord portfolio hotspot analytics

Deliverable: retention and lifecycle engagement moat.

### Phase E — AI + Omnichannel Differentiation (4–6 weeks)

- Intent/context-aware WhatsApp orchestration
- Lead score explainability
- Best-next-action recommendations
- Channel cadence optimization with guardrails

Deliverable: productivity and conversion advantage.

### Phase F — Growth Engine (ongoing)

- Programmatic SEO by area/project/intent
- Structured-data and indexation hygiene
- UGC/social proof + referral lifecycle loops
- A/B testing discipline for key funnels

Deliverable: compounding organic growth and lower acquisition cost.

---

## Wave 18 Deliverables

1. v2 parity matrix (8 platforms, top 25+ workflows)
2. server gap report + endpoint readiness matrix + risk heatmap (`WAVE_18_SERVER_GAP_REPORT.md`)
3. prioritized P0/P1/P2 server remediation backlog (`WAVE_18_SERVER_REMEDIATION_BACKLOG.md`)
4. backend modularization architecture map (`WAVE_18_BACKEND_ARCHITECTURE_MAP.md`)
5. drift reconciliation in CRM feature index docs
6. canonical queue updates in `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, `waves/README.md`
7. validation gate definition and weekly re-benchmark operating loop (`WAVE_18_COMPETITOR_PARITY_WEEKLY_DELTA.md`)
8. KPI baseline + trend tracking model (`WAVE_18_KPI_DASHBOARD_BASELINE.md`)
9. execution-ready Wave 18.1 backlog (`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`) with top-20 P0 tasks

---

## Exit Criteria

Wave 18 is complete when:

1. parity matrix exists and is linked in canonical plans
2. every gap has priority and owner mapping
3. top-20 P0 tasks are acceptance-criteria ready
4. queue updates are reflected in canonical planning files
5. validation gates are testable and explicit
6. `npm run plans:validate` passes
