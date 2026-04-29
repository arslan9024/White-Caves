# 15 — Maven · Investment Strategy & Portfolio Optimizer

> **ID:** `maven`  
> **Department:** Finance  
> **Title:** Investment Strategy & Portfolio Optimizer  
> **Color:** `#8B5CF6` (Violet)  
> **Avatar:** 📊  
> **Phase:** Phase 5 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Investment Manager, Investor (portal)

---

## 1. Overview

Maven is the **investment intelligence engine** for White Caves' investor clients. She analyses rental yields, capital appreciation trends, and tax implications across Dubai areas to provide data-driven buy/hold/sell recommendations. She powers the investor portal's ROI calculator, portfolio tracker, and comparative analysis tools, turning raw DLD data into actionable investment strategy.

---

## 2. Core Responsibilities

1. Calculate rental yield per property: (annual rent / property value) × 100
2. Track capital appreciation vs purchase price for each portfolio property
3. Generate buy/hold/sell recommendations based on yield targets and market trends
4. Provide area-level investment scoring (Dubai Marina vs Business Bay vs Dubai Hills)
5. Manage investor portfolios: track all owned properties + expected returns
6. Produce quarterly investment performance reports

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Yield calculator | Gross and net yield (after service charges, agency fees) per property |
| Capital gain tracker | Property value today vs purchase price → unrealised gain/loss |
| Area ranking | Rank Dubai areas by: avg yield, avg appreciation, liquidity, vacancy rate |
| Portfolio view | All investor-owned properties in one view with performance metrics |
| Comparison tool | Side-by-side comparison of up to 3 properties or areas |
| ROI scenario planner | Input: purchase price, financing, rental income → model 5/10-year ROI |
| Sell timing signal | If yield < target AND appreciation > 20% → recommend sell |
| Tax impact modelling | UAE: no income tax, no capital gains tax. Model VAT on commercial. |
| Benchmark report | Portfolio performance vs REIDIN / DLD market average |
| Quarterly statement | PDF report per investor: holdings, income, appreciation |

---

## 4. How It Works — End to End

### Step 1 — Portfolio Registration
Investor's properties registered: `POST /api/portfolio { userId, propertyId, purchasePrice, purchaseDate, financed: true, loanAmount, interestRate }`.

### Step 2 — Yield Calculation
`MavenService.calculateYield(unit)`:
- Annual gross rent = `monthlyRent × 12`
- Service charges fetched from Juno/building records
- Net yield = `(grossRent - serviceCharges - agencyFees) / purchasePrice × 100`

### Step 3 — Appreciation Tracking
Current market value fetched from Crest (property valuation). Appreciation = `(currentValue - purchasePrice) / purchasePrice × 100`.

### Step 4 — Recommendation Engine
For each asset: compare `netYield` vs `targetYield` (configurable per investor, default 6%) and `appreciation` vs `holdTarget` (default 15%):
- Yield > target AND appreciation < threshold → **Hold**
- Yield < target AND appreciation > threshold → **Sell** (captured gains)
- Both metrics below target → **Review** (possibly renovate or reposition)
- Area ranked highly by Cipher → **Buy more** signal

### Step 5 — Scenario Planning
Investor uses ROI planner: input proposed purchase → Maven models: Year 1–10 cash flows (rent minus mortgage/fees), IRR, total return, equity built. Chart shown as stacked bar (income + appreciation).

### Step 6 — Quarterly Report
Cron (quarterly): `MavenService.generateQuarterlyStatement(investorId)` → aggregates income, appreciation, yield → Quill generates PDF → sent to investor via email and WhatsApp.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/portfolio` | Get investor portfolio |
| POST | `/api/portfolio` | Add property to portfolio |
| DELETE | `/api/portfolio/:id` | Remove from portfolio |
| GET | `/api/portfolio/:id/yield` | Calculate yield |
| GET | `/api/portfolio/:id/appreciation` | Get appreciation |
| GET | `/api/portfolio/recommendations` | Buy/hold/sell signals |
| POST | `/api/maven/scenario` | Run ROI scenario |
| GET | `/api/maven/area-rankings` | Area investment score rankings |
| GET | `/api/maven/quarterly-report/:userId` | Generate quarterly statement |

---

## 6. Data Flows

- **Receives from:** Cipher (market trends + area scores), Theodora (rental income records), Crest (current property valuations), Mary (property data)
- **Sends to:** Zoe (portfolio KPIs for MD), Quill (quarterly statement PDF), Investor portal (read-only dashboard)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Maven CRM dashboard | `src/components/owner/ai/MavenCRM/` | 🔲 Planned |
| Portfolio view | Inside dashboard | 🔲 Planned |
| ROI scenario planner | Interactive form + chart | 🔲 Planned |
| Area rankings table | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| MavenService | `server/services/MavenService.ts` | 🔲 Planned |
| Portfolio CRUD | `server/routes/portfolio.ts` | 🔲 Planned |
| ROI scenario | `server/routes/maven.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | All portfolios |
| `investment_manager` | All portfolios |
| `investor` | Own portfolio only (portal) |

---

## 10. Implementation Checklist

- [ ] Register `maven` in `AI_ASSISTANTS_REGISTRY`
- [ ] Portfolio model (user ↔ property + purchase metadata)
- [ ] Yield calculation service
- [ ] Appreciation calculation (requires Crest valuation)
- [ ] Recommendation engine
- [ ] ROI scenario planner UI + API
- [ ] Area rankings (requires Cipher data)
- [ ] Quarterly report PDF (Quill)
- [ ] Investor portal view

---

## 11. Dependencies

- Cipher (area market data)
- Crest (property valuations)
- Theodora (income data)
- Quill (PDF reports)
- Investor portal (Phase 2 extension)

---

## 12. Future Enhancements

- Machine learning yield prediction (3/6/12 month forecast)
- Off-plan ROI modelling vs ready property comparison
- Dividend vs capital growth strategy profiler per investor type
- Integration with UAE financial institutions for mortgage rate data
