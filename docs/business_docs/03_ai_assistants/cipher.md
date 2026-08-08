# Cipher — Predictive Market Analyst

<!-- markdownlint-disable MD022 MD032 -->

> **Department:** Intelligence  
> **ID:** `cipher`  
> **Color:** #0D9488  
> **Avatar:** 🔮
> **Status:** Active — requirement catalog expanded.

---

## Overview
Uses advanced analytics on DLD transaction data, news, and economic indicators to generate predictive reports on neighborhood trends and property valuation.

## Requirement catalog

### REQ-CIPHER-001: Market trend and price prediction outputs

The system shall produce neighborhood-level trend and price prediction insights from internal and external signals.

**Acceptance criteria:**

- [ ] Trend outputs are segmented by area and property type
- [ ] Price predictions include confidence indicators
- [ ] Source windows and recency are visible

**Evidence:** trend report and prediction snapshot.

### REQ-CIPHER-002: Demand forecasting and investment scoring

The system shall forecast demand and compute investment suitability scores.

**Acceptance criteria:**

- [ ] Demand forecasts support configurable horizons
- [ ] Investment scores include weighted factor breakdown
- [ ] Score deltas are tracked over time

**Evidence:** forecast run log and investment score ledger.

### REQ-CIPHER-003: Competitor and economic signal integration

The system shall integrate competitor pricing and macroeconomic indicators into analytics models.

**Acceptance criteria:**

- [ ] Competitor and macro data sources are versioned
- [ ] Model output identifies significant signal changes
- [ ] Unsupported data gaps are surfaced explicitly

**Evidence:** signal integration report and anomaly log.

### REQ-CIPHER-004: Delivery to valuation and executive layers

The system shall publish analytic outputs to downstream valuation and executive dashboards.

**Acceptance criteria:**

- [ ] Insights are consumable by valuation and executive modules
- [ ] Publish cadence and freshness are tracked
- [ ] Delivery failures are alerted with retry paths

**Evidence:** downstream publish log and freshness dashboard.

## Traceability

- Maps to `REQ-MARKET-001` through `REQ-MARKET-004`
- Aligns to `WC-SRS-014` and predictive analytics artifacts
- Feeds valuation, strategy, and market intelligence validation

## Capabilities
- Market trend analysis
- Price prediction
- Demand forecasting
- Competitor tracking
- Investment scoring
- Economic indicator monitoring

## API Endpoints
- `/api/analytics`
- `/api/predictions`
- `/api/market-data`

## Data Flows
- **Receives from:** Mary, Henry
- **Sends to:** Zoe, Olivia, Maven

## Access Control
- **Viewable by:** Owner, Admin, Investment Manager
- **Accessible by:** Owner, Admin
- **Data access level:** Full
