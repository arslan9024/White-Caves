# Department: Finance

> **Department ID:** `finance`
> **Color:** #F59E0B (Amber)
> **Reporting To:** Managing Director
> **Status:** ✅ Active

---

## Mission

Ensure the financial integrity of White Caves Real Estate LLC by accurately tracking all revenue, commissions, expenses, and payments. The Finance department provides the Managing Director with real-time financial visibility and enables data-driven business decisions.

---

## Team Structure

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| Finance Director | 1 | Financial strategy, reporting, regulatory filings |
| Accounts Manager | 1 | Invoicing, payments, reconciliation |
| Commission Analyst | 1 | Commission calculations, dispute resolution |

---

## Key Responsibilities

1. **Invoice & Payment Management** — Generate, send, and track all invoices for sales, leasing, and services via Theodora.
2. **Commission Calculation** — Accurately calculate agent commissions for every closed deal, including split commissions.
3. **Commission Disbursement** — Process and record commission payments to agents and external brokers.
4. **Revenue Reporting** — Produce daily, weekly, monthly, and quarterly financial reports.
5. **Escrow Account Management** — Manage DLD escrow accounts for off-plan transactions.
6. **Budget Management** — Prepare annual budgets; track actuals vs budget monthly.
7. **Rent Payment Tracking** — Record all rent payments, flag overdue accounts, and issue payment reminders.
8. **Expense Management** — Process and approve operational expenses; maintain cost controls.
9. **Tax Compliance** — Ensure VAT compliance (5% UAE VAT); prepare VAT returns.
10. **Payment Reconciliation** — Reconcile bank statements against CRM records daily.
11. **Investment Analysis** — Model investment returns for buyers and landlords via Maven.
12. **Mortgage Advisory** — Provide mortgage calculations and bank referral guidance via Sage.

---

## AI Assistants

| Assistant | Role | Status |
|-----------|------|--------|
| **Theodora** | Finance Director | ✅ In Code |
| **Maven** | Investment Strategy & Portfolio Optimizer | 🔲 Planned (Phase 5) |
| **Sage** | Mortgage & Financing Advisor | 🔲 Planned (Phase 5) |

### End-to-End Finance Flow

```
Deal Closed (Sales)
  ↓
Theodora creates invoice:
  - Buyer payment schedule
  - DLD fee (4%)
  - Agency commission (typically 2%)
  - NOC fees (if applicable)
  ↓
Invoice sent to buyer (email/WhatsApp)
  ↓
Payment received → Theodora logs transaction
  ↓
Commission calculated:
  - Lead agent %
  - Referral agent % (if applicable)
  - Company retention %
  ↓
Theodora generates commission statement
  ↓
Managing Director approves → Payment processed
  ↓
Records updated in finance dashboard
  ↓
Monthly: Theodora generates P&L report for Zoe/Executive

Rent Payment Flow:
  Daisy (Ops) logs rent due date
  ↓
Theodora issues rent invoice to tenant
  ↓
Payment received → Theodora logs
  ↓
Landlord portion disbursed (minus management fee)
  ↓
Monthly reconciliation report
```

---

## Core Tools & Systems

| Tool | Purpose |
|------|---------|
| Theodora Finance Panel | Invoice management, P&L, reports |
| Maven Investment Module | ROI calculator, portfolio analysis |
| Sage Mortgage Calculator | Mortgage eligibility, bank referrals |
| Payment Gateway (Stripe) | Online payment processing |
| Bank Reconciliation Tool | Daily statement matching |
| VAT Filing Module | UAE VAT returns |

---

## API Ownership & Integration Points

| Endpoint | Purpose |
|----------|---------|
| `GET /api/finance` | Finance overview |
| `POST /api/finance/invoices` | Create invoice |
| `GET /api/finance/invoices` | List all invoices |
| `POST /api/payments` | Record payment |
| `GET /api/commissions` | Commission calculations |
| `POST /api/commissions/approve` | Approve commission disbursement |
| `GET /api/finance/reports` | Financial reports |
| `POST /api/finance/mortgage-calc` | Mortgage calculation (Sage) |
| `GET /api/finance/portfolio` | Investment portfolio (Maven) |

---

## KPIs & Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Invoice Accuracy Rate | 100% | Monthly audit |
| Commission Dispute Rate | <2% | Support tickets |
| Payment Collection Time | <7 days | Average days to payment |
| Financial Report Timeliness | By 5th of each month | Report timestamps |
| Rent Arrears Rate | <5% of portfolio | Monthly review |
| VAT Filing Accuracy | 100% | Tax authority compliance |
| Budget Variance | <10% | Quarterly review |

---

## Inter-Department Data Flows

| Department | Direction | Data |
|-----------|-----------|------|
| Sales | Inbound | Closed deal values, commission splits |
| Operations | Inbound | Rent schedules, maintenance costs |
| Compliance | Outbound | Financial compliance records |
| Legal | Outbound | Contract financial terms |
| Executive | Outbound | P&L, budget reports, financial KPIs |
| Intelligence | Outbound | Revenue data for market analytics |
| Customer Experience | Inbound | VIP client payment preferences |

---

## Implementation Status

- [x] Theodora finance panel in code registry
- [x] Basic invoice management UI
- [x] Commission tracking UI (basic)
- [ ] Stripe payment gateway — backend returns 503 (stub only)
- [ ] Maven investment analysis (Phase 5)
- [ ] Sage mortgage calculator (Phase 5)
- [ ] Rent payment Prisma models (Phase 5)
- [ ] Automated VAT reporting (Phase 6)
- [ ] PDF financial reports via Quill (Phase 3)

---

## Future Roadmap

| Enhancement | Phase | Priority |
|-------------|-------|----------|
| Stripe payment gateway live integration | Phase 3 | Critical |
| Maven investment ROI module | Phase 5 | High |
| Sage mortgage calculator live | Phase 5 | High |
| PDF report generation via Quill | Phase 3 | High |
| Automated commission disbursement | Phase 5 | High |
| DLD escrow account integration | Phase 6 | Medium |
| VAT auto-filing | Phase 6 | Medium |
| Arabic financial reports via Mira | Phase 8 | Low |
