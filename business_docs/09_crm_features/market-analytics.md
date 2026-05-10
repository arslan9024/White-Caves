# Market Analytics Dashboard — Business Specification

**Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** KPI tiles, Recharts visualisations and Dubai area heatmap for market intelligence.
**Status:** ✅ Expanded by @Fei-Fei.

CONSUMES←@Mary: business_docs/09_crm_features/sentinel-property.md#inventory-signals
FEEDS→@Anima: business_docs/09_crm_features/property-valuation.md#valuation-metrics

---

## 1. Overview

The Market Analytics Dashboard gives management and senior agents an at-a-glance view of Dubai real estate market performance, White Caves portfolio positioning, and key business KPIs. It combines DLD data, internal CRM metrics, and competitor intelligence in one unified view.

---

## 2. KPI Tiles and Metrics

### Row 1 — Market Overview
| Tile | Metric | Change Indicator |
|---|---|---|
| Avg Sale Price | AED X,XXX,XXX (this month) | ±% vs last month |
| Total Transactions | N deals closed | ±% vs last month |
| Avg Days on Market | N days | ↑ / ↓ trend arrow |
| Price/Sqft (Top Area) | AED X,XXX (area name) | Highest yield area |

### Row 2 — White Caves Portfolio
| Tile | Metric |
|---|---|
| Active Listings | N properties |
| Leads This Month | N new leads |
| Viewings This Month | N completed |
| Conversions | N% (leads → signed) |

### Row 3 — Revenue
| Tile | Metric |
|---|---|
| Commission Earned (MTD) | AED X,XXX,XXX |
| Rental Income (MTD) | AED X,XXX,XXX |
| Avg Commission Per Deal | AED X,XXX |

**API:** `GET /api/market/dashboard/kpis?period=month|quarter|year`

---

## 3. Chart Library and Heatmap Spec

### Chart Library: Recharts (v2, MIT license)

| Chart | Type | Data |
|---|---|---|
| Price Trend 12-Month | Line (multi-series per area) | `AreaPriceIndex` monthly data |
| Transactions by Property Type | Bar (grouped) | DLD transaction type breakdown |
| Price vs Sqft Scatter | Scatter | Active listings: price (Y) vs BUA (X), colored by area |
| Commission Trend | Area chart | Monthly commission earned (stacked: sale vs rental) |
| Lead Conversion Funnel | Funnel chart | New → Contacted → Viewed → Offered → Signed |
| Supply/Demand by Area | Horizontal bar (dual) | Absorption rate vs days on market |

### Dubai Area Heatmap

**Library:** Leaflet.js (v1.9) + `leaflet-choropleth` plugin

**Data:** 30 neighborhood GeoJSON polygons (`public/geojson/dubai-areas.geojson`), sourced from OpenStreetMap Overpass API export.

**Color intensity:** Price per sqft (quintile-based color scale: light gold → deep red)

**Interaction:**
- Hover → tooltip: area name, avg price/sqft, avg yield, transaction count
- Click → area drill-down panel (right sidebar): 12-month price chart + active White Caves listings

**Performance:** GeoJSON pre-simplified to < 200KB; re-render only on data refresh.

---

## 4. Data Refresh Schedule

| Data Source | Refresh | Trigger |
|---|---|---|
| DLD transaction data | Monthly (1st) | Cron + manual admin trigger |
| RERA rental index | Quarterly | Manual admin upload + cron check |
| Internal CRM metrics | Real-time | Event-driven (on lease signed, payment received, etc.) |
| Competitor pricing | Weekly (Monday 03:00) | Scraper cron |
| Exchange rates | 4-hourly | Rate cache TTL |

---

## 5. Export Options

| Format | Content | API |
|---|---|---|
| CSV | Raw data table (all metrics, date-ranged) | `POST /api/market/export { format: 'csv', ... }` |
| Excel | Formatted tables with headers + formulas | `POST /api/market/export { format: 'xlsx', ... }` |
| PDF | Visual report: charts + company branding + MD signature | `POST /api/market/export { format: 'pdf', ... }` |

**Async export:**
```
POST /api/market/export → { jobId }
GET  /api/market/export/:jobId → { status: 'pending'|'ready', downloadUrl }
```
Email sent when ready: "Your market report for May 2026 is ready — Download"

---

## 6. Scheduled Email Digest

**Schedule:** Every Monday 08:00 GST → MD + board members + senior agents

**Content (last 7 days):**
- 3 KPI tiles (deals closed, total value, top area by volume)
- Spark line (vs prior week)
- CTA: "View full dashboard" link

**API:**
```
POST /api/market/digest/send (internal cron — not public)
```

---

## 7. Access Control

| Role | Access |
|---|---|
| Agent | Own pipeline metrics only; market overview tiles (read-only) |
| Manager | Full team pipeline + market data + export |
| Admin / Superuser | All + data refresh triggers + export all |

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| KPI tiles return correct values for period | Integration |
| Chart data shape matches Recharts expected format | Unit |
| Area heatmap loads < 2s (GeoJSON size check) | Performance |
| Export PDF contains all charts | Integration |
| Digest email generated with correct week data | Unit |
| Agent cannot access company-wide revenue tiles | Integration |

---

## 9. Observability / Metrics

| Metric | Alert |
|---|---|
| Dashboard load time p95 | > 3s → Slack |
| Export job queue depth | > 10 → Slack |
| Heatmap GeoJSON fetch failure | Error banner in UI |