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

---

## 11. Complete Alerting Threshold Matrix

All alerts are **PagerDuty-routed** for P1/P2 and **Slack #alerts** for P3/P4.

| Metric | Warning Threshold | Critical Threshold | Auto-Action | Routing |
|--------|------------------|--------------------|-------------|---------|
| API response time p95 | > 500 ms for 5 min | > 2,000 ms for 2 min | Scale-up trigger | P2→Slack; P1→PagerDuty |
| API response time p99 | > 1,000 ms for 5 min | > 5,000 ms for 2 min | Incident created | P1→PagerDuty |
| API error rate (5xx) | > 1% for 5 min | > 5% for 2 min | PagerDuty page | P1→PagerDuty |
| API error rate (4xx) | > 10% for 10 min | > 25% for 5 min | Slack alert | P2→Slack |
| API availability | < 99.9% (30-day) | < 99.5% (7-day) | SLA breach alert | P1→PagerDuty |
| MongoDB Atlas CPU | > 70% for 10 min | > 90% for 5 min | Auto-scale trigger | P2→Slack; P1→PagerDuty |
| MongoDB Atlas storage | > 75% | > 90% | Atlas auto-scale | P2→Slack |
| MongoDB connections | > 70% max pool | > 90% max pool | Alert + investigate | P2→Slack; P1→PagerDuty |
| MongoDB oplog window | < 12 hours | < 4 hours | Immediate alert | P1→PagerDuty |
| MongoDB Atlas query latency p99 | > 100 ms | > 500 ms | Slow query alert | P3→Slack |
| Redis memory usage | > 75% | > 90% | Eviction check | P2→Slack |
| Redis hit rate | < 80% | < 60% | Cache analysis | P3→Slack |
| Redis connection errors | > 0 for 1 min | > 10/min | PagerDuty | P1→PagerDuty |
| WhatsApp webhook queue depth | > 500 messages | > 2,000 messages | Scale worker | P2→Slack; P1→PagerDuty |
| WhatsApp webhook processing latency | > 5 s | > 15 s | Alert | P2→Slack |
| WhatsApp webhook error rate | > 1% | > 5% | PagerDuty | P1→PagerDuty |
| CPU (API pods) | > 70% for 5 min | > 90% for 2 min | HPA scale-up | P2→Slack |
| Memory (API pods) | > 80% for 5 min | > 95% for 2 min | HPA scale-up | P1→PagerDuty |
| Pod restart count | > 2 in 10 min | > 5 in 10 min | Alert + investigate | P2→Slack; P1→PagerDuty |
| SSL certificate expiry | 30 days remaining | 7 days remaining | Auto-renew trigger | P2→Slack; P1→PagerDuty |
| Failed login attempts (per IP) | > 5 in 15 min | > 20 in 15 min | Auto-block IP | P2→Security Slack |
| Failed login attempts (per user) | > 10 in 1 hour | > 25 in 1 hour | Account lock | P2→Security Slack |
| Unusual data export volume | > 10,000 records in 1 hour | > 50,000 records in 1 hour | Alert security | P1→PagerDuty |
| RERA license expiry (agent) | 60 days before | 7 days before | Email + Slack agent | P3→Slack |

---

## 12. Slack / Email Alert Routing

### 12.1 Slack Channel Assignments

| Channel | Severity | Alert Types |
|---------|----------|-------------|
| `#p1-incidents` | P1 (Critical) | API down, data loss, security breach, DB failure |
| `#alerts` | P2 (High) | High latency, elevated error rate, pod restarts, queue depth |
| `#monitoring` | P3 (Medium) | Cache miss rate, slow queries, disk usage warnings |
| `#security-alerts` | P1/P2 (Security) | Failed login spikes, unauthorized access, export anomalies |
| `#deploys` | Info | Deployment start/success/failure, rollback events |
| `#on-call` | P1/P2 | PagerDuty escalation mirror |

### 12.2 Alertmanager Route Configuration

```yaml
# monitoring/alertmanager/config.yml
global:
  resolve_timeout: 5m
  slack_api_url: "$SLACK_WEBHOOK_URL"

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'default-slack'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true   # Also send to Slack
    - match:
        severity: critical
      receiver: 'slack-p1-incidents'
    - match:
        severity: warning
      receiver: 'slack-alerts'
    - match:
        category: security
      receiver: 'slack-security'

receivers:
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - routing_key: "$PAGERDUTY_INTEGRATION_KEY"
        description: '{{ .CommonAnnotations.summary }}'

  - name: 'slack-p1-incidents'
    slack_configs:
      - channel: '#p1-incidents'
        title: '🚨 P1 CRITICAL: {{ .CommonAnnotations.summary }}'
        text: |
          *Alert:* {{ .CommonAnnotations.description }}
          *Severity:* {{ .CommonLabels.severity }}
          *Started:* {{ .StartsAt | time }}
          *Runbook:* {{ .CommonAnnotations.runbook_url }}

  - name: 'slack-alerts'
    slack_configs:
      - channel: '#alerts'
        title: '⚠️ WARNING: {{ .CommonAnnotations.summary }}'
        text: '{{ .CommonAnnotations.description }}'

  - name: 'slack-security'
    slack_configs:
      - channel: '#security-alerts'
        title: '🔐 SECURITY ALERT: {{ .CommonAnnotations.summary }}'
        text: '{{ .CommonAnnotations.description }}'

  - name: 'default-slack'
    slack_configs:
      - channel: '#monitoring'
```

### 12.3 Email Alert Routing

| Alert Type | Recipients | Frequency |
|-----------|-----------|-----------|
| P1 incidents | CTO, Backend Lead, On-call | Immediate |
| Daily health summary | CTO, Managing Director | 08:00 GST daily |
| Weekly SLA report | CTO, Management team | Monday 09:00 GST |
| Security alerts | Security Officer, CTO | Immediate |
| RERA license expiry (60 days) | Agent + Manager + HR | Once at 60 days, once at 30 days, once at 7 days |
| SSL certificate expiry | DevOps lead | 30 days, 14 days, 7 days |

---

## 13. Daily Health Report Template

**Delivery:** Automated email + Slack `#monitoring`, every day at **08:00 GST**
**Recipients:** CTO, Managing Director, Backend Lead

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHITE CAVES CRM — DAILY HEALTH REPORT
Date: {YYYY-MM-DD} | Generated: {HH:MM} GST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SYSTEM HEALTH OVERVIEW
  Overall Status: ● HEALTHY / ⚠ DEGRADED / ✖ DOWN

  Component        Status   p95 Latency   Error Rate   Uptime (24h)
  ─────────────────────────────────────────────────────────────────
  API              ●        {X}ms         {X}%         {X}%
  MongoDB Atlas    ●        {X}ms         N/A          {X}%
  Redis            ●        N/A           N/A          {X}%
  WhatsApp (Nadia) ●        {X}ms         {X}%         {X}%
  CDN (Cloudflare) ●        {X}ms         N/A          {X}%

📈 KEY METRICS (Last 24 Hours)
  Total API Requests:       {X,XXX}
  Successful Requests:      {X,XXX} ({X}%)
  Failed Requests (5xx):    {XX}   ({X}%)
  WhatsApp Messages Received: {XXX}
  WhatsApp Messages Sent:     {XXX}
  New Leads Created:          {XX}
  Active User Sessions:       {XX} peak

🗄️ DATABASE HEALTH
  MongoDB Atlas Tier:    {M20/M30/M50}
  Connections Used:      {XXX} / {MAX}  ({X}%)
  Storage Used:          {X.X} GB / {MAX} GB  ({X}%)
  Oplog Window:          {XX} hours
  Slowest Query (p99):   {X}ms — Collection: {name}

⚠️ ALERTS FIRED (Last 24 Hours)
  P1 (Critical):  {X} fired, {X} resolved
  P2 (Warning):   {X} fired, {X} resolved
  P3 (Info):      {X} fired

🔒 SECURITY EVENTS
  Failed Login Attempts:  {XX} (flagged IPs: {X})
  Rate Limit Hits:        {XXX}
  Suspicious Export Attempts: {X}

📋 UPCOMING MAINTENANCE
  {List any scheduled maintenance windows}

🔗 Full Dashboard: https://grafana.whitecaves.ae/d/daily-health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Implementation:** Grafana scheduled report or custom `scripts/monitoring/daily-health-report.js` cron at 07:55 GST, pushes to Slack and sends email via Resend API.

---

## 14. SLA Breach Early Warning System (Burn Rate Alerts)

### 14.1 SLA Burn Rate Concept

A burn-rate alert fires when the current error rate, if sustained, would exhaust the monthly SLA error budget before the end of the month.

**Current SLA target:** 99.9% API availability = **43.8 minutes downtime/month** allowed

**Error budget = 0.1% of all requests per month**

### 14.2 Burn Rate Alert Thresholds

| Alert Name | Burn Rate | Look-Back Window | Pages? | Meaning |
|-----------|-----------|-----------------|--------|---------|
| `critical_burn` | **14.4×** (consumes 2% of budget in 1 hour) | 5 min window | **Yes (PagerDuty)** | At this rate, entire monthly budget exhausted in ~2 days |
| `high_burn` | **6×** (consumes 5% of budget in 6 hours) | 30 min window | **Yes (Slack P1)** | Serious degradation; act within 1 hour |
| `medium_burn` | **3×** (consumes 10% of budget in 1 day) | 2 hour window | Slack P2 | Elevated error rate; investigate same day |
| `low_burn` | **1×** (consuming budget at baseline rate) | 6 hour window | Slack P3 | Normal operations; no action needed |

### 14.3 Prometheus Burn Rate Alert Rules

```yaml
# monitoring/prometheus/sla-burn-rate.yml
groups:
  - name: sla_burn_rate
    rules:
      - alert: SLABurnRateCritical
        expr: |
          (
            rate(http_requests_total{job="whitecaves-api", status=~"5.."}[5m])
            /
            rate(http_requests_total{job="whitecaves-api"}[5m])
          ) > (14.4 * 0.001)
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "SLA error budget burning at 14.4× rate"
          description: "At current error rate ({{ $value | humanizePercentage }}), the monthly error budget will be exhausted in < 2 days."
          runbook_url: "https://docs.whitecaves.ae/runbooks/sla-breach"

      - alert: SLABurnRateHigh
        expr: |
          (
            rate(http_requests_total{job="whitecaves-api", status=~"5.."}[30m])
            /
            rate(http_requests_total{job="whitecaves-api"}[30m])
          ) > (6 * 0.001)
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "SLA error budget burning at 6× rate"
          description: "Elevated error rate detected. Monthly budget at risk."
```

### 14.4 Monthly Error Budget Tracker

Tracked in Grafana dashboard `SLA Error Budget`:
- **Budget remaining (%):** Real-time gauge (green → yellow at 50% remaining, red at 10% remaining)
- **Burn rate (30-day rolling):** Line chart
- **Top error contributors:** Table (endpoint, error count, error %)
- **SLA compliance history:** Month-by-month bar chart

---

## 15. Log Retention Policy (Formal)

### 15.1 Retention Schedule

| Log Category | Retention Period | Storage | Legal Basis |
|-------------|-----------------|---------|-------------|
| **Application logs** (INFO/DEBUG) | **90 days** | Grafana Loki / CloudWatch | Operational; no legal mandate |
| **Error logs** (WARN/ERROR) | **1 year** | Grafana Loki | Post-incident analysis |
| **Access logs** (HTTP requests) | **90 days** | Cloudflare log push → S3 | GDPR/PDPL — personal data minimisation |
| **Authentication audit logs** | **3 years** | MongoDB Atlas (append-only) | PDPL; internal security policy |
| **Activity audit trail** (CRUD on all entities) | **7 years** | MongoDB Atlas (append-only) | UAE Commercial Transactions Law (Federal Law No. 18/1993) |
| **Financial transaction logs** | **7 years** | MongoDB Atlas (append-only) + S3 WORM | UAE Commercial Law + CBUAE |
| **AML / Compliance logs** | **7 years** | MongoDB Atlas (append-only) + S3 WORM | Federal Law No. 20/2018 (AML) + CBUAE |
| **Security incident logs** | **3 years** | Separate isolated storage | UAE Cybercrime Law No. 34/2021 |
| **WhatsApp message logs** | **90 days** (operational) / **7 years** (compliance flags) | MongoDB Atlas | PDPL + CBUAE |
| **RERA Ejari transaction logs** | **7 years** | MongoDB Atlas (append-only) | RERA mandate |

### 15.2 Log Archival Automation

```bash
# scripts/monitoring/archive-old-logs.sh
# Run nightly at 01:00 GST via cron

# Archive Loki logs older than 90 days to S3 (UAE region)
loki-canary archive \
  --from="$(date -d '91 days ago' +%Y-%m-%dT00:00:00Z)" \
  --to="$(date -d '90 days ago' +%Y-%m-%dT00:00:00Z)" \
  --s3-bucket="whitecaves-log-archive" \
  --s3-region="me-south-1" \
  --compress="gzip"

# Verify S3 archive write succeeded
aws s3 ls s3://whitecaves-log-archive/$(date +%Y/%m)/ \
  --region me-south-1 | tail -5
```

### 15.3 Log Access Controls

| Log Type | Who Can Read | Who Can Delete | Notes |
|---------|-------------|---------------|-------|
| Application logs | Engineering team | DevOps lead only | Standard logs |
| Audit trail | Engineering + Compliance + Management | **Nobody** (append-only collection) | Immutable by design |
| Financial logs | Finance + Management + External auditor | **Nobody** (S3 WORM policy) | S3 Object Lock: Compliance mode |
| Security logs | Security officer + CTO | **Nobody for 3 years** | Isolated access |
| AML logs | Compliance officer + CBUAE (on request) | **Nobody for 7 years** | CBUAE may request access |

**S3 WORM Configuration for Financial Logs:**
```json
{
  "ObjectLockConfiguration": {
    "ObjectLockEnabled": "Enabled",
    "Rule": {
      "DefaultRetention": {
        "Mode": "COMPLIANCE",
        "Years": 7
      }
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Audit trail collection has no `deleteOne` or `updateOne` calls in codebase
- [ ] S3 bucket for financial logs has Object Lock enabled in COMPLIANCE mode
- [ ] Log retention dashboard shows all categories meeting minimum retention
- [ ] Annual log integrity check script (`scripts/monitoring/verify-log-retention.js`) passes
- [ ] PDPL data subject deletion requests delete PII from application data but preserve audit trail skeleton (action recorded, PII redacted)

---

*This document is reviewed quarterly and updated when monitoring infrastructure changes. All P1 post-mortems should reference and potentially update this document. Log retention periods are reviewed annually by the Compliance Officer against current UAE legislation.*
