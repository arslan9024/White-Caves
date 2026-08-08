# Functional Specifications & Departmental System Bounds — White Caves Real Estate

> **Document Class:** Requirements Engineering (SRS)  
> **Repository Path:** `software_docs/01_requirements_engineering/functional_specifications.md`  
> **Brand Canvas:** White Caves Red (`#EF4444`) | Crisp White (`#FFFFFF`) | Deep Slate Gray (`#1E293B`)  
> **System Architecture:** RUP 4-Tier Component Isolation (View-Logic-Style)  
> **Status:** Active / Traceability Expansion In Progress  
> **Last Updated:** 2026-08-02

---

## Canonical traceability links

- [`../../business_docs/05_requirements/functional-requirements.md`](../../business_docs/05_requirements/functional-requirements.md)
- [`../../business_docs/09_crm_features/README.md`](../../business_docs/09_crm_features/README.md)
- [`../02_software_design/rbac_state_gating.md`](../02_software_design/rbac_state_gating.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`](../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md)

## Purpose of this document

This file translates business-domain requirements into software-facing operating bounds,
departmental system partitions, and access-model assumptions. It should be read alongside the
business requirement catalog rather than as a replacement for it.

## Normalization priorities

Wave 32 expands this document toward:

1. explicit requirement realization references;
2. alignment with canonical RBAC/access-level mapping;
3. direct links to use cases, SDDs, and verification surfaces.

---

## 🏛️ 1. Primary Corporate Departments (12 Boundaries)

1. **Residential Brokerage Sales Hub**: Drag-and-drop 4-column lead grid, pipeline velocity tracking, broker targets, secondary inventory matching.
2. **Strategic Off-Plan & Development**: Developer relations, launch carousels, tier matrices, unit allocation, SPA generation, construction milestone tracking.
3. **Commercial Real Estate & Investment**: Commercial asset portfolio, ROI calculators, multi-currency treasury, institutional investor pitch decks.
4. **Portfolio Management & Residential Leasing**: High-volume rental dashboard, automated Ejari contract lifecycles, PDC cheque schedule, lease renewals, Form 7 rent increase notices.
5. **Asset Management & Facilities (DH2 Hub)**: 9,378-unit DAMAC Hills 2 master property matrix, cluster tiles, occupancy color badges, maintenance work order kanban.
6. **Revenue, Finance & Treasury**: Automated 4-step financial approval workflow (Agent Submitted ➔ Manager Approved ➔ Finance Locked ➔ Payment Released), AR aging, UAE FTA VAT 5% return export.
7. **Performance Marketing & Lead Acquisition**: Marketing ROI scoreboard, lead capture forms, social campaign publisher, email nurture sequence builder.
8. **Corporate Communications & Client Experience**: Nadia WhatsApp routing pool, 15-minute SLA timer, automated client response tickers.
9. **Executive Office & Strategy**: Managing Director flight deck, cross-department aggregator, global telemetry, 0-token debugging central trace.
10. **Regulatory Affairs & RERA Compliance**: RERA/DLD permit checklist, Form 12 eviction timelines, Form 6 lease contract logs, UAE PDPL data privacy audit.
11. **Conveyancing & Transaction Management**: E-Signature collection flow, title deed transfer tracker, DLD escrow account monitor, Oqood registration.
12. **Technology, AI & Market Intelligence**: AI Assistant Avatar Hub, Sentinel predictive pricing map, IoT property health sensor anomaly heatmaps.

---

## 🔒 2. Role-Based Access Control (RBAC) Hierarchy

```text
LEVEL 5: MASTER (Managing Director / Founder) ──► Full Platform Read/Write/Override + Ghost Session Impersonation
LEVEL 4: EXECUTIVE (CTO, CFO, COO)             ──► Department Oversight + Financial Approvals + Telemetry
LEVEL 3: DEPARTMENT MANAGER                    ──► Team Allocation + Deal Approval + Commission Releases
LEVEL 2: SENIOR / LICENSED BROKER              ──► Active Listing CRUD + Pipeline Management + Lead Intake
LEVEL 1: ASSOCIATE / CLIENT PORTAL             ──► Assigned Listing Views + Self-Service Document Drawer
```

This hierarchy is a software-facing access abstraction and must be reconciled with the richer
business-facing role catalogs in:

- `docs/business_docs/01_company_structure/roles.md`
- `docs/business_docs/09_user_roles_permissions/roles-matrix.md`
- `docs/plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`

---

## 💰 3. 12-Point Financial Module Specifications

- **TRN Invoice Generation**: Auto-generated 15-digit Tax Registration Number invoices with FTA 5% VAT breakdown.
- **Commission Split Calculator**: Gross to Net split calculation with agent accelerator thresholds (e.g. 50/50, 60/40, 70/30).
- **Accounts Receivable (AR) Aging**: 30 / 60 / 90 / 90+ day aging buckets with automated dunning triggers.
- **4-Step State Approval Flow**: Strict state machine transitions preventing payout without Finance Lock.
- **UAE Corporate Tax Calendar**: 9% tax liability calculator for taxable net income exceeding AED 375,000 threshold.
