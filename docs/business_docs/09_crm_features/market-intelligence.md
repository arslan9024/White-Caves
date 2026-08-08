# Market Intelligence

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** CipherMarket module for Dubai area price index, transaction volumes and RERA rental index.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM market intelligence feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend analytics/reporting refinement lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The market intelligence module provides area pricing, transaction trends, supply-demand signals, and monthly reporting for decision makers.

## Requirement catalog

### REQ-MKT-001: Area price index management

The system shall maintain a monthly price index by neighborhood with source metadata.

**Acceptance criteria:**

- [ ] Top neighborhoods have current price-per-sqft values
- [ ] Index values store source and refresh date
- [ ] Historical changes are retained for trend analysis

**Evidence:** price index snapshot and import log.

### REQ-MKT-002: Rental index and compliance integration

The system shall expose RERA rental index values for use in lease and pricing workflows.

**Acceptance criteria:**

- [ ] Area rental index values are visible to authorized users
- [ ] Rent-rule workflows can reference the index
- [ ] Missing data is surfaced as a blocked or stale state

**Evidence:** rental index view and compliance reference log.

### REQ-MKT-003: Transaction volume, supply, and demand signals

The system shall track monthly transactions, absorption, and listing activity by area.

**Acceptance criteria:**

- [ ] Volume charts can be filtered by area and property type
- [ ] Days-on-market and absorption metrics are calculated
- [ ] New listings vs sold ratio is visible in the dashboard

**Evidence:** transaction dashboard and signal snapshot.

### REQ-MKT-004: Alerts, competitor benchmarking, and exports

The system shall alert users on pricing opportunities and export market reports.

**Acceptance criteria:**

- [ ] Price-drop and yield alerts are configurable
- [ ] Competitor benchmarks compare internal and portal averages
- [ ] Scheduled monthly reports can be exported

**Evidence:** alert log, benchmark report, and export file.

## Traceability

- Maps to `REQ-VAL-001`, `REQ-FRPT-001`, and `REQ-FRPT-003`
- Aligns to `WC-SRS-014` and `WC-SRS-015`
- Feeds pricing, rental compliance, and leadership reporting artifacts

## 2. Dubai Area Price Index

The Dubai area price index should be maintained as a monthly, source-traced dataset with neighborhood-level drilldown.

## 3. RERA Rental Index Integration

Market intelligence requirements are now captured in the catalog below, covering area indices, transaction volume, supply-demand metrics, and alerts.

## 4. Transaction Volume Dashboard

- Monthly volume by area, property type, and ticket size.
- Source: DLD transaction feed + internal closed deals.
- Trend chart windows: 1m, 3m, 12m.

## 5. Supply Demand Signals

- Days on market.
- Absorption rate.
- New listing vs sold ratio.

## 6. Competitor Benchmarking

- Compare pricing against portal averages by neighborhood.
- Flag overpricing and underpricing opportunities.
- Track spread between ask and achieved sale price.

## 7. Alerts and Automation

- Price drop alerts over threshold.
- Yield opportunity alerts for investor segments.
- Low inventory warnings for strategic communities.

## 8. API Contract

- `GET /api/market/price-index`
- `GET /api/market/transactions`
- `GET /api/market/indicators`
- `POST /api/market/reports/monthly`

## 9. Reporting and Exports

- Weekly summary email to leadership.
- CSV/Excel/PDF export with filter persistence.
- Snapshot archival per month.

## 10. Acceptance Criteria

- Area index loads for top neighborhoods.
- RERA index values visible and applied in rent rules.
- Transaction charts reflect selected filters.
- Scheduled reports are generated successfully.

## 11. Test Plan

- API tests for market endpoints and filters.
- Data freshness test for monthly ingestion.
- Alert trigger tests for price/yield thresholds.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
