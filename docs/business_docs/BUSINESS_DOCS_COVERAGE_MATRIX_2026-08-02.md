# Business Docs Coverage Matrix — 2026-08-03

**Scope:** Validate whether White Caves has full business documentation coverage for company profile, organization structure, services, inventory, finance/accounts, HR, policies, vision, and Dubai trend alignment.

---

## 1) Coverage Summary

| Domain | Coverage | Primary Source(s) | Gap / Action |
| --- | --- | --- | --- |
| Company profile & identity | ✅ Strong | `00_master_corporate_credentials.md`, `01_company_structure/README.md` | Normalize legacy links to canonical `docs/company_documents/*` paths |
| Vision / mission / strategic direction | ✅ Strong | `01_company_structure/README.md`, `07_business_model/business-model-canvas.md` | Add annual strategic refresh cadence in upgrade roadmap |
| Organization structure & roles | ✅ Strong | `01_company_structure/departments.md`, `roles.md`, `stakeholder-register.md`, `100_role_hierarchy.md` | Maintain role matrix synchronization with auth model changes |
| Services catalog | ✅ Strong | `02_services/dubai-agency-services.md` | Add versioned pricing/commission review window per quarter |
| Inventory operating model | ✅ Strong | `09_crm_features/property-management.md`, `sentinel-property.md` | Add monthly inventory data-quality KPI checkpoint |
| Finance & accounts model | ✅ Strong | `07_business_model/revenue-model.md`, `white-caves-commission-engine-spec.md`, `09_crm_features/financial-reporting.md` | Add explicit close-calendar and reconciliation calendar reference |
| HR model & policies | 🟡 Partial-to-Strong | `01_company_structure/employee-payroll-handbook.md`, `04_workflows/agent-onboarding-workflow.md`, role docs | Consolidate HR policy index (leave, discipline, performance, onboarding/offboarding) in one entrypoint |
| Legal / compliance / AML / PDPL | ✅ Strong | `05_requirements/compliance-requirements.md`, `05_requirements/rera-compliance-checklist.md`, `05_requirements/risk-register.md`, `09_user_roles_permissions/`, `TRANSITIONAL_DIRECTORY_SUPERSESSION_MAP_2026-08-07.md` | Ensure regulation update cadence references 2026+ changes quarterly |
| Scenario Library (A-to-Z) | ✅ Strong (Phase A complete) | `16_scenario_library/README.md`, `16_scenario_library/SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md`, `16_scenario_library/batches/SCENARIO_BATCH_A1_COMPLIANCE_LEASING_FINANCE_0001_0200.md`, `16_scenario_library/batches/SCENARIO_BATCH_A2_SALES_VIEWINGS_OFFERS_CONVERSION_0201_0500.md`, `16_scenario_library/batches/SCENARIO_BATCH_A3_OPERATIONS_MAINTENANCE_INCIDENTS_0501_0800.md` | Continue phased expansion from 800 to 10,000 scenarios using traceability-gated batches |
| Market & Dubai trend intelligence | ✅ Strong | `08_integrations_and_research/dubai-market-analysis-2026.md`, `competitor-analysis.md`, `technology_upgrades.md` | Add trend-watch KPI cadence and owner assignment |
| Release/operations governance | ✅ Strong | `14_devops/*`, `15_release_management/*` | Add business-side release communication SOP summary |

---

## 2) Canonical Business Documentation Architecture

Use this as the authoritative map:

- `01_company_structure/` — legal profile, governance, hierarchy, staffing
- `02_services/` — service lines, customer segments, delivery model
- `05_requirements/` + `09_user_roles_permissions/` — active compliance, policy, and legal-control authority
- `03_regulatory_compliance_legal/` + `10_design_system_and_security/` — transitional/reference-only compliance history (see supersession map)
- `04_workflows/` — operational process flow and departmental runbooks
- `05_requirements/` + `06_design_architecture/` + `12_srs/` — requirements-to-design business-to-technical chain
- `07_business_model/` — revenue, costs, finance model, value architecture
- `08_integrations_and_research/` — Dubai market trends and competitive intelligence
- `09_crm_features/` + `09_user_roles_permissions/` — operating capability spec and policy controls
- `13_testing/`, `14_devops/`, `15_release_management/` — delivery quality + continuity governance

---

## 3) Dubai Trends Alignment Checklist (2026)

| Trend                                         | Current Coverage | Evidence                                                                       |
| --------------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| Off-plan demand and phased handover economics | ✅               | `off-plan-projects.md`, `dubai-market-analysis-2026.md`                        |
| Rental index changes / renewal pressure       | ✅               | `tenancy-ejari.md`, `dubai-regulatory-framework.md`, Smart Rental Index notes  |
| Golden Visa investment behavior               | ✅               | `02_services/dubai-agency-services.md`, market/persona docs                    |
| Compliance tightening (RERA / AML / PDPL)     | ✅               | `compliance-requirements.md`, `kyc-aml-framework.md`, `uae-pdpl-compliance.md` |
| Multi-channel lead acquisition efficiency     | ✅               | `marketing-campaigns.md`, `portal_lead_ingestion_sla.md`                       |
| Executive KPI and profitability governance    | ✅               | `analytics-dashboard.md`, `financial-reporting.md`, business model docs        |

---

## 4) Priority Upgrade Actions (Business Layer)

1. Create a unified HR policy index document and route all HR references there.
2. Normalize all credential references to `docs/company_documents/` canonical files.
3. Add quarterly market/regulatory review calendar with named ownership.
4. Add monthly inventory and finance data-quality reconciliation checkpoints.
5. Add business release communication SOP linking Ops + Compliance + Executive reporting.

---

## 5) Completion Definition for Business Layer Refresh

Business documentation is considered **up-to-date** when:

- all high-level domains above have a single canonical index path;
- HR and policy documents are linked from one discoverable root;
- Dubai trend watch cadence (quarterly) is documented with owners;
- company credentials references point to canonical `docs/company_documents/` paths;
- related planning tasks are reflected in `docs/plans/PENDING_TASKS_ONLY.md` and wave documents.
