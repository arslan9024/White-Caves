# 14 — DevOps & Infrastructure

DevOps documentation index for the White Caves Real Estate platform — CI/CD, deployment, monitoring, and incident response.

> Last Updated: April 2026

---

## Documents in This Section

| File | Description |
|------|-------------|
| `deployment-runbook.md` | Step-by-step deployment procedures for all environments |
| `environment-setup.md` | Environment configuration and local development setup |
| `incident-response.md` | Incident classification, escalation, and resolution playbooks |
| `monitoring-observability.md` | Monitoring stack, alerting rules, and observability strategy |

---

## Infrastructure Overview

White Caves runs on a containerized architecture deployed to cloud infrastructure with automated CI/CD pipelines, comprehensive monitoring, and defined incident response procedures.

### Architecture Summary

```
                    ┌─────────────┐
                    │  Cloudflare  │  CDN + WAF + DDoS Protection
                    │     DNS      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel /   │  Frontend (React SPA)
                    │   CDN Edge   │  SSR for SEO-critical pages
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │  Rate limiting, auth, routing
                    │  (nginx)     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
        │  App Server│ │  AI   │ │  Workers  │
        │  (Node.js) │ │Service│ │ (Bull MQ) │
        └─────┬─────┘ └───┬───┘ └─────┬─────┘
              │            │            │
        ┌─────▼────────────▼────────────▼─────┐
        │         PostgreSQL + Redis           │
        │         (Prisma ORM)                 │
        └──────────────────────────────────────┘
```

---

## 1. CI/CD Pipeline

### Pipeline Architecture

| Stage | Tool | Trigger | Duration |
|-------|------|---------|----------|
| **Lint** | ESLint + Prettier | Every push | ~30s |
| **Type Check** | TypeScript `tsc --noEmit` | Every push | ~45s |
| **Unit Tests** | Vitest | Every push | ~60s |
| **Build** | Vite (frontend) + esbuild (server) | Every push | ~90s |
| **E2E Tests** | Playwright | PR to `main` | ~5min |
| **Security Scan** | CodeQL + npm audit | PR to `main` | ~3min |
| **Deploy Preview** | Vercel Preview | Every PR | ~2min |
| **Deploy Production** | Vercel / Docker | Merge to `main` | ~3min |

### Branch Strategy

```
main (production)
  ├── develop (staging)
  │     ├── feature/WC-123-lead-scoring
  │     ├── feature/WC-124-whatsapp-templates
  │     └── fix/WC-125-date-format
  └── hotfix/WC-126-critical-auth-fix
```

### Pipeline Configuration

```yaml
# Simplified CI pipeline overview
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:      # Lint + Type Check + Unit Tests (parallel)
  build:        # Vite build + Docker image
  e2e:          # Playwright tests against preview
  security:     # CodeQL + dependency audit
  deploy:       # Conditional on branch + all checks passing
```

### Deployment Environments

| Environment | URL | Branch | Auto-Deploy | Approval |
|-------------|-----|--------|-------------|----------|
| Development | `dev.whitecaves.ae` | `develop` | ✅ Yes | None |
| Staging | `staging.whitecaves.ae` | `develop` (tagged) | ✅ Yes | None |
| Production | `whitecaves.ae` | `main` | ✅ Yes | PR review required |
| Preview | `pr-{n}.whitecaves.ae` | PR branches | ✅ Yes | None |

---

## 2. Deployment Runbook Summary

### Pre-Deployment Checklist

- [ ] All CI checks passing (lint, type check, tests, security)
- [ ] PR reviewed and approved by at least 1 team member
- [ ] Database migrations reviewed (if any)
- [ ] Environment variables verified for target environment
- [ ] Rollback plan documented for the release

### Deployment Steps (Production)

1. Merge PR to `main` → triggers automated pipeline
2. Pipeline runs quality gates (lint, test, build, security)
3. Docker image built and tagged with commit SHA
4. Database migrations applied (Prisma migrate deploy)
5. Rolling deployment (zero-downtime) to production cluster
6. Health check verification (HTTP 200 on `/api/health`)
7. Smoke tests executed (critical path validation)
8. Deployment notification sent (Slack + email)

### Rollback Procedure

| Severity | Action | RTO |
|----------|--------|-----|
| Minor UI bug | Revert PR + redeploy | < 15 min |
| API regression | Rollback to previous Docker image | < 5 min |
| Database migration failure | Run down migration + redeploy | < 30 min |
| Complete outage | DNS failover to static page + investigation | < 5 min |

*Full runbook: [deployment-runbook.md](deployment-runbook.md)*

---

## 3. Monitoring Setup

### Monitoring Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **Uptime** | UptimeRobot / Pingdom | External availability checks (1-min intervals) |
| **APM** | Sentry | Error tracking, performance monitoring, release health |
| **Metrics** | Prometheus + Grafana | System metrics, custom business metrics |
| **Logs** | Structured JSON → log aggregator | Centralized log search and analysis |
| **Alerts** | PagerDuty / Slack | Incident notification and escalation |
| **Analytics** | Google Analytics 4 | User behavior, conversion tracking |

### Key Metrics & Alerts

| Metric | Warning Threshold | Critical Threshold | Alert Channel |
|--------|-------------------|-------------------|---------------|
| API Response Time (p95) | > 500ms | > 2000ms | Slack + PagerDuty |
| Error Rate (5xx) | > 1% | > 5% | PagerDuty |
| CPU Utilization | > 70% | > 90% | Slack |
| Memory Utilization | > 75% | > 90% | Slack |
| Disk Usage | > 80% | > 90% | Slack |
| Database Connections | > 80% pool | > 95% pool | PagerDuty |
| SSL Certificate Expiry | < 30 days | < 7 days | Email |
| Uptime | < 99.95% (rolling 30d) | < 99.9% | PagerDuty |

### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│  White Caves Operations Dashboard               │
├──────────────┬──────────────┬───────────────────┤
│ Uptime: 99.98% │ Errors: 0.2% │ p95 Latency: 180ms │
├──────────────┴──────────────┴───────────────────┤
│  [Request Rate Chart]    [Error Rate Chart]      │
│  [CPU/Memory Chart]      [Database Connections]  │
│  [Active Users]          [Deployment Timeline]   │
└─────────────────────────────────────────────────┘
```

*Full monitoring setup: [monitoring-observability.md](monitoring-observability.md)*

---

## 4. Incident Response

### Severity Classification

| Level | Description | Response Time | Examples |
|-------|-------------|--------------|----------|
| **SEV-1** | Complete service outage | < 15 min | Site down, database unreachable |
| **SEV-2** | Major feature degraded | < 30 min | Search broken, login failing |
| **SEV-3** | Minor feature issue | < 2 hours | Slow image loading, UI glitch |
| **SEV-4** | Cosmetic / low impact | < 24 hours | Typo, minor styling issue |

### Incident Response Flow

```
Detection → Triage → Escalation → Mitigation → Resolution → Post-mortem
   │           │          │            │             │            │
 Alerts    On-call     PagerDuty   Rollback/     Deploy       Blameless
 Monitors  Engineer    Escalation  Hotfix        Fix          Review
```

### On-Call Rotation

| Role | Responsibility | Escalation |
|------|---------------|------------|
| Primary On-Call | First responder, triage, initial mitigation | → Secondary |
| Secondary On-Call | Backup, assists with SEV-1/SEV-2 | → Engineering Lead |
| Engineering Lead | Final escalation, architecture decisions | → CTO |

*Full incident response playbook: [incident-response.md](incident-response.md)*

---

## 5. Environment Configuration

### Environment Variables

| Category | Examples | Storage |
|----------|---------|---------|
| Application | `NODE_ENV`, `PORT`, `API_URL` | `.env` files (per environment) |
| Database | `DATABASE_URL`, `REDIS_URL` | Secrets manager |
| Authentication | `JWT_SECRET`, `SESSION_SECRET` | Secrets manager |
| Third-Party APIs | `WHATSAPP_API_KEY`, `OPENAI_API_KEY` | Secrets manager |
| Feature Flags | `ENABLE_AI_SCORING`, `ENABLE_ARABIC` | Runtime config service |

### Secret Management

- **Development**: `.env.local` (git-ignored)
- **CI/CD**: GitHub Actions Secrets
- **Production**: Cloud secrets manager (encrypted at rest)
- **Rotation**: Automated 90-day rotation for API keys

### Infrastructure as Code

| Component | Tool | Location |
|-----------|------|----------|
| Kubernetes manifests | Helm charts | `/helm/` |
| Docker configuration | Dockerfile | `/Dockerfile.prod` |
| Compose (local dev) | Docker Compose | `/docker-compose.prod.yml` |
| Kubernetes resources | YAML manifests | `/k8s/` |
| Database schema | Prisma | `/prisma/schema.prisma` |

---

## Quick Reference

### Common Operations

```bash
# Local development
npm run dev                         # Start dev server

# Build and test
npm run build && npm run test       # Build + unit tests
npx playwright test                 # E2E tests

# Database
npx prisma migrate dev              # Apply migrations (dev)
npx prisma migrate deploy           # Apply migrations (prod)
npx prisma studio                   # Database GUI

# Docker
docker compose -f docker-compose.prod.yml up -d   # Start production stack
docker compose -f docker-compose.prod.yml logs -f  # Tail logs
```

---

*For environment setup instructions, see [environment-setup.md](environment-setup.md).*
*For the deployment runbook, see [deployment-runbook.md](deployment-runbook.md).*
