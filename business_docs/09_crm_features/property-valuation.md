# Property Valuation — Business Specification

**Owner:** @Fei-Fei | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** AVM engine, rental yield calculator and bank valuation request workflow.
**Status:** ✅ Expanded by @Fei-Fei.

CONSUMES←@Mary: business_docs/09_crm_features/sentinel-property.md#inventory-signals
FEEDS→@Anima: business_docs/09_crm_features/property-valuation.md#valuation-metrics

---

## 1. Overview

CipherValuationCRM provides Automated Valuation Model (AVM) estimates, rental yield calculations, bank valuation request workflows, and a valuation history log for every property. It powers accurate pricing decisions for agents, landlords, and investors.

**Key Capabilities:**
- AVM with DLD comparable transaction data
- Manual valuation override with manager approval
- Rental yield calculator (gross + net)
- Bank valuation request workflow
- Monthly bulk AVM refresh cron

---

## 2. AVM Inputs and Output Schema

### AVM Inputs
| Field | Type | Source |
|---|---|---|
| `location` | GeoPoint `{lat, lng}` | Property record |
| `buaSqft` | Number | Property record |
| `bedrooms` | Number | Property record |
| `bathrooms` | Number | Property record |
| `floorNumber` | Number | Property record |
| `viewType` | Enum: sea/park/city/community | Property record |
| `buildingAge` | Number (years) | Property record |
| `lastTransactionPrice` | Number (AED) | DLD API |

### AVM Output
```ts
interface AVMResult {
  estimatedValueAed: number;
  confidenceScore: number;        // 0–100, based on comparable count
  valueRangeLow: number;          // estimatedValue × 0.90
  valueRangeHigh: number;         // estimatedValue × 1.10
  comparablesUsed: number;        // min 3 required for confidence > 60
  dataSourceDate: string;         // date of most recent DLD data used
  calculatedAt: string;           // ISO timestamp
}
```

### Calculation Logic
```ts
// server/services/valuation/avmEngine.ts
async function calculateAVM(propertyId: string): Promise<AVMResult> {
  const property = await getProperty(propertyId);
  const comparables = await getDldComparables({
    area: property.area,
    bedrooms: property.bedrooms,
    buaRange: [property.buaSqft * 0.85, property.buaSqft * 1.15],
    maxAgeDays: 180,
    minCount: 3,
  });
  const avgPricePerSqft = comparables.reduce((sum, c) => sum + c.pricePerSqft, 0) / comparables.length;
  const estimated = avgPricePerSqft * property.buaSqft;
  // Adjustments: floor premium (+2%/floor above 5), view premium (sea +8%, park +4%), age discount (-1%/year over 15)
  return applyAdjustments(estimated, property, comparables);
}
```

---

## 3. Rental Yield Calculator

**Route:** `GET /api/valuation/yield?propertyId=&annualRentAed=&serviceChargeAed=`

```ts
interface YieldResult {
  grossYieldPct: number;    // (annualRentAed / estimatedValueAed) × 100
  netYieldPct: number;      // ((annualRentAed - serviceChargeAed) / estimatedValueAed) × 100
  paybackYears: number;     // 1 / netYieldPct × 100
  benchmarkGross: number;   // RERA average for area+bedroom
  aboveBenchmark: boolean;
}
```

**Display in UI:** Gauge chart (gross vs net yield) + comparison bar vs RERA area benchmark.

---

## 4. Manual Valuation Override

**When used:** RERA-certified valuer provides independent opinion; AVM confidence < 60.

**Workflow:**
1. Agent enters `manualValueAed`, `overrideReason`, `valuerId` (RERA license number)
2. Manager approval required (POST `/api/valuation/override/:propertyId/approve`)
3. On approval: `Property.valuationSource = 'manual'`, `Property.valuedAt = now()`
4. Audit log entry: who overrode, old AVM value, new manual value, reason

**Expiry:** Manual valuations expire after 6 months; AVM re-runs automatically.

---

## 5. Valuation History

```prisma
model ValuationRecord {
  id              String   @id @default(cuid())
  propertyId      String
  method          String   // avm / manual
  estimatedValue  Float
  confidenceScore Float?
  valuerId        String?  // for manual valuations
  valuedBy        String   // userId
  valuedAt        DateTime @default(now())
  expiresAt       DateTime?
  metadata        Json?    // AVM comparables snapshot
}
```

**UI:** Timeline chart of property value history with AVM vs manual markers.

---

## 6. Bank Valuation Request Workflow

Used when buyer requests mortgage pre-approval. Banks (Emirates NBD, Mashreq, Abu Dhabi Commercial Bank, etc.) require independent RERA-certified valuation.

**Workflow:**
1. Agent selects bank from dropdown (maintains bank-specific requirements list)
2. CRM generates bank valuation request form (PDF) with: property details, RERA permit, title deed scan
3. Valuer booked via scheduling calendar (type: `rera_inspection`)
4. Valuer's report uploaded to CRM → linked to property + lead
5. Lead stage updated to `Mortgage Pending`

**API:**
```
POST /api/valuation/bank-request
Body: { propertyId, leadId, bankName, valuerId }
Success 201: { requestId, valuationAppointmentSlot }
```

---

## 7. Monthly Bulk AVM Refresh

**Cron:** 1st of every month at 02:00 GST
```ts
// Processes all active properties with AVM source or expired manual valuations
async function bulkAVMRefresh(): Promise<void> {
  const properties = await prisma.property.findMany({ where: { isActive: true } });
  for (const p of properties) {
    const result = await calculateAVM(p.id);
    await saveValuationRecord({ ...result, method: 'avm' });
  }
}
```

**Alert:** If > 5% of properties have confidence < 40 → email to `data@whitecaves.com` (insufficient DLD comparables).

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| AVM with 5 comparables → confidence > 60 | Unit |
| AVM with < 3 comparables → confidence 0, flag shown | Unit |
| Gross yield formula correct | Unit |
| Manual override requires manager approval | Integration |
| Bulk refresh updates all active properties | Integration |
| Bank valuation request creates appointment slot | Integration |

---

## 9. Observability / Metrics

| Metric | Alert |
|---|---|
| Properties with no AVM in 30+ days | Daily report |
| Average AVM confidence score | Dashboard gauge |
| Manual override rate | KPI (target < 10%) |
| Bulk refresh failure count | Email alert |

---

## 10. Security & Compliance

- AVM model uses only publicly available DLD transaction data
- Manual valuations require RERA-certified valuer license number (validated format)
- Valuation reports accessible only to: owning agent, manager, admin
- Bank valuation documents scoped to: lead agent + manager (client confidentiality)