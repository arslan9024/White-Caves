# Software Requirements Specification (SRS): Theodora In-House Accounting & Finance Engine

**AI Assistant Lead:** **Theodora** — Finance & Accounts Director / CFO Intelligence  
**Agentic Mesh Specialist:** `@Invoice` / `@Theodora`  
**System Scope:** 100% In-House PropTech CRM Accounting, VAT 5% Ledger, Corporate Tax Relief, 42-Expense Master Engine & 67 Enterprise Reports  
**Document Version:** 2026.08.25-v2.0  
**Status:** Approved & Active

---

## 1. Executive Overview & Persona Alignment

**Theodora** is the designated AI Assistant and CFO Intelligence for White Caves Real Estate LLC. She governs all financial, expense, tax, ledger, and reporting workflows across the agency. This SRS specifies the full in-house replacement of third-party accounting dependencies (such as Zoho Books) by building an autonomous Dubai Real Estate accounting & reporting suite featuring **67 enterprise reports** across **14 business domains**.

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

---

## 3. Master 67 Enterprise Reports Specification (REQ-THEODORA-REP)

Theodora AI maintains an indexed repository of **67 enterprise reports** partitioned across **14 standard categories**:

### 3.1 Business Overview (5 Reports)
- **REQ-REP-01 (3.14.R01 - Profit and Loss):** Generate multi-period statement of brokerage revenues (Account 4000s) minus operating expenses (Account 5000s) to determine Gross & Net Margin.
- **REQ-REP-02 (3.14.R02 - Cash Flow Statement):** Real-time cash movement categorized by Operating, Investing, and Financing flows linked to Wio Business accounts.
- **REQ-REP-03 (3.14.R03 - Balance Sheet):** Statement of financial position enforcing $\text{Assets} = \text{Liabilities} + \text{Equity}$ formatted for UAE bank audit & RERA regulatory compliance.
- **REQ-REP-04 (3.14.R04 - Business Performance Ratios):** Real-time telemetry computing Current Ratio, Quick Ratio, Net Profit Margin, DSO, and Return on Equity (ROE).
- **REQ-REP-05 (3.14.R05 - Movement of Equity):** Full reconciliation of share capital, director advance injections/drawings, and retained earnings.

### 3.2 Sales & Brokerage (6 Reports)
- **REQ-REP-06 (3.14.R06 - Sales by Customer):** Aggregate deal volume, gross commission, and VAT 5% billed per developer / investor.
- **REQ-REP-07 (3.14.R07 - Sales by Item):** Categorize closed deal revenues by property asset type (Luxury Villas, Penthouses, 1BR/2BR Off-Plan, Commercial).
- **REQ-REP-08 (3.14.R08 - Sales by Salesperson):** Broker league table calculating deals closed, gross commission, and agent split percentages.
- **REQ-REP-09 (3.14.R09 - Sales Summary):** Executive month-on-month summary of gross transaction value (GTV), agency revenue, and YoY growth.
- **REQ-REP-10 (3.14.R10 - Profit by Item):** Listing-level profitability deducting direct portal ad spend and agent commissions from gross revenue.
- **REQ-REP-11 (3.14.R11 - Sales Channel Integrations Sync Summary):** Ingestion telemetry and sync health across Property Finder, Bayut, and Dubizzle APIs.

### 3.3 Inventory Valuation (5 Reports)
- **REQ-REP-12 (3.14.R12 - Inventory Valuation Summary):** Total valuation of exclusive developer allocations and secondary property portfolios.
- **REQ-REP-13 (3.14.R13 - FIFO Cost Lot Tracking):** First-In First-Out lot cost tracking for agency proprietary property investments.
- **REQ-REP-14 (3.14.R14 - ABC Classification):** Pareto 80/20 stratification of listings by turnover velocity and commission contribution.
- **REQ-REP-15 (3.14.R15 - Inventory Turnover by Amount):** Rate of listing conversion to closed sales within a rolling 90-day window.
- **REQ-REP-16 (3.14.R16 - Weighted Average Cost Summary):** Moving average cost calculations for bulk developer floor acquisitions and investor syndicates.

### 3.4 Receivables & Invoicing (AR) (9 Reports)
- **REQ-REP-17 (3.14.R17 - AR Aging Summary):** Distribution of pending invoices across 1-30, 31-60, 61-90, and 90+ day overdue buckets.
- **REQ-REP-18 (3.14.R18 - AR Aging Details):** Itemized ledger of individual overdue invoices with project and developer references.
- **REQ-REP-19 (3.14.R19 - Invoice Details):** Full tax invoice register with 15-digit TRN, subtotal, VAT 5%, and payment clearance status.
- **REQ-REP-20 (3.14.R20 - Delivery Challan Details):** Physical key handover, access card transfer, and Ejari certificate delivery confirmations.
- **REQ-REP-21 (3.14.R21 - Quote Details):** Commercial fee proposals, property management retainers, and client acceptance status.
- **REQ-REP-22 (3.14.R22 - Quote Item Details):** Line-item breakdown of value-added services (Matterport 3D tours, staging, AML screening).
- **REQ-REP-23 (3.14.R23 - Customer Balance Summary):** Cumulative balance sheet position for registered clients and unapplied credits.
- **REQ-REP-24 (3.14.R24 - Receivable Summary):** Executive collection rate tracking and monthly cash inflow targets.
- **REQ-REP-25 (3.14.R25 - Receivable Details):** Open receivables with assigned finance officer and communication follow-up notes.

### 3.5 Payments Received & Collections (5 Reports)
- **REQ-REP-26 (3.14.R26 - Payments Received):** Feed of settled client payments, developer bank wires, and Wio bank credits.
- **REQ-REP-27 (3.14.R27 - Time to Get Paid):** Days Sales Outstanding (DSO) by developer and transaction type.
- **REQ-REP-28 (3.14.R28 - Credit Note Details):** Formal tax credit note register with reverse VAT 5% adjustments and audit justification.
- **REQ-REP-29 (3.14.R29 - Refund History):** RERA escrow security deposit refunds, maintenance deductions, and move-out settlements.
- **REQ-REP-30 (3.14.R30 - Recurring Invoice Details):** Active monthly recurring revenue (MRR) profiles for property management retainers.

### 3.6 Payables & Vendor Management (AP) (3 Reports)
- **REQ-REP-31 (3.14.R31 - Vendor Balance Summary):** Balances owed to marketing portals (Property Finder, Bayut), legal counsel, and suppliers.
- **REQ-REP-32 (3.14.R32 - Payable Summary):** Working capital payables aging and on-time supplier settlement percentages.
- **REQ-REP-33 (3.14.R33 - Payable Details):** Line-by-line vendor bill ledger with OCR receipt matching and 15-digit TRN verification.

### 3.7 Purchases & Operating Expenses (6 Reports)
- **REQ-REP-34 (3.14.R34 - Expense Details):** Audit log of all 42 master real estate operating expenses with payment source tagging.
- **REQ-REP-35 (3.14.R35 - Expenses by Category):** Expenditure aggregation across all 5 master expense classes (`CAT-01` to `CAT-05`).
- **REQ-REP-36 (3.14.R36 - Expenses by Customer):** Outlays incurred on behalf of specific VIP landlords and property owners.
- **REQ-REP-37 (3.14.R37 - Expenses by Project):** Direct marketing outlays assigned to exclusive off-plan launches.
- **REQ-REP-38 (3.14.R38 - Expenses by Employee):** Broker expense allowances, Salik tolls, fuel, and client entertainment outlays.
- **REQ-REP-39 (3.14.R39 - Billable Expense Details):** Recoverable client outlays (DLD fees, Ejari registration charges) billed back at zero margin.

### 3.8 Taxes & Statutory Compliance (2 Reports)
- **REQ-REP-40 (3.14.R40 - VAT Audit Report):** Official UAE FTA Form 201 VAT Return preparation file with Box 1 and Box 9 reconciliations.
- **REQ-REP-41 (3.14.R41 - Excise / Corporate Tax Audit Report):** UAE Federal Corporate Tax (9%) computation file with AED 375,000 Small Business Relief analysis.

### 3.9 Banking & Reconciliation (1 Report)
- **REQ-REP-42 (3.14.R42 - Reconciliation Status):** Bank reconciliation ledger matching Wio Business primary accounts and RERA escrow accounts against ERP records.

### 3.10 Projects & Timesheets (7 Reports)
- **REQ-REP-43 (3.14.R43 - Timesheet Details):** Agent and media staff hours logged against project marketing assignments.
- **REQ-REP-44 (3.14.R44 - Timesheet Profitability Summary):** Labor cost rates vs. deal commission revenue generated per project.
- **REQ-REP-45 (3.14.R45 - Project Summary):** Status, milestone progress, and budget burn for all off-plan developer mandates.
- **REQ-REP-46 (3.14.R46 - Project Details):** Operational lead generation, cost-per-lead (CPL), and contract conversion velocity per project.
- **REQ-REP-47 (3.14.R47 - Projects Cost Summary):** Consolidated expense breakdown across ads, media, events, and labor.
- **REQ-REP-48 (3.14.R48 - Projects Revenue Summary):** Commission realization and escrow pipeline per developer project.
- **REQ-REP-49 (3.14.R49 - Projects Performance Summary):** Scorecard ranking projects by margin %, sales velocity, and developer satisfaction.

### 3.11 Accountant & General Ledger (6 Reports)
- **REQ-REP-50 (3.14.R50 - Account Transactions):** Chronological double-entry journal with complete debit/credit narration.
- **REQ-REP-51 (3.14.R51 - Account Type Summary):** Summary of Assets (1000s), Liabilities (2000s), Equity (3000s), Revenue (4000s), and Expenses (5000s).
- **REQ-REP-52 (3.14.R52 - General Ledger):** Master chart of accounts ledger with opening, movement, and closing balances.
- **REQ-REP-53 (3.14.R53 - Detailed General Ledger):** Transaction-level general ledger with counterparty details and receipt voucher links.
- **REQ-REP-54 (3.14.R54 - Journal Report):** Adjusting journal entries, depreciation schedules, and month-end CFO approval stamps.
- **REQ-REP-55 (3.14.R55 - Trial Balance):** Pre-closing verification proving $\sum \text{Debits} = \sum \text{Credits}$ with zero variance.

### 3.12 Currency & FX Gains/Losses (2 Reports)
- **REQ-REP-56 (3.14.R56 - Realized Gain or Loss):** Realized foreign exchange gain/loss on international client invoice settlements in USD, EUR, or GBP.
- **REQ-REP-57 (3.14.R57 - Unrealized Gain or Loss):** IAS 21 mark-to-market revaluation of open foreign receivables at month-end closing rates.

### 3.13 Activity, Audit Trail & Telemetry (7 Reports)
- **REQ-REP-58 (3.14.R58 - System Mails):** Outbound invoice delivery, payment receipt notifications, and dunning reminder logs.
- **REQ-REP-59 (3.14.R59 - Activity Logs):** Immutable security and audit trail capturing all user actions under UAE PDPL guidelines.
- **REQ-REP-60 (3.14.R60 - Exception Report):** Anomaly alerts for bounced cheques, missing vendor TRNs, and budget threshold violations.
- **REQ-REP-61 (3.14.R61 - Portal Activities):** Client portal login sessions, invoice downloads, and e-sign confirmations.
- **REQ-REP-62 (3.14.R62 - Customer Reviews):** Client CSAT ratings, NPS survey scores, and verified Google Dubai reviews.
- **REQ-REP-63 (3.14.R63 - API Usage):** Real-time API throughput, latency, and uptime across Wio Bank, Property Finder, and WhatsApp Cloud APIs.
- **REQ-REP-64 (3.14.R64 - Pending Inventory Valuations):** Queue of property listings awaiting comparative market analysis (CMA) valuation sign-off.

### 3.14 Automation & Workflow Execution (3 Reports)
- **REQ-REP-65 (3.14.R65 - Scheduled Date Based Workflow Rules):** Active date-triggered automations (Ejari 90/60/30-day lease notices, quarterly VAT runs).
- **REQ-REP-66 (3.14.R66 - Scheduled Time Based Workflow Actions):** Cadence-based cron execution monitoring (daily 08:00 AM Wio bank recon, hourly portal sync).
- **REQ-REP-67 (3.14.R67 - Workflow Execution Logs):** Real-time streaming log of payload states, retry counts, and execution latencies.

---

## 4. Acceptance Criteria & Quality Gates

1. **Coverage:** All 67 reports must be accessible in the UI with valid metadata, search indexing, and category filtering.
2. **UAE Dirham Precision:** All financial calculations must format in AED with exact two-decimal precision.
3. **VAT 5% Consistency:** Input/Output tax calculations must strictly match UAE FTA statutory rules.
4. **Export Capability:** Every report must support instant client-side CSV export and certified PDF download triggers.
5. **Zero External SaaS:** 100% of accounting and reporting logic must execute within White Caves without third-party accounting subscriptions.
