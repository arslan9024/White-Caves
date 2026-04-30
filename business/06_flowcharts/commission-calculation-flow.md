# Commission Calculation Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-COMM-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Finance Department (Theodora — Finance & Accounts Director)
> **Scope:** Commission calculation from deal closure through approval, payment, and reconciliation

---

## 1. Commission Flow Overview

```
Deal Closed (WON)
      │
      ▼
 CommissionService calculates
 agent commission
      │
      ▼
 Commission record created
      │
      ▼
 Approval routing
 (by amount tier)
      │
      ▼
 Manager / MD approves
      │
      ▼
 Commission statement generated (PDF)
      │
      ▼
 Payment processed
 (bank transfer / payroll)
      │
      ▼
 Reconciliation with
 accounts (Phase 3)
```

---

## 2. Commission Rates by Transaction Type

### 2.1 Sales Commissions

| Transaction Type | Rate | Paid By | Notes |
|----------------|------|---------|-------|
| Off-plan new sale (developer) | 5–7% | Developer pays 100% | DAMAC, Emaar, Sobha |
| Off-plan secondary market | 2% | Both sides | |
| Ready property — primary | 2% | Buyer | |
| Ready property — secondary | 1–2% | Both sides if dual agent | |
| Commercial sale | 2–3% | Negotiated | |
| Land sale | 1.5–2% | Per agreement | |

### 2.2 Rental Commissions

| Transaction Type | Rate | Paid By |
|----------------|------|---------|
| New residential lease | 5% annual rent | Landlord |
| New commercial lease | 8–10% annual rent | Landlord |
| Lease renewal (managed) | 2% annual rent | Landlord |
| Short-term rental setup | 10% first month | Landlord |

### 2.3 Property Management Recurring

| Service Level | Monthly Fee |
|--------------|-------------|
| Basic (rent collection) | 5% monthly rent |
| Full (+ maintenance, renewals) | 8% monthly rent |
| Premium (+ legal, compliance, reporting) | 10% monthly rent |

---

## 3. Commission Calculation Logic

```
Deal record: { salePrice: 2,000,000 AED, type: 'ready_secondary', agentId }
          │
          ▼
  CommissionService.calculate(deal):
  
  Step 1: Determine base commission rate
  ├── Transaction type lookup: ready_secondary → 2%
  ├── Base commission = salePrice × rate
  │   = 2,000,000 × 0.02 = AED 40,000
          │
          ▼
  Step 2: Apply splits

  ┌────────────────────────────────────────────────────────┐
  │ SPLIT STRUCTURE (configurable per agent contract)      │
  │                                                        │
  │ Agent commission:      60–80% of base                  │
  │ Team lead (if any):    5–10% of base                   │
  │ Company:               15–35% of base                  │
  │                                                        │
  │ Example (agent 70%):                                   │
  │   Agent:    40,000 × 0.70 = AED 28,000                 │
  │   Company:  40,000 × 0.30 = AED 12,000                 │
  └────────────────────────────────────────────────────────┘
          │
          ▼
  Step 3: Apply deductions (if applicable)
  ├── Marketing contribution: AED 500 (off-plan only)
  ├── Admin fee: AED 250 per transaction
  └── Outstanding advances: deducted from commission
          │
          ▼
  Step 4: VAT calculation
  Commission subject to 5% VAT (UAE)
  Agent net = 28,000
  VAT on agent commission = 28,000 × 0.05 = 1,400
  Total invoiced to client = 40,000 + 2,000 VAT = 42,000
          │
          ▼
  Commission record created:
  {
    agentId, dealId, transactionType,
    salePrice: 2,000,000,
    baseCommission: 40,000,
    agentShare: 28,000,
    companyShare: 12,000,
    vatAmount: 2,000,
    deductions: 750,
    agentNetPayable: 27,250,
    status: 'pending_approval'
  }
```

---

## 4. Approval Routing

```
Commission record created (status: pending_approval)
          │
          ▼
  Approval tier check:

  ┌────────────────────────────────────────────────────────────┐
  │ Agent Net Commission    │ Approver        │ SLA            │
  ├─────────────────────────┼─────────────────┼────────────────┤
  │ Under AED 50,000        │ Auto-approved   │ Instant        │
  │ AED 50,000 – 200,000    │ Sales Manager   │ 24 hours       │
  │ Over AED 200,000        │ Managing Director│ 48 hours      │
  └─────────────────────────────────────────────────────────────┘
          │
          ▼
  Approval request sent:
  ├── Approver: CRM notification + email
  ├── CRM shows: deal details, commission breakdown, agent history
  └── Option: Approve | Request revision | Reject (with reason)
          │
          ├── APPROVED:
          │   status → 'approved'
          │   Agent notified: "Your commission has been approved"
          │   Commission statement generated (PDF)
          │
          ├── REVISION REQUESTED:
          │   Theodora reviews → Adjusts figures
          │   Resubmits for approval
          │
          └── REJECTED:
              status → 'rejected'
              Reason logged
              Agent notified with explanation
```

---

## 5. Commission Statement Generation

```
Commission approved
          │
          ▼
  [Phase 2: PDFKit]
  Commission statement PDF generated:

  ┌──────────────────────────────────────────────────────────┐
  │ WHITE CAVES REAL ESTATE LLC                              │
  │ Commission Statement                                     │
  │ ─────────────────────────────────────────────────────── │
  │ Agent:          [Name, RERA ORN]                        │
  │ Date:           [Approval Date]                         │
  │ Reference:      WC-COMM-2026-XXXXX                      │
  │ ─────────────────────────────────────────────────────── │
  │ Property:       3BR Villa, DAMAC Hills 2, Pacifica      │
  │ Client:         [Buyer Name]                            │
  │ Transaction:    Sale — Ready Secondary                  │
  │ Sale Price:     AED 2,000,000                           │
  │ Commission %:   2.00%                                   │
  │ Base Commission:AED 40,000                              │
  │ Agent Share:    70% = AED 28,000                        │
  │ Deductions:     AED 750                                 │
  │ Agent Net:      AED 27,250                              │
  │ VAT (5%):       AED 2,000                               │
  │ ─────────────────────────────────────────────────────── │
  │ Approved by: [Manager Name, Date]                       │
  └──────────────────────────────────────────────────────────┘
          │
          ▼
  PDF stored in:
  ├── Agent's document vault (CRM)
  └── Finance records (accounting integration — Phase 3)
          │
          ▼
  Agent notified: "Commission statement ready — download in CRM"
```

---

## 6. Payment Processing

```
Commission approved + statement generated
          │
          ▼
  Payment method determined:
  ├── Monthly payroll: Added to salary run (end of month)
  └── Immediate transfer: For freelance/commission-only agents
          │
          ▼
  Finance team processes payment:
  ├── Bank transfer to agent's UAE bank account
  ├── Payroll integration (Phase 3 — accounting software)
  └── Payment receipt uploaded to CRM
          │
          ▼
  Commission status updated:
  'approved' → 'paid'
  paidAt = timestamp
  paymentReference = "WC-PAY-2026-XXXXX"
          │
          ▼
  Agent notified: "Commission payment processed"
  Agent can view payment history in CRM dashboard
```

---

## 7. Reconciliation Flow (Phase 3)

```
End of month reconciliation
          │
          ▼
  Theodora (AI) runs reconciliation report:
  
  Checks:
  ├── All approved commissions → paid status?
  ├── Payments match bank statement amounts?
  ├── VAT correctly recorded for quarterly filing?
  └── Developer commission receipts received (off-plan)?
          │
          ▼
  Discrepancies flagged:
  ├── Missing payment → Alert finance officer
  ├── Amount mismatch → Manual review queue
  └── Developer payment delayed → Escalation to managing director
          │
          ▼
  Monthly commission summary generated:
  ├── Total commissions earned (by agent, team, company)
  ├── Average commission per deal
  ├── Top performing agents
  ├── Pipeline commissions forecast (open deals)
  └── VAT liability summary
```

---

## 8. Developer Commission Collection (Off-Plan)

```
Off-plan deal sold (developer commission)
          │
          ▼
  Invoice sent to developer:
  { whitesCavesCompanyName, dealRef, propertyRef, commission% + amount }
          │
          ▼
  Developer payment terms:
  ├── DAMAC: 30 days after SPA signing
  ├── Emaar: 30 days after SPA signing
  └── Meraas: 45 days after SPA signing
          │
          ▼
  Payment tracking in CRM:
  ├── Invoice sent: status = 'invoiced'
  ├── Payment received: status = 'received'
  └── Overdue (>30 days): auto-escalation to MD
          │
          ▼
  On receipt:
  Agent commission released from hold
  Company accounts updated
```

---

## 9. Commission Dispute Resolution

```
Agent disputes commission amount
          │
          ▼
  Agent submits dispute in CRM:
  { commissionId, reason, claimedAmount }
          │
          ▼
  Theodora (AI) reviews:
  ├── Check original deal terms
  ├── Check agent contract commission % 
  └── Check any applicable adjustments
          │
          ├── Dispute valid → Adjustment approved by MD
          │   Difference paid in next cycle
          │
          └── Dispute invalid → Explained to agent
              Agent can escalate to HR if unresolved
```

---

**Document Owner:** Finance Department (Theodora)
**Related:** `business_docs/09_crm_features/commission-tracking.md`, `business_docs/07_business_model/revenue-model.md`


---

## 8. Off-Plan Commission Structure

Off-plan deals typically pay higher commission (developer-sponsored) at different stages:

### 8.1 Payment Schedule for Off-Plan Commissions

```
SPA Signed (off-plan):
Agent receives 50% of agreed commission immediately upon DLD registration
                                    │
                                    ▼
Handover (keys given to buyer):
Agent receives remaining 50% upon successful handover
                                    │
                                    ▼
(Some developers pay 100% at SPA — check per project NOC terms)
```

| Developer | Commission Rate | Payment Timing |
|---------|---------------|--------------|
| DAMAC Properties | 5–7% | 50% at SPA; 50% at handover |
| Emaar Properties | 4–5% | 100% at SPA registration |
| Nakheel | 5% | 50% at SPA; 50% at completion |
| Meraas | 5% | 100% at DLD registration |

**Note:** Rates verified per NOC — subject to developer policy changes. Always check NOC terms before listing.

### 8.2 Off-Plan Commission at Risk

Off-plan deals have a higher commission clawback risk:
- Buyer cancels during cooling-off period (14 days): 100% clawback
- Buyer defaults on payment plan: 50% clawback if within first year
- Developer project cancelled by DLD: No clawback — White Caves keeps earned commission

---

## 9. Co-Brokerage Commission Accounting

### 9.1 Inbound Co-Brokerage (White Caves has buyer; partner has listing)

```
Deal closes at AED 2,000,000
Commission agreed: 2% total = AED 40,000

CRM records:
├── Gross commission: AED 40,000
├── Co-brokerage partner: [Partner Agency Name + ORN]
├── Partner share: 50% = AED 20,000 (per Form I)
└── White Caves net: AED 20,000

Finance processing:
├── Invoice to seller for full AED 40,000 (White Caves is billing agent)
├── Pay partner AED 20,000 upon receipt
└── White Caves keeps AED 20,000
Agent commission: % of White Caves net = AED 20,000 × 40% = AED 8,000
```

### 9.2 Outbound Co-Brokerage (White Caves has listing; partner has buyer)

```
Deal closes at AED 2,000,000
Commission: 2% = AED 40,000

CRM records:
├── Partner agency has buyer — Form I signed
├── Split: 50/50 = AED 20,000 each

Finance:
├── Seller pays White Caves AED 40,000
├── White Caves pays partner AED 20,000 within 5 business days of receipt
└── Listing agent earns % of White Caves net = AED 20,000 × 40% = AED 8,000
```

### 9.3 Form I Filing Requirement

RERA Form I must be signed before any showing to co-brokerage buyer. Unsigned Form I = grounds for commission dispute. White Caves policy: **no showing without signed Form I on file.**

---

## 10. VAT on Commissions — Detailed Calculation

### 10.1 Residential Property Sale

```
Transaction: AED 2,000,000 residential sale
Commission: 2% = AED 40,000

VAT treatment:
├── Residential property sale: 0% VAT (zero-rated)
├── Agent commission (service): 5% VAT = AED 2,000
├── Invoice total: AED 42,000
└── VAT payable to FTA: AED 2,000

Client Invoice:
  White Caves Real Estate LLC | TRN: [XXXXXXXXXXXXX]
  Commission for sale of Unit [X], DAMAC Hills 2 ......... AED 40,000
  VAT (5%) .......................................................... AED  2,000
  Total Due ........................................................ AED 42,000
```

### 10.2 Commercial Property Transaction

```
Transaction: AED 5,000,000 commercial warehouse sale
Commission: 2% = AED 100,000

VAT treatment:
├── Commercial property sale: 5% VAT on property (paid by buyer — not agent's concern)
├── Agent commission (service): 5% VAT = AED 5,000
├── Invoice total: AED 105,000
└── VAT payable to FTA: AED 5,000
```

### 10.3 Rental Commission

```
Annual rent: AED 120,000 (AED 10,000/month)
Commission: 5% of annual rent = AED 6,000

VAT treatment:
├── Long-term residential rental: 0% VAT (exempt)
├── Agent commission on residential rental: 5% VAT = AED 300
├── Invoice: AED 6,300
└── VAT payable to FTA: AED 300
```

---

## 11. Quarterly Commission Reconciliation Process

**Owner:** Theodora (Finance AI) + Finance Officer

```
WEEK 1 of new quarter:

1. Extract all WON deals from CRM (previous quarter)
   └── CRM report: filter status=WON, closedAt in quarter range

2. Cross-reference with commission receipts
   └── Each WON deal must have: signed commission agreement + receipt number

3. Calculate gross commission per deal
   └── Theodora auto-generates from CRM data

4. Apply agent contract split
   └── Each agent has contract % on file (CRM User.commissionSplit)

5. Apply deductions (if any)
   └── Advance draws, co-brokerage splits, clawbacks

6. Net agent commission = gross × split% − deductions

7. Finance Officer reviews for accuracy
   └── Spot-check 20% of deals

8. MD final approval
   └── All commissions > AED 50,000 require MD sign-off

9. Process payroll
   └── Commission paid by 15th of the month following quarter end

10. Generate commission statements
    └── Each agent receives PDF via CRM / email
```

---

**Document Owner:** Finance Department (Theodora + Finance Officer)
**Version History:** v1.0 April 2026; v2.0 April 2026 (off-plan, co-brokerage, VAT details, reconciliation)
**Related:** `business_docs/09_crm_features/commission-tracking.md`, `business/08_market_research/dubai_regulations.md`
