# Scaling Strategy — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Engineering
> **Document Owner:** Engineering Lead
> **Review Cadence:** Quarterly

---

## 1. Executive Summary

This document outlines the scaling strategy for the White Caves Real Estate CRM platform, from the current single-deployment architecture to a multi-region, horizontally scaled system capable of supporting 10,000+ concurrent users. The strategy is designed for the Dubai real estate market with provisions for GCC expansion.

---

## 2. Current Architecture

### 2.1 Production Topology

```
                    ┌──────────────┐
     Users ────────▶│   Vercel     │
                    │  Edge CDN    │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  Vercel Fn   │
                    │ Express API  │
                    │ (Serverless) │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ MongoDB  │ │  Redis   │ │ Firebase │
        │  Atlas   │ │  Cache   │ │   Auth   │
        │  (M10)   │ │          │ │          │
        └──────────┘ └──────────┘ └──────────┘
```

### 2.2 Current Capacity

| Resource | Current Specification | Estimated Capacity |
|----------|----------------------|-------------------|
| **Vercel Functions** | 1024 MB memory, 30s max duration | ~50 concurrent API requests |
| **MongoDB Atlas** | M10 cluster (2 GB RAM, 10 GB storage) | ~500 active users |
| **Redis** | Single instance (512 MB) | ~10,000 cached keys |
| **Bandwidth** | Vercel Pro plan | 1 TB/month |

### 2.3 Current Bottlenecks

1. **Serverless cold starts:** Vercel function initialization adds 200–500 ms latency on first request
2. **Single database region:** All queries route to a single MongoDB Atlas region
3. **WhatsApp session state:** Linda's local whatsapp-web.js client is stateful and tied to a single process
4. **Redis single point of failure:** No replication or clustering configured
5. **No CDN for property images:** Images served directly from application

---

## 3. Horizontal Scaling Strategy

### 3.1 Application Layer

**Phase 1 — Vercel Optimization (Current → 500 users)**

- Enable Vercel Edge Functions for static API responses (property listings, public data)
- Configure function bundling to minimize cold start times
- Implement response caching with `Cache-Control` and `stale-while-revalidate` headers
- Pre-warm critical serverless functions

**Phase 2 — Kubernetes Migration (500 → 2,000 users)**

- Deploy to managed Kubernetes (AKS or EKS in me-south-1)
- HorizontalPodAutoscaler: 3–10 replicas based on CPU (70%) and memory (80%)
- Rolling deployments with PodDisruptionBudget (minAvailable: 2)
- Stateless API design enables seamless horizontal scaling
- Session affinity not required (JWT-based auth is stateless)

**Phase 3 — Multi-Region (2,000 → 10,000 users)**

- Deploy API instances in ME (Dubai), EU (Frankfurt), and APAC (Mumbai)
- Global load balancer with latency-based routing
- Regional Redis clusters for session and cache data
- MongoDB Atlas global clusters with zone-based sharding

### 3.2 Stateless Service Design

All Express API instances are stateless by design:

| Concern | Implementation |
|---------|---------------|
| **Authentication** | JWT tokens validated locally (no server-side session store) |
| **User state** | Stored in MongoDB, cached in Redis |
| **File uploads** | Processed and stored in object storage (S3/GCS), not local disk |
| **WhatsApp sessions** | Isolated to dedicated pods (see Section 7) |
| **Rate limiting** | Redis-backed counters shared across instances |
| **Cron jobs** | Leader election via Redis distributed lock |

### 3.3 Load Balancing

| Layer | Solution | Configuration |
|-------|----------|---------------|
| **DNS** | Cloudflare DNS | Latency-based routing, auto-failover |
| **L7 Load Balancer** | Nginx Ingress (K8s) / Vercel Edge | Rate limiting: 100 req/s per IP |
| **API Gateway** | Kong or AWS API Gateway | Authentication, rate limiting, request transformation |
| **Internal** | K8s Service (ClusterIP) | Round-robin to API pods |

---

## 4. Database Scaling

### 4.1 MongoDB Atlas Scaling Path

| Scale Tier | Atlas Tier | Specs | Cost/Month | Users |
|-----------|-----------|-------|------------|-------|
| **Starter** | M10 | 2 GB RAM, 10 GB storage | ~$60 | 0–500 |
| **Growth** | M30 | 8 GB RAM, 40 GB storage | ~$350 | 500–2,000 |
| **Scale** | M50 | 32 GB RAM, 160 GB storage | ~$1,000 | 2,000–5,000 |
| **Enterprise** | M80 | 128 GB RAM, 1 TB storage | ~$3,500 | 5,000–10,000+ |

### 4.2 Read Replicas

- **Analytics replica set:** Dedicated secondary for reporting queries (dashboard, KPIs)
- **Read preference:** `secondaryPreferred` for read-heavy endpoints (property search, lead lists)
- **Write concern:** `w: majority` for all write operations (data consistency)

### 4.3 Sharding Strategy

**Shard Key Selection:**

| Collection | Shard Key | Rationale |
|-----------|-----------|-----------|
| `Property` | `{ area: 1, createdAt: 1 }` | Distributes by Dubai area; time-based range queries efficient |
| `Lead` | `{ assignedToId: "hashed" }` | Even distribution across agents |
| `Activity` | `{ createdAt: 1 }` | Time-series access pattern; range-based queries |
| `NadiaConversation` | `{ customerPhone: "hashed" }` | Even distribution; phone-based lookups |
| `Transaction` | `{ agentId: "hashed" }` | Distributes across agents |
| `Lease` | `{ propertyId: "hashed" }` | Distributes across properties |

**Collections NOT sharded** (small cardinality): `User`, `Favorite`, `SavedSearch`, `JobApplication`

### 4.4 Indexing Optimization

The schema defines 90+ indexes. At scale, optimize with:

1. **Compound index consolidation:** Merge overlapping single-field indexes into compound indexes
2. **Partial indexes:** Index only active documents (e.g., `{ status: "available" }` for properties)
3. **TTL indexes:** Auto-expire stale data (activity logs > 2 years, completed queue entries > 30 days)
4. **Text indexes:** Full-text search on property `title` and `description` fields
5. **Wildcard indexes:** For JSON metadata fields in Activity and SavedSearch

---

## 5. CDN & Static Asset Strategy

### 5.1 Vercel Edge Network

| Asset Type | Cache Strategy | TTL |
|-----------|---------------|-----|
| **JS/CSS bundles** | Immutable hashed filenames | 1 year (`max-age=31536000, immutable`) |
| **HTML (SPA shell)** | Stale-while-revalidate | 1 hour + background revalidation |
| **API responses (public)** | Cache-Control header | 5 minutes (property listings) |
| **API responses (private)** | No cache | `no-store, private` |
| **Images (property photos)** | CDN with transformation | 30 days |

### 5.2 Image Optimization Pipeline

```
Upload → Resize (multiple sizes) → WebP/AVIF conversion → CDN distribution
                                                              │
                                    ┌─────────────────────────┤
                                    ▼                         ▼
                              Thumbnail (200px)        Full-size (2000px)
                              Gallery (800px)          Original (preserved)
```

- **Storage:** Cloud object storage (S3 or GCS) with lifecycle policies
- **Transformation:** On-the-fly resizing via Vercel Image Optimization or Cloudinary
- **Lazy loading:** Frontend implements intersection observer for image loading
- **Budget:** Property images typically 500 KB–2 MB each; optimize to < 200 KB

### 5.3 Frontend Bundle Optimization

| Optimization | Implementation | Impact |
|-------------|---------------|--------|
| **Code splitting** | Vite dynamic imports per route | 60% reduction in initial bundle |
| **Tree shaking** | Vite production build | Remove unused exports |
| **Compression** | Brotli (br) + Gzip fallback | 70% size reduction |
| **Prefetching** | `<link rel="prefetch">` for likely next routes | Perceived performance |
| **Service Worker** | Cache shell + critical assets | Offline capability |

---

## 6. Caching Layer (Redis)

### 6.1 Cache Patterns

| Pattern | Use Case | TTL | Invalidation |
|---------|----------|-----|-------------|
| **Cache-Aside** | Property listings, user profiles | 5 min | Write-through on update |
| **Write-Through** | Lead scores, commission calculations | Immediate | On write |
| **Read-Through** | Dashboard aggregations | 15 min | Time-based expiry |
| **Cache Stampede Prevention** | Popular property pages | Mutex lock | Single recompute |

### 6.2 Redis Key Schema

```
wc:user:{userId}              → User profile JSON (TTL: 5 min)
wc:property:{propertyId}      → Property detail JSON (TTL: 5 min)
wc:properties:list:{hash}     → Paginated property list (TTL: 2 min)
wc:leads:agent:{agentId}      → Agent's lead list (TTL: 1 min)
wc:dashboard:{userId}         → Dashboard metrics (TTL: 15 min)
wc:rate:{ip}:{endpoint}       → Rate limit counter (TTL: 60 sec)
wc:session:{sessionId}        → WhatsApp session state (TTL: 24 hours)
wc:lock:{resource}            → Distributed lock (TTL: 30 sec)
```

### 6.3 Redis Scaling

| Scale | Configuration | Memory | Cost/Month |
|-------|--------------|--------|------------|
| **Starter** | Single instance | 512 MB | ~$15 |
| **Growth** | Single instance | 2 GB | ~$50 |
| **Scale** | Redis Cluster (3 nodes) | 6 GB total | ~$200 |
| **Enterprise** | Redis Cluster (6 nodes, 3 replicas) | 18 GB total | ~$600 |

---

## 7. WhatsApp Session Management at Scale

### 7.1 Architecture

WhatsApp integration uses three components with different scaling characteristics:

| Component | Type | Scaling Strategy |
|-----------|------|-----------------|
| **Nadia** (Cloud API) | Stateless webhook receiver | Scales with API layer (serverless) |
| **Nina** (AI Engine) | Stateless intent classifier | Horizontal pod scaling |
| **Linda** (Local Client) | Stateful (whatsapp-web.js) | Dedicated pods with session persistence |

### 7.2 Linda Scaling Challenges

whatsapp-web.js maintains a persistent WebSocket connection to WhatsApp servers. Each instance can handle only one phone number.

**Multi-Number Architecture:**

```
┌──────────────────┐     ┌──────────────────┐
│  Linda Pod #1    │     │  Linda Pod #2    │
│  +971-50-XXX-001 │     │  +971-50-XXX-002 │
│  (Agents 1-25)   │     │  (Agents 26-50)  │
└──────────────────┘     └──────────────────┘
         │                        │
         └────────┬───────────────┘
                  ▼
         ┌──────────────────┐
         │  Message Router  │
         │  (Redis Queue)   │
         └──────────────────┘
```

- Each Linda pod manages one WhatsApp Business number
- Redis-based message queue routes messages to the correct pod
- Session state persisted to PersistentVolume for pod restart recovery
- Health checks monitor WebSocket connection status via `/api/linda/health`
- Auto-reconnection logic with exponential backoff

### 7.3 Nadia Webhook Scaling

- Nadia receives webhooks from Meta's WhatsApp Business API (stateless)
- Scales linearly with the serverless/pod layer
- Message deduplication via Redis (idempotency key: `waMessageId`)
- Webhook signature verification per request (timing-safe comparison)

---

## 8. Performance Benchmarks & SLAs

### 8.1 API Performance Targets

| Endpoint Category | P50 Latency | P95 Latency | P99 Latency | Throughput |
|-------------------|------------|------------|------------|-----------|
| **Health Check** | < 5 ms | < 10 ms | < 50 ms | 1,000 rps |
| **Authentication** | < 50 ms | < 100 ms | < 200 ms | 100 rps |
| **Property List** | < 50 ms | < 150 ms | < 300 ms | 500 rps |
| **Property Detail** | < 30 ms | < 100 ms | < 200 ms | 500 rps |
| **Lead CRUD** | < 50 ms | < 150 ms | < 300 ms | 200 rps |
| **Dashboard Metrics** | < 200 ms | < 500 ms | < 1000 ms | 50 rps |
| **WhatsApp Webhook** | < 100 ms | < 200 ms | < 500 ms | 100 rps |
| **Search (full-text)** | < 100 ms | < 300 ms | < 500 ms | 100 rps |

### 8.2 Service Level Agreements

| SLA | Target | Measurement |
|-----|--------|-------------|
| **Availability** | 99.9% (8.7 hours downtime/year) | Uptime monitoring (5-minute intervals) |
| **API Response Time** | P95 < 200 ms | Application metrics |
| **Data Durability** | 99.999% | MongoDB Atlas replication |
| **Backup Success Rate** | 100% | Daily automated verification |
| **Incident Response** | P1: 15 min, P2: 30 min | PagerDuty/OpsGenie alerting |

---

## 9. Cost Projections

### 9.1 Infrastructure Cost by Scale Tier

| Component | 100 Users | 1,000 Users | 10,000 Users |
|-----------|-----------|-------------|-------------|
| **Vercel** (Pro) | $20/mo | $20/mo | — (migrate to K8s) |
| **Kubernetes** (AKS/EKS) | — | $300/mo | $1,500/mo |
| **MongoDB Atlas** | $60/mo (M10) | $350/mo (M30) | $3,500/mo (M80) |
| **Redis** | $15/mo | $50/mo | $200/mo |
| **Firebase Auth** | Free tier | Free tier | $50/mo |
| **Stripe** | 2.9% + $0.30/txn | 2.9% + $0.30/txn | Volume discount |
| **WhatsApp API** | $50/mo | $200/mo | $1,000/mo |
| **CDN / Storage** | $10/mo | $50/mo | $300/mo |
| **Monitoring** | Free tier | $100/mo | $400/mo |
| **DNS / SSL** | $20/mo | $20/mo | $50/mo |
| **Total Infrastructure** | **~$175/mo** | **~$1,090/mo** | **~$7,000/mo** |

### 9.2 Cost per User

| Metric | 100 Users | 1,000 Users | 10,000 Users |
|--------|-----------|-------------|-------------|
| **Infrastructure cost/user/month** | $1.75 | $1.09 | $0.70 |
| **Break-even subscription price** | $10/user | $5/user | $3/user |

### 9.3 Scaling Decision Triggers

| Trigger | Threshold | Action |
|---------|-----------|--------|
| API response P95 > 500 ms | Sustained 1 hour | Scale up API instances |
| MongoDB CPU > 80% | Sustained 30 min | Upgrade Atlas tier |
| Redis memory > 80% | Sustained 1 hour | Upgrade Redis instance |
| Cold start rate > 10% | Weekly average | Migrate to K8s |
| Error rate > 1% | Sustained 15 min | Investigate and scale |

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Q2 2026) — Current

- [x] Vercel deployment with serverless functions
- [x] MongoDB Atlas M10 cluster
- [x] Redis single instance
- [x] 90+ database indexes
- [ ] Implement Redis caching patterns (cache-aside for properties)
- [ ] Image optimization pipeline
- [ ] Response caching headers

### Phase 2: Growth (Q3 2026) — 500–2,000 Users

- [ ] Upgrade MongoDB Atlas to M30
- [ ] Redis Sentinel for high availability
- [ ] CDN for property images (Cloudinary or S3 + CloudFront)
- [ ] Database read replicas for analytics
- [ ] API response compression (Brotli)

### Phase 3: Scale (Q4 2026) — 2,000–5,000 Users

- [ ] Migrate to Kubernetes (AKS in UAE region)
- [ ] HorizontalPodAutoscaler configuration
- [ ] MongoDB sharding for Property and Activity collections
- [ ] Redis Cluster (3 nodes)
- [ ] Multi-number WhatsApp deployment

### Phase 4: Enterprise (2027) — 5,000–10,000+ Users

- [ ] Multi-region deployment (UAE, EU, APAC)
- [ ] MongoDB global clusters
- [ ] API Gateway (Kong) with advanced rate limiting
- [ ] Event-driven architecture (message queue for async operations)
- [ ] Dedicated analytics pipeline (data warehouse)

---

## 11. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| MongoDB Atlas cost overrun | Medium | High | Monitor usage; set billing alerts at 80% budget |
| WhatsApp API rate limits | Medium | Medium | Message queuing; respect Meta's throughput limits |
| Vercel function timeout (30s) | Low | Medium | Optimize queries; move heavy operations to background jobs |
| Cold start latency spikes | Medium | Low | Function warming; eventual K8s migration |
| Redis cache inconsistency | Low | Medium | TTL-based expiry; write-through for critical data |

---

*This document is reviewed quarterly and updated when architecture changes are implemented or planned. Cost projections are estimates and should be validated against current cloud provider pricing.*
