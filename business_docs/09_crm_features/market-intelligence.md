# Market Intelligence — Business Specification

**Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** CipherMarket module for Dubai area price index, transaction volumes and RERA rental index.
**Status:** ✅ Expanded by @Fei-Fei.

CONSUMES←@Mary: business_docs/09_crm_features/sentinel-property.md#inventory-signals
FEEDS→@Anima: business_docs/09_crm_features/property-valuation.md#valuation-metrics

---

## 1. Overview

CipherMarketCRM aggregates external market data (DLD transactions, RERA rental index, competitor pricing) and internal White Caves transaction history to give agents and management a clear picture of the Dubai real estate market. Data powers AVM comparables, agent pricing recommendations, and investor ROI projections.

---

## 2. Dubai Area Price Index

### Top 30 Neighborhoods — Price Per Sqft Table
Sourced from DLD quarterly transaction data. Updated monthly via cron.

| Neighborhood | Avg Price/Sqft (AED) | Avg Yield % | Data Date |
|---|---|---|---|
| Palm Jumeirah | 3,200 | 4.2 | Monthly |
| DIFC | 2,800 | 3.9 | Monthly |
| Downtown Dubai | 2,650 | 4.1 | Monthly |
| Dubai Marina | 1,950 | 5.8 | Monthly |
| Business Bay | 1,750 | 5.5 | Monthly |
| JBR | 2,100 | 5.2 | Monthly |
| JVC | 900 | 7.2 | Monthly |
| JLT | 1,100 | 6.8 | Monthly |
| Arabian Ranches | 1,450 | 4.9 | Monthly |
| Dubai Hills | 1,650 | 5.1 | Monthly |
| (+ 20 more areas) | — | — | Monthly |

**Data Schema:**
```prisma
model AreaPriceIndex {
  id             String   @id @default(cuid())
  area           String
  bedrooms       Int?     // null = all types
  avgPricePerSqft Float
  avgYieldPct    Float?
  transactionCount Int
  dataDate       String   // YYYY-MM
  createdAt      DateTime @default(now())
  @@unique([area, bedrooms, dataDate])
  @@index([area, dataDate])
}
```

**API:**
```
GET /api/market/price-index?area=&bedrooms=&months=12
Response: { area, data: [{ month, avgPricePerSqft, transactionCount }] }
```

---

## 3. Transaction Volume Dashboard

**Data:** DLD monthly sales data (bulk export, processed monthly)

**Metrics:**
- Total transactions by month (line chart, 12-month trend)
- Volume by property type: apartment / villa / townhouse / commercial (pie chart)
- Volume by price band: < AED 1M / 1–3M / 3–5M / 5–10M / 10M+ (bar chart)
- Volume by area (top 10 areas horizontal bar)

**API:**
```
GET /api/market/transactions?area=&type=&priceMin=&priceMax=&from=&to=
Response: { totalCount, totalValueAed, data: TransactionRecord[] }
```

---

## 4. Supply/Demand Metrics

| Metric | Formula | Target Range |
|---|---|---|
| Days on Market (DOM) | Avg days from listing to sold/leased | < 45 days (healthy market) |
| Absorption Rate | Units sold / Active listings × 100 | > 20% (seller's market) |
| New Listings vs Sold Ratio | New listings / Sold listings per month | < 1.2 (balanced market) |

**DOM by area + type:** Table with conditional formatting (green < 30, amber 30–60, red > 60).

---

## 5. Competitor Pricing Monitor

**Source:** PropertyFinder and Bayut listing data (scraped weekly via Puppeteer or third-party API)

**Comparison:**
```
For each active White Caves listing:
  Area + Bedrooms + approx BUA → find comparable listings on PF/Bayut
  Calculate: White Caves ask price vs market avg ask price
  Flag: > 10% above market → "Overpriced" badge
         > 10% below market → "Below Market" badge (opportunity alert)
```

**API:**
```
GET /api/market/competitor?propertyId= → comparison for a single property
GET /api/market/competitor/summary → portfolio-wide pricing position
```

---

## 6. RERA Rental Index Integration

**Source:** RERA rental index (published on Dubai REST / RERA portal, updated quarterly)

```
GET /api/compliance/rera/rental-index?area=&bedrooms=
Response: {
  area, bedrooms,
  registeredRentRange: { low: 60000, high: 85000 },
  allowedIncreasePct: 5,
  indexDate: "Q1-2026"
}
```

**Agent use case:** Agent enters current registered rent + proposed new rent → system validates against index → shows allowed vs proposed increase.

**Breach detection:** For all active leases, monthly cron checks if current rent exceeds RERA index ceiling → flags for compliance review.

---

## 7. Automated Monthly Market Report PDF

**Schedule:** 1st of each month, 07:00 GST

**Content:**
- Price trend chart (12-month area comparison — top 5 areas)
- Transaction volume table (month vs prior month %)
- Top 5 areas by yield
- Supply/demand heat table
- White Caves portfolio positioning vs market
- Signed by MD

**Distribution:** Email to `md@whitecaves.com`, `board@whitecaves.com`, all senior agents.

---

## 8. Price Drop Alert

**Trigger:** Area avg price/sqft drops > 5% vs prior month → alert to:
- Agents with active listings in that area
- Leads with saved searches for that area (via notification)

**WhatsApp template:** "Market update: Prices in {area} dropped 6% this month. Now is a great time to buy. Browse new listings: {link}"

---

## 9. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Price index returns correct monthly data | Integration |
| RERA index validates rent increase correctly | Unit |
| Competitor pricing flags overpriced listing | Unit |
| Price drop alert > 5% triggers WhatsApp | Integration |
| Monthly report PDF generated with charts | Integration |

---

## 10. Observability / Metrics

| Metric | Alert |
|---|---|
| DLD data refresh failure | Email to data@ |
| Competitor scraper success rate | < 90% → Slack |
| RERA index update overdue (> 95 days) | Compliance@ email |