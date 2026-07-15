# Market Intelligence

> **Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** CipherMarket module for Dubai area price index, transaction volumes and RERA rental index.
> **Status:** Stub -- awaiting expansion by @Fei-Fei.

---

## 1. Overview

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 2. Dubai Area Price Index

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 3. RERA Rental Index Integration

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

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
