# Market Analytics Dashboard

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** KPI tiles, Recharts visualisations and Dubai area heatmap for market intelligence.
> **Status:** Stub -- awaiting expansion by @Fei-Fei.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. KPI Tiles and Metrics

> _TODO: expand this section with full spec._

## 3. Chart Library and Heatmap Spec

> _TODO: expand this section with full spec._

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
