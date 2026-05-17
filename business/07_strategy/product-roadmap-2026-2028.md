# Product Roadmap 2026–2028

# White Caves Real Estate Platform

> **Document ID:** WC-ROADMAP-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Executive Team (Zoe — Executive AI, @Margaret — Project Manager)
> **Horizon:** Q2 2026 – Q4 2028
> **Classification:** Confidential — Board/Investor Use

---

## Executive Summary

White Caves Real Estate LLC is building Dubai's most intelligent real estate platform — combining AI-powered CRM, WhatsApp-native communication, full RERA/DLD compliance, and a luxury UX targeting the world's fastest-growing property market.

**Current Stage:** Phase 1 complete ✅ — Homepage + CRM foundation
**Immediate Priority:** Phase 2 (Landlord/Tenant Portals) + Phase 3 (Full CRM)
**Strategic Goal:** #1 Dubai real estate platform by transactions volume in DAMAC Hills 2 by Q4 2027

---

## Dubai 2040 Urban Master Plan Alignment

| Dubai Goal                          | White Caves Initiative           | Timeline |
| ----------------------------------- | -------------------------------- | -------- |
| Population target: 5.8M (from 3.6M) | Scale platform to 10,000+ users  | 2027     |
| Integrated smart city               | AI-powered property intelligence | 2027     |
| Sustainable communities             | ESG property ratings feature     | 2028     |
| Tourism + business hub              | Off-plan microsite ecosystem     | 2027     |
| Advanced digital services           | PWA + Arabic mobile experience   | 2027     |

---

## Roadmap Timeline

### Q2 2026 — Phase 2: Landlord & Tenant Portals

**Goal:** Make portals fully functional (not just UI shells)

| Feature               | Description                            | Effort |
| --------------------- | -------------------------------------- | ------ |
| Contracts API         | Full CRUD for sales + lease contracts  | M      |
| Appointments API      | Viewing booking + calendar sync        | M      |
| Stripe payments       | Tenant rent payment online             | L      |
| Property valuation    | Automated valuation endpoint           | L      |
| File upload           | Media + document storage (Multer + S3) | M      |
| Ejari PDF generation  | Auto-generate Ejari registration doc   | M      |
| npm audit fixes       | Resolve 7 vulnerabilities (1 critical) | S      |
| GitHub Actions CI     | Automated lint/test/build pipeline     | S      |
| Prometheus monitoring | API health + latency metrics           | S      |
| Sentry error tracking | Production error monitoring            | S      |

**Success Criteria:**

- Landlords can log in and see real portfolio data
- Tenants can pay rent online via Stripe
- Ejari certificates downloadable from portal
- 0 npm security vulnerabilities

---

### Q3 2026 — Phase 3: Full CRM for Managing Director

**Goal:** arslanmalikgoraha@gmail.com has a fully functional luxury CRM

| Feature                        | Description                         | Effort |
| ------------------------------ | ----------------------------------- | ------ |
| All 8 CRM modules live         | Real API data (no mock)             | XL     |
| AI Assistant chat UI           | Chat interface in right sidebar     | L      |
| Executive KPI dashboard        | Live metrics: leads, deals, revenue | L      |
| PDF/Excel export               | Reports, commission statements      | M      |
| Agent performance analytics    | Rankings, conversion rates          | M      |
| Advanced lead scoring          | ML-based score updates              | M      |
| Property recommendation engine | AI matching for leads               | M      |
| OpenAPI v1.2                   | Full Swagger UI at /api-docs        | M      |

**Success Criteria:**

- Managing Director can manage the full sales cycle without leaving the CRM
- 30+ API endpoints documented in OpenAPI
- All 40 AI assistants accessible via chat UI

---

### Q4 2026 — Phase 4: WhatsApp CRM v2

**Goal:** White Caves WhatsApp number becomes a full CRM channel

| Feature                       | Description                   | Effort |
| ----------------------------- | ----------------------------- | ------ |
| Meta Cloud API integration    | Live WhatsApp send/receive    | L      |
| Multi-agent inbox             | Multiple agents on one WABA   | M      |
| Nina bot intelligence         | Intent detection + BANT flow  | L      |
| CRM WhatsApp inbox UI         | Agent handles messages in CRM | L      |
| Automated follow-up sequences | Nurture campaigns via WA      | M      |
| WA lead capture               | Auto-create CRM leads from WA | S      |
| Template management           | Pre-approved Meta templates   | S      |

**Success Criteria:**

- All inbound WhatsApp messages visible in CRM
- Lead created automatically from WhatsApp inquiry
- Bot handles qualification 24/7 without agent
- First response time < 10 seconds

---

### Q1 2027 — Phase 5: Compliance Management

**Goal:** System-enforced RERA/DLD/KYC/AML compliance

| Feature                     | Description                    | Effort |
| --------------------------- | ------------------------------ | ------ |
| RERA Form A/B/F enforcement | Block listing without forms    | M      |
| AML screening integration   | API call to sanctions database | L      |
| KYC document management     | Upload + verification workflow | L      |
| SAR filing workflow         | UAE FIU SAR submission         | M      |
| Compliance audit trail      | Immutable logging              | M      |
| DLD registration workflow   | Step-by-step DLD guide         | M      |
| RERA permit validation      | API check on permit number     | M      |

**Success Criteria:**

- Zero compliance violations on RERA audit
- AML screening on 100% of transactions above AED 55,000
- SAR filed within 2 business days of identification

---

### Q2 2027 — Phase 6: Arabic Language + RTL

**Goal:** Full Arabic-language experience for Arabic-speaking clients

| Feature                      | Description                        | Effort |
| ---------------------------- | ---------------------------------- | ------ |
| react-i18next integration    | Language detection + switching     | S      |
| Arabic translations (100%)   | All 20+ translation sections       | M      |
| RTL layout toggle            | `dir="rtl"` with CSS logical props | M      |
| Arabic property descriptions | AI-assisted Arabic content         | L      |
| Arabic WhatsApp bot          | Nina responds in Arabic            | M      |
| Arabic SEO                   | Arabic meta tags + content         | M      |
| Date/number/currency Arabic  | Locale-aware formatting            | S      |

**Success Criteria:**

- 100% of UI translateable to Arabic
- RTL layout pixel-perfect on mobile
- Arabic keywords ranking on Google UAE

---

### Q3 2027 — Phase 7: Data & AI Intelligence

**Goal:** White Caves becomes data-driven and AI-predictive

| Feature                    | Description                          | Effort |
| -------------------------- | ------------------------------------ | ------ |
| Elasticsearch              | Property search with facets + Arabic | XL     |
| Redis caching              | Cache hot listings + KPI data        | L      |
| ML price prediction        | AVM (Automated Valuation Model)      | XL     |
| Property recommendation AI | Lead ↔ Property matching ML          | L      |
| Market trend dashboard     | Price history, volume, yield trends  | L      |
| Predictive lead scoring    | ML-updated scores (not rule-based)   | L      |
| AI property description    | Auto-generate listing copy           | M      |
| Data pipeline              | DLD transaction data ingestion       | XL     |
| GraphQL layer              | For AI assistant data queries        | M      |

**Success Criteria:**

- Property search < 100ms response time
- ML valuation within 5% of actual sale price
- Lead score predicts conversion with 70%+ accuracy

---

### Q4 2027 — Phase 8: Off-Plan Portal + Syndication

**Goal:** Become the #1 off-plan specialist platform in Dubai

| Feature                  | Description                        | Effort |
| ------------------------ | ---------------------------------- | ------ |
| Off-plan microsites      | Developer-specific landing pages   | XL     |
| DAMAC Hills 2 microsite  | Deep community content             | L      |
| Payment plan calculator  | Interactive installment UI         | M      |
| PropertyFinder API sync  | Listings syndicated to PF          | XL     |
| Bayut API sync           | Listings syndicated to Bayut       | XL     |
| Developer partner portal | DAMAC, Emaar, Meraas               | L      |
| SEO landing pages        | Area/community/developer pages     | L      |
| 360° virtual tours       | Matterport / custom AR integration | M      |

**Success Criteria:**

- Top 3 Google ranking for "DAMAC Hills 2 property for sale"
- 1,000+ listings syndicated on PropertyFinder + Bayut
- 3+ developer partnership agreements active

---

### Q1 2028 — Phase 9: Multi-User RBAC

**Goal:** Scale the team — all 29 roles active, full team management

| Feature               | Description                        | Effort |
| --------------------- | ---------------------------------- | ------ |
| Multi-user onboarding | Add agents, managers via admin     | L      |
| All 29 roles active   | Full permission matrix enforced    | L      |
| 2FA for all staff     | TOTP mandatory for CRM access      | M      |
| Team performance      | Manager ↔ agent performance views  | M      |
| Lead assignment rules | Configurable round-robin + rules   | M      |
| Agent portal          | Agent self-serve: leads, schedule  | L      |
| HR module             | Employee records, KPI tracking     | L      |
| Audit trail enhanced  | Who did what, when, on what record | M      |

**Success Criteria:**

- 10+ active agents using CRM daily
- All agents have RERA-verified profiles in system
- Zero unauthorized data access incidents

---

### Q2–Q4 2028 — Phase 10: PWA + Mobile

**Goal:** World-class mobile experience — install White Caves

| Feature               | Description                          | Effort |
| --------------------- | ------------------------------------ | ------ |
| PWA (installable)     | Install prompt, home screen icon     | M      |
| Offline mode          | Browse saved properties offline      | L      |
| Push notifications    | Lead alerts, payment reminders       | M      |
| Mobile-first redesign | Native-app feel in browser           | L      |
| Native iOS app        | React Native (if PWA not sufficient) | XL     |
| Native Android app    | React Native                         | XL     |
| App Store listing     | Apple App Store + Google Play        | M      |

**Success Criteria:**

- PWA install rate > 30% of mobile users
- App rating > 4.5 stars (App Store + Play)
- 70%+ of user sessions from mobile

---

## Funding Milestones

| Milestone               | Phase     | KPI Target                 | Investment Need        |
| ----------------------- | --------- | -------------------------- | ---------------------- |
| MVP live on Google      | Phase 1–2 | 1,000 monthly visitors     | Bootstrapped           |
| First 100 leads         | Phase 2–3 | 100 CRM leads              | Bootstrapped           |
| First 10 transactions   | Phase 3   | 10 closed deals            | Bootstrapped           |
| Portal syndication live | Phase 8   | PF + Bayut listings active | Seed round             |
| 200 agents on platform  | Phase 9   | 200 RERA-verified agents   | Series A consideration |
| Arabic mobile app live  | Phase 10  | 50k app downloads          | Series A               |

---

## Risk Register

> For each phase, the top 3 risks — with probability, impact, mitigation, and owner.

### Phase 2 — Landlord & Tenant Portals

| #    | Risk                                                                                                    | Probability | Impact | Mitigation                                                                                 | Owner              |
| ---- | ------------------------------------------------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------ | ------------------ |
| R2.1 | Stripe payment integration fails UAE-specific compliance checks (CBUAE licensing)                       | M           | H      | Pre-validate with Stripe MENA team; fallback to direct bank transfer via Telr gateway      | Theodora (Finance) |
| R2.2 | Multer/S3 file upload performance degrades under concurrent uploads — landlord photos / Ejari PDFs slow | M           | M      | Implement chunked multipart uploads + CloudFront CDN; load-test with 50 concurrent uploads | Aurora (Tech)      |
| R2.3 | Phase 2 scope creep delays Q2 deadline — portal UI requests expand beyond backend readiness             | H           | M      | Freeze Phase 2 feature scope by Week 1; any new requests go to backlog only                | Margaret (PM)      |

### Phase 3 — Full CRM

| #    | Risk                                                                             | Probability | Impact | Mitigation                                                                                             | Owner                         |
| ---- | -------------------------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| R3.1 | MD adopts CRM slowly — continues managing leads in WhatsApp/spreadsheet parallel | H           | H      | Run 2-week onboarding sprint; dedicated Sophia agent to help migrate 100% of existing leads            | Sophia (Sales) + Marissa (UX) |
| R3.2 | AI assistant chat UI latency > 3s — breaks luxury UX feel                        | M           | H      | Cache frequent AI prompts in Redis; implement streaming responses with SSE; set SLA of < 1.5s P95      | Aurora (Tech)                 |
| R3.3 | Real API data migrations break existing mock-dependent frontend components       | H           | M      | Write adapter layer; maintain mock/real toggle per endpoint; full regression test suite before go-live | Katherine (QA)                |

### Phase 4 — WhatsApp CRM v2

| #    | Risk                                                               | Probability | Impact | Mitigation                                                                                                            | Owner                              |
| ---- | ------------------------------------------------------------------ | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| R4.1 | Meta WABA approval delayed (Meta reviews take 2–8 weeks)           | H           | H      | Apply for Meta Business Verification immediately (Month 1 of Phase 4); build CRM inbox UI in parallel using test WABA | Aurora (Tech) + Compliance (Laila) |
| R4.2 | Nina bot misclassifies lead intents — damages brand experience     | M           | H      | Implement confidence threshold: below 0.7 → human handoff; monthly bot intent accuracy review                         | Hazel (AI) + Marissa (UX)          |
| R4.3 | WhatsApp template rejection from Meta for sales messaging language | M           | M      | Use pre-approved utility templates only; reserve promotional templates for verified opt-in subscribers                | Laila (Compliance)                 |

### Phase 5 — Compliance Management

| #    | Risk                                                                          | Probability | Impact | Mitigation                                                                                         | Owner              |
| ---- | ----------------------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------- | ------------------ |
| R5.1 | RERA regulatory changes in 2027 invalidate existing Form A/B/F implementation | M           | H      | Subscribe to RERA developer newsletter; quarterly compliance review with RERA-certified consultant | Laila (Compliance) |
| R5.2 | AML sanctions API vendor (ComplyAdvantage / World-Check) delays onboarding    | M           | H      | Maintain manual screening SOP as fallback; negotiate 30-day free trial before Phase 5 launch       | Mira (CTO) + Laila |
| R5.3 | Immutable audit log storage costs balloon at scale (100k+ events/month)       | L           | M      | Implement log tiering: hot storage (30 days) → cold S3 Glacier (7 years per UAE AML law)           | Annie (Compute)    |

### Phase 6 — Arabic Language + RTL

| #    | Risk                                                                                                      | Probability | Impact | Mitigation                                                                                                     | Owner                               |
| ---- | --------------------------------------------------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| R6.1 | Arabic property descriptions generated by AI contain cultural or grammatical errors — brand embarrassment | M           | H      | All AI-generated Arabic copy reviewed by native Arabic speaker before publish; establish human review workflow | Hazel (AI) + Dena (Strategy)        |
| R6.2 | RTL layout breaks on < 5% of UI components (especially charts, tables, modals)                            | H           | M      | Automated RTL regression tests on 100% of pages; Storybook RTL visual snapshot testing                         | Tracy (Responsive) + Katherine (QA) |
| R6.3 | react-i18next bundle size increase degrades mobile performance                                            | M           | M      | Use dynamic import for Arabic translations (load only when language switched); target < 50KB additional bundle | Grace (Lead Eng)                    |

### Phase 7 — Data & AI Intelligence

| #    | Risk                                                                                | Probability | Impact | Mitigation                                                                                                     | Owner                     |
| ---- | ----------------------------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------- | ------------------------- |
| R7.1 | DLD transaction data ingestion rights / API access not obtained                     | M           | H      | Engage DLD tech team in Q1 2027; fallback to web scraping licensed public data + manual data entry             | Barbara (DB) + Mira (CTO) |
| R7.2 | ML price prediction accuracy < 5% threshold — AVM misleads buyers                   | M           | H      | Train AVM on 3+ years DLD data before launching publicly; display confidence interval, not just point estimate | Joelle (ML)               |
| R7.3 | Elasticsearch cluster becomes single point of failure — search down = site unusable | M           | H      | Deploy 3-node Elasticsearch cluster with daily snapshots; fallback to PostgreSQL full-text search              | Ruchi (Systems)           |

### Phase 8 — Off-Plan Portal + Syndication

| #    | Risk                                                                                         | Probability | Impact | Mitigation                                                                                                             | Owner           |
| ---- | -------------------------------------------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------- | --------------- |
| R8.1 | PropertyFinder / Bayut API terms of service change — invalidate syndication agreements       | M           | H      | Review TOS quarterly; build proprietary portal listings as primary; treat PF/Bayut as amplification only               | Dena (Strategy) |
| R8.2 | Developer partner (DAMAC) insists on exclusive portal listing — blocks White Caves microsite | L           | H      | Negotiate non-exclusive co-marketing agreement; lead with data (we generate X qualified leads/month for your projects) | MD + Dena       |
| R8.3 | 360° virtual tour / Matterport integration cost overruns ($500–$1,000 per property)          | H           | M      | Partner with local photography company for bulk rate; phase rollout (premium listings only in Year 1)                  | Lila (Ops)      |

### Phase 9 — Multi-User RBAC

| #    | Risk                                                                    | Probability | Impact | Mitigation                                                                                                    | Owner                           |
| ---- | ----------------------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| R9.1 | Agents bypass RBAC by sharing login credentials (human security risk)   | H           | H      | Enforce 2FA mandatory; login anomaly detection (simultaneous sessions from different IPs = auto-lock)         | Radia (Network/Security) + Ecem |
| R9.2 | Agent resistance to CRM adoption — prefers informal WhatsApp management | H           | M      | Design agent portal mobile-first; demonstrate time saved via automation; gamify leaderboard                   | Marissa (UX) + Jaime            |
| R9.3 | Data privacy breach: agent accidentally exports full lead database      | M           | H      | RBAC limits data export; all exports logged + require manager approval; DLP (data loss prevention) monitoring | Ecem (Security) + Radia         |

### Phase 10 — PWA + Mobile

| #     | Risk                                                                                          | Probability | Impact | Mitigation                                                                                               | Owner                     |
| ----- | --------------------------------------------------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| R10.1 | Apple App Store rejection on first submission (privacy policy / data collection requirements) | H           | M      | Engage iOS App Review guidelines expert; pre-review checklist before submission                          | Grace (Lead Eng) + Timnit |
| R10.2 | PWA push notifications blocked on iOS < 16.4 (limited PWA support)                            | H           | M      | Design notifications as progressive enhancement; fallback to in-app badge + WhatsApp for critical alerts | Tracy (Responsive)        |
| R10.3 | React Native app performance lags vs native Swift/Kotlin — poor App Store reviews             | M           | H      | Benchmark performance against Bayut iOS app before launch; use Hermes engine + Flipper profiling         | Grace (Lead Eng)          |

---

## Phase Dependencies Map

```
Phase 1: MVP Foundation
    │
    │ (Website live, CRM shell, auth, DB schema)
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  ▼
Phase 2: Landlord/Tenant Portals               Phase 3: Full CRM
    │  (Requires: P1 auth, DB schema,                 │  (Requires: P1 CRM shell,
    │   S3 bucket, Stripe account)                    │   P1 mock APIs resolved)
    │                                                  │
    └────────────────┬─────────────────────────────────┘
                     │
                     ▼
              Phase 4: WhatsApp CRM v2
                  │  (Requires: P3 CRM lead model,
                  │   P3 agent assignment, Meta WABA approved)
                  │
                  ▼
              Phase 5: Compliance Management
                  │  (Requires: P3 KYC docs workflow,
                  │   P4 WhatsApp audit trail,
                  │   P2 Ejari pipeline)
                  │
          ┌───────┴───────────┐
          ▼                   ▼
    Phase 6: Arabic      Phase 7: Data & AI
    Language + RTL       Intelligence
          │  (Requires:        │  (Requires: P3 lead data,
          │   P3 i18n          │   P5 compliance metadata,
          │   foundation,      │   P2 property DB complete,
          │   P4 Arabic bot    │   DLD data access)
          │   prep)            │
          │                   │
          └───────────┬───────┘
                      │
                      ▼
              Phase 8: Off-Plan + Syndication
                  │  (Requires: P5 RERA compliance ✅,
                  │   P7 AVM valuation ✅,
                  │   P7 Elasticsearch search ✅,
                  │   P6 Arabic content ✅)
                  │
                  ▼
              Phase 9: Multi-User RBAC
                  │  (Requires: P3 CRM stable,
                  │   P5 compliance audit trail,
                  │   P8 full listing database)
                  │
                  ▼
              Phase 10: PWA + Mobile App
                  (Requires: P7 search performance ✅,
                   P6 Arabic UI ✅, P8 portal syndication ✅,
                   P9 agent mobile portal ✅)


KEY HARD DEPENDENCIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 6 (Arabic)     → REQUIRES Phase 3 i18n foundation
Phase 7 (AI/Data)    → REQUIRES Phase 3 lead data volume
Phase 8 (Syndication)→ REQUIRES Phase 5 RERA compliance
Phase 8 (Syndication)→ REQUIRES Phase 7 AVM + Elasticsearch
Phase 10 (Mobile)    → REQUIRES Phase 7 API performance SLAs met
```

---

## Resource Plan

> Approximate team composition and duration needed to execute each phase.

| Phase              | Duration | Backend | Frontend | QA  | Compliance    | ML/Data | DevOps | PM  |
| ------------------ | -------- | ------- | -------- | --- | ------------- | ------- | ------ | --- |
| **P2: Portals**    | 3 months | 2       | 1        | 1   | 1 (part-time) | —       | 0.5    | 0.5 |
| **P3: Full CRM**   | 3 months | 2       | 2        | 1   | —             | —       | 0.5    | 0.5 |
| **P4: WhatsApp**   | 2 months | 2       | 1        | 1   | 0.5           | —       | 0.5    | 0.5 |
| **P5: Compliance** | 3 months | 1       | 1        | 1   | 1 (full-time) | —       | 0.5    | 0.5 |
| **P6: Arabic**     | 3 months | 0.5     | 2        | 1   | 0.5           | —       | 0.5    | 0.5 |
| **P7: AI & Data**  | 4 months | 2       | 1        | 1   | —             | 2       | 1      | 1   |
| **P8: Off-Plan**   | 3 months | 2       | 2        | 1   | 0.5           | 0.5     | 1      | 1   |
| **P9: RBAC**       | 3 months | 2       | 1        | 1   | 0.5           | —       | 0.5    | 0.5 |
| **P10: Mobile**    | 6 months | 1       | 3        | 2   | 0.5           | —       | 1      | 1   |

**Notes:**

- Fractions (e.g., 0.5) indicate part-time / shared resource
- Compliance officer is Laila in-house for P2–P5; Phase 7+ may require contract data engineer
- Phase 7 ML/Data engineers are new hires (or contract) — not currently on team
- DevOps scale-up at Phase 7–8 reflects Elasticsearch + Redis + data pipeline infrastructure complexity

### Phase-level Cost Estimates (indicative AED — salary-based)

| Phase | Total Person-Months | Estimated Cost (AED) | Notes                          |
| ----- | ------------------- | -------------------- | ------------------------------ |
| P2    | 14                  | 280,000              | Bootstrapped                   |
| P3    | 15                  | 300,000              | Bootstrapped                   |
| P4    | 10                  | 200,000              | Bootstrapped                   |
| P5    | 12                  | 250,000              | Bootstrapped + RERA consultant |
| P6    | 12                  | 240,000              | + Arabic translator AED 15k    |
| P7    | 22                  | 500,000              | Seed round funding recommended |
| P8    | 18                  | 400,000              | Seed round                     |
| P9    | 12                  | 260,000              | Seed round                     |
| P10   | 30                  | 700,000              | Series A consideration         |

---

## Tech Debt Integration

> Which items from the Technical Debt Register are scheduled to be resolved in each phase.

| Phase   | Tech Debt Item                                                                                | Debt Category        | Effort | Rationale for Scheduling                                                     |
| ------- | --------------------------------------------------------------------------------------------- | -------------------- | ------ | ---------------------------------------------------------------------------- |
| **P2**  | Resolve 7 npm audit vulnerabilities (1 critical)                                              | Security             | S      | Must fix before handling tenant payment data (Stripe)                        |
| **P2**  | Migrate from `any` types in payment/auth modules (~12 instances)                              | Type Safety          | S      | Stripe + Multer integrations require strict typing                           |
| **P2**  | Add GitHub Actions CI pipeline                                                                | DevOps               | S      | Block merges without passing tests — gates quality for all subsequent phases |
| **P3**  | Remove all mock/stub data from CRM modules — real API connections                             | Architecture         | XL     | Phase 3 definition: 0 stubs remaining                                        |
| **P3**  | Consolidate duplicate API service layers (3 different fetch patterns in frontend)             | Architecture         | M      | Consistent data fetching before Phase 4 adds more complexity                 |
| **P4**  | Refactor WhatsApp webhook handler to event-driven architecture                                | Architecture         | M      | Synchronous handler will not scale to multi-agent inbox                      |
| **P5**  | Add immutable event sourcing for compliance-sensitive operations                              | Architecture         | L      | Required for AML audit trail — cannot retrofit later                         |
| **P6**  | Replace all hardcoded English strings with i18n keys (estimated 200+ strings)                 | Internationalisation | L      | Foundation for Arabic + any future language                                  |
| **P7**  | Migrate from MongoDB full-text search to Elasticsearch                                        | Performance          | XL     | MongoDB text search not scalable for 9,378+ listings                         |
| **P7**  | Implement Redis caching for dashboard aggregations (currently recalculated on every load)     | Performance          | L      | Executive dashboard p95 > 2s without caching                                 |
| **P8**  | Decouple listing syndication from core property model (tight coupling)                        | Architecture         | M      | Bayut/PF sync requires clean adapter interfaces                              |
| **P9**  | Refactor flat permission checks scattered across controllers into centralised RBAC middleware | Security             | L      | Required before 10+ agents access system                                     |
| **P10** | Split monolithic server bundle into micro-services (API gateway pattern)                      | Architecture         | XL     | Mobile app requires lightweight API; current server too heavy                |

---

## User Adoption KPIs

> Beyond technical completion, what user behaviour proves each phase was truly successful.

| Phase              | User Adoption Metric                                                             | Target                                | Measurement Method                                                        |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| **P2: Portals**    | % of landlords logging into portal weekly (not calling agent)                    | > 60% of onboarded landlords          | Session logs: role=landlord, weekly unique                                |
| **P2: Portals**    | % of tenants paying rent via Stripe (vs cheque)                                  | > 70% by Month 2 post-launch          | Stripe payment count / total rent invoices                                |
| **P2: Portals**    | Ejari certificate viewed/downloaded in portal (not requested via email)          | > 80%                                 | Document download event log                                               |
| **P3: Full CRM**   | MD creates or updates leads in CRM ≥ 5 days/week                                 | Yes (binary)                          | CRM lead.updatedBy = MD, daily active                                     |
| **P3: Full CRM**   | AI assistant used for at least 1 query per working day                           | > 1 query/day                         | Chat session logs                                                         |
| **P3: Full CRM**   | Zero commission calculations done outside CRM (in Excel)                         | Confirmed by MD                       | Self-reported monthly check-in                                            |
| **P4: WhatsApp**   | % of inbound WhatsApp leads captured as CRM leads (vs lost in agent personal WA) | > 95%                                 | CRM leads WHERE source=whatsapp / total WA messages                       |
| **P4: WhatsApp**   | Nina bot handles > 60% of lead qualification without human handoff               | > 60%                                 | Bot session logs: handoff=false / total sessions                          |
| **P4: WhatsApp**   | Agent response time to human-escalated WA leads                                  | < 5 min during office hours           | Escalation timestamp vs agent reply timestamp                             |
| **P5: Compliance** | 100% of transactions > AED 55k go through AML screen before progressing          | 100%                                  | Compliance audit: transactions WHERE amlStatus=null AND value > 55000 = 0 |
| **P5: Compliance** | RERA Form A filed before any listing goes live                                   | 100%                                  | Properties WHERE reraPermit=null AND status=PUBLISHED = 0                 |
| **P6: Arabic**     | % of sessions using Arabic language                                              | > 25% of total sessions               | i18n language toggle session count                                        |
| **P6: Arabic**     | Arabic WhatsApp bot queries handled without language escalation                  | > 80%                                 | Bot language escalations / total Arabic sessions                          |
| **P7: AI & Data**  | % of agents using AVM valuation tool before submitting listing price             | > 70%                                 | Valuation endpoint call before property.price set                         |
| **P7: AI & Data**  | Lead score visible and actioned (agent moves lead based on score change)         | > 50% score-driven stage changes      | CRM lead status change within 24h of score change                         |
| **P8: Off-Plan**   | Portal listing views from Bayut/PF attribution (not direct)                      | > 40% of property views               | UTM / referrer source: bayut / propertyfinder                             |
| **P8: Off-Plan**   | Developer partner portal receives inquiry routed to White Caves                  | ≥ 5 developer-sourced inquiries/month | CRM leads WHERE source=developer_portal                                   |
| **P9: RBAC**       | All 10+ agents log into CRM daily (no shared credentials)                        | 100% unique user sessions             | Auth log: COUNT(DISTINCT userId) = agent headcount                        |
| **P9: RBAC**       | Lead assignment via CRM (not manually via WhatsApp)                              | > 95% of leads assigned in CRM        | lead.assignedAgentId set within 30 min of creation                        |
| **P10: Mobile**    | PWA install rate (Add to Home Screen) among mobile visitors                      | > 30%                                 | PWA install event (beforeinstallprompt accepted)                          |
| **P10: Mobile**    | % of agent activity (lead updates, notes) from mobile device                     | > 60%                                 | Session user-agent: mobile / total agent sessions                         |

---

**Document Owner:** Executive Team (Zoe + @Margaret)
**Review Cycle:** Quarterly — each phase start
**Board Version:** Available on request (excludes technical implementation details)
