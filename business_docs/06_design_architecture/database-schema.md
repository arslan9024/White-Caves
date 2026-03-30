# Database Schema Reference — White Caves CRM

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **ORM:** Prisma  
> **Database:** MongoDB Atlas

---

## Overview

The database uses MongoDB with Prisma ORM. All models use MongoDB's ObjectID (24-character hex string) as the primary key (`@id @map("_id")`).

---

## Core Models

### User
Represents all system users (agents, managers, admins, owners, landlords, tenants).

```prisma
model User {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  email         String   @unique
  password      String?                    // null for OAuth-only users
  firebaseUid   String?  @unique
  role          String                     // owner, admin, manager, agent, finance, etc.
  department    String?                    // sales, leasing, operations, finance, etc.
  phone         String?
  photoUrl      String?
  status        String   @default("active") // active, inactive, suspended, pending
  // Auth
  twoFactorEnabled  Boolean @default(false)
  twoFactorSecret   String?
  // RERA
  reraLicenseNumber String?
  reraExpiryDate    DateTime?
  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastLoginAt   DateTime?
  // Relations
  leadsAssigned    Lead[]        @relation("AssignedLeads")
  leadsCreated     Lead[]        @relation("CreatedLeads")
  properties       Property[]
  commissions      Commission[]
  activities       Activity[]
  transactions     Transaction[]
}
```

### Lead
Represents a sales/rental prospect.

```prisma
model Lead {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  name            String
  email           String?
  phone           String
  whatsappNumber  String?
  company         String?
  source          String   // whatsapp, website, phone, referral, marketing, propertyfinder, bayut
  status          String   @default("new") // new, contacted, qualified, viewing, offered, negotiating, won, lost
  score           Int      @default(0)     // 0–100
  budget          Float?                   // AED
  propertyType    String?                  // villa, apartment, townhouse, etc.
  location        String?                  // Preferred area
  timeline        String?                  // urgent, 1-3-months, 3-6-months, future
  notes           String?
  // Campaign attribution
  campaignId      String?  @db.ObjectId
  // Assignment
  assignedToId    String?  @db.ObjectId
  assignedTo      User?    @relation("AssignedLeads", fields: [assignedToId], references: [id])
  createdById     String   @db.ObjectId
  createdBy       User     @relation("CreatedLeads", fields: [createdById], references: [id])
  // Timestamps
  lastActivityAt  DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  activities      Activity[]
  transactions    Transaction[]
}
```

### Property
Represents a property in the inventory.

```prisma
model Property {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  title           String
  description     String?
  type            String   // villa, apartment, townhouse, penthouse, studio, office, commercial, land
  status          String   @default("available") // available, reserved, sold, rented, draft, archived
  // Location
  location        String
  area            String?                  // Community/neighbourhood
  latitude        Float?
  longitude       Float?
  // Specs
  bedrooms        Int
  bathrooms       Int
  sqft            Float
  // Pricing
  price           Float                    // AED sale price
  monthlyRent     Float?                   // AED monthly rent
  // Compliance
  permitNumber    String?                  // RERA Trakheesi permit
  permitExpiryDate DateTime?
  dldReference    String?                  // DLD reference number
  // Media
  images          String[]                 // CDN URLs
  videoUrl        String?
  floorPlanUrl    String?
  virtualTourUrl  String?
  // Flags
  featured        Boolean  @default(false)
  // Ownership
  createdById     String   @db.ObjectId
  createdBy       User     @relation(fields: [createdById], references: [id])
  // Portal sync
  portalSyncStatus String? // synced, pending, error
  lastPortalSync  DateTime?
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  leads           Lead[]
  transactions    Transaction[]
  commissions     Commission[]
}
```

### Transaction
Represents a sale or lease deal.

```prisma
model Transaction {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  type            String   // sale, lease
  status          String   // inquiry, offer_made, negotiating, offer_accepted, contract_signed, payment_pending, closed, cancelled
  // Parties
  leadId          String   @db.ObjectId
  lead            Lead     @relation(fields: [leadId], references: [id])
  propertyId      String   @db.ObjectId
  property        Property @relation(fields: [propertyId], references: [id])
  agentId         String   @db.ObjectId
  agent           User     @relation(fields: [agentId], references: [id])
  // Financials
  offerPrice      Float                    // AED
  finalPrice      Float?                   // AED (after negotiation)
  currency        String   @default("AED")
  // Compliance
  kycStatus       String   @default("pending") // pending, under_review, verified, rejected
  // DLD
  dldTransferReference String?
  dldTransferDate DateTime?
  // Timestamps
  offerDate       DateTime?
  acceptanceDate  DateTime?
  signatureDate   DateTime?
  closingDate     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  commissions     Commission[]
}
```

### Commission
Represents an agent commission earned from a transaction.

```prisma
model Commission {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  transactionId   String   @db.ObjectId
  transaction     Transaction @relation(fields: [transactionId], references: [id])
  propertyId      String   @db.ObjectId
  property        Property @relation(fields: [propertyId], references: [id])
  agentId         String   @db.ObjectId
  agent           User     @relation(fields: [agentId], references: [id])
  type            String   // sale, lease
  // Calculation
  transactionValue Float                   // AED
  rate            Float                    // e.g., 0.02
  grossAmount     Float                    // transactionValue × rate
  agentSplitPct   Float    @default(0.5)
  brokerSplitPct  Float    @default(0.5)
  agentAmount     Float                    // grossAmount × agentSplitPct
  brokerAmount    Float
  // Status
  status          String   @default("pending") // pending, approved, rejected, paid
  rejectionReason String?
  approvedById    String?  @db.ObjectId
  approvedAt      DateTime?
  paidById        String?  @db.ObjectId
  paidAt          DateTime?
  paymentMethod   String?
  paymentReference String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Tenant
Represents a rental applicant or active tenant.

```prisma
model Tenant {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  name            String
  email           String
  phone           String
  nationality     String
  emiratesIdNumber String?
  passportNumber  String?
  visaNumber      String?
  visaExpiryDate  DateTime?
  employmentStatus String?
  employerName    String?
  monthlyIncome   Float?
  // Documents (stored as JSON object with URLs)
  documents       Json?
  // Compliance
  kycStatus       String   @default("pending")
  kycNotes        String?
  // Status
  status          String   @default("application")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  leases          Lease[]
}
```

### Lease *(Planned — schema migration required)*

```prisma
model Lease {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  propertyId      String   @db.ObjectId
  property        Property @relation(fields: [propertyId], references: [id])
  tenantId        String   @db.ObjectId
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  agentId         String   @db.ObjectId
  // Dates
  startDate       DateTime
  endDate         DateTime
  // Financial
  monthlyRent     Float
  securityDeposit Float
  commissionRate  Float    @default(0.05)
  // Ejari
  ejariContractNumber  String?
  ejariRegistrationDate DateTime?
  ejariExpiryDate      DateTime?
  // Status
  status          String   @default("draft") // draft, signed, active, renewal_pending, expired, terminated
  terminationReason String?
  // Documents
  leaseDocumentUrl    String?
  signedDocumentUrl   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  rentPayments    RentPayment[]
  maintenanceRequests MaintenanceRequest[]
}
```

### Activity
Audit trail of all interactions and system events.

```prisma
model Activity {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  type        String   // call, email, sms, whatsapp, visit, note, status_change, assignment
  action      String
  description String
  outcome     String?
  duration    Int?                           // minutes (for calls)
  leadId      String?  @db.ObjectId
  lead        Lead?    @relation(fields: [leadId], references: [id])
  userId      String?  @db.ObjectId
  user        User?    @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## Indexes

Key indexes for performance:

| Collection | Index Fields | Type |
|-----------|-------------|------|
| Lead | `assignedToId`, `status`, `score`, `createdAt` | Compound |
| Lead | `phone` | Unique (sparse) |
| Lead | `name`, `email`, `phone`, `company` | Text (full-text search) |
| Property | `status`, `type`, `area`, `price` | Compound |
| Property | `dldReference` | Unique (sparse) |
| Property | `title`, `location`, `description` | Text |
| Commission | `agentId`, `status`, `createdAt` | Compound |
| Activity | `leadId`, `createdAt` | Compound |
| Transaction | `leadId`, `propertyId`, `status` | Compound |

---

## Migration Notes

**Required migrations not yet applied:**
1. Add `ejariContractNumber`, `ejariRegistrationDate`, `ejariExpiryDate` to Property or Lease model
2. Create `Lease` model
3. Create `RentPayment` model
4. Create `MaintenanceRequest` model
5. Create `Campaign` model
6. Create `WhatsAppConversation` and `WhatsAppMessage` models (currently stored as activities)

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
