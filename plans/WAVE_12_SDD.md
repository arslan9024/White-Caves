# WAVE 12 — Software Design Document (SDD)

## Property Valuation API + Market Intelligence Dashboard

**Wave:** 12  
**Date:** 2026-05-22  
**Status:** ✅ IMPLEMENTED  
**Authorization:** @Ada — Context Ready (60% Readiness) — Coding Phase Approved  
**Readiness Score:** 82% (business spec ✅, API contract ✅, data schema ✅, test scenarios ✅)

---

## 1. Executive Summary

Wave 12 introduces two production-grade modules that unlock the "Dubai Data Intelligence" pillar
of the White Caves CRM:

| Module                      | Description                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Property Valuation API**  | Full AVM engine with MongoDB persistence, snapshot history, manual override workflow, rental yield calculator, and bank valuation request path         |
| **Market Intelligence API** | Dubai area price index, transaction volume dashboard, supply/demand signals, RERA rental index, competitor benchmarking, and automated monthly reports |

Both modules are new dedicated route files wired into `server/index.ts` and accompanied by
React frontend pages.

---

## 2. Architecture

```
┌─ Frontend ──────────────────────────────────────────────┐
│  ValuationPage.tsx          MarketIntelligencePage.tsx  │
│     └─ useValuation hook         └─ useMarketData hook  │
└──────────────────────────────────────┬──────────────────┘
                                       │ REST
┌─ Backend ─────────────────────────────────────────────  ┐
│  server/index.ts                                        │
│    ├─ /api/valuations  → server/routes/valuation.ts     │
│    └─ /api/market      → server/routes/market.ts        │
│                                                         │
│  Prisma models:                                         │
│    PropertyValuation   MarketSnapshot                   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Data Models

### 3.1 PropertyValuation

```prisma
model PropertyValuation {
  id                 String    @id @default(cuid())
  propertyId         String
  estimatedValueAed  Float
  rentAnnualAed      Float
  grossYieldPct      Float
  netYieldPct        Float
  confidence         String    // high | medium | low
  method             String    // avm | manual_override | bank
  comparables        Json      // array of comparable objects
  ageDiscount        Float     @default(0)
  amenityPremium     Float     @default(0)
  overrideReason     String?
  overriddenById     String?
  bankRequestStatus  String?   // pending | submitted | received
  bankResponseAed    Float?
  bankRequestedAt    DateTime?
  bankRespondedAt    DateTime?
  createdById        String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  property           Property  @relation(fields: [propertyId], references: [id])
  createdBy          User      @relation("ValuationCreator", fields: [createdById], references: [id])
  overriddenBy       User?     @relation("ValuationOverrider", fields: [overriddenById], references: [id])

  @@index([propertyId])
  @@index([createdAt])
}
```

### 3.2 MarketSnapshot

```prisma
model MarketSnapshot {
  id             String   @id @default(cuid())
  snapshotDate   DateTime @default(now())
  area           String
  propertyType   String   // apartment | villa | townhouse | penthouse | all
  avgPricePerSqft Float
  avgSalePrice   Float
  avgAnnualRent  Float
  grossYield     Float
  transactionVol Int
  daysOnMarket   Float
  absorptionRate Float
  source         String   @default("dld")
  notes          String?
  createdAt      DateTime @default(now())

  @@index([area, snapshotDate])
  @@index([snapshotDate])
}
```

---

## 4. API Contracts

### 4.1 Valuation Routes — `/api/valuations`

| Method | Path                                       | Auth          | Description                |
| ------ | ------------------------------------------ | ------------- | -------------------------- |
| `GET`  | `/api/valuations/:propertyId`              | Required      | Latest valuation + history |
| `POST` | `/api/valuations/:propertyId/recalculate`  | Required      | Trigger AVM recompute      |
| `POST` | `/api/valuations/:propertyId/override`     | admin/manager | Manual override            |
| `POST` | `/api/valuations/:propertyId/bank-request` | Required      | Bank valuation request     |
| `GET`  | `/api/valuations/:propertyId/history`      | Required      | All snapshots (paginated)  |
| `GET`  | `/api/valuations/yield-calculator`         | Public        | Gross/net yield utility    |

### 4.2 Market Intelligence Routes — `/api/market`

| Method | Path                          | Auth          | Description               |
| ------ | ----------------------------- | ------------- | ------------------------- |
| `GET`  | `/api/market/price-index`     | Required      | Area price index table    |
| `GET`  | `/api/market/transactions`    | Required      | Monthly volume by area    |
| `GET`  | `/api/market/indicators`      | Required      | Supply/demand metrics     |
| `GET`  | `/api/market/rera-index`      | Required      | RERA rental index by area |
| `POST` | `/api/market/reports/monthly` | admin/manager | Generate monthly report   |
| `GET`  | `/api/market/snapshots`       | Required      | Historical area snapshots |

---

## 5. Business Logic

### 5.1 AVM Engine (Valuation)

1. Normalize area name to lookup key.
2. Fetch Dubai area price-per-sqft benchmark.
3. Apply age discount: `min(20%, max(0, (currentYear - yearBuilt - 10) × 1%))`.
4. Apply amenity premium: `min(15%, luxuryAmenityCount × 3%)`.
5. Estimate sale price = `sqft × benchmarkSale × typeMultiplier × (1 - ageDiscount) × (1 + amenityPremium)`.
6. Compute gross yield = `annualRent / salePrice × 100`.
7. Compute net yield = `(annualRent - serviceCharge) / salePrice × 100`.
8. Assign confidence: `high` if exact benchmark match + sqft provided, `medium` if partial match, `low` otherwise.
9. Persist snapshot to `PropertyValuation` collection.
10. Return snapshot with ±15% price range.

### 5.2 Market Intelligence

1. Read latest `MarketSnapshot` records from Prisma.
2. Aggregate by area + property type.
3. Compute absorption rate = `unitsSold / activeListings × 100`.
4. Compute days on market median per area.
5. Flag opportunities where net yield > 7% or price drop > 5%.

---

## 6. Security & Roles

| Action                  | Allowed Roles         |
| ----------------------- | --------------------- |
| View valuations         | All authenticated     |
| Trigger AVM recalculate | agent, manager, admin |
| Manual override         | manager, admin        |
| Bank request            | manager, admin        |
| Market read             | All authenticated     |
| Market report generate  | manager, admin        |
| Market snapshot write   | admin only            |

---

## 7. Frontend Components

| Component                | Route        | Purpose                                  |
| ------------------------ | ------------ | ---------------------------------------- |
| `ValuationPage`          | `/valuation` | Full valuation dashboard for a property  |
| `MarketIntelligencePage` | `/market`    | Dubai market index + analytics dashboard |

---

## 8. Dependencies

- Existing: `prisma`, `authMiddleware`, `asyncHandler`, `AppError`, `logger`
- No new npm packages required
- Dubai benchmark data: hardcoded in service (live DLD API is a future enhancement)

---

## 9. Rollback Plan

- New models appended to schema → rollback = `npx prisma db push --force-reset` (dev only) or create a reverse migration
- New route files: delete `valuation.ts` + `market.ts` and remove the 2 `app.use()` lines from `index.ts`
- Frontend pages: remove from router without affecting other routes

---

_Generated by Wave 12 planning session — White Caves CRM_
