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
