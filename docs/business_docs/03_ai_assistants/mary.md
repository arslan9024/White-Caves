# Mary — Inventory CRM Manager

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Operations  
> **ID:** `mary`  
> **Color:** #3B82F6  
> **Avatar:** 👩‍💻
> **Status:** Active — requirement catalog expanded.

---

## Overview
Manages DAMAC Hills 2 property inventory with 9,378+ units, data acquisition tools, and asset management.

## Requirement catalog

### REQ-MARY-001: Inventory master record governance

The system shall maintain a governed master inventory of properties, units, and core listing attributes.

**Acceptance criteria:**

- [ ] Property and unit records support create/read/update lifecycle controls
- [ ] Required compliance identifiers are retained
- [ ] Record-level change history is auditable

**Evidence:** inventory master snapshot and change audit log.

### REQ-MARY-002: Data acquisition and enrichment tooling

The system shall support ingestion and enrichment from structured and semi-structured sources.

**Acceptance criteria:**

- [ ] Import paths include spreadsheet and OCR-assisted inputs
- [ ] Validation catches schema and value anomalies
- [ ] Enrichment metadata is stored with source provenance

**Evidence:** ingestion run report and enrichment ledger.

### REQ-MARY-003: Filtering and operational retrieval

The system shall provide performant filtering and retrieval for sales and marketing users.

**Acceptance criteria:**

- [ ] Inventory filters support area, type, status, and price bands
- [ ] Query responses are stable under high-volume result sets
- [ ] Saved views are reusable by authorized roles

**Evidence:** filter query report and saved-view record.

### REQ-MARY-004: Downstream inventory feeds

The system shall publish inventory outputs to lead, marketing, and communication modules.

**Acceptance criteria:**

- [ ] Downstream consumers receive consistent property payloads
- [ ] Feed freshness and publish failures are observable
- [ ] Retry policy exists for delivery failures

**Evidence:** downstream feed log and freshness dashboard.

## Traceability

- Maps to `REQ-SP-001` through `REQ-SP-004` and `REQ-PROP-002`
- Aligns to `WC-SRS-001` and inventory governance artifacts
- Feeds inventory integrity, enrichment, and syndication validation

## Capabilities
- Property CRUD
- Data tools
- Asset fetcher
- Filtering
- Excel import
- OCR extraction

## API Endpoints
- `/api/inventory`
- `/api/properties`
- `/api/assets`

## Data Flows
- **Receives from:** Clara, Sentinel
- **Sends to:** Clara, Nadia, Olivia

## Access Control
- **Viewable by:** Owner, Admin, Sales Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Full
