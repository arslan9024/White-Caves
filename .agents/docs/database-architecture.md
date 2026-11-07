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

---

## 11. MongoDB Atlas Cluster Configuration

### 11.1 Tier-per-Environment Specification

| Environment | Atlas Tier | RAM | Storage | vCPUs | Approx. Cost/Mo (USD) | Max Connections | Purpose |
|-------------|-----------|-----|---------|-------|----------------------|-----------------|---------|
| **Local Dev** | M0 (Free) | 512 MB shared | 512 MB | Shared | Free | 100 | Developer workstations |
| **CI / Testing** | M0 (Free) | 512 MB shared | 512 MB | Shared | Free | 100 | Automated test pipelines |
| **Staging** | M10 | 2 GB | 10 GB NVMe SSD | 2 vCPU | ~$57 | 350 | Pre-production validation |
| **Production (Phase 1: 0–50 agents)** | M20 | 4 GB | 20 GB NVMe SSD | 2 vCPU | ~$144 | 700 | Initial launch |
| **Production (Phase 2: 50–300 agents)** | M30 | 8 GB | 40 GB NVMe SSD | 2 vCPU | ~$389 | 3,000 | Growth tier |
| **Production (Phase 3: 300–2,000 agents)** | M50 | 32 GB | 160 GB NVMe SSD | 8 vCPU | ~$749 | 3,000 | Scale tier |
| **Production (Phase 4: 2,000+ agents)** | M80 | 128 GB | 1 TB NVMe SSD | 32 vCPU | ~$2,844 | 3,000 | Enterprise tier |

**Automatic Upgrade Triggers (monitored via Atlas alerts):**

| Trigger | Metric | Threshold | Action |
|---------|--------|-----------|--------|
| Connection pressure | Connection count | > 70% of pool limit for 30 min | Scale up one tier |
| CPU saturation | Normalized CPU | > 70% sustained for 15 min | Scale up one tier |
| Storage pressure | Disk utilization | > 75% | Enable auto-disk scaling or upgrade |
| RAM pressure | Working set size | > 80% of RAM | Scale up one tier |
| Query degradation | P95 query latency | > 100 ms sustained | Investigate + scale |

**Auto-scaling configuration (production):**

```json
{
  "autoScaling": {
    "compute": {
      "enabled": true,
      "scaleDownEnabled": false,
      "minInstanceSize": "M20",
      "maxInstanceSize": "M80"
    },
    "diskGBEnabled": true
  }
}
```

*Scale-down is disabled in production to prevent cold-start latency. Manual downgrades require Engineering Lead approval.*

**Acceptance Criteria:**
- [ ] Atlas cluster deployed with primary + secondary electable nodes in UAE North (Dubai) region
- [ ] Analytics node provisioned in same UAE region (read-only, offloads reporting queries)
- [ ] Auto-scaling enabled from M20 to M80 (scale-up only in production)
- [ ] Billing alerts configured at AED 2,000/month and AED 5,000/month thresholds
- [ ] Atlas Backup enabled with point-in-time recovery (PIT) active

### 11.2 Atlas Cluster Topology

```
UAE North (Dubai) — Primary Region
├── PRIMARY node       [Electable, Priority 7]  ← All writes
├── SECONDARY node     [Electable, Priority 6]  ← Failover candidate
└── ANALYTICS node     [Read-only, Priority 0]  ← Reporting queries

Bahrain (ME-South-1) — DR Region (Tier-1 failover only)
└── SECONDARY node     [Electable, Priority 5]  ← Cross-region DR
```

**Replica set `writeConcern` policy:** `{ w: "majority", j: true }` for all write operations ensures data durability across at least 2 nodes before acknowledging.

**Replica set `readPreference` policy by use case:**

| Use Case | readPreference | Reason |
|----------|---------------|--------|
| API writes | `primary` | Strict consistency |
| API reads (property list, lead list) | `primaryPreferred` | Consistency with load distribution |
| Analytics queries (dashboard, reports) | `secondary` (analytics node) | Offload from primary |
| AML/compliance audit queries | `primary` | Strict consistency required |

### 11.3 Connection Pool Configuration

| Setting | M10 (Staging) | M20 (Prod P1) | M30 (Prod P2) | Notes |
|---------|--------------|--------------|--------------|-------|
| `maxPoolSize` | 10 | 25 | 50 | Max simultaneous connections per app instance |
| `minPoolSize` | 2 | 5 | 10 | Pre-warmed connections on pod startup |
| `waitQueueTimeoutMS` | 5,000 | 10,000 | 10,000 | Reject request if pool exhausted for this long |
| `serverSelectionTimeoutMS` | 5,000 | 5,000 | 5,000 | Atlas failover detection window |
| `socketTimeoutMS` | 30,000 | 30,000 | 30,000 | Single query timeout (kills runaway queries) |
| `maxIdleTimeMS` | 60,000 | 120,000 | 120,000 | Close idle connections to reduce Atlas billing |
| `heartbeatFrequencyMS` | 10,000 | 10,000 | 10,000 | Replica set health check interval |
| `connectTimeoutMS` | 10,000 | 10,000 | 10,000 | Initial TCP connection timeout |

**Production `DATABASE_URL` with pool parameters:**

```
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>.ae-north.mongodb.net/whitecaves
  ?retryWrites=true
  &w=majority
  &journal=true
  &maxPoolSize=25
  &minPoolSize=5
  &waitQueueTimeoutMS=10000
  &serverSelectionTimeoutMS=5000
  &socketTimeoutMS=30000
  &maxIdleTimeMS=120000
  &heartbeatFrequencyMS=10000
  &tls=true
  &tlsAllowInvalidCertificates=false"
```

**Acceptance Criteria:**
- [ ] Connection pool metrics (active, idle, pending) logged to monitoring platform
- [ ] Alert fires at 70% connection pool utilization
- [ ] Application startup validates DB connection within 10 seconds or fails fast
- [ ] Pool exhaustion error (`waitQueueTimeoutMS`) triggers PagerDuty P2 alert
- [ ] Each Kubernetes pod has its own pool; total Atlas connections = `maxPoolSize × pod_count ≤ Atlas tier limit`

---

## 12. Comprehensive Index Reference

All indexes are defined in `prisma/schema.prisma` via `@@index` and `@@unique` directives. This section documents every production-required index with its query rationale, target latency, and testability verification command.

**General index rules:**
1. Every field used in a `WHERE` clause must have a supporting index
2. Compound index field order: **equality fields first, then sort fields, then range fields**
3. All indexes are built with `{ background: true }` in production to avoid locking
4. Index memory footprint must remain below 80% of available RAM (monitored via Atlas)

---

### 12.1 `users` Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `users_email_unique` | `{ email: 1 }` | Unique | Login, registration dedup |
| `users_firebaseUid` | `{ firebaseUid: 1 }` | Single, Sparse | Firebase sync endpoint |
| `users_role_status` | `{ role: 1, status: 1 }` | Compound | Agent roster by role+status |
| `users_department_role` | `{ department: 1, role: 1 }` | Compound | Org chart queries |
| `users_status_createdAt` | `{ status: 1, createdAt: -1 }` | Compound | Active users, chronological |
| `users_phone` | `{ phone: 1 }` | Single, Sparse | WhatsApp contact lookup |
| `users_createdAt` | `{ createdAt: -1 }` | Single | Onboarding analytics |

**Verification:**
```js
db.users.getIndexes()  // Must return 7 entries
db.users.explain('executionStats').findOne({ email: 'test@wc.ae' })
// Expected: winningPlan.stage = 'IXSCAN', totalDocsExamined = 1
```

---

### 12.2 `properties` Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `prop_userId` | `{ userId: 1 }` | Single | Agent's property list |
| `prop_status_area` | `{ status: 1, area: 1 }` | Compound | Available properties in area |
| `prop_type_status` | `{ type: 1, status: 1 }` | Compound | Type-filtered property search |
| `prop_price` | `{ price: 1 }` | Single | Budget range filter |
| `prop_area_price` | `{ area: 1, price: 1 }` | Compound | Area + budget combined filter |
| `prop_bedrooms_type` | `{ bedrooms: 1, type: 1 }` | Compound | Bedroom-filtered search |
| `prop_featured_status` | `{ featured: 1, status: 1 }` | Compound | Featured listings carousel |
| `prop_createdAt` | `{ createdAt: -1 }` | Single | Latest listings sort |
| `prop_status_createdAt` | `{ status: 1, createdAt: -1 }` | Compound | New available listings |
| `prop_text` | `{ title: 'text', description: 'text', area: 'text', location: 'text' }` | Text | Full-text property search |
| `prop_location_2d` | `{ coordinates: '2dsphere' }` | Geospatial | Radius / polygon map search |

**Performance target:** Property list query with `status + area` filter must complete in **< 15 ms p99** on M20.

**Acceptance Criteria:**
- [ ] `db.properties.explain().find({ status:'available', area:'Marina' })` → `IXSCAN` on `prop_status_area`
- [ ] Text search index covers Arabic characters (collation: `{ locale: 'ar' }`)
- [ ] Geospatial index covers `{ type: 'Point', coordinates: [lng, lat] }` GeoJSON format
- [ ] Partial index on `{ status: 'available' }` reduces index size for inactive listings

---

### 12.3 `leads` Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `lead_assignedToId` | `{ assignedToId: 1 }` | Single | Agent's full lead list |
| `lead_agent_status` | `{ assignedToId: 1, status: 1 }` | Compound | Agent pipeline by stage |
| `lead_agent_score` | `{ assignedToId: 1, score: -1 }` | Compound | Agent's hot leads |
| `lead_status` | `{ status: 1 }` | Single | Pipeline aggregation |
| `lead_score` | `{ score: -1 }` | Single | Hot lead leaderboard |
| `lead_source` | `{ source: 1 }` | Single | Lead source analytics |
| `lead_propertyId` | `{ propertyId: 1 }` | Single | Property's interested leads |
| `lead_createdById` | `{ createdById: 1 }` | Single | Creator audit trail |
| `lead_lastContact` | `{ lastContact: 1 }` | Single | Stale lead identification |
| `lead_status_lastContact` | `{ status: 1, lastContact: 1 }` | Compound | Follow-up queue (status + recency) |
| `lead_createdAt` | `{ createdAt: -1 }` | Single | New leads report |
| `lead_phone_email` | `{ phone: 1, email: 1 }` | Compound | Duplicate detection on import |
| `lead_tags` | `{ tags: 1 }` | Multikey | Tag-filtered lead list |

**Performance target:** Agent pipeline query (`assignedToId + status`) must complete in **< 20 ms p99** on M20.

**Acceptance Criteria:**
- [ ] Duplicate detection query (phone + email) runs on import; warns before save
- [ ] Stale lead cron (`lastContact < 7 days, status != 'won'`) uses `lead_status_lastContact`
- [ ] `lead_agent_status` covers the most common CRM query: "show me my active leads"

---

### 12.4 `leases` Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `lease_propertyId` | `{ propertyId: 1 }` | Single | Property lease history |
| `lease_tenantId` | `{ tenantId: 1 }` | Single | Tenant's lease portfolio |
| `lease_landlordId` | `{ landlordId: 1 }` | Single | Landlord's portfolio |
| `lease_agentId` | `{ agentId: 1 }` | Single | Agent's managed leases |
| `lease_status` | `{ status: 1 }` | Single | Active lease count |
| `lease_status_endDate` | `{ status: 1, endDate: 1 }` | Compound | Expiring leases (renewal workflow) |
| `lease_nextPaymentDue` | `{ status: 1, nextPaymentDue: 1 }` | Compound | Payment reminder cron |
| `lease_ejariNumber` | `{ ejariNumber: 1 }` | Unique, Sparse | Ejari certificate lookup / dedup |
| `lease_endDate` | `{ endDate: 1 }` | Single | 90/60/30-day expiry reminders |
| `lease_startDate` | `{ startDate: -1 }` | Single | Recent lease chronology |

**Acceptance Criteria:**
- [ ] `lease_ejariNumber` unique index prevents duplicate Ejari registrations (RERA compliance)
- [ ] Expiry reminder cron (`endDate BETWEEN now AND +90 days, status='active'`) uses `lease_status_endDate`
- [ ] Payment cron (`nextPaymentDue <= today, status='active'`) uses `lease_nextPaymentDue`
- [ ] Lease model has no TTL index — lease records retained 7 years per UAE law

---

### 12.5 `activities` (Audit Events) Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `act_userId_createdAt` | `{ userId: 1, createdAt: -1 }` | Compound | User activity feed |
| `act_leadId_createdAt` | `{ leadId: 1, createdAt: -1 }` | Compound | Lead audit history |
| `act_type_action` | `{ type: 1, action: 1 }` | Compound | Compliance report filters |
| `act_type_createdAt` | `{ type: 1, createdAt: -1 }` | Compound | Type-filtered activity log |
| `act_action_createdAt` | `{ action: 1, createdAt: -1 }` | Compound | Action-type trend analysis |
| `act_createdAt_ttl` | `{ createdAt: 1 }` | TTL | Auto-expire operational logs (730 days) |
| `act_propertyId` | `{ propertyId: 1 }` | Single, Sparse | Property audit timeline |

> **CRITICAL — Compliance Exception:** The TTL index (`expireAfterSeconds: 63072000`) applies only to documents where `{ type: { $in: ['lead', 'property', 'deal', 'agent', 'client'] } }`. Documents with `type: 'system'` or `type: 'compliance'` or `type: 'aml'` are **excluded from TTL expiry** and retained for 7 years in a separate `compliance_audit_events` collection.

**Acceptance Criteria:**
- [ ] TTL index verified: compliance-tagged events survive beyond 730-day TTL
- [ ] `act_userId_createdAt` covers the primary activity feed query (< 10 ms p99)
- [ ] Activity log is append-only: no `updateOne` or `deleteOne` operations exist in application code
- [ ] Compliance audit collection has 7-year TTL (`expireAfterSeconds: 220752000`)
- [ ] `act_type_action` compound index covers RERA compliance audit report

---

### 12.6 `transactions` Collection Indexes

| Index Name | Fields | Type | Query Pattern |
|-----------|--------|------|---------------|
| `txn_agentId` | `{ agentId: 1 }` | Single | Agent transaction list |
| `txn_propertyId` | `{ propertyId: 1 }` | Single | Property transaction history |
| `txn_status` | `{ status: 1 }` | Single | Deal status pipeline |
| `txn_type` | `{ type: 1 }` | Single | Sale vs rental analytics |
| `txn_agent_status` | `{ agentId: 1, status: 1 }` | Compound | Agent's active deals |
| `txn_type_createdAt` | `{ type: 1, createdAt: -1 }` | Compound | Monthly revenue report |
| `txn_closingDate` | `{ closingDate: -1 }` | Single | Recent closed deals |
| `txn_amount` | `{ amount: -1 }` | Single | High-value deal sort |

> **⚠️ TTL FORBIDDEN:** Transaction records must be retained for **7 years** per UAE Federal Law No. 18 of 1993 (Commercial Transactions Law) and AML Law No. 20 of 2018. No TTL index may be applied to this collection.

---

### 12.7 WhatsApp Collections Indexes

| Collection | Index Fields | Type | Purpose |
|-----------|-------------|------|---------|
| `nadiaconversations` | `{ customerPhone: 1 }` | Unique | Phone-based conversation lookup |
| `nadiaconversations` | `{ status: 1, updatedAt: -1 }` | Compound | Active conversation queue |
| `nadiaconversations` | `{ assignedAgentId: 1 }` | Single | Agent's conversation queue |
| `nadiaconversations` | `{ leadId: 1 }` | Single, Sparse | Lead-linked conversations |
| `nadiaMessages` | `{ conversationId: 1, timestamp: -1 }` | Compound | Message history (primary query) |
| `nadiaMessages` | `{ messageId: 1 }` | Unique | Deduplication (Meta idempotency) |
| `nadiaMessages` | `{ timestamp: 1 }` | TTL (90 days active) | Active message expiry |
| `nadiaconversationQueues` | `{ status: 1, priority: -1 }` | Compound | Queue processing order |
| `nadiaconversationQueues` | `{ assignedAgentId: 1 }` | Single | Agent's incoming queue |

**Performance target:** Message history retrieval for a conversation must complete in **< 30 ms p99**.

---

## 13. PDPL & UAE Data Residency Compliance

### 13.1 Data Residency Requirement

> **MANDATORY:** All personal data of UAE residents must be stored and processed within the UAE. This is a hard architectural constraint, not a preference.

**Regulatory basis:**

| Law / Regulation | Article | Obligation |
|-----------------|---------|-----------|
| UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) | Art. 22 | Cross-border transfer permitted only to approved countries or under Standard Contractual Clauses (SCCs) |
| UAE National Cybersecurity Strategy 2021–2025 | — | Data localization mandated for sensitive categories |
| RERA Circular (Real Estate Transaction Data) | — | Transaction and party data accessible to UAE regulators |
| CBUAE AML Guidelines | Sec. 5 | AML/KYC records must remain in UAE jurisdiction |

**Data residency matrix:**

| Data Category | Residency Requirement | MongoDB Atlas Region | Fallback DR Region |
|--------------|----------------------|---------------------|-------------------|
| Personal data (name, email, phone, Emirates ID) | **UAE only** | `UAE_NORTH` (Abu Dhabi) | Bahrain `ME_SOUTH_1` (SCC required) |
| Financial records (transactions, commissions, invoices) | **UAE only** | `UAE_NORTH` | Bahrain `ME_SOUTH_1` (SCC required) |
| AML / KYC records | **UAE only** (CBUAE mandate) | `UAE_NORTH` | No cross-border permitted |
| RERA-regulated property records | **UAE only** | `UAE_NORTH` | Bahrain `ME_SOUTH_1` (SCC required) |
| WhatsApp message logs | **UAE only** | `UAE_NORTH` | Bahrain `ME_SOUTH_1` (SCC required) |
| Anonymized analytics (no PII) | No restriction | Any region | Any |
| Application logs (no PII) | No restriction | Any region | Any |

**Atlas cluster configuration for compliance:**

```
Cluster: white-caves-prod
Primary region:   UAE_NORTH (Abu Dhabi)  — Priority 7  ← MANDATORY, all writes
Secondary region: UAE_EAST  (Dubai)      — Priority 6  ← Failover (if Atlas provides)
Analytics node:   UAE_NORTH             — Priority 0  ← Reporting offload
DR replica:       ME_SOUTH_1 (Bahrain)  — Priority 5  ← DR only; SCC in place
```

> **Note on Bahrain DR replica:** Bahrain is an approved GCC jurisdiction under the UAE–GCC cooperation framework. However, a Data Processing Agreement (DPA) with MongoDB Inc. and Standard Contractual Clauses (SCCs) must be executed before enabling the Bahrain replica. Legal review is mandatory before production activation.

### 13.2 PDPL Compliance Checklist

| Requirement | PDPL Article | Implementation | Acceptance Criteria |
|------------|-------------|---------------|---------------------|
| Lawful basis for processing | Art. 5 | Consent at registration; contractual necessity for transactions | [ ] Consent timestamp stored per User record (`consentGivenAt` field) |
| Purpose limitation | Art. 8 | Data used for CRM only; no secondary data monetization | [ ] Data processing register maintained; reviewed quarterly |
| Data minimization | Art. 9 | Optional fields marked in schema; no over-collection | [ ] Schema audit confirms no PII fields beyond stated purpose |
| Storage limitation (retention) | Art. 10 | TTL indexes + nightly archival cron | [ ] Retention policy enforced; monthly cron audit report |
| Right to Access | Art. 16 | `GET /api/user/export` → JSON download | [ ] Response generated within 30 days; includes all PII fields |
| Right to Erasure | Art. 17 | `DELETE /api/user` → cascade anonymize | [ ] Deletion + anonymization within 30 days; logs retained |
| Right to Data Portability | Art. 18 | CSV/JSON export endpoint | [ ] All personal data exportable in machine-readable format |
| Cross-border transfer controls | Art. 22 | UAE-region Atlas primary; SCC for DR replica | [ ] SCC executed with MongoDB Inc.; reviewed annually |
| Data breach notification | Art. 43 | 72-hour notification to UAE TDRA | [ ] Incident response procedure tested annually; template ready |
| Data Protection Officer (DPO) | Art. 25 | Named DPO within organization | [ ] DPO contact in all privacy notices and consent forms |
| Privacy by Design | Art. 4 | RBAC + encryption + access logging by default | [ ] Security review checklist for every new data field |
| Consent management | Art. 6 | Opt-in checkbox; marketing opt-out | [ ] Consent version tracked; re-consent on policy change |

### 13.3 AML / CBUAE Data Requirements

Real estate transactions are subject to UAE AML/CFT obligations:

| Law | Obligation |
|-----|-----------|
| Federal Law No. 20 of 2018 (AML Law) | Customer Due Diligence (CDD), record keeping 7+ years |
| Cabinet Decision No. 10 of 2019 (AML Regulation) | Enhanced Due Diligence for high-risk clients |
| RERA Circular No. 02/2022 (Real Estate AML) | AML obligations specific to real estate brokers |
| CBUAE Guidance on Real Estate AML | STR filing, PEP screening, cash transaction thresholds |

**AML data fields and storage requirements:**

| Field | Model | Retention | Access Roles |
|-------|-------|-----------|-------------|
| Emirates ID / Passport copy | `User`, `Tenant` | 7 years post-relationship end | `owner`, `admin`, `compliance` |
| Source of funds declaration | `Transaction.metadata` | 7 years | `owner`, `finance`, `compliance` |
| PEP (Politically Exposed Person) flag | `User.isPEP` | 7 years | `owner`, `admin`, `compliance` |
| Beneficial ownership records | `Transaction.beneficialOwner` | 7 years | `owner`, `compliance` |
| Suspicious Transaction Report (STR) references | `Transaction.strReference` | 7 years | `owner`, `compliance` |
| CDD completion date | `User.cddCompletedAt` | 7 years | `owner`, `admin` |
| Cash transaction flag | `Transaction.isCash` | 7 years | `owner`, `finance` |

**Cash threshold (RERA/CBUAE):** Transactions where cash component exceeds **AED 55,000** require source of funds declaration. API validation must block `Transaction` creation above this threshold without `sourceOfFunds` field populated.

**Encryption for AML records:**
- **At rest:** AES-256 (Atlas default encryption — no additional configuration required)
- **In transit:** TLS 1.3 minimum (set Atlas TLS minimum version to `TLS1_2` currently; target `TLS1_3` post-Atlas GA)
- **Field-level encryption (target):** Client-side field-level encryption (CSFLE) for `emiratesId` and `passportNumber` fields using Atlas CSFLE feature

**Acceptance Criteria:**
- [ ] AML-tagged documents survive TTL expiry (TTL index must NOT apply to AML collection)
- [ ] `sourceOfFunds` field required for `Transaction.amount > 55000` AED — API returns 400 without it
- [ ] AML records visible only to `owner`, `admin`, `finance`, `compliance` roles
- [ ] Quarterly AML record count audit report sent to Compliance Officer
- [ ] PEP flag triggers "Enhanced Due Diligence" workflow in lead management

---

## 14. Query Performance Targets

### 14.1 p99 Latency Targets per Query Category

All database queries must meet these targets in production (M20+ tier, warm connection pool, warm OS page cache):

| Query Category | p50 | p95 | **p99** | Action if Breached |
|---------------|-----|-----|---------|-------------------|
| Single document by `_id` | < 3 ms | < 8 ms | **< 20 ms** | Verify index; check network |
| Single document by unique indexed field | < 5 ms | < 10 ms | **< 25 ms** | Verify unique index |
| Paginated list (20 docs, compound index) | < 8 ms | < 20 ms | **< 50 ms** | Add compound index |
| Property search (status + area + type) | < 10 ms | < 25 ms | **< 50 ms** | Review compound index order |
| Lead list (assignedTo + status) | < 8 ms | < 20 ms | **< 50 ms** | Verify `lead_agent_status` index |
| Lease expiry check (cron query) | < 10 ms | < 30 ms | **< 50 ms** | Verify `lease_status_endDate` |
| Aggregation: group by + count | < 20 ms | < 50 ms | **< 100 ms** | Route to analytics node |
| Full-text search (text index) | < 50 ms | < 100 ms | **< 200 ms** | Upgrade to Atlas Search |
| Dashboard aggregation (multi-stage) | < 100 ms | < 200 ms | **< 500 ms** | Pre-compute + Redis cache |
| AML / compliance report (7-year data) | < 200 ms | < 500 ms | **< 1,000 ms** | Cold storage query path |

**Overall target: p99 < 50 ms for all standard CRUD queries** (indexed, warm cache). Dashboard and reporting queries may use the analytics node with a separate p99 budget of 500 ms.

### 14.2 Slow Query Configuration

```javascript
// Atlas profiler threshold — logs queries exceeding 50 ms
db.setProfilingLevel(1, { slowms: 50 });

// Review slow queries (run weekly)
db.system.profile.find({ millis: { $gt: 50 } })
  .sort({ ts: -1 })
  .limit(20)
  .project({ op: 1, ns: 1, millis: 1, ts: 1, planSummary: 1 });

// Check for collection scans in slow query log
db.system.profile.find({ "planSummary": /COLLSCAN/ }).count();
// Expected: 0 in production
```

### 14.3 Index Coverage CI Check

Every API endpoint's primary query shape must be verified via CI to avoid COLLSCAN in production:

```bash
# scripts/db-explain-check.js  (run in CI pipeline against staging DB)
# Checks all registered query shapes return IXSCAN, not COLLSCAN

node scripts/db-explain-check.js
# PASS: All 47 query shapes use index scan
# FAIL: Property search query using COLLSCAN — add compound index
```

**Acceptance Criteria:**
- [ ] CI pipeline runs `db-explain-check.js` on every PR that changes Prisma queries
- [ ] Zero COLLSCAN entries in production slow query log
- [ ] Atlas Performance Advisor reviewed monthly; all HIGH-priority suggestions actioned within 1 sprint
- [ ] Index memory footprint < 80% of Atlas tier RAM (monitored via Atlas alert)
- [ ] New endpoint queries peer-reviewed for index coverage before merge

---

## 15. Backup Schedule & Retention Policy (Detailed)

### 15.1 Full Backup Matrix

| Type | Schedule | Retention | Storage | Encryption | RTO |
|------|----------|-----------|---------|------------|-----|
| Continuous oplog backup | Real-time | 7 days PIT | Atlas Cloud (UAE) | AES-256 | < 5 min (PIT restore) |
| Daily snapshot | 02:00 GST daily | 30 days | Atlas Cloud (UAE) | AES-256 | < 45 min |
| Weekly snapshot | Sunday 02:00 GST | 12 weeks | Atlas Cloud (UAE) + S3 | AES-256 | < 60 min |
| Monthly snapshot | 1st of month 02:00 GST | 24 months | Atlas + S3 Glacier (UAE) | AES-256 | < 2 hours |
| Annual compliance archive | 1st Jan 02:00 GST | 7 years | S3 Glacier (UAE, `me-south-1`) | AES-256 | < 4 hours |
| Pre-deployment backup | Before every prod deploy | Indefinite (tagged with git SHA) | S3 (UAE) | AES-256 | < 45 min |

**Backup window rationale:** 02:00 GST (UTC+4) = 22:00 UTC. Dubai agents work 09:00–18:00 GST. This is the lowest-traffic window, minimizing backup I/O impact on query latency.

**UAE S3 storage location:** All S3 buckets used for backup must be in `me-south-1` (Bahrain) or `me-central-1` (UAE) region to satisfy PDPL data residency requirements.

### 15.2 Backup Verification Schedule

| Verification | Frequency | Method | Pass Criteria |
|-------------|-----------|--------|---------------|
| Snapshot checksum | Daily (Atlas automated) | Built-in Atlas integrity check | Checksum match; Atlas alert if fail |
| Restore test to staging | Monthly | DBA manual restore procedure | All 17 collections present; document counts match ±0.1% |
| Full restore + smoke test | Quarterly (DR drill) | Full DR drill | RTO < 4 hours; all API endpoints respond |
| AML records integrity | Annually | Compliance Officer audit | 7-year records present, readable, not expired |

**Acceptance Criteria:**
- [ ] Daily backup completes before 04:00 GST; Atlas alert if window missed
- [ ] Monthly restore test documented in `backup_verification_log.md` with: restore time, record counts, anomalies
- [ ] Pre-deployment backups tagged with `git_sha` for instant rollback traceability
- [ ] S3 Glacier annual archives confirmed in UAE/GCC region (PDPL compliance)
- [ ] Backup encryption key rotation: annually, with re-encryption of stored backups

---

*This document is maintained alongside the Prisma schema. Any schema changes must be reflected here within the same sprint. Review quarterly for accuracy. AML and PDPL sections reviewed whenever UAE regulatory guidance is updated.*
