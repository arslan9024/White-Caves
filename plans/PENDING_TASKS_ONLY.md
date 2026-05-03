# Pending Tasks Only

## 🆓 FREE AGENT QUEUE — Run These in Free Tools Before Next Coding Session

> Copy-paste the prompt below into the linked free tool. Paste the output back into the file and commit. This feeds the Context Enrichment Gate so senior coders can proceed.

| Agent | Free Tool | Prompt to Run | Target File | Gate |
|-------|-----------|--------------|-------------|------|
| **@Invoice** | [Groq Console → Llama 3.1 70B](https://console.groq.com/) | `@Invoice — AUDIT: financial-reporting.md → verify 11 sections present; if missing add: UAE VAT 5% section (FTA quarterly filing), rolling 12-month cash flow forecast, budget-vs-actual variance table, invoice format spec with TRN, payout schedule rules` | `business_docs/09_crm_features/financial-reporting.md` | ⚠️ VERIFY |
| **@Sofia** | [Google AI Studio → Gemini 2.0 Flash](https://aistudio.google.com/) | `@Sofia — AUDIT: compliance-requirements.md → verify 12 sections present; if missing add: Oqood off-plan registration rules, escrow account compliance, RERA/DLD penalty table with fine amounts by violation type, pricing/discount approval rules` | `business_docs/05_requirements/compliance-requirements.md` | ⚠️ VERIFY |
| **@Victoria** | [Google AI Studio → Gemini 2.0 Flash](https://aistudio.google.com/) | `@Victoria — EXPAND: landlord-portal.md → add KYC onboarding flow section, NOC letter generation workflow, 3-month grace period rules, rent increase notice procedure` | `business_docs/09_crm_features/landlord-portal.md` | 🔜 NEXT |
| **@Cassie** | [DeepSeek Chat → DeepSeek V3](https://chat.deepseek.com/) | `@Cassie — EXPAND: analytics-dashboard.md → add mobile analytics view specification (responsive breakpoints, touch-friendly KPI cards), data export CSV/Excel API endpoint spec with column mapping` | `business_docs/09_crm_features/analytics-dashboard.md` | 🔜 NEXT |
| **@Joelle** | [Groq Console → Llama 3.1 70B](https://console.groq.com/) | `@Joelle — DRAFT: 03_ai_assistants/README.md → add personas 25-35 (Quill the Copywriter, Lumen the Data Analyst, Crest the Property Valuer, Prism the Market Researcher, Echo the Follow-up Bot + 5 more). Add failure/fallback behavior section: API timeout handling, rate limit graceful degradation, human handoff triggers` | `business_docs/03_ai_assistants/README.md` | 🔜 NEXT |

**⚡ Priority order: @Invoice → @Sofia first (gate VERIFY), then @Victoria → @Cassie → @Joelle**

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
