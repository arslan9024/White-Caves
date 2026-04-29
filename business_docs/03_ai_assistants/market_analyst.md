# Market Analyst Bot — AI Assistant Definition

> **Type:** Specialized AI Bot
> **Department:** Executive / Business Intelligence
> **Color:** #0EA5E9 (Sky Blue)
> **Status:** Planned (Phase 4C)

---

## Overview

Real-time market intelligence engine that analyzes internal transaction data to provide price trends, rental yield calculations, comparable property analysis, and demand heatmaps. Powers the executive dashboard and agent pricing recommendations.

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
