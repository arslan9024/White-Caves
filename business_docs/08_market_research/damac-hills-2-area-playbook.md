# DAMAC Hills 2 Area Playbook — White Caves Real Estate LLC

> **Status:** Draft v1 (Implementation-ready business playbook)  
> **Owner:** Strategy + Leasing Operations  
> **Coverage:** DAMAC Hills 2 only  
> **Last Updated:** 2026-06-19

---

## 1) Purpose and Scope

This playbook defines how White Caves operates, scales, and wins in **DAMAC Hills 2** across inventory, leasing, tenant experience, landlord performance, and executive visibility.

### In scope

- DAMAC Hills 2 inventory acquisition, activation, pricing, and disposition
- Leasing funnel (lead -> viewing -> offer -> contract -> Ejari -> active tenancy)
- Tenant and landlord service operations
- Market comp methodology and pricing refresh cadence
- KPI governance and escalation thresholds

### Out of scope

- Non-DAMAC Hills 2 community operations (covered in citywide strategy docs)
- Detailed technical API contracts (covered in CRM feature specs)

---

## 2) Micro-Market Segmentation (Cluster-Level)

| Segment ID | Segment Name          | Typical Product            | Target Profile                    | Price/Rent Position | Primary Need                                |
| ---------- | --------------------- | -------------------------- | --------------------------------- | ------------------- | ------------------------------------------- |
| DH2-S1     | Family Upgrade        | 3BR/4BR townhouses, villas | End-user families                 | Mid-high            | Space, schools, community stability         |
| DH2-S2     | Yield Investor        | 1BR/2BR + selected TH      | Local/regional investors          | Mid                 | High occupancy and reliable rent collection |
| DH2-S3     | Budget Premium Renter | Entry villas/townhouses    | Young professionals, new families | Mid                 | Quality at better value vs prime zones      |
| DH2-S4     | Portfolio Landlord    | Multi-unit owners          | Remote/institutional landlords    | Mixed               | NOI optimization, low operational friction  |

### Segment rules

- Each listing must be tagged with exactly one primary segment.
- Each segment has dedicated pricing guardrails and lead-response SLA.
- Segment tags are mandatory in monthly strategy reviews.

---

## 3) Inventory Positioning Matrix

| Positioning Mode | When to Use                             | Pricing Logic                                      | Operational Priority                               |
| ---------------- | --------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Yield-Led        | Investor stock, high demand pockets     | Market median rent +/- 1-2% optimization window    | Minimize vacancy, maximize collection consistency  |
| Liquidity-Led    | Time-sensitive disposal/re-let          | Slightly below active median (data-backed)         | Faster time-to-close and lower carrying risk       |
| Premium-Led      | Upgraded units, superior finishing/view | Price premium with evidence pack (quality + comps) | Protect margin while preserving conversion quality |

### Mandatory positioning checks

- A listing cannot be activated without a positioning mode.
- Every pricing decision must reference comp evidence <= 30 days old.
- Repricing events must log: previous price, new price, reason, approver.

---

## 4) Lead Strategy by Segment and Channel

| Segment | Primary Channel                 | Secondary Channel | First Response SLA              | Qualification SLA | Viewing Booking Target        |
| ------- | ------------------------------- | ----------------- | ------------------------------- | ----------------- | ----------------------------- |
| DH2-S1  | WhatsApp + portal listing       | Referral          | < 2 min (bot), < 10 min (human) | < 2 hours         | >= 40% qualified leads        |
| DH2-S2  | Portal + outbound investor list | Email             | < 5 min (bot), < 20 min (human) | < 4 hours         | >= 35% qualified leads        |
| DH2-S3  | WhatsApp + social ads           | Call-back queue   | < 2 min (bot), < 10 min (human) | < 2 hours         | >= 45% qualified leads        |
| DH2-S4  | Account manager direct lane     | Executive channel | < 15 min (human)                | < 24 hours        | >= 50% portfolio review calls |

### Lead orchestration requirements

- Every inbound lead must include source and segment tags.
- No unassigned qualified lead should remain > 30 minutes.
- Escalate stale qualified leads to manager queue automatically.

---

## 5) Service Workflow Overlays

### Leasing workflow overlay

1. Lead intake + qualification
2. Viewing scheduling + reminder + feedback capture
3. Offer negotiation and approval
4. Contract generation and signature
5. Ejari registration and activation
6. Payment setup + maintenance onboarding

### Renewal workflow overlay

- T-120: Renewal intent capture
- T-90: Formal offer issuance
- T-60: Negotiation and final terms
- T-30: Signature completion or managed exit plan

### Maintenance workflow overlay

- Intake classification (emergency/high/medium/low)
- Contractor assignment and SLA clock
- Landlord approval threshold gate
- Completion QA and tenant rating capture

### Dispute overlay

- Formal intake, evidence packet, legal routing
- Resolution pathway: operational -> compliance -> legal

---

## 6) Pricing Comp Methodology and Refresh Cadence

### Comp set rules

- Use minimum 3 valid comparable units per pricing decision.
- Prefer same cluster/building; fallback to nearest equivalent within DAMAC Hills 2.
- Exclude stale comps (> 60 days) unless no alternatives (must be annotated).

### Refresh cadence

- Weekly tactical review for active listings.
- Immediate review on major market movement trigger.
- Monthly executive comp quality audit.

### Pricing governance

- Any increase/decrease above configured threshold requires manager approval.
- Every repricing event must include evidence link and rationale code.

---

## 7) Monthly Operating Calendar

| Week   | Focus                         | Deliverables                                   | Owner              |
| ------ | ----------------------------- | ---------------------------------------------- | ------------------ |
| Week 1 | Pipeline and inventory health | Segment inventory heatmap + stale listing list | Inventory Lead     |
| Week 2 | Pricing and comp review       | Repricing decisions + comp audit report        | Strategy + Leasing |
| Week 3 | Service quality review        | SLA breach analysis + recovery actions         | Operations         |
| Week 4 | Executive performance pack    | KPI scorecard + next-month action plan         | Executive Ops      |

---

## 8) KPI Dashboard and Escalation Thresholds

| KPI                                  | Target   | Alert Threshold | Escalation Owner      |
| ------------------------------------ | -------- | --------------- | --------------------- |
| Active listing completeness          | >= 98%   | < 95%           | Inventory Lead        |
| Duplicate detection unresolved > 48h | 0        | > 3 cases       | Data Governance Owner |
| Lead first human response            | < 10 min | > 20 min avg    | Leasing Manager       |
| Viewing-to-offer conversion          | >= 25%   | < 18%           | Sales/Leasing Lead    |
| Lease renewal conversion             | >= 75%   | < 65%           | Leasing Operations    |
| Emergency maintenance action start   | < 2h     | > 3h avg        | Maintenance Manager   |
| Landlord statement punctuality       | >= 99%   | < 97%           | Finance Ops           |
| Tenant CSAT                          | > 4.6/5  | < 4.3/5         | Service Quality Owner |

---

## 9) Risk Register and Contingency Actions

| Risk                         | Trigger                         | Impact                        | Contingency                                                |
| ---------------------------- | ------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| Comp data staleness          | > 30% listings with stale comps | Mispricing, slower conversion | Emergency comp refresh sweep + temporary pricing guardrail |
| SLA degradation              | 3 consecutive days breach       | Reputation + churn            | Activate surge staffing and manager triage queue           |
| Legal notice inconsistency   | Cross-doc conflict detected     | Compliance exposure           | Immediate legal taxonomy lock + compliance signoff         |
| Inventory data quality drift | Completeness below threshold    | Operational inefficiency      | Freeze new activations pending data remediation            |

---

## 10) Governance and Reporting

- This playbook is reviewed monthly.
- KPI dashboard is presented to executive leadership weekly.
- Any policy changes require cross-functional signoff (Strategy, Operations, Compliance).

---

## 11) Acceptance Criteria

- [ ] DAMAC Hills 2 segmentation is fully defined and mapped to operational actions.
- [ ] Inventory positioning logic is measurable and enforced.
- [ ] Lead channel strategy includes SLAs and conversion targets per segment.
- [ ] Service overlays (leasing, renewal, maintenance, dispute) are complete and actionable.
- [ ] Comp methodology and refresh cadence are explicit and auditable.
- [ ] KPI section includes thresholds, owners, and escalation paths.
- [ ] No TODO placeholders remain.

---

## 12) Linkage Map

- Inventory governance: `business_docs/09_crm_features/sentinel-property.md`
- Leasing operations: `business_docs/04_workflows/leasing-support-operations-playbook.md`
- Maintenance operations: `business_docs/09_crm_features/maintenance.md`
- Tenancy legal flows: `business_docs/09_crm_features/tenancy-ejari.md`
- Legal controls: `business_docs/09_crm_features/legal-management.md`
