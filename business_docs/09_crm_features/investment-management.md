# Investment Management — Business Specification

**Owner:** @Mary | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** MavenInvestment module for investor profiles, portfolio dashboards and deal flow pipeline.
**Status:** ✅ Expanded by @Mary.

CONSUMES←@Anima: business_docs/09_crm_features/secondary-sales.md#pipeline-rules
FEEDS→@Invoice: business_docs/09_crm_features/sentinel-property.md#inventory-finance-bridge

---

## 1. Overview

MavenInvestmentCRM manages high-net-worth investor relationships, their property portfolios, and the deal flow pipeline for investment-grade transactions. It provides ROI analysis tools, quarterly investor reports, and an investment committee workflow for large deals.

---

## 2. Investor Profile Fields

```prisma
model InvestorProfile {
  id                   String   @id @default(cuid())
  userId               String   @unique                // linked to User record
  riskAppetite         String   // conservative | moderate | aggressive
  investmentHorizon    String   // 1-3yrs | 3-7yrs | 7+yrs
  preferredAreas       String[] // e.g. ["Palm Jumeirah", "DIFC"]
  preferredTypes       String[] // apartment | villa | commercial | off-plan
  minBudgetAed         Float
  maxBudgetAed         Float
  citizenshipCountry   String   // for freehold eligibility check per area
  freeholdEligible     Boolean  // calculated field based on citizenship + area
  isVIP                Boolean  @default(false)        // triggers concierge tier
  sourceOfFunds        String?  // declaration for AML
  pepScreeningStatus   String   @default("pending")    // pending|cleared|escalated
  assignedAgentId      String
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

**Freehold Eligibility Check:**
Non-GCC nationals can only purchase freehold in designated zones (Palm Jumeirah, Downtown, Dubai Marina, DIFC, etc.). System flags ineligible areas when non-GCC investor selects a non-freehold zone.

---

## 3. Portfolio Dashboard KPIs

**Route:** `GET /api/investments/portfolio?investorId=`

```ts
interface PortfolioSummary {
  totalProperties: number;
  totalCurrentValueAed: number;      // sum of AVM estimates
  totalInvestedAed: number;          // sum of purchase prices
  unrealizedGainAed: number;         // currentValue - invested
  unrealizedGainPct: number;
  averageGrossYieldPct: number;
  averageNetYieldPct: number;
  occupancyRate: number;             // occupied leases / total units × 100
  properties: PropertyPortfolioItem[];
}
```

**Dashboard Charts:**
- Portfolio value over time (area chart, AVM snapshots monthly)
- Yield by property (horizontal bar)
- Geographic distribution (mini Leaflet map with property pins)
- Cash flow waterfall (income vs expenses vs commission)

---

## 4. Investment Analysis Tools

### ROI Calculator
```
GET /api/investments/roi-calculator?propertyId=&annualRentAed=&serviceChargeAed=&mortgageRateAed=
Response: {
  grossYieldPct, netYieldPct, paybackYears,
  cashPurchaseROI, mortgageROI, breakEvenMonths,
  cashVsMortgageComparison: { scenario, monthlyPayment, totalCostAfter10yrs }[]
}
```

### Area Yield Comparison Table
```
GET /api/investments/area-yields?bedrooms=
Response: [{ area, avgGrossYieldPct, avgNetYieldPct, avgPricePerSqft, transactionCount }]
Sorted by: netYieldPct DESC
```

---

## 5. Investor Quarterly Report PDF

**Schedule:** Auto-generated on the 1st of each quarter, emailed to investor.

**Content:**
- Portfolio snapshot (total value vs last quarter %)
- Performance vs Dubai residential price index (Recharts line overlay)
- Rental income vs expenses (P&L table)
- Tenant occupancy rate
- Upcoming lease renewals (next 90 days)
- Recommended actions (re-investment opportunities based on investor profile)

**API:**
```
POST /api/investments/report/generate?investorId=&quarter=Q1-2026
GET  /api/investments/report/:reportId → download PDF
```

---

## 6. Deal Flow Pipeline

**Stages:** Opportunity → Due Diligence → LOI Signed → Funds Transfer → DLD Transfer → Portfolio

```prisma
model InvestmentDeal {
  id              String   @id @default(cuid())
  investorId      String
  propertyId      String
  agentId         String
  dealValueAed    Float
  probabilityPct  Int      // 0-100
  stage           String   @default("opportunity")
  expectedCloseDate DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**Pipeline UI:** Kanban board (draggable cards) — same pattern as lead pipeline.
**Revenue forecast:** `dealValueAed × commissionRate × probabilityPct` summed across all deals = projected commission.

---

## 7. Investment Committee Workflow (Deals > AED 5M)

**Trigger:** `dealValueAed > 5,000,000`

**Required approvals:**
1. Assigned agent submits deal for committee review
2. Committee members notified (MD + 2 senior agents — configurable)
3. Meeting minutes uploaded (PDF)
4. Majority approval (2/3) → deal proceeds
5. Rejection → reason logged, investor notified by agent

**API:**
```
POST /api/investments/committee/submit?dealId=
POST /api/investments/committee/vote?dealId= { memberId, vote: 'approve'|'reject', reason }
GET  /api/investments/committee/status?dealId=
```

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Non-GCC investor + non-freehold area → eligibility flag | Unit |
| Portfolio KPIs calculated correctly | Unit |
| Deal > AED 5M → committee approval required | Integration |
| Quarterly report PDF generated | Integration |
| Area yield comparison sorted correctly | Unit |

---

## 9. Security & Compliance

- PEP screening mandatory before deal > AED 5M can proceed (`pepScreeningStatus = 'cleared'`)
- Source of funds declaration required at investor profile creation
- Portfolio data: agent (own investors), manager (team), admin (all) — RBAC enforced
- Investor quarterly report: signed URL, 48h expiry