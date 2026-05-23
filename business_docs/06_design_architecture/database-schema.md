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
  name          String?
  email         String   @unique
  passwordHash  String?                    // null for OAuth-only users
  firebaseUid   String?  @unique
  role          String                     // owner, admin, manager, agent, finance, etc.
  department    String?                    // sales, leasing, operations, finance, etc.
  phone         String?
  photoUrl      String?
  status        String   @default("active") // active, inactive, suspended, pending
  // Auth
  twoFactorEnabled  Boolean @default(false)
  twoFactorSecret   String?
  totpEnabled       Boolean @default(false)
  totpSecret        String?
  // RERA
  reraLicenseNumber String?
  brnNumber         String?  // RERA Broker Registration Number
  brnExpiry         DateTime? // BRN expiry date
  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
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

### Lease _(Planned — schema migration required)_

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

| Collection  | Index Fields                                   | Type                    |
| ----------- | ---------------------------------------------- | ----------------------- |
| Lead        | `assignedToId`, `status`, `score`, `createdAt` | Compound                |
| Lead        | `phone`                                        | Unique (sparse)         |
| Lead        | `name`, `email`, `phone`, `company`            | Text (full-text search) |
| Property    | `status`, `type`, `area`, `price`              | Compound                |
| Property    | `dldReference`                                 | Unique (sparse)         |
| Property    | `title`, `location`, `description`             | Text                    |
| Commission  | `agentId`, `status`, `createdAt`               | Compound                |
| Activity    | `leadId`, `createdAt`                          | Compound                |
| Transaction | `leadId`, `propertyId`, `status`               | Compound                |

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

---

## New Collections (Migration Required)

### AuditEvent

Immutable audit trail for all system actions. Append-only — no updates or deletes permitted.

```prisma
model AuditEvent {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @db.ObjectId              // actor
  action        String                              // CREATE|UPDATE|DELETE|STATUS_CHANGE|LOGIN|LOGOUT|EXPORT|PERMISSION_CHANGE
  entityType    String                              // lead|property|lease|user|commission|ejari|dld_transaction
  entityId      String   @db.ObjectId
  oldValue      Json?                               // snapshot before change
  newValue      Json?                               // snapshot after change
  ipAddress     String?
  userAgent     String?
  sessionId     String?
  timestamp     DateTime @default(now())
  // NO updatedAt — append-only
}
```

**Field Validation:**

- `action` must be one of: `CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`, `LOGIN`, `LOGOUT`, `EXPORT`, `PERMISSION_CHANGE`, `APPROVAL`, `PAYMENT`
- `entityType` must be one of: `lead`, `property`, `lease`, `user`, `commission`, `ejari`, `dld_transaction`, `tenant`, `activity`
- `oldValue` and `newValue` are JSON snapshots; PII fields (passport, Emirates ID) are redacted to `"[REDACTED]"` before storage
- Max document size: 16 MB (MongoDB limit); large exports stored as S3 reference

**Indexes:**
| Index Fields | Type | Notes |
|---|---|---|
| `userId, timestamp` | Compound | Agent activity lookups |
| `entityType, entityId, timestamp` | Compound | Entity history |
| `timestamp` | TTL (2555 days = 7 years) | UAE Commercial Transactions Law retention |
| `action, timestamp` | Compound | Compliance queries |

**Example Document:**

```json
{
  "_id": "64aev001",
  "userId": "64usr123",
  "action": "STATUS_CHANGE",
  "entityType": "lead",
  "entityId": "64led456",
  "oldValue": { "status": "new", "score": 35 },
  "newValue": { "status": "contacted", "score": 50 },
  "ipAddress": "94.200.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2026-03-15T10:30:00Z"
}
```

**Relationships:** References `User` (userId), polymorphic entity reference by `entityType + entityId`.

**Migration Notes:**

- Create with `{ w: "majority", j: true }` write concern for durability
- Apply `{ changeStreamPreAndPostImages: "required" }` on MongoDB 6.0+ for CDC
- **Never add updateOne or deleteOne operations** — enforce at application service layer

---

### EjariRecord

Ejari tenancy contract registrations with Dubai Land Department.

```prisma
model EjariRecord {
  id                     String   @id @default(auto()) @map("_id") @db.ObjectId
  ejariContractNumber    String   @unique                    // e.g. EJARI-2026-00123456
  leaseId                String   @db.ObjectId @unique       // one Ejari per lease
  propertyId             String   @db.ObjectId
  tenantId               String   @db.ObjectId
  landlordId             String   @db.ObjectId
  agentId                String?  @db.ObjectId
  // Contract terms
  contractStartDate      DateTime
  contractEndDate        DateTime
  annualRentAED          Float                               // must be > 0
  securityDepositAED     Float    @default(0)
  noOfCheques            Int                                 // 1, 2, 4, 6, or 12
  // Registration
  registrationDate       DateTime?
  expiryDate             DateTime?
  status                 String   @default("pending")        // pending|registered|renewed|cancelled|expired
  cancellationReason     String?
  // Documents
  tenancyContractUrl     String                              // signed PDF (required before registration)
  certificateUrl         String?                             // Ejari PDF issued by DLD
  // Ejari renewal tracking
  renewalCount           Int      @default(0)
  parentEjariId          String?  @db.ObjectId               // null for initial; set for renewals
  // Timestamps
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}
```

**Validation Rules:**

- `contractEndDate` must be at least 30 days after `contractStartDate`
- `noOfCheques` must be in: `[1, 2, 4, 6, 12]`
- `annualRentAED` must match linked Lease `monthlyRent × 12` ±5%
- `status = registered` requires `ejariContractNumber` and `registrationDate`

**Indexes:**
| Index Fields | Type | Notes |
|---|---|---|
| `ejariContractNumber` | Unique | Primary lookup |
| `leaseId` | Unique | One Ejari per active lease |
| `tenantId, status` | Compound | Tenant portal queries |
| `propertyId, status` | Compound | Property compliance check |
| `contractEndDate` | Single | Expiry alerts (90/60/30 day reminders) |

**Example Document:**

```json
{
  "_id": "64eja001",
  "ejariContractNumber": "EJARI-2026-00123456",
  "leaseId": "64lea001",
  "propertyId": "64pro001",
  "tenantId": "64ten001",
  "landlordId": "64lan001",
  "contractStartDate": "2026-04-01T00:00:00Z",
  "contractEndDate": "2027-03-31T23:59:59Z",
  "annualRentAED": 72000,
  "securityDepositAED": 6000,
  "noOfCheques": 4,
  "registrationDate": "2026-03-20T09:00:00Z",
  "status": "registered",
  "tenancyContractUrl": "https://cdn.whitecaves.ae/leases/signed-001.pdf",
  "certificateUrl": "https://cdn.whitecaves.ae/ejari/EJARI-2026-00123456.pdf",
  "renewalCount": 0,
  "createdAt": "2026-03-15T08:00:00Z"
}
```

**Relationships:** Linked to `Lease` (leaseId), `Property` (propertyId), `Tenant` (tenantId), `User` (landlordId, agentId).

**Migration Notes:**

- Run after `Lease` model migration is applied
- Backfill existing `ejariContractNumber` fields from `Tenant` model into this collection
- PDPL Retention: 7 years (AML/financial records requirement)

---

### DLDTransaction

Dubai Land Department property transfer records.

```prisma
model DLDTransaction {
  id                       String   @id @default(auto()) @map("_id") @db.ObjectId
  dldTransactionReference  String   @unique              // e.g. DLD-2026-TRF-000789
  transactionId            String   @db.ObjectId @unique // linked internal Transaction
  propertyId               String   @db.ObjectId
  buyerId                  String   @db.ObjectId         // Lead or User
  sellerId                 String   @db.ObjectId
  agentId                  String?  @db.ObjectId
  // Financials
  salePriceAED             Float                         // min 100000
  dldFeeAED                Float                         // 4% of salePrice
  adminFeeAED              Float                         // min 580
  trusteeFeesAED           Float?
  // DLD Transfer
  titleDeedNumber          String                        // existing title deed
  newTitleDeedNumber       String?                       // issued after transfer
  titleDeedUrl             String?
  transferDate             DateTime?
  trusteeAppointmentDate   DateTime?
  // Mortgage details
  mortgageFlag             Boolean  @default(false)
  bankNOCUrl               String?                       // required if mortgageFlag=true
  mortgageBankName         String?
  mortgageAmountAED        Float?
  // Status
  status                   String   @default("pending")  // pending|filed|completed|rejected|cancelled
  rejectionReason          String?
  // Compliance
  kycVerifiedAt            DateTime?                     // buyer KYC cleared timestamp
  amlCheckedAt             DateTime?
  // Timestamps
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}
```

**Validation Rules:**

- `dldFeeAED` must equal `salePriceAED × 0.04` ±AED 100 tolerance
- `adminFeeAED` minimum AED 580 per DLD fee schedule
- `mortgageFlag = true` requires `bankNOCUrl` and `mortgageBankName`
- `status = completed` requires `newTitleDeedNumber` and `transferDate`

**Indexes:**
| Index Fields | Type | Notes |
|---|---|---|
| `dldTransactionReference` | Unique | DLD reference lookup |
| `transactionId` | Unique | Internal transaction link |
| `propertyId, status` | Compound | Property DLD history |
| `buyerId` | Single | Buyer transaction history |
| `transferDate` | Single | Monthly DLD volume reports |

**Example Document:**

```json
{
  "_id": "64dld001",
  "dldTransactionReference": "DLD-2026-TRF-000789",
  "transactionId": "64txn001",
  "propertyId": "64pro001",
  "buyerId": "64lea001",
  "sellerId": "64sel001",
  "salePriceAED": 2000000,
  "dldFeeAED": 80000,
  "adminFeeAED": 4000,
  "titleDeedNumber": "TDN-2023-001234",
  "newTitleDeedNumber": "TDN-2026-000789",
  "transferDate": "2026-03-20T09:00:00Z",
  "mortgageFlag": false,
  "status": "completed",
  "createdAt": "2026-03-15T10:00:00Z"
}
```

**PDPL Classification:** `salePriceAED`, `buyerId`, `sellerId` — Financial/PII. Retention: 7 years.

---

### CommissionRule

Reusable commission rate templates applied to transactions.

```prisma
model CommissionRule {
  id                       String   @id @default(auto()) @map("_id") @db.ObjectId
  name                     String                           // e.g. "Standard Sale 2%"
  transactionType          String                           // sale|rental|referral|bonus|override
  rateType                 String                           // percentage|fixed
  rateValue                Float                            // 0.01–0.15 for %, or AED amount
  agentSplitPct            Float                            // 0.0 to 1.0
  brokerSplitPct           Float                            // must equal 1 - agentSplitPct
  minTransactionValueAED   Float?
  maxTransactionValueAED   Float?
  isDefault                Boolean  @default(false)
  isActive                 Boolean  @default(true)
  validFrom                DateTime
  validUntil               DateTime?
  createdById              String   @db.ObjectId
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}
```

**Validation Rules:**

- `agentSplitPct + brokerSplitPct` must equal `1.0` exactly
- `rateValue` for `percentage` type: 0.01–0.15; for `fixed` type: min AED 100
- Only one `isDefault = true` record per `transactionType`
- `validUntil` if set must be after `validFrom`

**Indexes:**
| Index Fields | Type | Notes |
|---|---|---|
| `transactionType, isDefault, isActive` | Compound | Default rule lookup |
| `validFrom, validUntil` | Compound | Active rule date range queries |

**Example Document:**

```json
{
  "_id": "64cru001",
  "name": "Standard Off-Plan Sale 7%",
  "transactionType": "sale",
  "rateType": "percentage",
  "rateValue": 0.07,
  "agentSplitPct": 0.5,
  "brokerSplitPct": 0.5,
  "isDefault": true,
  "isActive": true,
  "validFrom": "2026-01-01T00:00:00Z",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### NadiaMessage

WhatsApp conversation messages processed by the Nadia AI routing agent.

```prisma
model NadiaMessage {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  wamid             String   @unique                   // WhatsApp Message ID
  conversationId    String   @db.ObjectId              // grouped conversation
  fromNumber        String                             // E.164 format
  toNumber          String                             // E.164 format
  direction         String                             // inbound|outbound
  messageType       String                             // text|image|document|audio|video|template|interactive
  body              String?                            // text content; null for media
  mediaUrl          String?                            // CDN URL for media messages
  mediaType         String?                            // image/jpeg, application/pdf, etc.
  // Lead linkage
  leadId            String?  @db.ObjectId
  assignedAgentId   String?  @db.ObjectId
  // Routing & Bot
  botHandled        Boolean  @default(false)
  botIntent         String?                            // detected intent: property_enquiry|maintenance|payment|general
  botConfidence     Float?                             // 0.0 to 1.0
  escalatedToHuman  Boolean  @default(false)
  escalationReason  String?
  // Template
  templateName      String?                            // Meta-approved template name
  templateVariables Json?                              // variable substitutions
  // Status
  status            String   @default("sent")          // sent|delivered|read|failed
  failureReason     String?
  sentAt            DateTime?
  deliveredAt       DateTime?
  readAt            DateTime?
  createdAt         DateTime @default(now())
}
```

**Validation Rules:**

- `fromNumber` and `toNumber` must be valid E.164 format
- `direction = outbound` with `messageType = template` requires `templateName`
- `botConfidence` must be between 0.0 and 1.0 when set
- `body` is required when `messageType = text`; `mediaUrl` required for media types

**Indexes:**
| Index Fields | Type | Notes |
|---|---|---|
| `wamid` | Unique | WhatsApp deduplication |
| `conversationId, createdAt` | Compound | Conversation thread retrieval |
| `fromNumber, createdAt` | Compound | Contact message history |
| `leadId, createdAt` | Compound | Lead communication timeline |
| `status, createdAt` | Compound | Delivery status monitoring |
| `createdAt` | TTL (1095 days = 3 years) | PDPL retention policy |

**Example Document:**

```json
{
  "_id": "64msg001",
  "wamid": "wamid.HBgNOTcxNTAxMjM0NTY3FQIAERgSM...",
  "conversationId": "64cnv001",
  "fromNumber": "+971501234567",
  "toNumber": "+97145001234",
  "direction": "inbound",
  "messageType": "text",
  "body": "I am looking for a 3-bedroom villa in DAMAC Hills 2 budget AED 2M",
  "botHandled": true,
  "botIntent": "property_enquiry",
  "botConfidence": 0.94,
  "escalatedToHuman": false,
  "status": "read",
  "leadId": "64lea001",
  "sentAt": "2026-03-15T10:30:00Z",
  "deliveredAt": "2026-03-15T10:30:02Z",
  "readAt": "2026-03-15T10:31:15Z",
  "createdAt": "2026-03-15T10:30:00Z"
}
```

**Relationships:** Linked to `Lead` (leadId), `User` (assignedAgentId), groups into conversations via `conversationId`.

**Migration Notes:**

- Migrate existing `Activity` records where `type = whatsapp` into this collection
- Run `db.activities.aggregate([{$match:{type:"whatsapp"}}])` to identify candidates
- `conversationId` groups by `fromNumber` — create separate `WhatsAppConversation` collection in next migration wave

---

## Updated Indexes (Complete Reference)

| Collection     | Index Fields                             | Type          | Notes                |
| -------------- | ---------------------------------------- | ------------- | -------------------- |
| User           | `email`                                  | Unique        | Login                |
| User           | `firebaseUid`                            | Unique sparse | OAuth                |
| User           | `reraLicenseNumber`                      | Unique sparse | RERA validation      |
| Lead           | `assignedToId, status, score, createdAt` | Compound      | Dashboard queries    |
| Lead           | `phone`                                  | Unique sparse | Deduplication        |
| Lead           | `name, email, phone, company`            | Text          | Full-text search     |
| Lead           | `createdAt`                              | Single        | Date filtering       |
| Property       | `status, type, area, price`              | Compound      | Listing search       |
| Property       | `dldReference`                           | Unique sparse | DLD lookup           |
| Property       | `permitNumber`                           | Unique sparse | RERA check           |
| Property       | `title, location, description`           | Text          | Portal search        |
| Property       | `latitude, longitude`                    | 2dsphere      | Geo search           |
| Commission     | `agentId, status, createdAt`             | Compound      | Agent statements     |
| Commission     | `transactionId, agentId`                 | Unique        | Deduplication        |
| Transaction    | `leadId, propertyId, status`             | Compound      | Deal tracking        |
| AuditEvent     | `userId, timestamp`                      | Compound      | Actor audit          |
| AuditEvent     | `entityType, entityId, timestamp`        | Compound      | Entity history       |
| AuditEvent     | `timestamp`                              | TTL (7 years) | Data retention       |
| EjariRecord    | `ejariContractNumber`                    | Unique        | Ejari lookup         |
| EjariRecord    | `leaseId`                                | Unique        | Per-lease constraint |
| DLDTransaction | `dldTransactionReference`                | Unique        | DLD lookup           |
| CommissionRule | `transactionType, isDefault, isActive`   | Compound      | Rule resolution      |
| NadiaMessage   | `wamid`                                  | Unique        | WhatsApp dedup       |
| NadiaMessage   | `conversationId, createdAt`              | Compound      | Conversation view    |
| NadiaMessage   | `createdAt`                              | TTL (3 years) | PDPL retention       |

---

**Version:** 2.0 | **Last Updated:** May 2026 | **Maintained By:** @Barbara (Database Architect)
