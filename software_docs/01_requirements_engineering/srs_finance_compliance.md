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

### 2.1 UAE FTA VAT 5% Engine
- **REQ-FIN-01**: Calculate exact 5% UAE VAT on all commercial brokerage commission fees and property management services.
- **REQ-FIN-02**: Format tax invoices with registered Tax Registration Number (TRN), itemized taxable amount, VAT 5%, and net total in AED.

### 2.2 Multi-Currency Portfolio Precision Engine
- **REQ-FIN-03**: All monetary amounts stored as integer cents to avoid floating-point rounding errors.
- **REQ-FIN-04**: Support dynamic conversion across AED, USD, EUR, and GBP with 4-hour local TTL currency exchange caching.

### 2.3 Commission Ledger Lock & Clawback Management
- **REQ-FIN-05**: Enforce immutable period locks (`lockLedgerPeriod(monthIndex)`) preventing modification of finalized accounting periods.
- **REQ-FIN-06**: Calculate 30-day deal review clawback risks for cancelled transactions or buyer default.
