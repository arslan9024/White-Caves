# /business — White Caves Real Estate LLC

**Index & overview of business documentation for White Caves Real Estate LLC (Dubai).**

> This directory follows the structure defined in the MASTER PLAN Phase 0.2  
> and provides curated summary documents mapped to that structure.  
> The full, canonical content lives in `/business_docs/`, which uses the naming convention  
> defined in the problem statement and serves as the single source of truth.  
> Last major expansion: April 2026 — 29 new documents added + comprehensive expansion pass (every document now 370–1068 lines).

---

## Best Practices Compliance Matrix

| Standard       | Requirement                             | Status                                                 |
| -------------- | --------------------------------------- | ------------------------------------------------------ |
| IEEE 830       | Software Requirements Specification     | 🟢 SRS v2.0 in `05_srs_and_engineering/`               |
| IEEE 1016      | Software Design Document                | 🟢 SDD v2.0 in `05_srs_and_engineering/`               |
| BPMN 2.0       | Business process diagrams               | 🟢 10 flowcharts in `06_flowcharts/`                   |
| ISO 22301      | Business continuity / disaster recovery | 🟡 DR in `business_docs/02_infrastructure/`            |
| UAE PDPL       | Personal Data Protection Law compliance | 🟢 DPIA in `08_compliance/`, flows in `06_flowcharts/` |
| UAE AML        | AML/KYC framework                       | 🟢 `08_compliance/aml-risk-assessment.md`              |
| RERA           | Real estate regulatory compliance       | 🟢 `08_compliance/rera-compliance-checklist.md`        |
| GDPR (equiv.)  | EU data protection equivalence          | 🟢 `08_compliance/gdpr-equivalence-assessment.md`      |
| OKR            | Objectives & Key Results framework      | 🟢 `07_strategy/okr-framework.md`                      |
| API Versioning | Deprecation policy                      | 🟢 `05_srs_and_engineering/api-versioning-policy.md`   |

---

## Directory Structure

### Core Sections

| Folder                       | Description                                      | Status | Files |
| ---------------------------- | ------------------------------------------------ | ------ | ----- |
| `01_company_structure/`      | Org chart, departments, teams, stakeholders      | ✅     | 4     |
| `02_services_features/`      | Products, services, SLAs                         | ✅     | 3     |
| `03_agent_workflows/`        | Sales, leasing, compliance, onboarding workflows | ✅     | 7     |
| `04_ai_assistants/`          | AI assistant profiles + integration map          | ✅     | 28    |
| `08_market_research/`        | Dubai market, competitors, regulations, tech     | ✅     | 9     |
| `09_user_roles_permissions/` | RBAC matrix, 29 roles, 100+ permissions          | ✅     | 4     |
| `10_design_system/`          | Tokens, accessibility, RTL/i18n, AR/VR           | ✅     | 9     |

### New Sections (April 2026 Expansion)

| Folder                    | Description                                             | Owner      | Files |
| ------------------------- | ------------------------------------------------------- | ---------- | ----- |
| `05_srs_and_engineering/` | SRS v2, SDD v2, API policy, tech debt, ADR index        | Technology | 5     |
| `06_flowcharts/`          | 10 BPMN-style process diagrams                          | All depts  | 10    |
| `07_strategy/`            | Roadmap, OKRs, KPIs, journey maps, competitive analysis | Executive  | 5     |
| `08_compliance/`          | DPIA, RERA checklist, AML assessment, GDPR equivalence  | Compliance | 4     |
| `09_operations/`          | Agent scorecard, onboarding, vendor mgmt, partnerships  | Operations | 4     |

---

## 05_srs_and_engineering/ — Software Engineering Documents

| Document                                 | Description                                                         | Status | Owner      |
| ---------------------------------------- | ------------------------------------------------------------------- | ------ | ---------- |
| `srs-v2-2026.md`                         | Software Requirements Specification v2 — all Phase 1–10 features    | Active | Technology |
| `software-design-document-v2.md`         | Architecture, components, UnifiedSidebar, 40 AI assistants, portals | Active | Technology |
| `api-versioning-policy.md`               | API versioning strategy, deprecation process, changelog             | Active | Technology |
| `technical-debt-register.md`             | All 38 tech debt items, priority, remediation timeline              | Active | Technology |
| `architecture-decision-records-index.md` | Index of all ADRs with summaries and rationale                      | Active | Technology |

---

## 06_flowcharts/ — Process Flow Diagrams

| Document                            | Description                                                       | Status  | Owner          |
| ----------------------------------- | ----------------------------------------------------------------- | ------- | -------------- |
| `system-architecture-diagram.md`    | C4 context + container + component diagrams                       | Active  | Technology     |
| `user-authentication-flow.md`       | JWT login, Firebase OAuth, 2FA, reset, RBAC redirect              | Active  | Technology     |
| `lead-lifecycle-flow.md`            | Lead capture → BANT → viewing → offer → WON/LOST + dormancy       | Active  | Sales          |
| `property-listing-flow.md`          | Property creation → RERA verification → publishing → deactivation | Active  | Operations     |
| `tenancy-lifecycle-flow.md`         | Tenant inquiry → screening → Ejari → lease → payments → renewal   | Active  | Operations     |
| `commission-calculation-flow.md`    | Deal closure → calculation → approval → statement → payment       | Active  | Finance        |
| `whatsapp-bot-conversation-flow.md` | Inbound → intent detection → routing → handoff → follow-up        | Phase 4 | Communications |
| `compliance-kyc-aml-flow.md`        | KYC → sanctions screening → risk rating → DLD → SAR               | Phase 5 | Compliance     |
| `data-privacy-flow.md`              | Data collection → consent → access → PDPL deletion/export         | Active  | Compliance     |
| `ci-cd-pipeline-flow.md`            | Commit → lint/test → build → staging → production → rollback      | Active  | DevOps         |

---

## 07_strategy/ — Business Strategy Documents

| Document                       | Description                                              | Status | Owner     |
| ------------------------------ | -------------------------------------------------------- | ------ | --------- |
| `product-roadmap-2026-2028.md` | Phase 1–10 roadmap; tied to Dubai 2040 Urban Master Plan | Active | Executive |
| `okr-framework.md`             | Company + 6 department OKRs for 2026; quarterly cycle    | Active | Executive |
| `kpi-dashboard-spec.md`        | 70+ KPIs across 10 departments; data sources; targets    | Active | Analytics |
| `customer-journey-map.md`      | 4 journey maps: Buyer, Seller, Landlord, Tenant          | Active | CX        |
| `competitive-positioning.md`   | White Caves vs Bayut vs PF vs DAMAC App vs Allsopp       | Active | Strategy  |

---

## 08_compliance/ — Legal & Regulatory Documents

| Document                            | Description                                                 | Status | Owner      |
| ----------------------------------- | ----------------------------------------------------------- | ------ | ---------- |
| `data-privacy-impact-assessment.md` | Formal UAE PDPL DPIA — 6 processing activities, risk matrix | Active | Compliance |
| `rera-compliance-checklist.md`      | Operational RERA compliance: BRN, Form A/B/F, advertising   | Active | Compliance |
| `aml-risk-assessment.md`            | AML/CFT risk framework, CDD levels, SAR procedure           | Active | Compliance |
| `gdpr-equivalence-assessment.md`    | UAE PDPL vs GDPR gap analysis for European investors        | Active | Compliance |

---

## 09_operations/ — HR & Operational Documents

| Document                         | Description                                                           | Status | Owner      |
| -------------------------------- | --------------------------------------------------------------------- | ------ | ---------- |
| `agent-performance-scorecard.md` | KPIs per role: response time, conversion, compliance, CRM quality     | Active | HR         |
| `onboarding-checklist.md`        | New agent: RERA verify, system access, AML training, 30/60/90 plan    | Active | HR         |
| `vendor-management.md`           | All vendors: MongoDB, Vercel, Stripe, Meta, Bayut, DAMAC — SLAs, DPAs | Active | Operations |
| `partnership-framework.md`       | Framework: developer (DAMAC/Emaar), portal (Bayut/PF), co-brokerage   | Active | Strategy   |

---

## Additional Sections (in `/business_docs/`)

| Section                  | Description                                                       | Files |
| ------------------------ | ----------------------------------------------------------------- | ----- |
| `09_crm_features/`       | CRM feature specs: properties, landlord/tenant portals, analytics | 16    |
| `10_security/`           | Security policy, KYC/AML, UAE PDPL compliance                     | 3     |
| `11_seo/`                | SEO strategy, technical SEO, local SEO                            | 2     |
| `12_srs/`                | Legacy SRS v1 + Design Document v1                                | 2     |
| `13_testing/`            | Test plan, UAT scenarios, QA checklist                            | 3     |
| `14_devops/`             | Deployment runbook, incident response, monitoring                 | 5     |
| `15_release_management/` | Release process, change management                                | 3     |
| `02_infrastructure/`     | Disaster recovery, scaling, database, security                    | 7     |

---

## AI Assistant Hub — 40 Personas

Full details: `plans/ai_assistants/README.md`

| Dept                | Count  | Key Assistants                       |
| ------------------- | ------ | ------------------------------------ |
| Executive           | 1      | Zoe                                  |
| Sales               | 5      | Sophia, Clara, Hunter, Juno, Archer  |
| Operations          | 4      | Daisy, Mary, Nancy, Vesta            |
| Finance             | 2      | Theodora, Quill                      |
| Marketing           | 2      | Olivia, Henry                        |
| Compliance          | 2      | Laila, Evangeline                    |
| Technology          | 5      | Aurora, Hazel, Willow, Atlas, Oracle |
| Communications      | 2      | Nadia, Nina                          |
| Security            | 2      | Cipher, Sentinel                     |
| Analytics           | 3      | Maven, Kairos, (Data dept)           |
| Customer Experience | TBD    | Phase 9                              |
| Data & AI           | TBD    | Phase 7                              |
| **Total**           | **40** |                                      |

---

## API Access

| Endpoint                   | Method | Auth              | Purpose                   |
| -------------------------- | ------ | ----------------- | ------------------------- |
| `/api/assistants`          | GET    | None              | List all AI assistants    |
| `/api/assistants/:id/plan` | GET    | JWT               | Get assistant plan detail |
| `/api/assistants`          | POST   | managing_director | Create assistant plan     |
| `/api/assistants/:id`      | PUT    | managing_director | Update assistant plan     |
| `/api/assistants/:id`      | DELETE | managing_director | Delete assistant plan     |

---

## Quick Links

| Resource               | Location                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| Master Plan            | `/MASTER_PLAN.md`                                                        |
| Phase Plans            | `/plans/` (72+ documents)                                                |
| Business Docs (legacy) | `/business_docs/` (120+ documents)                                       |
| ADR Index              | `business/05_srs_and_engineering/architecture-decision-records-index.md` |
| ADR Files              | `/docs/adr/`                                                             |
| OpenAPI Spec           | `/openapi.json`                                                          |
| SRS v2                 | `business/05_srs_and_engineering/srs-v2-2026.md`                         |
| Tech Debt              | `business/05_srs_and_engineering/technical-debt-register.md`             |
| Product Roadmap        | `business/07_strategy/product-roadmap-2026-2028.md`                      |
| OKR Framework          | `business/07_strategy/okr-framework.md`                                  |

---

**Last Updated**: April 29, 2026
**Total Documentation**: 160+ files across 20+ sections
**April 2026 Expansion**: 29 new documents added (March–April) + full expansion pass (April 2026)
**Business folder size**: 37 documents across 9 sections — every document expanded to 370–1068 lines
**Coverage highlights**:

- 08_compliance/: RERA full checklist (522L), AML framework (1068L), GDPR assessment (398L), DPIA (432L)
- 09_operations/: Scorecard with worked examples and UAE Labour Law (478L), Onboarding week-by-week (368L), Vendor risk matrix (502L), Portal syndication (437L)
- 06_flowcharts/: All 10 flowcharts expanded to 395–548 lines with implementation-level detail
- 05_srs_and_engineering/: API design principles + ADR full records (484–519L per document)
- 07_strategy/: OKRs with targets and cascading (505L), KPI dashboard (596L), Journey maps (468L)
- 08_market_research/: Battle cards, DLD process, AI/ML tech choices (372–569L per document)

---

## Document Size Reference (April 2026 Expansion)

| Section                    | Document                               | Lines | Status      |
| -------------------------- | -------------------------------------- | ----- | ----------- |
| 05_srs_and_engineering/    | api-versioning-policy.md               | 519   | ✅ Expanded |
| 05_srs_and_engineering/    | technical-debt-register.md             | 505   | ✅ Expanded |
| 05_srs_and_engineering/    | architecture-decision-records-index.md | 484   | ✅ Expanded |
| 05_srs_and_engineering/    | software-design-document-v2.md         | 700+  | ✅ Original |
| 05_srs_and_engineering/    | srs-v2-2026.md                         | 600+  | ✅ Original |
| 06_flowcharts/             | lead-lifecycle-flow.md                 | 453   | ✅ Expanded |
| 06_flowcharts/             | commission-calculation-flow.md         | 505   | ✅ Expanded |
| 06_flowcharts/             | property-listing-flow.md               | 457   | ✅ Expanded |
| 06_flowcharts/             | ci-cd-pipeline-flow.md                 | 470   | ✅ Expanded |
| 06_flowcharts/             | whatsapp-bot-conversation-flow.md      | 395   | ✅ Expanded |
| 06_flowcharts/             | user-authentication-flow.md            | 455   | ✅ Expanded |
| 06_flowcharts/             | tenancy-lifecycle-flow.md              | 485   | ✅ Expanded |
| 06_flowcharts/             | compliance-kyc-aml-flow.md             | 406   | ✅ Expanded |
| 06_flowcharts/             | data-privacy-flow.md                   | 548   | ✅ Expanded |
| 06_flowcharts/             | system-architecture-diagram.md         | 402   | ✅ Expanded |
| 07_strategy/               | product-roadmap-2026-2028.md           | 480   | ✅ Original |
| 07_strategy/               | okr-framework.md                       | 505   | ✅ Original |
| 07_strategy/               | kpi-dashboard-spec.md                  | 596   | ✅ Original |
| 07_strategy/               | customer-journey-map.md                | 468   | ✅ Original |
| 07_strategy/               | competitive-positioning.md             | 404   | ✅ Original |
| 08_compliance/             | aml-risk-assessment.md                 | 1068  | ✅ Expanded |
| 08_compliance/             | data-privacy-impact-assessment.md      | 432   | ✅ Expanded |
| 08_compliance/             | rera-compliance-checklist.md           | 522   | ✅ Expanded |
| 08_compliance/             | gdpr-equivalence-assessment.md         | 398   | ✅ Expanded |
| 08_market_research/        | competitor_analysis.md                 | 372   | ✅ Expanded |
| 08_market_research/        | dubai_regulations.md                   | 480   | ✅ Expanded |
| 08_market_research/        | technology_upgrades.md                 | 569   | ✅ Expanded |
| 09_operations/             | agent-performance-scorecard.md         | 478   | ✅ Expanded |
| 09_operations/             | onboarding-checklist.md                | 368   | ✅ Expanded |
| 09_operations/             | vendor-management.md                   | 502   | ✅ Expanded |
| 09_operations/             | partnership-framework.md               | 437   | ✅ Expanded |
| 09_user_roles_permissions/ | expanded_roles.md                      | 494   | ✅ Expanded |
| 10_design_system/          | ar_vr_3d_tours.md                      | 498   | ✅ Expanded |
| 10_design_system/          | internationalization_tokens.md         | 674   | ✅ Expanded |
| 04_ai_assistants/          | lead_scoring_bot.md                    | 576   | ✅ Original |
| 04_ai_assistants/          | document_generator.md                  | 715   | ✅ Original |
| 04_ai_assistants/          | market_analyst.md                      | 658   | ✅ Original |

**Average document length across all expanded files: ~490 lines**
**Total business/ folder content: ~17,000+ lines of structured documentation**
