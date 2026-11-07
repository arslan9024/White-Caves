# White Caves CRM — Master Implementation Plan

> **Version:** 2.1  
> **Last Updated:** June 2026  
> **Status:** Active  
> **Maintained By:** Technical & Product Teams

---

## Executive Summary

White Caves CRM is a Dubai real estate operations platform serving 200+ agents with AI-powered lead management, WhatsApp communication, property inventory, finance management, and compliance tooling. The core platform (Phase 1) is production-ready, and the orchestration layer now exposes progress-intelligence, ETA forecasting, drift detection, and dashboard-visible reroute hints. This plan governs all remaining development through to full feature completion.

---

## Current State Assessment (March 2026)

### ✅ Fully Implemented

- Authentication (JWT + Firebase OAuth + 2FA)
- Lead management (Clara) — full CRUD, scoring, pipeline
- Property inventory (Mary) — CRUD, media upload, Excel import
- Sales transactions (Sophia) — CRUD, pipeline view
- Commission management (Theodora) — basic CRUD + approval workflow
- Tenant management (Daisy) — basic CRUD
- Compliance dashboard (Laila) — basic status + requirements
- Finance summary (Theodora) — aggregated KPIs
- Executive dashboard (Zoe) — KPI overview
- WhatsApp inbox UI (Nadia) — message list + conversation view
- AI assistant plans API + editor
- Progress intelligence dashboard — ETA, velocity, drift, blocker aging, and trend exports
- Design system — gold/dark theme, all shared components
- CI/CD pipeline (GitHub Actions → Vercel)

### ⏳ Partially Implemented

- WhatsApp Cloud API integration — UI complete, backend stubbed
- Stripe payments — frontend partial, webhook not complete
- Agent performance metrics — basic list; detailed metrics missing
- Compliance KYC workflow — status field exists; full document workflow missing
- Ejari tracking — fields referenced in docs but not in Lease model

### 🔲 Not Started

- WhatsApp Bot (Nina) — conversation flows, intent classification
- WhatsApp Broadcast Campaigns (Olivia)
- Portal syndication (PropertyFinder + Bayut)
- Ejari module — full implementation
- Lease management full module (rent schedule, payment tracking)
- Financial reports export (PDF/Excel)
- RERA permit expiry automation
- PDPL consent management
- KYC/AML third-party screening
- Marketing campaigns module
- Agent performance targets
- Multi-currency display
- Arabic language (RTL)

---

## Orchestration Completion Criteria

The platform only counts as fully development-complete when the execution stack stays observable and reproducible:

- `plans/MASTER_PLAN.md` and `plans/PENDING_TASKS_ONLY.md` remain current
- `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md` mirror the live queue
- `scripts/orchestrator/progress-intelligence.ps1` and `scripts/orchestrator/dashboard.ps1` continue to emit ETA, drift, blockers, and trend visibility
- `npm run plans:validate` passes after every planning update
- `npm run quality:quick` remains green before release handoff

---

## Development Phases

---

## Phase A: Foundation Completion (Weeks 1–4)

**Goal:** Close all critical gaps in the existing implemented modules.

### A1: WhatsApp Cloud API — Real Integration

- [ ] Implement Meta webhook handler with HMAC verification
- [ ] Connect `WhatsAppBotService.ts` to live WhatsApp Cloud API
- [ ] Message send: text, template, image, document
- [ ] Real-time conversation state management
- [ ] Agent inbox: WebSocket or long-poll for new message notifications
- [ ] Conversation assignment to agents

**Effort:** 2 weeks | **Owner:** Backend + Frontend  
**Dependency:** Meta WABA account + approved phone numbers

### A2: Ejari Fields in Lease Model

- [ ] Add `ejariContractNumber`, `ejariRegistrationDate`, `ejariExpiryDate` to Lease Prisma schema
- [ ] Update tenant/lease API endpoints to include these fields
- [ ] Add validation: lease cannot be set to "Active" without `ejariContractNumber`
- [ ] Add 30-day expiry warning to compliance dashboard

**Effort:** 3 days | **Owner:** Backend  
**Dependency:** None

### A3: RERA Permit Enforcement

- [ ] Add `permitNumber` and `permitExpiryDate` to Property schema (fields exist, enforcement needed)
- [ ] Block property publish if permit missing or expired
- [ ] Auto-unpublish properties with expired permits (daily cron job)
- [ ] 30-day expiry warning notification

**Effort:** 3 days | **Owner:** Backend  
**Dependency:** None

### A4: Financial Report Export

- [ ] Commission Detail Report → Excel export
- [ ] Agent Commission Statement → PDF (with company letterhead)
- [ ] Transaction Summary → Excel export
- [ ] Monthly P&L Report → PDF generation

**Effort:** 1 week | **Owner:** Backend + Frontend  
**Dependency:** Excel/PDF library (ExcelJS + PDFKit or Puppeteer)

---

## Phase B: Lease & Tenancy Full Module (Weeks 5–7)

**Goal:** Complete the tenancy management lifecycle from application to move-out.

### B1: Lease Agreement Module

- [ ] Full Lease model with all fields (see `09_crm_features/tenancy-ejari.md`)
- [ ] Lease CRUD API (`/api/leases`)
- [ ] Lease generation from template (PDF pre-filled)
- [ ] Lease status lifecycle (draft → signed → active → expired/terminated)
- [ ] Ejari integration fields + enforcement

### B2: Rent Payment Tracking

- [ ] Auto-generate rent schedule on lease activation
- [ ] Rent payment status tracking (pending → paid / overdue)
- [ ] Day 5/10 automated WhatsApp reminder workflow
- [ ] Late fee calculation (Day 15)
- [ ] Escalation to compliance (Day 25)
- [ ] Payment confirmation recording

### B3: Maintenance Request Module

- [ ] MaintenanceRequest model and API
- [ ] Priority levels: Urgent / High / Normal / Low
- [ ] Contractor assignment
- [ ] Status lifecycle: Open → In Progress → Pending Approval → Closed
- [ ] Tenant notification on status updates
- [ ] 48-hour SLA alert for normal requests

**Effort:** 3 weeks | **Owner:** Full Stack  
**Dependency:** Phase A2 completed

---

## Phase C: WhatsApp Bot & Automation (Weeks 8–11)

**Goal:** Build the Nina bot for automated first-response and lead pre-qualification.

### C1: Nina Bot Core

- [ ] Conversation flow engine (state machine)
- [ ] Intent classification (rule-based NLP first)
- [ ] Language detection (Arabic/English)
- [ ] Property inquiry flow (budget → type → match → send listings)
- [ ] Viewing booking flow (availability → confirm → calendar)
- [ ] FAQ knowledge base
- [ ] Lead pre-qualification data collection → auto-create in Clara

### C2: Escalation Engine

- [ ] Confidence threshold detection (< 60%)
- [ ] Human trigger words detection ("agent", "human", "speak to someone")
- [ ] Nadia routing on escalation
- [ ] Queue management when all agents busy
- [ ] Handover context passed to agent

### C3: Broadcast Campaign Module (Olivia)

- [ ] Audience builder with lead filters
- [ ] Campaign creation: type, template, schedule
- [ ] Send execution with per-recipient personalisation
- [ ] Delivery tracking (sent / delivered / read)
- [ ] Campaign analytics dashboard

**Effort:** 4 weeks | **Owner:** Full Stack  
**Dependency:** Phase A1 completed; Meta WhatsApp API credentials live

---

## Phase D: Intelligence & Analytics (Weeks 12–15)

**Goal:** AI-powered analytics and portal syndication.

### D1: Portal Syndication (PropertyFinder + Bayut)

- [ ] PortalSyncService — XML feed generator
- [ ] PropertyFinder feed endpoint
- [ ] Bayut feed endpoint
- [ ] Real-time status push on property update (sold/rented)
- [ ] Inbound lead webhook from both portals
- [ ] Lead auto-creation in Clara from portal inquiries
- [ ] Sync status per property (synced / pending / error)

### D2: Agent Performance Module

- [ ] Detailed agent performance metrics API
- [ ] Leaderboard endpoint
- [ ] Monthly target setting + progress tracking
- [ ] Response time KPI measurement
- [ ] Agent performance dashboard UI
- [ ] Agent self-dashboard

### D3: Advanced Financial Reporting

- [ ] Monthly P&L auto-generation
- [ ] Rental income report by landlord
- [ ] Revenue forecast (pipeline stage probabilities)
- [ ] Scheduled report delivery (email digest)

### D4: Multi-Currency Display

- [ ] ExchangeRate API integration (hourly refresh)
- [ ] Currency selector component in property listings
- [ ] All monetary values convertible on display
- [ ] "Approximate conversion" disclaimer

**Effort:** 4 weeks | **Owner:** Full Stack  
**Dependency:** PropertyFinder / Bayut partner agreements

---

## Phase E: Compliance & Security (Weeks 16–18)

**Goal:** Full regulatory compliance implementation.

### E1: KYC Workflow Module

- [ ] KYC checklist per transaction type
- [ ] Document upload against KYC items
- [ ] KYC status tracking (Pending → Under Review → Verified → Rejected)
- [ ] Transaction block enforcement when KYC not verified
- [ ] Laila compliance review dashboard

### E2: AML Screening Integration

- [ ] ComplyAdvantage API integration
- [ ] Auto-screening on client record creation
- [ ] PEP/Sanctions match alert workflow
- [ ] AML risk score calculation
- [ ] SAR workflow (creation, approval, goAML submission tracking)

### E3: PDPL Consent Management

- [ ] Consent checkbox + privacy policy link on all forms
- [ ] Consent record storage (user, date, version, purpose)
- [ ] Opt-out mechanism for marketing
- [ ] Data export function (right of access)
- [ ] Account deletion request workflow

### E4: Audit Log Enhancement

- [ ] Complete mutation audit (all create/update/delete logged with diff)
- [ ] Login event logging with IP + user agent
- [ ] Audit log search + export UI
- [ ] Audit log retention enforcement (5-year minimum)

**Effort:** 3 weeks | **Owner:** Backend + Compliance  
**Dependency:** ComplyAdvantage API contract

---

## Phase F: Expansion Features (Weeks 19–24)

**Goal:** Extended features for growth and user experience.

### F1: Arabic Language (RTL)

- [ ] i18n library integration (react-i18next)
- [ ] Arabic translations for all UI strings
- [ ] RTL CSS layout toggle
- [ ] Arabic number / date formats
- [ ] Arabic WhatsApp bot responses

### F2: Landlord & Tenant Portals

- [ ] Landlord self-service login + property overview
- [ ] Landlord: view tenants, rent payments, maintenance requests
- [ ] Tenant portal: view lease, payment schedule, submit maintenance requests
- [ ] Tenant: download Ejari certificate + lease document

### F3: Mobile PWA

- [ ] Progressive Web App manifest + service worker
- [ ] Mobile-optimised navigation
- [ ] Push notifications (new lead, commission paid, reminder)
- [ ] Offline read mode for property list

### F4: Cipher & Maven (AI Intelligence)

- [ ] Cipher: Market intelligence dashboard (OpenAI GPT-4 powered)
- [ ] Dubai property trend analysis using DLD data
- [ ] Maven: Investment ROI calculator + recommendation engine
- [ ] Yield predictions by area and property type

**Effort:** 6 weeks | **Owner:** Full Stack + AI  
**Dependency:** OpenAI API key; Arabic translation resources

---

## Milestone Summary

| Milestone        | Target Date  | Key Deliverables                                   |
| ---------------- | ------------ | -------------------------------------------------- |
| Phase A Complete | April 2026   | WhatsApp live, RERA enforcement, financial exports |
| Phase B Complete | May 2026     | Full lease/tenancy module with Ejari               |
| Phase C Complete | June 2026    | Nina bot live, broadcast campaigns                 |
| Phase D Complete | July 2026    | Portal syndication, multi-currency, agent KPIs     |
| Phase E Complete | August 2026  | Full KYC/AML/PDPL compliance                       |
| Phase F Complete | October 2026 | Arabic, portals, PWA, Cipher/Maven                 |

---

## Technical Debt Register

| Item                                                                    | Impact   | Priority | Target Phase |
| ----------------------------------------------------------------------- | -------- | -------- | ------------ |
| WhatsApp Cloud API — backend is stubbed, not real                       | High     | P1       | Phase A      |
| Ejari fields missing from Lease schema                                  | High     | P1       | Phase A      |
| No rent payment schedule generation                                     | High     | P1       | Phase B      |
| Commission split cannot be customised per deal                          | Medium   | P2       | Phase A      |
| No server-side data export (reports only in UI)                         | Medium   | P2       | Phase A      |
| No Arabic RTL support                                                   | Medium   | P3       | Phase F      |
| No scheduled task runner (cron) for automation                          | High     | P1       | Phase A      |
| Prisma schema missing Lease, RentPayment, MaintenanceRequest models     | High     | P1       | Phase B      |
| RERA permit enforcement not implemented (field exists but not enforced) | Critical | P0       | Phase A      |

---

## Resource Requirements

| Phase   | Frontend Days | Backend Days | DevOps/Infra | External Dependencies    |
| ------- | ------------- | ------------ | ------------ | ------------------------ |
| Phase A | 10            | 10           | 2            | WhatsApp WABA account    |
| Phase B | 10            | 14           | 1            | None                     |
| Phase C | 14            | 14           | 2            | Meta WABA live           |
| Phase D | 12            | 16           | 3            | Portal agreements        |
| Phase E | 8             | 14           | 2            | ComplyAdvantage contract |
| Phase F | 20            | 16           | 5            | OpenAI key; translation  |

---

## Risk Register

| Risk                                                     | Probability | Impact   | Mitigation                                                             |
| -------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------- |
| Meta WABA approval delayed                               | Medium      | High     | Start application immediately; use Twilio as interim                   |
| PropertyFinder / Bayut partner agreement takes > 60 days | Medium      | Medium   | Start with XML feed (no agreement needed for basic sync in some tiers) |
| PDPL non-compliance fine                                 | Low         | Critical | Prioritise PDPL in Phase E; engage legal counsel                       |
| OpenAI API cost overrun                                  | Low         | Medium   | Implement token limits and caching; cost cap alerts                    |
| Team capacity bottleneck                                 | Medium      | Medium   | Phase F is flexible in timeline; Phase A–C non-negotiable              |

---

## Definition of Done (Per Feature)

A feature is complete when:

- [ ] Code reviewed and merged to `main` branch
- [ ] Unit tests pass (≥ 80% coverage for new logic)
- [ ] TypeScript strict mode — no type errors
- [ ] API documented (endpoint + request/response example)
- [ ] Business document updated to reflect implementation
- [ ] Acceptance criteria verified against test scenarios
- [ ] Deployed to staging; smoke test passed
- [ ] Security: no new CodeQL alerts
- [ ] Performance: key APIs meet NFR targets (p95 < 500ms)

---

**Version:** 2.0 | **Last Updated:** March 2026 | **Maintained By:** Product & Technical Teams
