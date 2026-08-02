# Software Design Document (SDD): Database Architecture & Schema

## 1. System Topology & Connection Architecture

The **Database Architecture** defines the data storage and query layer for White Caves Real Estate LLC. It utilizes Prisma Client configured with MongoDB Atlas, enforcing a global connection singleton pattern (`globalThis.prisma`) with `safeDbQuery` offline fallback wrappers.

---

## 🎨 Brand Palette Enforcement

- Primary Red (`#EF4444`): Database connection drop indicators, index health alerts.
- Pure White (`#FFFFFF`): ER diagrams and schema model cards.
- Slate Text (`#1E293B`): Field type annotations and query syntax.

---

## 🔗 Inter-Linked Navigation References

- [RBAC Gating](./rbac_state_gating_sdd.md) — 5-level role-based access control and state gating SDD.
- [Operations SRS](../01_requirements_engineering/srs_operations_logistics.md) — SRS for Form 12 Ejari evictions, PDC vault, and operations logistics.

---

## 2. Model Schemas & Collections

### 2.1 Managed Property Asset Model (`PropertyUnit`)
```prisma
model PropertyUnit {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  unitReference    String   @unique
  community        String   // e.g. "DAMAC Hills 2"
  cluster          String   // e.g. "Vardon", "Akoya"
  beds             Int
  baths            Int
  areaSqFt         Float
  priceAED         Float
  status           String   // AVAILABLE, UNDER_OFFER, SOLD, RENTED
  latitude         Float
  longitude        Float
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([community, cluster])
  @@index([status, priceAED])
}
```

### 2.2 Lead Lifecycle Model (`LeadIngestion`)
```prisma
model LeadIngestion {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  clientName       String
  clientPhone      String
  sourcePortal     String   // Bayut, PropertyFinder, Dubizzle, Direct
  score            Int
  assignedBrokerId String?
  slaExpiresAt     DateTime
  status           String   // NEW_LEAD, CONTACTED, VIEWING_SCHEDULED, CLOSING_OFFER
  createdAt        DateTime @default(now())

  @@index([assignedBrokerId, status])
}
```
