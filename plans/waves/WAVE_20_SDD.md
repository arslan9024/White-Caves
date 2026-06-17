# Wave 20 — System Design Document (SDD)

**Wave:** 20  
**Focus:** Full Leasing & Tenancy Implementation — Ejari, PDC, Tenant Portal, Landlord Portal  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Victoria + @Mira + @Una + @Barbara + @Katherine  
**CONSUMESâ†:** `business_docs/09_crm_features/tenancy-ejari.md`, `business_docs/09_crm_features/tenant-portal.md`, `business_docs/09_crm_features/landlord-portal.md`  
**FEEDSâ†':** Wave 21 finance workflows (PDC ledger → cash flow), Wave 22 analytics (tenancy KPIs)

---

## Objective

Deliver the complete leasing and tenancy lifecycle inside the CRM — from tenant application and KYC through Ejari registration, PDC management, active tenancy tracking, maintenance escalation, and lease renewal or early-termination workflows. This wave makes White Caves fully operational as a Dubai leasing agency with zero manual paper handling.

---

## Scope

### 1. Tenant Application & KYC

- Tenant application form (linked to property + lead)
- KYC document capture (Emirates ID, passport, visa page, NOC if applicable)
- KYC validation rules and expiry-alert engine
- Application status workflow: Draft → Submitted → Under Review → Approved / Rejected

### 2. Lease Contract & Ejari

- Lease contract generation (Tenancy Agreement PDF — bilingual)
- E-signature integration via DocuSign/Adobe Sign webhook
- Ejari registration workflow and status tracking (RERA Decree No. 26/2013)
- Ejari certificate storage and download

### 3. PDC (Post-Dated Cheque) Management

- PDC schedule creation (linked to lease term and rent amount)
- PDC deposit confirmation workflow
- Bounced cheque detection and escalation
- PDC replacement flow (replacement cheque, bank guarantee alternative)
- Legal notice auto-generation on bounce (Form 12)

### 4. Active Tenancy Management

- Tenancy dashboard (per property and per tenant)
- Rent payment tracker (paid / upcoming / overdue)
- Lease renewal workflow (90-day reminder, RERA rental index check, Form 7 notice)
- Early termination workflow (mutual/breach, penalty calculation, deposit refund)
- Move-out checklist and final inspection

### 5. Tenant Portal

- Six-tab portal: Lease Details, Payment History, Maintenance, Documents, Profile, Portal Home
- authFetch pattern, loading/error/empty states per tab
- WhatsApp notification integration on key events

### 6. Landlord Portal

- Portfolio overview per landlord
- Rent collection status and PDC schedule
- Maintenance escalation approvals (repairs > AED 500)
- Document vault (title deed, NOC, insurance)
- Quarterly owner statement PDF

---

## Requirement IDs (Wave 20)

| ID | Requirement |
|---|---|
| `REQ-LEASE-001` | Tenant application form captures all KYC fields and links to a property and lead |
| `REQ-LEASE-002` | KYC documents are validated on upload; expiry alerts generated 30 days before expiry |
| `REQ-LEASE-003` | Lease contract PDF is generated from template with variable injection |
| `REQ-LEASE-004` | E-signature webhook updates lease status to `signed` and stores PDF |
| `REQ-LEASE-005` | Ejari registration status is tracked with certificate URL on completion |
| `REQ-LEASE-006` | PDC schedule is auto-created from lease term + frequency (monthly/quarterly/annual) |
| `REQ-LEASE-007` | Bounced cheque triggers escalation notification within 1 hour to agent and landlord |
| `REQ-LEASE-008` | Legal notice (Form 12) is generated and stored on confirmed bounce |
| `REQ-LEASE-009` | Lease renewal reminder runs 90/60/30 days before expiry date |
| `REQ-LEASE-010` | RERA rental index check is displayed alongside renewal proposal |
| `REQ-LEASE-011` | Form 7 (rent increase notice) is generated with 90-day notice compliance check |
| `REQ-LEASE-012` | Early termination calculates penalty per mutual-agreement or breach type |
| `REQ-LEASE-013` | Tenant portal six tabs render with full loading/error/empty/success states |
| `REQ-LEASE-014` | Landlord portal displays portfolio rent collection and PDC calendar |
| `REQ-LEASE-015` | Maintenance escalation notifies landlord via WhatsApp for approvals > AED 500 |

---

## Data Schema

### Lease Model (Prisma)

```prisma
model Lease {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  propertyId      String   @db.ObjectId
  tenantId        String   @db.ObjectId
  landlordId      String   @db.ObjectId
  agentId         String   @db.ObjectId
  startDate       DateTime
  endDate         DateTime
  monthlyRent     Float
  securityDeposit Float
  currency        String   @default("AED")
  status          LeaseStatus @default(DRAFT)
  ejariNumber     String?
  ejariCertUrl    String?
  contractUrl     String?
  signedAt        DateTime?
  pdcSchedule     PDC[]
  renewals        LeaseRenewal[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PDC {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  leaseId       String   @db.ObjectId
  chequeNumber  String
  bank          String
  amount        Float
  dueDate       DateTime
  status        PDCStatus @default(PENDING)
  bounceDate    DateTime?
  bounceReason  String?
  replacedById  String?   @db.ObjectId
  createdAt     DateTime @default(now())
}

enum LeaseStatus {
  DRAFT
  PENDING_SIGNATURE
  SIGNED
  EJARI_PENDING
  ACTIVE
  RENEWAL_PENDING
  TERMINATED
  EXPIRED
}

enum PDCStatus {
  PENDING
  DEPOSITED
  CLEARED
  BOUNCED
  REPLACED
  CANCELLED
}
```

---

## API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/leases` | Create new lease |
| `GET` | `/api/v1/leases/:id` | Get lease details |
| `PATCH` | `/api/v1/leases/:id/status` | Update lease status |
| `POST` | `/api/v1/leases/:id/sign` | Trigger e-signature flow |
| `GET` | `/api/v1/leases/:id/ejari` | Get Ejari status |
| `POST` | `/api/v1/leases/:id/pdc` | Create PDC schedule |
| `PATCH` | `/api/v1/pdc/:id/bounce` | Record cheque bounce |
| `POST` | `/api/v1/pdc/:id/replace` | Replace bounced cheque |
| `GET` | `/api/v1/tenants/:id/portal` | Get tenant portal data |
| `GET` | `/api/v1/landlords/:id/portfolio` | Get landlord portfolio |
| `POST` | `/api/v1/leases/:id/renew` | Initiate renewal workflow |
| `POST` | `/api/v1/leases/:id/terminate` | Early termination |

---

## Architecture Constraints

1. All lease documents stored under `uploads/documents/{leaseId}/` with tenant-scoped access.
2. PDC schedule generation must validate rent amount × frequency = annual rent (± rounding).
3. Ejari registration integration mocked unless DLD API credentials are provided; status manually updatable.
4. WhatsApp notifications use existing Meta WABA template framework from Wave 13.
5. RBAC: tenant can see their own lease/payments only; landlord sees their properties; agent sees their assigned leases; manager/owner sees all.

---

## Test Coverage Requirements

- Unit: PDC schedule generation, penalty calculator, RERA rental index check
- Integration: Lease create → sign → Ejari flow; PDC bounce → notification → Form 12
- E2E: Tenant portal all tabs; Landlord portfolio view; Renewal workflow

---

## Exit Criteria

1. All REQ-LEASE-001 through REQ-LEASE-015 implemented and tested
2. Tenant portal six-tab smoke tests pass
3. PDC bounce → escalation → Form 12 flow end-to-end verified
4. Ejari registration status tracking verified
5. `npm run plans:validate` green
6. `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md` updated
