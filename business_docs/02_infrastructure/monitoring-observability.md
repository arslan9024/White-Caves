# Monitoring & Observability — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Engineering & Operations
> **Document Owner:** DevOps Engineer / Engineering Lead
> **Review Cadence:** Quarterly

---

## 1. Overview

This document defines the monitoring, observability, and incident management strategy for the White Caves platform. The goal is to maintain 99.9% availability while providing actionable insights into system health, performance, and user experience.

### Observability Pillars

| Pillar | Tool | Purpose |
|--------|------|---------|
| **Metrics** | Vercel Analytics + Custom dashboards | Quantitative system health |
| **Logs** | Structured logging (Morgan + custom logger) | Event-level debugging |
| **Traces** | Vercel Speed Insights | Request flow analysis |
| **Alerts** | Monitoring provider (PagerDuty/OpsGenie) | Proactive incident detection |

---

## 2. Application Monitoring

### 2.1 Health Check Endpoints

| Endpoint | Method | Auth | Response | Check Frequency |
|----------|--------|------|----------|----------------|
| `/health` | GET | None | `{ status, timestamp, environment, version }` | 30 seconds |
| `/api/linda/health` | GET | JWT | WhatsApp session status | 60 seconds |
| `/api/compliance/health` | GET | JWT | Compliance metrics | 5 minutes |

**Health Check Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-04-01T10:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

**Deep Health Check (recommended implementation):**

```json
{
  "status": "OK",
  "timestamp": "2026-04-01T10:00:00.000Z",
  "version": "1.0.0",
  "dependencies": {
    "mongodb": { "status": "connected", "latency_ms": 3 },
    "redis": { "status": "connected", "latency_ms": 1 },
    "whatsapp": { "status": "connected", "sessions": 1 }
  },
  "uptime_seconds": 86400
}
```

### 2.2 Application Performance Metrics

| Metric | Collection Method | Target |
|--------|------------------|--------|
| **Request rate** | Morgan HTTP logger | Baseline + trend analysis |
| **Response time (P50/P95/P99)** | Middleware timing | P95 < 200 ms |
| **Error rate** | Error handler middleware | < 0.1% |
| **Active connections** | Express server stats | < 80% of limit |
| **Database query time** | Prisma query logging | P95 < 50 ms |
| **Cache hit ratio** | Redis instrumentation | > 85% |
| **JWT validation time** | Auth middleware timing | < 10 ms |

### 2.3 Frontend Performance Metrics

| Metric | Tool | Target |
|--------|------|--------|
| **Largest Contentful Paint (LCP)** | Vercel Speed Insights | < 2.5 seconds |
| **First Input Delay (FID)** | Vercel Speed Insights | < 100 ms |
| **Cumulative Layout Shift (CLS)** | Vercel Speed Insights | < 0.1 |
| **Time to First Byte (TTFB)** | Vercel Speed Insights | < 600 ms |
| **Bundle size** | Vite build output | < 500 KB (initial) |
| **API call latency (client)** | Custom instrumentation | < 300 ms perceived |

---

## 3. Infrastructure Monitoring

### 3.1 Server Resources

| Resource | Monitor | Warning | Critical |
|----------|---------|---------|----------|
| **CPU utilization** | Container/Pod metrics | > 70% sustained | > 90% sustained |
| **Memory usage** | Container/Pod metrics | > 75% of limit | > 90% of limit |
| **Disk I/O** | Host metrics | > 80% utilization | > 95% utilization |
| **Network throughput** | Load balancer metrics | > 70% of capacity | > 90% of capacity |
| **Pod restarts** | Kubernetes events | > 2 in 1 hour | > 5 in 1 hour |
| **Container health** | Docker/K8s probes | Any failure | 3+ consecutive failures |

### 3.2 Database Monitoring (MongoDB Atlas)

| Metric | Source | Warning | Critical |
|--------|--------|---------|----------|
| **Connections** | Atlas metrics | > 80% of pool | > 95% of pool |
| **Operations/second** | Atlas metrics | > 1,000 ops/s | > 5,000 ops/s |
| **Query execution time** | Atlas profiler | P95 > 100 ms | P95 > 500 ms |
| **Replication lag** | Atlas metrics | > 5 seconds | > 30 seconds |
| **Storage utilization** | Atlas metrics | > 70% | > 85% |
| **Index hit ratio** | Atlas metrics | < 95% | < 90% |
| **Scan-to-return ratio** | Atlas profiler | > 10:1 | > 100:1 |
| **Slow queries** | Profiler (> 100 ms) | > 10/min | > 50/min |

### 3.3 Redis Monitoring

| Metric | Source | Warning | Critical |
|--------|--------|---------|----------|
| **Memory usage** | Redis INFO | > 75% of max | > 90% of max |
| **Connected clients** | Redis INFO | > 80% of limit | > 95% of limit |
| **Hit rate** | Redis INFO | < 90% | < 80% |
| **Evicted keys** | Redis INFO | > 0/min | > 100/min |
| **Latency** | Redis LATENCY | > 5 ms | > 20 ms |
| **Replication lag** | Redis INFO | > 1 second | > 5 seconds |

### 3.4 Third-Party Service Monitoring

| Service | Health Check | Degradation Indicator |
|---------|------------|----------------------|
| **Firebase Auth** | Firebase status page | Login failure rate > 5% |
| **Stripe** | Stripe status API | Payment failure rate > 2% |
| **WhatsApp Cloud API** | Meta status page + webhook delivery rate | Webhook delivery < 95% |
| **WhatsApp Local (Linda)** | `/api/linda/health` | Session disconnected |
| **Vercel** | Vercel status page | Build failure or edge errors |
| **DNS (Cloudflare)** | Cloudflare status | Resolution failure |

---

## 4. Log Management

### 4.1 Log Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Express API │────▶│   Morgan     │────▶│  Structured  │
│  (requests)  │     │  HTTP Logger │     │  JSON Output │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐             │
│  App Logic   │────▶│   Custom     │─────────────┤
│  (events)    │     │   Logger     │             │
└──────────────┘     └──────────────┘             │
                                                  ▼
                                          ┌──────────────┐
                                          │     Log      │
                                          │ Aggregation  │
                                          │   Service    │
                                          └──────────────┘
```

### 4.2 Log Format

**HTTP Request Log (Morgan):**

```json
{
  "timestamp": "2026-04-01T10:00:00.000Z",
  "method": "GET",
  "url": "/api/properties",
  "status": 200,
  "responseTime": 45,
  "contentLength": 12450,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.x"
}
```

**Application Event Log:**

```json
{
  "timestamp": "2026-04-01T10:00:00.000Z",
  "level": "error",
  "message": "Failed to process WhatsApp webhook",
  "context": {
    "service": "nadia",
    "webhookId": "wamid.xxx",
    "error": "Invalid signature"
  },
  "traceId": "abc-123-def"
}
```

### 4.3 Log Levels

| Level | Usage | Retention | Examples |
|-------|-------|-----------|---------|
| **ERROR** | System failures, unhandled exceptions | 90 days | Database connection failure, unhandled promise rejection |
| **WARN** | Degraded behavior, approaching limits | 60 days | Rate limit hit, slow query, cache miss |
| **INFO** | Normal operations, business events | 30 days | User login, property created, lead status changed |
| **DEBUG** | Detailed diagnostic information | 7 days (staging only) | Query parameters, middleware chain, JWT decode |

### 4.4 Log Hygiene Rules

1. **Never log secrets** — passwords, tokens, API keys are redacted
2. **PII minimization** — log user IDs, not email addresses or phone numbers
3. **Structured format** — JSON only; no unstructured plaintext logs
4. **Correlation IDs** — every request gets a `traceId` for cross-service correlation
5. **Error context** — include stack trace, request context, and user role (not identity)
6. **Rate limit log output** — prevent log flooding during incident cascades

---

## 5. Alerting Rules

### 5.1 Alert Configuration

| Alert Name | Condition | Severity | Notification |
|-----------|-----------|----------|-------------|
| **API Down** | Health check fails 3 consecutive times | P1 | Phone + SMS + WhatsApp |
| **High Error Rate** | > 1% of requests return 5xx in 5 min | P1 | Phone + SMS |
| **Database Connection Lost** | MongoDB health check fails | P1 | Phone + SMS |
| **Slow API Response** | P95 latency > 500 ms for 10 min | P2 | SMS + Email |
| **High CPU** | > 90% CPU sustained for 15 min | P2 | SMS + Email |
| **High Memory** | > 90% memory sustained for 15 min | P2 | SMS + Email |
| **Redis Down** | Redis connection failure | P2 | SMS + Email |
| **WhatsApp Disconnected** | Linda health check returns disconnected | P3 | Email + Dashboard |
| **High Disk Usage** | > 85% storage on any volume | P3 | Email |
| **Certificate Expiry** | SSL cert expires within 14 days | P3 | Email |
| **Elevated 4xx Rate** | > 5% of requests return 4xx in 15 min | P4 | Dashboard |
| **Slow Database Queries** | > 10 slow queries/min (> 100 ms) | P4 | Dashboard |
| **Backup Failure** | Daily backup did not complete | P3 | Email + SMS |

### 5.2 Alert Routing

| Severity | Recipients | Escalation |
|----------|-----------|------------|
| **P1** | On-call primary + secondary | Auto-escalate to Engineering Lead after 15 min |
| **P2** | On-call primary | Auto-escalate after 30 min |
| **P3** | Engineering team channel | Addressed within next business day |
| **P4** | Dashboard only | Addressed in next sprint |

### 5.3 Alert Suppression

- **Maintenance windows:** Suppress non-critical alerts during planned maintenance
- **Dependency cascades:** If MongoDB is down, suppress downstream alerts (cache miss, slow queries)
- **Flapping prevention:** Require 3 consecutive failures before alerting; 3 consecutive successes before resolving
- **Quiet hours (P3/P4):** Defer non-urgent notifications to business hours (08:00–20:00 GST)

---

## 6. Dashboard Specifications

### 6.1 Operations Dashboard

**Purpose:** Real-time system health overview for the operations team.

| Panel | Visualization | Data Source |
|-------|--------------|-------------|
| **System Status** | Traffic light (green/yellow/red) | Health check aggregation |
| **Request Rate** | Time-series line chart | Morgan logs |
| **Response Time Distribution** | Histogram (P50/P95/P99) | Application metrics |
| **Error Rate** | Time-series with threshold line | Error handler logs |
| **Active Users** | Gauge | JWT validation count |
| **Database Performance** | Multi-line (ops/s, latency, connections) | MongoDB Atlas API |
| **Redis Performance** | Multi-line (hit rate, memory, latency) | Redis INFO |
| **WhatsApp Status** | Status indicator per bot | Health check endpoints |

### 6.2 Business Dashboard

**Purpose:** Business KPIs for management visibility.

| Panel | Visualization | Data Source |
|-------|--------------|-------------|
| **Active Properties** | Counter | Property collection count |
| **Leads in Pipeline** | Funnel chart | Lead status aggregation |
| **Monthly Transaction Volume** | Bar chart | Transaction collection |
| **Commission Summary** | Pie chart (pending/approved/paid) | Commission collection |
| **Agent Performance** | Leaderboard table | Cross-collection aggregation |
| **WhatsApp Conversations** | Time-series | NadiaConversation collection |
| **Conversion Rate** | Percentage gauge | Lead won / total leads |

### 6.3 Security Dashboard

**Purpose:** Security posture monitoring.

| Panel | Visualization | Data Source |
|-------|--------------|-------------|
| **Failed Login Attempts** | Time-series | Auth logs |
| **Rate Limit Hits** | Time-series by endpoint | Rate limiter logs |
| **RBAC Denials** | Counter by role | RBAC middleware logs |
| **Active Sessions** | Gauge | JWT issuance tracking |
| **Dependency Vulnerabilities** | Table (CVE, severity) | npm audit output |
| **Certificate Expiry** | Countdown | SSL certificate metadata |

---

## 7. Incident Classification

### 7.1 Severity Levels

| Level | Name | Definition | Example | SLA |
|-------|------|-----------|---------|-----|
| **P1** | Critical | Complete service outage affecting all users | API down, database unreachable | Respond: 15 min, Resolve: 4 hours |
| **P2** | Major | Significant degradation affecting many users | Slow response times, payment processing failure | Respond: 30 min, Resolve: 8 hours |
| **P3** | Minor | Limited impact on specific features | WhatsApp bot offline, single endpoint error | Respond: 4 hours, Resolve: 24 hours |
| **P4** | Low | Cosmetic or minor issue with workaround | Dashboard chart not loading, minor UI glitch | Respond: 1 business day, Resolve: 1 sprint |

### 7.2 Incident Lifecycle

```
DETECTED → ACKNOWLEDGED → INVESTIGATING → IDENTIFIED → MITIGATING → RESOLVED → POST-MORTEM
   │            │              │               │             │            │           │
   └─ Alert ────┘─ On-call ───┘─ Diagnosis ───┘─ Root ──────┘─ Fix ──────┘─ Review ──┘
     fires        responds       begins          cause         applied      complete   scheduled
                                                 found
```

### 7.3 Incident Documentation

Every P1 and P2 incident requires a post-mortem document containing:

1. **Timeline** — Minute-by-minute account from detection to resolution
2. **Root cause** — Technical analysis of what went wrong
3. **Impact** — Users affected, duration, data implications
4. **Resolution** — What was done to fix the issue
5. **Action items** — Preventive measures with owners and deadlines
6. **Lessons learned** — What worked well and what didn't in the response

---

## 8. On-Call Rotation

### 8.1 Schedule Structure

| Rotation | Coverage | Duration | Handoff |
|----------|----------|----------|---------|
| **Primary** | 24/7 | 1 week | Sunday 09:00 GST |
| **Secondary** | 24/7 (escalation) | 1 week | Sunday 09:00 GST |
| **Management** | Escalation only | Permanent | — |

### 8.2 On-Call Responsibilities

| Responsibility | Expected Action |
|---------------|----------------|
| **Acknowledge alerts** | Within response SLA for alert severity |
| **Triage incidents** | Classify severity; escalate if needed |
| **Initial investigation** | Check dashboards, logs, recent deployments |
| **Communication** | Update status page; notify stakeholders |
| **Resolution or escalation** | Fix if possible; escalate to specialist if not |
| **Handoff documentation** | Document open issues at end of rotation |

### 8.3 On-Call Tooling

| Tool | Purpose |
|------|---------|
| **Alerting platform** (PagerDuty/OpsGenie) | Alert routing, escalation, scheduling |
| **Status page** (`status.whitecaves.ae`) | Public incident communication |
| **Runbook repository** | Step-by-step procedures for common incidents |
| **Secure shell access** | Emergency production access (audited) |
| **Communication channel** | Dedicated WhatsApp group for incident coordination |

---

## 9. SLA Monitoring

### 9.1 Service Level Objectives (SLOs)

| SLO | Target | Measurement Window | Error Budget |
|-----|--------|-------------------|-------------|
| **Availability** | 99.9% | Monthly (rolling) | 43.8 minutes/month |
| **API Latency (P95)** | < 200 ms | Monthly (rolling) | — |
| **API Latency (P99)** | < 500 ms | Monthly (rolling) | — |
| **Error Rate** | < 0.1% | Monthly (rolling) | — |
| **Backup Success** | 100% | Daily | Zero tolerance |
| **Incident Response (P1)** | < 15 minutes | Per incident | — |
| **Incident Resolution (P1)** | < 4 hours | Per incident | — |

### 9.2 Error Budget Policy

The monthly error budget for availability is **43.8 minutes** (99.9% SLO):

| Budget Remaining | Action |
|-----------------|--------|
| > 50% (> 22 min remaining) | Normal development velocity; feature releases allowed |
| 25–50% (11–22 min remaining) | Caution; reduce risky deployments; increase testing |
| 10–25% (4–11 min remaining) | Freeze non-critical deployments; focus on reliability |
| < 10% (< 4 min remaining) | Full deployment freeze; all effort on reliability improvements |

### 9.3 Monthly SLA Report

Generated on the 1st of each month, distributed to Engineering Lead and CTO:

| Section | Contents |
|---------|----------|
| **Uptime summary** | Total uptime %, downtime minutes, comparison to SLO |
| **Incident summary** | P1/P2 incidents, MTTR, root causes |
| **Performance summary** | P50/P95/P99 latency trends, error rate trends |
| **Error budget status** | Remaining budget, burn rate, forecast |
| **Action items** | Open reliability improvements from post-mortems |
| **Capacity planning** | Resource utilization trends, scaling recommendations |

---

## 10. Implementation Checklist

### Current State

- [x] Health check endpoint (`/health`)
- [x] HTTP request logging (Morgan)
- [x] Structured error handling (AppError + errorHandler)
- [x] Docker health checks for all containers
- [x] Kubernetes liveness and readiness probes
- [x] Vercel Speed Insights (frontend)
- [x] MongoDB Atlas monitoring (built-in)
- [x] Activity model audit trail

### Planned Improvements

- [ ] Deep health check with dependency status
- [ ] Redis cache hit/miss instrumentation
- [ ] Centralized log aggregation service
- [ ] Custom operations dashboard
- [ ] Automated alert routing (PagerDuty/OpsGenie)
- [ ] On-call rotation schedule setup
- [ ] Public status page deployment
- [ ] Monthly SLA report automation
- [ ] Request tracing with correlation IDs
- [ ] Database query performance logging

---

*This document is reviewed quarterly and updated when monitoring infrastructure changes. All P1 post-mortems should reference and potentially update this document.*
