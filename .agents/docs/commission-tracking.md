# Commission Tracking — CRM Feature Specification

> **Status:** Active (Production + Enhancement)  
> **Module Owner:** Theodora (Finance Director AI)  
> **API Endpoints (Canonical):** `/api/commissions`  
> **Priority:** Critical

---

## Overview

The Commission Tracking module manages the full lifecycle of commission records: from automatic creation when a deal closes, through manager approval, to payment by the Finance Director. It provides agents with full visibility of their earnings and gives management an accurate financial picture.

---

## User Stories

- As an **agent**, I want to see all my commissions (pending, approved, paid) in one view, so that I know my expected income.
- As an **agent**, I want to receive a notification when my commission is approved or paid, so that I know when to expect my transfer.
- As a **sales manager**, I want to review and approve pending commissions, so that agents are paid fairly and accurately.
- As a **finance director**, I want to process commission payments in bulk and mark them paid, so that month-end disbursement is efficient.
- As the **owner**, I want to see total commission liability by period, so that I understand payroll obligations.

---

## Business Rules

- Commission is automatically created when a Transaction status moves to `Closed`.
- Default sale commission rate: 2% of sale price (configurable in system settings).
- Default lease commission rate: 5% of first year annual rent (configurable).
- Default agent/broker split: 50/50 (adjustable per transaction by manager).
- Commission cannot be edited once status is `Paid`.
- Commission approval requires `sales_manager` or `owner` role.
- Payment processing requires `finance` or `owner` role.

---

## Commission Lifecycle

```
Transaction CLOSED
      │
      ▼
Commission Record Created (Status: PENDING)
      │
      ▼
Sales Manager Reviews
      ├── Approve → Status: APPROVED
      └── Reject → Status: REJECTED (reason required; transaction review triggered)
      │
      ▼ (Approved)
Finance Director Processes Payment
      │ Bank transfer + reference recorded
      ▼
Status: PAID (date + method recorded)
      │
      ▼
Agent Notified: "Commission AED X paid on [date]"
Agent Commission Statement generated (PDF)
```

---

## Data Model

```typescript
Commission {
  id: string
  transactionId: string          // Reference to closed transaction
  agentId: string                // The earning agent
  type: 'sale' | 'lease'
  transactionValue: number       // AED — sale price or annual rent
  rate: number                   // e.g., 0.02 (2%)
  grossAmount: number            // transactionValue × rate
  agentSplitPct: number          // e.g., 0.5 (50%)
  brokerSplitPct: number         // e.g., 0.5 (50%)
  agentAmount: number            // grossAmount × agentSplitPct
  brokerAmount: number           // grossAmount × brokerSplitPct
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  rejectionReason?: string
  approvedBy?: string            // Manager user ID
  approvedAt?: Date
  paidBy?: string                // Finance director user ID
  paidAt?: Date
  paymentMethod?: 'bank_transfer' | 'cheque'
  paymentReference?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## API Endpoints

> **Compatibility Note:** Some legacy routes may still proxy through finance namespace. Canonical path for all new implementation and tests is `/api/commissions`.

| Method | Path                                  | Access                        | Description                                                                               |
| ------ | ------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/commissions`                    | Manager, Finance, Owner       | List all commissions (filterable)                                                         |
| GET    | `/api/commissions/my`                 | Agent                         | Own commissions only                                                                      |
| GET    | `/api/commissions/:id`                | Agent (own), Manager, Finance | Single commission detail                                                                  |
| PATCH  | `/api/commissions/:id`                | Manager, Finance, Owner       | Update commission (including status: PENDING/APPROVED/REJECTED/PAID and payment metadata) |
| GET    | `/api/commissions/summary`            | Finance, Owner                | Aggregate summary                                                                         |
| GET    | `/api/commissions/statement/:agentId` | Agent (own), Manager, Finance | Agent commission statement                                                                |

---

## UI Components

### Commission Dashboard (Finance Director view)

- Summary cards: Total Pending (AED), Total Approved (AED), Total Paid MTD
- Commission list table: filterable by status, agent, date range
- Bulk approval action for multiple "Pending" records
- Bulk payment processing with confirmation dialog

### Agent Commission View

- Personal earnings summary: This month / This quarter / YTD
- Commission list: transaction reference, property, date, amount, status
- Status badges: Pending (amber), Approved (blue), Paid (green), Rejected (red)
- Download statement (PDF)

---

## Acceptance Criteria

- [ ] Commission record auto-created when transaction status → Closed
- [ ] Amount calculated correctly (rate × value × split)
- [ ] Commission cannot be edited in "Paid" status
- [ ] Approval notification sent to agent on approval
- [ ] Payment notification sent to agent on payment
- [ ] Agent can only see own commissions
- [ ] Managers can see all commissions for their department
- [ ] Finance Director can process bulk payments
- [ ] Commission statement PDF includes all required details

---

**Version:** 1.0 | **Last Updated:** March 2026
