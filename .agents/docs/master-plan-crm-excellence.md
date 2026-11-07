# White Caves CRM Excellence Plan

> **Version:** 1.0
> **Created:** April 19, 2026
> **Target:** #1 Dubai Real Estate CRM Platform
> **Timeline:** 14 weeks (April 2026 — July 2026)
> **Overall Progress:** █░░░░░░░░░ 5% (Phase 0 complete)

---

## Vision

Transform White Caves from a 96%-complete internal tool into Dubai's #1 real estate CRM by combining operational CRM, RERA/Ejari/DLD compliance automation, WhatsApp-native AI communication, and commission management — capabilities no competitor offers in a single platform.

---

## Phase 0 — Research & Documentation (P0) — COMPLETE

| #   | Task                                          | Status | File                                                               |
| --- | --------------------------------------------- | ------ | ------------------------------------------------------------------ |
| 0.1 | Competitor analysis (PF vs Bayut vs Dubizzle) | [x]    | business_docs/08_market_research/competitor_analysis.md            |
| 0.2 | Dubai regulations (RERA/Ejari/DLD/VAT)        | [x]    | business_docs/08_market_research/dubai_regulations.md              |
| 0.3 | Technology upgrades spec (WhatsApp/Stripe/AI) | [x]    | business_docs/08_market_research/technology_upgrades.md            |
| 0.4 | Lead Scoring Bot definition                   | [x]    | business_docs/03_ai_assistants/lead_scoring_bot.md                 |
| 0.5 | Document Generator Bot definition             | [x]    | business_docs/03_ai_assistants/document_generator.md               |
| 0.6 | Market Analyst Bot definition                 | [x]    | business_docs/03_ai_assistants/market_analyst.md                   |
| 0.7 | RBAC field-level permissions matrix           | [x]    | business_docs/09_user_roles_permissions/field-level-permissions.md |
| 0.8 | Master Plan creation                          | [x]    | plans/MASTER_PLAN_CRM_EXCELLENCE.md (this file)                    |

---

## Phase 1 — Core CRM Hardening (P0 – Critical) — 2 weeks

> **Goal:** Wire all existing CRM components to real APIs, add missing endpoints, production-harden

### 1A. Lead Management (3 days)

- [ ] Wire ClaraLeadsCRM tabs to real /api/leads endpoints (replace faker data)
- [ ] Add POST /api/leads/:id/assign (round-robin + manual assignment)
- [ ] Add POST /api/leads/:id/interactions (call/email/WhatsApp/meeting log)
- [ ] Add status workflow validation: new->contacted->qualified->proposal->negotiation->won/lost
- [ ] Unit tests: server/routes/leads.test.ts
- [ ] E2E test: e2e/lead-management.spec.ts

### 1B. Property Management (3 days)

- [ ] Wire MaryInventoryCRM to real /api/properties
- [ ] Add POST /api/properties/:id/media (image/video/floorplan upload)
- [ ] Add POST /api/properties/:id/assign (agent assignment)
- [ ] Verify DLD fee calculation (4% sales, 5% lease + admin fees)
- [ ] Add status workflow: draft->listed->under_offer->sold/leased/withdrawn
- [ ] Unit + E2E tests

### 1C. Client/Owner Management (2 days)

- [ ] Client-property linking: POST /api/clients/:id/properties
- [ ] Communication log aggregation (WhatsApp + email + calls in timeline)
- [ ] Client categorization: buyer/seller/landlord/tenant/investor

### 1D. Commission Frontend (2 days)

- [ ] Wire TheodoraFinanceCRM to /api/finance/commissions
- [ ] Auto-calc rules: Sales 2%, Rental 5%, Referral configurable %
- [ ] Approval workflow: calculated->pending_approval->approved->paid_out
- [ ] Commission PDF report export

### 1E. Transaction Recording (2 days)

- [ ] Link property + buyer + seller + agent + commission in transaction
- [ ] Required documents checklist per transaction type
- [ ] Transaction timeline with milestones

---

## Phase 2 — Advanced CRM Features (P1 – High) — 3 weeks

### 2A. AI Lead Scoring Engine (5 days)

- [ ] Create server/services/ai/leadScoringEngine.ts
- [ ] Implement weighted algorithm: engagement(40%) + demographic(30%) + behavioral(20%) + source(10%)
- [ ] Cron re-scoring every 6h
- [ ] Wire to LeadScoringModule.tsx with real-time display
- [ ] API: GET /api/leads/:id/score (score + breakdown)

### 2B. Automated Follow-Up Sequences (5 days)

- [ ] Create server/services/automation/followUpEngine.ts
- [ ] Hot lead cadence: WhatsApp(5min) -> Email(1h) -> Call(4h) -> WhatsApp(24h)
- [ ] Warm lead cadence: WhatsApp(1h) -> Email(24h) -> WhatsApp(72h) -> Call(7d)
- [ ] Cold lead cadence: Email(24h) -> WhatsApp(7d) -> Email(14d) -> Archive(30d)
- [ ] CadenceManager UI in Clara CRM

### 2C. Document Generation (4 days)

- [ ] Create server/services/documents/documentGenerator.ts (Handlebars)
- [ ] Templates: MoU, Form F, NOC, Commission Invoice, Viewing Report, Offer Letter
- [ ] PDF export + document versioning
- [ ] API: POST /api/documents/generate

### 2D. Reporting & Analytics Dashboard (5 days)

- [ ] Revenue, lead funnel, agent performance, property aging, commission summary
- [ ] PDF/CSV export via Zoe Executive Dashboard
- [ ] Charts using Recharts (already installed)

### 2E. Multi-Currency Support (3 days)

- [ ] Currency service: AED/USD/GBP/EUR/INR with real-time exchange rates
- [ ] Currency field in Property + Transaction Prisma models
- [ ] Display AED equivalent alongside original currency

---

## Phase 3 — Integration & Automation (P1 – High) — 3 weeks

### 3A. WhatsApp Cloud API Migration (7 days) — CRITICAL PATH

- [ ] Register WABA on Meta Business Platform
- [ ] Create server/services/whatsapp/cloudAPI.ts
- [ ] Implement: sendTextMessage, sendTemplateMessage, sendMediaMessage, handleWebhook
- [ ] Create 6 message templates (viewing, follow-up, payment, document, RERA, lease)
- [ ] Update meta-webhook.ts for Cloud API payloads
- [ ] Deprecate lindaClient.ts (keep as fallback)
- [ ] Update Nadia routing to Cloud API primary

### 3B. Email Automation (4 days)

- [ ] Integrate Resend (resend.com) email service
- [ ] Email templates: Welcome, Property Alert, Viewing, Document, Payment, RERA
- [ ] Delivery tracking (open/click/bounce)

### 3C. Calendar/Scheduling (3 days)

- [ ] Viewing slots, agent availability management
- [ ] .ics calendar file generation
- [ ] Enhance existing Viewing model + endpoints

### 3D. RERA/Ejari Compliance Automation (4 days)

- [ ] RERA BRN expiry notifications via WhatsApp (30/15/7 day alerts)
- [ ] Ejari CSV export for bulk registration
- [ ] Compliance dashboard in LailaComplianceCRM
- [ ] VAT summary: 5% commercial, 0% residential, 5% on commissions

---

## Phase 4 — AI Assistants Enhancement (P2 – Medium) — 2 weeks

- [ ] 4A. Lead Scoring Bot (3d) — real-time scoring via Prisma middleware
- [ ] 4B. Document Generator Bot (4d) — auto-fill from DB, smart clause selection
- [ ] 4C. Market Analyst Bot (4d) — price/sqft trends, yield calc, comparables, demand heatmap
- [x] 4D. WhatsApp Assistant (3d) — intent classification, auto-responses

---

## Phase 5 — User Experience & Design (P1 – High) — 2 weeks

- [x] 5A. Unified Left Sidebar (3d) — Desktop 280px sidebar, AI inline, keyboard navigation
- [x] 5B. Top Navbar Enhancement (2d) — notifications, global search, quick actions
- [x] 5C. Dynamic Center Content (3d) — loading skeletons, breadcrumbs, empty states
- [x] 5D. Responsive & Accessibility (4d) — WCAG AA, 768px tablet, keyboard nav

---

## Phase 6 — Testing & Deployment (P0 – Critical) — 2 weeks

- [ ] 6A. Unit Test Coverage (5d) — 90% server routes, 90% Redux slices, 80% components
- [ ] 6B. E2E Test Suite (4d) — 20+ specs, 100+ scenarios, visual regression
- [ ] 6C. CI/CD Pipeline (3d) — GitHub Actions, Vercel previews, Husky pre-commit
- [ ] 6D. Performance Optimization (2d) — code splitting, virtual scrolling, Lighthouse >=90

---

## Priority Legend

| Priority | Label    | Timeline       | Examples                                                  |
| -------- | -------- | -------------- | --------------------------------------------------------- |
| P0       | Critical | Immediately    | Lead CRUD, property CRUD, RBAC, WhatsApp recovery, CI/CD  |
| P1       | High     | Within 4 weeks | AI scoring, multi-currency, reporting, doc generation, UX |
| P2       | Medium   | Within 8 weeks | Advanced AI bots, market analytics                        |
| P3       | Low      | Future         | Mobile app, blockchain, virtual viewings                  |

---

## Continuous Tracking & Cleanup (After EVERY Feature)

1. Verify full integration: frontend -> API -> DB -> external service
2. Test for white pages: force errors, verify error boundaries catch them
3. Validate design compliance against design tokens
4. Run: npm run build && npx tsc --noEmit && npx vitest run
5. Commit, push, and create PR to development
6. Update progress checkmarks in this plan

---

## Key Decisions

| Decision        | Choice                                                          | Rationale                                 |
| --------------- | --------------------------------------------------------------- | ----------------------------------------- |
| WhatsApp API    | Meta Cloud API (migrate from whatsapp-web.js)                   | Official, stable, template support, legal |
| Payment gateway | Stripe primary, Telr secondary                                  | Best API + UAE entity support             |
| Email provider  | Resend                                                          | Best TypeScript SDK, competitive pricing  |
| AI scoring      | Rule-based weighted first, ML later                             | Immediate value, no external dependency   |
| Document engine | Handlebars + Puppeteer PDF                                      | Lightweight, server-side, customizable    |
| Scope IN        | All 6 phases: CRM + compliance + WhatsApp + AI + UX + testing   |                                           |
| Scope OUT       | Mobile app, blockchain, virtual viewings, actual escrow banking | Future phases                             |

---

## Authoritative Research Sources

- RERA/DLD: wikipedia.org/wiki/Dubai_Real_Estate_Regulatory_Agency, dubailand.gov.ae
- WhatsApp Cloud API: developers.facebook.com/docs/whatsapp/overview, /cloud-api/get-started, /message-templates
- Stripe UAE: stripe.com/ae (135+ currencies, $1.9T processed 2025)
- Telr: telr.com (Dubai-based, 120+ currencies, BNPL via Tabby)
- Zoho CRM: zoho.com/crm/lead-scoring.html (scoring patterns reference)
- Market data: Dubai property sales AED 682.5B in 2025 (+31% YoY)

---

## File Index (Phase 0 Deliverables)

| #   | File                                                               | Type          | Lines |
| --- | ------------------------------------------------------------------ | ------------- | ----- |
| 1   | business_docs/08_market_research/competitor_analysis.md            | Research      | ~130  |
| 2   | business_docs/08_market_research/dubai_regulations.md              | Compliance    | ~200  |
| 3   | business_docs/08_market_research/technology_upgrades.md            | Tech Spec     | ~180  |
| 4   | business_docs/03_ai_assistants/lead_scoring_bot.md                 | AI Definition | ~50   |
| 5   | business_docs/03_ai_assistants/document_generator.md               | AI Definition | ~55   |
| 6   | business_docs/03_ai_assistants/market_analyst.md                   | AI Definition | ~50   |
| 7   | business_docs/09_user_roles_permissions/field-level-permissions.md | RBAC          | ~110  |
| 8   | plans/MASTER_PLAN_CRM_EXCELLENCE.md                                | Master Plan   | ~200+ |
