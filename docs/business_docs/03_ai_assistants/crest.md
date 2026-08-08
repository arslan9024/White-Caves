# Crest — Property Valuation Engine (AVM)

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** data_and_ai  
> **ID:** `crest`  
> **Color:** #10B981  
> **Avatar:** 🏠
> **Status:** Active — requirement catalog expanded.

---

## Identity
- **Name:** Crest
- **Role:** Property Valuation Engine (AVM)
- **Department:** data_and_ai
- **Dashboard:** `/owner/dashboard?tab=crest`

## Context
Provides automated property valuations based on comparable DLD transactions, area trends, and market demand signals with a confidence score

## Requirement catalog

### REQ-CREST-001: Automated valuation generation

The system shall generate automated property valuations from approved market inputs.

**Acceptance criteria:**

- [ ] Valuation outputs include value and confidence score
- [ ] Input data provenance is retained
- [ ] Missing critical inputs trigger safe fallback behavior

**Evidence:** AVM run output and input provenance log.

### REQ-CREST-002: Comparable transaction analysis

The system shall select and evaluate comparable transactions for valuation support.

**Acceptance criteria:**

- [ ] Comparable set criteria are explicit and configurable
- [ ] Outlier handling is documented in output
- [ ] Comparable references are auditable

**Evidence:** comparable selection report and valuation rationale export.

### REQ-CREST-003: Bulk valuation and throughput controls

The system shall support bulk valuation jobs with operational observability.

**Acceptance criteria:**

- [ ] Bulk jobs expose status and progress tracking
- [ ] Failed records are isolated with retry paths
- [ ] Job outcomes are exportable for review

**Evidence:** bulk valuation job report and retry ledger.

### REQ-CREST-004: Valuation history and governance

The system shall maintain valuation history with traceable changes over time.

**Acceptance criteria:**

- [ ] Historical valuations are queryable per property
- [ ] Significant valuation deltas are flagged
- [ ] Access and override actions are audited

**Evidence:** valuation history report and governance audit log.

## Traceability

- Maps to market analytics and valuation controls in CRM docs
- Aligns to `WC-SRS-010` and data/AI valuation artifacts
- Feeds pricing, investment, and reporting validation

## Capabilities
- `automated_valuation`
- `comparable_analysis`
- `confidence_scoring`
- `bulk_valuation`
- `valuation_history`

## API Endpoints
- `/api/valuation/property`
- `/api/valuation/bulk`
- `/api/valuation/history`

## Access Control
- **Viewable by:** owner, admin, sales_manager, investment_manager
- **Accessible by:** owner, admin
- **Data access level:** full
