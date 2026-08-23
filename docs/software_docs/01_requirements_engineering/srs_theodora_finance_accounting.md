# Software Requirements Specification (SRS): Theodora In-House Accounting & Finance Engine

**AI Assistant Lead:** **Theodora** — Finance & Accounts Director / CFO Intelligence  
**Agentic Mesh Specialist:** `@Invoice` / `@Theodora`  
**System Scope:** 100% In-House PropTech CRM Accounting, VAT 5% Ledger, Corporate Tax Relief, and 42-Expense Master Engine  
**Document Version:** 2026.08.24-v1.0  
**Status:** Approved & Active

---

## 1. Executive Overview & Persona Alignment

**Theodora** is the designated AI Assistant and CFO Intelligence for White Caves Real Estate LLC. She governs all financial, expense, tax, and ledger workflows across the agency. This SRS specifies the full in-house replacement of third-party accounting dependencies by building a native Dubai Real Estate accounting suite.

---

## 2. Numbered Requirements Specification (REQ-THEODORA-FIN)

### 2.1 Master 42-Item Expense Catalog & Classification
1. **REQ-FIN-101 (Catalog Management):** The system shall maintain an indexed catalog of 42 distinct real estate business expenses partitioned across 5 categories (`CAT-01` to `CAT-05`).
2. **REQ-FIN-102 (Unique Alphanumeric Keys):** Every catalog item must possess an immutable `expense_id` (e.g., `EXP-101` through `EXP-506`) and standard 4-digit `accounting_ledger_code` (`5010` to `9060`).
3. **REQ-FIN-103 (Portal & Marketing Outlays):** Classify portal fees (Property Finder, Bayut, Skyloov) under `CAT-01` with 5.0% input VAT and CT-deductible status.
4. **REQ-FIN-104 (Social Media Ad Tax):** Explicitly map Meta & Google paid campaigns (`EXP-104`) to 0.0% VAT (Reverse Charge Mechanism) and 100% CT-deductible.
5. **REQ-FIN-105 (Commercial Overheads):** Enforce Ejari registration (`EXP-203`), DEWA utilities (`EXP-204`), and telecommunications (`EXP-205`) under `CAT-02`.
6. **REQ-FIN-106 (Deposit Capitalization):** Office Security Deposits (`EXP-202`) must be flagged with `fta_ct_deductible: false` and mapped to Balance Sheet Asset Account `1210` rather than P&L expenses.
7. **REQ-FIN-107 (Regulatory & Licensing Fees):** Government fees (DET license `EXP-301`, RERA registration `EXP-302`, Trakheesi permits `EXP-304`) shall be recorded at 0.0% VAT and 100% CT-deductible.
8. **REQ-FIN-108 (Transportation & Logistics):** Fuel runs (`EXP-401`), Salik tolls (`EXP-402`), and RTA parking (`EXP-403`) must be tracked with viewing/deal allocation capability.
9. **REQ-FIN-109 (SaaS & Engineering):** Antigravity PropTech engineering (`EXP-504`) and SaaS subscriptions (`EXP-501`) shall be tracked under `CAT-05`.

### 2.2 Payment Source & Director's Loan Equity Tracking
10. **REQ-FIN-201 (Dual Payment Gateway):** The system shall enforce a mandatory `payment_source_type` selection: `CORPORATE_BANK_ACCOUNT_WIO` or `DIRECTORS_LOAN_ACCOUNT_OWNERS_EQUITY`.
11. **REQ-FIN-202 (Personal Card Advance Tracking):** If `DIRECTORS_LOAN_ACCOUNT_OWNERS_EQUITY` is selected, the system must automatically create a linked entry in `DirectorsLoanLedger` to record director out-of-pocket advances.
12. **REQ-FIN-203 (Outstanding Advance Balance):** Theodora shall calculate real-time cumulative outstanding director advances available for tax-free corporate reimbursement.
13. **REQ-FIN-204 (Settlement & Reimbursement):** Provide single-click reconciliation matching Wio bank reimbursement payouts against specific director advance transactions.

### 2.3 UAE FTA 5% VAT In-House Ledger
14. **REQ-FIN-301 (Input VAT Auto-Computation):** For all standard-rated business outlays (5.0%), automatically compute:
    $$\text{Input VAT Claimable} = \text{Gross Amount} - \left(\frac{\text{Gross Amount}}{1.05}\right)$$
15. **REQ-FIN-302 (Exempt / Zero-Rated Segregation):** Government charges (0.0% VAT) must be segregated without generating VAT claim liabilities.
16. **REQ-FIN-303 (FTA Form 201 Output/Input VAT Return):** Theodora shall generate real-time quarterly VAT Return summaries aggregating:
    - **Box 1 (Standard Rated Sales):** Output VAT collected on commissions and invoices.
    - **Box 9 (Standard Rated Expenses):** Input VAT claimable on qualifying business purchases.
    - **Net VAT Due/Refundable:** $\text{Output VAT} - \text{Input VAT}$.

### 2.4 UAE Corporate Tax (CT) Net Profit & Relief Engine
17. **REQ-FIN-401 (CT Deductibility Filter):** Filter expenses by `fta_ct_deductible === true` when computing taxable operating net profit.
18. **REQ-FIN-402 (AED 375,000 Small Business Relief Threshold):** Real-time tracking of taxable profit against the UAE Federal Corporate Tax AED 375,000 statutory limit:
    - Net Taxable Profit $\le$ AED 375,000 $\rightarrow$ 0% Corporate Tax Rate.
    - Net Taxable Profit $>$ AED 375,000 $\rightarrow$ 9% Corporate Tax on excess.

### 2.5 Mandatory Digital Receipt Audit Trail & File Upload
19. **REQ-FIN-501 (6 Mandatory Audit Fields):** Every expense transaction must validate presence of: `transaction_id`, `expense_id`, `amount_aed`, `transaction_date`, `payment_source_type`, and `receipt_image_url`.
20. **REQ-FIN-502 (OCR / TRN Verification):** Storage and extraction of 15-digit UAE Tax Registration Numbers (TRN) from uploaded vendor receipts.
21. **REQ-FIN-503 (Immutable Audit Logging):** All status mutations (`PENDING` $\rightarrow$ `APPROVED` $\rightarrow$ `AUDITED`) must record user ID, timestamp, and audit notes.
