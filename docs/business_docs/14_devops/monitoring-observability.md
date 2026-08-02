# Monitoring & Observability Guide — White Caves CRM Platform

> **Document ID:** WC-MON-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## 1. Overview

This document defines the monitoring strategy, key metrics, alerting rules, and dashboards for the White Caves CRM Platform in production.

---

## 2. Monitoring Stack

| Layer              | Tool                                              | Purpose                               |
| ------------------ | ------------------------------------------------- | ------------------------------------- |
| Frontend           | Vercel Analytics + Speed Insights                 | Page performance, Core Web Vitals     |
| API server         | Railway/Render built-in metrics                   | CPU, memory, response times           |
| Application errors | Sentry                                            | Error tracking, stack traces          |
| Database           | MongoDB Atlas monitoring                          | Query performance, connection health  |
| Uptime             | UptimeRobot / BetterUptime                        | Health endpoint ping every 60 seconds |
| Logs               | Winston → console (collected by hosting platform) | Structured logs with correlation IDs  |
| Alerting           | Email + WhatsApp group                            | Alert routing for P1/P2 events        |

---

## 3. Health Check Endpoint

**URL:** `GET /health`  
**Auth:** None required  
**Expected Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-03-15T10:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

**Monitoring rule:** If this endpoint returns non-200 for 2 consecutive checks (2 minutes), trigger P1 alert.

---

## 4. Key Metrics to Monitor

### API Performance Metrics

| Metric              | Target   | P2 Alert                 | P1 Alert                 |
| ------------------- | -------- | ------------------------ | ------------------------ |
| Request p50 latency | < 150 ms | > 1000 ms for 5 min      | > 3000 ms for 5 min      |
| Request p95 latency | < 300 ms | > 2000 ms for 5 min      | > 5000 ms for 5 min      |
| HTTP 5xx rate       | < 0.1%   | > 1% over 5 min          | > 5% over 5 min          |
| HTTP 4xx rate       | Normal   | > 20% over 5 min (spike) | —                        |
| Requests per minute | Baseline | 10x spike vs. 1-hour avg | —                        |
| API uptime          | 99.5%    | Health check failure × 2 | Health check failure × 2 |

### Infrastructure Metrics

| Metric                    | Target         | P2 Alert        | P1 Alert        |
| ------------------------- | -------------- | --------------- | --------------- |
| API container CPU         | < 60%          | > 85% for 5 min | > 95% for 5 min |
| API container memory      | < 70%          | > 85% for 5 min | > 95% for 5 min |
| MongoDB Atlas connections | < 80% of limit | > 90% of limit  | > 99% of limit  |
| MongoDB Atlas storage     | < 70%          | > 85%           | > 95%           |
| SSL certificate expiry    | > 30 days      | < 14 days       | < 3 days        |

### Business Metrics (Daily Review)

| Metric                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| New leads today        | Count of leads created today vs. 30-day avg     |
| WhatsApp messages sent | Volume vs. previous week (unusual drop = issue) |
| Failed logins          | Spike may indicate brute force attempt          |
| API error types        | Track most common 4xx/5xx errors                |
| Slow query count       | Queries > 1 second in MongoDB Atlas             |

---

## 5. Logging Strategy

### Log Levels

| Level   | When to Use                                         | Production Enabled |
| ------- | --------------------------------------------------- | ------------------ |
| `error` | Unhandled exceptions, critical failures             | Yes                |
| `warn`  | Expected errors, rate limits, auth failures         | Yes                |
| `info`  | HTTP requests, key operations (login, create, etc.) | Yes                |
| `debug` | Detailed trace info                                 | No (dev only)      |

### Log Format (JSON — production)

```json
{
  "level": "info",
  "timestamp": "2026-03-15T10:00:00.000Z",
  "requestId": "req-a1b2c3",
  "method": "POST",
  "path": "/api/leads",
  "statusCode": 201,
  "durationMs": 143,
  "userId": "user-xyz",
  "userRole": "agent"
}
```

### What is Always Logged

- All HTTP requests (method, path, status, duration, user ID)
- All authentication events (login, logout, failed login, 2FA events)
- All data mutations (create, update, delete) with user ID
- All permission denials (403s)
- All unhandled exceptions with full stack trace

### What is Never Logged

- Passwords or password hashes
- JWT token contents
- Payment card data
- Full document content (to avoid PII in logs)

---

## 6. Alerting Configuration

### Alert Channels

1. **#ops-alerts** WhatsApp group — P1 and P2 alerts
2. **#p3-issues** Slack channel — P3 alerts (if Slack configured)
3. **Email** to lead developer + managing director — P1 only

### Alert Message Format (P1 Example)

```
🚨 P1 ALERT — White Caves CRM
Time: 2026-03-15 10:05 UAE
Issue: Health check failing (3 consecutive failures)
URL: https://api.whitecaves.ae/health
Action: Check deployment-runbook.md → INC-001
Runbook: https://github.com/.../14_devops/incident-response.md
```

---

## 7. MongoDB Atlas Monitoring

### Key Atlas Alerts to Configure

1. **Replica Set Election** — P2 alert → investigate immediately
2. **Connections > 90%** — P2 alert → increase pool size or scale cluster
3. **Disk IOPS > 90%** — P2 alert → upgrade storage tier
4. **Slow Queries (> 100ms)** — weekly review (Performance Advisor)
5. **Index suggestions** — monthly review

### Atlas Performance Advisor

Review weekly:

- Slow query patterns
- Suggested new indexes
- Drop unused indexes

---

## 8. Uptime SLA Tracking

Track monthly uptime for SLA reporting:

```
Monthly Uptime % = (Total Minutes - Downtime Minutes) / Total Minutes × 100
Target: 99.5% = max 219 minutes downtime per month

Exclude:
- Planned maintenance (Sunday 02:00-04:00 UAE)
- Third-party outages (Meta, MongoDB Atlas) with documented proof
```

Downtime log template:

```
Date: ___________
Start time: ___________
End time: ___________
Duration: ___________
Root cause: ___________
Users affected: ___________
Included in SLA calculation: Y/N
```

---

**Document ID:** WC-MON-001 | **Version:** 1.0 | **Date:** March 2026
