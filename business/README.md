# /business — White Caves Real Estate LLC

**Canonical business documentation for White Caves Real Estate LLC (Dubai).**

> This directory follows the structure defined in the MASTER PLAN Phase 0.2.  
> Full content lives in `/business_docs/` (120+ documents across 15 sections).  
> This folder uses the naming convention defined in the problem statement.

---

## Structure

| Folder | Description | Source | Files |
|--------|-------------|--------|-------|
| `01_company_structure/` | Org chart, departments, teams, stakeholders | `/business_docs/01_company_structure/` | 4 |
| `02_services_features/` | Products, services, SLAs | `/business_docs/02_services/` | 3 |
| `03_agent_workflows/` | Sales, leasing, compliance, onboarding workflows | `/business_docs/04_workflows/` | 7 |
| `04_ai_assistants/` | All 24 AI assistant profiles + integration map | `/business_docs/03_ai_assistants/` | 27 |
| `05_requirements/` | Business, technical & compliance requirements | `/business_docs/05_requirements/` | 9 |
| `06_design/` | Architecture, API, database, UI/UX, data dictionary | `/business_docs/06_design_architecture/` | 7 |
| `07_business_model/` | Revenue model, BMC, projections | `/business_docs/07_business_model/` | 3 |
| `08_market_research/` | Dubai market, competitors, personas, portals | `/business_docs/08_market_research/` | 6 |
| `09_user_roles_permissions/` | RBAC matrix, 12 roles, 20+ permissions | `/business_docs/09_user_roles_permissions/` | 3 |
| `10_design_system/` | Tokens, accessibility, RTL/i18n, components | `/business_docs/10_design_system/` | 7 |

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

## Key AI Assistants (24 personas)

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

**Last Updated**: April 10, 2026  
**Total Documentation**: 120+ files across 15 sections
