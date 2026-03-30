# /business — White Caves Real Estate LLC

**Canonical business documentation for White Caves Real Estate LLC (Dubai).**

> This directory follows the structure defined in the MASTER PLAN Phase 0.2.  
> Full content lives in `/business_docs/`. This folder uses the naming convention  
> defined in the problem statement and contains key summary documents.

---

## Structure

| Folder | Description | Source |
|--------|-------------|--------|
| `01_company_structure/` | Org chart, departments, teams | `/business_docs/01_company_structure/` |
| `02_services_features/` | Products, services, features offered | `/business_docs/02_services/` |
| `03_agent_workflows/` | Sales, leasing, compliance workflows | `/business_docs/04_workflows/` |
| `04_ai_assistants/` | All 24 AI assistant profiles + plans | `/business_docs/03_ai_assistants/` |
| `05_requirements/` | Business & technical requirements | `/business_docs/05_requirements/` |
| `06_design/` | Design architecture, UI/UX guidelines | `/business_docs/06_design_architecture/` |
| `07_business_model/` | Revenue model, pricing, commissions | `/business_docs/07_business_model/` |
| `08_market_research/` | Dubai market, RERA, Ejari, portals | `/business_docs/08_market_research/` |
| `09_user_roles_permissions/` | RBAC matrix, 26 roles, 21+ permissions | `/business_docs/09_user_roles_permissions/` |
| `10_design_system/` | Tokens, typography, components, colors | `/business_docs/10_design_system/` |

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

- `GET  /api/assistants`         → List all assistants
- `GET  /api/assistants/:id/plan`  → Get assistant plan (requires auth)
- `POST /api/assistants`         → Create plan (super-user only)
- `PUT  /api/assistants/:id`     → Update plan (super-user only)
- `DELETE /api/assistants/:id`   → Delete plan (super-user only)
