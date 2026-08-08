# Rental Management & Finance Workflow Flowcharts

<!-- markdownlint-disable MD024 MD040 MD060 -->

> **Version:** 1.0  
> **Last Updated:** August 2026  
> **Owner:** Operations (Daisy) + Finance (Theodora)
> **Priority Scope:** MD + Leasing Agent first (property listings → leasing operations → receipts).

---

## Priority Persona Contract (P0)

- **Executive owner:** MD (`owner`) for escalations, compliance confidence, and approval exceptions.
- **First-operator owner:** Leasing Agent (`leasing_agent`) for day-to-day leasing execution.
- **Reference workflow profile:** `agent.one.whitecaves@gmail.com` (Leasing Broker scenario validation).

### P0 operational success criteria

1. Leasing leads from homepage sources are qualified and moved to viewing within agreed SLA.
2. Lease progression to Ejari is traceable and status-driven.
3. Rent payment confirmation produces receipt issue, delivery, and archival events.

### Receipt operations matrix (mandatory)

| Trigger | Owner | SLA | Required artifact |
|---------|-------|-----|-------------------|
| Payment marked paid | Finance/System | Immediate | Receipt record created |
| Receipt sent to parties | Leasing Agent | ≤ 30 min | Delivery status evidence |
| Receipt archived | Finance/Docs | Same day | Audit-linked archive entry |

---

## Workflow 1: Rent Collection Cycle (Monthly)

## Workflow 0: Homepage → Leasing Journey Entry (P0 Priority)

```
[VISITOR LANDS ON HOMEPAGE]
        │
        ▼
[LEASING-FOCUSED CTA]
│ CTA examples:
│ - Find Rental Units
│ - Book Viewing
│ - WhatsApp Leasing Team
        │
        ▼
[LEAD CAPTURE + SOURCE TAGGING]
│ Lead source:
│ - homepage_cta
│ - homepage_search
│ - homepage_whatsapp
        │
        ▼
[LEASING AGENT QUALIFICATION]
│ Budget, location, unit type, move-in timeline
        │
        ▼
[VIEWING SCHEDULING]
│ Confirmation + reminder + feedback loop
        │
        ▼
[OFFER / CONTRACT / EJARI]
│ Transition to tenancy-ejari core workflow
        │
        ▼
[ACTIVE LEASE OPERATIONS]
│ Payment + maintenance + renewal handled across
│ tenant portal + landlord portal + leasing CRM
```

---

## Workflow 1: Rent Collection Cycle (Monthly)

```
┌────────────────────────────────────────────────────────────────┐
│         MONTHLY RENT COLLECTION CYCLE                          │
│         Runs: 1st of every month for all active leases         │
└────────────────────────────────────────────────────────────────┘

[DAY 1 OF MONTH — Automated Trigger]
        │
        ▼
[RENT DUE NOTICE — Sent to all tenants with payment due this month]
│ Channel: WhatsApp (primary) + Email (secondary)
│ Message: "Your rent of AED [amount] is due on [due date].
│           Please pay via: [bank transfer / online link]
│           Reference: [lease ID]"
│
│ Theodora creates "Pending" payment record in system
        │
        ▼
[PAYMENT WINDOW: Days 1–5]
│
├── Payment Received ──▶
│       │
│       ▼
│   [PAYMENT PROCESSING]
│   │ Bank transfer auto-reconciled (when bank integration active)
│   │ Agent manually confirms payment if bank integration absent
│   │ Payment record updated: Pending → Paid
│   │ Tenant receives: "Payment confirmed ✅" via WhatsApp
│   └── Theodora monthly report updated
│
└── No Payment by Day 5 ──▶
        │
        ▼
[DAY 5 — FIRST REMINDER]
│ WhatsApp: "Hi [Name], your rent of AED [amount] was due [date].
│            Please arrange payment to avoid a late fee.
│            Need help? Reply to this message."
│ Status: "Overdue" (flag on lease dashboard)
        │
        ▼ (still no payment)
[DAY 10 — SECOND REMINDER + AGENT FOLLOW-UP]
│ WhatsApp automated: Second reminder message
│ Leasing agent (Daisy) makes personal phone call
│ Call logged as activity on tenant record
        │
        ▼ (still no payment)
[DAY 15 — LATE FEE ASSESSMENT]
│ Late fee calculated: 5% of monthly rent (configurable)
│ Late fee record created by Theodora
│ Tenant notified of late fee via WhatsApp
│ Notice: "A late fee of AED [amount] has been applied to your account."
        │
        ▼ (still no payment)
[DAY 25 — LEGAL ESCALATION]
│ Case escalated to Laila (Compliance)
│ Laila reviews and decides:
│   ├── Issue formal demand letter (legal notice)
│   ├── Contact DLD for rental dispute filing
│   └── Coordinate with legal counsel
│
│ Escalation logged in tenant record with Laila's notes
        │
        ▼ (payment received at any point)
[PAYMENT RECEIVED — POST OVERDUE]
│ Payment record updated: Overdue → Paid
│ Late fee either:
│   ├── Paid as part of payment → Revenue recorded separately
│   └── Waived → Manager approval required + audit note
│ Escalation closed
│ Tenant notified with receipt
```

### Workflow 1 receipt checkpoints

- A unique receipt identifier must be generated for each paid rent event.
- Receipt payload must include lease reference, paid amount, VAT fields (if applicable), and timestamp.
- Receipt delivery status must be visible to Leasing Agent and auditable by MD.

---

## Workflow 2: Maintenance Request Lifecycle

```
[MAINTENANCE REQUEST SUBMITTED]
│ Channels:
│ ├── Tenant: WhatsApp message (auto-converted to ticket by Nina bot)
│ ├── Tenant: Via tenant portal (if implemented)
│ └── Landlord: Direct to leasing agent
        │
        ▼
[TICKET CREATED IN SYSTEM — Daisy]
│ Fields: Category, Priority, Description, Photos
│ Linked to: Tenant record + Property record
│ Status: Open
        │
        ▼
[PRIORITY ASSESSMENT]
│
├── URGENT (safety risk / no water / no power):
│   └── Contractor assigned within 2 hours
│       Tenant + Landlord notified immediately
│
├── HIGH (AC failure / major plumbing):
│   └── Contractor assigned within 4 hours
│       First visit within 24 hours
│
├── NORMAL (minor plumbing / appliance):
│   └── Contractor assigned within 24 hours
│       Resolution within 48 hours
│
└── LOW (cosmetic / non-essential):
    └── Batch with other low-priority jobs
        Resolution within 5 business days
        │
        ▼
[CONTRACTOR ASSIGNMENT — Sentinel coordinates]
│ Select from approved contractor list
│ Contractor receives: job details, property address, contact info
│ Appointment time agreed with tenant
│ Status: In Progress
        │
        ▼
[JOB COMPLETION]
│ Contractor reports completion
│ Daisy reviews and approves
│ Cost recorded against property
│ Status: Pending Approval
        │
        ▼
[LANDLORD APPROVAL (for costs above AED 500)]
│ Landlord notified: "Maintenance completed — Cost: AED [X]"
│ Landlord approves/disputes
│ Status: Closed (on approval)
        │
        ▼
[TENANT SATISFACTION]
│ Nina bot sends: "Your maintenance request has been resolved.
│                  Was the work completed satisfactorily?
│                  1️⃣ Yes  2️⃣ Partially  3️⃣ No — Need follow-up"
│
│ Rating recorded against contractor and ticket
│ If "No" → Ticket reopened automatically
```

---

## Workflow 3: Lease Renewal Process

```
[60 DAYS BEFORE LEASE EXPIRY — Automated Trigger]
        │
        ▼
[RENEWAL TASK CREATED — Daisy Dashboard]
│ Alert: "[Tenant Name] — Lease expires in 60 days"
│ Property: [address], Expiry: [date]
        │
        ▼
[LEASING AGENT CONTACTS TENANT — Day 60]
│ WhatsApp: "Hi [Name], your lease expires on [date].
│            We'd love to renew with you!
│            Any changes to your requirements?"
│
│ Three outcomes:
│
├── Tenant wants to renew ──▶
│       │
│       ▼
│   [RENEWAL NEGOTIATION]
│   │ Current rent vs market rate review (Cipher market data)
│   │ New rent proposed (within RERA guidelines: max +5% increase/year)
│   │ New lease term agreed (typically 1 year)
│   │ New lease document generated
│   │ New Ejari registration required
│   └── Lead-to-Lease workflow (abbreviated) re-executed
│
├── Tenant wants to leave ──▶
│       │
│       ▼
│   [VACATING PROCESS]
│   │ Notice period confirmed (typically 90 days per UAE law)
│   │ Move-out date agreed
│   │ Property inspection scheduled (1 week before move-out)
│   │ Security deposit return calculated
│   │ Ejari cancellation initiated
│   └── Property status → "Available" for re-letting
│
└── No response by Day 45 ──▶
        │ Second reminder sent (Day 45)
        │ Manager alerted if still no response by Day 30
        └── Legal notice prepared if no response by Day 20
```

---

## Workflow 4: Financial Month-End Close

```
┌────────────────────────────────────────────────────────────────┐
│         FINANCIAL MONTH-END CLOSE (Theodora)                   │
│         Timeline: Days 25–5 of following month                 │
└────────────────────────────────────────────────────────────────┘

[DAYS 25–28 OF CURRENT MONTH]
│ All transactions for month recorded and verified
│ All commissions for month calculated
│ Pending commissions reviewed for approval
│ Outstanding payments chased (Theodora + Nadia)
        │
        ▼
[DAY 1–2 OF FOLLOWING MONTH: BANK RECONCILIATION]
│ Bank statements downloaded (UAE bank portal)
│ Transactions matched to system records
│ Discrepancies investigated and resolved
│ Unmatched items: investigate → journal entry or escalate
│ Bank reconciliation report generated
        │
        ▼
[DAY 2–3: FINANCIAL REPORTS GENERATED]
│ Reports auto-generated:
│ ├── P&L Statement (Sales commission income - operating costs)
│ ├── Rental Income Report (by property, by landlord)
│ ├── Commission Detail Report (per agent, per transaction)
│ └── Balance Sheet snapshot
│
│ Reports reviewed by Finance Director
│ Anomalies investigated
│ Reports locked and archived
        │
        ▼
[DAY 3–4: COMMISSION DISBURSEMENT]
│ All approved commissions processed for payment
│ Bank transfers initiated per agent
│ Remittance confirmations recorded
│ Agent commission statements generated and sent
│ Each agent notified via WhatsApp/email: "Commission paid: AED [X]"
        │
        ▼
[DAY 5: EXECUTIVE REPORTING — To Zoe]
│ Monthly summary dashboard updated:
│ ├── Revenue vs target
│ ├── Pipeline value (forecast next 30/60/90 days)
│ ├── Occupancy rate
│ ├── Collection rate
│ └── Headcount and productivity
│
│ Zoe receives weekly/monthly report digest
        │
        ▼
[DAY 5–7: ARCHIVE AND FILING]
│ All month-end documents archived
│ Backup snapshot created
│ Compliance documentation filed
│ Next month preparation begins
```

---

## Key Performance Indicators — Finance & Leasing

| KPI                                     | Target     | Frequency | Owner    |
| --------------------------------------- | ---------- | --------- | -------- |
| On-time rent collection rate            | ≥ 95%      | Monthly   | Theodora |
| Average days to resolve overdue payment | ≤ 15 days  | Monthly   | Daisy    |
| Month-end close time                    | ≤ 5 days   | Monthly   | Theodora |
| Commission payment accuracy             | 100%       | Monthly   | Theodora |
| Maintenance request resolution (urgent) | ≤ 24 hours | Weekly    | Daisy    |
| Maintenance request resolution (normal) | ≤ 48 hours | Weekly    | Daisy    |
| Lease renewal rate                      | ≥ 70%      | Quarterly | Daisy    |
| Occupancy rate                          | ≥ 95%      | Monthly   | Daisy    |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Owner:** Operations + Finance
