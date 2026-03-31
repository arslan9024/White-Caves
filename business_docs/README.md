# /business_docs — White Caves Real Estate LLC

> **Single Source of Truth** for all business documentation, domain knowledge, and strategic planning.
>
> Last updated: March 31, 2026 | **100 documents across 15 sections**

---

## 📋 Folder Structure

```
business_docs/
├── 01_company_structure/     # Org chart, departments, roles, stakeholder register
├── 02_services/              # Core service offerings catalog (9 services)
├── 03_ai_assistants/         # 24-persona AI assistant registry + integration map
├── 04_workflows/             # 9 critical business workflows + flowcharts
├── 05_requirements/          # 80+ requirements + business rules + risk register
├── 06_design_architecture/   # Architecture, API, database, UI/UX, data dictionary
├── 07_business_model/        # Revenue model + projections + Business Model Canvas
├── 08_market_research/       # Dubai market analysis, portals, regulatory framework
├── 09_crm_features/          # Feature specs (CRM, AI CRUD, UI components)
├── 10_security/              # Security policy, KYC/AML, PDPL compliance
├── 11_seo/                   # SEO strategy, keywords, content calendar
├── 12_srs/                   # Software Requirements Specification + Design Document
├── 13_testing/               # Test Plan, UAT scenarios, QA checklist
├── 14_devops/                # Deployment runbook, incident response, monitoring, setup
├── 15_release_management/    # Release process, versioning, change management
└── archives/                 # Historical phase summaries
```

---

## 🎯 Quick Navigation

| Audience | Start Here | Then Read |
|----------|-----------|-----------|
| **Business Analyst** | `05_requirements/` | `02_services/`, `04_workflows/` |
| **Developer** | `12_srs/` then `06_design_architecture/` | `13_testing/`, `14_devops/` |
| **New Developer** | `14_devops/environment-setup.md` | `06_design_architecture/`, `12_srs/` |
| **Project Manager** | `01_company_structure/` | `04_workflows/`, `15_release_management/` |
| **Executive / Owner** | `07_business_model/` | `08_market_research/`, `01_company_structure/` |
| **QA Engineer** | `13_testing/test-plan.md` | `13_testing/uat-scenarios.md` |
| **DevOps Engineer** | `14_devops/deployment-runbook.md` | `14_devops/monitoring-observability.md` |
| **Compliance Officer** | `10_security/` | `05_requirements/compliance-requirements.md` |
| **New Team Member** | `01_company_structure/stakeholder-register.md` | `02_services/`, `04_workflows/agent-onboarding-workflow.md` |

---

## 📊 Key Business Facts

- **Company**: White Caves Real Estate LLC, Dubai, UAE
- **Portfolio**: 9,378+ properties (DAMAC Hills 2 primary)
- **Team**: 24+ employees across 10 departments
- **AI Assistants**: 24 personas (5 critical, 9 core, 10 support)
- **Revenue Target**: AED 39–100M annual (5 revenue streams)
- **Market**: AED 180B Dubai real estate (TAM: AED 660M SaaS)
- **Tech Stack**: React 18, TypeScript, Express, MongoDB/Prisma, Firebase
- Status: Cross-reference with `/plans/STATUS_DASHBOARD_VISUAL.md`
- Requirements: Track completion against `requirements/`

---

## 📊 Current Documentation Status (March 2026)

### ✅ Fully Written Documents

#### 01 — Company Structure
- `departments.md` — All 10 departments with KPIs, team sizes, AI assistants
- `roles.md` — All 22 user roles with permissions and access levels
- `stakeholder-register.md` ✨ NEW — All internal + external stakeholders, communication plan

#### 02 — Services
- `core-services.md` — 9 core CRM services with implementation status

#### 03 — AI Assistants
- 24 individual assistant profiles (atlas, aurora, cipher, clara, daisy, etc.)
- `integration-map.md` — Maps each assistant to its API, dependencies, and implementation status

#### 04 — Workflows
- `lead-to-sale-flowchart.md` — Full lead-to-close and lead-to-lease workflows
- `whatsapp-bot-flowchart.md` — Inbound message routing, Nina bot flows, escalation, broadcasts
- `rental-management-flowchart.md` — Rent collection, maintenance, lease renewal, month-end close
- `compliance-audit-flowchart.md` — KYC/AML, SAR, RERA monthly audit, agent credential tracking
- `agent-onboarding-workflow.md` ✨ NEW — New staff onboarding, training, off-boarding workflow
- `finance-reconciliation-flowchart.md` ✨ NEW — Monthly commission reconciliation, rent income close, payout processing

#### 05 — Requirements
- `functional-requirements.md` — 50+ requirements across 10 modules with acceptance criteria
- `user-stories.md` — 70+ user stories for all 22 roles
- `business-rules.md` — 10 business rule categories (scoring, assignment, lifecycle, finance, etc.)
- `non-functional-requirements.md` — Performance, security, scalability, usability targets
- `compliance-requirements.md` — RERA, DLD, Ejari, AML, PDPL regulatory requirements
- `integration-requirements.md` — All third-party API requirements (WhatsApp, portals, Firebase, Stripe)
- `risk-register.md` ✨ NEW — Full risk register with probability/impact matrix, mitigation plans

#### 06 — Design Architecture
- `system-architecture.md` — Full tech stack, component structure, auth flow, CI/CD
- `data-flow.md` — DFD diagrams for leads, properties, transactions, WhatsApp, reporting
- `api-reference.md` — All REST API endpoints with parameters, request/response formats
- `database-schema.md` — Prisma schemas for all models
- `ui-ux-specification.md` ✨ NEW — Design tokens, screen layouts, component states, screen specs
- `data-dictionary.md` ✨ NEW — Every data field: type, validation, business meaning + glossary

#### 07 — Business Model
- `business-model-canvas.md` ✨ NEW — Full BMC: partners, activities, value propositions, segments
- `revenue-model.md` ✨ NEW — 3-tier revenue streams, 3-year financial projections, unit economics, KPIs

#### 08 — Market Research
- `dubai-market-analysis-2026.md` — Market size, buyer profiles, trends
- `dubai-regulatory-framework.md` — RERA, DLD, Ejari regulatory overview
- `portal-api-research.md` — PropertyFinder + Bayut API, partnership requirements

#### 09 — CRM Features
- `lead-tracking.md` — Lead pipeline management specification
- `client-management.md` — Client management features
- `package3-ai-assistant-crud.md` — AI assistant CRUD
- `package4-advanced-ui-components.md` — Advanced UI components
- `unifiedcrm-component.md` — Unified CRM component
- `commission-tracking.md` — Commission lifecycle, API endpoints, UI specs
- `tenancy-ejari.md` — Tenant onboarding, Ejari compliance, lease lifecycle
- `financial-reporting.md` — 7 report types, export specs, dashboard components
- `agent-performance.md` — KPIs, leaderboard, targets, performance dashboard
- `marketing-campaigns.md` — WhatsApp broadcasts, campaign analytics, lead attribution

#### 09 — User Roles & Permissions
- `roles-matrix.md` — 22 roles with permissions
- `access-control-policy.md` — RBAC policy

#### 10 — Design System
- Color palette, typography, component specs, spacing/layout

#### 10 — Security
- `security-policy.md` — Security controls and policies
- `uae-pdpl-compliance.md` — PDPL compliance framework, data subject rights, breach response
- `kyc-aml-framework.md` — KYC requirements, AML screening services, goAML SAR process

#### 11 — SEO
- `seo-strategy.md` — SEO strategy

#### 12 — SRS (Software Requirements Specification) ✨ NEW SECTION
- `srs-master.md` — Formal IEEE 830-style SRS: scope, interface requirements, features, constraints
- `software-design-document.md` — Software Design Document (SDD): component hierarchy, patterns, auth design

#### 13 — Testing ✨ NEW SECTION
- `test-plan.md` — Full test strategy: unit, integration, E2E, performance, security, accessibility
- `uat-scenarios.md` — 20+ UAT scenarios by role (sales agent, manager, finance, compliance, owner)
- `qa-checklist.md` — Pre-release QA checklist covering code, tests, security, compliance

#### 14 — DevOps ✨ NEW SECTION
- `deployment-runbook.md` — Step-by-step deployment for frontend (Vercel) + backend (Railway/Docker) + database migrations
- `incident-response.md` — P1–P4 severity levels, response workflow, runbooks for common incidents, post-mortem template
- `monitoring-observability.md` — Monitoring stack, health check, key metrics, alerting rules, logging strategy
- `environment-setup.md` — New developer setup guide: Node.js, env vars, Prisma, seed data, project structure

#### 15 — Release Management ✨ NEW SECTION
- `release-process.md` — SemVer versioning, release calendar, step-by-step release process, hotfix process
- `change-management.md` — Change categories, change request template, approval process, freeze periods

#### Root Level
- `implementation-plan.md` — Master implementation roadmap (Phase A–F), current state, technical debt register, milestones

---

## 🔗 Related Documentation

**In /plans/:**
- `MASTER_PLAN_UPDATED_FEB_2026.md` - Master execution plan
- `ARCHITECTURE.md` - Technical architecture
- `API_DOCUMENTATION.md` - API specifications

**In parent directory:**
- `README.md` - Main documentation guide
- `QUICK_ACCESS_GUIDE.md` - Common tasks
- `TEAM_COMMUNICATION_TEMPLATES.md` (in /plans/) - Communication formats

**In /archives/:**
- Historical business decisions
- Previous requirement iterations
- Archived feature specifications

---

## 💼 Document Templates

All subdirectories follow consistent templates:

### For Requirements Documents
```markdown
# [Requirement Title]

## Overview
[Brief description]

## Business Value
[Why this is important]

## Acceptance Criteria
- Criterion 1
- Criterion 2

## Implementation Notes
[Relevant notes]

## Related Documents
- Link 1
- Link 2
```

### For Feature Specifications
```markdown
# [Feature Name]

## Overview
[Feature description]

## User Stories
- As a [user], I want to [action], so that [benefit]

## Technical Specifications
[Technical details]

## Success Metrics
[How success is measured]

## Related Features
[Dependencies and relationships]
```

---

## 🎯 Subdirectory Purposes

### /crm_features/
**Purpose**: Document all CRM platform features and their specifications

**Should Contain**:
- Feature descriptions
- User journey mappings
- Feature dependencies
- Implementation status
- User acceptance criteria

**Examples**:
- Client Management
- Lead Tracking & Pipeline
- Property Management
- AI Assistant Integration
- Transaction Management
- Department & Service Management

### /requirements/
**Purpose**: Consolidate all business and technical requirements

**Should Contain**:
- Functional requirements
- Non-functional requirements
- Business rules
- Compliance requirements
- Integration requirements

**Examples**:
- WhatsApp Integration Requirements
- Database Requirements
- Performance Requirements
- Security Requirements
- API Requirements

### /seo/
**Purpose**: Document SEO strategy and implementation guidelines

**Should Contain**:
- SEO strategy document
- Keyword research
- Content optimization guidelines
- Technical SEO checklist
- Monitoring & analytics setup

**Examples**:
- On-page SEO guidelines
- Site structure optimization
- Mobile optimization
- Performance optimization for SEO
- Metadata standards

### /security/
**Purpose**: Maintain all security-related policies and procedures

**Should Contain**:
- Security policies
- Data protection procedures
- Access control guidelines
- Incident response procedures
- Compliance checklists

**Examples**:
- Data Classification Policy
- Access Control Policy
- Incident Response Plan
- Security Testing Procedures
- Compliance Checklist

---

## 📝 Adding New Documents

When adding new business documentation:

1. **Determine the category** - Which subdirectory does it belong in?
2. **Follow the template** - Use the provided template structure
3. **Include metadata** - Version, date, author, status
4. **Link to related docs** - Add cross-references
5. **Update this README** - Add entry to appropriate section
6. **Maintain naming** - Use descriptive names: `Feature_Name_Specification.md`

---

## 🔄 Maintenance Schedule

- **Requirements**: Review quarterly or when business needs change
- **CRM Features**: Update when features are added/modified
- **SEO Guidelines**: Review semi-annually with marketing team
- **Security Policies**: Annual review with security team

---

## 🎓 Learning Paths

### New Team Member Onboarding
1. Read: `requirements/` - Understand the scope
2. Study: `crm_features/` - Learn what we build
3. Review: `security/` - Understand our constraints
4. Reference: `seo/` - Know what we optimize for

### Business Stakeholder Understanding
1. Review: `requirements/` - See what we built
2. Understand: `crm_features/` - Features available
3. Monitor: Link to `/plans/STATUS_DASHBOARD_VISUAL.md` - Track progress

### Developer Implementation Reference
1. Study: `crm_features/` - Feature specifications
2. Check: `requirements/` - Technical requirements
3. Implement: Following `security/` and `seo/` guidelines

---

## 📊 Integration with Other Documentation

```
business_docs/          ← Business requirements & domain knowledge
├─ Links to ─→ /plans/   ← Technical implementation
                ├─ MASTER_PLAN_UPDATED_FEB_2026.md
                ├─ ARCHITECTURE.md
                └─ API_DOCUMENTATION.md
                
└─ Tracked in ─→ /plans/PRODUCTION_READINESS_VISUAL_OVERVIEW.md
```

---

## ✅ Quality Standards

All business documentation must:
- [ ] Be clear and concise
- [ ] Follow provided templates
- [ ] Include relevant cross-references
- [ ] State revision date and author
- [ ] Map to project requirements
- [ ] Support business objectives

---

## 📞 Document Ownership

Each subdirectory has an owner responsible for maintenance:

- **CRM Features**: Product Manager
- **Requirements**: Business Analyst
- **SEO**: Marketing/SEO Specialist
- **Security**: Security Officer

---

## 🚀 Getting Started

1. **For CRM Features**: Start with feature overview
2. **For Requirements**: Review business objectives first
3. **For SEO**: Understand site structure in `/plans/ARCHITECTURE.md`
4. **For Security**: Read security policies before implementation

---

**Version**: March 2026  
**Last Updated**: March 31, 2026  
**Total Documents**: 100 across 15 sections  
**Maintained By**: Business & Product Teams  
**Review Cycle**: Quarterly

For technical implementation details, see `/plans/README.md`
For quick access to common information, see `../QUICK_ACCESS_GUIDE.md`
