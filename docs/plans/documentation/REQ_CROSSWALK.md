# Requirement Crosswalk

**Status:** Draft  
**Owner:** @Margaret + @Mala  
**Last Updated:** 2026-08-02

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

## Compliance link rule

`COMP-*` requirement mappings are maintained in [`COMPLIANCE_CONTROL_MATRIX.md`](./COMPLIANCE_CONTROL_MATRIX.md)
because they require additional regulatory, retention, and evidence metadata beyond the functional `REQ-*` catalog.

## Next expansion targets

1. Expand from priority requirement mappings to full `REQ-*` coverage.
2. Add direct route/test file references where stable and beneficial.
3. Add bidirectional backlinks from software docs where practical.
