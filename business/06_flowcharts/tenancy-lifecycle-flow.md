# Tenancy Lifecycle Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-TENANCY-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Operations Department (Daisy — Leasing & Tenant Manager)
> **Scope:** Full rental lifecycle: inquiry → screening → Ejari → lease → payments → renewal/termination

---

## 1. Tenancy Lifecycle Overview

```
  Tenant Inquiry
       │
       ▼
  Viewing / Qualification
       │
       ▼
  Tenancy Offer & Negotiation
       │
       ▼
  KYC / Document Collection
       │
       ▼
  Lease Agreement Signing
       │
       ▼
  Ejari Registration (DLD)
       │
       ▼
  Move-in / Handover
       │
       ▼
  Rent Collection (monthly / cheques)
       │
       ▼
  Maintenance & Support
       │
       ├── Renewal Negotiation (60 days before expiry)
       │        │
       │        ├── Renewed → New lease, Ejari update
       │        └── Not renewed → Vacate notice
       │
       └── Early Termination → Break clause / penalty
```

---

## 2. Tenant Inquiry & Qualification

```
Tenant inquires about rental property
(WhatsApp / website / portal / walk-in)
          │
          ▼
  Lead created (source recorded)
  Lead type: RENTAL
  Daisy (AI) assigned for initial qualification
          │
          ▼
  Qualification criteria collected:
  ┌─────────────────────────────────────────────────────┐
  │ Monthly income    │ Must be ≥ 3× monthly rent       │
  │ Employment status │ Employed / self-employed / own biz│
  │ Visa type         │ UAE residence visa required      │
  │ Move-in date      │ Target date                      │
  │ Duration          │ 12 months standard; 6 min        │
  │ Pets / children   │ Community rules check            │
  │ Budget            │ AED/year inclusive of cheques    │
  └─────────────────────────────────────────────────────┘
          │
          ├── Criteria not met → Decline politely, suggest alternative
          │
          ▼
  Viewing scheduled → Appointment model
  (Unit inspection with agent)
```

---

## 3. Tenancy Offer & Negotiation

```
Tenant wants to proceed after viewing
          │
          ▼
  Agent prepares Rental Offer:
  ├── Proposed rent amount (AED/year)
  ├── Number of cheques (1, 2, 4, or 12)
  ├── Tenancy start date
  ├── Security deposit: 5% of annual rent (residential)
  └── Additional terms (parking, utilities, maintenance)
          │
          ▼
  Landlord notified (via WhatsApp + CRM notification)
          │
          ├── Landlord accepts → Proceed to KYC
          ├── Landlord counters → Negotiation round
          └── Landlord declines → Explore alternative
          │
          ▼
  Terms agreed → Verbal confirmation logged in CRM
  Status: OFFER_ACCEPTED
```

---

## 4. KYC / Document Collection

```
Tenancy offer accepted
          │
          ▼
  Required documents from TENANT:
  ┌──────────────────────────────────────────────────────┐
  │ Passport copy (valid ≥ 6 months)                     │
  │ UAE Residence Visa (active)                          │
  │ Emirates ID (front + back)                           │
  │ Salary certificate / Bank statement (3 months)       │
  │ Trade license (if self-employed / company)            │
  │ Previous tenancy NOC (if applicable)                 │
  └──────────────────────────────────────────────────────┘
          │
          ├── Documents missing → Tenant portal upload request sent
          │   Reminder after 24h, 48h, 72h
          │
          ▼
  Agent reviews documents:
  ├── Passport: valid, not expired
  ├── Visa: active, matches name
  ├── Income: sufficient (≥ 3× monthly rent)
  └── AML check: name screened against sanctions list
          │
          ├── Issues found → Request additional docs or decline
          │
          ▼
  Documents stored in:
  ├── CRM tenant record (cloud storage — encrypted)
  └── Tenant portal document vault (accessible by tenant)
          │
          ▼
  Landlord documents (agent holds on file):
  ├── Title deed (proof of ownership)
  ├── RERA registration (if applicable)
  └── POA (if managed by agent on behalf of landlord)
```

---

## 5. Lease Agreement

```
KYC approved
          │
          ▼
  Lease Agreement generated (Phase 2 — PDFKit):
  ┌──────────────────────────────────────────────────────────┐
  │ Parties:      Landlord name, Tenant name                 │
  │ Property:     Full address, RERA permit, unit details    │
  │ Duration:     Start date → End date                      │
  │ Rent:         AED/year, payment schedule, cheque dates   │
  │ Deposit:      AED amount, conditions for refund          │
  │ Maintenance:  Responsibilities (landlord vs tenant)      │
  │ Termination:  Break clause, notice period (90 days)      │
  │ Special terms: Pets, sub-letting, renovations            │
  └──────────────────────────────────────────────────────────┘
          │
          ▼
  Digital signature flow (Phase 7):
  ├── Agent sends lease PDF to tenant via secure link
  ├── Tenant signs digitally (DocuSign / e-signature)
  ├── Landlord countersigns
  └── Final signed PDF stored in both portals
          │
          ▼  [Current Phase 2: Manual signing + PDF upload]
  Lease document uploaded to CRM
  Lease model created in database:
  {
    tenantId, propertyId, agentId, landlordId,
    startDate, endDate, monthlyRent, annualRent,
    depositAmount, depositPaid: false,
    numberOfCheques, status: 'pending_ejari'
  }
```

---

## 6. Ejari Registration (DLD)

```
Lease agreement signed
          │
          ▼
  Ejari registration required by UAE law within 30 days of tenancy start
          │
          ▼
  Agent submits to Ejari portal:
  Required docs for Ejari submission:
  ├── Signed lease agreement
  ├── Tenant passport + visa + Emirates ID
  ├── Landlord title deed
  ├── RERA permit (if managed building)
  └── Security deposit receipt
          │
          ▼
  Ejari registration steps:
  1. Login to Ejari portal (ejari.gov.ae)
  2. New registration → Enter property details
  3. Upload all required documents
  4. Pay registration fee (AED 220 + VAT)
  5. Receive Ejari contract number
  6. Download Ejari certificate (PDF with QR code)
          │
          ▼
  Ejari recorded in CRM:
  lease.ejariNumber = "EJ-XXXXXXXX"
  lease.ejariRegisteredAt = timestamp
  lease.status = 'active'
          │
          ▼
  Ejari certificate available in:
  ├── Tenant portal → Documents section → Download PDF
  └── Landlord portal → Documents section → Download PDF
          │
          ▼
  Lease record finalized:
  ├── Tenant portal access granted (if not already)
  └── Welcome WhatsApp sent to tenant via Nina bot
```

---

## 7. Rent Payment Flow

```
Monthly rent due date approaching (5 days before)
          │
          ▼
  Automated reminder (Phase 2 — cron job):
  ├── Tenant: WhatsApp + email reminder
  └── Agent: CRM notification if cheque not yet deposited
          │
          ▼
  OPTION A: Post-dated cheques (current Dubai standard)
  ├── Tenant provides cheques on lease start
  ├── Agent deposits cheque on due date
  ├── Bank confirms payment (agent marks in CRM)
  ├── RentPayment record: { leaseId, amount, paidDate, method: 'cheque' }
  └── Landlord portal updated: "Rent received for [month]"
          │
          ▼
  OPTION B: Online payment via Stripe (Phase 2)
  ├── Tenant receives payment link in portal + email
  ├── Tenant pays with card / local payment method
  ├── Stripe webhook → POST /api/payments/webhook
  ├── RentPayment record updated: status = 'paid'
  └── Receipt auto-generated and stored in tenant portal
          │
          ▼
  Overdue handling:
  ├── +1 day overdue → Automated reminder
  ├── +7 days → Agent calls tenant
  ├── +14 days → Formal written notice (RERA Form X)
  ├── +30 days → Legal action procedure begins
  └── Log all actions in activity timeline
```

---

## 8. Maintenance Flow

```
Tenant submits maintenance request (via portal or WhatsApp)
          │
          ▼
  MaintenanceRequest created:
  {
    propertyId, tenantId, category, description,
    priority: low|medium|high|urgent,
    photos[],
    status: 'submitted'
  }
          │
          ▼
  Routing by priority:
  ├── URGENT (no water, no electricity, security issue)
  │   → Agent notified immediately
  │   → Contractor contacted within 2 hours
  │
  ├── HIGH (appliance failure, leak)
  │   → Agent notified within 2 hours
  │   → Contractor booked within 24 hours
  │
  ├── MEDIUM (cosmetic, non-critical)
  │   → Scheduled within 5 business days
  │
  └── LOW (general improvements)
      → Scheduled at next available slot
          │
          ▼
  Landlord notified (via portal notification + WhatsApp):
  "New maintenance request: [category] — [priority]"
          │
          ▼
  Request resolved:
  ├── Contractor completes work
  ├── Agent updates status: 'resolved'
  ├── Tenant confirms satisfaction (portal or WhatsApp)
  └── Cost recorded: { requestId, contractorId, invoiceAmount }
      Landlord billed if within their responsibility
```

---

## 9. Renewal / Termination Flow

```
60 days before lease expiry
          │
          ▼
  [Automated cron job — Phase 2]
  Renewal reminder to:
  ├── Tenant: "Your lease expires in 60 days. Renew now?"
  ├── Landlord: "Tenant lease expires in 60 days. Do you wish to renew?"
  └── Agent: CRM task created "Initiate renewal discussion"
          │
          ├── RENEWAL PATH:
          │   Agent negotiates new rent (max 5% increase per RERA Calculator)
          │   New lease agreement generated
          │   Ejari updated (new registration required)
          │   Both portals updated with new lease dates
          │
          └── VACATE PATH:
              ├── RERA requires 90-day notice for landlord to vacate tenant
              ├── 30-day notice for tenant to vacate
              ├── Agent coordinates move-out inspection
              ├── Security deposit: returned within 30 days minus deductions
              │   (Deductions require written notice + receipts)
              └── Unit listed again for new tenant
```

---

## 10. Key Regulatory Requirements

| Requirement | Rule | Timing |
|------------|------|--------|
| Ejari registration | Mandatory for all leases (DLD) | Within 30 days of tenancy start |
| Rent increase notice | Must follow RERA Rent Calculator | 90 days notice minimum |
| Termination notice (landlord) | Property sale / own use / major renovation | 12 months notice |
| Security deposit | Max 5% annual rent (residential), 10% commercial | At lease signing |
| Maintenance responsibility | Structural: landlord. Internal: tenant | As per lease |
| Dispute resolution | Dubai Rental Dispute Settlement Centre (RDSC) | If negotiation fails |

---

**Document Owner:** Operations Department (Daisy — Leasing & Tenant Manager)
**Related:** `business_docs/09_crm_features/tenancy-ejari.md`, `business_docs/09_crm_features/tenant-portal.md`


---

## 10. Rent Review Process (RERA Rent Index)

### 10.1 How RERA Rent Increases Work

Dubai's rent increase framework is governed by RERA Decree No. 43 of 2013 (the "Rent Cap"). A landlord can only increase rent if:
1. The current rent is below the RERA Rental Price Index (RPI) for that area/unit type
2. The permitted increase percentage is tied to how much below RPI the current rent is

### 10.2 RERA Rent Increase Calculator

| Current Rent vs. RERA RPI | Maximum Permitted Increase |
|--------------------------|--------------------------|
| Current rent < 10% below RPI | 0% (no increase permitted) |
| Current rent 11–20% below RPI | Maximum 5% increase |
| Current rent 21–30% below RPI | Maximum 10% increase |
| Current rent 31–40% below RPI | Maximum 15% increase |
| Current rent > 40% below RPI | Maximum 20% increase |

**Source:** Dubai Decree No. 43 of 2013; verified via RERA's Rental Price Calculator at smartservices.rera.gov.ae

### 10.3 Rent Review Process in CRM

```
TRIGGER: 90 days before lease end date (system auto-alert)

Step 1: Agent pulls RERA RPI for this unit type + area
   └── Check: smartservices.rera.gov.ae/RentalPriceCalculator

Step 2: Compare current rent to RERA RPI
   └── If current rent = RPI or above → 0% increase (must tell landlord)
   └── If current rent < RPI → calculate max increase using table above

Step 3: Landlord consultation (agent calls/WhatsApp)
   ├── Inform landlord of RERA-permitted increase
   ├── Recommend increase (if within RERA limits)
   └── Landlord confirms decision: increase / no increase

Step 4: Tenant notification
   ├── Minimum 90 days notice required for any rent increase
   ├── Written notice via: Registered letter OR email (CRM-generated) OR WhatsApp (with read receipt)
   └── CRM: log notification date + method + increase amount

Step 5: Lease renewal / termination decision
   ├── Tenant accepts → Proceed to renewal flow (Section 5)
   ├── Tenant counter-proposes → Negotiate (Section 6)
   └── Tenant refuses + landlord insists → Tenant can refer to RDSC
```

### 10.4 Landlord Rights on Non-Renewal

Under Law No. 26 of 2007 (amended by Law No. 33 of 2008), a landlord can refuse renewal only for specific reasons:
1. The landlord or a first-degree family member needs to occupy the unit
2. The property requires maintenance/demolition (must get DLD approval)
3. Tenant has materially breached the lease

**Required notice for non-renewal:** 12 months (one full year notice required before eviction)
**Failure to comply:** Landlord is liable to compensate tenant

**CRM alert:** If `Lease.renewalDecision = 'NOT_RENEWING'` → system creates task: "Issue 12-month eviction notice" with 12-month countdown.

---

## 11. Maintenance Request Lifecycle

### 11.1 Maintenance Request Flow

```
Tenant submits request via Tenant Portal:
├── Category: Plumbing / Electrical / AC / Structural / General
├── Urgency: Emergency (water leak, no power) / Urgent / Standard
├── Description + photos (optional but recommended)
└── Preferred time for inspection

System routes based on urgency:
├── EMERGENCY → Property Manager + Landlord notified within 30 min
│   └── Contractor dispatched within 2 hours (24/7 emergency line)
├── URGENT → Property Manager within 4 hours
│   └── Contractor within 24 hours
└── STANDARD → Property Manager next business day
    └── Contractor within 5 business days

Property Manager actions:
1. Review request + assess responsibility (tenant vs. landlord?)
2. If landlord's responsibility: contact landlord → get approval
3. If tenant's responsibility: inform tenant (wear & tear exclusions)
4. Book contractor from approved vendor list
5. CRM: record contractor name, quote, appointment date

Completion:
1. Contractor completes work
2. Property Manager confirms + CRM status → COMPLETED
3. Invoice to landlord (if applicable) via Theodora AI
4. Tenant rates maintenance experience (CSAT 1–5) in portal
5. Photo evidence uploaded: before + after

Timeline targets:
├── Emergency: resolved < 4 hours
├── Urgent: resolved < 48 hours
└── Standard: resolved < 10 business days
```

### 11.2 Responsibility Matrix

| Issue | Landlord Responsible? | Tenant Responsible? |
|-------|--------------------|------------------|
| AC unit failure | ✅ (if unit is not working) | If damaged by tenant misuse |
| AC filter cleaning | ❌ | ✅ (routine maintenance) |
| Water heater failure | ✅ | If damaged by improper use |
| Plumbing (internal pipes) | ✅ | If caused by blockage due to misuse |
| Window/door locks | ✅ | If damaged by tenant |
| Light bulb replacement | ❌ | ✅ |
| Painting (general wear) | ✅ (after lease end) | ✅ if excessive |
| Structural cracks | ✅ | ❌ |
| Key replacement | ❌ | ✅ |

---

**Document Owner:** Operations (Daisy — Leasing AI, Harmony — Tenant Relations AI)
**Version History:** v1.0 April 2026; v2.0 April 2026 (rent review, maintenance lifecycle)
**Related:** `plans/PHASE_2_LANDLORD_TENANT.md`, `business/08_compliance/rera-compliance-checklist.md`
