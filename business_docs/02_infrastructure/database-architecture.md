# Database Architecture — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Engineering
> **Document Owner:** Database Administrator / Engineering Lead
> **Review Cadence:** Quarterly

---

## 1. Overview

White Caves uses **MongoDB** as its primary database, accessed through **Prisma ORM** with the MongoDB connector. The database is hosted on **MongoDB Atlas** and stores all application data across 17 collections covering user management, property listings, lead tracking, transactions, lease management, WhatsApp conversations, and HR.

| Parameter | Value |
|-----------|-------|
| **Database Engine** | MongoDB 7.x |
| **Hosting** | MongoDB Atlas (cloud-managed) |
| **ORM** | Prisma 6.x with MongoDB connector |
| **Schema Location** | `prisma/schema.prisma` |
| **Total Models** | 17 |
| **Total Indexes** | 90+ |
| **ID Strategy** | MongoDB ObjectId (auto-generated, mapped to `@id @default(auto()) @map("_id") @db.ObjectId`) |

---

## 2. Data Model Reference

### 2.1 Entity Relationship Diagram

```
┌──────────┐    1:N    ┌──────────┐    N:1    ┌──────────┐
│   User   │──────────▶│ Property │◀──────────│   Lead   │
│          │           │          │           │          │
│ 12 roles │           │ 6 types  │           │ 8 statuses│
└────┬─────┘           └────┬─────┘           └────┬─────┘
     │                      │                      │
     │ 1:N            1:N   │   1:N          1:N   │
     ▼                      ▼                      ▼
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Activity │         │Transaction│         │Commission│
└──────────┘         └──────────┘         └──────────┘
                            │
                     ┌──────┴──────┐
                     ▼             ▼
              ┌──────────┐  ┌──────────┐
              │  Tenant  │  │  Lease   │
              └──────────┘  └──────────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │ Maintenance  │
                           └──────────────┘

┌───────────────────────────────────────┐
│         WhatsApp Subsystem            │
│  NadiaConversation → NadiaMessage     │
│  NadiaConversation → Queue            │
└───────────────────────────────────────┘

┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ Favorite │  │ SavedSearch  │  │JobApplication│
└──────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Complete Model Definitions

#### User

Core authentication and identity model. Central to all relationships.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK, auto-generated | — |
| `email` | String | Unique | Primary identifier |
| `name` | String | Required | Display name |
| `photoUrl` | String | Optional | Profile image URL |
| `role` | String | Default: `"agent"` | One of 12 canonical roles |
| `phone` | String | Optional | Contact number |
| `department` | String | Optional | Organizational unit |
| `status` | String | Default: `"active"` | `active`, `inactive`, `suspended` |
| `passwordHash` | String | Optional | bcrypt hash (12 rounds) |
| `firebaseUid` | String | Optional, indexed | Firebase Auth link |
| `createdAt` | DateTime | Auto-set | — |
| `updatedAt` | DateTime | Auto-updated | — |

**Relations:** properties, leadsAssigned, leadsCreated, activities, transactions, commissions, favorites, savedSearches, viewings, offersAsBuyer, leasesAsTenant, leasesAsLandlord, maintenanceRequests

#### Property

Real estate listing with full details and agent assignment.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK | — |
| `title` | String | Required | Listing headline |
| `description` | String | Optional | Full description |
| `type` | String | Enum | `villa`, `apartment`, `penthouse`, `commercial`, `land`, `townhouse` |
| `status` | String | Default: `"available"` | `available`, `reserved`, `sold`, `rented`, `off_market` |
| `price` | Float | Required | Price in AED |
| `bedrooms` | Int | Optional | — |
| `bathrooms` | Int | Optional | — |
| `sqft` | Int | Optional | Area in square feet |
| `location` | String | Optional | Address / community |
| `area` | String | Optional | Dubai area (e.g., Downtown, Marina) |
| `amenities` | String[] | Optional | Array of amenity tags |
| `images` | String[] | Optional | Array of image URLs |
| `featured` | Boolean | Default: `false` | Featured listing flag |
| `agentName` | String | Optional | Display name of listing agent |
| `userId` | ObjectId | FK → User | Agent who owns the listing |

**Relations:** user, leads, transactions, tenants, commissions, favorites, viewings, offers, leases, maintenanceRequests

#### Lead

Sales pipeline contact tracking with scoring.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK | — |
| `name` | String | Required | Contact name |
| `email` | String | Optional | — |
| `phone` | String | Optional | — |
| `company` | String | Optional | — |
| `status` | String | Default: `"new"` | `new`, `contacted`, `qualified`, `hot`, `warm`, `cold`, `won`, `lost` |
| `source` | String | Optional | `whatsapp`, `website`, `phone`, `referral`, `marketing`, `direct` |
| `budget` | Float | Optional | Budget in AED |
| `score` | Int | Default: `0` | 0–100 lead score |
| `notes` | String | Optional | — |
| `tags` | String[] | Optional | Custom tags |
| `lastContact` | DateTime | Optional | Last interaction timestamp |
| `assignedToId` | ObjectId | FK → User | Assigned agent |
| `createdById` | ObjectId | FK → User | Creator |
| `propertyId` | ObjectId | FK → Property | Associated property |

#### Activity

Audit trail for all system events.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK | — |
| `type` | String | Required | `lead`, `property`, `deal`, `commission`, `agent`, `client`, `system` |
| `action` | String | Required | `created`, `updated`, `deleted`, `status_changed`, `note_added`, `call`, `email`, `visit` |
| `description` | String | Optional | Human-readable summary |
| `metadata` | Json | Optional | Structured event data |
| `userId` | ObjectId | FK → User | Actor |
| `leadId` | ObjectId | FK → Lead | Related lead |

#### Transaction

Financial transaction records for sales and rentals.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK | — |
| `type` | String | Required | `sale`, `rental`, `lease` |
| `status` | String | Default: `"draft"` | `draft`, `pending`, `in_progress`, `completed`, `cancelled` |
| `amount` | Float | Required | Transaction value in AED |
| `closingDate` | DateTime | Optional | — |
| `notes` | String | Optional | — |
| `documents` | String[] | Optional | Document URLs |
| `propertyId` | ObjectId | FK → Property | — |
| `leadId` | ObjectId | FK → Lead | — |
| `agentId` | ObjectId | FK → User | — |

#### Commission

Agent commission tracking and payment management.

| Field | Type | Constraints | Notes |
|-------|------|------------|-------|
| `id` | ObjectId | PK | — |
| `amount` | Float | Required | Commission amount in AED |
| `percentage` | Float | Optional | Commission percentage |
| `type` | String | Required | `sale`, `rental`, `referral` |
| `status` | String | Default: `"pending"` | `pending`, `approved`, `paid`, `cancelled` |
| `paidAt` | DateTime | Optional | Payment date |
| `agentId` | ObjectId | FK → User | — |
| `leadId` | ObjectId | FK → Lead | — |
| `propertyId` | ObjectId | FK → Property | — |

#### Tenant, Lease, Maintenance

Property management models supporting lease lifecycle, tenant tracking, and maintenance requests. See `prisma/schema.prisma` for full field definitions.

#### Viewing & Offer

Scheduling and negotiation models for property viewings and purchase/rental offers.

#### Favorite & SavedSearch

User engagement models for bookmarked properties and saved filter configurations.

#### NadiaConversation, NadiaMessage, NadiaConversationQueue

WhatsApp integration models supporting conversation tracking, message history, and agent routing queue.

#### JobApplication

HR module for tracking recruitment applications.

---

## 3. Indexing Strategy

### 3.1 Index Categories

| Category | Count | Purpose |
|----------|-------|---------|
| **Single-field** | ~70 | Fast lookups on frequently queried fields |
| **Compound** | ~10 | Optimized multi-field queries |
| **Unique** | ~5 | Data integrity constraints |
| **Text** | Planned | Full-text search on property descriptions |

### 3.2 Key Compound Indexes

| Collection | Index Fields | Query Pattern |
|-----------|-------------|---------------|
| `Activity` | `{ type, action }` | Filter activities by type and action simultaneously |
| `Commission` | `{ agentId, status }` | Agent's commissions filtered by payment status |
| `Favorite` | `{ userId, propertyId }` (unique) | Prevent duplicate favorites; fast lookup |
| `Lead` | `{ assignedToId, status }` | Agent's leads filtered by pipeline stage |
| `Property` | `{ status, area }` | Available properties in a specific Dubai area |

### 3.3 Index Performance Guidelines

1. **Monitor index usage** via `db.collection.aggregate([{$indexStats:{}}])` monthly
2. **Drop unused indexes** — each index adds write overhead (~10% per index)
3. **Covered queries** — ensure common queries can be satisfied entirely from indexes
4. **Index size monitoring** — indexes should fit in RAM for optimal performance
5. **Background index builds** — use `{background: true}` for production index creation

### 3.4 Recommended Additional Indexes

| Collection | Proposed Index | Justification |
|-----------|---------------|---------------|
| `Property` | `{ title: "text", description: "text" }` | Full-text property search |
| `Lead` | `{ status: 1, lastContact: 1 }` | Stale lead identification queries |
| `Activity` | `{ createdAt: 1 }` TTL: 730 days | Auto-expire old activity logs |
| `NadiaMessage` | `{ conversationId: 1, timestamp: -1 }` | Efficient conversation history retrieval |

---

## 4. Data Lifecycle Management

### 4.1 Data Classification

| Classification | Collections | Retention | Archival |
|---------------|-------------|-----------|---------|
| **Regulatory** | Transaction, Lease, Commission | 7 years (UAE Commercial Law) | Cold storage after 2 years |
| **Operational** | Lead, Property, User | Active lifetime + 2 years | Archive after deactivation |
| **Transient** | Activity, NadiaMessage | 2 years | Auto-expire via TTL index |
| **Ephemeral** | NadiaConversationQueue | 30 days after completion | Auto-delete |
| **User-generated** | Favorite, SavedSearch | User lifetime | Delete on account closure |

### 4.2 Archival Strategy

```
Active Database (MongoDB Atlas)
    │
    │  Nightly job (2 years+ data)
    ▼
Archive Collection (same cluster, separate DB)
    │
    │  Monthly export (5 years+ data)
    ▼
Cold Storage (S3 Glacier / Azure Archive)
    │
    │  After 7 years (regulatory minimum)
    ▼
Secure Deletion (with audit trail)
```

### 4.3 Data Retention Policies

| Data Type | Active Period | Archive Period | Deletion |
|-----------|-------------|---------------|----------|
| **User accounts** | While active | 2 years post-deactivation | On request (PDPL right) |
| **Property listings** | While listed | 2 years post-sale/delist | Anonymize after 5 years |
| **Lead records** | Active pipeline | 2 years post-close | Anonymize after 5 years |
| **Transaction records** | 2 years | 5 additional years | After 7 years total |
| **WhatsApp messages** | 90 days active | 2 years archived | Auto-delete |
| **Activity logs** | 1 year | 1 additional year | Auto-expire (TTL) |
| **Job applications** | Active recruitment | 1 year post-decision | Delete |

---

## 5. Query Optimization Patterns

### 5.1 Pagination

All list endpoints use cursor-based or offset pagination:

```typescript
// Offset pagination (simple, used for most endpoints)
const results = await prisma.property.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
  where: filters
});

// Cursor pagination (preferred for large datasets)
const results = await prisma.lead.findMany({
  take: pageSize,
  cursor: lastId ? { id: lastId } : undefined,
  orderBy: { createdAt: 'desc' }
});
```

### 5.2 Projection (Field Selection)

Reduce data transfer by selecting only needed fields:

```typescript
// Dashboard: only need counts and summary fields
const leads = await prisma.lead.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    score: true,
    lastContact: true
  }
});
```

### 5.3 Aggregation Pipelines

For dashboard metrics and reporting, use MongoDB aggregation via Prisma raw queries:

```typescript
// Lead pipeline analysis
const pipeline = await prisma.lead.groupBy({
  by: ['status'],
  _count: { id: true },
  _avg: { score: true }
});

// Monthly transaction volume
const volume = await prisma.transaction.groupBy({
  by: ['type'],
  _sum: { amount: true },
  where: {
    createdAt: { gte: startOfMonth },
    status: 'completed'
  }
});
```

### 5.4 Common Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Fetching all documents | Memory exhaustion at scale | Always paginate (max 100 per page) |
| N+1 queries | Excessive database round trips | Use Prisma `include` for relations |
| Unbounded `$in` queries | Performance degradation | Limit array size to 100 items |
| Missing index on filter fields | Full collection scan | Add index for all `where` clause fields |
| Storing large blobs in MongoDB | Document size limit (16 MB) | Use object storage for files/images |

---

## 6. Migration Strategy

### 6.1 Prisma with MongoDB Workflow

MongoDB does not use traditional SQL migrations. Prisma with MongoDB uses `prisma db push` instead of `prisma migrate`:

```
Schema Change Workflow:
1. Edit prisma/schema.prisma
2. Run: npx prisma db push
3. Run: npx prisma generate (update client)
4. Test affected queries
5. Commit schema changes to Git
```

### 6.2 Schema Change Procedures

| Change Type | Risk Level | Procedure |
|-------------|-----------|-----------|
| **Add field** (optional) | Low | Add to schema → `db push` → deploy |
| **Add field** (required with default) | Low | Add with `@default` → `db push` → backfill → deploy |
| **Add field** (required, no default) | High | Add as optional → deploy → backfill → make required |
| **Rename field** | High | Add new field → deploy dual-write → migrate data → remove old field |
| **Remove field** | Medium | Stop reading field → deploy → remove from schema → `db push` |
| **Add index** | Low | Add to schema → `db push` (background build) |
| **Remove index** | Low | Remove from schema → `db push` |
| **Change field type** | High | Create new field → migrate data → swap reads → remove old |

### 6.3 Pre-Deployment Checklist

- [ ] Schema change reviewed by second engineer
- [ ] Backup created before `db push` on production
- [ ] Change tested on staging environment with production-like data
- [ ] Rollback plan documented
- [ ] Affected API endpoints identified and tested
- [ ] Index impact assessed (new indexes built in background)
- [ ] Data migration script prepared (if backfill needed)

---

## 7. Data Integrity Constraints

### 7.1 Application-Level Constraints

MongoDB lacks foreign key enforcement. Prisma models define relations but integrity is enforced at the application level:

| Constraint | Implementation |
|-----------|---------------|
| **Referential integrity** | Application-level checks before delete (cascade or restrict) |
| **Unique constraints** | `@unique` decorator enforced by MongoDB unique index |
| **Required fields** | Prisma schema validation on write |
| **Enum validation** | Application-level validation before database write |
| **Range validation** | Lead score (0–100), commission percentage (0–100) validated in API |
| **Composite uniqueness** | `@@unique([userId, propertyId])` on Favorite model |

### 7.2 Orphan Prevention

```typescript
// Before deleting a User, check for dependent records
async function safeDeleteUser(userId: string) {
  const deps = await Promise.all([
    prisma.property.count({ where: { userId } }),
    prisma.lead.count({ where: { assignedToId: userId } }),
    prisma.transaction.count({ where: { agentId: userId } })
  ]);

  if (deps.some(count => count > 0)) {
    throw new AppError('Cannot delete user with active records', 409);
  }

  await prisma.user.delete({ where: { id: userId } });
}
```

### 7.3 Data Validation Rules

| Collection | Field | Rule |
|-----------|-------|------|
| User | email | Valid email format, unique |
| User | role | Must be one of 12 canonical roles |
| Property | price | Positive number |
| Property | type | Must be valid enum value |
| Lead | score | Integer 0–100 |
| Lead | status | Must be valid pipeline stage |
| Transaction | amount | Positive number |
| Commission | percentage | 0–100 |
| Lease | endDate | Must be after startDate |

---

## 8. Backup & Restore Procedures

### 8.1 Automated Backups (MongoDB Atlas)

| Backup Type | Schedule | Retention | Recovery Time |
|-------------|----------|-----------|---------------|
| Continuous | Real-time (oplog) | 7 days | < 30 minutes |
| Daily Snapshot | 02:00 UTC | 30 days | 30–60 minutes |
| Weekly Snapshot | Sunday 02:00 UTC | 12 weeks | 30–60 minutes |
| Monthly Snapshot | 1st 02:00 UTC | 12 months | 1–2 hours |

### 8.2 Manual Backup Procedure

```bash
# Export all collections (for offline backup)
mongodump --uri="$DATABASE_URL" --out=./backup-$(date +%Y%m%d)

# Export specific collection
mongodump --uri="$DATABASE_URL" --collection=Transaction --out=./backup-txn

# Compress backup
tar -czf backup-$(date +%Y%m%d).tar.gz ./backup-$(date +%Y%m%d)
```

### 8.3 Restore Procedure

```bash
# Restore from Atlas snapshot
# Atlas Console → Clusters → Backup → Restore → Select snapshot

# Restore from manual backup
mongorestore --uri="$DATABASE_URL" ./backup-20260401

# Restore specific collection
mongorestore --uri="$DATABASE_URL" --collection=Transaction ./backup-txn/Transaction.bson

# Post-restore: verify schema alignment
npx prisma db push
npx prisma generate
```

### 8.4 Monthly Backup Verification

1. Restore latest daily snapshot to staging cluster
2. Compare document counts across all 17 collections
3. Verify sample records for data integrity
4. Run application smoke tests against restored data
5. Document results in backup verification log
6. Destroy staging cluster after verification

---

## 9. Performance Monitoring

### 9.1 Key Database Metrics

| Metric | Warning Threshold | Critical Threshold |
|--------|-------------------|-------------------|
| **Query execution time** | > 100 ms | > 500 ms |
| **Operations per second** | > 1,000 ops/s | > 5,000 ops/s |
| **Connection count** | > 80% of limit | > 95% of limit |
| **Index hit ratio** | < 95% | < 90% |
| **Document scan ratio** | > 10:1 (scanned:returned) | > 100:1 |
| **Storage utilization** | > 70% | > 85% |
| **Replication lag** | > 5 seconds | > 30 seconds |

### 9.2 Slow Query Log

Enable profiling for queries exceeding 100 ms:

```javascript
db.setProfilingLevel(1, { slowms: 100 });

// Review slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

### 9.3 Atlas Performance Advisor

Review Atlas Performance Advisor monthly for:

- Suggested index improvements
- Redundant index identification
- Schema design anti-pattern detection
- Query targeting recommendations

---

## 10. Security

### 10.1 Access Control

| Access Level | Who | Permissions |
|-------------|-----|-------------|
| **Atlas Admin** | CTO, Engineering Lead | Full cluster management |
| **Read/Write** | Application service account | CRUD on all collections |
| **Read-Only** | Analytics service account | Read on all collections |
| **Monitoring** | Monitoring service | `serverStatus`, `dbStats` only |

### 10.2 Network Security

- **IP Allowlist:** Only Vercel, K8s cluster, and VPN IPs
- **TLS:** All connections encrypted with TLS 1.2+
- **Authentication:** SCRAM-SHA-256
- **No public access:** Database not accessible from public internet

### 10.3 Data Encryption

| Layer | Method |
|-------|--------|
| **In transit** | TLS 1.2+ (enforced by Atlas) |
| **At rest** | AES-256 encryption (Atlas default) |
| **Field-level** | Planned for PII fields (Emirates ID, financial data) |
| **Backups** | Encrypted at rest (Atlas managed) |

---

*This document is maintained alongside the Prisma schema. Any schema changes must be reflected here within the same sprint. Review quarterly for accuracy.*
