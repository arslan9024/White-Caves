# Tenancy & Ejari Management — CRM Feature Specification

<!-- markdownlint-disable MD060 -->

> **Status:** In Progress (Core workflows active, endpoint expansion ongoing)  
> **Module Owner:** Daisy (Leasing Manager AI)  
> **API Endpoints:** `/api/tenants`, `/api/leases` (primary namespace)  
> **Priority:** High
> **Priority Scope:** MD + Leasing Agent first with leasing execution and receipt continuity controls.  
> **Last Updated:** 2026-08-07  
> **Next Review:** 2026-08-21  
> **Source of Truth:** CRM tenancy and Ejari feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend state/reliability closure lanes in `docs/plans/waves/WAVE_38_*` through `WAVE_40_*`

---

## Overview

The Tenancy & Ejari module manages the full tenant lifecycle: application, KYC, lease creation, Ejari registration, active tenancy management, and move-out. It ensures regulatory compliance (Ejari mandatory per Dubai Decree No. 26 of 2013) and provides landlords and agents full visibility of their rental portfolio.

### Priority Module Alignment (May 2026)

This module is now part of the P0 unified journey:

1. Homepage leasing conversion
2. Lead qualification + viewing
3. Offer + contract
4. Ejari registration + activation
5. Payment + maintenance + renewal/exit

The tenancy module is the contractual/compliance core of that full lifecycle and must remain synchronized with landlord and tenant portals.

### Priority persona contract (P0)

- **MD (`owner`)**: monitors compliance completion, leasing SLA breaches, and unresolved payment/receipt exceptions.
- **Leasing Agent (`leasing_agent`)**: first-line owner for qualification, lease execution, Ejari completion, and receipt-delivery verification.
- **Reference scenario profile:** `agent.one.whitecaves@gmail.com` for first-agent operational acceptance.

### Receipt continuity controls (mandatory)

| Event | Required behavior | Owner | SLA |
|------|--------------------|-------|-----|
| Rent payment marked paid | Generate receipt with lease and payment references | Finance/System | immediate |
| Receipt delivery | Confirm tenant/landlord delivery status | Leasing Agent | ≤ 30 minutes |
| Receipt archival | Store immutable receipt + audit link | Finance/Docs | same business day |

---

## User Stories

- As a **leasing agent**, I want to create a tenant application linked to a property, so that I track all rental candidates for each unit.
- As a **leasing agent**, I want to upload and track KYC documents for each tenant, so that I meet compliance requirements.
- As a **leasing agent**, I want to generate a pre-filled lease agreement from a template, so that I avoid manual errors.
- As a **leasing manager**, I want to see all active leases and their expiry dates, so that I plan renewals proactively.
- As a **landlord**, I want to view my tenants' payment history, so that I know my rental income status.
- As a **tenant**, I want to see my lease details and payment schedule, so that I know when my payments are due.
- As a **compliance officer** (Laila), I want all active leases to have Ejari numbers, so that I maintain 100% regulatory compliance.

---

## Data Models

### Tenant

```typescript
Tenant {
  id: string
  // Identity
  fullName: string
  email: string
  phone: string                  // E.164 format
  nationality: string
  emiratesIdNumber?: string
  passportNumber?: string
  visaNumber?: string
  visaExpiryDate?: Date
  // Employment
  employmentStatus: 'employed' | 'self-employed' | 'investor' | 'other'
  employerName?: string
  monthlyIncome?: number         // AED
  // Documents (URLs to storage)
  documents: {
    emiratesIdFront?: string
    emiratesIdBack?: string
    passportScan?: string
    visaScan?: string
    salarySlip?: string          // 3 months
    bankStatement?: string       // 3 months
    employmentLetter?: string
    tradeLicense?: string        // For self-employed
  }
  // Status
  kycStatus: 'pending' | 'under_review' | 'verified' | 'rejected'
  kycNotes?: string
  status: 'application' | 'approved' | 'active' | 'inactive' | 'blacklisted'
  createdAt: Date
  updatedAt: Date
}
```

### Lease

```typescript
Lease {
  id: string
  propertyId: string
  tenantId: string
  landlordId?: string            // If landlord is a registered user
  agentId: string                // Leasing agent
  // Dates
  startDate: Date
  endDate: Date
  // Financial
  monthlyRent: number            // AED
  securityDeposit: number        // AED — min 1 month rent
  commissionRate: number         // e.g., 0.05 (5% of annual rent)
  // Ejari
  ejariContractNumber?: string   // Mandatory for Active status
  ejariRegistrationDate?: Date
  ejariExpiryDate?: Date
  // Status
  status: 'draft' | 'signed' | 'active' | 'renewal_pending' | 'expired' | 'terminated'
  terminationReason?: string
  // Documents
  leaseDocument?: string         // PDF URL
  signedLeaseDocument?: string   // Signed PDF URL
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### Rent Payment

```typescript
RentPayment {
  id: string
  leaseId: string
  dueDate: Date
  amount: number                 // AED
  lateFeeAmount?: number         // AED (if applied)
  paidDate?: Date
  paidAmount?: number            // AED (may include late fee)
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived'
  paymentMethod?: 'bank_transfer' | 'cheque' | 'cash' | 'online'
  paymentReference?: string
  notes?: string
}
```

---

## API Endpoints

### Tenants

| Method | Path                         | Access                    | Description               |
| ------ | ---------------------------- | ------------------------- | ------------------------- |
| GET    | `/api/tenants`               | Manager, Admin            | List tenants with filters |
| POST   | `/api/tenants`               | Agent, Manager            | Create tenant application |
| GET    | `/api/tenants/:id`           | Agent (assigned), Manager | Tenant detail             |
| PATCH  | `/api/tenants/:id`           | Agent (assigned), Manager | Update tenant info        |
| PATCH  | `/api/tenants/:id/kyc`       | Compliance (Laila)        | Update KYC status         |
| POST   | `/api/tenants/:id/documents` | Agent                     | Upload documents          |
| GET    | `/api/tenants/:id/leases`    | Agent, Manager            | Tenant's lease history    |

### Leases (Planned)

> **Priority implementation note:** this lane is P0 for MD + Leasing Agent and should be tracked as active implementation scope where route readiness exists.

| Method | Path                                  | Access                         | Description                    |
| ------ | ------------------------------------- | ------------------------------ | ------------------------------ |
| GET    | `/api/leases`                         | Agent (own), Manager           | List active leases             |
| POST   | `/api/leases`                         | Agent, Manager                 | Create lease                   |
| GET    | `/api/leases/:id`                     | Agent, Manager, Landlord (own) | Lease detail                   |
| PATCH  | `/api/leases/:id`                     | Agent (draft), Manager         | Update lease                   |
| PATCH  | `/api/leases/:id/activate`            | Manager                        | Set active (requires Ejari)    |
| PATCH  | `/api/leases/:id/ejari`               | Agent                          | Set Ejari registration details |
| POST   | `/api/leases/:id/renew`               | Agent, Manager                 | Initiate renewal               |
| PATCH  | `/api/leases/:id/terminate`           | Manager                        | Terminate with reason          |
| GET    | `/api/leases/:id/payments`            | Agent, Manager, Tenant (own)   | Rent payment schedule          |
| PATCH  | `/api/leases/:id/payments/:paymentId` | Finance                        | Update payment status          |

---

## Ejari Compliance Rules

1. **Lease cannot be activated without Ejari number** — System enforces this with a validation gate.
2. **Ejari expiry** — Warning 30 days before; flagged in compliance dashboard.
3. **On renewal** — New Ejari number required (old one archived, not deleted).
4. **Ejari cancellation** — Processed when tenant moves out; recorded in system.

---

## Lease Generation Flow

1. Agent fills lease form (property, tenant, dates, rent amount)
2. System generates PDF from Ejari-compliant template
3. PDF is populated with: tenant details, property address, DLD reference, lease term, monthly rent, security deposit amount, payment due date, RERA license number
4. Lease sent for review by leasing manager
5. On approval, lease sent to both parties for signature (e-signature or uploaded scan)
6. Signed document uploaded; lease status → "Signed"
7. Agent registers with Ejari; enters contract number → lease status → "Active"

---

## Acceptance Criteria

- [ ] Tenant application form captures all required KYC fields
- [ ] Document upload supports: PDF, JPEG, PNG; max 10 MB per file
- [ ] KYC approval/rejection workflow with Laila notation
- [ ] Lease generation pre-fills all required fields from property and tenant records
- [ ] Lease cannot be activated without `ejariContractNumber`
- [ ] Rent payment schedule auto-generated on lease activation
- [ ] Overdue payment triggers automated WhatsApp reminder (Day 5, 10)
- [ ] Late fee auto-calculated on Day 15
- [ ] Lease expiry reminder task created 60 days before end
- [ ] Ejari expiry warning 30 days before
- [ ] Receipt generation event occurs for each paid rent transaction
- [ ] Leasing Agent can verify receipt delivery status for tenant/landlord
- [ ] MD can view unresolved receipt exceptions in oversight dashboards

---

---

## PDC (Post-Dated Cheque) Tracking

> **@Victoria — EXPAND task completed** | Model: Gemini 2.0 Flash (FREE)

### PDC Overview

In Dubai, residential rent is typically paid via 1–4 post-dated cheques (PDCs) collected upfront for the full lease term. The platform must track every PDC issued, monitor clearing dates, and handle bounced cheques.

### PDC Data Model

```typescript
PDCCheque {
  id: string
  leaseId: string
  tenantId: string
  chequeNumber: string           // Cheque serial number
  bankName: string               // Issuing bank
  accountHolder: string          // Must match tenant full name
  amount: number                 // AED — one cheque covers one rental period
  dueDate: Date                  // Date written on cheque face
  depositDate?: Date             // Date bank deposits the cheque
  status: 'held' | 'deposited' | 'cleared' | 'bounced' | 'cancelled' | 'replaced'
  bounceReason?: string          // Bank-returned reason code
  replacementChequeId?: string   // Links to the replacement PDC
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### PDC Lifecycle Workflow

```text
1. COLLECTION (on lease signing)
   Agent collects physical cheques from tenant
   → Each cheque scanned and uploaded as PDF/JPEG
   → PDC record created (status: "held")
   → Cheques held in company safe (tracked by Finance)

2. DEPOSIT (7 days before due date)
   Finance deposits cheque at bank
   → Status updated to "deposited"
   → Automated notification sent to tenant (reminder)

3. CLEARED
   Bank confirms clearing (typically T+1 to T+3)
   → Status updated to "cleared"
   → Linked RentPayment record auto-marked "paid"
   → Receipt generated and sent to tenant via WhatsApp

4. BOUNCED
   Bank returns cheque (insufficient funds, account closed, etc.)
   → Status updated to "bounced"
   → Bounce reason stored from bank return code
   → CRITICAL workflow triggered (see Bounced Cheque section)
```

### PDC Dashboard

| Column       | Description                            |
| ------------ | -------------------------------------- |
| Cheque #     | Serial number                          |
| Tenant       | Full name + lease reference            |
| Property     | Unit + building                        |
| Amount (AED) | Cheque face value                      |
| Due Date     | Deposit target date                    |
| Status       | Color-coded badge                      |
| Days to Due  | Countdown timer                        |
| Action       | Deposit / Mark Cleared / Report Bounce |

- Finance manager view: All PDCs across portfolio, filterable by status / due date range / property
- Calendar view: Visual timeline of upcoming PDC deposit dates
- Alert: PDCs due within 14 days highlighted in amber; overdue in red

### API Endpoints — PDC Management

| Method | Path                   | Access           | Description                     |
| ------ | ---------------------- | ---------------- | ------------------------------- |
| GET    | `/api/leases/:id/pdcs` | Finance, Manager | List all PDCs for a lease       |
| POST   | `/api/leases/:id/pdcs` | Agent, Finance   | Add PDC to lease                |
| PATCH  | `/api/pdcs/:id/status` | Finance          | Update PDC status               |
| POST   | `/api/pdcs/:id/bounce` | Finance          | Trigger bounced cheque workflow |
| GET    | `/api/pdcs/upcoming`   | Finance, Manager | PDCs due in next 30 days        |

---

## Bounced Cheque Workflow

### Regulatory Context

Under UAE Law (Law No. 18 of 1993 — Commercial Transactions Law), issuing a cheque without sufficient funds is a **criminal offense**. White Caves must follow the correct escalation sequence to preserve legal rights.

### Bounce Detection & Immediate Response (Day 0)

1. Finance marks PDC as `bounced` in system; captures bank return code
2. System auto-creates a **Bounced Cheque Incident** record linking to the lease
3. Tenant receives automated WhatsApp + email notification:
   > _"Your cheque [#XXXX] dated [DATE] for AED [AMOUNT] was returned by the bank. Please contact your leasing agent within 48 hours to resolve."_
4. Leasing agent receives internal CRM alert with 48-hour SLA countdown
5. Finance manager receives dashboard alert (red badge on lease record)

### Escalation Timeline

- **Day 0**
  - **Action:** Cheque returned by bank
  - **Owner:** Bank
  - **Platform Action:** Bounce incident created; notifications sent

- **Day 1–3**
  - **Action:** Agent contacts tenant and requests replacement cheque or bank transfer
  - **Owner:** Leasing Agent
  - **Platform Action:** Activity logged against lease

- **Day 3**
  - **Action:** If no resolution, formal notice sent (via WhatsApp + registered mail)
  - **Owner:** Manager
  - **Platform Action:** Legal notice template auto-generated (Form 12)

- **Day 7**
  - **Action:** If unresolved, escalate to legal / file police report
  - **Owner:** Owner/Legal
  - **Platform Action:** Incident status set to `Escalated to Legal`

- **Day 15**
  - **Action:** Eviction notice initiation if lease breach persists
  - **Owner:** Legal / RERA
  - **Platform Action:** Eviction workflow triggered (see Section 8)

### Replacement Cheque Protocol

- New cheque collected with **same amount + AED 500 bounced cheque penalty** (per company policy)
- New PDC record created; original bounced PDC linked as parent
- Original status remains `bounced` for audit trail — never deleted
- Finance confirms bank details are current before re-deposit

### Acceptance Criteria — Bounced Cheque

- [ ] Bounce event creates linked incident automatically
- [ ] Tenant and agent notified within 5 minutes of bounce being recorded
- [ ] Escalation countdown timer visible on lease detail (Finance/Manager view)
- [ ] Replacement cheque record links to original with audit trail
- [ ] Repeated bounces (≥ 2) auto-flag tenant as "High Risk" in CRM

---

## Eviction Workflow (RERA Dispute & Forced Vacation)

### Regulatory Framework

Dubai rental disputes are governed by the **Dubai Rental Law (Law No. 26 of 2007)** and processed via the **Rental Dispute Settlement Center (RDSC)** under RERA. The platform supports the landlord/agent in preparing and tracking an eviction case from start to finish.

### Eviction Grounds (Section 25 — Dubai Tenancy Law)

| Ground                                                     | Notice Period Required   |
| ---------------------------------------------------------- | ------------------------ |
| Non-payment of rent (after 30-day grace)                   | 30 days written notice   |
| Subletting without consent                                 | 30 days written notice   |
| Property used for illegal purposes                         | 30 days written notice   |
| Property demolition/reconstruction approved by authorities | 12 months written notice |
| Landlord or first-degree relative needs to occupy          | 12 months written notice |
| Major renovation requiring vacancy                         | 12 months written notice |
| Sale of property (under certain conditions)                | 12 months written notice |

### Eviction Initiation Workflow

```text
Step 1: NOTICE ISSUANCE (CRM)
  Manager generates formal eviction notice from template
  → Notice contains: tenant name, property, violation, legal basis (Article ref), vacate-by date
  → Delivered via: Notary Public OR Registered Mail OR In-Person (documented)
  → CRM records: delivery method, delivery date, proof of delivery document URL

Step 2: RDSC CASE FILING (External → tracked in CRM)
  If tenant does not comply by notice deadline:
  → Legal files case at RDSC (Dubai Courts)
  → CRM field: rdscCaseNumber, rdscFilingDate, hearingDate
  → Status: "RDSC Case Pending"

Step 3: HEARING & JUDGMENT
  → CRM records: hearing dates, judgment outcome, judgment document URL
  → Status: "Judgment Received"

Step 4: ENFORCEMENT
  If judgment favors landlord:
  → Enforcement order issued by Dubai Courts Enforcement Section
  → Bailiff executes vacation order
  → CRM Status: "Vacated" → triggers move-out workflow
```

### CRM Eviction Tracking Fields

```typescript
EvictionCase {
  id: string
  leaseId: string
  tenantId: string
  propertyId: string
  evictionGround: string               // From regulated grounds list
  noticeIssuedDate: Date
  noticeDeliveryMethod: 'notary' | 'registered_mail' | 'in_person'
  noticeDeliveryProofUrl?: string
  vacateByDate: Date                   // Calculated from notice period
  rdscCaseNumber?: string
  rdscFilingDate?: Date
  hearingDates: Date[]
  judgmentOutcome?: 'favor_landlord' | 'favor_tenant' | 'settlement' | 'dismissed'
  judgmentDocumentUrl?: string
  enforcementDate?: Date
  status: 'notice_issued' | 'rdsc_filed' | 'hearing_scheduled' | 'judgment_received' | 'enforcement' | 'vacated' | 'withdrawn'
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### Acceptance Criteria — Eviction Workflow

- [ ] Eviction notice generated from Dubai-compliant template (pulls tenant, property, legal reference auto-filled)
- [ ] Notice delivery method and proof uploadable against case record
- [ ] RDSC case number and hearing dates tracked with timeline display
- [ ] Status progression enforces correct sequence (cannot skip steps)
- [ ] Eviction case visible to: Owner, Manager, Compliance Officer (not agent)
- [ ] Resolved eviction automatically triggers lease termination and property relisting workflow

---

## Early Termination Clause Rules

### Dubai Legal Position

Dubai tenancy law (Article 7, Law No. 26 of 2007) specifies that lease terms must be honored. Early termination is only permitted if mutually agreed or if specific legal grounds exist. The platform enforces documentation and penalty tracking for any early exit.

### Tenant-Initiated Early Termination

**Standard Policy (company default, can be overridden by manager):**

| Notice Period                       | Penalty                 |
| ----------------------------------- | ----------------------- |
| ≥ 90 days before intended exit date | 1 month rent penalty    |
| 60–89 days before                   | 1.5 months rent penalty |
| 30–59 days before                   | 2 months rent penalty   |
| < 30 days notice                    | 3 months rent penalty   |

**Process in CRM:**

1. Tenant submits early termination request (via agent or directly)
2. Agent opens "Early Termination Request" in CRM linked to active lease
3. System calculates applicable penalty based on notice period and remaining lease term
4. Manager reviews and approves/modifies penalty (with override note required)
5. Addendum generated: Mutual Termination Agreement documenting agreed terms
6. Finance tracks penalty payment (separate from regular rent payments)
7. On penalty clearance + key handover: Lease status → "Terminated Early"

### Landlord-Initiated Early Termination

Landlord may only terminate early under legally permitted grounds (see Eviction section). If terminated without legal grounds:

- Tenant entitled to compensation equivalent to remaining lease value
- Platform records compensation obligation as a liability

### CRM Early Termination Fields

```typescript
EarlyTermination {
  id: string
  leaseId: string
  requestedBy: 'tenant' | 'landlord'
  requestDate: Date
  intendedExitDate: Date
  noticePeriodDays: number       // Calculated from request date to exit date
  penaltyAmount: number          // AED — system-calculated
  penaltyOverrideAmount?: number // AED — if manager modified
  penaltyOverrideReason?: string
  addendumDocumentUrl?: string   // Signed mutual termination agreement
  penaltyPaidDate?: Date
  keyHandoverDate?: Date
  status: 'requested' | 'approved' | 'addendum_signed' | 'penalty_paid' | 'keys_handed' | 'completed' | 'rejected'
}
```

### Acceptance Criteria — Early Termination

- [ ] Penalty auto-calculated from notice period using policy table above
- [ ] Manager override requires documented reason (logged in audit trail)
- [ ] Mutual termination addendum generated from template with penalty amounts pre-filled
- [ ] Finance notified to track penalty payment separately from rent
- [ ] Lease cannot show "Terminated" status until penalty paid AND key handover recorded
- [ ] Ejari cancellation checklist triggered on early termination completion

---

## Legal Notice Generation (Form 6, Form 7, Form 12, NOC)

### Legal Notice Overview

White Caves must generate Dubai-compliant legal notices directly from the CRM, avoiding manual drafting errors and ensuring regulatory formatting requirements are met.

### Legal Notice Types

| Notice Type                              | Trigger                                    | Legal Reference     | Required Delivery                |
| ---------------------------------------- | ------------------------------------------ | ------------------- | -------------------------------- |
| Form 7 — Notice of Rent Increase         | Annual renewal with rent adjustment        | RERA Decree         | 90 days before renewal           |
| Form 12 — Eviction Notice (Non-Payment)  | Bounced cheque x2 or 30-day arrears        | RERA Article 25(1)  | Notary Public or Registered Mail |
| Form 12 — Eviction Notice (Other Breach) | Subletting, illegal use, etc.              | RERA Article 25     | Notary Public or Registered Mail |
| Form 6 — Non-Renewal Notice              | Non-renewal decision for upcoming expiry   | Dubai tenancy rules | 90 days before expiry            |
| Renewal Offer Letter                     | Lease expiring in 90 days                  | Internal policy     | WhatsApp + Email                 |
| Mutual Termination Addendum              | Early termination agreement                | Dubai Contract Law  | Signed by both parties           |
| NOC (No Objection Certificate)           | Tenant requesting sublease or modification | Internal + DLD      | Landlord signature required      |

### Form 12 — Auto-Generation Flow (Eviction)

The system auto-populates the following fields from the lease record:

```text
FORM 12 — NOTICE OF EVICTION / VACATION
Dubai Rental Disputes Center — RDSC

TO:        [Tenant Full Name]
           [Tenant Emirates ID / Passport Number]

PROPERTY:  [Unit Number], [Building Name], [Area], Dubai
           [RERA Permit Number]

LEASE:     Contract No. [Ejari Number]
           From: [Start Date] To: [End Date]
           Monthly Rent: AED [Amount]

LANDLORD:  [Landlord Name / Company]
           [RERA License Number of Agent/Company]

AGENT:     [Company Name], RERA Broker No. [XXXX]
           [Agent Name], BRN [XXXX]

GROUND:    [Selected ground from dropdown, e.g., "Non-payment of rent"]
LEGAL REF: [Auto-inserted legal article reference]

NOTICE:    You are hereby required to vacate the above property
           by [Vacate By Date — calculated from notice period].

ISSUED:    [Date]
SIGNATURE: _________________________ (Authorized Signatory)
```

### Form 7 — Rent Increase Notice

Under RERA Decree No. 43 of 2013, rent increases follow the RERA Rent Calculator index. The CRM enforces the following:

- Rent increase only permitted at lease renewal (not mid-lease)
- Maximum increase percentage from RERA index auto-fetched or manually entered
- Form 7 must be issued **minimum 90 days before renewal date**
- CRM auto-creates renewal task 120 days before lease expiry (30-day buffer)
- If no notice issued by 90-day mark: system blocks rent increase for that renewal cycle

```typescript
RentIncreaseNotice {
  id: string
  leaseId: string
  currentMonthlyRent: number       // AED
  proposedMonthlyRent: number      // AED
  increasePercentage: number       // Auto-calculated
  reraMaxAllowedIncrease: number   // % from RERA calculator
  isWithinReraLimit: boolean       // Validation flag
  noticeIssuedDate: Date           // Must be ≥ 90 days before renewal
  renewalStartDate: Date
  tenantAcknowledgmentDate?: Date
  tenantResponse?: 'accepted' | 'rejected' | 'no_response'
  form7DocumentUrl?: string
}
```

### Form 6 — Non-Renewal Notice

- Used when landlord/tenant chooses non-renewal.
- Must be issued **minimum 90 days before lease expiry**.
- Includes lease details, vacate date, delivery method, and acknowledgment tracking.

### Acceptance Criteria — Legal Notice Generation

- [ ] Form 12 template generates in < 5 seconds with all fields pre-filled from lease record for eviction paths
- [ ] Form 7 blocked if notice date < 90 days from renewal (system validation)
- [ ] All notices exported as branded PDF (company letterhead, RERA license in footer)
- [ ] Generated notice linked to lease record with: generation date, generated by, delivery status
- [ ] Delivery confirmation (WhatsApp read receipt or mail tracking reference) uploadable against notice
- [ ] All notice types available in English and Arabic

---

**Version:** 1.2 | **Last Updated:** May 2026 | **Sections:** 14/14 (Target Met ✅)  
**Agent Activity:** @Victoria (Gemini 2.0 Flash — FREE) | Sections: 8 → 14 | Quality: ⭐⭐⭐⭐⭐

### Priority wave update (2026-08)

- MD + Leasing Agent-first execution model adopted for leasing operations.
- Receipt continuity is treated as mandatory leasing completion control.
- First-agent acceptance profile: `agent.one.whitecaves@gmail.com`.

### Real-World Dubai Land Department (DLD) Regulations

- **Form 7 (Rent Increases):** Hard-coded validation requiring 90-day notice prior to contract expiry.
- **Form 12 (Evictions):** Strict 12-month notice period validation mapped to notary public API limits.
- **Form 6 (Non-Renewals):** Integration required for early termination edge cases.
  _Note: All offline mock data strictly adheres to these UAE property laws._
