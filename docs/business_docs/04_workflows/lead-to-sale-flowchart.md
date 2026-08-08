# Lead-to-Sale & Lead-to-Lease Workflow Flowcharts

<!-- markdownlint-disable MD022 MD024 MD040 MD060 -->

> **Version:** 1.0  
> **Last Updated:** August 2026  
> **Owner:** Sales Department (Clara + Sophia)
> **Priority Scope:** MD + Leasing Agent first for listing, leasing execution, and receipt continuity.

---

## Priority Persona Overlay (P0)

### Priority personas

- **MD (`owner`)**: owns executive controls, high-value approvals, and policy escalations.
- **Leasing Agent (`leasing_agent`)**: first-agent owner for lead-to-lease continuity.

### First-agent validation profile

- **Reference account:** `agent.one.whitecaves@gmail.com`
- **Expected lifecycle:** lead ingest → qualification → viewing → lease agreement → Ejari → payment/receipt operations.

### P0 SLA overlays

| Stage | Primary role | SLA expectation |
|-------|--------------|-----------------|
| First contact for hot leasing leads | Leasing Agent | ≤ 2 hours |
| Viewing arrangement post-qualification | Leasing Agent | ≤ 3 days |
| Lease/Ejari transition once approved | Leasing Agent | same operational cycle |
| Receipt after payment confirmation | Finance/System + Leasing Agent | ≤ 30 minutes to delivery |

---

## Workflow 1: Lead-to-Sale

### Overview
Full workflow from the moment a lead enters the system through qualification, property viewing, offer, contract, payment, and deal closure.

```
┌─────────────────────────────────────────────────────────────┐
│           LEAD-TO-SALE WORKFLOW (Duration: 4–5 Weeks)       │
└─────────────────────────────────────────────────────────────┘

[ENTRY POINTS]
│
├── WhatsApp Inquiry ──→ Nina Bot auto-response (< 10 sec)
├── Website Form ──────→ Auto-lead created in Clara
├── Portal Lead ───────→ Webhook → Auto-lead in Clara
├── Walk-in / Call ────→ Agent manually creates lead
└── Referral ──────────→ Agent manually creates lead
        │
        ▼
┌──────────────────┐
│  LEAD CREATED    │  Score: auto-calculated
│  Status: NEW     │  Assignment: round-robin or manual
└──────────────────┘
        │
        ▼ (within 2 hours for Hot leads)
┌──────────────────┐
│   FIRST CONTACT  │  Agent calls or WhatsApp messages
│  Status: CONTACTED│  Log activity → update score
└──────────────────┘
        │
        ├─── No response after 3 attempts ──→ Mark "Dormant" (auto-alert after 8 days)
        │
        ▼
┌──────────────────┐
│  QUALIFICATION   │  Collect: Budget, Timeline, Location, Type
│  Status: QUALIFIED│  BANT check complete
│                  │  Score ≥ 60 required to progress
└──────────────────┘
        │
        ├─── Budget too low / No need ──→ Mark "Lost" (reason required)
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  PROPERTY MATCHING (AI-powered)                              │
│  Mary (Inventory) filters available units by:               │
│  - Budget range (±15%)                                       │
│  - Property type preference                                  │
│  - Bedroom count                                             │
│  - Community/neighbourhood                                   │
│  ─────────────────────────────────────────────────────────  │
│  Results sent to client via WhatsApp (photos + video links) │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────┐
│   VIEWING        │  Appointment scheduled (calendar sync)
│  Status: VIEWING │  Reminders: 24h + 1h before
└──────────────────┘
        │
        ├─── Client decides: Not interested ──→ Ask for feedback → "Lost" or re-match
        │
        ▼
┌──────────────────┐
│   OFFER MADE     │  Offer price recorded in Sophia Pipeline
│  Status: OFFERED │  Linked to specific property
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  NEGOTIATION     │  Counter-offers tracked in transaction record
│  Status:         │  Manager notified for offers < asking price - 10%
│  NEGOTIATING     │
└──────────────────┘
        │
        ├─── No agreement ──→ "Lost" + reason logged
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  OFFER ACCEPTED                                              │
│  ─────────────────────────────────────────────────────────  │
│  KYC Verification (MANDATORY — Laila)                        │
│  ├── Passport / Emirates ID collected                        │
│  ├── Source of funds documented (if AED > 55,000)           │
│  └── KYC status must = "Verified" to proceed                │
│  ─────────────────────────────────────────────────────────  │
│  DLD Fees calculated and disclosed                           │
│  ├── Transfer fee: 4% of price                              │
│  ├── DLD admin: AED 580                                      │
│  └── Broker commission: 2% of price                         │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────┐
│  CONTRACT SIGNED │  MOU / SPA generated from template
│  Status: CONTRACT│  Both parties sign (digital or wet)
│  _SIGNED         │  Documents uploaded and stored
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  PAYMENT         │  Cheque or bank transfer tracked
│  Status: PAYMENT │  Escrow record created
│  _PENDING        │  Stripe (if online)
└──────────────────┘
        │
        ├─── Payment fails ──→ Alert Finance Director (Theodora) + 7-day grace period
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  DEAL CLOSED                                                  │
│  Status: CLOSED                                              │
│  ─────────────────────────────────────────────────────────  │
│  • Property status → "Sold"                                  │
│  • Commission record created (status: Pending)               │
│  • DLD reference number recorded                             │
│  • Lead status → "Won"                                       │
│  • Congratulations notification to agent                     │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│  COMMISSION WORKFLOW (Theodora)                              │
│  ─────────────────────────────────────────────────────────  │
│  Day 0:  Commission record created (Pending)                 │
│  Day 1–3: Sales Manager reviews → Approves/Rejects          │
│  Day 3–5: Finance Director processes payment                 │
│  Day 5:  Commission paid → Agent notified                   │
│  Day 6:  Commission report sent to agent                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Workflow 2: Lead-to-Lease

### Overview
Rental workflow from lead capture through tenant vetting, lease agreement, Ejari registration, and ongoing tenancy.

```
┌─────────────────────────────────────────────────────────────┐
│         LEAD-TO-LEASE WORKFLOW (Duration: 1–3 Weeks)        │
└─────────────────────────────────────────────────────────────┘

[ENTRY POINTS] — Same as Sale workflow
        │
        ▼
[LEAD QUALIFICATION — Focus on rental requirements]
│ - Budget: monthly rent range
│ - Required: bedrooms, furnishing preference
│ - Duration: short-term / long-term
│ - Move-in date
│ - Employment status (for tenancy approval)
        │
        ▼
[PROPERTY MATCHING]
│ Mary (Inventory) filters available rental units
│ Status = "Available" and listed for lease
        │
        ▼
[VIEWING + AGENT ACCOMPANIMENT]
        │
        ▼
[TENANT APPLICATION]
│ Daisy (Leasing) creates Tenant Application record
│ ─────────────────────────────────────────────────────────
│ Documents required:
│ ├── Passport (front/back)
│ ├── UAE Residence Visa
│ ├── Emirates ID (front/back)
│ ├── 3 months bank statements (or salary certificate)
│ └── Employment letter (for employed tenants)
│     OR Trade license (for self-employed/company)
        │
        ▼
[KYC REVIEW — Laila Compliance]
│ ├── Verify identity documents
│ ├── AML risk assessment
│ ├── PEP / Sanctions screening
│ └── Approve or Reject application
        │
        ├─── Application Rejected ──→ Tenant notified with reason
        │
        ▼
[LANDLORD APPROVAL]
│ Landlord reviews tenant profile (via portal or email summary)
│ Approves / Requests more info / Rejects
        │
        ▼
[LEASE AGREEMENT GENERATION]
│ Auto-populated from:
│ ├── Property details (address, unit number, type)
│ ├── Tenant details (full name, ID number)
│ ├── Landlord details
│ ├── Lease terms (start/end date, monthly rent)
│ └── Security deposit amount (min 1 month rent)
│
│ Lease reviewed by leasing manager
│ Sent to both parties for e-signature
        │
        ▼
[LEASE SIGNED]
│ Both parties sign (DocuSign or wet signature uploaded)
│ Lease status → "Signed"
│ Ejari registration triggered (checklist created for agent)
        │
        ▼
[EJARI REGISTRATION — MANDATORY]
│ ├── Agent submits documents to Ejari portal (or typing centre)
│ ├── Ejari contract number received (AED 175–220 fee)
│ ├── Ejari number entered in system
│ └── Lease status → "Active"
│
│ Note: Ejari required for DEWA activation, visa, school enrollment
        │
        ▼
[TENANT ONBOARDING]
│ ├── Key handover appointment scheduled
│ ├── DEWA transfer initiated (tenant responsibility)
│ ├── Welcome message sent via WhatsApp (Nina bot)
│ └── First rent due date notification sent
        │
        ▼
[ONGOING LEASE MANAGEMENT — Daisy + Theodora]
│ Monthly: Rent collection (see Rental Collection Workflow)
│ 60 Days before expiry: Renewal reminder created
│ Any time: Maintenance requests via WhatsApp
│ Payment confirmed: receipt issued + delivered + archived
        │
        ▼
[LEASE RENEWAL or EXPIRY]
│ Renew: New lease terms agreed → New Ejari registration
│ Expiry: Move-out inspection → Security deposit return
│         Ejari cancellation processed
```

---

## Workflow 3: Pipeline Stage Definitions

| Stage | Description | SLA | KPI |
|-------|-------------|-----|-----|
| New | Lead just entered the system | Contact within 2h (Hot) / 24h (Warm) | First contact rate |
| Contacted | First agent contact made | Follow-up within 48h | Contact-to-qualify rate |
| Qualified | BANT confirmed, score ≥ 60 | Property list within 2 days | Qualification rate |
| Viewing | Property viewing scheduled | Viewing within 7 days of qualification | Viewing-to-offer rate |
| Offered | Formal offer submitted | Offer response within 48h | Offer-to-close rate |
| Negotiating | Counter-offers in progress | Resolution within 7 days | Negotiation win rate |
| Won | Deal closed | Commission paid within 5 days | Conversion rate |
| Lost | Deal failed | Loss reason mandatory | Loss analysis |

### Receipt control note (Lead-to-Lease)

- Receipt generation is a mandatory completion control for payment-related tenant events.
- Leasing Agent must verify delivery status and follow up on failed delivery attempts.
- MD must have dashboard visibility into receipt SLA breaches and unresolved exceptions.

---

## Workflow 4: Agent Performance SLAs

| Activity | Hot Lead | Warm Lead | Cold Lead |
|----------|----------|-----------|-----------|
| First contact | ≤ 2 hours | ≤ 24 hours | ≤ 72 hours |
| Property list sent | ≤ 4 hours after qualify | ≤ 24 hours | ≤ 48 hours |
| Viewing arranged | ≤ 3 days | ≤ 7 days | ≤ 14 days |
| Offer submitted | Same day as viewing | ≤ 48 hours | ≤ 7 days |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Owner:** Sales Department
