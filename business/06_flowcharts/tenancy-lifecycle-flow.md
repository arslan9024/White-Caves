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
