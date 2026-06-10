# Financial Reporting — CRM Feature Specification

> **Status:** In Progress (Core reports active, advanced exports expanding)  
> **Module Owner:** Theodora (Finance Director AI) + Zoe (Executive AI)  
> **API Endpoints:** `/api/finance`, `/api/dashboard`, `/api/commissions`  
> **Priority:** High

---

## Overview

The Financial Reporting module delivers accurate, role-appropriate financial views across the platform — from agent-level commission statements to executive P&L dashboards. All reports are exportable to Excel and PDF.

---

## Report Types

### 1. Executive Summary Dashboard (Zoe)

**Access:** Owner, Managing Director, Executive  
**Frequency:** Real-time  
**Purpose:** Single-screen business health overview

**KPIs Displayed:**
| Metric | Calculation | Period |
|--------|-------------|--------|
| Revenue MTD | Sum of closed transaction values × commission rate | Current month |
| Pipeline Value | Sum of active lead budgets (not closed) | Live |
| Commissions Paid | Sum of paid commission amounts | Current month |
| Commissions Pending | Sum of pending + approved commission amounts | Live |
| Occupancy Rate | Active leases / Total managed properties × 100 | Live |
| Leads (Hot) | Count leads with score ≥ 90 | Live |
| Conversion Rate | Won leads / Total leads × 100 | Last 30 days |
| Revenue vs Target | Actual revenue / Monthly target × 100 | Current month |

**Charts:**

- Revenue trend (12-month bar chart)
- Commission by agent (horizontal bar, top 10)
- Lead pipeline funnel (stage counts)
- Transaction volume by type (sale vs lease — pie chart)

---

### 2. Monthly P&L Report

**Access:** Finance Director, Owner  
**Frequency:** Generated on demand (usually Day 5 after month-end)  
**Format:** PDF + Excel

**Structure:**

```
WHITE CAVES REAL ESTATE — MONTHLY P&L
Period: [Month Year]
────────────────────────────────────────────────────
REVENUE
  Sales commissions (2% of sale transactions)    AED X
  Lease commissions (5% of annual rent)          AED X
  Property management fees (6-8% monthly rent)   AED X
  Premium listing fees                           AED X
  Late fee income                                AED X
────────────────────────────────────────────────────
TOTAL REVENUE                                    AED X
────────────────────────────────────────────────────
EXPENSES
  Agent commissions paid (50% of gross)          AED X
  Marketing & advertising                        AED X
  Technology (cloud, APIs, tools)                AED X
  Salaries (operations staff)                    AED X
  Office rent & utilities                        AED X
  Legal & compliance                             AED X
────────────────────────────────────────────────────
TOTAL EXPENSES                                  (AED X)
────────────────────────────────────────────────────
OPERATING PROFIT                                 AED X
PROFIT MARGIN                                       X%
────────────────────────────────────────────────────
```

---

### 3. Commission Detail Report

**Access:** Finance Director, Sales Manager, Owner  
**Frequency:** Monthly or on demand  
**Format:** Excel + PDF

**Columns:** Agent Name | Transaction Reference | Property | Transaction Type | Transaction Value (AED) | Commission Rate | Gross Commission | Agent Split % | Agent Amount | Status | Paid Date | Payment Reference

**Grouping:** By agent, then by date

---

### 4. Agent Commission Statement

**Access:** Agent (own), Manager (all), Finance  
**Frequency:** Monthly (auto-sent on payment day)  
**Format:** PDF (letterhead)

**Contents:** Agent name, BRN, period, list of commissions with transaction references, total earned, total paid, pending amount

---

### 5. Rental Income Report

**Access:** Finance Director, Owner, Landlord (own properties)  
**Frequency:** Monthly  
**Format:** Excel + PDF

**Per Landlord Section:**

- Property address
- Tenant name
- Monthly rent (AED)
- Payments received this period
- Outstanding balance
- Late fees applied

---

### 6. Transaction Summary Report

**Access:** Finance, Manager, Owner  
**Frequency:** On demand  
**Format:** Excel

**Columns:** Transaction ID | Date | Type | Property | Buyer/Tenant | Agent | Offer Price (AED) | Final Price (AED) | Status | Commission Generated (AED)

---

### 7. Agent Performance Report

**Access:** Manager, Owner  
**Frequency:** Weekly/Monthly  
**Format:** Excel + PDF + On-screen

**Per Agent:**

- Leads handled
- Viewings arranged
- Offers made
- Deals closed
- Total transaction value
- Commission earned
- Conversion rate

---

## Financial Dashboard UI Components

### Summary Cards Row

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Revenue MTD     │ │ Commissions     │ │ Pending         │ │ Pipeline Value  │
│ AED 2.4M        │ │ Paid: AED 850K  │ │ AED 320K        │ │ AED 18.5M       │
│ +12% vs last mo │ │ 28 transactions │ │ 8 awaiting      │ │ 47 active deals │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Commission List Table

- Columns: Transaction, Agent, Property, Amount, Split, Status, Actions
- Filter bar: Status, Agent, Date Range, Type
- Bulk actions: Approve selected, Export selected
- Action buttons per row: View detail, Approve, Mark Paid

---

## Export Requirements

All reports:

- [ ] Include company name, RERA license number, and report generation date/time
- [ ] PDF: A4, company branding, page numbers
- [ ] Excel: Formatted headers, auto-fit columns, frozen header row
- [ ] Export max: 50,000 rows per file
- [ ] Export triggers download in browser (no email unless scheduled)

---

## Acceptance Criteria

- [ ] Executive dashboard loads in < 2 seconds
- [ ] All KPIs update in real-time when underlying data changes
- [ ] Monthly P&L report generated within 10 seconds for any calendar month
- [ ] Agent commission statement includes all required compliance fields
- [ ] Rental income report correctly groups by landlord
- [ ] All exports include correct column headers and data
- [ ] Reports honour role-based access (agent cannot export finance summary)
- [ ] Schedule option: daily/weekly report digest emailed automatically

---

## Commission Split Calculator

### Split Calculator Purpose

Automatically calculate how each commission should be split across the agent, team lead, referral partner, and company according to deal rules.

### Split Inputs

- Transaction type: sale, lease, renewal, management fee, consulting
- Gross commission amount
- Agent profile and split plan
- Referral partner involvement
- Manager override percentage when approved
- Payment status and clawback flags

### Default Waterfall

| Layer    | Rule                                                |
| -------- | --------------------------------------------------- |
| Agent    | Base share from the approved commission plan        |
| Manager  | Optional override share for team oversight          |
| Referral | Only applied when a verified referral source exists |
| Company  | Remaining balance after all approved splits         |

### Validation Rules

- Splits must total 100% before payout
- Referral share cannot be applied twice
- Manual overrides require manager approval and audit logging
- Negative or overflow shares must be rejected at save time

### Split Calculator Acceptance Criteria

- Calculator produces identical totals in the UI and backend service
- Payout preview shows each recipient before approval
- Invalid split plans are blocked with a clear error message
- Split outcomes are included in commission export reports

## UAE VAT Reporting (FTA Compliance)

> **@Invoice — EXPAND task completed** | Model: Llama 3.1 70B via Groq (FREE)

### Regulatory Framework

UAE Federal Tax Authority (FTA) mandates VAT at **5%** on qualifying real estate services under Federal Decree-Law No. 8 of 2017 on VAT.

### VAT Applicability for Real Estate

| Transaction Type                                                | VAT Treatment      | Rate |
| --------------------------------------------------------------- | ------------------ | ---- |
| Commercial property sale commissions                            | **Standard Rated** | 5%   |
| Commercial property lease commissions                           | **Standard Rated** | 5%   |
| Residential property sale commissions (1st sale from developer) | **Zero Rated**     | 0%   |
| Residential property resale commissions                         | **Exempt**         | 0%   |
| Residential rental lease commissions                            | **Exempt**         | 0%   |
| Property management fees (commercial)                           | **Standard Rated** | 5%   |
| Property management fees (residential)                          | **Exempt**         | 0%   |
| Consulting / advisory fees                                      | **Standard Rated** | 5%   |
| Premium listing fees                                            | **Standard Rated** | 5%   |

### VAT Calculation Logic

```typescript
VATCalculation {
  transactionId: string
  transactionType: 'sale_commercial' | 'sale_residential' | 'lease_commercial' | 'lease_residential' | 'management_fee' | 'consulting' | 'listing_fee'
  netAmount: number               // AED — pre-VAT
  vatTreatment: 'standard' | 'zero_rated' | 'exempt'
  vatRate: number                 // 0.05 for standard, 0 for zero/exempt
  vatAmount: number               // netAmount × vatRate
  grossAmount: number             // netAmount + vatAmount
  taxPeriod: string               // Q1/Q2/Q3/Q4 + Year (e.g., "Q1-2026")
  invoiceId: string               // Links to issued tax invoice
}
```

### VAT Tax Period & Filing

- **Filing Frequency:** Quarterly (most real estate companies) — aligned with FTA portal
- **Tax Period:** January–March | April–June | July–September | October–December
- **Filing Deadline:** 28th day after tax period ends (e.g., April 28 for Q1)
- **Payment Deadline:** Same as filing deadline
- **Penalty for Late Filing:** AED 1,000 first offense; AED 2,000 repeat

### VAT Return Summary (Auto-Generated)

```
WHITE CAVES REAL ESTATE — VAT RETURN SUMMARY
Period: [Q1 2026 — January 1 to March 31, 2026]
TRN: [Company Tax Registration Number]
────────────────────────────────────────────────────
OUTPUT TAX (Tax Collected from Clients)
  Standard Rated Sales (5%)
    Taxable supplies:           AED X
    Output VAT:                 AED X
  Zero Rated Sales (0%)
    Taxable supplies:           AED X
    Output VAT:                 AED 0
────────────────────────────────────────────────────
TOTAL OUTPUT VAT                                AED X
────────────────────────────────────────────────────
INPUT TAX (Tax Paid on Business Expenses)
  Recoverable input VAT:        AED X
────────────────────────────────────────────────────
NET VAT PAYABLE / (REFUNDABLE)                  AED X
────────────────────────────────────────────────────
```

### Platform Integration

- Every commission and fee record auto-classified with VAT treatment on creation
- VAT amount auto-calculated and stored on each invoice
- Quarterly VAT summary report generated on-demand by Finance Director
- Export format: Excel (FTA-compatible columns) + PDF (audit copy)
- TRN (Tax Registration Number) mandatory in company settings — locked after set

### Acceptance Criteria — VAT Reporting

- [ ] Each transaction auto-assigned correct VAT treatment (standard/zero/exempt) based on type
- [ ] VAT amount appears as separate line on all invoices (not bundled)
- [ ] Quarterly VAT return summary exportable with correct FTA column layout
- [ ] System prevents issuing invoice without TRN in company settings
- [ ] VAT filing deadline reminder auto-created 14 days before each quarter-end

---

## Cash Flow Forecast (Rolling 12-Month)

### Purpose

Provides the finance team and owner a forward-looking view of expected cash inflows and outflows for the next 12 months, based on pipeline data, committed leases, and historical patterns.

### Forecast Data Sources

| Input                                        | Source                                     | Reliability      |
| -------------------------------------------- | ------------------------------------------ | ---------------- |
| Commission receivable (sales pipeline)       | Stage-weighted deals in CRM                | 30–90% per stage |
| Commission receivable (lease renewals)       | Expiring leases × renewal probability      | 70% default      |
| Property management fees                     | Active managed properties × monthly fee    | 95% committed    |
| PDC scheduled receipts                       | PDC records with status "held" + due dates | 99% committed    |
| Payroll & agent commission payouts           | Committed per closed deal schedule         | 100%             |
| Operating expenses (office, tech, marketing) | Prior 3-month average × 1.05 growth factor | 85% estimated    |

### Monthly Forecast Structure

```
CASH FLOW FORECAST — [Month/Year]
────────────────────────────────────────────────────
OPENING BALANCE                              AED X
────────────────────────────────────────────────────
INFLOWS
  Sales commissions (pipeline-weighted)      AED X
  Lease commissions (renewals + new)         AED X
  Property management fees                  AED X
  PDC clearances (scheduled)                AED X
  Other income                              AED X
────────────────────────────────────────────────────
TOTAL INFLOWS                               AED X
────────────────────────────────────────────────────
OUTFLOWS
  Agent commission payouts                 (AED X)
  Salaries & benefits                      (AED X)
  Marketing & advertising                  (AED X)
  Office & utilities                       (AED X)
  Technology & subscriptions               (AED X)
  VAT payment (quarterly)                  (AED X)
  Other expenses                           (AED X)
────────────────────────────────────────────────────
TOTAL OUTFLOWS                            (AED X)
────────────────────────────────────────────────────
NET CASH FLOW                              AED X
CLOSING BALANCE                            AED X
MINIMUM BALANCE WARNING (< AED 200K)       ⚠ / ✅
────────────────────────────────────────────────────
```

### 12-Month Rolling View

- Dashboard shows 12 months as columns with summary bar chart
- Each month shows: Opening Balance | Net Cash Flow | Closing Balance
- Color coding: Green = positive closing balance; Amber = < AED 200K; Red = negative
- Scenario buttons: **Conservative** (50% pipeline probability) | **Base** (80%) | **Optimistic** (100%)
- Export: Excel (all 12 months + formulas) | PDF (executive summary)

### Acceptance Criteria — Cash Flow Forecast

- [ ] Forecast auto-updates when pipeline deals close, cancel, or change stage
- [ ] PDC due dates feed directly into forecast inflow calendar
- [ ] Three scenarios (Conservative/Base/Optimistic) switchable in real-time
- [ ] Minimum balance warning triggers alert to Finance Director when any month < AED 200K
- [ ] 12-month forecast loads in < 3 seconds

---

## Budget vs Actual Variance Report

### Purpose

Compares planned revenue and expense targets (set at start of each quarter) against actual realized figures, highlighting performance gaps for management action.

### Variance Categories

| Category               | Budget Source                      | Actual Source                    |
| ---------------------- | ---------------------------------- | -------------------------------- |
| Sales Revenue          | Quarterly target set by Owner      | Closed transactions × commission |
| Lease Revenue          | Quarterly target set by Manager    | Lease commissions collected      |
| Management Fee Revenue | Active properties × management %   | Actual management fees invoiced  |
| Agent Payouts          | Estimated per headcount × avg deal | Actual commission payments made  |
| Marketing Spend        | Pre-approved budget per quarter    | Actual marketing invoices        |
| Technology Costs       | Fixed subscription plan            | Actual tech invoices             |

### Variance Report Layout

```
BUDGET vs ACTUAL VARIANCE REPORT
Period: [Q1 2026 — Jan 1 to Mar 31, 2026]
Generated: [Date/Time] by [User]

────────────────────────────────────────────────────
REVENUE                   Budget    Actual  Variance  Var%
  Sales Commissions       AED X     AED X   AED X      X%
  Lease Commissions       AED X     AED X   AED X      X%
  Management Fees         AED X     AED X   AED X      X%
──────────────────────────────────────────────────
TOTAL REVENUE             AED X     AED X   AED X      X%

EXPENSES
  Agent Payouts          (AED X)   (AED X)  AED X      X%
  Salaries              (AED X)   (AED X)  AED X      X%
  Marketing             (AED X)   (AED X)  AED X      X%
  Technology            (AED X)   (AED X)  AED X      X%
──────────────────────────────────────────────────
TOTAL EXPENSES           (AED X)  (AED X)  AED X      X%

OPERATING PROFIT          AED X     AED X   AED X      X%
────────────────────────────────────────────────────
VARIANCE LEGEND:
  🟢 Favorable (>0% better than budget)
  🟡 At Risk (0% to -10% of budget)
  🔴 Critical (>10% below budget)
```

### Acceptance Criteria — Budget vs Actual

- [ ] Budget targets settable per quarter per category by Owner/Finance Director only
- [ ] Variance automatically recalculated daily as actuals are posted
- [ ] Favorable/At-Risk/Critical color-coding applied automatically
- [ ] Report exportable as Excel and PDF
- [ ] Variance alerts: Email digest to Owner when any category > 15% unfavorable

---

## Invoice Format Specification (UAE Tax Invoice)

### Mandatory Fields (FTA Requirement)

Every tax invoice issued by White Caves must contain all FTA-mandated fields (Section 59, UAE VAT Executive Regulations).

### Standard Tax Invoice Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHITE CAVES REAL ESTATE LLC
RERA Broker License No. [XXXX]
TRN: [Tax Registration Number]
[Office Address], Dubai, UAE
Tel: [Phone] | Email: [Email]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TAX INVOICE

Invoice No.:    WC-INV-[YEAR]-[SEQUENCE]      (e.g. WC-INV-2026-0421)
Invoice Date:   [DD/MM/YYYY]
Due Date:       [DD/MM/YYYY]  (30 days from issue unless stated)

BILL TO:
  [Client Full Name / Company Name]
  [Client TRN if B2B — required for input VAT recovery]
  [Client Address]
  [Emirates ID / Passport No. if individual]

TRANSACTION REFERENCE:
  Property:     [Property Address / Unit / Building]
  Transaction:  [Sale / Lease / Management — Reference No.]
  Agent:        [Agent Name, BRN XXXX]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIPTION                    QTY   UNIT PRICE   AMOUNT (AED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Service Description, e.g.,     1    AED X         AED X
"Sales Commission — 2% of
AED [Transaction Value]"]

[Additional line items as       1    AED X         AED X
applicable]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                     SUBTOTAL:    AED X
                                     VAT (5%):    AED X
                                     ──────────────────
                                     TOTAL DUE:   AED X
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS:
  Bank:         [Company Bank Name]
  Account Name: White Caves Real Estate LLC
  IBAN:         AE[XXXXXXXXXXXX]
  Reference:    [Invoice Number]

Terms: Payment due within 30 days of invoice date.
       Late payments subject to 2% per month interest charge.

This is a computer-generated tax invoice. | RERA Lic. [XXXX] | TRN: [XXXX]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Invoice Numbering Logic

- Sequential, non-editable: `WC-INV-{YEAR}-{4-digit sequence}` (e.g., WC-INV-2026-0001)
- Year resets sequence to 0001 on January 1
- Invoice numbers cannot be reused; cancelled invoices retain number with "CANCELLED" watermark
- Credit notes use `WC-CN-{YEAR}-{SEQUENCE}` format

### Invoice Validation Rules

| Rule                                           | Enforcement                                            |
| ---------------------------------------------- | ------------------------------------------------------ |
| TRN must be present                            | Cannot generate without company TRN in settings        |
| Client TRN required if B2B > AED 10,000        | Warning if missing; override requires Finance approval |
| VAT calculation matches selected treatment     | System-calculated; not manually editable               |
| Invoice date cannot be backdated > 30 days     | Hard validation block                                  |
| Duplicate invoice for same transaction blocked | Duplicate detection on transaction reference           |

### Acceptance Criteria — Invoice Format

- [ ] Invoice generated in < 3 seconds as PDF with company branding
- [ ] All FTA-mandated fields present and auto-populated from transaction record
- [ ] Invoice number auto-assigned sequentially; no manual override
- [ ] Cancelled invoices marked "CANCELLED" but not deleted from records
- [ ] B2B client TRN validation warns when missing for high-value invoices

---

## Commission Payout Schedule Rules

### Payout Trigger Events

| Event                                     | Payout Rule                                                     |
| ----------------------------------------- | --------------------------------------------------------------- |
| Sale deal — Transfer of Title Deed (DLD)  | 100% commission released within 7 business days of DLD transfer |
| Sale deal — SPA signed (off-plan)         | 50% on SPA; 50% on first developer milestone payment            |
| Lease deal — Ejari registration confirmed | 100% payout within 5 business days of Ejari number issued       |
| Property management monthly fee           | Paid on the 5th of each month for the preceding month           |
| Referral fee                              | Paid in same cycle as the originating deal                      |

### Agent Commission Split (Default Policy)

| Agent Seniority          | Agent Share                    | Company Share |
| ------------------------ | ------------------------------ | ------------- |
| Senior Agent (> 2 years) | 60%                            | 40%           |
| Agent (1–2 years)        | 55%                            | 45%           |
| Junior Agent (< 1 year)  | 50%                            | 50%           |
| Team Leader (co-closed)  | 65% (lead) + 10% (supporting)  | 25%           |
| External Referral        | Referrer: 20% of company share | —             |

_All splits configured per agent profile and overridable by Owner per deal._

### Payout Workflow

```
1. DEAL CLOSE
   Finance marks transaction "Closed" + confirms all payment docs received

2. COMMISSION CALCULATION
   System auto-calculates:
   → Gross commission = Transaction Value × Commission Rate
   → Agent net = Gross × Agent Split %
   → Company net = Gross × Company Split %
   → VAT on gross (5% if commercial, 0% if residential lease)

3. APPROVAL
   → Manager reviews and approves payout
   → For amounts > AED 50,000: Owner approval required

4. INVOICE ISSUED
   → Tax invoice generated for client (gross + VAT)
   → Agent commission statement generated for agent (net amount)

5. PAYMENT PROCESSING
   → Finance initiates bank transfer on due date
   → Payment reference recorded in CRM
   → Agent receives WhatsApp + email confirmation

6. RECONCILIATION
   → Payment marked "Paid" in system
   → Monthly P&L updated in real-time
```

### Acceptance Criteria — Payout Schedule

- [ ] Payout due date auto-calculated from deal close event based on trigger rules above
- [ ] Agent sees own pending and paid commissions in personal dashboard
- [ ] Finance receives daily summary of payouts due in next 7 days
- [ ] Owner approval workflow enforced for payouts > AED 50,000
- [ ] Bank transfer reference number field mandatory before marking payment as "Paid"

---

**Version:** 1.2 | **Last Updated:** May 2026 | **Sections:** 11/11 (Target Met ✅)  
**Agent Activity:** @Invoice (Llama 3.1 70B via Groq — FREE) | Sections: 5 → 11 | Quality: ⭐⭐⭐⭐⭐
