# 33 — Cipher · Predictive Market Analyst

> **ID:** `cipher`  
> **Department:** Intelligence  
> **Title:** Predictive Market Analyst  
> **Color:** `#0D9488` (Teal)  
> **Avatar:** 🔮  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Investment Manager, Senior Agents

---

## 1. Overview

Cipher is the **market intelligence brain** of White Caves. She analyses DLD transaction data, macro-economic indicators, rental yield trends, and competitor pricing to generate predictive reports on where Dubai real estate is heading. Her analysis powers Maven's investment recommendations, Oracle's live dashboard, and Olivia's area-focused campaigns.

---

## 2. Core Responsibilities

1. Ingest DLD transaction data (daily) and compute area-level price indices
2. Track rental yield trends per area and property type
3. Monitor competitor pricing: Bayut/PF listings by area
4. Generate 3/6/12-month price forecasts using trend extrapolation
5. Produce investment scoring per area (0–100): yield + appreciation + liquidity + demand
6. Detect market anomalies: sudden price spike, demand surge, inventory drop

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Area price index | Avg price per sqft by area, tracked monthly |
| Yield tracker | Gross rental yield by area + property type |
| Price forecast | 3/6/12-month linear trend extrapolation |
| Demand index | Leads per area / listings per area = demand pressure score |
| Investment score | Composite score: yield (40%) + appreciation (30%) + liquidity (20%) + demand (10%) |
| Competitor pricing | Scrape/API: avg Bayut listing price per area — compare to White Caves portfolio |
| Anomaly alerts | > 10% price change in area in < 30 days → Cipher alert |
| Market report | Monthly automated report: top areas, trends, investment signals |
| Macro indicators | Interest rate changes, expo/events, new infrastructure → impact modelling |
| Custom query | "Show me all areas with yield > 7% and appreciation > 15% last year" |

---

## 4. How It Works — End to End

### Step 1 — DLD Data Ingestion
Daily cron (04:00): `CipherService.ingestDLD()` → fetch DLD transaction dataset (CSV or API) → parse: property address, area, type, price, date → upsert into `DLDTransaction` collection.

### Step 2 — Index Computation
After ingestion: `CipherService.computeAreaIndex(month)` → group transactions by area → compute median price per sqft → store as `AreaPriceIndex { area, month, medianPSF, transactionCount }`.

### Step 3 — Yield Calculation
`CipherService.computeYields()` → join `AreaPriceIndex` with average rent data from Daisy/Mary → compute: `yield = (avgAnnualRent / medianPrice) × 100`. Store as `AreaYield`.

### Step 4 — Forecast Generation
For each area: fit simple linear regression on last 12 months of `AreaPriceIndex`. Extrapolate 3/6/12 months. Include confidence interval. Store as `AreaForecast`.

### Step 5 — Investment Scoring
`CipherService.scoreAreas()` → for each area: normalise yield, appreciation, liquidity (transaction volume), and demand scores → weighted composite → rank all areas. Stored as `AreaInvestmentScore`.

### Step 6 — Anomaly Detection
After daily index computation: compare this month vs last month. If `|change| > 0.10` (10%) → create `MarketAnomaly` alert → notify MD via Nadia.

### Step 7 — Monthly Report
`CipherService.generateMonthlyReport()` → top 5 areas by investment score, top movers, biggest yield areas → Quill generates PDF → sent to MD + available in Oracle dashboard.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/cipher/areas` | Area investment scores (ranked) |
| GET | `/api/cipher/prices/:area` | Price index history + forecast |
| GET | `/api/cipher/yields` | Yield data by area |
| GET | `/api/cipher/anomalies` | Recent market anomalies |
| GET | `/api/cipher/report/:month` | Monthly market report |
| POST | `/api/cipher/query` | Custom market query |
| POST | `/api/cipher/ingest` | Manual DLD data ingestion trigger |

---

## 6. Data Flows

- **Receives from:** DLD open data API (external), Mary (White Caves inventory prices), Daisy (rental income data)
- **Sends to:** Maven (area investment scores), Oracle (live market dashboard data), Atlas (development opportunity signals), Olivia (area campaign targeting), Hunter (high-demand area prospecting)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Cipher Intelligence dashboard | `src/components/owner/ai/CipherCRM/` | 🔲 Planned |
| Area heat map | Interactive map with price index overlay | 🔲 Planned |
| Price trend chart | Per-area 12-month chart | 🔲 Planned |
| Investment score table | Ranked area list | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| CipherService | `server/services/CipherService.ts` | 🔲 Planned |
| DLD ingestion cron | `server/jobs/dldIngestJob.ts` | 🔲 Planned |
| Area models | Prisma (multiple index models) | 🔲 Planned |
| Analytics routes | `server/routes/cipher.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full intelligence + reports |
| `investment_manager` | Area scores + yields |
| `senior_agent` | Area price + yield data |
| Public | None (internal only) |

---

## 10. Implementation Checklist

- [ ] Register `cipher` in `AI_ASSISTANTS_REGISTRY`
- [ ] DLD transaction data ingestion pipeline
- [ ] Area price index computation
- [ ] Yield calculation joining rent and price data
- [ ] Linear trend forecast
- [ ] Investment scoring algorithm
- [ ] Anomaly detection
- [ ] Monthly report (Quill)
- [ ] Interactive area heat map (DubaiMap component)
- [ ] Tests: `CipherService.test.ts`

---

## 11. Dependencies

- DLD open data portal (external — free API or dataset download)
- Bayut/PF price data (scraper or partner API)
- `simple-statistics` npm package (linear regression)
- Quill (market report PDF)
- DubaiMap component (map visualisation)

---

## 12. Future Enhancements

- ML price forecast (Random Forest, replacing linear regression)
- Sentiment analysis of news articles about Dubai RE market
- Interest rate sensitivity modelling
- Global capital flow tracking (Russian, Indian, European buyer trends)
