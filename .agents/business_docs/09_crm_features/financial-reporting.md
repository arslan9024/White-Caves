# UAE FTA VAT Filing Workflow & Quarterly Reconciliation

> **Tracking:** `DU006` | **Agent:** `@Invoice` (Director of FinTech & Statutory Tax Systems) | **Status:** `ACTIVE SPECIFICATION`  
> **Statutory Baseline:** UAE Federal Decree-Law No. (8) of 2017 on Value Added Tax & FTA Decision No. (3) of 2024  
> **CONSUMES:** `server/routes/aegis.ts`, `src/store/slices/crm/invoicesExpensesThunks.ts`  
> **FEEDS:** `business_docs/09_crm_features/financial-reporting.md`  
> **FEEDS_ACK:** `AEGIS-V5-FINANCE-VAT-FTA-ACK`

---

## 1. Tax Categories for Dubai Real Estate Transactions
Under UAE Federal Tax Authority (FTA) laws:
- **Commercial Property Sales & Leases**: Standard Rated (**5% VAT**).
- **Residential Property Leases**: Exempt from VAT (**0% / Exempt**).
- **First-Time Supply of New Residential Property (within 3 years of completion)**: Zero-Rated (**0%**).
- **Brokerage & Agency Commission Fees**: Standard Rated (**5% VAT** on all commission earnings).

---

## 2. Quarterly Filing & Reconciliation Architecture (AEG-028 & AEG-029)

```
[ Deal Transaction Completed ]
              │
              ├─> Record Gross Commission in AED
              ├─> Split Statutory 5% Output VAT to FTA Reserve Ledger
              └─> Record Input VAT on deductible operational expenses
                            │
                            ▼
[ Quarterly Tax Audit & Pre-Filing Ledger ]
   - Quarter Periods: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
   - Filing Deadline: 28th of the month following the tax period
                            │
                            ▼
[ Automated EmaraTax Export Format ]
   - Box 1a: Standard Rated Supplies (Emirate-level breakdown: Dubai)
   - Box 1b: Tax on Standard Rated Supplies (5%)
   - Box 8: Zero-Rated Supplies
   - Box 9: Exempt Supplies
   - Box 10: Standard Rated Expenses (Recoverable Input VAT)
   - Net VAT Payable / Reclaimable Calculation
```

---

## 3. Financial Controls & Dual Authorization
- All quarterly VAT filings require approval from the **Chief Financial Officer (`@Theodora`)** and final review from the **Managing Director / Founder**.
- Retain immutable tax invoice records and sequential receipts (`AEG-030`) for a minimum of 7 years in line with FTA audit mandates.

---

## 4. Acceptance Criteria
1. **Tax Segregation**: Brokerage commission invoices must isolate the 5% VAT into dedicated tax liability accounts.
2. **EmaraTax Export**: Pre-formatted XML/JSON export compatible with FTA EmaraTax portal schema.
3. **Audit Trail**: Every modification to an invoice after receipt issuance requires an authorized credit note.
