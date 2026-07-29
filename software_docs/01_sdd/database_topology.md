# Software Design Document — Database Topology & Data Architecture

**Document Class:** SDD-001 (System Design Document)  
**Module:** Database Layer — Prisma Client Singleton + MongoDB Atlas  
**Version:** 2026.07-SDD-V1  
**Owner:** @Barbara (Database Architect) + @Anima (Data Engineer)  
**RUP Phase:** Elaboration Gate Document  
**Last Updated:** 2026-07-29  
**Status:** ✅ Active — Production Aligned

---

## 1. Architecture Overview

White Caves operates a **MongoDB Atlas** document database accessed exclusively via **Prisma Client** in singleton-cached mode. The server layer (`server/`) is a Node.js + Express TypeScript application that connects to MongoDB using Prisma's embedded MongoDB connector.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WHITE CAVES DATA LAYER                           │
├──────────────────────────┬──────────────────────────────────────────┤
│   APPLICATION TIER       │           DATABASE TIER                  │
│                          │                                          │
│  Express Routes (.ts)    │    MongoDB Atlas Cluster                 │
│        │                 │           │                              │
│        ▼                 │           ▼                              │
│  Controllers (.ts)       │    Collections (BSON Documents)         │
│        │                 │           │                              │
│        ▼                 │           │                              │
│  Prisma Client ──────────┼──────────►│  Primary Replica Set        │
│  (Singleton Cache)       │           │  (3-node, auto-failover)    │
│                          │           │                              │
│  Mongoose Models (.js)   │    ◄──────│  Change Streams (real-time) │
│  (Legacy — migration)    │           │                              │
└──────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. Prisma Client Singleton Pattern

**File:** `server/lib/prisma.ts`

The Prisma client is instantiated **once** and cached on the Node.js global object to prevent connection pool exhaustion during hot-reloads in development.

```typescript
// server/lib/prisma.ts — Canonical Singleton
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const prisma: PrismaClient =
  globalThis.__prismaClient ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}

export default prisma;
```

**Connection String:** Injected via `DATABASE_URL` environment variable (`.env`). Must reference MongoDB Atlas SRV URI format:
```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/white_caves?retryWrites=true&w=majority
```

---

## 3. The Five Core Enterprise Asset Classes

White Caves organizes all persisted data around **5 enterprise asset classes**. Each maps to one or more MongoDB collections.

### Asset Class 1 — Property Inventory

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | MongoDB auto-generated primary key |
| `propertyCode` | String | Unique DLD reference code (e.g., `DAMAC-DH2-A101`) |
| `projectName` | String | Development name (e.g., `DAMAC Hills 2`) |
| `unitType` | Enum | `villa` \| `apartment` \| `townhouse` \| `penthouse` \| `plot` |
| `bedrooms` | Int | Number of bedrooms (0 = studio) |
| `bathrooms` | Float | Number of bathrooms |
| `areaSqFt` | Float | Area in square feet |
| `areaSqM` | Float | Area in square meters (auto-computed) |
| `priceAED` | Float | Listing price in AED |
| `stage` | Enum | `available` \| `reserved` \| `sold` \| `off_plan` \| `under_offer` |
| `developerId` | ObjectId | FK → Developer collection |
| `ownerId` | ObjectId | FK → OwnerPropertyMapping collection |
| `importSessionId` | String | Traceability → ImportSession |
| `createdAt` | DateTime | ISO 8601 timestamp |
| `updatedAt` | DateTime | ISO 8601 timestamp |

**Collection:** `property_inventory`  
**Model File:** `server/models/PropertyInventory.js`  
**Key Indexes:**
```javascript
{ propertyCode: 1 }           // unique
{ stage: 1, priceAED: 1 }     // listing queries
{ developerId: 1 }             // developer filter
{ createdAt: -1 }              // recency sort
```

---

### Asset Class 2 — Lead / Contact CRM

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `fullName` | String | Lead's full name |
| `email` | String | Primary email (unique per pipeline) |
| `phone` | String | UAE mobile (format: `+971XXXXXXXXX`) |
| `source` | Enum | `website` \| `whatsapp` \| `referral` \| `walk_in` \| `bayut` \| `property_finder` |
| `intentType` | Enum | `buy` \| `rent` \| `invest` \| `inquire` |
| `budgetAED` | Float | Declared budget in AED |
| `assignedBrokerId` | ObjectId | FK → User (broker) |
| `pipelineStage` | Enum | `new` \| `contacted` \| `qualified` \| `viewing` \| `offer` \| `closed` \| `lost` |
| `leadScore` | Int | 0–100 AI-computed score |
| `slaDeadline` | DateTime | 15-minute first-response SLA cutoff |
| `tags` | String[] | Free-form tags for search and segmentation |
| `createdAt` | DateTime | Lead ingestion timestamp |

**Collection:** `leads`  
**Key Indexes:**
```javascript
{ email: 1 }                              // unique
{ assignedBrokerId: 1, pipelineStage: 1 } // broker pipeline board
{ leadScore: -1 }                         // hot lead ranking
{ slaDeadline: 1 }                        // SLA monitoring queue
{ source: 1, createdAt: -1 }              // source analytics
```

---

### Asset Class 3 — Tenancy & Leasing Contracts

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `contractNumber` | String | RERA/DLD contract reference |
| `propertyId` | ObjectId | FK → PropertyInventory |
| `tenantId` | ObjectId | FK → User (tenant) |
| `landlordId` | ObjectId | FK → User (landlord) |
| `brokerId` | ObjectId | FK → User (broker) |
| `startDate` | DateTime | Tenancy commencement |
| `endDate` | DateTime | Tenancy termination |
| `annualRentAED` | Float | Yearly rent in AED |
| `chequeCount` | Int | Number of post-dated cheques (PDC) |
| `depositAED` | Float | Security deposit in AED |
| `ejariNumber` | String | Dubai Land Department EJARI registration number |
| `status` | Enum | `draft` \| `active` \| `expired` \| `terminated` \| `renewed` |
| `pdcTracking` | PDCRecord[] | Embedded array of cheque records |
| `createdAt` | DateTime | Contract creation timestamp |

**PDC Record Schema:**
```typescript
interface PDCRecord {
  chequeNumber: string;
  bankName: string;
  amountAED: number;
  dueDate: Date;
  status: 'pending' | 'presented' | 'cleared' | 'bounced';
  bouncedAt?: Date;
  bouncedReason?: string;
}
```

**Collection:** `tenancy_contracts`  
**Key Indexes:**
```javascript
{ contractNumber: 1 }              // unique
{ tenantId: 1, status: 1 }         // tenant portal queries
{ landlordId: 1, status: 1 }       // landlord portal queries
{ ejariNumber: 1 }                 // EJARI lookup
{ endDate: 1 }                     // renewal alerts
```

---

### Asset Class 4 — User Accounts & RBAC Profiles

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `uid` | String | Firebase Auth UID (unique, immutable) |
| `email` | String | Firebase email (unique) |
| `displayName` | String | Full name |
| `role` | Enum | `superadmin` \| `admin` \| `broker` \| `client` \| `landlord` \| `tenant` |
| `accessLevel` | Int | 1–5 (Level 5 = Managing Director master access) |
| `department` | Enum | `SALES` \| `FINANCE` \| `LEGAL` \| `OPERATIONS` \| `MARKETING` \| `EXECUTIVE` |
| `commissionRate` | Float | Broker commission % (0.0–1.0) |
| `isActive` | Boolean | Account status gate |
| `mfaEnabled` | Boolean | Two-factor authentication status |
| `lastLoginAt` | DateTime | Last successful login |
| `createdAt` | DateTime | Account creation timestamp |

**Collection:** `users`  
**Special Rule:** `arslanmalikgoraha@gmail.com` → `accessLevel: 5`, `role: superadmin` — force-injected at auth middleware level.

---

### Asset Class 5 — Import Sessions (Bulk Data Pipeline)

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `sessionId` | String | Human-readable session reference |
| `fileName` | String | Uploaded CSV/Excel file name |
| `status` | Enum | `queued` \| `processing` \| `completed` \| `failed` \| `partial` |
| `totalRows` | Int | Total rows in imported file |
| `propertiesCreated` | Int | New properties written |
| `propertiesUpdated` | Int | Existing properties updated |
| `ownersCreated` | Int | New owner records written |
| `duplicatesFound` | Int | Duplicate rows detected and skipped |
| `successRate` | Float | Percentage (0–100) |
| `totalErrors` | Int | Parse/validation error count |
| `importErrors` | ErrorRecord[] | Embedded error detail array |
| `importedBy` | String | User ID of initiating user |
| `createdAt` | DateTime | Session start timestamp |
| `completedAt` | DateTime | Session end timestamp |

**Collection:** `import_sessions`

---

## 4. Connection Lifecycle & Health Monitoring

### Startup Sequence
```
1. Express server boots → server/index.ts
2. Prisma Client singleton instantiated → server/lib/prisma.ts
3. MongoDB Atlas connection established (SRV DNS lookup)
4. Replica set handshake completed (primary + 2 secondaries confirmed)
5. Express routes registered → server listening on PORT
6. Health endpoint active → GET /api/health returns { db: "connected" }
```

### Health Check Endpoint
```
GET /api/health
Response: {
  status: "healthy",
  database: "connected" | "disconnected",
  uptime: <seconds>,
  memoryUsage: <percent>
}
```

---

## 5. Migration Policy: Mongoose → Prisma

Legacy routes in `server/routes/*.js` use Mongoose models directly. The migration path:

1. **Phase A** — New routes written exclusively in TypeScript using Prisma
2. **Phase B** — Existing `.js` routes converted to `.ts` with Prisma client
3. **Phase C** — Mongoose model files deprecated and removed

**Current Status:**  
- ✅ `server/routes/leasing-inventory.ts` — Prisma-ready  
- ✅ `server/routes/secondary-sales.ts` — Prisma-ready  
- 🟡 `server/routes/importHistory.routes.js` — Mongoose (migration pending)  
- 🟡 `server/routes/recruitment.js` — Mongoose (migration pending)

---

## 6. Index Strategy & Performance Targets

| Query Pattern | Target Latency | Index Strategy |
|---|---|---|
| Single property lookup by code | < 5ms | Unique index on `propertyCode` |
| Lead pipeline board (broker view) | < 20ms | Compound: `assignedBrokerId + pipelineStage` |
| SLA queue (next due lead) | < 10ms | `slaDeadline: 1` ascending |
| Import session history (paginated) | < 30ms | `userId + createdAt: -1` compound |
| Tenancy renewal alerts | < 15ms | `endDate: 1` range scan |
| Hot lead leaderboard | < 10ms | `leadScore: -1` descending |

---

*This SDD is governed by `software_docs/core_engineering_manifest.md` and must be kept in sync with Prisma schema changes in `prisma/schema.prisma`.*
