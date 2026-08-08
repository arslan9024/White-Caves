# Market Analyst Bot — AI Assistant Definition

<!-- markdownlint-disable MD012 -->

> **Type:** Specialized AI Bot
> **Department:** Executive / Business Intelligence
> **Color:** #0EA5E9 (Sky Blue)
> **Status:** Active (Phase 4C)

---

## Overview

Real-time market intelligence engine that analyzes internal transaction data to provide price trends, rental yield calculations, comparable property analysis, and demand heatmaps. Powers the executive dashboard and agent pricing recommendations.

## Requirement catalog

### REQ-MARKET-001: Trend analysis and comparables

The system shall analyze price trends, rental yields, and comparable properties for market guidance.

**Acceptance criteria:**

- [ ] Area and building trends are produced from internal data
- [ ] Comparable results include pricing range and similarity context
- [ ] Rental yield calculations use the configured formula

**Evidence:** trend report and comparables output.

### REQ-MARKET-002: Demand heatmaps and alerts

The system shall calculate demand indices and notify users on significant market movement.

**Acceptance criteria:**

- [ ] Demand index is based on lead volume and available inventory
- [ ] Alerts fire when the configured movement threshold is exceeded
- [ ] Heatmap outputs are available to dashboard consumers

**Evidence:** demand heatmap and market alert log.

### REQ-MARKET-003: Forecasting and dashboard delivery

The system shall provide short-term forecasts and output market insights to executive and agent dashboards.

**Acceptance criteria:**

- [ ] Forecasts are generated for 3/6/12 month horizons
- [ ] Executive and agent outputs are role-aware
- [ ] Charts and summary cards share consistent source data

**Evidence:** forecast snapshot and dashboard render.

### REQ-MARKET-004: Data freshness and governance

The system shall track source freshness and the cadence of internal and external market imports.

**Acceptance criteria:**

- [ ] Internal data is near real-time
- [ ] External DLD imports have visible freshness metadata
- [ ] Recompute jobs are traceable

**Evidence:** import log and freshness audit.

## Traceability

- Maps to `REQ-MKT-001` through `REQ-MKT-004` and valuation support
- Aligns to `WC-SRS-014`, `WC-SRS-015`, and market intelligence artifacts
- Feeds recommendation, valuation, and executive reporting

## Capabilities

1. **Price per sqft trends** — By area, building, property type (historical + forecast)
2. **Rental yield calculator** — (Annual rent / property value) x 100, benchmarked by area
3. **Comparable analysis** — Find similar properties by area, bedrooms, size; show price range
4. **Demand heatmap** — Leads per area / available inventory per area = demand index
5. **Price forecasting** — Simple trend extrapolation (3/6/12 month projections)
6. **Market alerts** — Notify when area prices move > 5% in 30 days

## Data Inputs

- Transaction history (internal: sale prices, rental prices, dates)
- Property inventory (current listings, prices, features)
- Lead data (area preferences, budget ranges, inquiry volume)
- External: DLD published transaction data (manual import quarterly)

## Data Outputs

- MarketAnalyticsModule.tsx: Charts, trends, comparables
- PropertyValuationModule.tsx: Suggested listing price
- Zoe Executive Dashboard: Market summary for MD/owner
- Agent dashboards: Area-specific insights

## KPIs

- Valuation accuracy: within 10% of actual sale price (80%+ of time)
- Comparable relevance: 4+ matches per query
- Trend detection: Flag area price movements within 48 hours
- Data freshness: Internal data real-time, external data < 30 days old

## Technical Implementation

- File: server/services/ai/marketAnalyst.ts
- API: GET /api/analytics/trends?area=X, GET /api/analytics/comparables?propertyId=X
- Cron: Daily aggregation of transaction data into analytics tables
- Charts: Recharts library (already in project dependencies)
<!-- end of market analyst spec -->
Market analyst spec status: active.

