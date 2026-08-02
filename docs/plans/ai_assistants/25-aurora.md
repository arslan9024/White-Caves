# 25 — Aurora · CTO & Systems Architect

> **ID:** `aurora`  
> **Department:** Technology  
> **Title:** CTO & Systems Architect  
> **Color:** `#0EA5E9` (Sky Blue)  
> **Avatar:** 👩‍💻  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/AuroraSystemsCRM_NEW/`  
> **Access:** Managing Director, CTO, Senior Developer

---

## 1. Overview

Aurora is the **technical operations command centre** for White Caves. She gives the CTO and MD real-time visibility into system health, deployment pipeline status, API performance, security incidents, and the complete application portfolio. She is the single pane of glass for all technical concerns — from server uptime to CI/CD build status to AI governance.

---

## 2. Core Responsibilities

1. System health monitoring: server uptime, API response times, error rates
2. Deployment pipeline: CI/CD status, latest deployments, rollback triggers
3. Application portfolio: map all services, APIs, and their interdependencies
4. Performance analytics: p50/p95/p99 response times, throughput, slow queries
5. AI governance: track all 40 AI assistant statuses, last run times, error rates
6. Security incident dashboard: failed login attempts, rate limit hits, anomaly alerts

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Health dashboard | Uptime %, error rate %, current RPS, p95 latency — live |
| Service map | All 40 AI assistants + backend routes mapped to health status |
| Deployment log | Last 20 deployments: timestamp, commit, environment, duration, status |
| Rollback button | One-click rollback to previous stable deployment (owner only) |
| Slow query log | Top 10 slow database queries with execution plans |
| API analytics | Endpoint-level traffic, error rates, and latency breakdown |
| AI assistant status | For each of 40 assistants: last run, errors, active sessions |
| Security events | Failed logins, rate limit hits, suspicious IPs |
| Log viewer | Real-time log tail (last 100 lines) from selected service |
| Alerting config | Set thresholds for alerts: error rate > 5% → notify MD |

---

## 4. How It Works — End to End

### Step 1 — Health Data Collection
`AuroraService.collectMetrics()` runs every 60 seconds via `setInterval`:
- Query `/health` endpoint of each service
- Query MongoDB for slow query stats
- Query application log files for error counts

### Step 2 — Real-Time Dashboard
Metrics pushed to frontend via WebSocket (`io.emit('metrics', data)`). Aurora dashboard updates counters and sparklines every 60 seconds without page refresh.

### Step 3 — Alert Evaluation
Each metric compared to configured thresholds:
- `errorRate > 0.05` → create alert: severity HIGH → notify MD via Nadia WhatsApp
- `p95Latency > 2000ms` → create alert: severity MEDIUM
- `uptime < 99.9% in last 24h` → create alert: severity HIGH

### Step 4 — Deployment Tracking
GitHub Actions webhook → `POST /api/aurora/deployments { commit, environment, status, duration, deployedBy }`. Aurora dashboard shows deployment history with green/red status badges.

### Step 5 — AI Governance
Aurora polls `/api/assistants` every 5 minutes → checks each assistant's `lastActiveAt`, `errorCount`. Flags assistants that haven't responded in > 1 hour as `degraded`.

### Step 6 — Slow Query Remediation
Aurora highlights slow queries with estimated index recommendation. Developer reviews → adds index via `npx prisma db push` → confirms resolution.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/aurora/health` | System health summary |
| GET | `/api/aurora/metrics` | Detailed performance metrics |
| POST | `/api/aurora/deployments` | Record new deployment |
| GET | `/api/aurora/deployments` | Deployment history |
| GET | `/api/aurora/slow-queries` | Slow database queries |
| GET | `/api/aurora/security-events` | Security event log |
| GET | `/api/aurora/ai-status` | Status of all 40 AI assistants |
| POST | `/api/aurora/alert-config` | Configure alert thresholds |

---

## 6. Data Flows

- **Receives from:** GitHub Actions (deployment webhooks), MongoDB (query metrics), Application logs, Security middleware (failed logins, rate limits)
- **Sends to:** Nadia (critical alerts), Zoe (system health KPIs), Henry (incident log)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `AuroraSystemsCRM_NEW` | `src/components/owner/ai/AuroraSystemsCRM_NEW/` | ✅ Exists |
| System health panel | Inside dashboard | ✅ Exists (mock) |
| Deployment log | Inside dashboard | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| AuroraService | `server/services/AuroraService.ts` | 🔲 Planned |
| Metrics collector | `server/services/MetricsService.ts` | 🔲 Planned |
| Deployment webhook | `server/routes/aurora.ts` | 🔲 Planned |
| Linda health check | `server/routes/linda.ts` `/health` | ✅ Exists |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full view + rollback button |
| `cto` / Senior developer | Full view |
| All others | ❌ |

---

## 10. Implementation Checklist

- [x] `AuroraSystemsCRM_NEW` renders (mock)
- [x] Aurora registered in `AI_ASSISTANTS_REGISTRY`
- [ ] Live metrics collection service
- [ ] WebSocket push for real-time dashboard
- [ ] Deployment webhook handler
- [ ] AI assistant status polling
- [ ] Alert threshold configuration
- [ ] Security events log
- [ ] Slow query detection

---

## 11. Dependencies

- Socket.io (real-time metrics — Phase 4)
- GitHub Actions webhooks (CI/CD integration)
- MongoDB Atlas monitoring API (performance data)

---

## 12. Future Enhancements

- Chaos engineering: simulate failures and test auto-recovery
- Cost analytics: AWS/Vercel spend per service per month
- Auto-scaling triggers based on load metrics
- Infrastructure-as-code change tracking
