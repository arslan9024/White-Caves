# Infrastructure Documentation — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Engineering & Operations

---

## Overview

White Caves is a full-stack real estate CRM platform purpose-built for the Dubai property market. The platform serves agents, landlords, tenants, and buyers with lead management, property listings, transaction processing, lease management, and AI-powered WhatsApp assistants.

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 18.x |
| **Build Tool** | Vite | 6.x |
| **Backend** | Express.js (TypeScript) | 5.x |
| **ORM** | Prisma | 6.x |
| **Database** | MongoDB (Atlas) | 7.x |
| **Cache** | Redis | 7.x |
| **Authentication** | JWT + bcrypt + Firebase Auth | — |
| **Payments** | Stripe | — |
| **WhatsApp** | whatsapp-web.js + Cloud API | — |
| **Hosting** | Vercel (primary) / Docker / Kubernetes | — |
| **Reverse Proxy** | Nginx | Alpine |
| **CI/CD** | GitHub Actions + Vercel | — |

### Architecture Summary

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  React SPA  │────▶│  Express API │────▶│ MongoDB Atlas │
│  (Vercel)   │     │  (Vercel Fn) │     │  (Primary DB) │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────┴───────┐
                    │    Redis     │
                    │   (Cache)    │
                    └──────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Firebase │ │  Stripe  │ │ WhatsApp │
        │   Auth   │ │ Payments │ │   API    │
        └──────────┘ └──────────┘ └──────────┘
```

---

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Database Architecture](./database-architecture.md) | All 17 Prisma/MongoDB models, indexing strategy, data lifecycle, query optimization, and migration procedures |
| 2 | [Security Architecture](./security-architecture.md) | Authentication flows, RBAC (12 roles, 45+ permissions), API security, encryption, OWASP mitigation, UAE PDPL compliance |
| 3 | [Scaling Strategy](./scaling-strategy.md) | Horizontal scaling plan, database sharding, CDN strategy, WhatsApp session management, cost projections |
| 4 | [Disaster Recovery Plan](./disaster-recovery-plan.md) | RPO/RTO objectives, backup strategy, failover procedures, communication plan, DR testing schedule |
| 5 | [Monitoring & Observability](./monitoring-observability.md) | Health checks, metrics, log management, alerting rules, incident classification, SLA monitoring |
| 6 | [WhatsApp Three-Assistant Architecture](./WHATSAPP_THREE_ASSISTANT_ARCHITECTURE.md) | Nadia (Cloud API), Nina (AI Engine), Linda (Local Client) design |

---

## Deployment Environments

| Environment | URL | Database | Deployment Trigger |
|-------------|-----|----------|-------------------|
| **Development** | `localhost:5173` / `:3001` | Local MongoDB | Manual (`npm run dev`) |
| **Staging** | `staging.whitecaves.ae` | MongoDB Atlas (Staging) | Auto on `main` push |
| **Production** | `whitecaves.ae` | MongoDB Atlas (Production) | Manual release tag |

---

## Key Metrics

| Metric | Target | Current Status |
|--------|--------|---------------|
| API Response Time | < 100 ms | ✅ Achieved |
| Database Query Latency | < 50 ms | ✅ Achieved (90+ indexes) |
| Build Time | < 5 min | ✅ Achieved |
| Uptime SLA | 99.9% | ✅ Monitored |
| Docker Image Size | < 200 MB | ✅ Multi-stage Alpine |

---

## Related Documentation

- **DevOps Runbook:** `business_docs/14_devops/deployment-runbook.md`
- **Incident Response:** `business_docs/14_devops/incident-response.md`
- **Environment Setup:** `business_docs/14_devops/environment-setup.md`
- **Core Services:** `business_docs/02_services/core-services.md`
- **Roles & Permissions:** `business_docs/09_user_roles_permissions/roles-matrix.md`

---

## Contact

| Role | Responsibility |
|------|---------------|
| **Engineering Lead** | Architecture decisions, code reviews |
| **DevOps Engineer** | Deployment, monitoring, infrastructure |
| **Security Officer** | Compliance, penetration testing, access audits |
| **Database Administrator** | Schema changes, performance tuning, backups |

---

*For questions about infrastructure, open an issue in the repository with the `infrastructure` label.*
