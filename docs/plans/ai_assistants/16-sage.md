# 16 — Sage · Mortgage & Financing Advisor

> **ID:** `sage`  
> **Department:** Finance  
> **Title:** Mortgage & Financing Advisor  
> **Color:** `#059669` (Emerald)  
> **Avatar:** 🏦  
> **Phase:** Phase 5 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** All agents, Buyers (via portal), Managing Director

---

## 1. Overview

Sage helps buyers and investors **navigate UAE mortgage and financing options**. She calculates monthly repayments, compares loan offers from UAE banks, checks buyer eligibility (LTV, EIBOR-based rates, stress tests), and generates affordability reports. She also advises on developer payment plans vs bank mortgage trade-offs. Every property detail page links to Sage's affordability calculator.

---

## 2. Core Responsibilities

1. Calculate monthly mortgage repayment for any property + buyer profile combination
2. Show EIBOR-linked interest rate projections (current EIBOR + bank margin)
3. Compare mortgage products from major UAE banks (Emirates NBD, Mashreq, HSBC, FAB)
4. Generate affordability report: max loan amount based on salary/income
5. Advise on developer payment plan vs bank mortgage trade-off
6. Track pre-approval applications: status per buyer, documents required

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Repayment calculator | Monthly repayment at current EIBOR + margin, 15 or 25-year terms |
| LTV calculator | Maximum loan = 80% (UAE nationals) or 75% (expats) of property value |
| Eligibility check | DBR (Debt Burden Ratio) ≤ 50%: monthly obligations / monthly income |
| Bank comparison | Side-by-side table: bank name, rate, processing fees, overpayment terms |
| Rate sensitivity | Slider: show repayment at EIBOR + 0.5%, +1.0%, +1.5% (stress test) |
| Developer plan comparison | Show: developer (0% interest, higher unit price) vs bank (lower price + interest) |
| Pre-approval tracker | Log pre-approval applications: bank, amount, status, documents |
| Affordability report PDF | Quill generates formatted report for buyer to share with family/bank |
| EIBOR live rate | Fetches current EIBOR rate from UAE Central Bank API (daily refresh) |

---

## 4. How It Works — End to End

### Step 1 — Calculator Embed
On any property detail page: "Calculate Mortgage" button → opens Sage panel → pre-filled with `property.price` and `property.serviceChargePerYear`.

### Step 2 — Buyer Input
Buyer enters: monthly income, existing liabilities, nationality (expat/national), preferred term (15/25 years), down payment amount.

### Step 3 — LTV & DBR Check
`SageService.checkEligibility(income, liabilities, loanAmount)`:
- LTV: loan requested / property value ≤ 80% (national) or 75% (expat)
- DBR: (existing liabilities + new monthly payment) / monthly income ≤ 50%
- If LTV or DBR fails → show corrective advice ("You need AED X more down payment")

### Step 4 — Rate Fetch
`SageService.getCurrentRates()` → `GET https://www.centralbank.ae/eibor` (or cached, refreshed daily by cron). Fetch bank margin list from Sage's configuration table.

### Step 5 — Repayment Calculation
For each bank product: `monthlyRate = (EIBOR + bankMargin) / 12`. `repayment = loanAmount × monthlyRate / (1 - (1 + monthlyRate)^-term)`.

### Step 6 — Comparison Display
Results shown as a sortable table: Bank Name | Rate | Monthly | Total Interest | Processing Fee | Recommended (Y/N).

### Step 7 — Developer Plan Comparison
Fetch developer payment plan from Vesta/Mary → compute total developer cost vs total bank mortgage cost over same period → show which is cheaper.

### Step 8 — Pre-Approval Application
Buyer chooses bank → Sage creates pre-approval task: `POST /api/pre-approvals { buyerId, bankName, loanAmount, documents: [] }`. Agent assists with document collection.

### Step 9 — Affordability Report
Buyer requests PDF → Quill generates: buyer profile, recommended budget range, top 3 bank options, monthly repayments → PDF downloaded or WhatsApp shared.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/sage/rates` | Current EIBOR + bank margins |
| POST | `/api/sage/calculate` | Calculate repayment for given inputs |
| POST | `/api/sage/eligibility` | Check LTV + DBR eligibility |
| GET | `/api/sage/banks` | List bank mortgage products |
| POST | `/api/pre-approvals` | Create pre-approval application |
| GET | `/api/pre-approvals` | List pre-approvals |
| PATCH | `/api/pre-approvals/:id` | Update status / documents |
| POST | `/api/sage/affordability-report` | Generate PDF affordability report |

---

## 6. Data Flows

- **Receives from:** UAE Central Bank API (EIBOR rates), Mary (property prices), Vesta (developer payment plans)
- **Sends to:** Quill (affordability report PDF), Nadia (pre-approval status updates), Clara (buyer financial profile enrichment)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Sage mortgage calculator | `src/components/MortgageCalculator/` | 🔲 Planned (exists as frontend-only) |
| Bank comparison table | Inside calculator | 🔲 Planned |
| Pre-approval tracker | `src/components/owner/ai/SageCRM/` | 🔲 Planned |
| Property detail embed | `src/pages/PropertyDetailPage.tsx` | 🔲 Planned (embed button) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| SageService | `server/services/SageService.ts` | 🔲 Planned |
| Rates cron | `server/jobs/eiborRatesJob.ts` | 🔲 Planned |
| Pre-approvals CRUD | `server/routes/preApprovals.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| All users (including public) | Calculator (read-only) |
| `agent` | Pre-approval management |
| `buyer` | Own pre-approvals via portal |
| `managing_director` | All pre-approvals + bank product config |

---

## 10. Implementation Checklist

- [ ] Register `sage` in `AI_ASSISTANTS_REGISTRY`
- [ ] Backend repayment calculation endpoint (replace frontend-only calculator)
- [ ] EIBOR live rate fetch + daily cron cache
- [ ] Bank products configuration table
- [ ] LTV + DBR eligibility checker
- [ ] Pre-approvals model + CRUD
- [ ] Developer plan comparison logic
- [ ] Affordability report PDF (Quill)
- [ ] Property detail page embed

---

## 11. Dependencies

- UAE Central Bank EIBOR API (external)
- Quill (PDF report generation)
- Vesta (developer payment plans)
- `node-cron` (daily EIBOR rate refresh)

---

## 12. Future Enhancements

- Direct mortgage application submission via bank APIs (HSBC/Mashreq Open Banking)
- Islamic finance (Ijara) calculation option
- Life insurance bundling calculator
- AI-powered mortgage readiness coaching ("In 6 months you can qualify if...")
