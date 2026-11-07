# In-House Finance & Accounting Implementation Roadmap

**Governing AI Assistant:** **Theodora** (Finance & Accounts Director)  
**Assisting Planner:** `@Margaret`  
**Agentic Domain:** `@Invoice`  
**Creation Date:** 2026-08-24  
**Target:** 100% Native UAE PropTech Accounting, VAT 201 & Corporate Tax Engine  

---

## 🎯 Milestone Schedule

### Milestone 1: Master Schema & Catalog Ingestion (Completed)
- [x] Ingest master JSON schema covering all 42 real estate expenses into [`data/expenses-master-schema.json`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/data/expenses-master-schema.json).
- [x] Create formal SRS specification [`docs/software_docs/01_requirements_engineering/srs_theodora_finance_accounting.md`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/docs/software_docs/01_requirements_engineering/srs_theodora_finance_accounting.md).
- [x] Create formal SDD architectural blueprint [`docs/software_docs/02_software_design/sdd_theodora_finance_accounting.md`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/docs/software_docs/02_software_design/sdd_theodora_finance_accounting.md).

### Milestone 2: Backend API & Service Layer Implementation (Active)
- [x] Expose `GET /api/finance/expense-catalog` to serve the 42 structured expense items.
- [x] Extend `POST /api/finance/expenses` with auto VAT 5% calculation, payment source segregation (`Wio` vs `Director Loan`), and CT deductibility flagging.
- [x] Enhance `GET /api/finance/vat-return` to calculate real-time Input VAT from qualifying expenses and Output VAT from tax invoices.
- [x] Add `GET /api/finance/directors-loan-summary` and `GET /api/finance/corporate-tax-summary`.

### Milestone 3: Frontend Theodora Dashboard UI (Completed)
- [x] Connect Theodora AI Assistant UI to real-time expense logger with payment source routing (`Wio` vs `Director Loan`).
- [x] Render interactive Director's Loan settlement card with reimbursement generation (`DirectorsLoanTab.tsx`).
- [x] Render UAE FTA Form 201 VAT Return preview and Corporate Tax 9% threshold gauge (`VatReturnTab.tsx` & `CorporateTaxTab.tsx`).

### Milestone 4: Verification & Automated Test Matrix (Completed)
- [x] Unit & integration tests for all 5 Chart of Accounts classes, 37+ sub-items, VAT calculations, and CT profit thresholds.
- [x] Zero regression across existing commission, invoice, and payment routes (34 backend + 47 frontend vitest tests green).

