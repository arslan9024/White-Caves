# Requirement Crosswalk

**Status:** Active / Priority-Lane Gate Complete  
**Owner:** @Margaret + @Mala  
**Last Updated:** 2026-08-08

This artifact seeds the canonical mapping between business-domain requirement IDs and software realization surfaces.

## Crosswalk rules

- Business requirement IDs (`REQ-*`) remain the authoritative identifiers for business intent.
- Software artifacts may realize one or more business requirements through SRS, SDD, use cases, ADRs, routes, or tests.
- Where the software layer uses broader architectural documents rather than one-file-per-requirement specs, this crosswalk records the nearest authoritative implementation surface.

## Priority requirement mappings

| Business requirement / source | Software realization surface | Validation / governance surface | Notes |
| --- | --- | --- | --- |
| `docs/business_docs/05_requirements/functional-requirements.md` | `docs/software_docs/01_requirements_engineering/functional_specifications.md` | Wave 32 governance docs | Primary business-to-software requirements bridge |
| `REQ-AUTH-001` User Login | `docs/software_docs/adr/ADR-001-auth-dual-provider.md`; `docs/software_docs/backend/api_architecture.md` | Auth route/tests; Wave 19 identity hardening evidence | Login authority and token issuance |
| `REQ-AUTH-002` 2FA | `docs/software_docs/adr/ADR-001-auth-dual-provider.md` | Auth feature tests / future dedicated 2FA specs | Shares identity architecture surface |
| `REQ-AUTH-003` Firebase Social Login | `docs/software_docs/adr/ADR-001-auth-dual-provider.md` | Firebase sync flow validation | Social-auth path under dual-provider architecture |
| `REQ-AUTH-004` RBAC | `docs/software_docs/02_software_design/rbac_state_gating.md`; `docs/software_docs/01_requirements_engineering/functional_specifications.md` | `RBAC_ROLE_TO_LEVEL_MAP.md`; route-guard tests | Business roles collapse into software access levels |
| `REQ-AUTH-005` Password Reset | `docs/software_docs/backend/api_architecture.md` | Auth route tests and identity wave evidence | Needs direct requirement backlink later |
| `REQ-LEAD-001` Create Lead | `docs/software_docs/03_use_cases/lead_ingestion_lifecycle.md` | Lead route/tests; Wave 18.1 evidence | Lead creation + ingestion entry path |
| `REQ-LEAD-002` Lead List / Filtering | `docs/software_docs/01_requirements_engineering/functional_specifications.md` | CRM UI / API tests | Filter and access behavior still documented at module level |
| `REQ-LEAD-004` Lead Status Pipeline | `docs/software_docs/01_requirements_engineering/functional_specifications.md` | Pipeline UI tests | Candidate for dedicated use-case link later |
| `REQ-LEAD-005` Lead Scoring | `docs/software_docs/03_use_cases/lead_ingestion_lifecycle.md` | Lead scoring service tests / analytics evidence | AI scoring occurs inside ingestion lifecycle |
| `REQ-LEAD-007` Lead Assignment | `docs/software_docs/03_use_cases/lead_distribution_sla.md` | SLA / assignment tests | Assignment and SLA are tightly coupled |
| `REQ-PROP-007` RERA Compliance Tracking | `docs/software_docs/backend/api_architecture.md`; `docs/software_docs/01_requirements_engineering/functional_specifications.md` | `COMPLIANCE_CONTROL_MATRIX.md`; Wave 20 and compliance route tests | Business requirement realized through compliance guards |
| `REQ-PROP-008` Portal Syndication | `docs/software_docs/backend/api_architecture.md` | Portal sync tests / future syndication docs | Integration-heavy; business feature spec remains key |
| `REQ-WA-001` Multi-Agent WhatsApp Inbox | `docs/software_docs/01_requirements_engineering/functional_specifications.md`; `docs/software_docs/03_use_cases/lead_distribution_sla.md` | WhatsApp route/tests; Wave 24 evidence | Partial backend noted in business requirements |
| `REQ-WA-003` Lead Creation from WhatsApp | `docs/software_docs/03_use_cases/lead_ingestion_lifecycle.md` | WhatsApp→lead tests | Mapped to inbound conversion flow |
| `REQ-WA-004` WhatsApp Bot | `docs/software_docs/03_use_cases/lead_distribution_sla.md`; `ADR-001` auth context indirectly | Wave 24 AI/WhatsApp tests | Bot response and escalation behavior |
| `REQ-PIPELINE-004` Commission Calculation | `docs/software_docs/01_requirements_engineering/functional_specifications.md` | Finance / commission tests | Needs deeper finance-specific software mapping later |
| `REQ-COMP-001` RERA Compliance Dashboard | `docs/software_docs/backend/api_architecture.md`; `docs/software_docs/01_requirements_engineering/functional_specifications.md` | `COMPLIANCE_CONTROL_MATRIX.md` | Compliance dashboard is route + reporting driven |
| `REQ-RPT-001` Executive Dashboard | `docs/software_docs/01_requirements_engineering/functional_specifications.md` | Wave 19 dashboard evidence | Executive reporting bridge |

## Expanded implementation evidence mappings (Wave 32 continuation)

| Requirement | Runtime endpoint evidence | Validation evidence | Notes |
| --- | --- | --- | --- |
| `REQ-LEAD-003` Lead Detail View | `server/routes/leads.ts` (`GET /api/leads/:id`) | `server/routes/leads.test.ts` | Lead detail retrieval includes assignee, property, and activity context. |
| `REQ-LEAD-010` Follow-up Reminders | `server/routes/follow-ups.ts` | `server/routes/follow-ups.test.ts` | Follow-up sequencing and cadence execution are routed and test-backed. |
| `REQ-PROP-001` Add Property | `server/routes/properties.ts` (`POST /api/properties`) | `server/routes/properties.test.ts` | Property creation validates required fields and authorization constraints. |
| `REQ-PROP-002` Property List with Advanced Filtering | `server/routes/properties.ts` (`GET /api/properties`, `/api/properties/facets`) | `server/routes/properties.test.ts` | Filtering facets (status/type/price/furnishing/handover/permit/feeBand) are implemented. |
| `REQ-FIN-001` Commission Management | `server/routes/finance.ts` (`/api/finance/commissions/*`); `server/routes/commissions.ts` (`/api/commissions*`) | `server/routes/finance.test.ts`; `server/routes/commissions.test.ts` | Commission lifecycle is covered in both finance and dedicated commissions surfaces. |
| `REQ-FIN-002` Financial Summary Dashboard | `server/routes/finance.ts` (`GET /api/finance/summary`) | `server/routes/finance.test.ts` | Summary aggregation includes revenue/commission and by-type rollups. |
| `REQ-FIN-004` Rent Collection Tracking | `server/routes/leases.ts` (`GET /api/leases/:id/pdc`, `PATCH /api/leases/:id/pdc/:pdcId`) | `server/routes/rent-payments.test.ts`; `server/routes/leases.test.ts` | Lease PDC schedule and payment-state transitions provide rent-collection evidence. |
| `REQ-TENANT-004` Maintenance Request Management | `server/routes/maintenance.ts`; `server/routes/tenantPortal.ts` (`/api/portal/tenant/maintenance`) | `server/routes/maintenance.test.ts`; `server/routes/tenantPortal.test.ts` | Tenant and operational maintenance flows are both represented. |
| `REQ-TENANT-005` Tenant Portal Home Dashboard | `server/routes/tenantPortal.ts` (`GET /api/portal/tenant/dashboard`) | `server/routes/tenantPortal.test.ts` | Portal KPI summary for active lease and maintenance signals is implemented. |
| `REQ-WA-006` Webhook Verification and Message Persistence | `server/routes/meta-webhook.ts` (`GET /api/webhooks/meta/verify`, `POST /api/webhooks/meta`) | `server/routes/meta-webhook.test.ts`; `server/routes/meta-webhook.routes.test.ts` | Meta webhook verification and inbound persistence/lead creation behavior are test-covered. |

## Compliance link rule

`COMP-*` requirement mappings are maintained in [`COMPLIANCE_CONTROL_MATRIX.md`](./COMPLIANCE_CONTROL_MATRIX.md)
because they require additional regulatory, retention, and evidence metadata beyond the functional `REQ-*` catalog.

## Priority-lane semantic traceability gate (UPG-REF-003 complete)

| Lane | Requirement anchor | Endpoint / route evidence | Service / logic evidence | Test evidence | Release / governance evidence |
| --- | --- | --- | --- | --- | --- |
| Listings | `REQ-PROP-008` Portal Syndication; `REQ-PROP-007` RERA Compliance Tracking | `server/routes/properties.ts` (`/api/properties`, `/api/properties/:id`, inventory + completeness surfaces) | `server/services/PropertiesService.ts` | `server/routes/properties.test.ts`; `server/routes/property-inventory.test.ts` | `docs/plans/WAVE_PROGRESS_SUMMARY.md`; `docs/plans/PENDING_TASKS_ONLY.md` |
| Leasing | `REQ-LEAD-007` Lead Assignment (leasing workflow coupling); lease lifecycle requirements in business docs | `server/routes/leases.ts` (`/api/leases`, `/api/leases/intake`, `/api/leases/expiring`, `/api/leases/:id/pdc`) | `server/services/compliance/complianceService.ts`; `server/services/SchedulerService.ts` | `server/routes/leases.test.ts`; `server/routes/tenancy-contracts.test.ts` | `docs/plans/WAVE_PROGRESS_SUMMARY.md`; `docs/plans/PENDING_TASKS_ONLY.md` |
| Receipts | receipts and document-generation requirements in `docs/business_docs/09_crm_features/document-generation.md` | `server/routes/documents.ts` (`POST /api/documents/generate`, `GET /api/documents/:id`, `PATCH /api/documents/:id/status`) | `server/services/DocumentService.ts`; `server/services/documents/documentGenerator.js` | `server/routes/documents.test.ts`; `server/routes/documents.autofill.test.ts` | `docs/software_docs/01_requirements_engineering/SRS_INSIGHTS_REPORT_2026-08-07.md`; `docs/plans/WAVE_PROGRESS_SUMMARY.md` |

Gate rule:

- A priority-lane requirement is considered semantically traceable only when all five evidence columns are populated and reference existing artifacts.

Closure note:

- `UPG-REF-003` is complete for the defined priority lanes (`Listings`, `Leasing`, `Receipts`) because each lane now resolves to populated requirement, route, service, test, and governance evidence surfaces.

## Next expansion targets

1. Expand from priority requirement mappings to full `REQ-*` coverage.
2. Add direct route/test file references where stable and beneficial.
3. Add bidirectional backlinks from software docs where practical.
