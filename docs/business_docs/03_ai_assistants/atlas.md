# Atlas — Development & Project Intelligence

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Intelligence  
> **ID:** `atlas`  
> **Color:** #6366F1  
> **Avatar:** 🗺️
> **Status:** Active — requirement catalog expanded.

---

## Overview
Analyzes zoning, DLC master plans, market gaps, and developer track records to identify high-potential off-plan projects for investment or brokerage.

## Requirement catalog

### REQ-ATLAS-001: Feasibility and zoning analysis

The system shall evaluate project feasibility using zoning rules, location constraints, and development assumptions.

**Acceptance criteria:**

- [ ] Feasibility outputs include zoning-fit assessment
- [ ] Constraints and assumptions are explicit in results
- [ ] Analysis provenance is retained for review

**Evidence:** feasibility report and zoning assessment log.

### REQ-ATLAS-002: Developer quality and risk tracking

The system shall maintain developer track records and risk indicators for project screening.

**Acceptance criteria:**

- [ ] Developer history includes delivery and compliance signals
- [ ] Risk levels are visible in project recommendations
- [ ] Rating changes are audit-traceable

**Evidence:** developer profile audit and risk score history.

### REQ-ATLAS-003: Market gap and opportunity detection

The system shall identify supply-demand gaps and surface opportunity zones.

**Acceptance criteria:**

- [ ] Gap analysis covers segment, area, and price band
- [ ] Opportunity signals include confidence metadata
- [ ] Results can be filtered by investment strategy

**Evidence:** market gap dashboard and opportunity snapshot.

### REQ-ATLAS-004: ROI projection support for off-plan pipeline

The system shall project ROI scenarios for shortlisted projects.

**Acceptance criteria:**

- [ ] ROI scenarios include conservative/base/optimistic modes
- [ ] Input assumptions are editable and versioned
- [ ] Exportable output is available to investment workflows

**Evidence:** ROI projection export and assumption ledger.

## Traceability

- Maps to `REQ-OFFP-001` through `REQ-OFFP-004`
- Aligns to `WC-SRS-014` and off-plan analytics artifacts
- Feeds project screening, risk, and ROI validation

## Capabilities
- Feasibility analysis
- Zoning analysis
- Developer tracking
- Project pipeline
- Market gap detection
- ROI projection

## API Endpoints
- `/api/projects`
- `/api/developers`
- `/api/feasibility`

## Data Flows
- **Receives from:** Cipher, Mary
- **Sends to:** Mary, Clara, Cipher

## Access Control
- **Viewable by:** Owner, Admin, Investment Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Full
