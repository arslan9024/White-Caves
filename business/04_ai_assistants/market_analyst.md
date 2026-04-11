# AI Assistant: Market Analyst (Oracle)

> **ID:** `oracle`
> **Department:** Analytics / Executive
> **Category:** AI-Powered Market Intelligence
> **Status:** Proposed (Phase 2 Research Implementation)
> **Created:** April 11, 2026

---

## 1. Overview

Oracle is an AI-powered market analysis assistant that provides real-time Dubai real estate market intelligence, trend forecasting, comparative market analysis (CMA), and investment insights. Oracle aggregates data from DLD transactions, RERA reports, portal listings, and economic indicators to deliver actionable intelligence for agents, investors, and executives.

---

## 2. Capabilities

### 2.1 Market Data Aggregation

| Data Source | Type | Frequency |
|-------------|------|-----------|
| **DLD Transaction Data** | Sales volumes, prices, areas | Daily |
| **RERA Reports** | Regulatory updates, market circulars | Weekly |
| **Portal Listings** | Active inventory, price trends, days on market | Daily |
| **Economic Indicators** | GDP, population growth, tourism, FDI | Monthly |
| **Currency Rates** | AED/USD/GBP/EUR exchange rates | Real-time |
| **Mortgage Rates** | UAE bank mortgage rate tracking | Weekly |
| **Construction Activity** | Off-plan launches, completion dates | Monthly |

### 2.2 Analysis Capabilities

| Analysis Type | Description | Output |
|--------------|-------------|--------|
| **Comparative Market Analysis (CMA)** | Price comparison for similar properties in area | PDF report + JSON data |
| **Price Trend Forecasting** | ML-based price predictions (3/6/12 month) | Charts + confidence intervals |
| **Area Heatmaps** | Transaction density and price per sqft by area | Interactive map overlay |
| **Investment ROI Calculator** | Rental yield, capital appreciation, total ROI | Financial model |
| **Supply/Demand Analysis** | Inventory levels vs. transaction velocity | Dashboard widgets |
| **Developer Performance** | Developer track record, delivery history | Scorecards |
| **Market Sentiment** | News + social media sentiment analysis | Sentiment index |

### 2.3 Automated Reports

| Report | Audience | Frequency | Format |
|--------|----------|-----------|--------|
| **Weekly Market Pulse** | All agents | Weekly (Monday) | Email + Dashboard |
| **Monthly Area Report** | Branch managers | Monthly | PDF + Dashboard |
| **Quarterly Market Review** | Executives | Quarterly | PDF presentation |
| **Property Valuation** | On-demand | Per request | PDF + API response |
| **Investor Briefing** | VIP clients | Monthly | WhatsApp (Nadia) + Email |
| **Competitor Pricing Alert** | Listing agents | Real-time | Push notification |

---

## 3. Technical Architecture

### 3.1 Data Pipeline

```
External Sources → Data Ingestion (cron + webhooks) → Data Lake (MongoDB)
        ↓
Cleansing & Normalization → Feature Store → ML Models → Predictions
        ↓
Report Generation → Distribution (Email, Dashboard, WhatsApp, API)
```

### 3.2 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/market/overview` | Current market snapshot |
| `GET` | `/api/market/trends/:area` | Price trends for specific area |
| `GET` | `/api/market/cma/:propertyId` | CMA report for a property |
| `GET` | `/api/market/forecast/:area` | Price forecast (3/6/12 month) |
| `GET` | `/api/market/heatmap` | Transaction heatmap data |
| `GET` | `/api/market/roi-calculator` | Investment ROI calculation |
| `GET` | `/api/market/reports` | List generated reports |
| `POST` | `/api/market/reports/generate` | Generate custom report |
| `GET` | `/api/market/sentiment` | Market sentiment index |

### 3.3 Database Schema Addition

```prisma
model MarketData {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  source      String   // dld, rera, portal, economic
  dataType    String   // transaction, listing, indicator, rate
  area        String?  // Dubai Marina, Downtown, JBR, etc.
  period      String   // 2026-Q1, 2026-04, 2026-W15
  metrics     Json     // { avgPrice: 1500, transactions: 230, inventory: 450, ... }
  rawData     Json?    // Original source data
  createdAt   DateTime @default(now())

  @@index([source, dataType, area, period])
  @@index([area, period])
}

model MarketReport {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        String   // cma, weekly_pulse, monthly_area, quarterly_review
  title       String
  area        String?
  propertyId  String?  @db.ObjectId
  data        Json     // Report data
  fileUrl     String?  // S3 URL for PDF
  generatedBy String   // oracle (system) or user ID
  recipients  String[] // User IDs or email addresses
  sentAt      DateTime?
  createdAt   DateTime @default(now())

  @@index([type, area])
  @@index([createdAt])
}
```

---

## 4. ML Models

### 4.1 Price Prediction Model

| Component | Details |
|-----------|---------|
| **Algorithm** | Gradient Boosting (XGBoost) → LSTM for time series |
| **Features** | Area, property type, size, floor, view, age, season, economic indicators |
| **Training Data** | 5+ years of DLD transaction data |
| **Output** | Predicted price + confidence interval |
| **Retraining** | Monthly with latest transaction data |
| **Accuracy Target** | MAPE < 10% |

### 4.2 Demand Forecasting

| Component | Details |
|-----------|---------|
| **Algorithm** | Prophet (Facebook) for seasonality + external regressors |
| **Features** | Historical transactions, population growth, tourism data, Expo effects |
| **Output** | Predicted demand by area and property type (next 3 months) |

### 4.3 Sentiment Analysis

| Component | Details |
|-----------|---------|
| **Algorithm** | Fine-tuned BERT model for real estate domain |
| **Sources** | News articles, social media, forum posts |
| **Output** | Sentiment score (-1 to +1) + key themes |
| **Languages** | English and Arabic |

---

## 5. Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| **Zoe (Executive)** | Market overview on executive dashboard | Read |
| **Sophia (Sales)** | CMA for property pricing guidance | Read |
| **Vesta (Valuation)** | Price prediction for valuation reports | Bidirectional |
| **Kairos (Intelligence)** | Shared data pipeline, complementary analysis | Bidirectional |
| **Olivia (Marketing)** | Market insights for content marketing | Read |
| **Nadia (WhatsApp)** | Investor briefing distribution | Output |
| **Maven (Data Science)** | ML model development and maintenance | Bidirectional |

---

## 6. Dashboard Widgets

| Widget | Type | Description |
|--------|------|-------------|
| Market Pulse | KPI cards | Price index, transactions, inventory, yield |
| Price Trend | Line chart | Area price trends over time |
| Transaction Heatmap | Map | Geographic distribution of transactions |
| Supply/Demand | Bar chart | Inventory vs. absorption by area |
| Sentiment Gauge | Gauge | Overall market sentiment |
| Top Performing Areas | Table | Ranked by appreciation, yield, volume |

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| CMA generation time | <60 seconds | From request to report |
| Price prediction accuracy | MAPE < 10% | Against actual transaction prices |
| Report distribution | 100% on-time delivery | Scheduled vs. delivered |
| Agent usage | >80% weekly active | Unique agent logins to market section |
| Client satisfaction | >4.5/5 rating | On investor briefings |

---

## Sources

- [DLD Transaction Data](https://dubailand.gov.ae/en/open-data/)
- [RERA Market Reports](https://www.rera.gov.ae)
- [Dubai Statistics Center](https://www.dsc.gov.ae)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Prophet Time Series](https://facebook.github.io/prophet/)
