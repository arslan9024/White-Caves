# Leasing Support Operations Playbook

> **Status:** Draft v1 (Implementation-ready workflow manual)  
> **Owner:** Leasing Operations  
> **Coverage:** Tenant + Landlord service operations  
> **Last Updated:** 2026-06-19

---

## 1) Operating Model and Channels

Leasing support operates as a single service system across channels:

- WhatsApp (primary)
- Portal tickets (tenant/landlord)
- Call center escalation
- Agent-created internal cases

### Core operating principles

- Fast first response, deterministic routing, auditable closure.
- SLA clocks are explicit and never implicit.
- Tenant and landlord journeys have shared core process but differentiated communication.

---

## 2) Case Taxonomy and Routing Matrix

| Case Type     | Subtype                                     | Primary Owner    | Backup Owner        | Escalation Trigger                    |
| ------------- | ------------------------------------------- | ---------------- | ------------------- | ------------------------------------- |
| Payments      | Rent due, overdue, reconciliation dispute   | Finance Ops      | Leasing Manager     | unresolved > SLA or legal risk        |
| Maintenance   | Emergency, high, normal, low                | Maintenance Desk | Leasing Ops Lead    | emergency breach or repeated reopen   |
| Lease & Ejari | activation, amendment, renewal, termination | Leasing Agent    | Leasing Manager     | compliance blocker or deadline breach |
| Legal/Dispute | notice, complaint, RDC preparation          | Compliance/Legal | Operations Director | legal conflict, repeated complaint    |
| Portal Access | login, data mismatch, document access       | Support Desk     | Tech Ops Liaison    | unresolved > 24h                      |

---

## 3) SLA Model

### Response SLAs

- Bot first response (WhatsApp): < 2 minutes
- Human first response (business hours): < 10 minutes
- Priority callbacks: < 30 minutes

### Resolution SLAs

| Severity  | Target Resolution | Breach Escalation                    |
| --------- | ----------------- | ------------------------------------ |
| Emergency | < 4 hours         | Manager immediate + incident channel |
| High      | < 24 hours        | Manager at 12-hour risk threshold    |
| Medium    | < 72 hours        | Daily review queue                   |
| Low       | < 7 days          | Weekly queue review                  |

### SLA clock semantics

- Start: first customer contact timestamp
- Pause: waiting for required customer or authority input (must be logged)
- Resume: once required input is received
- Stop: closure QA approved

---

## 4) End-to-End Support Flow

1. Intake and classification
2. Owner assignment
3. Customer acknowledgement
4. Work execution and progress updates
5. Completion proposal
6. Closure QA
7. CSAT capture and analytics tagging

### Mandatory logging at each stage

- actor, timestamp, status, rationale

---

## 5) Renewal and Payment Support Tracks

### Renewal track

- T-120 intent confirmation
- T-90 offer issuance
- T-60 negotiation updates
- T-30 contract finalization or exit orchestration

### Payment support track

- Due reminder -> overdue sequence -> escalation
- Finance + leasing dual-visibility on unresolved payment cases

---

## 6) Tenant vs Landlord Communication Standards

| Audience | Tone                               | Update Cadence             | Mandatory Contents                              |
| -------- | ---------------------------------- | -------------------------- | ----------------------------------------------- |
| Tenant   | Clear, empathetic, action-oriented | At each status change      | case ID, next step, ETA                         |
| Landlord | Concise, commercial, risk-aware    | Key milestones + approvals | financial impact, approval required, SLA status |

### Message policy

- No ambiguous timelines.
- Every update must include owner and next checkpoint.

---

## 7) Escalation Ladder

1. Case owner
2. Team lead
3. Operations manager
4. Compliance/legal (if required)
5. Executive escalation for critical reputational/legal risk

### Escalation triggers

- SLA breach (or likely breach)
- repeated reopen
- legal/regulatory exposure
- high-value landlord risk

---

## 8) Service Recovery and Compensation Policy

When service fails materially:

- Acknowledge failure explicitly
- Provide remediation timeline
- Offer approved compensation per policy band
- Record root cause and prevent-recurrence action

| Incident Severity     | Recovery Policy                                     |
| --------------------- | --------------------------------------------------- |
| Minor inconvenience   | Priority handling + formal apology                  |
| Significant delay     | Fee waiver/credit per policy                        |
| Major service failure | Manager-reviewed compensation + executive oversight |

---

## 9) QA Sampling and Coaching Loop

- Minimum weekly QA sample by case type.
- QA criteria: SLA integrity, communication quality, closure correctness, compliance adherence.
- Coaching actions assigned to owners with due date.

### Quality KPIs

- Reopen rate
- SLA breach rate
- CSAT/NPS
- Repeat-issue recurrence rate

---

## 10) Acceptance Criteria

- [ ] 100% case types mapped to owner + backup + escalation trigger.
- [ ] SLA model defines response and resolution with clock semantics.
- [ ] End-to-end lifecycle is documented and auditable.
- [ ] Tenant/landlord communication standards are differentiated and explicit.
- [ ] Service recovery policy is defined with severity-based response.
- [ ] QA loop includes sampling frequency and coaching outcomes.
- [ ] No [Action Required: Enforce production-ready engineering constraints] placeholders remain.

---

## 11) Linkage Map

- Maintenance SOP: `business_docs/09_crm_features/maintenance.md`
- Tenancy lifecycle: `business_docs/09_crm_features/tenancy-ejari.md`
- Legal workflows: `business_docs/09_crm_features/legal-management.md`
- SLA policy: `business_docs/02_services/service-level-agreements.md`
- Rental flow baseline: `business_docs/04_workflows/rental-management-flowchart.md`
