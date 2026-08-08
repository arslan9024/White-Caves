# Software Requirements Specification (SRS): Sales & Brokerage

<!-- markdownlint-disable MD022 MD032 -->

## 1. System Context & Overview

The **Sales & Luxury Brokerage Module** powers the core commercial operations of White Caves Real Estate LLC. It coordinates property listing ingestion, broker squad allocation (108 squad leads across 12 departments), lead assignment, and 9,378-unit property inventory tracking across Dubai's top luxury communities.

---

## 🎨 Brand Palette Compliance

All UI components and status metrics conform to the White Caves brand palette:
- Primary Red (`#EF4444`): Active lead badges, SLA urgency tickers, map pins.
- Pure White (`#FFFFFF`): Dashboard containers, inventory cards.
- Slate Text (`#1E293B`): Clean header typography and tabular layout grids.

---

## 🔗 Inter-Linked Navigation References

- [Vision](../project_vision_manifest.md) — Master project vision, brand palette rules, and RUP framework.
- [Lead Use Case](../03_use_cases/lead_distribution_sla.md) — Operational 15-minute lead distribution SLA and Nadia WhatsApp workflow.

---

## 2. Functional Requirements

### 2.1 Lead Ingestion & 15-Minute SLA Routing
- **REQ-SALES-01**: Ingest incoming leads from Bayut, Property Finder, Dubizzle, and direct website forms in real-time.
- **REQ-SALES-02**: Enforce a strict 15-minute SLA timer for broker acknowledgment.
- **REQ-SALES-03**: If unacknowledged within 15 minutes, reassign the lead to the next available broker in the round-robin squad matrix.
- **REQ-SALES-04**: Trigger automated Nadia WhatsApp welcoming messages to leads upon successful ingestion.

### 2.2 9,378-Unit Inventory Management
- **REQ-SALES-05**: Filter properties by cluster (e.g., DAMAC Hills 2: Akoya, Basswood, Camelia, Vardon), price range (AED), status (`AVAILABLE`, `UNDER_OFFER`, `SOLD`, `RENTED`), and property type.
- **REQ-SALES-06**: Display live interactive Google Maps rendering pins with White Caves Red (`#EF4444`) markers.

### 2.3 4-Column Drag-and-Drop Kanban
- **REQ-SALES-07**: Support workflow states: `NEW_LEAD` ➔ `CONTACTED` ➔ `VIEWING_SCHEDULED` ➔ `CLOSING_OFFER`.
- **REQ-SALES-08**: Provide quick-action modals for note additions, phone calls, and contract drafting on card click.

### 2.4 P0 Listing-to-Leasing Priority Extension (MD + Leasing Agent)

- **REQ-SALES-09**: Listing records flagged for lease intent must expose leasing-readiness status before viewing confirmation.
- **REQ-SALES-10**: Lead routing for leasing-intent leads shall prioritize `leasing_agent` assignment queues with SLA visibility.
- **REQ-SALES-11**: Executive oversight view shall expose unresolved leasing lead SLA breaches to `owner` users.
- **REQ-SALES-12**: The first-agent leasing scenario profile (`agent.one.whitecaves@gmail.com`) shall be represented in acceptance test journeys for lead-to-lease continuity.

### 2.5 Traceability anchors for P0 extension

- Business linkage: `docs/business_docs/09_crm_features/property-management.md`
- Workflow linkage: `docs/business_docs/04_workflows/lead-to-sale-flowchart.md`
- Role linkage: `docs/business_docs/09_user_roles_permissions/roles-matrix.md`
