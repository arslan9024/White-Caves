# Business Docs Full Upgrade Checklist (2026-08-07)

**Status:** Complete / Maintenance  
**Owner:** Business & Product Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Upgrade execution checklist for full business-doc pass

Maintenance alignment note: ongoing status language across business-doc trackers should stay synchronized with `BUSINESS_DOCS_COVERAGE_MATRIX_2026-08-02.md` and `docs/plans/WAVE_PROGRESS_SUMMARY.md`.

## Objective

Track and complete the full canonical upgrade across `docs/business_docs/**` with traceability to SRS and planning waves.

## Section-by-section completion matrix

| Section | Goal | Priority | Status | Evidence |
| --- | --- | --- | --- | --- |
| `README.md` | Canonical metadata + governance + linkage alignment | P0 | ✅ Complete | Root metadata, frontend-first note, 10k SRS alignment added |
| `05_requirements/` | Authority clarity + traceability bridge | P0 | ✅ Complete | `05_requirements/README.md`, `requirements-framework.md`, `POLICY_CONTROL_INDEX_POL_SEED.md`, `REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md`, `business-rules.md`, `compliance-requirements.md`, `integration-requirements.md`, `non-functional-requirements.md`, `risk-register.md`, `user-stories.md`, `rera-compliance-checklist.md`, and `enterprise-requirement-inventory.md` normalized to authority + hybrid traceability governance |
| `09_crm_features/` | Feature-lane canonicalization + dependency/feed clarity | P0 | ✅ Complete | `09_crm_features/README.md` + `ui-ux-specification.md` + `analytics-dashboard.md` + `whatsapp-integration.md` + `tenant-portal.md` + `financial-reporting.md` + `landlord-portal.md` + `marketing-campaigns.md` + `property-management.md` + `sales-pipeline.md` + `portal-syndication.md` + `agent-performance.md` + `commission-tracking.md` + `tenancy-ejari.md` + `maintenance.md` + `document-generation.md` + `ai-chat.md` + `email-automation.md` + `market-analytics.md` + `off-plan-projects.md` + `offers.md` + `viewings.md` + `market-intelligence.md` + `property-valuation.md` + `secondary-sales.md` + `currency-management.md` + `investment-management.md` + `prospecting-outbound.md` + `activity-feed.md` + `audit-trail.md` + `follow-up-automation.md` + `client-management.md` + `lead-tracking.md` + `marketing-automation.md` + `dld-integration.md` + `legal-management.md` + `leasing-intake-forms.md` + `scheduling-calendar.md` + `handover-management.md` + `luxury-segment.md` + `community-management.md` + `careers.md` + `sentinel-property.md` + `unifiedcrm-component.md` + `package3-ai-assistant-crud.md` + `package4-advanced-ui-components.md` + `task-batching-and-priority-grouping.md` + `trakheesi-integration.md` + `seo-strategy.md` + `wave-12-automation-engine.md` + `wave-12-document-engine.md` + `wave-12-email-wiring.md` + `wave-13-realtime-notifications.md` + `wave-13-media-upload.md` + `wave-13-virtual-tour.md` + `wave-14-validation-architecture.md` + `wave-14-product-automation.md` + `wave-14-finance-features.md` + `wave-15-cache-performance.md` + `wave-15-pwa-readiness.md` + `wave-16-security-hardening.md` normalized with canonical metadata and governance/feed links |
| `12_srs/` | Business-SRS wrapper normalization and semantic link quality | P0 | ✅ Complete | `12_srs/README.md` + `12_srs/srs-master.md` + `12_srs/software-design-document.md` aligned to metadata/canonical governance links/feed targets and hybrid 10k notes |
| `13_testing/` | UAT baseline + scenario-library bridge hardening | P1 | ✅ Complete | `13_testing/uat-scenarios.md` + `13_testing/test-plan.md` + `13_testing/qa-checklist.md` aligned to metadata/canonical governance links/feed targets |
| `15_release_management/` | Rolling governance framing + canonical release links | P1 | ✅ Complete | `15_release_management/README.md` normalized with metadata, traceability feeds, and lint-clean style |
| `16_scenario_library/` | 10k scenario posture + traceability growth controls | P1 | ✅ Complete | `16_scenario_library/README.md` + `16_scenario_library/SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md` + `16_scenario_library/SCENARIO_AUTHORING_STANDARD_2026-08-03.md` + `16_scenario_library/SCENARIO_TRACEABILITY_MATRIX_SEED_2026-08-03.md` + `16_scenario_library/batches/SCENARIO_BATCH_A1_COMPLIANCE_LEASING_FINANCE_0001_0200.md` + `16_scenario_library/batches/SCENARIO_BATCH_A2_SALES_VIEWINGS_OFFERS_CONVERSION_0201_0500.md` + `16_scenario_library/batches/SCENARIO_BATCH_A3_OPERATIONS_MAINTENANCE_INCIDENTS_0501_0800.md` aligned to metadata/canonical governance links/feed targets with hybrid/frontend routing |
| Transitional directories | Consolidate or archive with explicit supersession notes | P2 | ✅ Complete | `TRANSITIONAL_DIRECTORY_SUPERSESSION_MAP_2026-08-07.md` + directory-level supersession notes: `02_leasing_property_management/README.md`, `03_regulatory_compliance_legal/README.md`, `04_marketing_communications/README.md`, and `10_design_system_and_security/README.md` |

## Mandatory quality gates

1. Canonical metadata fields present (`Status`, `Owner`, `Last Updated`, `Next Review`, `Source of Truth`).
2. Active sections use canonical `docs/*` paths only.
3. Endpoint references are validated against runtime route authority (`server/routes/*`).
4. Requirement statements are measurable and trace-linkable.
5. Business docs explicitly feed software and plans traceability artifacts.

## Traceability feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/plans/waves/WAVE_33_*` through `WAVE_40_*`

## Next implementation steps

1. Keep `REQ_CROSSWALK` backlinks synchronized when new requirement families are added.
2. Continue scenario-library expansion (`16_scenario_library/`) under the same metadata/governance contract.
3. Treat transitional folders as reference-only and update supersession markers whenever files are migrated or archived.
4. Re-run `npm run plans:validate` after each documentation slice and append evidence in `docs/plans/WAVE_PROGRESS_SUMMARY.md`.
