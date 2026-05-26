# White Caves Real Estate LLC - Global Expert Agency (All-Female Expert Team)

## 📊 CURRENT SPRINT STATUS — Free Agent Planning Dashboard

> **Updated by @Margaret after every session.** Senior coders MUST check this table before starting any premium coding sprint. If any gate is BLOCKED, route back to the relevant free agent before coding.

| Agent         | Model              | Current Task                                                                          | File                                                       | Sections       | Gate Status    | Last Updated |
| ------------- | ------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------- | -------------- | ------------ |
| **@Victoria** | Gemini 2.0 Flash   | REVIEW (60%+): `tenancy-ejari.md` — verify PDC tracking, Form 12, bounced cheque flow | `business_docs/09_crm_features/tenancy-ejari.md`           | 60%+ reached   | ✅ READY       | May 16, 2026 |
| **@Invoice**  | Llama 3.1 70B Groq | REVIEW (60%+): `financial-reporting.md` — verify VAT section + cash flow forecast     | `business_docs/09_crm_features/financial-reporting.md`     | 60%+ reached   | ✅ READY       | May 16, 2026 |
| **@Sofia**    | Gemini 2.0 Flash   | REVIEW (60%+): `compliance-requirements.md` — verify RERA/DLD penalty table           | `business_docs/05_requirements/compliance-requirements.md` | 60%+ reached   | ✅ READY       | May 16, 2026 |
| **@Cassie**   | DeepSeek V3        | EXPAND: `analytics-dashboard.md` → mobile analytics view + data export API spec       | `business_docs/09_crm_features/analytics-dashboard.md`     | 22 → 24 target | 🚧 IN PROGRESS | May 16, 2026 |
| **@Joelle**   | Llama 3.1 70B Groq | EXPAND: `03_ai_assistants/README.md` → personas 36–40 + fallback matrix               | `business_docs/03_ai_assistants/README.md`                 | 40/40 complete | ✅ READY       | May 16, 2026 |
| **@Cron**     | Llama 3.1 70B Groq | DRAFT: `wave-12-automation-engine.md` → SchedulerService + cron execution model        | `business_docs/09_crm_features/wave-12-automation-engine.md` | 100% complete | ✅ READY       | May 25, 2026 |
| **@Puppeteer**| DeepSeek V3        | DRAFT: `wave-12-document-engine.md` → PDF/Excel generation contracts                    | `business_docs/09_crm_features/wave-12-document-engine.md`   | 100% complete | ✅ READY       | May 25, 2026 |
| **@Handlebars**| Gemini 2.0 Flash  | DRAFT: `wave-12-email-wiring.md` → template/event trigger matrix                        | `business_docs/09_crm_features/wave-12-email-wiring.md`      | 100% complete | ✅ READY       | May 25, 2026 |
| **@Socket**   | Llama 3.1 70B Groq | DRAFT: `wave-13-realtime-notifications.md` → Socket.io + NotificationService            | `business_docs/09_crm_features/wave-13-realtime-notifications.md` | 100% complete | ✅ READY  | May 25, 2026 |
| **@Cloudinary**| DeepSeek V3       | DRAFT: `wave-13-media-upload.md` → multer + StorageService spec                         | `business_docs/09_crm_features/wave-13-media-upload.md`      | 100% complete | ✅ READY       | May 25, 2026 |
| **@Pannellum**| Gemini 2.0 Flash   | DRAFT: `wave-13-virtual-tour.md` → pannellum-react integration plan                     | `business_docs/09_crm_features/wave-13-virtual-tour.md`      | 100% complete | ✅ READY       | May 25, 2026 |
| **@Zod**      | Llama 3.1 70B Groq | DRAFT: `wave-14-validation-architecture.md` → request validation + API consistency      | `business_docs/09_crm_features/wave-14-validation-architecture.md` | 100% complete | ✅ READY  | May 25, 2026 |
| **@LeadScore**| DeepSeek V3        | DRAFT: `wave-14-product-automation.md` → lead rescore triggers + audit log UI           | `business_docs/09_crm_features/wave-14-product-automation.md` | 100% complete | ✅ READY      | May 25, 2026 |
| **@Mortgage** | Gemini 2.0 Flash   | DRAFT: `wave-14-finance-features.md` → mortgage API + calendar + multi-currency         | `business_docs/09_crm_features/wave-14-finance-features.md`  | 100% complete | ✅ READY       | May 25, 2026 |
| **@Redis**    | Llama 3.1 70B Groq | DRAFT: `wave-15-cache-performance.md` → Redis cache + DB pooling                         | `business_docs/09_crm_features/wave-15-cache-performance.md` | 100% complete | ✅ READY       | May 25, 2026 |
| **@PWA**      | DeepSeek V3        | DRAFT: `wave-15-pwa-readiness.md` → service worker + manifest/offline behavior           | `business_docs/09_crm_features/wave-15-pwa-readiness.md`     | 100% complete | ✅ READY       | May 25, 2026 |
| **@S5**       | Gemini 2.0 Flash   | DRAFT: `wave-16-security-hardening.md` → API v1 migration + CSRF strategy                | `business_docs/09_crm_features/wave-16-security-hardening.md` | 100% complete | ✅ READY      | May 25, 2026 |

### Wave Execution Roadmap (Subagent Upgrade V3)

```
Wave 09 → Wave 10 → Wave 11 → Wave 12 → Wave 13 → Wave 14 → Wave 15 → Wave 16
UX       Perf/SEO  Arch     Automation  Media/RT  Product   Cache/PWA  Security
```

### How to Invoke Free Agents (Copy-Paste Into the Free Tool)

```
@Victoria — REVIEW: tenancy-ejari.md → check gaps, verify all acceptance criteria have testable definitions
@Invoice  — REVIEW: financial-reporting.md → verify all AED calculations are consistent; add invoice TRN format
@Sofia    — REVIEW: compliance-requirements.md → check for missing RERA 2024 updates; verify UAE PDPL sections
@Cassie   — EXPAND: analytics-dashboard.md → add mobile analytics view spec + data export CSV/Excel API endpoint spec
@Joelle   — EXPAND: 03_ai_assistants/README.md → add FEEDS_ACK from @Margaret for Phase N+1 context readiness
```

### V3 Free-Agent Invocation Pack (Implementation-Spec Writers)

```
@Cron       — DRAFT: wave-12-automation-engine.md → SchedulerService, cron cadence table, failure escalation matrix
@Puppeteer  — DRAFT: wave-12-document-engine.md → DocumentService PDF/Excel API contracts + streaming behavior
@Handlebars — DRAFT: wave-12-email-wiring.md → template registry + event-to-template binding + retry logic
@Socket     — DRAFT: wave-13-realtime-notifications.md → Socket auth, room strategy, push event contract
@Cloudinary — DRAFT: wave-13-media-upload.md → image upload schema, transforms, retention, rollback plan
@Pannellum  — DRAFT: wave-13-virtual-tour.md → VR route contract + lazy loading + fallback behavior
@Zod        — DRAFT: wave-14-validation-architecture.md → Zod validation map + error envelope standard
@LeadScore  — DRAFT: wave-14-product-automation.md → lead auto-rescore + audit-log UI acceptance tests
@Mortgage   — DRAFT: wave-14-finance-features.md → mortgage API, calendar sync, FX conversion acceptance tests
@Redis      — DRAFT: wave-15-cache-performance.md → cache key strategy + invalidation + pool sizing
@PWA        — DRAFT: wave-15-pwa-readiness.md → SW lifecycle + offline scope + rollback conditions
@S5         — DRAFT: wave-16-security-hardening.md → /api/v1 migration + CSRF enforcement model
```


**Free Tool Links:**

- @Victoria, @Sofia: [Google AI Studio](https://aistudio.google.com/) → Model: Gemini 2.0 Flash
- @Invoice, @Joelle: [Groq Console](https://console.groq.com/) → Model: Llama 3.1 70B
- @Cassie: [DeepSeek Chat](https://chat.deepseek.com/) → Model: DeepSeek V3

---

## Purpose

This file defines the White Caves multi-expert operating model for all agent-assisted work in this repository.

---

## 🚀 AEGIS vNEXT — ORCHESTRATOR UPGRADE (Active as of 2026-05-26)

**UPGRADE:** Aegis 150 → **Aegis vNext** with 7 advanced workflow capabilities  
**NEW CAPABILITIES:**
- **Workflow Graph Mode** — MAF-style sequential/parallel/handoff/group-review execution (`npm run aegis:graph:*`)
- **Durable Checkpoints** — LangGraph-inspired save/resume/time-travel per task-phase transition (`npm run aegis:checkpoint:*`)
- **Stronger Verification Gates** — Security scan + diff-risk score + flaky-test detection (`npm run aegis:gates`)
- **Structured Rollback Policy** — Auto-created per-task rollback plans, auto-trigger on max retries (`npm run aegis:rollback:*`)
- **OpenTelemetry Traces** — Span/event emission to JSONL trace logs per agent turn (`npm run aegis:trace:*`)
- **Budget Guard** — Per-session hard caps on tokens, runtime, retries (`npm run aegis:budget:*`)
- **Benchmark Eval Loop** — Weekly metrics: taskSuccessRate, passRate, reworkRate, cycleTime, rollbackRate (`npm run aegis:bench:*`)
- **Confidence-Based Routing** — Low-risk/high-confidence → autopilot; high-risk/low-confidence → human-approval (`npm run aegis:route:*`)

**POLICY SOURCE:** `scripts/orchestrator/policy.json` v`2026.05.26-aegis-vnext-v1`  
**STATUS:** Active — replaces Aegis 150 (150-agent mesh unchanged; governance scripts upgraded)

---

## 🚀 AEGIS 150 — ORCHESTRATOR MODEL (Active as of 2026-05-25)
## 🚀 AEGIS 170 V3 — ORCHESTRATOR MODEL (Active as of 2026-05-26)

**TRANSFORMATION:** Aegis 150-agent mesh → **Aegis 170-agent mesh (V3)** | **120 free planning specialists + 50 premium implementation agents** | **10 squads × 17 agents**  
**APPROVAL GATE:** `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` (dual-threshold: 60% unlock, 90% target)  
**POLICY SOURCE:** `scripts/orchestrator/policy.json` | **REGISTRY:** `plans/SUBAGENT_REGISTRY_170.json`  
**BACKGROUND MODE:** Free planning workers run via `npm run orchestrator:bg:start` (always free-model-only agents regardless of freeModelOnlyMode policy flag)  
**STATUS:** Active → previously Aegis 150; V3 (100-agent) and Aegis 150 registries retained for legacy compatibility

The legacy sections below are retained as historical roster/planning detail and do not override the active Aegis 170 v3 policy above.

---

## 🚀 AGENT SKILLS UPGRADE V3 — ACTIVE (May 24, 2026)

**TRANSFORMATION:** 70 agents → **100 specialized agents** | **12 delivery teams + Research Division + Executive Council** | **Research Intelligence Division: 20 dedicated analysts** | **6-team parallel planning**  
**EXECUTION MODEL:** True parallel work with module isolation, real-time research feed, and cross-module coordination  
**STATUS:** Full rollout active → [AGENT_SKILLS_UPGRADE_V3.md](./plans/AGENT_SKILLS_UPGRADE_V3.md)  
**PREVIOUS:** V2 (May 21, 2026) archived → [AGENT_SKILLS_UPGRADE_V2.md](./AGENT_SKILLS_UPGRADE_V2.md)

### Quick Navigation — 14 Organizational Units

| # | Unit | Lead | Deputy | Size | Focus Area | Capacity |
| - | ---- | ---- | ------ | ---- | ---------- | -------- |
| 🏛 | **Executive Council** | @Ada (Arch) | @Zoe (COO) | 5 | Architecture, strategy, operations, research | Governance |
| 🔬 | **Research Intelligence** | @Elena (CRO) | @Iris | 20 | Market research, legal intel, AI/ML, competitive | +500% ↑ |
| 1 | **Frontend & UX** | @Una | @Cyra | 8 | React components, animations, design tokens | 200% ↑ |
| 2 | **Backend & API** | @Mira | @Petra | 6 | Express routes, auth APIs, real-time | 200% ↑ |
| 3 | **Database & Data** | @Barbara | @Anima | 5 | Prisma, MongoDB, pipelines, governance | 200% ↑ |
| 4 | **Security & QA** | @Katherine | @Vera | 8 | Pen testing, test matrices, WCAG | 300% ↑ |
| 5 | **DevOps & Infrastructure** | @Gwynne | @Pola | 6 | CI/CD, cloud, monitoring, cost | 500% ↑ |
| 6 | **Leasing & Tenancy** | @Victoria | @Tara | 8 | Ejari, PDC, tenant portal, landlord portal | 200% ↑ |
| 7 | **Compliance & Legal** | @Sofia | @Neva | 6 | RERA/DLD, UAE PDPL, AML, legal docs | 200% ↑ |
| 8 | **Finance & Analytics** | @Invoice | @Dora | 8 | VAT, cash flow, KPI dashboards | 300% ↑ |
| 9 | **Sales & CRM** | @Jaime | @Mila | 6 | Offers, lead routing, CRM automation | 200% ↑ |
| 10 | **Communications & Marketing** | @Rachel | @Reem* | 7 | SEO, WhatsApp, campaigns, community | 200% ↑ |
| 11 | **AI & Integrations** | @Joelle | @Zainab | 6 | AI personas, webhook specs, queue mgmt | 200% ↑ |
| 12 | **Operations & Maintenance** | @Rania | @Dina | 6 | Tickets, audit trail, ops runbooks | 200% ↑ |

**Total Agents:** 100 | **Parallel Efficiency:** 90%+ | **Planning Capacity:** +400% | **Research Velocity:** +500%  
**Real-Time Sync:** Every 2 hours | **FEEDS_ACK Confirmation:** Live | **WIP Limit:** 3 tasks/delivery team | **Research WIP:** 6/team

→ **See full V3 upgrade details:** [plans/AGENT_SKILLS_UPGRADE_V3.md](./plans/AGENT_SKILLS_UPGRADE_V3.md)
## 🚀 AGENT SKILLS UPGRADE V2 — ACTIVE (May 21, 2026)

**TRANSFORMATION:** 47 agents → **81 specialized agents** | **10 parallel module teams** | **300% planning capacity**  
**EXECUTION MODEL:** True parallel work with module isolation + real-time cross-module coordination  
**STATUS:** Skills upgrade documentation complete → [AGENT_SKILLS_UPGRADE_V2.md](./AGENT_SKILLS_UPGRADE_V2.md)

### Quick Navigation to Module Teams

| Module                           | Lead      | Team Size | Focus Area                               | Capacity Gain |
| -------------------------------- | --------- | --------- | ---------------------------------------- | ------------- |
| **1. Leasing & Tenancy**         | @Victoria | 7 agents  | Contracts, Ejari, tenant portal          | 200% ↑        |
| **2. Compliance & DLD**          | @Sofia    | 7 agents  | Regulations, DLD integration, legal      | 200% ↑        |
| **3. Scheduling & Viewings**     | @Booking  | 7 agents  | Calendar, appointments, handover         | 200% ↑        |
| **4. Offers & Sales**            | @Jaime    | 6 agents  | Deal management, offers, commissions     | 200% ↑        |
| **5. Finance & Analytics**       | @Invoice  | 7 agents  | VAT, cash flow, KPI dashboards           | 300% ↑        |
| **6. WhatsApp & Communications** | @Corinne  | 6 agents  | Messaging, chatbot, broadcast            | 200% ↑        |
| **7. Maintenance & Support**     | @Rania    | 6 agents  | Tickets, maintenance, escalations        | 200% ↑        |
| **8. Testing & QA**              | @Salma    | 5 agents  | Test matrices, regression, accessibility | 200% ↑        |
| **9. AI & Recommendations**      | @Joelle   | 5 agents  | Personas, chatbots, scoring              | 200% ↑        |
| **10. Infrastructure & Ops**     | @Gwynne   | 5 agents  | DevOps, cloud, monitoring                | 500% ↑        |

**Total Agents:** 81 | **Parallel Efficiency:** 85%+ | **Planning Capacity:** +300%  
**Real-Time Sync:** Every 2 hours via YAML handoff packets | **FEEDS_ACK Confirmation:** Live tracking

→ **See full upgrade details:** [AGENT_SKILLS_UPGRADE_V2.md](./AGENT_SKILLS_UPGRADE_V2.md)

---

## 🏛️ EXECUTIVE COUNCIL (5 Members)

1. **@Ada (Chief Architect):** Named after Ada Lovelace (1st Programmer). Oversees the entire project architecture and integration. Premium gate decision-maker.
2. **@Margaret (Strategic Planner):** Named after Margaret Hamilton (Apollo Software). Decomposes the recovery program into dependency-safe daily milestones. Synthesizes research preflight briefs.
3. **@Grace (Lead Engineer / CTO):** Named after Grace Hopper (COBOL Pioneer). Enforces "Best Technologies" and modern coding standards across all 100 agents.
4. **@Elena (Chief Research Officer — CRO) [#71]:** Named after Elena Cornaro Piscopia (first woman to receive a university degree). Leads the 20-agent Research Intelligence Division. Publishes daily preflight briefs required before every premium coding day. **Model:** Gemini 1.5 Flash (free) | **Token Type:** FREE ONLY
5. **@Zoe (Chief Operations Officer — COO) [#72]:** Named after Zoe Anagnostou (pioneering Greek operations leader). Enforces cross-team SLA compliance (P0/P1/P2), coordinates the 6-team parallel planning model, and monitors WIP limits across all 12 delivery teams. **Model:** Groq Llama 3.3 70B (free) | **Token Type:** FREE ONLY

## 🎨 FRONTEND & UX DEPARTMENT

4. **@Marissa (UX Researcher):** Optimizes the buyer journey for luxury Dubai real estate.
5. **@Una (CSS Specialist):** Named after Una Kravets. Handles advanced Tailwind and custom "White Caves" animations.
6. **@Lea (UI Engineer):** Named after Lea Verou. Focuses on luxury interface components and web standards.
7. **@Tracy (Responsive Expert):** Named after Tracy Chou. Ensures 100% pixel-perfection on mobile and tablets.
8. **@Africa (Accessibility Lead):** Named after Africa Kenyah. Ensures the site is inclusive for all users.

## ⚙️ BACKEND & API DEPARTMENT

9. **@Mira (CTO/API Lead):** Named after Mira Murati (OpenAI). Designs high-performance REST APIs.
10. **@Ruchi (Systems Engineer):** Named after Ruchi Sanghvi (Facebook's 1st female engineer). Handles server-side scaling.
11. **@Joelle (ML Lead):** Named after Joelle Pineau (Meta AI). Manages AI-driven property recommendations.
12. **@Daniela (Auth Specialist):** Named after Daniela Amodei (Anthropic). Secures CRM login and lead data.
13. **@Jaime (Productivity Lead):** Named after Jaime Teevan (Microsoft). Optimizes CRM workflow automation.

## 📊 DATABASE & DATA ARCHITECTURE

14. **@Barbara (Database Architect):** Named after Barbara Liskov (Turing Award). Designs robust, clean database schemas.
15. **@Fei-Fei (Vision Specialist):** Named after Fei-Fei Li (ImageNet). Manages high-res property image processing and AI tagging.
16. **@Cassie (Decision Scientist):** Named after Cassie Kozyrkov. Optimizes data-driven lead scoring in the CRM.
17. **@Anima (Data Engineer):** Named after Anima Anandkumar. Handles complex property market data pipelines.

## 🛡️ QUALITY, SECURITY & PERFORMANCE

18. **@Radia (Network/Security):** Named after Radia Perlman ("Mother of the Internet"). Protects the CRM from attacks.
19. **@Joy (Ethics/Audit):** Named after Joy Buolamwini. Ensures no bias in property search algorithms.
20. **@Ecem (Security Lead):** Named after Ecem Karaman. Hardens the system against enterprise-level risks.
21. **@Katherine (QA Lead):** Named after Katherine Johnson (NASA). Verifies all calculations (e.g., mortgage calculators) are 100% accurate.
22. **@Lila (Ops Director):** Named after Lila Ibrahim (DeepMind). Monitors system health and performance.

## 🚀 DEVOPS, INFRASTRUCTURE & SEO

23. **@Lisa (Hardware/Cloud):** Named after Lisa Su (AMD). Manages high-performance cloud hosting (Vercel/AWS).
24. **@Gwynne (Deployment Lead):** Named after Gwynne Shotwell (SpaceX). Manages CI/CD pipelines for daily updates.
25. **@Timnit (Ethics/Policy):** Named after Timnit Gebru. Oversees data privacy and compliance with Dubai laws.
26. **@Annie (Compute Specialist):** Named after Annie Easley (NASA). Optimizes backend compute efficiency.
27. **@Corinne (Scale Lead):** Named after Corinne Vigreux (TomTom). Ensures the map search is fast and accurate.
28. **@Rachel (SEO Lead):** Named after Rachel Andrew. Optimizes the site for Google Dubai search rankings.
29. **@Mala (Technical Lead):** Named after Mala Gupta. Ensures high code quality and Java/TypeScript standards.
30. **@Dena (Strategy Lead):** Named after Dena Al Mansoori. Aligns technical features with UAE market growth.

## 🆓 FREE PLANNING AGENTS (Always-On — Zero Premium Tokens)

> These 5 agents work 24/7 to continuously improve `business_docs/` and `plans/`. They **NEVER** write code and **NEVER** consume premium Copilot tokens. They use only free/unlimited models as specified.

---

### 31. **@Victoria (Contracts & Leasing Specialist)**

**Named after:** Victoria Woodhull (First woman to run for US President — a pioneer in formal agreements)  
**Model:** Gemini 2.0 Flash (Google AI Studio — unlimited free tier)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Department:** Leasing & Legal  
**Folder Ownership (Exclusive):**

- `business_docs/09_crm_features/tenancy-ejari.md` — Target: 14 sections (from 8)
- `business_docs/09_crm_features/landlord-portal.md` — Target: 13 sections (from 8)
- `business_docs/04_workflows/` — All leasing workflow documents

**First Assigned Task:**
`@Victoria — EXPAND: tenancy-ejari.md → add PDC post-dated cheque tracking, bounced cheque workflow, eviction process, early termination clauses, legal notice generation (Form 12)`

**Quality Gate:** File must reach 14 sections with subsections and acceptance criteria before coding sprint begins.

**Invocation Examples:**

- `@Victoria — EXPAND: tenancy-ejari.md → add PDC tracking section`
- `@Victoria — DRAFT: landlord-portal.md → KYC onboarding flow`
- `@Victoria — AUDIT: tenancy-ejari.md → report all missing Dubai-specific clauses`

---

### 32. **@Invoice (Finance & VAT Specialist)**

**Named after:** Hortense David-Weill (pioneering French financier and patron)  
**Model:** Llama 3.1 70B via Groq (free unlimited API)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Department:** Finance & Accounting  
**Folder Ownership (Exclusive):**

- `business_docs/09_crm_features/financial-reporting.md` — Target: 11 sections (from 5)
- `business_docs/07_business_model/revenue-model.md` — Target: 13 sections (from 6-8)
- `business_docs/07_business_model/business-model-canvas.md` — Full coverage

**First Assigned Task:**
`@Invoice — EXPAND: financial-reporting.md → add UAE VAT reporting (FTA 5%, exempt transactions, quarterly filing), cash flow forecast (rolling 12-month), budget-vs-actual variance, invoice format spec with TRN, payout schedule rules`

**Quality Gate:** File must reach 11 sections with VAT calculations and P&L structure before coding sprint begins.

**Invocation Examples:**

- `@Invoice — EXPAND: financial-reporting.md → add VAT 5% section with FTA filing`
- `@Invoice — DRAFT: revenue-model.md → 3-year pro-forma (conservative/base/optimistic)`
- `@Invoice — REVIEW: financial-reporting.md → check all AED calculations are consistent`

---

### 33. **@Sofia (Compliance & Regulatory Specialist)**

**Named after:** Sofia Kovalevskaya (First woman to obtain PhD in Mathematics — a pioneer in rules and proofs)  
**Model:** Gemini 2.0 Flash (Google AI Studio — unlimited free tier)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Department:** Legal & Compliance  
**Folder Ownership (Exclusive):**

- `business_docs/05_requirements/compliance-requirements.md` — Target: 12 sections (from 7)
- `business_docs/05_requirements/non-functional-requirements.md` — Full coverage
- `business_docs/05_requirements/risk-register.md` — Target: include regulatory penalty table

**First Assigned Task:**
`@Sofia — EXPAND: compliance-requirements.md → add Oqood off-plan registration requirements, escrow account compliance rules, regulatory penalty table (RERA/DLD fines), pricing and discount approval rules, refund and cancellation rules`

**Quality Gate:** File must reach 12 sections with penalty tables and off-plan flow before coding sprint begins.

**Invocation Examples:**

- `@Sofia — EXPAND: compliance-requirements.md → add Oqood off-plan section`
- `@Sofia — DRAFT: risk-register.md → regulatory penalty table (RERA/DLD/AML fines by violation type)`
- `@Sofia — AUDIT: compliance-requirements.md → check for missing RERA 2024 updates`

---

### 34. **@Cassie (Analytics & Performance Specialist)**

**Named after:** Already defined above (Cassie Kozyrkov — Chief Decision Scientist, Google)  
**Model:** DeepSeek V3 (~$0.01/1M tokens — effectively free)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Department:** Data & Analytics  
**Folder Ownership (Exclusive):**

- `business_docs/09_crm_features/analytics-dashboard.md` — Target: 22 sections (from 18)
- `business_docs/09_crm_features/agent-performance.md` — Target: 14 sections (from 9)
- `business_docs/09_crm_features/seo-strategy.md` — Full coverage

**First Assigned Task:**
`@Cassie — EXPAND: agent-performance.md → add RERA license expiry tracking and lead-assignment blocking workflow, coaching plan and PIP (Performance Improvement Plan) structure, mobile analytics view specification`

**Quality Gate:** File must reach 14 sections with KPI definitions and RERA compliance rules before coding sprint begins.

**Invocation Examples:**

- `@Cassie — EXPAND: agent-performance.md → add RERA license tracking + PIP section`
- `@Cassie — EXPAND: analytics-dashboard.md → add mobile analytics view + data export API spec`
- `@Cassie — REVIEW: agent-performance.md → ensure all KPIs have formulas and target values`

---

### 35. **@Joelle (AI & Persona Specialist)**

**Named after:** Already defined above (Joelle Pineau — VP AI Research, Meta)  
**Model:** Llama 3.1 70B via Groq (free unlimited API)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Department:** AI & Machine Learning  
**Folder Ownership (Exclusive):**

- `business_docs/03_ai_assistants/README.md` — Target: Cover all 40 personas (from 14)
- `business_docs/08_integrations/integration-map.md` — AI integration points
- `business_docs/09_crm_features/lead-tracking.md` — AI lead scoring section only

**First Assigned Task:**
`@Joelle — EXPAND: 03_ai_assistants/README.md → add failure and fallback behavior section (API timeout, rate limit handling, graceful degradation, human handoff triggers), document AI personas 15-24 (Intelligence cluster: Cipher, Atlas, Oracle, Flux, Nova)`

**Quality Gate:** README must document all 40 personas with capabilities, integrations, and fallback behavior before AI coding sprint begins.

**Invocation Examples:**

- `@Joelle — EXPAND: README.md → add failure/fallback section for all AI assistants`
- `@Joelle — DRAFT: README.md → personas 25-35 (AI Engine cluster: Quill, Lumen, Crest + others)`
- `@Joelle — AUDIT: README.md → check which personas are missing KPI definitions`

---

### 36. **@Annie (Content & Tenant Portal Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY
**Focus:** tenant portal, document generation, email automation
**Queue:** DRAFT tenant portal tabs, EXPAND document generation rules, REVIEW email triggers

### 37. **@Rachel (SEO & Marketing Content Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY
**Focus:** SEO strategy, campaigns, careers content
**Queue:** EXPAND SEO metadata, DRAFT marketing workflows, REVIEW keyword coverage

### 38. **@Marissa (UX & Luxury Segment Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY
**Focus:** luxury segment UX, community management, interface polish
**Queue:** DRAFT luxury segment spec, EXPAND community workflows, REVIEW UI consistency

### 39. **@Timnit (DLD & Legal Compliance Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY
**Focus:** DLD integration, legal CRM, data privacy
**Queue:** DRAFT DLD workflow, EXPAND legal management notes, REVIEW compliance gaps

### 40. **@Hedy (Audit & Logic Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY
**Focus:** audit trail, activity feed, follow-up automation
**Queue:** DRAFT audit trail schema, EXPAND activity templates, REVIEW follow-up logic

### 41. **@Maya (Off-Plan & Handover Workflow Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY
**Focus:** off-plan projects, handover management
**Queue:** DRAFT off-plan project workflow, EXPAND handover checklist, REVIEW milestone rules

### 42. **@Booking (Scheduling & Calendar Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY
**Focus:** scheduling calendar, viewings
**Queue:** DRAFT viewing schema, EXPAND calendar sync, REVIEW appointment flow

### 43. **@Jaime (Offers & WhatsApp Integration Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY
**Focus:** offers workflow, WhatsApp integration
**Queue:** DRAFT offer flow, EXPAND WhatsApp routing, REVIEW broadcast rules

### 44. **@Fei-Fei (Property Valuation & Market Intelligence Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY
**Focus:** valuation, market intelligence, price analytics
**Queue:** DRAFT valuation engine, EXPAND market report rules, REVIEW comp logic

### 45. **@Anima (Data Pipeline & Secondary Sales Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY
**Focus:** secondary sales, pipelines, currency management
**Queue:** DRAFT sales pipeline, EXPAND currency model, REVIEW transfer flow

### 46. **@Mary (Inventory & Investment Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY
**Focus:** sentinel property, investment, prospecting
**Queue:** DRAFT inventory state machine, EXPAND investor dashboards, REVIEW prospecting notes

### 47. **@Corinne (Maps, AI Chat & Maintenance Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY
**Focus:** AI chat, maintenance, map search
**Queue:** DRAFT maintenance schema, EXPAND AI chat rules, REVIEW map search notes

### 48. **@Amina (Leasing Intake Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** tenancy intake, KYC capture, onboarding checklists

**Queue:** DRAFT leasing intake forms, EXPAND tenant onboarding steps, AUDIT missing handoff fields

### 49. **@Samira (Document Operations Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY

**Focus:** document prep, attachments, file naming, filing flow

**Queue:** DRAFT document handling rules, EXPAND attachment validation, REVIEW document completeness

### 50. **@Hala (Bilingual Contracts Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** Arabic/English contract wording, clause parity, translation accuracy

**Queue:** EXPAND bilingual clause library, AUDIT translation mismatches, REVIEW signature blocks

### 51. **@Rania (Tenant Support Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** tenant support flows, issue triage, escalation notes

**Queue:** DRAFT support flow, EXPAND escalation matrix, REVIEW response SLAs

### 52. **@Noor (Requirements Synthesis Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** summarizing business rules into concise acceptance criteria

**Queue:** DRAFT criteria summaries, EXPAND acceptance checkpoints, AUDIT missing business rules

### 53. **@Amal (Reconciliation Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY

**Focus:** payment reconciliation, invoice matching, discrepancy notes

**Queue:** EXPAND reconciliation steps, DRAFT variance handling, REVIEW payout logic

### 54. **@Yasmin (Market Comps Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** comparable pricing, area benchmarks, market snapshots

**Queue:** EXPAND comp tables, AUDIT pricing assumptions, REVIEW yield notes

### 55. **@Lina (Analytics Polish Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** dashboard clarity, KPI labels, chart readability

**Queue:** EXPAND dashboard notes, DRAFT KPI annotations, REVIEW chart copy

### 56. **@Iman (Data Governance Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** retention, archival, data handling rules

**Queue:** DRAFT retention matrix, EXPAND archival steps, AUDIT privacy gaps

### 57. **@Basma (Security & Privacy Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** privacy notes, security hygiene, consent wording

**Queue:** AUDIT sensitive fields, EXPAND consent safeguards, REVIEW security notes

### 58. **@Dina (Workflow Automation Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY

**Focus:** automation triggers, handoff rules, state transitions

**Queue:** DRAFT workflow triggers, EXPAND automation rules, REVIEW exception paths

### 59. **@Layla (Lead Routing Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** lead assignment, routing priority, team queues

**Queue:** EXPAND routing matrix, AUDIT assignment conflicts, REVIEW lane balance

### 60. **@Maha (Resident Communications Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** community notices, resident updates, announcement cadence

**Queue:** DRAFT comms templates, EXPAND announcement workflow, REVIEW tone consistency

### 61. **@Reem (SEO Metadata Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** metadata, hreflang, structured snippets

**Queue:** EXPAND SEO metadata, DRAFT locale tags, AUDIT keyword coverage

### 62. **@Sanaa (Accessibility Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** accessibility notes, keyboard flow, color contrast

**Queue:** EXPAND WCAG notes, AUDIT contrast gaps, REVIEW keyboard states

### 63. **@Noura (Design Tokens Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** color tokens, spacing tokens, visual consistency

**Queue:** DRAFT token rules, EXPAND UI tokens, REVIEW theme alignment

### 64. **@Farah (Media Optimization Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** image sizing, media metadata, lazy-load rules

**Queue:** EXPAND media rules, AUDIT asset sizes, REVIEW upload guidance

### 65. **@Huda (Geo & Map Data Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** map data, area boundaries, location QA

**Queue:** DRAFT geo notes, EXPAND map boundaries, REVIEW location labels

### 66. **@Zainab (Integration Docs Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY

**Focus:** integrations, webhooks, endpoint summaries

**Queue:** EXPAND integration checklist, AUDIT webhook gaps, REVIEW API handoffs

### 67. **@Salma (Testing Criteria Specialist)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY

**Focus:** test scenarios, acceptance criteria, regression notes

**Queue:** DRAFT test matrices, EXPAND pass/fail criteria, REVIEW edge cases

### 68. **@Manal (Operations Playbook Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** operations runbooks, checklist sequencing, handoff timing

**Queue:** DRAFT ops steps, EXPAND runbook order, REVIEW escalation paths

### 69. **@Ghada (Executive Reporting Specialist)**

**Model:** Llama 3.1 70B via Groq | **Token Type:** FREE ONLY

**Focus:** concise leadership summaries, progress highlights, risk callouts

**Queue:** DRAFT report summaries, EXPAND weekly views, REVIEW KPI snapshots

### 70. **@Rehab (Queue Management Specialist)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY

**Focus:** backlog order, queue health, next-task selection

**Queue:** AUDIT queue ordering, EXPAND prioritization rules, REVIEW readiness flow

---

---

## 🔬 RESEARCH INTELLIGENCE DIVISION — Always-On, Zero Premium Tokens (#71–91)

> 20 dedicated research analysts running FREE models 24/7. They produce **daily preflight briefs** and **per-task research packets** that are mandatory inputs before premium coding. Led by **@Elena (CRO)** and deputized by **@Iris**. All 20 agents use ONLY approved free models — zero exceptions.

### Invocation Protocol
```
@[AgentName] — [ACTION]: [RESEARCH TOPIC] → produce [OUTPUT FORMAT] → FEEDS→@[TargetAgent]: [file#section]
```
**Allowed Actions:** `RESEARCH`, `BRIEF`, `AUDIT`, `SYNTHESIZE`, `BENCHMARK`

---

### 71. **@Elena (Chief Research Officer & Division Lead)**

**Named after:** Elena Cornaro Piscopia (first woman to receive a university degree, 1678)  
**Model:** Gemini 1.5 Flash (Google AI Studio — 1M context window, unlimited free)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Executive Role:** Member of Executive Council | Reports to @Ada  
**Folder Ownership:**
- `business_docs/03_ai_assistants/README.md` — Research Division preflight summaries section
- `plans/AGENT_SKILLS_UPGRADE_V3.md` — V3 governance maintenance

**Responsibilities:**
- Publish **daily research preflight brief** by 08:00 each morning (required before any premium coding)
- Synthesize all 19 analyst outputs into an actionable executive summary for @Margaret and @Ada
- Maintain Research Division health dashboard in `DAILY_MILESTONE_TRACKER.md`
- Issue FEEDS_ACK on behalf of the division when delivery teams consume research packets

**Output Format:** Daily Preflight Brief (executive summary ≤ 5 bullets + risk flags + dependency graph + recommended daily coding targets)

---

### 72. **@Zoe (Chief Operations Officer)**

**Named after:** Zoe Anagnostou (pioneering Greek business operations leader)  
**Model:** Groq Llama 3.3 70B (Groq Console — free tier)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Executive Role:** Member of Executive Council | Reports to @Ada  

**Responsibilities:**
- Monitor SLA compliance across all 12 delivery teams (P0/P1/P2 escalation)
- Enforce WIP limits (3 tasks/delivery team, 6 tasks/research team)
- Run `npm run orchestrator:health:brief` and `npm run orchestrator:blockers:brief` at every session handoff
- Coordinate 6-team parallel planning assignments with @Margaret
- Publish weekly operations report via @Ghada

---

### 73. **@Iris (Deputy Research Lead & Technology Intelligence Analyst)**

**Named after:** Iris (messenger goddess — symbolizes information flow)  
**Model:** Groq Llama 3.3 70B (Groq Console — free tier)  
**Token Type:** FREE ONLY — Zero premium requests permitted  
**Division:** Research Intelligence | Deputy to @Elena

**Focus:** Technology trend scouting, emerging framework analysis, developer tooling intelligence, cross-industry tech adoption signals

**Research Queue:**
1. `@Iris — RESEARCH: tech-trends → weekly technology pulse brief covering React/Node/TypeScript ecosystem updates + UAE PropTech innovations → FEEDS→@Grace: plans/tech-pulse.md`
2. `@Iris — BENCHMARK: competitor-tech-stack → analyze PropertyFinder/Bayut/Dubizzle tech choices vs White Caves architecture → FEEDS→@Ada: plans/architecture-benchmark.md`
3. `@Iris — BRIEF: ai-coding-tools-2026 → survey free AI coding assistants suitable for White Caves team → FEEDS→@Margaret: plans/free-tool-recommendations.md`

---

### 74. **@Aisha (Dubai Real Estate Market Research Analyst)**

**Named after:** Aisha Al Mudharreb (pioneering UAE businesswoman)  
**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Dubai property market pulse, DLD transaction data, price per sqft trends, absorption rates, off-plan launch pipeline

**Research Queue:**
1. `@Aisha — BRIEF: dubai-market-pulse → weekly DLD transaction summary by area + price trend for top 10 neighborhoods → FEEDS→@Invoice: business_docs/09_crm_features/market-analytics.md#market-data`
2. `@Aisha — RESEARCH: off-plan-launches-2026 → upcoming Dubai off-plan projects, developer reputation, RERA approval status → FEEDS→@Mary: business_docs/09_crm_features/off-plan-projects.md#market-intel`

---

### 75. **@Priya (Legal & Regulatory Intelligence Analyst)**

**Named after:** Priya Patel (symbolic of South Asian legal excellence in UAE)  
**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** RERA 2024/2025 regulatory updates, DLD policy changes, UAE PDPL enforcement notices, AML threshold updates

**Research Queue:**
1. `@Priya — AUDIT: rera-updates-2026 → identify all RERA/DLD regulatory changes from Jan–May 2026 affecting property management CRMs → FEEDS→@Sofia: business_docs/05_requirements/compliance-requirements.md#rera-updates`
2. `@Priya — BRIEF: pdpl-enforcement → UAE Personal Data Protection Law current enforcement status + penalty cases → FEEDS→@Timnit: business_docs/09_crm_features/dld-integration.md#privacy`

---

### 76. **@Sana (Financial Markets Research Analyst)**

**Named after:** Sana Marzouk (UAE financial markets pioneer)  
**Model:** Groq Llama 3.1 70B | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** UAE mortgage rates, EIBOR benchmark, Dubai real estate investment yields vs GCC alternatives, FTA VAT guidance updates

**Research Queue:**
1. `@Sana — BRIEF: uae-mortgage-rates → current rates from 5 UAE banks + eligibility criteria for expat buyers → FEEDS→@Invoice: business_docs/09_crm_features/financial-reporting.md#mortgage-section`
2. `@Sana — RESEARCH: vat-exemptions-2026 → UAE FTA guidance on real estate VAT exemptions + recent clarifications → FEEDS→@Invoice: business_docs/09_crm_features/financial-reporting.md#vat`

---

### 77. **@Yara (UX & Customer Experience Research Analyst)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Luxury real estate buyer journey research, tenant UX benchmarking, mobile-first interaction patterns in MENA

**Research Queue:**
1. `@Yara — RESEARCH: luxury-buyer-journey → benchmark top 5 luxury PropTech UX flows (Compass, Christie's, Knight Frank digital) → FEEDS→@Marissa: business_docs/09_crm_features/luxury-segment.md#ux-benchmarks`
2. `@Yara — BRIEF: tenant-portal-ux → best-practice tenant portal UX patterns + MENA mobile usage stats → FEEDS→@Annie: business_docs/09_crm_features/tenant-portal.md#ux-research`

---

### 78. **@Nadia (Competitive Intelligence & Market Positioning Analyst)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** PropertyFinder, Bayut, Dubizzle, Allsopp & Allsopp CRM features, competitive positioning analysis, gap identification

**Research Queue:**
1. `@Nadia — BENCHMARK: competitor-crm-features → compare White Caves CRM feature set vs PropertyFinder/Bayut/Allsopp CRM feature gaps → FEEDS→@Margaret: plans/MASTER_PLAN.md#competitive-gaps`
2. `@Nadia — BRIEF: market-share-dubai → White Caves addressable market + competitive positioning opportunities → FEEDS→@Cassie: business_docs/09_crm_features/analytics-dashboard.md#competitive`

---

### 79. **@Leila (AI/ML & Emerging Technology Research Analyst)**

**Model:** DeepSeek R1 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** LLM capabilities for real estate use cases, AI lead scoring models, property recommendation algorithms, generative AI for property descriptions

**Research Queue:**
1. `@Leila — RESEARCH: llm-real-estate-use-cases → survey 2025/2026 AI applications in property management CRMs → FEEDS→@Joelle: business_docs/03_ai_assistants/README.md#ai-capabilities`
2. `@Leila — BRIEF: ai-lead-scoring → best practices for ML-based lead scoring in real estate, open-source options → FEEDS→@Cassie: business_docs/09_crm_features/analytics-dashboard.md#ai-signals`

---

### 80. **@Chloe (Security & Threat Intelligence Research Analyst)**

**Model:** Groq Llama 3.3 70B | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** PropTech security incidents, OWASP Top 10 for real estate apps, UAE cybersecurity regulations, API security best practices

**Research Queue:**
1. `@Chloe — AUDIT: proptech-security-incidents-2025 → survey known breaches/vulnerabilities in property management systems → FEEDS→@Katherine: business_docs/05_requirements/compliance-requirements.md#security`
2. `@Chloe — BRIEF: owasp-real-estate → OWASP Top 10 applied specifically to CRM/real-estate applications with mitigation steps → FEEDS→@Radia: business_docs/05_requirements/non-functional-requirements.md#security`

---

### 81. **@Mona (Data Science & Statistical Methods Analyst)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Property AVM (automated valuation model) methodologies, statistical approaches to market prediction, data quality frameworks

**Research Queue:**
1. `@Mona — RESEARCH: avm-methodologies → survey top AVM approaches used in PropTech (hedonic pricing, ML regression, comp-based) → FEEDS→@Fei-Fei: business_docs/09_crm_features/property-valuation.md#avm`
2. `@Mona — BRIEF: data-quality-frameworks → best-practice data validation and quality scoring for property records → FEEDS→@Barbara: business_docs/09_crm_features/analytics-dashboard.md#data-quality`

---

### 82. **@Sara (Integration Ecosystem & API Research Analyst)**

**Model:** Mistral Small (Mistral Le Chat — free) | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** UAE/Dubai property portal API availability, WhatsApp Business API updates, DocuSign/Adobe Sign API changes, Resend email API features

**Research Queue:**
1. `@Sara — BRIEF: portal-api-availability → PropertyFinder and Bayut API integration options + feed formats for property listings → FEEDS→@Mira: business_docs/08_integrations/integration-map.md#portal-feeds`
2. `@Sara — RESEARCH: whatsapp-api-updates-2026 → Meta WhatsApp Business API pricing changes + new template categories in 2026 → FEEDS→@Jaime: business_docs/09_crm_features/whatsapp-integration.md#api-updates`

---

### 83. **@Dalia (Performance, Scalability & Architecture Research Analyst)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Node.js + MongoDB performance patterns, React rendering optimization, CRM load testing benchmarks, edge caching strategies

**Research Queue:**
1. `@Dalia — RESEARCH: crm-performance-benchmarks → typical load profiles for real estate CRMs at 1K, 10K, 100K leads → FEEDS→@Ruchi: business_docs/06_design_architecture/system-architecture.md#performance`
2. `@Dalia — BRIEF: mongodb-optimization → best MongoDB indexing + query patterns for real-estate property search → FEEDS→@Barbara: business_docs/06_design_architecture/system-architecture.md#database`

---

### 84. **@Hana (SEO, Digital Marketing & Growth Research Analyst)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Dubai real estate SEO keyword research, Google algorithm updates affecting property portals, PropTech growth hacking techniques

**Research Queue:**
1. `@Hana — RESEARCH: dubai-real-estate-keywords → top 200 Dubai property search keywords with monthly volume + competition → FEEDS→@Rachel: business_docs/09_crm_features/seo-strategy.md#keywords`
2. `@Hana — BRIEF: google-updates-proptech → recent Google algorithm changes impacting real estate property listing SEO → FEEDS→@Rachel: business_docs/09_crm_features/seo-strategy.md#algorithm-updates`

---

### 85. **@Rana (Mobile UX & Cross-Platform Research Analyst)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** MENA mobile usage statistics, PWA vs native app for real estate, touch interaction patterns, viewport standards

**Research Queue:**
1. `@Rana — BRIEF: mena-mobile-stats → UAE smartphone usage patterns, dominant screen sizes, mobile browsing vs app split → FEEDS→@Tracy: business_docs/06_design_architecture/ui-ux-specification.md#mobile`
2. `@Rana — RESEARCH: pwa-real-estate → PWA adoption in PropTech, capability matrix for White Caves mobile CRM → FEEDS→@Mira: business_docs/06_design_architecture/system-architecture.md#mobile-strategy`

---

### 86. **@Wafa (DevOps, Cloud & Infrastructure Research Analyst)**

**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Vercel vs AWS cost comparison, MongoDB Atlas pricing tiers, CI/CD best practices for React + Express monorepos, Redis usage patterns

**Research Queue:**
1. `@Wafa — BRIEF: vercel-vs-aws-2026 → cost comparison for White Caves projected traffic (10K MAU) + feature comparison → FEEDS→@Gwynne: plans/waves/WAVE_INFRA_OPTIONS.md`
2. `@Wafa — RESEARCH: mongodb-atlas-tiers → Atlas M0/M5/M10 feature limits + upgrade triggers for real estate data volume → FEEDS→@Barbara: business_docs/06_design_architecture/system-architecture.md#database-hosting`

---

### 87. **@Lara (Accessibility, Inclusion & Standards Research Analyst)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** WCAG 2.2 new success criteria, ARIA patterns for real estate search, RTL accessibility for Arabic UI, screen-reader compatibility in CRMs

**Research Queue:**
1. `@Lara — AUDIT: wcag-2.2-new-criteria → identify all new WCAG 2.2 success criteria impacting the White Caves CRM + portal → FEEDS→@Africa: business_docs/05_requirements/non-functional-requirements.md#accessibility`
2. `@Lara — BRIEF: rtl-accessibility → best practices for accessible Arabic RTL interfaces in React + Tailwind → FEEDS→@Hala: business_docs/09_crm_features/tenancy-ejari.md#rtl-notes`

---

### 88. **@Rima (Business Intelligence & Strategic Planning Analyst)**

**Model:** Groq Llama 3.1 70B | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** UAE real estate investment outlook, White Caves growth metrics, OKR framework for PropTech startups, KPI benchmarking

**Research Queue:**
1. `@Rima — BRIEF: uae-realestate-outlook-2026 → 6-month market outlook for Dubai residential + commercial real estate → FEEDS→@Margaret: plans/MASTER_PLAN.md#market-context`
2. `@Rima — SYNTHESIZE: white-caves-kpi-benchmarks → benchmark White Caves KPI targets vs PropTech industry standards → FEEDS→@Cassie: business_docs/09_crm_features/analytics-dashboard.md#kpi-benchmarks`

---

### 89. **@Nour (Product Discovery & User Testing Research Analyst)**

**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** User story mapping, acceptance criteria validation, Dubai property buyer persona research, usability testing scripts

**Research Queue:**
1. `@Nour — RESEARCH: dubai-buyer-personas → research 5 key Dubai property buyer/renter personas with behaviors, pain points, tech usage → FEEDS→@Marissa: business_docs/09_crm_features/luxury-segment.md#personas`
2. `@Nour — BRIEF: acceptance-criteria-gaps → audit all business docs for missing or untestable acceptance criteria → FEEDS→@Margaret: plans/PENDING_TASKS_ONLY.md#gaps`

---

### 90. **@Zara (International Regulations & Multi-Market Compliance Analyst)**

**Model:** Mistral Small (Mistral Le Chat — free) | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** GCC cross-border real estate regulations, UK/EU investor compliance for Dubai property, FATF AML standards, multi-nationality freehold rules

**Research Queue:**
1. `@Zara — RESEARCH: gcc-cross-border-regs → summary of GCC investment regulations affecting Dubai property buyers from Saudi/Kuwait/Bahrain → FEEDS→@Sofia: business_docs/05_requirements/compliance-requirements.md#international`
2. `@Zara — BRIEF: fatf-aml-real-estate → current FATF guidance on AML for real estate transactions + UAE implementation → FEEDS→@Timnit: business_docs/09_crm_features/dld-integration.md#aml`

---

### 91. **@Dana (Emerging Tech & Innovation Scouting Analyst)**

**Model:** DeepSeek R1 | **Token Type:** FREE ONLY  
**Division:** Research Intelligence

**Focus:** Blockchain for title deeds, PropTech AI tools, smart building IoT integration, tokenized real estate, metaverse property

**Research Queue:**
1. `@Dana — RESEARCH: blockchain-title-deeds → current DLD blockchain experiments + readiness assessment for White Caves integration → FEEDS→@Neva: business_docs/09_crm_features/dld-integration.md#blockchain`
2. `@Dana — BRIEF: proptech-ai-tools-2026 → survey of AI tools being adopted by top Dubai property brokers in 2026 → FEEDS→@Joelle: business_docs/03_ai_assistants/README.md#tool-landscape`

---

---

## 🛠️ NEW SPECIALIST DEPUTIES (#92–100)

> 9 new specialist deputies added to strengthen delivery teams. Each acts as deputy lead for their assigned team and owns specific high-value domain within it.

### 92. **@Cyra (Frontend Performance & Web Animation Engineering Specialist)**

**Team:** 1 — Frontend & UX (Deputy Lead)  
**Named after:** Cyra (Persian: "like the sun" — illuminating performance)  
**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Focus:** Core Web Vitals optimization, Framer Motion / CSS animation specs, Lighthouse CI integration, bundle size analysis  
**Queue:** DRAFT frontend performance checklist, EXPAND animation guidelines, AUDIT bundle size rules

---

### 93. **@Petra (Real-time API & GraphQL Architecture Specialist)**

**Team:** 2 — Backend & API (Deputy Lead)  
**Named after:** Petra (Greek: "rock" — solid API foundations)  
**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Focus:** GraphQL schema design, WebSocket / SSE spec, REST → GraphQL migration path, API versioning  
**Queue:** DRAFT real-time API patterns, EXPAND WebSocket spec, REVIEW API versioning rules

---

### 94. **@Kira (Real-time Data Streaming & Pipeline Specialist)**

**Team:** 2 — Backend & API (Member) + Team 3 — Database & Data (cross-team)  
**Named after:** Kira (Persian: "throne" — commanding data flows)  
**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Focus:** Redis streams, Change Data Capture from MongoDB, real-time analytics event pipeline, Kafka exploration  
**Queue:** DRAFT CDC pipeline spec, EXPAND Redis stream patterns, REVIEW event schema

---

### 95. **@Vera (Penetration Testing & Red Team Security Specialist)**

**Team:** 4 — Security & QA (Deputy Lead)  
**Named after:** Vera Rubin (astronomer who proved hidden forces exist — finds hidden vulnerabilities)  
**Model:** Groq Llama 3.3 70B | **Token Type:** FREE ONLY  
**Focus:** API pen testing scripts, OWASP ZAP spec, SQL/NoSQL injection vectors in CRM, JWT attack patterns  
**Queue:** DRAFT pen test checklist, EXPAND injection attack scenarios, REVIEW auth vulnerability matrix

---

### 96. **@Pola (Cloud Cost Optimization & FinOps Specialist)**

**Team:** 5 — DevOps & Infrastructure (Deputy Lead)  
**Named after:** Pola Negri (pioneering performer — optimizing for the spotlight while controlling costs)  
**Model:** Groq Llama 3.1 70B | **Token Type:** FREE ONLY  
**Focus:** Vercel function cold-start optimization, MongoDB Atlas tier planning, Redis memory cost, budget alert thresholds  
**Queue:** DRAFT cloud cost model, EXPAND FinOps alert rules, REVIEW Vercel usage patterns

---

### 97. **@Tara (Tenant Journey & Experience Design Specialist)**

**Team:** 6 — Leasing & Tenancy (Deputy Lead)  
**Named after:** Tara (Sanskrit: "star" — guiding the tenant experience)  
**Model:** Gemini 2.0 Flash | **Token Type:** FREE ONLY  
**Focus:** End-to-end tenant journey mapping, tenant satisfaction KPIs, portal onboarding flow, post-move-in touchpoints  
**Queue:** DRAFT tenant journey map, EXPAND onboarding flow spec, REVIEW satisfaction KPI definitions

---

### 98. **@Neva (Smart Contract & DLD Integration Engineering Specialist)**

**Team:** 7 — Compliance & Legal (Deputy Lead)  
**Named after:** Neva (Spanish: "snows" — clear, immutable like a blockchain record)  
**Model:** Mistral Small (Mistral Le Chat — free) | **Token Type:** FREE ONLY  
**Focus:** DLD blockchain title deed integration (where available), smart escrow contract spec, tokenized property research hookpoints  
**Queue:** DRAFT DLD blockchain integration notes, EXPAND smart escrow spec, AUDIT blockchain readiness

---

### 99. **@Dora (Revenue Analytics, Forecasting & Financial Modeling Specialist)**

**Team:** 8 — Finance & Analytics (Deputy Lead)  
**Named after:** Dora Maar (visionary artist — seeing the numbers that others miss)  
**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Focus:** 3-year revenue forecast model, commission payout optimization, sensitivity analysis, AED/USD scenario planning  
**Queue:** DRAFT 3-year revenue model, EXPAND commission waterfall spec, REVIEW payout sensitivity analysis

---

### 100. **@Mila (CRM Workflow Automation & Process Engineering Specialist)**

**Team:** 9 — Sales & CRM (Deputy Lead)  
**Named after:** Mila (Slavic: "gracious, dear" — making CRM workflows beloved by agents)  
**Model:** DeepSeek V3 | **Token Type:** FREE ONLY  
**Focus:** CRM automation trigger design, Zapier/Make.com workflow equivalent specs, dead-lead recovery automation, agent productivity playbooks  
**Queue:** DRAFT CRM automation trigger library, EXPAND dead-lead recovery workflow, REVIEW agent productivity KPIs

---

> **100 total agents** across 14 organizational units. All planning, research, and documentation agents run in external free tools — zero Copilot premium tokens ever. The pool is divided into **6 parallel teams** for delivery, plus the Research Intelligence Division (Team F) running a separate 30-minute interleaved research cycle. **No agent ever idles** — if backlog is empty, @Margaret assigns a REVIEW task, @Zoe (COO) enforces WIP limits. Run `scripts/free-agents-loop.ps1` to see which agent is active right now.

### 6-Team Parallel Planning Model (V3)

| Team       | Focus Area                          | Members                                                                                                                            | Simultaneous Task Lane                                  |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Team A** | Leasing, Legal, Compliance          | @Victoria, @Sofia, @Timnit, @Hedy, @Amina, @Samira, @Hala, @Rania, @Noor, @Maya                                                   | Tenancy, DLD, compliance, legal docs                    |
| **Team B** | Finance, Data, Analytics            | @Invoice, @Cassie, @Fei-Fei, @Anima, @Mary, @Amal, @Yasmin, @Lina, @Iman                                                          | Finance, market data, KPI, privacy                      |
| **Team C** | Sales, Offers, Workflow             | @Maya, @Booking, @Jaime, @Dina, @Layla, @Maha                                                                                      | Offers, viewings, lead routing, CRM automation          |
| **Team D** | Communications, UX, Design          | @Rachel, @Corinne, @Marissa, @Reem, @Sanaa, @Noura, @Farah                                                                         | WhatsApp, SEO, UX polish, design tokens                 |
| **Team E** | AI, Integrations, Operations        | @Joelle, @Zainab, @Huda, @Salma, @Ghada, @Rehab, @Manal                                                                            | AI personas, integration specs, ops runbooks            |
| **Team F** | Research Intelligence (30-min loop) | @Elena, @Iris, @Aisha, @Priya, @Sana, @Yara, @Nadia, @Leila, @Chloe, @Mona, @Sara, @Dalia, @Hana, @Rana, @Wafa, @Lara, @Rima, @Nour, @Zara, @Dana | Daily preflight briefs, per-task research packets |

**Parallel execution rule:** each delivery team (A–E) may own one active task at a time (WIP limit: 3). Team F runs up to 6 research tasks in parallel.


### ⏰ Hourly Rotation Schedule (V3 — Updated)

> Delivery agents run 60-minute slots. Research agents (R:xx) run 30-minute interleaved slots.

| Slot  | Agent         | Free Tool                                                | Model                   | Domain                                              |
| ----- | ------------- | -------------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| :00   | **@Annie**    | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Tenant portal, document gen, email automation       |
| :05   | **@Rachel**   | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | SEO strategy, marketing, careers                    |
| :10   | **@Marissa**  | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Luxury CRM, community mgmt, UX spec                 |
| :15   | **@Timnit**   | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | DLD integration, legal CRM, data privacy            |
| :20   | **@Hedy**     | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Audit trail, activity feed, follow-up automation    |
| :25   | **@Maya**     | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Off-plan projects, handover management              |
| :30   | **@Booking**  | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Scheduling calendar, viewings                       |
| :35   | **@Jaime**    | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Offers workflow, WhatsApp integration               |
| :40   | **@Fei-Fei**  | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Property valuation, market intelligence             |
| :45   | **@Anima**    | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Currency mgmt, secondary sales, pipelines           |
| :50   | **@Mary**     | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Sentinel property, investment, prospecting          |
| :55   | **@Corinne**  | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | AI chat spec, maintenance, map search               |
| Any   | **@Victoria** | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Tenancy/Ejari, landlord portal, leasing             |
| Any   | **@Invoice**  | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Financial reporting, VAT, revenue model             |
| Any   | **@Sofia**    | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Compliance, RERA/DLD regulations                    |
| Any   | **@Cassie**   | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Analytics dashboard, agent performance              |
| Any   | **@Joelle**   | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | AI personas, integration map, lead scoring          |
| **R:00**  | **@Aisha**    | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Dubai market pulse brief                            |
| **R:05**  | **@Priya**    | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Legal & regulatory intelligence brief               |
| **R:10**  | **@Sana**     | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | Financial markets research brief                    |
| **R:15**  | **@Yara**     | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | UX research packet                                  |
| **R:20**  | **@Nadia**    | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Competitive intelligence brief                      |
| **R:25**  | **@Leila**    | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek R1             | AI/ML trends brief                                  |
| **R:30**  | **@Chloe**    | [Groq Console](https://console.groq.com/)                | Llama 3.3 70B           | Threat intelligence brief                           |
| **R:35**  | **@Mona**     | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Data science methods brief                          |
| **R:40**  | **@Sara**     | [Mistral Le Chat](https://chat.mistral.ai/)              | Mistral Small           | Integration options brief                           |
| **R:45**  | **@Dalia**    | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | Performance & architecture research brief           |
| **R:50**  | **@Hana**     | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | SEO & growth research brief                         |
| **R:55**  | **@Rana**     | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Mobile UX research brief                            |
| **R+:00** | **@Wafa**     | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek V3             | DevOps & cloud infrastructure research brief        |
| **R+:10** | **@Lara**     | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Accessibility & WCAG research brief                 |
| **R+:20** | **@Rima**     | [Groq Console](https://console.groq.com/)                | Llama 3.1 70B           | BI & strategic planning brief                       |
| **R+:30** | **@Nour**     | [Google AI Studio](https://aistudio.google.com/)         | Gemini 2.0 Flash        | Product discovery & user testing research packet    |
| **R+:40** | **@Zara**     | [Mistral Le Chat](https://chat.mistral.ai/)              | Mistral Small           | International regulations & multi-market compliance |
| **R+:50** | **@Dana**     | [DeepSeek Chat](https://chat.deepseek.com/)              | DeepSeek R1             | Emerging tech & innovation scouting brief           |
| **R+:55** | **@Elena**    | [Google AI Studio](https://aistudio.google.com/)         | Gemini 1.5 Flash        | Daily research preflight synthesis for @Margaret    |

---

### 36. **@Annie (Content & Tenant Portal Specialist)**

**Model:** Gemini 2.0 Flash (Google AI Studio — free) | **Slot:** :00 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/tenant-portal.md` — Target: 14 sections
- `business_docs/09_crm_features/document-generation.md` — Target: 10 sections
- `business_docs/09_crm_features/email-automation.md` — Target: 8 sections

**Backlog Queue (run in order):**

1. `@Annie — DRAFT: tenant-portal.md → spec all 6 tabs: TenantLeaseTab (lease details, start/end, monthly rent, status badge), TenantPaymentHistoryTab (payment records table, overdue detection, PDC status), TenantMaintenanceTab (submit request form, status tracking, contractor updates), TenantDocumentsTab (Ejari cert download, tenancy agreement PDF, NOC request button), TenantProfileTab (personal details, Emirates ID, passport expiry alert), TenantPortalHome (KPI tiles: active lease countdown, next payment due amount, open maintenance count). Include: API endpoint for each tab, authFetch pattern, error states, empty states.`
2. `@Annie — DRAFT: document-generation.md → spec PDF generation for: Ejari certificate (RERA-required fields), tenancy agreement (parties, unit, term, rent, PDC schedule, signatures), NOC letter (landlord to tenant for visa/bank), maintenance work order, payment receipt. Include: template engine choice (Puppeteer vs PDFKit), template variables per document type, storage path (uploads/documents/{tenantId}/), download endpoint, e-signature integration hook.`
3. `@Annie — DRAFT: email-automation.md → spec automated email triggers via Resend API: lease expiry reminder (90/60/30 days before expiry date), rent due reminder (3 days before nextPaymentDue), maintenance status update (on status change), welcome email on tenant portal first login, PDC bounce alert to landlord within 1 hour. Include: Resend template IDs, dynamic variables, retry logic (3 attempts, 10min intervals), unsubscribe handling, email delivery tracking in CRM activity log.`

---

### 37. **@Rachel (SEO & Marketing Content Specialist)**

**Model:** Gemini 2.0 Flash (Google AI Studio — free) | **Slot:** :05 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/seo-strategy.md` — Expand to 16 sections
- `business_docs/09_crm_features/marketing-campaigns.md` — Expand to 12 sections
- `business_docs/09_crm_features/careers.md` — Target: 8 sections (new file)

**Backlog Queue (run in order):**

1. `@Rachel — EXPAND: seo-strategy.md → add: Dubai property keyword clusters (buy villa Dubai, rent apartment Downtown, off-plan projects Dubai Marina, 2BR apartment JVC), local SEO setup (Google Business Profile for White Caves LLC, RERA agent profile optimization), Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1 with measurement plan), structured data schemas (RealEstateListing, LocalBusiness, FAQPage JSON-LD examples), Arabic/English multilingual SEO (hreflang tags, Arabic keyword research, RTL meta tags).`
2. `@Rachel — EXPAND: marketing-campaigns.md → add: WhatsApp broadcast campaign builder (audience segmentation by area/budget/lead stage, Meta template approval checklist, 1000 msg/day free tier limit), campaign performance dashboard (delivery rate, open rate, reply rate, conversion to viewing rate), A/B test spec for property listing headline vs description, Meta Pixel + Google Ads conversion tracking setup, lead source attribution model (first-touch vs last-touch vs linear, UTM parameter standards).`
3. `@Rachel — DRAFT: careers.md → careers portal spec: job listing CRUD (title, department, Dubai location, type: full-time/part-time/contract, RERA license required: yes/no), candidate application form (CV upload PDF, cover letter, LinkedIn URL, RERA BRN if applicable), application tracking board (Applied → HR Screening → Interview → Offer → Hired → Rejected), automated acknowledgement email on apply, interview scheduling via /api/viewings pattern, RERA-licensed agent background check checklist.`

---

### 38. **@Marissa (UX & Luxury Segment Specialist)**

**Model:** Gemini 2.0 Flash (Google AI Studio — free) | **Slot:** :10 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/luxury-segment.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/community-management.md` — Target: 8 sections (new file)
- `business_docs/06_design_architecture/ui-ux-specification.md` — Expand to 20 sections

**Backlog Queue (run in order):**

1. `@Marissa — DRAFT: luxury-segment.md → spec KairosLuxuryCRM module: luxury threshold definition (AED 5M+ sale or AED 30K+/month rent, areas: Palm Jumeirah, DIFC, Emirates Hills, Jumeirah Bay), VIP client profile (concierge service tier, private viewing scheduling with NDA requirement, dedicated agent assignment), white-glove workflow (chauffeur option flag, exclusive access booking log, post-viewing gift coordination), luxury listing requirements (professional photography brief: min 30 photos, Matterport 3D tour mandatory, drone footage), HNWI compliance (source of funds declaration, PEP screening, enhanced due diligence checklist per CBUAE AML guidelines).`
2. `@Marissa — DRAFT: community-management.md → spec JunoCommunity module: community announcement board (post/pin/archive, target by building or floor, push notification), facility booking (pool, gym, meeting room: calendar grid, slot duration, approval workflow, cancellation policy), maintenance escalation path (tenant request → building manager → community manager → developer warranty), service charge tracking (quarterly invoice, payment status per unit, arrears escalation), community event calendar (post event, RSVP tracking, capacity limit), community manager KPI dashboard (open requests, average resolution time, resident satisfaction score).`
3. `@Marissa — EXPAND: ui-ux-specification.md → add: mobile breakpoints spec (375px phones, 768px tablets, 1024px small desktop, 1440px full desktop — with layout changes at each), dark mode token map (background: #0A0A0A, surface: #141414, border: #2A2A2A, text-primary: #F5F5F0, gold-accent: #C9A84C, all as CSS custom properties), form validation patterns (inline error below field in red #EF4444, success state green border, loading state spinner in submit button), empty state library (no leads, no properties, no maintenance requests — each with icon + message + primary CTA button), skeleton loader patterns (property card, KPI tile, data table row — using animated gradient).`

---

### 39. **@Timnit (DLD & Legal Compliance Specialist)**

**Model:** Gemini 2.0 Flash (Google AI Studio — free) | **Slot:** :15 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/dld-integration.md` — Target: 12 sections (new file)
- `business_docs/09_crm_features/legal-management.md` — Target: 12 sections (new file)
- `business_docs/05_requirements/compliance-requirements.md` — Co-expand with @Sofia

**Backlog Queue (run in order):**

1. `@Timnit — DRAFT: dld-integration.md → spec DLD API integration: Oqood off-plan registration (required fields: developer ID, project ID, buyer Emirates ID, unit number, sale price AED, SPA date, payment plan type), title deed transfer workflow (application submission, trustee appointment, fee calculation: 4% transfer fee + AED 580 admin + trustee fees), DLD REST API endpoints (POST /oqood/register, GET /titleDeed/{titleDeedNumber}, GET /transactions?propertyId=), error handling for DLD system downtime (queue failed requests, retry with exponential backoff, alert admin), DLD Smart Judge integration for disputes, White Caves as authorized trustee or broker authentication (API key management).`
2. `@Timnit — DRAFT: legal-management.md → spec EvangelineLegalCRM module: contract template library (standard tenancy, luxury tenancy, short-term holiday, commercial lease, MOU for sale, SPA for off-plan — each with variable slots and required fields), addendum generation workflow (rent increase Form 7: 90-day notice required, max % per RERA rental index; early termination: mutual agreement or breach), legal notice workflows (Form 7: rent increase notice, Form 12: eviction notice with grounds, Form 6: non-renewal 90-day notice), e-signature integration (DocuSign or Adobe Sign API: send for signature, webhook on completion, store signed PDF), RERA dispute filing (RDC online portal workflow, required documents checklist, case number tracking).`
3. `@Timnit — EXPAND: compliance-requirements.md → add UAE PDPL section: data subject rights (access request response within 30 days, deletion request process, data portability format: JSON/CSV export), consent management spec (opt-in checkbox spec, consent timestamp storage, withdrawal mechanism, consent audit log table schema), data retention schedule (property records: 3 years, financial records: 5 years, AML records: 7 years — with automated archival cron), breach notification procedure (72-hour notification to UAE TDRA, breach severity classification, internal incident response steps), cross-border transfer rules (approved country list, standard contractual clauses for non-approved countries).`

---

### 40. **@Hedy (Audit & Logic Specialist)**

**Model:** Llama 3.1 70B (Groq Console — free) | **Slot:** :20 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/audit-trail.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/activity-feed.md` — Target: 8 sections (new file)
- `business_docs/09_crm_features/follow-up-automation.md` — Target: 10 sections (new file)

**Backlog Queue (run in order):**

1. `@Hedy — DRAFT: audit-trail.md → spec HenryAuditCRM module: audit log schema (userId, action, entityType: lead/property/lease/user/commission, entityId, oldValue JSON, newValue JSON, ipAddress, userAgent, timestamp — all fields immutable), tracked actions (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT, EXPORT, PERMISSION_CHANGE), write-once enforcement (append-only MongoDB collection with no updateOne/deleteOne allowed), audit search UI (filter by: user, entity type, action, date range — paginated 50 per page), compliance export (CSV + PDF report for RERA inspector — date-stamped, agent-signed), retention (7 years per UAE Commercial Transactions Law), real-time audit stream via WebSocket for admin live monitoring.`
2. `@Hedy — DRAFT: activity-feed.md → spec /api/activities route: activity event types and display text templates (lead_created: "{agent} added lead {leadName}", lease_signed: "{agent} signed lease for {propertyAddress}", payment_received: "Rent payment of AED {amount} received from {tenantName}", maintenance_opened: "{tenant} submitted maintenance request #{ticketId}"), activity card component spec (avatar circle with initials, action sentence, entity deep-link, relative timestamp "2 hours ago", absolute timestamp on hover), personal feed (my activities) vs company feed (all activities — manager/admin only), pagination (infinite scroll, 20 items per load), feed search + filter by activity type, daily activity digest email spec.`
3. `@Hedy — DRAFT: follow-up-automation.md → spec /api/follow-ups route: sequence builder (trigger types: lead_stage_changed, X_days_since_last_contact, lease_expiry_approaching, viewing_completed, offer_rejected; action types: send_whatsapp_template, send_email, create_task, add_crm_note), sequence templates (new_lead_7day_nurture: day 1 WhatsApp intro + property suggestions, day 3 follow-up call task, day 7 email with market report; lease_renewal_90day: 90d/60d/30d/7d reminders), execution engine (Node.js cron every 15 minutes, processes pending follow-up queue), opt-out on any manual agent activity (agent sends message → pause sequence for that lead), effectiveness report (open rate, reply rate, conversion rate per sequence template).`

---

### 41. **@Maya (Off-Plan & Handover Workflow Specialist)**

**Model:** Llama 3.1 70B (Groq Console — free) | **Slot:** :25 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/off-plan-projects.md` — Target: 14 sections (new file)
- `business_docs/09_crm_features/handover-management.md` — Target: 10 sections (new file)

**Backlog Queue (run in order):**

1. `@Maya — DRAFT: off-plan-projects.md → spec AtlasProjectsCRM: project schema (developer, project name, location GeoPoint, launch date, estimated completion, totalUnits, availableUnits, paymentPlanOptions array), unit inventory (unitNumber, floor, type: studio/1BR/2BR/3BR/penthouse, BUA sqft, view, listPrice, status: available/reserved/sold/transferred), buyer reservation workflow (EOI deposit receipt → SPA draft → signing appointment → Oqood DLD registration within 60 days → payment milestone schedule), project milestone tracker (construction % from developer API or manual update, estimated handover countdown, delay flag), ROI projection calculator (inputs: purchase price, expected rent per RERA index, service charge/sqft → outputs: gross yield %, net yield %, payback years).`
2. `@Maya — DRAFT: handover-management.md → spec VestaHandoverCRM: snagging checklist template (categories: walls & ceilings, flooring, doors & windows, plumbing, electrical, HVAC, kitchen appliances, bathroom fittings — each with pass/fail/punch status and photo attachment), snagging report PDF generation (defects list with photos, developer response deadline: 30 days per RERA), handover appointment (buyer + agent + developer rep + optional snagging specialist — linked to /api/viewings slot), punch list tracking (defect → developer assigned → fixed date → re-inspection date → signed off), keys & access issuance log (unit keys, mailbox key, parking remote, access card, gate fob — with serial numbers), DEWA connection tracker (application date, reference number, meter number, activation date), handover completion certificate PDF.`
3. `@Maya — EXPAND: off-plan-projects.md → add payment plan engine: SPA payment schedule table (milestone %, payment date, amount AED, status: paid/pending/overdue, PDC cheque details), escrow compliance section (Law No. 8 of 2007: developer must deposit 100% of collected funds in RERA-approved escrow, release triggers: % completion verified by RERA-approved inspector), cancellation refund table per RERA Article 11 (completed < 5%: 30% penalty; 5-60%: 40% penalty; > 60%: 50% penalty; post-handover: no refund), developer credit rating display (RERA developer ranking A/B/C with last audit date).`

---

### 42. **@Booking (Scheduling & Calendar Specialist)**

**Model:** Llama 3.1 70B (Groq Console — free) | **Slot:** :30 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/scheduling-calendar.md` — Target: 12 sections (new file)
- `business_docs/09_crm_features/viewings.md` — Target: 10 sections (new file)

**Backlog Queue (run in order):**

1. `@Booking — DRAFT: viewings.md → spec /api/viewings route: viewing schema (propertyId, leadId, agentId, scheduledAt, durationMinutes: default 60, status: scheduled/confirmed/completed/cancelled/no_show, type: in-person/virtual, zoomLink if virtual, notes, feedbackRating 1-5, feedbackText), scheduling flow (lead selects slot from agent availability → confirmation WhatsApp message sent → 24h reminder → post-viewing WhatsApp feedback request), conflict detection (agent double-booking check, property already has confirmed viewing at same time), ICS file generation (.ics export with property address as location), bulk open-house slots (one property, multiple concurrent viewing slots), viewing conversion metric (viewings → offers rate per property, tracked in analytics).`
2. `@Booking — DRAFT: scheduling-calendar.md → spec agent calendar: availability config (working hours Mon-Fri 9am-6pm, Sat 10am-4pm, custom blocked dates, UAE public holidays 2026 hardcoded list), appointment types (property_viewing, client_meeting, landlord_meeting, rera_inspection, property_handover, team_meeting), calendar views (day/week/month/agenda — FullCalendar.js or custom), multi-agent overlay (manager/admin can see all agents' calendars in one view, color-coded by agent), Google Calendar sync (OAuth2, 2-way sync: CRM appointment → Google event, Google event → CRM block), Outlook sync (Microsoft Graph API, same 2-way sync), mobile push notification for appointment reminders (30min before via FCM).`
3. `@Booking — EXPAND: viewings.md → add: virtual viewing spec (Zoom/Teams link auto-generated from Zoom API, recording consent checkbox, virtual tour URL attachment from Matterport), viewing preparation checklist (keys retrieved confirmation, agent briefing notes on property, accessibility requirements flag), property access log (key signed out time, returned time, access code used, building security clearance form for non-resident buildings), post-viewing automated workflow (30 min after completion: send property brochure PDF via WhatsApp, create follow-up call task in 48h, update lead stage to Viewed, prompt agent to log verbal feedback).`

---

### 43. **@Jaime (Offers & WhatsApp Integration Specialist)**

**Model:** Llama 3.1 70B (Groq Console — free) | **Slot:** :35 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/offers.md` — Target: 12 sections (new file)
- `business_docs/09_crm_features/whatsapp-integration.md` — Target: 14 sections (new file)

**Backlog Queue (run in order):**

1. `@Jaime — DRAFT: offers.md → spec /api/offers route: offer schema (propertyId, buyerId or tenantId, agentId, offerPrice AED, offerType: purchase/lease, validUntil date, status: pending/countered/accepted/rejected/expired, conditions: mortgageSubject/cashPurchase/furnitureIncluded/subjectToNOC, counterOfferHistory array of {price, date, fromParty, notes}), offer workflow (buyer submits → agent presents to seller/landlord → counter offer round → acceptance → auto-generate MOU or LOI PDF), offer comparison table (multiple offers on same property: side-by-side price, conditions, buyer profile), automated expiry cron (set status=expired when validUntil passed), offer acceptance triggers (generate MOU PDF, WhatsApp notification to all parties, create RERA form task), offer analytics (average offers per property, average negotiation rounds, price achieved vs asking %).`
2. `@Jaime — DRAFT: whatsapp-integration.md → spec Meta WhatsApp Business API: WABA setup checklist (Meta Business Manager verified, phone number not personal, display name = White Caves Real Estate LLC, business category = Real Estate), message template categories and examples (UTILITY: "Your rent payment of AED {{1}} is due on {{2}} for {{3}}", MARKETING: "New {{1}} listed in {{2}} for AED {{3}} — reply DETAILS for more info", AUTHENTICATION: "Your White Caves login code is {{1}}. Valid for 10 minutes."), webhook handler spec (/api/webhooks/meta: verify_token for setup, message_received event handler, read_receipt tracking, delivery_failed retry logic), 24-hour conversation window management (template required outside window, free-form allowed within), opt-in database table (phoneNumber, optedInAt, optedOutAt, optInSource: web/portal/manual).`
3. `@Jaime — EXPAND: whatsapp-integration.md → add: NinaChatbot conversation flows (property enquiry: area → budget → bedrooms → matching properties listed → book viewing link; maintenance: describe issue → photo request → priority auto-classification → ticket number confirmation; payment reminder: amount + due date + payment methods + receipt upload link), human handoff triggers (confidence < 70% on intent detection, user sends "human" / "agent" / "help", no resolution after 3 bot turns → escalate to NadiaWhatsApp human agent queue), broadcast campaign rate limits and pricing tiers (1000 free conversations/month Meta tier, pricing above), WhatsApp Business widget embed spec for tenant/landlord portal pages.`

---

### 44. **@Fei-Fei (Property Valuation & Market Intelligence Specialist)**

**Model:** DeepSeek V3 (DeepSeek Chat — free) | **Slot:** :40 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/property-valuation.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/market-intelligence.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/market-analytics.md` — Target: 10 sections (new file)

**Backlog Queue (run in order):**

1. `@Fei-Fei — DRAFT: property-valuation.md → spec valuation engine in CipherMarketCRM: AVM inputs (location GeoPoint, BUA sqft, bedrooms, bathrooms, floor number, view type, building age, last transaction price from DLD), AVM output (estimated market value AED, confidence score %, comparable transactions used: min 3, value range ±10%), manual valuation override (RERA-certified valuer input, override reason required, manager approval workflow), rental yield calculator (gross: annual rent / purchase price × 100; net: (annual rent - service charges) / purchase price × 100), valuation history per property (date, estimated value, method: AVM/manual, valuer name), bank valuation request workflow (for mortgage pre-approval: RERA Form, bank-specific requirements by bank list), monthly bulk valuation refresh (cron job syncs latest DLD comparable data).`
2. `@Fei-Fei — DRAFT: market-intelligence.md → spec CipherMarketCRM analytics: Dubai area price index table (price per sqft by top 30 neighborhoods, source: DLD quarterly data, updated monthly), transaction volume dashboard (DLD monthly sales data, volume by: property type, area, price band), supply/demand metrics (days on market by area and type, absorption rate = units sold / active listings × 100, new listings vs sold ratio), competitor pricing monitor (compare White Caves portfolio vs PropertyFinder/Bayut average list price per sqft by area — scrape or API), RERA rental index integration (allowed increase % per area, last registered rent vs index → flag if increase violates cap), automated monthly market report PDF (charts: price trend 12 months, top areas by yield, volume heatmap), price drop alert (> 5% in followed area → notify relevant leads and agents).`
3. `@Fei-Fei — DRAFT: market-analytics.md → spec analytics dashboard for market data: KPI tiles (average sale price AED this month vs last month % change, total transaction volume, average days on market, price per sqft by top area), chart library (Recharts: line chart price trend 12 months, bar chart transactions by property type, scatter plot price vs sqft), Dubai area heatmap (Leaflet.js choropleth: color intensity = price per sqft, click → area drill-down panel), data refresh schedule (DLD data: monthly cron, internal transactions: real-time), export options (CSV raw data, Excel with formatted tables, PDF visual report with company branding), scheduled email digest to MD + board members (every Monday 8am, last 7 days summary).`

---

### 45. **@Anima (Data Pipeline & Secondary Sales Specialist)**

**Model:** DeepSeek V3 (DeepSeek Chat — free) | **Slot:** :45 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/currency-management.md` — Target: 8 sections (new file)
- `business_docs/09_crm_features/secondary-sales.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/analytics-dashboard.md` — Co-expand with @Cassie

**Backlog Queue (run in order):**

1. `@Anima — DRAFT: secondary-sales.md → spec /api/secondary-sales route and SecondarySalesAgent module: transaction workflow (seller instruction letter → property appraisal booking → listing activation → offer management → MOU signing → bank/cash buyer path split → NOC from developer within 20 days → DLD transfer appointment → commission disbursement to agent and company), dual-agency disclosure (RERA prohibition on undisclosed dual representation: Form A signed by seller, Form B signed by buyer, Form I if dual agent), secondary vs primary distinction (property.transactionType: primary/secondary field — affects DLD fee calculation and required forms), DLD transfer fee breakdown (4% of sale price split buyer/seller, trustee fees AED 4000-10000, DLD admin AED 580), secondary market KPIs (avg days listing to sold, price achieved vs original asking %, commission per deal average AED).`
2. `@Anima — DRAFT: currency-management.md → spec /api/currency route: supported currency list (AED base, USD, GBP, EUR, INR, PKR, SAR, QAR — with ISO codes and symbols), live rate source (ExchangeRate-API free tier — 1500 requests/month, fallback: Open Exchange Rates free tier), cache strategy (in-memory Map with 4-hour TTL, stale-while-revalidate on cache miss, Redis optional for multi-instance), property listing display (AED primary, 2 secondary currencies selectable in user preference), financial report currency column (all calculations in AED, optional display column in user-preferred currency), historical rate table (store daily closing rates in MongoDB currency_rates collection — needed for backdated commission calculations and financial report accuracy).`
3. `@Anima — EXPAND: analytics-dashboard.md → add data pipeline architecture: event collection layer (user actions tracked: page view, lead created, property viewed, search performed → stored in analytics_events collection with userId, sessionId, eventType, entityId, timestamp), nightly aggregation cron (calculates daily_stats: new leads, new properties, leases signed, revenue — stored in analytics_snapshots for fast dashboard queries), real-time counters (Redis INCR for today's leads, active viewings, open maintenance — displayed in live dashboard tiles), bulk data export pipeline (async job: POST /api/analytics/export → returns jobId, GET /api/analytics/export/:jobId → status/download URL, max 50,000 rows, email link on completion), data quality rules (lead deduplication on phone+email, property deduplication on titleDeed number, duplicate warning before save).`

---

### 46. **@Mary (Inventory & Investment Specialist)**

**Model:** DeepSeek V3 (DeepSeek Chat — free) | **Slot:** :50 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/sentinel-property.md` — Target: 12 sections (new file)
- `business_docs/09_crm_features/investment-management.md` — Target: 10 sections (new file)
- `business_docs/09_crm_features/prospecting-outbound.md` — Target: 10 sections (new file)

**Backlog Queue (run in order):**

1. `@Mary — DRAFT: sentinel-property.md → spec SentinelPropertyCRM module: property lifecycle state machine (Draft → Pending Review → Listed → Under Offer → Reserved → Sold/Leased → Withdrawn → Re-listed — with allowed transitions and required fields per state), RERA mandatory fields before listing (permit number, DED approval for off-plan, NOC from developer if applicable, title deed number for resale, floor plan uploaded), property quality score algorithm (photos count ×10pts, description > 100 words ×15pts, floor plan ×20pts, virtual tour ×25pts, 360 video ×30pts — max 100pts, score drives portal ranking), duplicate detection (same community + building + unit number = duplicate warning, override with reason), bulk CSV import spec (column mapping: propertyType, area, community, building, unit, bedrooms, bathrooms, BUA, price, agentId — validation rules, error report with row numbers).`
2. `@Mary — DRAFT: investment-management.md → spec MavenInvestmentCRM module: investor profile fields (riskAppetite: conservative/moderate/aggressive, investmentHorizon: 1-3/3-7/7+ years, preferredAreas array, minBudget AED, maxBudget AED, citizenshipCountry for freehold eligibility check per Dubai area), portfolio dashboard (all owned properties: current market value from AVM, total invested, unrealized gain/loss AED and %, gross rental yield, net rental yield after service charges), investment analysis tools (ROI calculator, mortgage vs cash comparison with bank rate inputs, area yield comparison table), investor quarterly report PDF (portfolio performance vs Dubai residential price index, income vs expenses, tenant occupancy rate), deal flow pipeline (Opportunity → Due Diligence → LOI Signed → Funds Transfer → DLD Transfer → Portfolio — with deal value AED and probability %), investment committee workflow for deals > AED 5M (committee members, approval threshold, meeting minutes attachment).`
3. `@Mary — DRAFT: prospecting-outbound.md → spec HunterProspectingCRM module: prospect database fields (name, phone, area owned, building, unit number, source: DLD_ownership/expired_listing/referral/cold_call_list/social_media, assignedAgent, lastContactDate, status: new/contacted/interested/not_interested/callback_requested/DNC), prospecting campaign workflow (target list creation → agent territory assignment by area/building → call script display in CRM → outcome logging), call tracking (click-to-call link opens phone dialer with pre-filled number, call duration log, recording URL if VoIP integration, outcome tag: answered/voicemail/no_answer), prospecting KPIs (calls per agent per day, connect rate %, interest rate %, pipeline value generated AED per agent), post-call automation (unanswered → schedule WhatsApp fallback in 4 hours), do-not-contact registry (DNC flag, date added, reason — DNC agents cannot be assigned to prospecting).`

---

### 47. **@Corinne (Maps, AI Chat & Maintenance Specialist)**

**Model:** DeepSeek V3 (DeepSeek Chat — free) | **Slot:** :55 | **Token Type:** FREE ONLY
**Folder Ownership:**

- `business_docs/09_crm_features/ai-chat.md` — Target: 12 sections (new file)
- `business_docs/09_crm_features/maintenance.md` — Target: 10 sections (new file)
- `business_docs/06_design_architecture/system-architecture.md` — Expand map search section

**Backlog Queue (run in order):**

1. `@Corinne — DRAFT: maintenance.md → spec /api/maintenance route: schema (propertyId, tenantId, landlordId, agentId, category: plumbing/electrical/HVAC/structural/appliance/pest/other, priority: emergency/high/medium/low, description, photos array max 5, status: open/assigned/scheduled/in_progress/completed/cancelled, assignedContractorId, scheduledAt, resolvedAt, resolutionNotes, tenantRating 1-5, invoiceAmount AED, invoiceApproved: boolean), tenant submission channels (portal form or WhatsApp bot → auto-priority: "water leak" = emergency, "broken AC" = high, "light bulb" = low), contractor assignment (approved contractor list by category, availability calendar, work order PDF generation), SLA breach alerting (emergency: 4h, high: 24h, medium: 72h, low: 7 days — alert landlord + manager on breach), landlord cost approval (repairs > AED 500 require landlord WhatsApp approval before contractor proceeds), completion invoice attachment, tenant rating prompt after resolution.`
2. `@Corinne — DRAFT: ai-chat.md → spec /api/ai-chat route: request schema (POST /api/ai-chat: {assistantId, messages: ChatMessage[], context?: {leadId?, propertyId?, tenantId?}, userId}), context injection spec (for each contextType: inject relevant entity data as system message prefix — property details for property page chat, lead history for lead page chat), streaming response (SSE endpoint: GET /api/ai-chat/stream/:sessionId → token-by-token streaming to frontend via EventSource), conversation persistence (last 20 messages per sessionId stored in MongoDB ai_conversations collection, 30-day TTL index), token budget per assistant role (standard assistants: 1000 tokens/request, executive assistants: 2000 tokens/request, daily usage cap per assistantId), API provider abstraction layer (swap OpenAI ↔ Anthropic ↔ Groq via PROVIDER env var), fallback chain (primary fails → secondary provider → canned response + Slack alert to @Katherine).`
3. `@Corinne — EXPAND: system-architecture.md → add interactive map search section: frontend map component (Leaflet.js v1.9 + leaflet.markercluster plugin, property pin custom marker with price label, cluster bubble showing count, property card popup on pin click with photo/price/beds/link), geospatial backend query design (MongoDB 2dsphere index on property.location field: {type: "Point", coordinates: [lng, lat]}, $near query for radius search, $geoWithin for polygon neighborhood boundary search), Dubai area boundary GeoJSON (30 neighborhood polygons stored in public/geojson/dubai-areas.geojson — source: OpenStreetMap Overpass API export), map tile provider decision (OpenStreetMap free vs Mapbox $0.50/1000 tiles — use OSM for dev, Mapbox for production with usage cap), performance guard (max 500 visible pins via viewport bounding box filter, cluster above 50 pins in viewport, virtualized sidebar list synced with map viewport), saved map search (save current viewport bbox + active filters as named search, enable push alert for new listings in that area).`

---

## 🔗 CROSS-AGENT COLLABORATION MESH (100 Agents — Mandatory)

> Every agent output must include both tags (CONSUMES and FEEDS). Research agents additionally require a FEEDS_ACK from their target delivery team.
>
> - `CONSUMES←@Agent: file/path.md#section`
> - `FEEDS→@Agent: file/path.md#section`
> - `FEEDS_ACK←@TargetAgent: accepted|revise + file#section`

### Research Division → Delivery Feeds (20 Research Analysts)

| Research Agent | FEEDS→ Target | Purpose |
| -------------- | ------------- | ------- |
| @Elena | @Margaret, @Ada | Daily preflight synthesis |
| @Iris | @Grace, @Ada | Tech trends → architecture decisions |
| @Aisha | @Invoice, @Mary | Dubai market data → finance + inventory |
| @Priya | @Sofia, @Victoria | Legal intel → compliance + leasing |
| @Sana | @Invoice, @Cassie | Financial markets → analytics |
| @Yara | @Una, @Annie | UX research → frontend + tenant portal |
| @Nadia | @Margaret, @Cassie | Competitive intel → planning + KPIs |
| @Leila | @Joelle, @Barbara | AI/ML → personas + data |
| @Chloe | @Katherine, @Radia | Threats → QA + security |
| @Mona | @Cassie, @Barbara | Data science → analytics + database |
| @Sara | @Mira, @Zainab | Integrations → backend API + integration docs |
| @Dalia | @Ruchi, @Gwynne | Performance → systems + DevOps |
| @Hana | @Rachel, @Reem | SEO → marketing + metadata |
| @Rana | @Tracy, @Marissa | Mobile UX → responsive + luxury UX |
| @Wafa | @Gwynne, @Lisa | DevOps research → deployment + cloud |
| @Lara | @Africa, @Sanaa | Accessibility standards → components + WCAG |
| @Rima | @Margaret, @Ghada | BI → planning + executive reports |
| @Nour | @Ada, @Margaret | Product discovery → architecture + strategy |
| @Zara | @Sofia, @Timnit | Multi-market compliance → legal + DLD |
| @Dana | @Ada, @Joelle | Emerging tech → architecture + AI |

### Core Delivery Collaboration Chains

| Agent     | Inputs From (CONSUMES) | Outputs To (FEEDS) | Primary Collaboration Purpose                         |
| --------- | ---------------------- | ------------------ | ----------------------------------------------------- |
| @Sofia    | @Timnit, @Hedy         | @Timnit, @Victoria | Compliance baseline for legal/tenancy execution       |
| @Timnit   | @Sofia, @Joelle        | @Victoria, @Annie  | DLD/legal workflows feeding contract + tenant docs    |
| @Victoria | @Sofia, @Timnit        | @Annie, @Booking   | Tenancy legal rules feeding portal + scheduling       |
| @Annie    | @Victoria, @Timnit     | @Marissa, @Joelle  | Tenant portal/docs feeding UX + AI fallback prompts   |
| @Fei-Fei  | @Mary, @Anima          | @Anima, @Invoice   | Valuation + market data feeding finance and sales     |
| @Anima    | @Fei-Fei, @Cassie      | @Mary, @Invoice    | Data pipelines + secondary sales to finance/inventory |
| @Mary     | @Anima, @Fei-Fei       | @Invoice, @Cassie  | Inventory/prospecting data to revenue + KPI analytics |
| @Invoice  | @Mary, @Anima          | @Cassie, @Joelle   | Financial model outputs to KPI and AI ranking rules   |
| @Booking  | @Victoria, @Jaime      | @Maya, @Hedy       | Scheduling signals to handover + activity automation  |
| @Maya     | @Booking, @Timnit      | @Hedy, @Cassie     | Off-plan/handover workflow to audit + analytics       |
| @Hedy     | @Maya, @Booking        | @Cassie, @Sofia    | Audit/follow-up controls feeding KPI + compliance     |
| @Cassie   | @Hedy, @Invoice        | @Joelle, @Margaret | KPI synthesis feeding AI and planning decisions       |
| @Jaime    | @Rachel, @Corinne      | @Corinne, @Booking | WhatsApp/offers orchestration feeding AI + schedule   |
| @Corinne  | @Jaime, @Annie         | @Jaime, @Rachel    | AI chat/maintenance insights to comms + SEO           |
| @Marissa  | @Annie, @Booking       | @Rachel, @Joelle   | UX specs feeding SEO messaging + AI behaviors         |
| @Rachel   | @Marissa, @Corinne     | @Jaime, @Joelle    | SEO/marketing context feeding comms + AI prompts      |
| @Joelle   | @Cassie, @Rachel       | @Timnit, @Margaret | AI persona/fallback synthesis to legal/policy plans   |

### Governance Handoff Chain

`Research Division (20 analysts) → @Elena (daily synthesis) → @Margaret (2-minute sprint context) → @Ada (60% readiness gate) → Senior Coders/Designers`

### Collaboration Cadence

- Every 4 hours: mini-sync updates in FEEDS/CONSUMES format
- Every day at noon: @Margaret merges all handoffs into sprint context
- Before any coding: @Ada validates readiness >=60% gate is complete

### Per-Agent Handoff Contracts (Execution Required)

| Agent     | Must start with CONSUMES                                                                      | Must end with FEEDS                                                                           |
| --------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| @Sofia    | `CONSUMES←@Hedy: business_docs/09_crm_features/audit-trail.md#compliance-events`              | `FEEDS→@Timnit: business_docs/05_requirements/compliance-requirements.md#regulatory-rules`    |
| @Timnit   | `CONSUMES←@Sofia: business_docs/05_requirements/compliance-requirements.md#regulatory-rules`  | `FEEDS→@Victoria: business_docs/09_crm_features/legal-management.md#contract-clauses`         |
| @Victoria | `CONSUMES←@Timnit: business_docs/09_crm_features/legal-management.md#contract-clauses`        | `FEEDS→@Annie: business_docs/09_crm_features/tenancy-ejari.md#tenant-obligations`             |
| @Annie    | `CONSUMES←@Victoria: business_docs/09_crm_features/tenancy-ejari.md#tenant-obligations`       | `FEEDS→@Marissa: business_docs/09_crm_features/tenant-portal.md#ux-requirements`              |
| @Fei-Fei  | `CONSUMES←@Mary: business_docs/09_crm_features/sentinel-property.md#inventory-signals`        | `FEEDS→@Anima: business_docs/09_crm_features/property-valuation.md#valuation-metrics`         |
| @Anima    | `CONSUMES←@Fei-Fei: business_docs/09_crm_features/property-valuation.md#valuation-metrics`    | `FEEDS→@Mary: business_docs/09_crm_features/secondary-sales.md#pipeline-rules`                |
| @Mary     | `CONSUMES←@Anima: business_docs/09_crm_features/secondary-sales.md#pipeline-rules`            | `FEEDS→@Invoice: business_docs/09_crm_features/sentinel-property.md#inventory-finance-bridge` |
| @Invoice  | `CONSUMES←@Mary: business_docs/09_crm_features/sentinel-property.md#inventory-finance-bridge` | `FEEDS→@Cassie: business_docs/07_business_model/revenue-model.md#kpi-definitions`             |
| @Booking  | `CONSUMES←@Victoria: business_docs/09_crm_features/tenancy-ejari.md#scheduling-constraints`   | `FEEDS→@Maya: business_docs/09_crm_features/viewings.md#handover-triggers`                    |
| @Maya     | `CONSUMES←@Booking: business_docs/09_crm_features/viewings.md#handover-triggers`              | `FEEDS→@Hedy: business_docs/09_crm_features/handover-management.md#audit-events`              |
| @Hedy     | `CONSUMES←@Maya: business_docs/09_crm_features/handover-management.md#audit-events`           | `FEEDS→@Cassie: business_docs/09_crm_features/audit-trail.md#kpi-events`                      |
| @Cassie   | `CONSUMES←@Hedy: business_docs/09_crm_features/audit-trail.md#kpi-events`                     | `FEEDS→@Joelle: business_docs/09_crm_features/analytics-dashboard.md#ai-signals`              |
| @Jaime    | `CONSUMES←@Rachel: business_docs/09_crm_features/seo-strategy.md#campaign-intents`            | `FEEDS→@Corinne: business_docs/09_crm_features/whatsapp-integration.md#ai-routing`            |
| @Corinne  | `CONSUMES←@Jaime: business_docs/09_crm_features/whatsapp-integration.md#ai-routing`           | `FEEDS→@Rachel: business_docs/09_crm_features/ai-chat.md#search-intent-signals`               |
| @Marissa  | `CONSUMES←@Annie: business_docs/09_crm_features/tenant-portal.md#ux-requirements`             | `FEEDS→@Rachel: business_docs/06_design_architecture/ui-ux-specification.md#seo-ux-copy`      |
| @Rachel   | `CONSUMES←@Marissa: business_docs/06_design_architecture/ui-ux-specification.md#seo-ux-copy`  | `FEEDS→@Joelle: business_docs/09_crm_features/seo-strategy.md#persona-intents`                |
| @Joelle   | `CONSUMES←@Cassie: business_docs/09_crm_features/analytics-dashboard.md#ai-signals`           | `FEEDS→@Margaret: business_docs/03_ai_assistants/README.md#phase-context-summary`             |

> Contract validation: tasks are considered incomplete unless both handoff lines are present and verifiable.

## TEAM OPERATIONAL RULES (V3 — 100 Agents)

- **No Permissions Needed:** Agents make technical decisions based on their expertise.
- **Autonomous Fixes:** If terminal shows an error, **@Katherine** and **@Gwynne** fix it immediately.
- **Synergy:** Use `@workspace` to ensure all 100 roles share the same project context.
- **Free Agent Policy (STRICT — all 97 non-premium agents):** All agents #31-100 (free planning and research pool) use ONLY free models. Zero exceptions. Approved providers: Google AI Studio (Gemini 2.0 Flash / 1.5 Flash), Groq Console (Llama 3.1 70B / 3.3 70B / Llama 4 Scout), DeepSeek Chat (V3 / R1), Mistral Le Chat (Mistral Small), HuggingFace / Together.ai (Qwen2.5 72B). See `plans/AGENT_SKILLS_UPGRADE_V3.md` for full model matrix.
- **No-Idle Rule:** Every free agent always has a task. If backlog is empty → @Margaret assigns a REVIEW task within 24 hours. @Zoe (COO) enforces this rule.
- **Research Preflight Mandatory:** Before any premium coding day, @Elena publishes a daily research preflight brief. No preflight = no premium coding.
- **Synergy:** Use `@workspace` to ensure all 47 roles share the same project context.
- **Free Agent Policy (STRICT — 29 agents):** Core 17 free planners + V3 implementation-spec writers (@Cron, @Puppeteer, @Handlebars, @Socket, @Cloudinary, @Pannellum, @Zod, @LeadScore, @Mortgage, @Redis, @PWA, @S5) use ONLY free models. Zero exceptions. See copilot-instructions.md Rule 4 + Rule 9 for full policy.
- **No-Idle Rule:** Every free agent always has a task. If backlog is empty → @Margaret assigns a REVIEW task within 24 hours.
- **Coding Gate:** No senior coding agent begins a feature without passing the Context Enrichment Gate (copilot-instructions.md Rule 5). Free agents must complete their docs first.
- **WIP Limits (Enforced by @Zoe):** 3 active tasks per delivery team | 6 active tasks for Research Division | 2 per Executive Council member.
- **Loop Script:** Run `scripts/free-agents-loop.ps1` at any time to see which agent is active right now and get the exact copy-paste prompt.
- **Background Mode (MVP):** Start free-agent planning workers in background with `npm run orchestrator:bg:start` and stop with `npm run orchestrator:bg:stop`.
- **Execution Mode Default (Approval):** After each completed task, stop and ask for confirmation before advancing to the next task.
- **Autopilot Mode (Continuous):** When explicitly enabled, execution continues automatically across tasks without repeated "go" prompts; stop only on hard blockers (tests/lint/build/policy/security/credentials).
- **Mode Commands:**
  - Approval mode: `npm run orchestrator:agent-loop:approval`
  - Autopilot mode: `npm run orchestrator:agent-loop:autopilot` (or `npm run orchestrator:agent-loop:auto` / `:auto:nobrowser`)
- **Policy Source of Truth:** Gate thresholds + approval phrase are read from `scripts/orchestrator/policy.json` (no hardcoded legacy thresholds).
- **Post-Premium QA Watchdog (Mandatory):** **@Katherine** owns runtime verification after each big premium wave commit via `node scripts/orchestrator/post-commit-premium-guard.js`.
- **Big Premium Commit Trigger:** Runtime watchdog checks execute only when commit contains `[premium-wave]` and qualifies as a big diff (threshold/critical paths).
- **SLA Escalation (Enforced by @Zoe):** P0 → immediate to @Ada + @Zoe | P1 → ≤30 min to @Margaret + team lead | P2 → ≤4 hours to team lead + @Rehab.

## 🤖 AUTOPILOT MODE V3 — CODING EXECUTION RULES (Effective 2026-05-24)

**Definition:** after `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` is issued for a wave, coding agents execute all tasks in that wave's `IMPLEMENTATION_BACKLOG.md` sequentially without waiting for per-task human confirmation.

### Stop Conditions (only)

1. Hard build failure (`npm run build` non-zero)
2. TypeScript failure after change (`npm run typecheck` non-zero)
3. Security policy violation risk (credentials, injection, XSS/CSRF)
4. Explicit human `PAUSE` instruction

### Autopilot Task Loop

1. Read wave `IMPLEMENTATION_BACKLOG.md` and execute in declared order.
2. Run task-level validation command immediately after each task.
3. On failure, self-correct up to **2 retries**.
4. If still failing, mark task `BLOCKED` and escalate to `@Ada` + `@Katherine` with blocker payload.
5. After wave completion, run `npm run quality:quick` then `npm run plans:validate`.
6. Push one consolidated completion update via `report_progress`.

### Triggers

- `npm run orchestrator:agent-loop:autopilot`
- `npm run orchestrator:agent-loop:auto`
- `npm run orchestrator:agent-loop:auto:nobrowser`
- Explicit phrase: `@Wave[N] — AUTOPILOT: execute all tasks`

### Prohibited in Autopilot (must pause for approval)

- Any destructive DB operation (`DROP`, destructive migration, irreversible delete)
- Production secret/env rewrites
- New dependency not already listed in the approved wave backlog

---

## 🚀 GOVERNANCE UPGRADE V2 — LARGE WAVE EXECUTION MODE

1. **60% Readiness Enforcement (Fast-Track Mode):**
   - All prerequisite docs must demonstrate 60% readiness with key evidence before premium coding.
   - Readiness = business rules + API contract + data schema + 1+ test scenario.
   - Deep documentation is encouraged but not a blocker for low-risk modules.

2. **Mandatory Artifact Bundle (Before Premium):**
   - Required for each coding wave under `plans/waves/`:
     - `WAVE_##_SDD.md`
     - `WAVE_##_FLOWCHARTS.md`
     - `WAVE_##_READINESS_PACKET.md`
     - `WAVE_##_IMPLEMENTATION_BACKLOG.md`
     - `WAVE_##_TEST_ROLLOUT.md`

3. **Collaboration Contract Upgrade (FEEDS_ACK required):**
   - Existing required tags stay mandatory:
     - `CONSUMES←@Agent: file#section`
     - `FEEDS→@Agent: file#section`
   - New mandatory acceptance tag:
     - `FEEDS_ACK←@DownstreamAgent: accepted|revise + file#section`
   - A task is incomplete until FEEDS_ACK is present.

4. **Daily Premium Quota Enforcement:**
   - Daily cap must be derived and logged from weekly remaining quota.
   - Premium work stops when daily cap is reached unless @Ada grants emergency exception.

5. **Large-Wave Premium Coding Standard:**
   - Premium coding executes in **3–6 module macro/huge-wave bundles** when dependencies are clear.
   - Each macro/huge-wave must include internal validation checkpoints after each module group.

6. **Researcher Preflight Requirement:**
   - Before any premium coding day, researcher chain must publish context preflight:
     - current docs/plans readiness,
     - dependency graph,
     - risk log,
     - day quota plan.
   - No preflight = no premium coding.

## ⚡ SUBAGENT EXECUTION UPGRADE — WORK BETTER MODE (Effective 2026-05-17)

## 🚀 PHASE 27 ADDENDUM — NEXT-LEVEL SUBAGENT OPERATIONS (Effective 2026-05-18)

1. **Dual-threshold readiness model (mandatory):**
   - `60%` remains the coding unlock floor with the exact @Ada approval phrase.
   - `90%` is the execution target before large premium waves.

2. **Model routing (strict):**
   - Planning and research tasks remain **free-model-only** (Gemini 2.0 Flash / Llama 3.1 70B Groq / DeepSeek V3).
   - Premium requests are reserved for **senior coding/design agents only**.

3. **Full-team collaboration enforcement:**
   - A task is only complete when `CONSUMES`, `FEEDS`, and `FEEDS_ACK` are all present and verifiable.

4. **Daily reliability pass (required):**
   - `npm run orchestrator:verify-prompts`
   - `npm run orchestrator:health:brief`
   - `npm run orchestrator:next-agent:all`
   - `npm run orchestrator:blockers:brief`

### A) Mandatory Dispatch Packet (all subagents)

Every task assignment must include:

- `Task ID`
- `Owner`
- `Objective`
- `Input Artifact(s)` (exact file + section)
- `Output Artifact` (exact file + section)
- `Acceptance Criteria` (minimum 3 measurable checks)
- `Handoff` (`FEEDS→...` + expected `FEEDS_ACK`)

Assignments missing fields are invalid and must not run.

### B) Fast Reliability Loop

- Run `npm run orchestrator:verify-prompts` before first dispatch.
- Run `npm run orchestrator:health:brief` every session handoff window.
- Use `npm run orchestrator:next-agent:all` to prevent idle slots.
- Use `npm run orchestrator:blockers:brief` on any stalled queue.

### C) Completion Rule (Planning Outputs)

A planning task is not done until:

- output is placed in the declared target section,
- `CONSUMES`, `FEEDS`, and `FEEDS_ACK` are all present,
- acceptance criteria are testable and explicit,
- status is synced into `AGENTS.md`, `PROJECT_PROGRESS.md`, and `DAILY_MILESTONE_TRACKER.md`.

### D) Escalation SLA

- `P0`: immediate escalation to @Ada + @Margaret
- `P1`: escalate within 30 minutes
- `P2`: escalate within 4 hours

Escalation payload must include impacted files, dependency owner, and next action.

## Multi-Agent Execution Model v2

### Callable vs named agents

The 100 named personas in this file are the **ownership model**. The directly callable execution agents in this environment are the orchestration and delivery agents such as **Architect, Planner, Explore, Coder, Database, Designer, Security, SEO, DevOps, QA, and guardian**.

### Squad model (V3)

| Squad                           | Ownership labels                          | Primary callable agents               | Mission                                            |
| ------------------------------- | ----------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| Squad A — Planning/Coordination | @Ada, @Margaret, @Grace, @Elena, @Zoe     | Architect, Planner, Explore, guardian | define scope, dependencies, truth maintenance      |
| Squad B — Frontend Delivery     | @Una, @Cyra, @Lea, @Tracy, @Africa        | Designer, SEO, Coder, QA              | homepage and public UX delivery                    |
| Squad C — Backend/Data Delivery | @Mira, @Petra, @Barbara, @Ruchi, @Daniela | Coder, Database, Security             | APIs, data, auth, business logic                   |
| Squad D — QA/Security           | @Katherine, @Vera, @Radia, @Ecem, @Joy    | QA, Security, guardian                | verification, risk review, release gates           |
| Squad E — Release/Ops           | @Gwynne, @Pola, @Lila, @Rachel, @Lisa     | DevOps, SEO, guardian                 | CI, deploy, runtime, discoverability               |
| Squad F — Research Intelligence | @Elena, @Iris, @Aisha–@Dana (#74–91)      | Explore, research                     | market research, preflight briefs, intelligence    |

### Handoff protocol

Every task handoff must include:

- task ID
- files affected
- dependencies
- acceptance criteria
- validation steps
- blocker status

### Shared status model

- Planned
- Ready
- In Progress
- Code Complete
- In Verification
- Verified
- Blocked
- Shipped

### Proof requirements

A task is not complete until it has:

- evidence of the implementation or documentation change
- required tests/build results for the scope
- a verifier that is different from the implementer
- tracker updates in the live sprint and progress documents

### Execution rules

- Do not assign multiple coding agents to the same file at the same time.
- Work in vertical slices instead of broad scattered edits.
- Escalate P0 blockers to @Ada immediately.
- No milestone changes the project percentage until independent verification is recorded.

## Working Agreement for This Repository

- Treat this role model as an execution mindset for planning, implementation, review, testing, security, and deployment.
- Prioritize production-safe decisions, automated validation, and clear delivery checkpoints.
- Default to autonomous execution unless blocked by missing credentials, external approvals, or irreversible-risk operations.

## 🔧 Subagent Upgrade Baseline (V3 — May 2026)

- **Canonical Policy:** `plans/CUSTOM_AGENTS_PLAN.md` + `plans/AGENT_SKILLS_UPGRADE_V3.md`
- **Premium Coding Gate Phrase (Exact):** `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
- **Research Preflight Phrase (Exact):** `@Elena — Research Preflight Ready — [DATE] — Approved for Premium Coding`
- **Invocation Protocol (Exact):** `@[AgentName] — [ACTION]: [TARGET FILE or TOPIC]`
- **Allowed Actions:** `EXPAND`, `DRAFT`, `REVIEW`, `AUDIT`, `SYNC`, `RESEARCH`, `BRIEF`, `SYNTHESIZE`, `BENCHMARK`
- **Total Agents:** 100 (Executive Council: 5 | Research Division: 20 | Delivery Teams: 75)
- **Free Model Providers:** Google AI Studio, Groq Console, DeepSeek Chat, Mistral Le Chat, HuggingFace / Together.ai

## Branch & Deployment Protocol

- Start every implementation session on the local `develop` branch.
- If the workspace is on `development`, create or switch to `develop` from `origin/development` before making changes.
- Keep `main` reserved for verified release merges only.
- Before any merge to `main`, record the exact change set and build health in `PHASE_DEPLOYMENT_LOG.md`.
- Use the verified sequence: build -> local runtime check -> merge -> conflict resolution -> push.
