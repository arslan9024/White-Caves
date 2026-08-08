# Market Analytics Dashboard

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** KPI tiles, Recharts visualisations and Dubai area heatmap for market intelligence.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM market analytics feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend visualization/reliability lanes in `docs/plans/waves/WAVE_38_*` through `WAVE_40_*`

---

## 1. Overview

The market analytics dashboard turns market-intelligence data into KPI tiles, charts, and a Dubai area heatmap for leadership and property teams.

## Requirement catalog

### REQ-MA-001: KPI tile rendering and metric consistency

The system shall render market KPI tiles using the same source datasets as the reports.

**Acceptance criteria:**

- [ ] KPI tiles show sale price, price per sqft, days on market, and volume trend
- [ ] Values match the source dataset totals
- [ ] Missing data is displayed as a safe empty state

**Evidence:** KPI snapshot and dataset consistency check.

### REQ-MA-002: Chart library and heatmap visualization

The system shall render market charts and Dubai area heatmaps with drill-down interactions.

**Acceptance criteria:**

- [ ] Line, bar, and scatter charts are available for key views
- [ ] Heatmap intensity reflects area price-per-sqft values
- [ ] Clicking an area reveals drill-down details

**Evidence:** chart snapshot, heatmap render, and click-through log.

### REQ-MA-003: Refresh, filtering, and segmentation controls

The system shall support refresh intervals, role-based filter presets, and segmentation.

**Acceptance criteria:**

- [ ] Data refresh occurs on the documented schedule
- [ ] Filters persist across navigation and export
- [ ] Saved presets can be reused by the same role

**Evidence:** refresh log, filter state snapshot, and preset record.

### REQ-MA-004: Export and digest delivery

The system shall export market analytics and support scheduled leadership digests.

**Acceptance criteria:**

- [ ] CSV and PDF exports are available
- [ ] Scheduled digest includes the selected KPI set
- [ ] Exported values are consistent with on-screen data

**Evidence:** export file and digest log.

## Traceability

- Maps to `REQ-MKT-001` through `REQ-MKT-004`
- Aligns to `WC-SRS-014`, `WC-SRS-015`, and leadership reporting artifacts
- Feeds dashboard visualization, analytics export, and digest validation

## 2. KPI Tiles and Metrics

KPI tiles should be source-aligned and role-aware, with consistent formatting across monthly refreshes.

## 3. Chart Library and Heatmap Spec

The chart library should support line, bar, and scatter visualisations with drill-down heatmap interactions for Dubai area intelligence.
Charts should use the same market dataset as KPI tiles, with consistent color semantics and responsive layouts for leadership review.

## 4. Data Sources and Refresh

- DLD monthly feeds + internal transactions.
- Nightly aggregation and weekly sanity checks.

## 5. KPI Definitions

- Avg sale price AED.
- Price per sqft.
- Days on market.
- Volume trend percentage.

## 6. Visualization Standards

- Recharts for line/bar/scatter.
- Choropleth map for neighborhood intensity.
- Tooltip with drill-down metrics.

## 7. Filtering and Segmentation

- Area, property type, price band, date range.
- Saved filter presets per role.

## 8. API Contract

- `GET /api/market-analytics/kpis`
- `GET /api/market-analytics/charts`
- `GET /api/market-analytics/heatmap`

## 9. Export and Reporting

- CSV and PDF exports.
- Scheduled digest for leadership.

## 10. Acceptance Criteria

- KPI and chart values align with source datasets.
- Heatmap performance remains usable for top 30 areas.

## 11. Test Plan

- Data consistency tests.
- Filter regression tests.
- Export integrity tests.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
