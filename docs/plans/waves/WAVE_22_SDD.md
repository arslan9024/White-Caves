# Wave 22 — System Design Document (SDD)

**Wave:** 22  
**Focus:** Market Intelligence, Off-Plan Projects, Property Valuation & Advanced Analytics  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Cassie + @Fei-Fei + @Maya + @Mira + @Una + @Barbara  
**CONSUMESâ†:** `business_docs/09_crm_features/analytics-dashboard.md`, `business_docs/09_crm_features/market-intelligence.md`, `business_docs/09_crm_features/off-plan-projects.md`, `business_docs/09_crm_features/property-valuation.md`  
**FEEDSâ†':** All future waves (analytics underpins everything); executive reporting; investor portal

---

## Objective

Build the intelligence layer of the White Caves CRM: an automated property valuation engine (AVM), Dubai market intelligence dashboard, off-plan project lifecycle management with payment milestone tracking and Oqood registration, advanced analytics with drill-down capabilities, and a scheduled market report that lands in the MD inbox every Monday. This wave transforms White Caves from a transactional CRM into a data-driven real estate intelligence platform.

---

## Scope

### 1. Property Valuation Engine (AVM)

- AVM inputs: location, BUA sqft, bedrooms, bathrooms, floor, view, building age, last DLD transaction
- AVM output: estimated market value AED, confidence score %, comparable transactions (min 3), value range ±10%
- Manual valuation override with manager approval
- Rental yield calculator (gross and net)
- Valuation history per property
- Monthly bulk AVM refresh (cron job)

### 2. Dubai Market Intelligence

- Dubai area price index: price per sqft for top 30 neighborhoods (monthly update)
- DLD transaction volume dashboard: by property type, area, price band
- Supply/demand metrics: days on market, absorption rate, new vs sold ratio
- RERA rental index by area (allowed increase %)
- Price drop alert (>5% in followed area → notify relevant leads)
- Automated weekly market report PDF (MD + board email)

### 3. Off-Plan Project Management

- Project schema: developer, name, location, launch date, completion, units, payment plans
- Unit inventory state machine: Available → Reserved → Sold → Transferred
- Buyer reservation workflow: EOI → SPA → DLD Oqood registration (60-day window)
- Payment milestone schedule: linked to construction completion %
- RERA off-plan escrow compliance (Law No. 8 of 2007)
- Cancellation refund rules (RERA Article 11 penalty table)
- ROI projection calculator (gross yield, net yield, payback years)

### 4. Advanced Analytics & BI

- Executive KPI tiles: revenue MTD, pipeline value, leads created, conversion rate, days-on-market avg
- Recharts dashboard: line chart (12-month trend), bar chart (transactions by type), scatter (price vs sqft)
- Dubai area heatmap: Leaflet.js choropleth (price per sqft by neighborhood)
- Saved map search with push alert for new listings in bounding box
- Nightly aggregation cron: daily_stats → analytics_snapshots collection
- Real-time counters via Redis INCR (today's leads, active viewings, open maintenance)
- Bulk data export pipeline: async job, 50K row limit, email download link
- Scheduled weekly digest email: Monday 08:00 to MD + board

### 5. Agent Performance Analytics

- Agent league table: deals closed, revenue generated, conversion rate, avg days to close
- RERA license expiry tracker: alert 90/30 days before expiry; block lead assignment on expiry
- Performance Improvement Plan (PIP): triggered by manager, track actions and milestones
- Monthly performance report PDF per agent

---

## Requirement IDs (Wave 22)

| ID | Requirement |
|---|---|
| `REQ-INTEL-001` | AVM produces estimated value, confidence score, and ≥3 comparable transactions |
| `REQ-INTEL-002` | Manual valuation override requires manager approval and reason |
| `REQ-INTEL-003` | Rental yield calculator outputs gross yield %, net yield %, and payback years |
| `REQ-INTEL-004` | Monthly AVM refresh cron updates all active property valuations |
| `REQ-INTEL-005` | Dubai area price index displays price/sqft for top 30 neighborhoods |
| `REQ-INTEL-006` | RERA rental index check is displayed per area with allowed increase % |
| `REQ-INTEL-007` | Price drop alert fires when area average falls >5% vs previous month |
| `REQ-INTEL-008` | Weekly market report PDF is emailed Monday 08:00 to MD and board |
| `REQ-OFFPLAN-001` | Off-plan unit inventory follows 4-state machine: Available → Reserved → Sold → Transferred |
| `REQ-OFFPLAN-002` | Buyer reservation creates EOI deposit record and triggers SPA draft workflow |
| `REQ-OFFPLAN-003` | Oqood DLD registration tracked within 60-day window; alert on breach |
| `REQ-OFFPLAN-004` | Payment milestone schedule auto-generates from SPA payment plan and construction % |
| `REQ-OFFPLAN-005` | Escrow compliance check: collected funds must be deposited in RERA-approved escrow |
| `REQ-OFFPLAN-006` | Cancellation refund computed per RERA Article 11 penalty table |
| `REQ-OFFPLAN-007` | ROI projection: gross yield, net yield, payback years — inputs: price, rent, service charge |
| `REQ-ANALYTICS-001` | Nightly aggregation cron writes to `analytics_snapshots` for fast dashboard load |
| `REQ-ANALYTICS-002` | Real-time counters (today's leads, active viewings) served from Redis INCR |
| `REQ-ANALYTICS-003` | Bulk data export async job supports up to 50K rows and emails download link |
| `REQ-ANALYTICS-004` | RERA license expiry blocks lead assignment when expired; 90/30-day alerts sent |
| `REQ-ANALYTICS-005` | Agent PIP workflow created by manager, tracked with actions and milestones |

---

## Data Schema

### OffPlanProject (Prisma)

```prisma
model OffPlanProject {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  developerId       String   @db.ObjectId
  name              String
  location          Json     // GeoJSON Point
  launchDate        DateTime
  estimatedCompletion DateTime
  totalUnits        Int
  paymentPlanOptions Json[]
  escrowAccountNo   String?
  reraProjectNo     String?
  status            ProjectStatus @default(ACTIVE)
  units             OffPlanUnit[]
  constructionPct   Float    @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model OffPlanUnit {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  projectId   String     @db.ObjectId
  unitNumber  String
  floor       Int
  type        UnitType
  buaSqft     Float
  listPrice   Float
  status      UnitStatus @default(AVAILABLE)
  buyerId     String?    @db.ObjectId
  reservedAt  DateTime?
  oqoodDate   DateTime?
  spaDate     DateTime?
  createdAt   DateTime   @default(now())
}

model PropertyValuation {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  propertyId      String   @db.ObjectId
  estimatedValue  Float
  confidence      Float    // 0-1
  method          ValuationMethod @default(AVM)
  comparables     Json[]
  grossYield      Float?
  netYield        Float?
  valuerId        String?  @db.ObjectId
  overrideReason  String?
  approvedBy      String?  @db.ObjectId
  createdAt       DateTime @default(now())
}

model AnalyticsSnapshot {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  date        DateTime @unique
  newLeads    Int      @default(0)
  newProperties Int    @default(0)
  leasesSigned  Int    @default(0)
  dealsClosed   Int    @default(0)
  revenueAED    Float  @default(0)
  createdAt   DateTime @default(now())
}

enum ProjectStatus { ACTIVE COMPLETED CANCELLED SUSPENDED }
enum UnitType { STUDIO ONE_BR TWO_BR THREE_BR FOUR_BR_PLUS PENTHOUSE COMMERCIAL }
enum UnitStatus { AVAILABLE RESERVED SOLD TRANSFERRED }
enum ValuationMethod { AVM MANUAL BANK }
```

---

## API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/valuations` | Run AVM for a property |
| `PATCH` | `/api/v1/valuations/:id/override` | Manual valuation override |
| `GET` | `/api/v1/market/area-index` | Dubai area price per sqft index |
| `GET` | `/api/v1/market/rera-rental-index` | RERA rental index by area |
| `GET` | `/api/v1/market/report` | Generate weekly market report PDF |
| `POST` | `/api/v1/off-plan/projects` | Create off-plan project |
| `POST` | `/api/v1/off-plan/units/:id/reserve` | Reserve unit (create EOI) |
| `PATCH` | `/api/v1/off-plan/units/:id/status` | Update unit status |
| `GET` | `/api/v1/off-plan/units/:id/roi` | ROI projection |
| `GET` | `/api/v1/analytics/snapshots` | Analytics snapshot history |
| `GET` | `/api/v1/analytics/live-counters` | Redis real-time counters |
| `POST` | `/api/v1/analytics/export` | Initiate bulk export job |
| `GET` | `/api/v1/analytics/export/:jobId` | Export job status + download URL |
| `GET` | `/api/v1/agents/:id/performance` | Agent performance metrics |
| `POST` | `/api/v1/agents/:id/pip` | Create PIP for agent |

---

## Architecture Constraints

1. AVM comparable data sourced from internal DLD transaction records first; external scrape or manual entry fallback.
2. Dubai area price index stored in MongoDB `market_data` collection, refreshed monthly via cron.
3. RERA rental index hardcoded from 2026 RERA release; updatable via admin panel.
4. Real-time counters via Redis INCR/DECR (atomic, no race conditions).
5. Bulk export capped at 50K rows; larger requests auto-split into chunks.
6. Weekly report PDF uses Puppeteer (reuse Wave 20 document engine).
7. Map heatmap uses Leaflet.js with OpenStreetMap tiles in dev, Mapbox in production.

---

## Test Coverage Requirements

- Unit: AVM confidence scoring, yield calculator, RERA Article 11 penalty, off-plan Oqood window alert
- Integration: off-plan reservation → SPA → Oqood; valuation override approval; nightly cron analytics
- E2E: Analytics dashboard renders all widgets; off-plan project full lifecycle; weekly report email

---

## Exit Criteria

1. All REQ-INTEL-*, REQ-OFFPLAN-*, REQ-ANALYTICS-* implemented and tested
2. AVM produces values with confidence score and ≥3 comparables
3. Off-plan unit lifecycle from available to transferred verified end-to-end
4. Analytics snapshots written nightly, real-time counters accurate
5. Weekly MD market report email verified
6. RERA license expiry blocks lead assignment when triggered
7. `npm run plans:validate` green
8. Trackers updated
