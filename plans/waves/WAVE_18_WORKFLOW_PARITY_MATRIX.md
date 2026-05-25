# Wave 18 — Workflow Parity Matrix (v1)

**Date:** 2026-05-25  
**Scope:** Top 5 benchmark platforms + White Caves internal coverage audit  
**Parity Model:** UAE-adapted parity (outcome-equivalent, compliance-first)

## Legend

- **Included:** implemented end-to-end
- **Partial:** documented or partially implemented
- **Missing:** no meaningful implementation signal
- **Unknown:** external evidence incomplete; needs verification task

---

## External Platform Snapshot (v1)

| Workflow Category | Property Finder | Bayut | Dubizzle | Betterhomes | Allsopp & Allsopp |
| --- | --- | --- | --- | --- | --- |
| Lead capture | Included | Included | Included | Included | Included |
| Listing lifecycle | Included | Included | Included | Included | Included |
| Viewings | Partial | Included | Included | Included | Included |
| Offers/negotiation | Partial | Partial | Partial | Included | Included |
| Contracts/docs | Missing | Missing | Missing | Partial | Partial |
| Payments/collections | Missing | Missing | Missing | Partial | Partial |
| Leasing/tenant ops | Partial | Partial | Partial | Included | Included |
| Compliance workflows | Partial | Partial | Partial | Unknown | Unknown |
| Reporting/analytics | Included | Included | Included | Partial | Partial |
| WhatsApp/comms automation | Partial | Partial | Partial | Unknown | Unknown |

> Note: Portal products (PF/Bayut/Dubizzle) are primarily lead/listing channels and typically defer contracts/payments/core tenancy execution to agency CRMs.

---

## White Caves Coverage Matrix (v1 top workflows)

| # | Workflow Task | White Caves Doc Coverage | White Caves Code Coverage | Validation Evidence | Status | Gap Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Inbound lead capture | `business_docs/04_workflows/README.md` | `server/routes/leads.ts` + `/api/leads` in `server/index.ts` | Requirements module Lead Mgmt | Included | - |
| 2 | Lead scoring/qualification | `business_docs/09_crm_features/lead-tracking.md` | `LeadScoringModule` in `src/config/crmModuleRegistry.tsx` | `REQ-LEAD-005` implemented | Included | - |
| 3 | Lead import (CSV/XLSX) | `functional-requirements.md` (`REQ-LEAD-008`) | no complete lead import workflow evidence in active queue | Planned requirement only | Partial | P0 |
| 4 | Lead follow-up reminders | `functional-requirements.md` (`REQ-LEAD-010`) + `follow-up-automation.md` | `/api/follow-ups` routes present | Planned in requirements, partial route surface | Partial | P1 |
| 5 | Listing CRUD lifecycle | `property-management.md` + workflow docs | `server/routes/properties.ts` + `/api/properties` | `REQ-PROP-001/002/004` implemented | Included | - |
| 6 | RERA permit lifecycle automation | `business-rules.md` BR-004 | partial compliance modules/routes | `REQ-PROP-007` planned | Partial | P0 |
| 7 | Portal syndication (PF/Bayut) | `functional-requirements.md` (`REQ-PROP-008`) | no confirmed production syndication route contract | Planned requirement | Missing | P1 |
| 8 | Viewing scheduling and status | `viewings.md` + workflows | `server/routes/viewings.ts` + `/api/viewings` | Viewing routes in index | Included | - |
| 9 | Offers/counteroffers | `offers.md` | `server/routes/offers.ts` + `/api/offers` | Offers route + tests file exists | Included | - |
| 10 | Contract generation/e-sign flows | `legal-management.md` + `document-generation.md` | `/api/contracts`, `/api/documents` routes present | Docs and routes present | Partial | P1 |
| 11 | Transaction closure + fee lines | `sales-pipeline.md` + finance docs | `server/routes/transactions.ts` | `REQ-PIPELINE-002` implemented | Included | - |
| 12 | Commission workflow | `commission-tracking.md` | `server/routes/commissions.ts` + finance routes | `REQ-FIN-001` implemented | Included | - |
| 13 | Rent collection + overdue | `tenancy-ejari.md` + workflows | finance + lease route surfaces exist | `REQ-FIN-004` planned | Partial | P0 |
| 14 | Ejari tracking | `tenancy-ejari.md` | lease/tenant routes available | `REQ-TENANT-003` planned | Partial | P0 |
| 15 | Maintenance request lifecycle | `maintenance.md` + workflow docs | `server/routes/maintenance.ts` + `/api/maintenance` | Maintenance routes + tests | Included | - |
| 16 | WhatsApp lead conversion from inbox | `whatsapp-integration.md` | whatsapp routes in `server/index.ts` | `REQ-WA-003` planned | Partial | P0 |
| 17 | WhatsApp bot escalation | `business_docs/04_workflows/README.md` + `whatsapp-integration.md` | `/api/nina`, `/api/whatsapp/chatbot/*` route surfaces | `REQ-WA-004` planned | Partial | P1 |
| 18 | Broadcast campaigns | `marketing-campaigns.md` + `whatsapp-integration.md` | communications/whatsapp surfaces exist | `REQ-WA-005` planned | Partial | P1 |
| 19 | KYC verification gate | `compliance-requirements.md` + `business-rules.md` BR-008 | `/api/compliance` route surface | `REQ-COMP-002` planned | Partial | P0 |
| 20 | Immutable audit log + export | `audit-trail.md` | `server/routes/activities.ts`, compliance routes | `REQ-COMP-003` basic implemented | Partial | P1 |
| 21 | Executive analytics dashboard | `analytics-dashboard.md` + reporting docs | reporting/analytics routes + module registry | `REQ-RPT-001` implemented | Included | - |
| 22 | Agent performance report export | `agent-performance.md` | partial reporting surfaces | `REQ-RPT-002` planned | Partial | P1 |
| 23 | Property performance report | `market-analytics.md` | partial reporting surfaces | `REQ-RPT-003` planned | Partial | P2 |
| 24 | Tenant portal workflows | `tenant-portal.md` | `/api/portal/tenant` in `server/index.ts` | Dedicated route mounted | Included | - |
| 25 | Landlord portal workflows | `landlord-portal.md` | `/api/landlord` in `server/index.ts` | Dedicated route mounted | Included | - |
| 26 | Admin settings + audit controls | `functional-requirements.md` (`REQ-ADMIN-002`) | admin/platform route surfaces exist | planned requirement remains | Partial | P2 |
| 27 | Backup/restore governance | `functional-requirements.md` (`REQ-ADMIN-003`) | no direct workflow closure evidence in queue | planned requirement remains | Missing | P2 |

---

## Workflow Parity Dashboard (v1)

### White Caves Coverage Counts

- Included: 11
- Partial: 14
- Missing: 2
- Unknown: 0

### Highest Priority Gaps (Immediate Queue Candidates)

1. Lead import (`REQ-LEAD-008`) — P0
2. RERA permit lifecycle completion (`REQ-PROP-007`) — P0
3. WhatsApp lead conversion (`REQ-WA-003`) — P0
4. KYC verification gate (`REQ-COMP-002`) — P0
5. Rent collection workflow completion (`REQ-FIN-004`) — P0
6. Ejari tracking completion (`REQ-TENANT-003`) — P0

---

## Next Iteration Rules

1. Weekly external re-check refreshes benchmark columns.
2. Any status changes require evidence path updates.
3. Newly discovered gaps must be added to the next implementation backlog wave.
