# Business-Document Inventory — White Caves Enterprise Requirements

**Status:** Active  
**Owner:** Requirements Governance + Product Strategy  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-document package inventory mapped to enterprise SRS counterparts

> Version: 1.0  
> Last Updated: 2026-08-07  
> Purpose: Master catalog of business-doc artifacts that support the enterprise SRS set.

## Canonical governance links

- [`README.md`](./README.md)
- [`requirements-framework.md`](./requirements-framework.md)
- [`REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md`](./REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md)
- [`../../software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md`](../../software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md`
- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/waves/WAVE_35_IMPLEMENTATION_BACKLOG.md`

## Inventory Objective

This inventory aligns the business documentation corpus to the software requirements inventory so that each delivery scope can be traced from business intent to implementation contract.

## Coverage Summary

- Total business-doc packages indexed: 18
- Coverage includes requirement artifacts, workflow documents, CRM feature specs, compliance docs, and design artifacts
- Governance rule: every business-doc package should map to an SRS and a delivery owner

## Business-Doc Inventory

| ID | Business-Doc Package | SRS Counterpart | Core Artifacts | Primary Owner | Status |
| --- | --- | --- | --- | --- | --- |
| BD-001 | Requirements Foundation | WC-SRS-001 | Functional requirements, non-functional requirements, business rules, risk register | Product | Active |
| BD-002 | Sales Operations | WC-SRS-002 | Lead-management docs, pipeline docs, offer workflow docs, sales CRM specs | Sales Ops | Active |
| BD-003 | Inventory & Property Master Data | WC-SRS-003 | Property inventory docs, valuation docs, market intelligence docs | Inventory | Active |
| BD-004 | Leasing & Tenancy Operations | WC-SRS-004 | Tenancy-Ejari docs, landlord portal docs, legal-management docs | Leasing | Active |
| BD-005 | Finance & Revenue Management | WC-SRS-005 | Financial-reporting docs, revenue-model docs, payout rules | Finance | Active |
| BD-006 | Compliance & Regulatory Governance | WC-SRS-006 | Compliance requirements, PDPL docs, AML docs, risk register | Compliance | Active |
| BD-007 | Operations & Service Delivery | WC-SRS-007 | Workflow docs, maintenance docs, handover-management docs | Operations | Active |
| BD-008 | Marketing & Growth | WC-SRS-008 | Marketing campaigns docs, SEO strategy docs, campaign attribution docs | Marketing | Active |
| BD-009 | AI Assistants & Automation | WC-SRS-009 | AI assistants README, integration map, persona capability docs | AI Product | Active |
| BD-010 | Tenant & Landlord Experience | WC-SRS-010 | Tenant portal docs, landlord portal docs, portal UX requirements | CX / Portal | Active |
| BD-011 | Scheduling & Viewing Operations | WC-SRS-011 | Scheduling-calendar docs, viewing docs, appointment flow docs | Sales Ops | Active |
| BD-012 | Document & Signature Workflows | WC-SRS-012 | Document-generation docs, legal-management docs, tenant document docs | Operations | Active |
| BD-013 | Analytics & Executive Reporting | WC-SRS-013 | Analytics-dashboard docs, market-analytics docs, reporting docs | Analytics | Active |
| BD-014 | Mobile & PWA Experience | WC-SRS-014 | UI-UX specification docs, mobile research docs, responsive design docs | UX | Active |
| BD-015 | Integration & API Ecosystem | WC-SRS-015 | Integration requirements, integration-map, external API docs | Platform | Active |
| BD-016 | Security, Audit & Privacy | WC-SRS-016 | Audit-trail docs, privacy docs, security requirements | Security | Active |
| BD-017 | Market Intelligence & Valuation | WC-SRS-017 | Property-valuation docs, market-intelligence docs, pricing model docs | Market Intelligence | Active |
| BD-018 | Off-Plan Delivery & Handover | WC-SRS-018 | Off-plan-projects docs, handover-management docs, project delivery docs | Projects | Active |

## Mapping Rule

Each business-doc package should include:

- a direct SRS counterpart,
- the business objective it serves,
- the implementation dependencies it informs,
- and the validation evidence required for sign-off.

## Maintenance Rule

Update this inventory whenever:

- a new business-doc package is created,
- an existing package changes owners,
- a business rule materially shifts delivery scope,
- or a new SRS is added to the platform.
