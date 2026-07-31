# Database Architecture & Compound Index Topology — White Caves Real Estate

> **Document Class:** Software Design Document (SDD)  
> **Repository Path:** `software_docs/02_software_design/database_architecture.md`  
> **ORMs & Drivers**: Prisma ORM (Relational PostgreSQL) + Mongoose (Document Store MongoDB)

---

## 🗄️ 1. Prisma Singleton Connection Pattern

To prevent connection pool exhaustion and handle local testing connection drops gracefully:

```typescript
// server/db.ts — Global Singleton Export
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

---

## ⚡ 2. Primary Database Entities & Schemas

### A. Property Asset Entity (`Property`)
- `id`: UUID (Primary Key)
- `title`: String
- `slug`: String (Unique Index)
- `priceAED`: Float (Indexed)
- `locationCluster`: String (Indexed - e.g. "DAMAC Hills 2")
- `bedrooms`: Int
- `bathrooms`: Int
- `areaSqFt`: Float
- `status`: Enum (`AVAILABLE`, `RESERVED`, `RENTED`, `SOLD`)
- `reraPermitNumber`: String (Unique)
- `images`: String[] (Unsplash CDN URLs fallback)

### B. Lead Entry Entity (`Lead`)
- `id`: UUID (Primary Key)
- `clientName`: String
- `clientEmail`: String
- `clientPhone`: String
- `source`: Enum (`WHATSAPP_NADIA`, `WEBSITE_PORTAL`, `PROPERTY_FINDER`, `BAYUT`)
- `assignedAgentId`: UUID (Foreign Key ➔ User)
- `slaDeadline`: DateTime (15-min SLA timer)
- `status`: Enum (`NEW`, `CONTACTED`, `VIEWING_SCHEDULED`, `OFFER_MADE`, `CLOSED_WON`, `CLOSED_LOST`)

---

## 🛡️ 3. Try-Catch Connection Guarding

All route controllers MUST wrap database transactions in error boundary blocks:

```typescript
try {
  const result = await db.property.findMany({ where: { status: 'AVAILABLE' } });
  res.json({ success: true, data: result });
} catch (error) {
  // Graceful fallback to synthetic mock dataset if database connection drops
  res.json({ success: true, data: mockProperties, fallbackMode: true });
}
```
