# 40 — Crest · Property Valuation Engine

> **ID:** `crest`  
> **Department:** AI Engine / Finance  
> **Title:** Property Valuation Engine  
> **Color:** `#1D4ED8` (Blue)  
> **Avatar:** 🏛️  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Valuers, All agents (read-only), Buyers (portal)

---

## 1. Overview

Crest is the **automated property valuation engine** for White Caves. She produces instant, data-driven property valuations using comparable transaction analysis, hedonic regression models, and machine learning. Her valuations help agents set accurate listing prices, give buyers confidence in offers, support Theodora with commission base values, power Maven's portfolio appreciation tracking, and enable sellers to get instant valuation reports without waiting for a physical inspection.

---

## 2. Core Responsibilities

1. Produce instant property valuations (Automated Valuation Model — AVM)
2. Comparable transaction analysis: find and present the 5 most relevant recent sales
3. Valuation confidence score: indicate how reliable the estimate is (high/medium/low)
4. Valuation reports: generate professional PDF valuation letters for clients
5. Track valuation history: how has a property's estimated value changed over time
6. Support Maven's capital appreciation tracking

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Instant AVM | Input: area, type, bedrooms, sqft, floor, view → output: value estimate in < 2 seconds |
| Comparable transactions | 5 most similar recent DLD transactions with similarity score |
| Confidence rating | High (10+ comparables found), Medium (5–9), Low (< 5) |
| Adjustment factors | Floor premium (+0.5% per floor above 5), view premium (sea: +8%, park: +5%), age discount (-2% per 5 years) |
| Valuation history | Track AVM value monthly per property in portfolio |
| Valuation report | Branded PDF with: estimate, comparables table, area market summary, agent sign-off |
| Range output | Always present as range, not a single number: "AED 1.8M – AED 2.1M" |
| Seller self-service | Buyer/seller enters property details on portal → instant AVM result |
| Refinancing support | Value estimate + LTV calculation for mortgage refinance requests |
| RICS compliance note | Disclaimer: AVM is indicative; formal RICS valuation required for mortgage |

---

## 4. How It Works — End to End

### Step 1 — Valuation Request
Agent or buyer submits: `POST /api/crest/value { area, type, bedrooms, sqft, floor, view, finishingQuality, yearBuilt }`.

### Step 2 — Comparable Search
`CrestService.findComparables(property)`:
- Query `DLDTransaction` collection (Cipher's data):
  - Same area
  - Same property type (apartment/villa/etc.)
  - Bedrooms: ±1
  - Size: ±25%
  - Date: last 12 months
  - Sort by combined similarity score
  - Return top 5

### Step 3 — Base Value Calculation
Median price per sqft of comparables × property sqft = `baseValue`.

### Step 4 — Adjustment Factors
```
adjustedValue = baseValue
  × (1 + floorPremium)      // +0.5% per floor above 5
  × (1 + viewPremium)       // sea: +8%, park: +5%, community: +2%
  × (1 - ageFactor)         // -2% per 5-year bracket
  × (1 + qualityFactor)     // +5% luxury finish, -5% dated
```

### Step 5 — Range Calculation
`lowerBound = adjustedValue × 0.92` (–8%)
`upperBound = adjustedValue × 1.08` (+8%)

### Step 6 — Confidence Score
- `comparables.length >= 10` → `confidence: 'high'`
- `comparables.length >= 5` → `confidence: 'medium'`
- `comparables.length < 5` → `confidence: 'low'` (and warn the user)

### Step 7 — Response
Return: `{ estimate: 1950000, range: [1794000, 2106000], confidence: 'high', comparables: [...], factors: { floor: +2.5%, view: +8%, age: -4% } }`.

### Step 8 — Valuation Report
On request: Quill generates PDF: White Caves letterhead, property details, estimate range, comparable transactions table, market context (Cipher), disclaimer, agent signature block.

### Step 9 — History Tracking
Monthly cron: re-run AVM for every property in White Caves portfolio → store `ValuationSnapshot { propertyId, date, estimate, confidence }`. Maven uses this for appreciation tracking.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/crest/value` | Get instant AVM valuation |
| GET | `/api/crest/comparables` | Get comparable transactions |
| GET | `/api/crest/history/:propertyId` | Valuation history over time |
| POST | `/api/crest/report` | Generate PDF valuation report |
| GET | `/api/crest/factors` | Current adjustment factor table |
| PUT | `/api/crest/factors` | Update factors (owner only) |

---

## 6. Data Flows

- **Receives from:** Cipher (DLD transaction data), Mary (portfolio property data), User input (ad-hoc valuations)
- **Sends to:** Maven (current values for portfolio appreciation), Oracle (comparable prices for agent pricing tool), Quill (valuation report PDFs), Sage (property values for mortgage calculations)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Crest valuation panel | `src/components/crm/ValuationPanel/` | 🔲 Planned |
| Comparable transactions table | Inside panel | 🔲 Planned |
| Valuation history chart | On property detail page | 🔲 Planned |
| Self-service valuation tool | Public portal `/property-valuation` | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| CrestService | `server/services/CrestService.ts` | 🔲 Planned |
| Valuation model | Prisma `ValuationSnapshot` | 🔲 Planned |
| Monthly revalue cron | `server/jobs/portfolioRevalueJob.ts` | 🔲 Planned |
| Crest routes | `server/routes/crest.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full + factor config |
| `agent` | Value any property (read-only) |
| `buyer` | Own property valuation (portal) |
| Public | Self-service valuation tool only |

---

## 10. Implementation Checklist

- [ ] Register `crest` in `AI_ASSISTANTS_REGISTRY`
- [ ] `CrestService.value()` endpoint with comparable search
- [ ] Adjustment factors calculation
- [ ] Confidence rating
- [ ] Valuation history model + monthly cron
- [ ] PDF valuation report (Quill)
- [ ] Self-service public valuation page
- [ ] Factor configuration API (owner)
- [ ] Wire into Maven (appreciation tracking)
- [ ] Wire into Oracle (comparable pricing tool)
- [ ] Tests: `CrestService.test.ts`

---

## 11. Dependencies

- Cipher (DLD transaction data — must be implemented first)
- Quill (valuation report PDF)
- `simple-statistics` npm package (median, percentile calculations)
- `node-cron` (monthly portfolio re-valuation)

---

## 12. Future Enhancements

- Machine learning AVM (XGBoost model trained on 5 years of DLD data)
- RICS-grade desktop valuation (human-in-loop review workflow)
- Real-time value change alerts (when a property's estimated value moves > 5%)
- Portfolio mark-to-market: daily portfolio valuation for investors
- Rental yield optimisation recommendations per property (link with Maven)

---

> **Note:** Crest is the 40th and final assistant in the White Caves AI Registry. Together, all 40 assistants cover every business function from initial lead generation (Hunter, Archer) through the full property transaction lifecycle (Clara, Sophia, Laila, Evangeline, Theodora) to post-sale relationship management (Halo, Kairos) and continuous market intelligence (Cipher, Atlas, Oracle, Flux, Nova) — creating a fully autonomous AI-powered real estate operation.
