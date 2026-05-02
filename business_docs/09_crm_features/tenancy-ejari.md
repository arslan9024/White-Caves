# Tenancy & Ejari Management — CRM Feature Specification

> **Status:** In Progress (Core workflows active, endpoint expansion ongoing)  
> **Module Owner:** Daisy (Leasing Manager AI)  
> **API Endpoints:** `/api/tenants`, `/api/leases` (primary namespace)  
> **Priority:** High

---

## Overview

The Tenancy & Ejari module manages the full tenant lifecycle: application, KYC, lease creation, Ejari registration, active tenancy management, and move-out. It ensures regulatory compliance (Ejari mandatory per Dubai Decree No. 26 of 2013) and provides landlords and agents full visibility of their rental portfolio.

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

---

**Version:** 1.0 | **Last Updated:** March 2026
