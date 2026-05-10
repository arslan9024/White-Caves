# Secondary Sales — Business Specification

**Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** Secondary market transaction workflow, dual-agency disclosure and DLD transfer fee breakdown.
**Status:** ✅ Expanded by @Anima.

CONSUMES←@Fei-Fei: business_docs/09_crm_features/property-valuation.md#valuation-metrics
FEEDS→@Mary: business_docs/09_crm_features/secondary-sales.md#pipeline-rules

---

## 1. Overview

The Secondary Sales module (SecondarySalesAgent) manages the complete resale workflow for existing properties — from seller instruction through MOU, NOC, DLD transfer appointment, and commission disbursement. It enforces RERA dual-agency disclosure requirements and DLD fee calculations at every step.

**Key Capabilities:**
- Seller instruction letter + property appraisal booking
- Listing activation and offer management
- MOU generation + DLD transfer workflow
- Dual-agency disclosure (RERA Forms A, B, I)
- DLD transfer fee calculator
- Commission disbursement trigger on transfer completion

---

## 2. Transaction Workflow (Seller Instruction to Commission Disbursement)

```
Stage 1: SELLER INSTRUCTION
  → Agent meets seller → Form A signed (seller's agent appointment)
  → Property appraisal booked (AVM + optional manual valuer)
  → Listing created (status: pending_review)

Stage 2: LISTING ACTIVE
  → Manager review + RERA permit verification
  → Listing status: active
  → PropertyFinder / Bayut syndication triggered

Stage 3: OFFER MANAGEMENT
  → Buyer submits offer(s) via /api/offers
  → Form B signed by buyer (buyer's agent appointment)
  → If same agent represents both → Form I (dual agency disclosure) mandatory
  → Counter-offer rounds tracked in offer history

Stage 4: MOU (Memorandum of Understanding)
  → Offer accepted → MOU PDF generated (10% deposit clause standard)
  → MOU e-signed by buyer + seller
  → 10% deposit transferred to escrow (seller's lawyer or trusted account)

Stage 5: NOC (No-Objection Certificate)
  → Developer NOC request submitted (if strata property)
  → NOC deadline: 20 days from MOU signing
  → If NOC delayed > 20 days → buyer may withdraw + get deposit back (RERA Art 13)

Stage 6: DLD TRANSFER APPOINTMENT
  → Transfer fee calculated (see section 3)
  → Trustee appointment booked (linked to /api/viewings, type: dld_transfer)
  → All parties attend: buyer + seller + agents + trustee

Stage 7: TITLE DEED ISSUED
  → New title deed in buyer's name
  → Property record updated: owner, titleDeedNumber, lastTransactionPrice
  → Lead stage: Closed Won

Stage 8: COMMISSION DISBURSEMENT
  → Commission rule applied: standard 2% (sale price) split per agreement
  → CommissionRecord created → finance team processes payout
  → Activity log: commission disbursed to {agentName}
```

**Data Schema (transaction type flag):**
```prisma
// Property model — existing field:
transactionType  String  @default("primary")  // primary | secondary
// Also added to Lead:
transactionType  String  @default("secondary")
nocRequired      Boolean @default(false)
nocDeadline      DateTime?
nocReceived      Boolean @default(false)
```

---

## 3. Dual-Agency Disclosure (RERA Forms A, B, I)

**RERA Prohibition:** Undisclosed dual representation is illegal under Dubai Law.

| Form | Description | Signed By | Mandatory When |
|---|---|---|---|
| **Form A** | Seller appoints White Caves as listing agent | Seller | Always (on instruction) |
| **Form B** | Buyer appoints White Caves as buying agent | Buyer | Always (on offer) |
| **Form I** | Dual agency disclosure (same agent for both) | Seller + Buyer + Agent | If same agent represents both parties |

**Enforcement in CRM:**
- If `offer.agentId === listing.agentId` → Form I mandatory field appears, cannot proceed without upload
- Signed Form I stored: `uploads/compliance/form-i/{transactionId}.pdf`
- Audit log entry on Form I upload

---

## 4. DLD Transfer Fee Breakdown

```ts
function calcTransferFees(
  salePriceAed: number,
  buyerAgentCommissionPct = 2,
  sellerAgentCommissionPct = 2,
  trusteeFee = 4000
): TransferFeeBreakdown {
  return {
    dldTransferFee: salePriceAed * 0.04,        // 4% — paid by buyer (negotiable)
    dldAdminFee: 580,                            // fixed
    trusteeFee,                                  // AED 4,000–10,000 per trustee
    buyerAgentCommission: salePriceAed * (buyerAgentCommissionPct / 100),
    sellerAgentCommission: salePriceAed * (sellerAgentCommissionPct / 100),
    totalBuyerCost: salePriceAed + salePriceAed * 0.04 + 580 + trusteeFee + salePriceAed * (buyerAgentCommissionPct / 100),
  };
}
```

**API:** `GET /api/secondary-sales/fees?salePrice=&buyerCommPct=&sellerCommPct=`

---

## 5. Secondary Market KPIs

| KPI | Formula |
|---|---|
| Avg days listing to sold | `soldDate - listingDate` (mean) |
| Price achieved vs asking % | `(soldPrice / askPrice) × 100` |
| Avg commission per deal | Mean of `CommissionRecord.amountAed` for secondary deals |
| Dual agency rate | `Form I count / total deals × 100` |
| NOC delay rate | `NOC > 20 days / total deals requiring NOC × 100` |

---

## 6. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Transfer fee calculation correct for AED 3M deal | Unit |
| Same agent → Form I required before MOU | Integration |
| NOC delay > 20 days → buyer withdrawal allowed | Unit |
| Commission record created on transfer completion | Integration |
| DLD transfer appointment linked to viewing slot | Integration |

---

## 7. Security & Compliance

- Form A, B, I documents: immutable once signed; no update endpoint
- DLD transfer: only `manager` / `admin` can mark transfer complete (prevents premature disbursement)
- PEP screening on buyers for transactions > AED 5M (compliance flag in buyer profile)