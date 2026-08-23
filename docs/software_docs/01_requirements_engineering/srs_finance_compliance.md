# Software Requirements Specification (SRS): Finance & Compliance

## 1. Executive Summary

The **Finance & Compliance Module** executes multi-currency accounting, commission ledger locks, UAE Federal Tax Authority (FTA) 5% VAT calculations, accounts receivable aging, and RERA/DLD regulatory audit compliance.

---

## 🎨 Design Tokens & Palette Enforcement

- Primary Red (`#EF4444`): Overdue accounts receivable indicators, clawback risk highlights.
- Pure White (`#FFFFFF`): Invoice generation cards and financial statement surfaces.
- Slate Text (`#1E293B`): Currency headers, transaction table typography.

---

## 🔗 Inter-Linked Navigation References

- [Replacement Manifest](../02_software_design/tech_replacement_rules.md) — Tech replacement rules and 12-domain local mock fallback specifications.

---

## 2. Requirements Specifications

### 2.1 Theodora In-House Accounting & 42-Item Master Expense Engine
- **REQ-FIN-01**: Ingest and classify all agency outlays across the 42-item master catalog (`CAT-01` to `CAT-05`) with designated ledger codes (`5010` to `9060`).
- **REQ-FIN-02**: Enforce dual payment source routing (`CORPORATE_BANK_ACCOUNT_WIO` vs `DIRECTORS_LOAN_ACCOUNT_OWNERS_EQUITY`) with automated equity advance reconciliation.
- **REQ-FIN-03**: Automatic input VAT (5.0%) claim generation and segregation of 0.0% government/licensing fees.
- **REQ-FIN-04**: Corporate Tax 9% net profit relief computation filtering non-deductible assets (e.g. security deposits `EXP-202`).
- **REQ-FIN-05**: Mandatory 6-field receipt digital audit trail (`transaction_id`, `expense_id`, `amount_aed`, `transaction_date`, `payment_source_type`, `receipt_image_url`).

### 2.2 UAE FTA VAT 5% Engine
- **REQ-FIN-06**: Calculate exact 5% UAE VAT on all commercial brokerage commission fees and property management services.
- **REQ-FIN-07**: Format tax invoices with registered Tax Registration Number (TRN), itemized taxable amount, VAT 5%, and net total in AED.
- **REQ-FIN-08**: Aggregate Form 201 Output VAT (Box 1) and Input VAT (Box 9) for quarterly filings.

### 2.3 Multi-Currency Portfolio Precision Engine
- **REQ-FIN-09**: All monetary amounts stored as integer cents or 2-decimal precision to avoid floating-point rounding errors.
- **REQ-FIN-10**: Support dynamic conversion across AED, USD, EUR, and GBP with 4-hour local TTL currency exchange caching.

### 2.4 Commission Ledger Lock & Clawback Management
- **REQ-FIN-11**: Enforce immutable period locks (`lockLedgerPeriod(monthIndex)`) preventing modification of finalized accounting periods.
- **REQ-FIN-12**: Calculate 30-day deal review clawback risks for cancelled transactions or buyer default.

---

## 🔗 Detailed Architectural Specifications
- [Theodora SRS Specification](./srs_theodora_finance_accounting.md)
- [Theodora SDD Architecture Blueprint](../02_software_design/sdd_theodora_finance_accounting.md)
- [In-House Finance Roadmap](../../plans/IN_HOUSE_FINANCE_ACCOUNTING_ROADMAP.md)
- [42-Item Master Expense Catalog JSON](../../data/expenses-master-schema.json)

