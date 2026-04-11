# /business — White Caves Real Estate LLC

**Canonical business documentation for White Caves Real Estate LLC (Dubai).**

> This directory follows the structure defined in the MASTER PLAN Phase 0.2.  
> Full content lives in `/business_docs/` (120+ documents across 15 sections).  
> Research-driven updates added in Phase 2A (April 11, 2026).

---

## Structure

| Folder | Description | Source | Files |
|--------|-------------|--------|-------|
| `01_company_structure/` | Org chart, departments, teams, stakeholders | `/business_docs/01_company_structure/` | 4 |
| `02_services_features/` | Products, services, SLAs | `/business_docs/02_services/` | 3 |
| `03_agent_workflows/` | Sales, leasing, compliance, onboarding workflows | `/business_docs/04_workflows/` | 7 |
| `04_ai_assistants/` | All 27 AI assistant profiles + integration map | `/business_docs/03_ai_assistants/` + new | 30 |
| `05_requirements/` | Business, technical & compliance requirements | `/business_docs/05_requirements/` | 9 |
| `06_design/` | Architecture, API, database, UI/UX, data dictionary | `/business_docs/06_design_architecture/` | 7 |
| `07_business_model/` | Revenue model, BMC, projections | `/business_docs/07_business_model/` | 3 |
| `08_market_research/` | Dubai market, competitors, regulations, tech upgrades | `/business_docs/08_market_research/` + new | 9 |
| `09_user_roles_permissions/` | RBAC matrix, 27 roles, 100+ permissions | `/business_docs/09_user_roles_permissions/` + new | 4 |
| `10_design_system/` | Tokens, accessibility, RTL/i18n, AR/VR, 3D tours | `/business_docs/10_design_system/` + new | 9 |

### Phase 2A New Documents (Research Implementation)

| Document | Description |
|----------|-------------|
| `08_market_research/competitor_analysis.md` | Top 5 Dubai platform comparison, feature gaps, revenue projections |
| `08_market_research/dubai_regulations.md` | RERA, Ejari, TRN, escrow, AML/KYC compliance checklists |
| `08_market_research/technology_upgrades.md` | Elasticsearch, Redis, GraphQL, S3, WebSocket recommendations |
| `04_ai_assistants/lead_scoring_bot.md` | Archer — AI lead scoring with multi-signal model |
| `04_ai_assistants/document_generator.md` | Quill — Smart document generation with compliance validation |
| `04_ai_assistants/market_analyst.md` | Oracle — Market intelligence, CMA, price forecasting |
| `09_user_roles_permissions/expanded_roles.md` | 5 new roles: compliance officer, marketing manager, etc. |
| `10_design_system/ar_vr_3d_tours.md` | 3D tour, 360° panorama, AR staging, VR walkthrough components |
| `10_design_system/internationalization_tokens.md` | i18n tokens, 7 locales, currency/date formatting |

### Additional Sections (in `/business_docs/`)

| Section | Description | Files |
|---------|-------------|-------|
| `09_crm_features/` | CRM feature specs: properties, landlord/tenant portals, analytics, marketing | 16 |
| `10_security/` | Security policy, KYC/AML, UAE PDPL compliance | 3 |
| `11_seo/` | SEO strategy, technical SEO, local SEO | 2 |
| `12_srs/` | Software Requirements Specification + Design Document | 2 |
| `13_testing/` | Test plan, UAT scenarios, QA checklist | 3 |
| `14_devops/` | Deployment runbook, incident response, monitoring, env setup | 5 |
| `15_release_management/` | Release process, change management | 3 |
| `02_infrastructure/` | Disaster recovery, scaling, database, security architecture, monitoring | 7 |

---

## Key AI Assistants (27 personas)

| ID | Name | Department | Role |
|----|------|------------|------|
| zoe | Zoe | Executive | Executive Assistant & Strategic Intelligence |
| nadia | Nadia | Communications | WhatsApp CRM Manager |
| sophia | Sophia | Sales | Sales Pipeline Manager |
| clara | Clara | Sales | Leads CRM Manager |
| daisy | Daisy | Operations | Leasing & Tenant Manager |
| mary | Mary | Operations | Inventory & Data Manager |
| theodora | Theodora | Finance | Finance & Accounts Director |
| olivia | Olivia | Marketing | Marketing & Brand Manager |
| laila | Laila | Compliance | Compliance & Legal Officer |
| aurora | Aurora | Technology | Chief Technology Officer |
| hazel | Hazel | Technology | Elite Frontend Engineer |
| willow | Willow | Technology | Elite Backend Engineer |
| nina | Nina | Communications | WhatsApp Bot Developer |
| nancy | Nancy | Operations | HR Manager |
| evangeline | Evangeline | Legal | Legal Risk Analyst |
| atlas | Atlas | Technology | Infrastructure Engineer |
| cipher | Cipher | Security | Security Analyst |
| maven | Maven | Analytics | Data Scientist |
| vesta | Vesta | Operations | Property Valuation Specialist |
| henry | Henry | Marketing | Property Photographer & Tours |
| hunter | Hunter | Sales | Lead Generation Specialist |
| juno | Juno | Sales | Client Relations Manager |
| kairos | Kairos | Analytics | Market Intelligence Analyst |
| sentinel | Sentinel | Security | Monitoring & Alerting |
| **archer** | **Archer** | **Sales/Analytics** | **Lead Scoring Bot** (NEW — Phase 2A) |
| **quill** | **Quill** | **Legal/Operations** | **Document Generator** (NEW — Phase 2A) |
| **oracle** | **Oracle** | **Analytics/Executive** | **Market Analyst** (NEW — Phase 2A) |

---

## API Access (Phase 0.8)

- `GET  /api/assistants`           → List all assistants
- `GET  /api/assistants/:id/plan`  → Get assistant plan (requires auth)
- `POST /api/assistants`           → Create plan (super-user only)
- `PUT  /api/assistants/:id`       → Update plan (super-user only)
- `DELETE /api/assistants/:id`     → Delete plan (super-user only)

---

## Quick Links

| Resource | Location |
|----------|----------|
| Master Plan | `/MASTER_PLAN.md` |
| Plans Directory | `/plans/` (23 active documents) |
| Business Docs | `/business_docs/` (120+ documents) |
| ADRs | `/docs/adr/` (8 decisions) |
| OpenAPI Spec | `/openapi.json` |

---

**Last Updated**: April 11, 2026  
**Total Documentation**: 130+ files across 15 sections  
**Phase 2A Research**: 9 new documents created from deep online research
