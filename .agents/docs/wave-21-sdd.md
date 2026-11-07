# Wave 21 — System Design Document (SDD)

**Wave:** 21  
**Focus:** Finance, UAE VAT, Commission Engine & Compliance Reporting  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Invoice + @Mira + @Barbara + @Sofia + @Katherine  
**CONSUMESâ†:** `business_docs/09_crm_features/financial-reporting.md`, `business_docs/05_requirements/compliance-requirements.md`, `business_docs/07_business_model/revenue-model.md`  
**FEEDSâ†':** Wave 22 analytics (financial KPIs → executive dashboard), Wave 20 PDC ledger

---

## Objective

Build the complete financial infrastructure for White Caves: UAE VAT reporting (FTA 5%), automated commission engine with approval workflows, rolling cash-flow forecasting, P&L statements, invoice generation with TRN, payout schedules, and all FTA-compliant financial reports exportable to PDF and Excel. This wave makes finance fully operational without external accounting tools for routine reporting.

---

## Scope

### 1. UAE VAT Engine (FTA Compliant)

- 5% VAT on residential sales commissions (buyer representation fee)
- VAT-exempt transactions: direct residential rent (long-term)
- Commercial lease commissions: 5% VAT
- Quarterly VAT return preparation (FTA portal-ready format)
- Tax Invoice generation with TRN (Tax Registration Number)
- Input VAT tracking (rechargeable expenses)

### 2. Commission Engine

- Commission rate matrix by transaction type (sale, rental, referral)
- Automatic commission calculation on deal closure
- Multi-party splits (agent, team lead, company, referrer)
- Commission approval workflow (P0: agent → manager → finance)
- Commission statement PDF per agent per period
- Clawback rules (deal falls through within 30 days)

### 3. Invoice Generation

- Tax Invoice template (FTA-compliant): company TRN, client details, service description, net amount, VAT 5%, total AED
- Pro Forma Invoice for pre-payment scenarios
- Credit Note for refunds and corrections
- Auto-numbering: `INV-YYYY-MMDD-####`
- Invoice → payment tracking → receipt

### 4. Cash Flow & P&L

- Rolling 12-month cash flow forecast (actuals YTD + projected)
- Monthly P&L: revenue by stream (sales/rental/management fee), direct costs, gross profit, overheads, net profit
- Budget vs Actual variance report
- Accounts receivable aging (30/60/90/120+ days)
- Pending commission liability tracker

### 5. Financial Reporting

- Executive P&L dashboard (role-gated: Owner/MD only)
- Monthly close-of-books workflow (lock period, late entry warning)
- Transaction audit trail (immutable ledger entries)
- Annual financial summary (FY UAE: Jan–Dec)
- Multi-currency display (AED primary, USD/GBP/EUR secondary)

---

## Requirement IDs (Wave 21)

| ID | Requirement |
|---|---|
| `REQ-FIN-001` | VAT rate of 5% applied to all taxable commission transactions |
| `REQ-FIN-002` | VAT-exempt transactions (long-term residential rent) are flagged and excluded from VAT return |
| `REQ-FIN-003` | Quarterly VAT return is generated as FTA-formatted report |
| `REQ-FIN-004` | Tax Invoice includes company TRN, client TRN (if applicable), itemized amounts, VAT amount, total AED |
| `REQ-FIN-005` | Invoice auto-numbering follows `INV-YYYY-MMDD-####` format, globally unique |
| `REQ-FIN-006` | Commission is auto-calculated on deal closure using rate matrix |
| `REQ-FIN-007` | Multi-party commission splits sum to 100% of gross commission |
| `REQ-FIN-008` | Commission approval workflow: agent → manager → finance before payment |
| `REQ-FIN-009` | Commission clawback rules applied if deal cancelled within 30 days of payment |
| `REQ-FIN-010` | Rolling 12-month cash flow forecast updates on each transaction |
| `REQ-FIN-011` | Monthly P&L report is generated and locked after monthly close |
| `REQ-FIN-012` | Accounts receivable aging report shows 30/60/90/120+ day buckets |
| `REQ-FIN-013` | Budget vs Actual variance calculated per revenue stream and cost category |
| `REQ-FIN-014` | All financial records are immutable once locked (append-only ledger) |
| `REQ-FIN-015` | Multi-currency conversion uses cached daily rates (ExchangeRate-API) |

---

## Data Schema

### Commission Model (Prisma)

```prisma
model Commission {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  dealId          String   @db.ObjectId
  dealType        DealType
  grossAmount     Float
  currency        String   @default("AED")
  vatRate         Float    @default(0.05)
  vatAmount       Float
  netAmount       Float
  status          CommissionStatus @default(PENDING_APPROVAL)
  splits          CommissionSplit[]
  approvedBy      String?  @db.ObjectId
  approvedAt      DateTime?
  paidAt          DateTime?
  clawbackDate    DateTime?
  clawbackReason  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CommissionSplit {
  id           String @id @default(auto()) @map("_id") @db.ObjectId
  commissionId String @db.ObjectId
  recipientId  String @db.ObjectId
  recipientType String // agent | team_lead | company | referrer
  percentage   Float
  amount       Float
  paidAt       DateTime?
}

model Invoice {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  number      String   @unique // INV-2026-0617-0001
  type        InvoiceType @default(TAX_INVOICE)
  clientId    String   @db.ObjectId
  dealId      String?  @db.ObjectId
  lineItems   InvoiceLineItem[]
  subtotal    Float
  vatRate     Float    @default(0.05)
  vatAmount   Float
  total       Float
  currency    String   @default("AED")
  status      InvoiceStatus @default(DRAFT)
  dueDate     DateTime?
  paidAt      DateTime?
  pdfUrl      String?
  createdAt   DateTime @default(now())
}

enum CommissionStatus { PENDING_APPROVAL APPROVED PAID CLAWBACK_PENDING CLAWED_BACK }
enum InvoiceType { TAX_INVOICE PRO_FORMA CREDIT_NOTE }
enum InvoiceStatus { DRAFT SENT PAID OVERDUE CANCELLED }
enum DealType { SALE RENTAL REFERRAL MANAGEMENT_FEE }
```

---

## API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/commissions` | Create commission on deal closure |
| `PATCH` | `/api/v1/commissions/:id/approve` | Manager/finance approve commission |
| `POST` | `/api/v1/commissions/:id/pay` | Mark commission as paid |
| `GET` | `/api/v1/commissions/statement/:agentId` | Agent commission statement |
| `POST` | `/api/v1/invoices` | Generate invoice |
| `GET` | `/api/v1/invoices/:id/pdf` | Download invoice PDF |
| `POST` | `/api/v1/invoices/:id/credit-note` | Issue credit note |
| `GET` | `/api/v1/finance/vat-return` | Generate quarterly VAT return |
| `GET` | `/api/v1/finance/cash-flow` | Rolling 12-month cash flow |
| `GET` | `/api/v1/finance/pl` | Monthly P&L report |
| `GET` | `/api/v1/finance/ar-aging` | Accounts receivable aging |
| `POST` | `/api/v1/finance/close-month` | Lock current month |

---

## Architecture Constraints

1. Ledger entries are immutable — no `updateOne` or `deleteOne` on financial records once locked.
2. VAT calculations must always use server-side rates, never client-supplied rates.
3. Commission splits must validate sum === 100% before saving.
4. Multi-currency display only — all calculations in AED.
5. Monthly close lock prevents new entries for closed periods.
6. PDF generation via Puppeteer (reuse Wave 20 document engine).

---

## UAE VAT Reference (FTA)

| Transaction | VAT Status | Rate |
|---|---|---|
| Residential sales commission | Taxable | 5% |
| Commercial sales commission | Taxable | 5% |
| Long-term residential rent commission | Exempt | 0% |
| Short-term / holiday home rent | Taxable | 5% |
| Property management fee | Taxable | 5% |
| DLD transfer fee (client-borne) | Zero-rated | 0% |

---

## Test Coverage Requirements

- Unit: VAT calculation for all transaction types, commission split sum validation, invoice auto-numbering
- Integration: Deal close → commission auto-calc → approval → payment; Invoice generate → PDF
- E2E: Finance officer quarterly VAT return; Agent commission statement download

---

## Exit Criteria

1. All REQ-FIN-001 through REQ-FIN-015 implemented and tested
2. UAE VAT return PDF matches FTA format requirements
3. Commission approval workflow end-to-end verified
4. Rolling cash flow and P&L renders for Owner/MD role
5. Monthly close lock prevents edits to locked periods
6. `npm run plans:validate` green
7. Trackers updated
