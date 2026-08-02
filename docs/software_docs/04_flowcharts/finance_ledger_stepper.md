# 4-Step Financial Approval Stepper Flowchart

> **Document Class:** Graphical Flowcharts & Interaction Diagrams  
> **Repository Path:** `software_docs/04_flowcharts/finance_ledger_stepper.md`

---

## 💰 4-Step State Machine Approval Pipeline

```
┌──────────────────────────────┐
│  STEP 1: AGENT SUBMITTED     │
│  Agent inputs deal details   │
│  & gross commission split.   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  STEP 2: MANAGER APPROVED    │
│  Sales Manager verifies      │
│  documents & client KYC.     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  STEP 3: FINANCE LOCKED      │
│  Finance Dept verifies TRN,  │
│  VAT 5%, & bank account.     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  STEP 4: PAYMENT RELEASED    │
│  Bank transfer file generated│
│  & net payout released.      │
│  Status: GREEN / COMPLETE    │
└──────────────────────────────┘
```
