# 27 — Willow · Elite Backend Engineer

> **ID:** `willow`  
> **Department:** Technology  
> **Title:** Elite Backend Engineer & API Architect  
> **Color:** `#22C55E` (Green)  
> **Avatar:** 👨‍💻  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/WillowBackendCRM_NEW/`  
> **Access:** Managing Director, Backend Developer

---

## 1. Overview

Willow is the **backend architecture authority** for White Caves. She tracks API performance, database health, caching efficiency, WebSocket stability, security posture of all endpoints, and data pipeline reliability. Her dashboard in the CRM gives developers and the MD a complete picture of the backend's operational state and surfaces technical debt that needs addressing.

---

## 2. Core Responsibilities

1. Monitor all API endpoints: response times, error rates, traffic volume
2. Database health: query performance, index usage, document growth, connection pool status
3. Caching performance: Redis hit/miss ratios, eviction rates
4. WebSocket connections: active connections, message throughput, disconnect rates
5. Security: JWT validation failures, rate limit breaches, suspicious endpoint access patterns
6. Data pipeline: job queues, cron job success/failure rates

---

## 3. Capabilities

| Capability | Description |
|---|---|
| API explorer | All endpoints listed with: avg response time, p95, error rate, calls/day |
| Slow endpoint report | Top 10 endpoints by p95 latency with query-level breakdown |
| Database metrics | Collection sizes, avg query time, slow queries, index health |
| Cache analytics | Redis keys count, hit ratio, memory usage, top evicted keys |
| WebSocket monitor | Active connections, messages/sec, connection duration distribution |
| Security posture | Failed JWTs, rate-limited IPs, 4xx/5xx patterns |
| Cron job tracker | List all jobs, last run, next run, success/fail history |
| Dependency map | Which routes depend on which services (auto-generated) |
| Tech debt register | List of known technical debt items with priority |
| Test coverage | Current test coverage % per module; trend |

---

## 4. How It Works — End to End

### Step 1 — API Metrics Collection
Express middleware `requestMetrics` tracks every request: `{ path, method, duration, statusCode, timestamp }`. Stored in-memory with 1-hour rolling window, aggregated into `POST /api/willow/metrics` every 5 minutes.

### Step 2 — Database Profiling
MongoDB profiler enabled for queries > 100ms → results read via `db.system.profile.find()` → stored as slow query records. Willow's dashboard shows top 10 by execution time.

### Step 3 — Cache Monitoring
`redis.info('stats')` called every minute → parse: `keyspace_hits`, `keyspace_misses`, `evicted_keys`, `used_memory`. Stored as time series. Hit ratio = hits / (hits + misses).

### Step 4 — Cron Job Tracking
Each cron job wraps in: `CronJobTracker.start(jobName)` → runs → `CronJobTracker.complete(jobName, { success, duration, records })`. Results stored in `CronJobRun` model. Willow shows pass/fail history.

### Step 5 — Security Events
Auth middleware logs JWT failures → `WillowService.logSecurityEvent({ type: 'jwt_invalid', ip, path, timestamp })`. Rate limiter logs → `{ type: 'rate_limited', ip, path }`. Stored and shown in security posture tab.

### Step 6 — Tech Debt Register
Manual entries: developer creates tech debt item → `POST /api/willow/tech-debt { title, description, priority, estimatedEffort, phase }`. Displayed as prioritised list.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/willow/metrics` | Upload API metrics batch |
| GET | `/api/willow/metrics` | Get endpoint performance summary |
| GET | `/api/willow/slow-queries` | Slow database queries |
| GET | `/api/willow/cache-stats` | Redis cache analytics |
| GET | `/api/willow/cron-jobs` | Cron job run history |
| GET | `/api/willow/security-events` | Security posture events |
| GET | `/api/willow/tech-debt` | Tech debt register |
| POST | `/api/willow/tech-debt` | Add tech debt item |
| PATCH | `/api/willow/tech-debt/:id` | Update/resolve tech debt |

---

## 6. Data Flows

- **Receives from:** Express middleware (API metrics), MongoDB profiler, Redis stats, cron job wrappers
- **Sends to:** Aurora (backend health data), Zoe (backend KPIs), Henry (audit events)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `WillowBackendCRM_NEW` | `src/components/owner/ai/WillowBackendCRM_NEW/` | ✅ Exists |
| API explorer | Inside dashboard | ✅ Exists (mock) |
| Database metrics | Inside dashboard | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| WillowService | `server/services/WillowService.ts` | 🔲 Planned |
| Request metrics middleware | `server/middleware/requestMetrics.ts` | 🔲 Planned |
| CronJobTracker | `server/utils/CronJobTracker.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full view |
| `backend_developer` | Full view + tech debt management |

---

## 10. Implementation Checklist

- [x] `WillowBackendCRM_NEW` renders (mock)
- [x] Willow registered in `AI_ASSISTANTS_REGISTRY`
- [ ] Request metrics middleware
- [ ] MongoDB slow query collection
- [ ] Redis cache stats endpoint (Phase 7 — Redis not yet installed)
- [ ] Cron job tracker utility
- [ ] Security events logger
- [ ] Tech debt register model + CRUD
- [ ] Wire dashboard to live metrics

---

## 11. Dependencies

- Redis (Phase 7) — cache monitoring
- MongoDB Atlas (metrics API)
- Aurora (shares metrics data)

---

## 12. Future Enhancements

- Automated performance regression detection (CI-integrated)
- Database query optimisation recommendations (AI-powered)
- API contract testing (Pact.io integration)
- Real-time WebSocket connection map
