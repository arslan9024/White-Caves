# 14 — Theodora · Finance Director

> **ID:** `theodora`  
> **Department:** Finance  
> **Title:** Finance Director  
> **Color:** `#F59E0B` (Amber)  
> **Avatar:** 👩‍💼  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/TheodoraFinanceCRM_NEW/`  
> **Access:** Managing Director, Finance Manager

---

## 1. Overview

Theodora is White Caves' **financial command centre**. She oversees invoicing, commission management, payment tracking, escrow monitoring, financial reporting, and budget analysis. Every deal that closes flows through Theodora for commission calculation and payout. Every rent collection Daisy tracks feeds into Theodora's income ledger. She produces the monthly P&L and provides the Managing Director with financial health indicators.

---

## 2. Core Responsibilities

1. Commission management: calculate, approve, and record commission payouts for all agents
2. Invoice generation: create professional invoices for commissions, management fees, and services
3. Payment tracking: incoming (rent, sales proceeds) and outgoing (commissions, vendor payments)
4. Escrow monitoring: track deposits held in escrow accounts
5. Financial reporting: monthly P&L, cash flow, accounts receivable/payable
6. Budget management: set and track departmental budgets

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Commission calculator | Auto-calc: Sales 2%, Rental 5%, Referral configurable % of deal value |
| Commission approval | Workflow: Calculated → Pending Approval → Approved → Paid |
| Invoice builder | Generate commission invoice PDF (via Quill) with agency letterhead |
| Payment ledger | Record and categorise all inflows and outflows |
| Escrow tracker | Per-property escrow: deposit held, DLD fees paid, release conditions |
| Monthly P&L | Revenue vs expenses by category; export to PDF |
| Cash flow statement | Monthly cash position; 3-month rolling forecast |
| Accounts receivable | Outstanding invoices + days overdue per client |
| VAT tracking | 5% UAE VAT on management fees; quarterly VAT return export |
| Budget vs actual | Department spend vs monthly budget; variance alerts |

---

## 4. How It Works — End to End

### Step 1 — Deal Closure Trigger
Sophia marks deal as `completed` → backend fires `CommissionService.calculate(deal)`:
```
commissionAmount = deal.value × (deal.type === 'sale' ? 0.02 : 0.05)
agentShare = commissionAmount × (1 - agencyRetainRate)
```
Commission record created: `{ agentId, dealId, amount, agencyRetain, status: 'calculated' }`.

### Step 2 — Commission Review
Theodora's dashboard shows new commission pending approval. Finance manager reviews: verifies deal value, split %, special arrangements → `PATCH /api/commissions/:id { status: 'approved' }`.

### Step 3 — Invoice Generation
Approval → `POST /api/commissions/:id/invoice` → Quill generates PDF with: agency letterhead, agent details, deal summary, net amount, bank details → stored as `Document` in Prisma → agent receives via WhatsApp/email.

### Step 4 — Payment Recording
Finance records payout → `PATCH /api/commissions/:id { status: 'paid', paidDate, paymentRef }`. Agent's commission history updated.

### Step 5 — Rent Income
Daisy records rent payment → `POST /api/finance/income { source: 'rent', amount, leaseId, date }`. Theodora's income ledger updated. Monthly totals auto-aggregated.

### Step 6 — Monthly P&L
First of each month: `FinanceService.generateMonthlyPL(month, year)` → aggregates income (commissions, rent, management fees) and expenses (vendor payments, staff costs, marketing spend) → P&L record created → PDF generated → sent to MD via Zoe's briefing.

### Step 7 — VAT Export
End of quarter: `GET /api/finance/vat-export?quarter=Q1` → CSV with all VATable transactions → import into UAE FTA portal.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/commissions` | List commissions |
| POST | `/api/commissions` | Create commission record |
| PATCH | `/api/commissions/:id` | Update status (approve/pay) |
| POST | `/api/commissions/:id/invoice` | Generate commission invoice |
| GET | `/api/finance/summary` | P&L summary for dashboard |
| GET | `/api/finance/cash-flow` | Cash flow statement |
| POST | `/api/finance/income` | Record income |
| POST | `/api/finance/expense` | Record expense |
| GET | `/api/finance/vat-export` | VAT return CSV export |
| GET | `/api/finance/budget` | Budget vs actual per department |

---

## 6. Data Flows

- **Receives from:** Sophia (deal completions → commission triggers), Daisy (rent income), Vesta (off-plan payment triggers), Nancy (payroll data)
- **Sends to:** Quill (invoice PDF generation), Zoe (financial KPIs), Agents (commission payslips via Nadia)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `TheodoraFinanceCRM_NEW` | `src/components/owner/ai/TheodoraFinanceCRM_NEW/` | ✅ Exists |
| Commission tracker | Inside `TheodoraFinanceCRM_NEW` | ✅ Exists (mock) |
| P&L charts | Inside `TheodoraFinanceCRM_NEW` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Finance routes | `server/routes/finance.ts` | ✅ Exists (partial) |
| CommissionService | `server/services/CommissionService.ts` | 🔲 Planned |
| FinanceService | `server/services/FinanceService.ts` | 🔲 Planned |
| Commission CRUD | In finance routes | 🔲 Planned (extend) |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full financial access |
| `finance_manager` | Full financial access |
| `agent` | Own commissions only |
| All others | ❌ |

---

## 10. Implementation Checklist

- [x] `TheodoraFinanceCRM_NEW` renders (mock data)
- [x] Finance routes backend (`server/routes/finance.ts`)
- [ ] Wire frontend to live `/api/finance`
- [ ] Commission calculation service
- [ ] Commission approval workflow
- [ ] Invoice PDF generation (Quill dependency)
- [ ] Monthly P&L generation
- [ ] VAT export endpoint
- [ ] Budget vs actual tracking
- [ ] Tests: `server/routes/finance.test.ts` (exists, extend)

---

## 11. Dependencies

- Sophia (deal completion triggers)
- Daisy (rent payment income)
- Quill (invoice and report PDF generation)
- `exceljs` (Phase 7) — Excel financial exports

---

## 12. Future Enhancements

- AI-powered expense anomaly detection
- Integration with UAE bank APIs for automated payment reconciliation
- FTA portal direct submission for VAT returns
- Real-time cash flow forecasting with ML
