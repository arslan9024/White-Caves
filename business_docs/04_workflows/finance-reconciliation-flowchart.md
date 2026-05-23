# Finance Reconciliation Flowchart — White Caves CRM Platform

> **Version:** 1.0 | **Date:** March 2026

---

## Overview
Defines the monthly and transaction-level financial reconciliation workflows between the CRM and company accounts.

---

## 1. Transaction-Level Commission Flow

```
[Deal Marked "Completed" in CRM (Sophia)]
                 │
                 ▼
[System AUTO-CREATES Commission Record]
│ Amount = Transaction amount × commission rate
│ Status = "Pending"
│ Linked to: agent, lead, property
│ Composite index check: prevent duplicate commission
                 │
                 ▼
[Finance Director Reviews Commission]
│ Navigate: Finance → Commissions → Pending
│ Review: Transaction reference, property, agent, % rate, AED amount
│ Cross-check with SPA / lease contract
                 │
         ┌───────┴────────┐
         ▼                ▼
[APPROVE]             [DISPUTE / REJECT]
│                     │
│ Status → Approved   │ Status → Disputed
│                     │ Dispute note added
│                     │ Notify manager + agent
│                     │ Agent can respond within 3 days
│                     │ Finance Director makes final decision
│                     ▼
│             [RESOLVE DISPUTE]
│             │ Status → Approved or Cancelled
│             │ Dispute log preserved
│             ▼
└────────────►[MARK FOR PAYMENT]
                 │
                 ▼
[Monthly Payout Processing]
│ (See Section 2)
```

---

## 2. Monthly Reconciliation Workflow (Last Working Day of Month)

```
[Finance Director Opens Monthly Close Checklist]
                 │
         ┌───────▼──────────────────────────┐
         │ STEP 1: COMMISSION RECONCILIATION │
         │                                  │
         │ Filter Commissions by:           │
         │ • Status = Approved              │
         │ • createdAt = This Month         │
         │                                  │
         │ Cross-check against:             │
         │ • Transaction list              │
         │ • SPA / Lease documents          │
         │ • Developer payment confirmations│
         └───────────────┬──────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ STEP 2: DISCREPANCY CHECK         │
         │                                   │
         │ Are there commissions marked      │
         │ "Approved" but no corresponding   │
         │ transaction in CRM?               │
         │                                   │
         │ YES → Flag for investigation      │
         │        Add dispute note           │
         │ NO  → Proceed                     │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ STEP 3: BANK TRANSFER PROCESSING  │
         │                                   │
         │ Finance Director exports          │
         │ approved commission list to Excel │
         │                                   │
         │ Processes payments via company    │
         │ banking portal                    │
         │                                   │
         │ Returns to CRM:                   │
         │ Select all paid commissions       │
         │ → Bulk Mark as Paid               │
         │ → Enter: date, reference, method  │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ STEP 4: RENTAL INCOME RECONCILE   │
         │                                   │
         │ Finance checks:                   │
         │ • All active leases with rent due │
         │ • Mark rent received in CRM       │
         │ • Flag any overdue rent           │
         │ • Issue reminders for overdue     │
         │   (via WhatsApp bot Nina)         │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ STEP 5: MONTHLY P&L SNAPSHOT      │
         │                                   │
         │ Navigate to Finance Dashboard     │
         │ → Period: Last Month              │
         │                                   │
         │ Record key metrics:               │
         │ • Total revenue                   │
         │ • Commission paid out             │
         │ • Gross profit                    │
         │ • MRR (management fees)           │
         │                                   │
         │ Export as PDF for MD review       │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ STEP 6: MD REVIEW AND SIGN-OFF    │
         │                                   │
         │ MD reviews monthly P&L summary    │
         │ Approves or queries discrepancies │
         │ Month-end close complete          │
         └───────────────────────────────────┘
```

---

## 3. VAT Reporting Support (Annual)

```
[Finance Director runs Annual VAT Report]
│ Navigate: Finance → Reports → Annual Export
│ Filter: Period = Full Year; Include: all completed transactions
         │
         ▼
[Export to Excel]
│ Columns: Date, Type, Amount, VAT flag (5% for commercial; 0% residential sales)
│ Review: Correct VAT categorisation per transaction type
         │
         ▼
[Provide to External Accountant / Tax Agent]
│ UAE VAT return filed via FTA portal
│ CRM serves as source of truth for figures
```

---

## 4. Commission Dispute Resolution Timeline

| Day | Action |
|-----|--------|
| Day 0 | Commission disputed by Finance Director |
| Day 1 | Agent notified via in-app notification |
| Day 1–3 | Agent submits response/evidence |
| Day 3–5 | Manager reviews dispute |
| Day 5 | Final decision: Approved or Cancelled |
| Day 5+ | If cancelled: agent can formally appeal to MD within 7 days |

---

## 5. Audit-Ready Records

All commission and transaction records are:
- **Immutable once paid** (no delete, no edit to amount/date)
- **Linked to agent, property, and transaction** (full traceability)
- **Retained for 5 years** (AML requirement)
- **Exportable as PDF or Excel** for audit purposes

---

**Version:** 1.0 | **Date:** March 2026
