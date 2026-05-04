# Pending Tasks Only

## 🆓 FREE AGENT QUEUE — Hourly Rotation (17 Agents, 60-min cycle)

> Run `scripts/free-agents-loop.ps1` to see which agent is active RIGHT NOW with the exact copy-paste prompt.
> Manual mode: find your agent below, copy the **Task 1** prompt, paste into the free tool, paste output into the target file, commit.

### ⏰ Schedule At-a-Glance

| Slot | Agent | Free Tool | Task 1 Target File |
|------|-------|-----------|-------------------|
| **:00** | @Annie | [Google AI Studio](https://aistudio.google.com/) | `tenant-portal.md` |
| **:05** | @Rachel | [Google AI Studio](https://aistudio.google.com/) | `seo-strategy.md` |
| **:10** | @Marissa | [Google AI Studio](https://aistudio.google.com/) | `luxury-segment.md` |
| **:15** | @Timnit | [Google AI Studio](https://aistudio.google.com/) | `dld-integration.md` |
| **:20** | @Hedy | [Groq Console](https://console.groq.com/) | `audit-trail.md` |
| **:25** | @Maya | [Groq Console](https://console.groq.com/) | `off-plan-projects.md` |
| **:30** | @Booking | [Groq Console](https://console.groq.com/) | `viewings.md` |
| **:35** | @Jaime | [Groq Console](https://console.groq.com/) | `offers.md` |
| **:40** | @Fei-Fei | [DeepSeek Chat](https://chat.deepseek.com/) | `property-valuation.md` |
| **:45** | @Anima | [DeepSeek Chat](https://chat.deepseek.com/) | `secondary-sales.md` |
| **:50** | @Mary | [DeepSeek Chat](https://chat.deepseek.com/) | `sentinel-property.md` |
| **:55** | @Corinne | [DeepSeek Chat](https://chat.deepseek.com/) | `maintenance.md` |
| **Any** | @Invoice | [Groq Console](https://console.groq.com/) | `financial-reporting.md` ⚠️ VERIFY |
| **Any** | @Sofia | [Google AI Studio](https://aistudio.google.com/) | `compliance-requirements.md` ⚠️ VERIFY |
| **Any** | @Victoria | [Google AI Studio](https://aistudio.google.com/) | `landlord-portal.md` ✅ READY |
| **Any** | @Cassie | [DeepSeek Chat](https://chat.deepseek.com/) | `analytics-dashboard.md` ✅ READY |
| **Any** | @Joelle | [Groq Console](https://console.groq.com/) | `03_ai_assistants/README.md` ✅ READY |

---

### 📋 Full Copy-Paste Prompts — Task 1 for Each Agent

**@Annie — :00 — Google AI Studio**
```
@Annie — DRAFT: tenant-portal.md → spec all 6 tabs: TenantLeaseTab (lease details, start/end, monthly rent, status badge), TenantPaymentHistoryTab (payment records table, overdue detection, PDC status), TenantMaintenanceTab (submit request form, status tracking, contractor updates), TenantDocumentsTab (Ejari cert download, tenancy agreement PDF, NOC request button), TenantProfileTab (personal details, Emirates ID, passport expiry alert), TenantPortalHome (KPI tiles: active lease countdown, next payment due amount, open maintenance count). Include: API endpoint for each tab, authFetch pattern, error states, empty states.
```
**File:** `business_docs/09_crm_features/tenant-portal.md`

---

**@Rachel — :05 — Google AI Studio**
```
@Rachel — EXPAND: seo-strategy.md → add: Dubai property keyword clusters (buy villa Dubai, rent apartment Downtown, off-plan projects Dubai Marina, 2BR apartment JVC), local SEO setup (Google Business Profile for White Caves LLC, RERA agent profile optimization), Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1 with measurement plan), structured data schemas (RealEstateListing, LocalBusiness, FAQPage JSON-LD examples), Arabic/English multilingual SEO (hreflang tags, Arabic keyword research, RTL meta tags).
```
**File:** `business_docs/09_crm_features/seo-strategy.md`

---

**@Marissa — :10 — Google AI Studio**
```
@Marissa — DRAFT: luxury-segment.md → spec KairosLuxuryCRM module: luxury threshold definition (AED 5M+ sale or AED 30K+/month rent, areas: Palm Jumeirah, DIFC, Emirates Hills, Jumeirah Bay), VIP client profile (concierge service tier, private viewing scheduling with NDA requirement, dedicated agent assignment), white-glove workflow (chauffeur option flag, exclusive access booking log, post-viewing gift coordination), luxury listing requirements (professional photography brief: min 30 photos, Matterport 3D tour mandatory, drone footage), HNWI compliance (source of funds declaration, PEP screening, enhanced due diligence checklist per CBUAE AML guidelines).
```
**File:** `business_docs/09_crm_features/luxury-segment.md`

---

**@Timnit — :15 — Google AI Studio**
```
@Timnit — DRAFT: dld-integration.md → spec DLD API integration: Oqood off-plan registration (required fields: developer ID, project ID, buyer Emirates ID, unit number, sale price AED, SPA date, payment plan type), title deed transfer workflow (application submission, trustee appointment, fee calculation: 4% transfer fee + AED 580 admin + trustee fees), DLD REST API endpoints (POST /oqood/register, GET /titleDeed/{titleDeedNumber}, GET /transactions?propertyId=), error handling for DLD system downtime (queue failed requests, retry with exponential backoff, alert admin), DLD Smart Judge integration for disputes, White Caves as authorized trustee or broker authentication (API key management).
```
**File:** `business_docs/09_crm_features/dld-integration.md`

---

**@Hedy — :20 — Groq Console (Llama 3.1 70B)**
```
@Hedy — DRAFT: audit-trail.md → spec HenryAuditCRM module: audit log schema (userId, action, entityType: lead/property/lease/user/commission, entityId, oldValue JSON, newValue JSON, ipAddress, userAgent, timestamp — all fields immutable), tracked actions (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT, EXPORT, PERMISSION_CHANGE), write-once enforcement (append-only MongoDB collection with no updateOne/deleteOne allowed), audit search UI (filter by: user, entity type, action, date range — paginated 50 per page), compliance export (CSV + PDF report for RERA inspector — date-stamped, agent-signed), retention (7 years per UAE Commercial Transactions Law), real-time audit stream via WebSocket for admin live monitoring.
```
**File:** `business_docs/09_crm_features/audit-trail.md`

---

**@Maya — :25 — Groq Console (Llama 3.1 70B)**
```
@Maya — DRAFT: off-plan-projects.md → spec AtlasProjectsCRM: project schema (developer, project name, location GeoPoint, launch date, estimated completion, totalUnits, availableUnits, paymentPlanOptions array), unit inventory (unitNumber, floor, type: studio/1BR/2BR/3BR/penthouse, BUA sqft, view, listPrice, status: available/reserved/sold/transferred), buyer reservation workflow (EOI deposit receipt → SPA draft → signing appointment → Oqood DLD registration within 60 days → payment milestone schedule), project milestone tracker (construction % from developer API or manual update, estimated handover countdown, delay flag), ROI projection calculator (inputs: purchase price, expected rent per RERA index, service charge/sqft → outputs: gross yield %, net yield %, payback years).
```
**File:** `business_docs/09_crm_features/off-plan-projects.md`

---

**@Booking — :30 — Groq Console (Llama 3.1 70B)**
```
@Booking — DRAFT: viewings.md → spec /api/viewings route: viewing schema (propertyId, leadId, agentId, scheduledAt, durationMinutes: default 60, status: scheduled/confirmed/completed/cancelled/no_show, type: in-person/virtual, zoomLink if virtual, notes, feedbackRating 1-5, feedbackText), scheduling flow (lead selects slot from agent availability → confirmation WhatsApp message sent → 24h reminder → post-viewing WhatsApp feedback request), conflict detection (agent double-booking check, property already has confirmed viewing at same time), ICS file generation (.ics export with property address as location), bulk open-house slots (one property, multiple concurrent viewing slots), viewing conversion metric (viewings → offers rate per property, tracked in analytics).
```
**File:** `business_docs/09_crm_features/viewings.md`

---

**@Jaime — :35 — Groq Console (Llama 3.1 70B)**
```
@Jaime — DRAFT: offers.md → spec /api/offers route: offer schema (propertyId, buyerId or tenantId, agentId, offerPrice AED, offerType: purchase/lease, validUntil date, status: pending/countered/accepted/rejected/expired, conditions: mortgageSubject/cashPurchase/furnitureIncluded/subjectToNOC, counterOfferHistory array of {price, date, fromParty, notes}), offer workflow (buyer submits → agent presents to seller/landlord → counter offer round → acceptance → auto-generate MOU or LOI PDF), offer comparison table (multiple offers on same property: side-by-side price, conditions, buyer profile), automated expiry cron (set status=expired when validUntil passed), offer acceptance triggers (generate MOU PDF, WhatsApp notification to all parties, create RERA form task), offer analytics (average offers per property, average negotiation rounds, price achieved vs asking %).
```
**File:** `business_docs/09_crm_features/offers.md`

---

**@Fei-Fei — :40 — DeepSeek Chat (DeepSeek V3)**
```
@Fei-Fei — DRAFT: property-valuation.md → spec valuation engine in CipherMarketCRM: AVM inputs (location GeoPoint, BUA sqft, bedrooms, bathrooms, floor number, view type, building age, last transaction price from DLD), AVM output (estimated market value AED, confidence score %, comparable transactions used: min 3, value range ±10%), manual valuation override (RERA-certified valuer input, override reason required, manager approval workflow), rental yield calculator (gross: annual rent / purchase price × 100; net: (annual rent - service charges) / purchase price × 100), valuation history per property (date, estimated value, method: AVM/manual, valuer name), bank valuation request workflow (for mortgage pre-approval: RERA Form, bank-specific requirements by bank list), monthly bulk valuation refresh (cron job syncs latest DLD comparable data).
```
**File:** `business_docs/09_crm_features/property-valuation.md`

---

**@Anima — :45 — DeepSeek Chat (DeepSeek V3)**
```
@Anima — DRAFT: secondary-sales.md → spec /api/secondary-sales route and SecondarySalesAgent module: transaction workflow (seller instruction letter → property appraisal booking → listing activation → offer management → MOU signing → bank/cash buyer path split → NOC from developer within 20 days → DLD transfer appointment → commission disbursement to agent and company), dual-agency disclosure (RERA prohibition on undisclosed dual representation: Form A signed by seller, Form B signed by buyer, Form I if dual agent), secondary vs primary distinction (property.transactionType: primary/secondary field — affects DLD fee calculation and required forms), DLD transfer fee breakdown (4% of sale price split buyer/seller, trustee fees AED 4000-10000, DLD admin AED 580), secondary market KPIs (avg days listing to sold, price achieved vs original asking %, commission per deal average AED).
```
**File:** `business_docs/09_crm_features/secondary-sales.md`

---

**@Mary — :50 — DeepSeek Chat (DeepSeek V3)**
```
@Mary — DRAFT: sentinel-property.md → spec SentinelPropertyCRM module: property lifecycle state machine (Draft → Pending Review → Listed → Under Offer → Reserved → Sold/Leased → Withdrawn → Re-listed — with allowed transitions and required fields per state), RERA mandatory fields before listing (permit number, DED approval for off-plan, NOC from developer if applicable, title deed number for resale, floor plan uploaded), property quality score algorithm (photos count ×10pts, description > 100 words ×15pts, floor plan ×20pts, virtual tour ×25pts, 360 video ×30pts — max 100pts, score drives portal ranking), duplicate detection (same community + building + unit number = duplicate warning, override with reason), bulk CSV import spec (column mapping: propertyType, area, community, building, unit, bedrooms, bathrooms, BUA, price, agentId — validation rules, error report with row numbers).
```
**File:** `business_docs/09_crm_features/sentinel-property.md`

---

**@Corinne — :55 — DeepSeek Chat (DeepSeek V3)**
```
@Corinne — DRAFT: maintenance.md → spec /api/maintenance route: schema (propertyId, tenantId, landlordId, agentId, category: plumbing/electrical/HVAC/structural/appliance/pest/other, priority: emergency/high/medium/low, description, photos array max 5, status: open/assigned/scheduled/in_progress/completed/cancelled, assignedContractorId, scheduledAt, resolvedAt, resolutionNotes, tenantRating 1-5, invoiceAmount AED, invoiceApproved: boolean), tenant submission channels (portal form or WhatsApp bot → auto-priority: "water leak" = emergency, "broken AC" = high, "light bulb" = low), contractor assignment (approved contractor list by category, availability calendar, work order PDF generation), SLA breach alerting (emergency: 4h, high: 24h, medium: 72h, low: 7 days — alert landlord + manager on breach), landlord cost approval (repairs > AED 500 require landlord WhatsApp approval before contractor proceeds), completion invoice attachment, tenant rating prompt after resolution.
```
**File:** `business_docs/09_crm_features/maintenance.md`

---

### 📋 Original 5 Free Agents — Current Tasks

**@Invoice — Any time — Groq Console** ⚠️ VERIFY (highest priority)
```
@Invoice — AUDIT: financial-reporting.md → verify 11 sections present; if missing add: UAE VAT 5% section (FTA quarterly filing), rolling 12-month cash flow forecast, budget-vs-actual variance table, invoice format spec with TRN, payout schedule rules
```
**File:** `business_docs/09_crm_features/financial-reporting.md`

---

**@Sofia — Any time — Google AI Studio** ⚠️ VERIFY (highest priority)
```
@Sofia — AUDIT: compliance-requirements.md → verify 12 sections present; if missing add: Oqood off-plan registration rules, escrow account compliance, RERA/DLD penalty table with fine amounts by violation type, pricing/discount approval rules
```
**File:** `business_docs/05_requirements/compliance-requirements.md`

---

**@Victoria — Any time — Google AI Studio** ✅ READY
```
@Victoria — EXPAND: landlord-portal.md → add KYC onboarding flow section, NOC letter generation workflow, 3-month grace period rules, rent increase notice procedure
```
**File:** `business_docs/09_crm_features/landlord-portal.md`

---

**@Cassie — Any time — DeepSeek Chat** ✅ READY
```
@Cassie — EXPAND: analytics-dashboard.md → add mobile analytics view specification (responsive breakpoints, touch-friendly KPI cards), data export CSV/Excel API endpoint spec with column mapping
```
**File:** `business_docs/09_crm_features/analytics-dashboard.md`

---

**@Joelle — Any time — Groq Console** ✅ READY
```
@Joelle — DRAFT: 03_ai_assistants/README.md → add personas 25-35 (Quill the Copywriter, Lumen the Data Analyst, Crest the Property Valuer, Prism the Market Researcher, Echo the Follow-up Bot + 5 more). Add failure/fallback behavior section: API timeout handling, rate limit graceful degradation, human handoff triggers
```
**File:** `business_docs/03_ai_assistants/README.md`

**⚡ Priority order: @Invoice → @Sofia first (gate VERIFY), then all others**

---

## Canonical Source

- [`MASTER_PLAN.md`](./MASTER_PLAN.md) — official project source of truth

- [ ] [`IMPROVEMENTS_BACKLOG.md`](./IMPROVEMENTS_BACKLOG.md) — 38-item improvement backlog (all phases)

## Active Pending Plans

- [ ] [`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md) 🆕 _(active: free-agent documentation completion gates)_
- [ ] [`PHASE_23_24_25_IMPLEMENTATION_PLAN.md`](./PHASE_23_24_25_IMPLEMENTATION_PLAN.md) _(current active canonical plan)_
- [x] [`PHASE_24_MODULE_TRACEABILITY_MATRIX.md`](./PHASE_24_MODULE_TRACEABILITY_MATRIX.md) ✅ **COMPLETE** — detailed role matrices + cross-module dependency chain
- [x] [`PHASE_24_ACCEPTANCE_TEST_PLAN.md`](./PHASE_24_ACCEPTANCE_TEST_PLAN.md) ✅ **NEW: 144 audit-testable scenarios**
- [x] [`PHASE_25_OPERATIONAL_VERIFICATION_LOG.md`](./PHASE_25_OPERATIONAL_VERIFICATION_LOG.md) ✅ **COMPLETE** — runtime/build verification evidence logged
- [x] [`PHASE_25_EXECUTION_GUIDE.md`](./PHASE_25_EXECUTION_GUIDE.md) ✅ **COMPLETE** — planned items implemented and pushed
- [ ] [`PHASE_1_HOMEPAGE.md`](./PHASE_1_HOMEPAGE.md)
- [ ] [`PHASE_2_LANDLORD_TENANT.md`](./PHASE_2_LANDLORD_TENANT.md)
- [ ] [`PHASE_3_CRM_SUPERUSER.md`](./PHASE_3_CRM_SUPERUSER.md)
- [ ] [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md)
- [ ] [`PHASE_19_NEXT_PHASE_EXECUTION_CHECKLIST_APR27.md`](./PHASE_19_NEXT_PHASE_EXECUTION_CHECKLIST_APR27.md)
- [ ] [`MASTER_PLAN_CRM_EXCELLENCE.md`](./MASTER_PLAN_CRM_EXCELLENCE.md)

## Active Audit Work

- [ ] [`audit-round-66.md`](./audit-round-66.md)
- [ ] [`audit-round-69.md`](./audit-round-69.md)
- [ ] [`audit-round-70.md`](./audit-round-70.md)

## Immediate Pending Focus

- [ ] Phase 26: free-agent context enrichment completion (landlord-portal, revenue-model, analytics-dashboard, AI personas 25-40)
- [ ] Phase 23: business docs + module business-logic alignment (Leads, Inventory, Sales, Finance, Leasing, WhatsApp)
- [ ] Branch governance unification: development daily commits, main monthly release-only merges

- [x] Phase 25: homepage improvement task ownership + operational dev/build verification log
- [x] Homepage polish: featured properties visibility, image integrity, mobile audit, contact success state, lighthouse target
- [ ] Portals: wire maintenance/payment persistence, add portal subroutes + mobile verification
- [ ] CRM: managing director sign-in flow, dashboard landing, core tab integration, assistant dashboard render validation
- [ ] Phase 19 week-4 hardening: baseline capture, OWASP gap closure, DR rehearsal, monitoring accuracy

## Newly Completed Progress (April 29, 2026)

- [x] Landlord portal UI MVP complete: Properties, Tenants, Payments, Maintenance, Documents
- [x] Tenant portal UI MVP complete: Lease, Payment History, Maintenance, Documents
- [x] Portal route protection present for `/landlord-portal` and `/tenant-portal`
- [x] Focused portal regression suite passing: 139 tests
- [x] Portal production builds verified during implementation sessions

## Archive Rule

When a phase-plan file is completed or superseded, move it to `../archives/plans/completed/` so this folder stays focused on unfinished work.
