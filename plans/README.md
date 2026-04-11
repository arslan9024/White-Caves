# /plans — Strategic Planning & Operational Documentation

> **Last Updated:** April 10, 2026 | **23 active documents** (61 historical files archived to `/archives/plans/`)

This directory contains all strategic plans, deployment procedures, and operational documentation for the White Caves Real Estate CRM Platform.

---

## 📋 Document Organization

### 🎯 Master Planning
| Document | Description |
|----------|-------------|
| **[MASTER_PLAN.md](MASTER_PLAN.md)** ⭐ | Single source of truth — phases, milestones, feature matrix, 85% complete |
| **[00_START_HERE.md](00_START_HERE.md)** | Quick-start guide for new team members |
| **[INDEX.md](INDEX.md)** | Complete file index and cross-reference guide |

### 🏗️ Architecture & Technical Design
| Document | Description |
|----------|-------------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture, component design, data flow diagrams, tech stack |
| **[TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md)** | Technical specifications, API contracts, database schemas, benchmarks |
| **[DASHBOARD_INTEGRATION_GUIDE.md](DASHBOARD_INTEGRATION_GUIDE.md)** | CRM dashboard integration patterns and component guide |

### 📚 API Documentation
| Document | Description |
|----------|-------------|
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API specs — 126 endpoints across 21 route files |

### 🚀 Deployment & Operations
| Document | Description |
|----------|-------------|
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Environment setup, infrastructure config, deployment checklist |
| **[PRODUCTION_DEPLOYMENT_RUNBOOK.md](PRODUCTION_DEPLOYMENT_RUNBOOK.md)** | Step-by-step production deployment, rollback procedures |
| **[EMERGENCY_RESPONSE_PROCEDURES.md](EMERGENCY_RESPONSE_PROCEDURES.md)** | Incident response, emergency contacts, escalation |

### 🔧 CI/CD & Monitoring
| Document | Description |
|----------|-------------|
| **[CICD_SETUP_DOCUMENTATION.md](CICD_SETUP_DOCUMENTATION.md)** | GitHub Actions CI/CD pipeline setup and configuration |
| **[CICD_QUICK_REFERENCE.md](CICD_QUICK_REFERENCE.md)** | Quick reference for CI/CD commands and workflows |
| **[MONITORING_AND_ALERTING_SETUP.md](MONITORING_AND_ALERTING_SETUP.md)** | Monitoring infrastructure, alert rules, dashboards |

### 📊 Phase Plans
| Document | Description |
|----------|-------------|
| **[PHASE_1_NADIA_IMPLEMENTATION_PLAN.md](PHASE_1_NADIA_IMPLEMENTATION_PLAN.md)** | Nadia WhatsApp assistant implementation plan |
| **[PHASE_1_NADIA_QUICK_REFERENCE.md](PHASE_1_NADIA_QUICK_REFERENCE.md)** | Quick reference for Nadia integration |
| **[PHASE_3_ACTION_PLAN.md](PHASE_3_ACTION_PLAN.md)** | Phase 3 action items and timeline |
| **[PHASE_3_ADVANCED_FEATURES_PLAN.md](PHASE_3_ADVANCED_FEATURES_PLAN.md)** | Advanced features roadmap |
| **[PHASE_3_E2E_TEST_PLAN.md](PHASE_3_E2E_TEST_PLAN.md)** | End-to-end testing strategy |
| **[PHASE_3_MASTER_INDEX.md](PHASE_3_MASTER_INDEX.md)** | Phase 3 master index |

### 🔍 Audit Reports
| Document | Description |
|----------|-------------|
| **[audit-round-66.md](audit-round-66.md)** | Audit round 66 findings |
| **[audit-round-69.md](audit-round-69.md)** | Audit round 69 findings |
| **[audit-round-70.md](audit-round-70.md)** | Audit round 70 findings |

---

## 🎯 How to Use This Directory

### For New Team Members
1. Read: **[00_START_HERE.md](00_START_HERE.md)**
2. Review: **[MASTER_PLAN.md](MASTER_PLAN.md)** — understand project status
3. Explore: **[ARCHITECTURE.md](ARCHITECTURE.md)** — system design
4. Setup: See `../business_docs/14_devops/environment-setup.md`

### For Production Deployment
1. Follow: **[PRODUCTION_DEPLOYMENT_RUNBOOK.md](PRODUCTION_DEPLOYMENT_RUNBOOK.md)**
2. Monitor: **[MONITORING_AND_ALERTING_SETUP.md](MONITORING_AND_ALERTING_SETUP.md)**
3. Emergency: **[EMERGENCY_RESPONSE_PROCEDURES.md](EMERGENCY_RESPONSE_PROCEDURES.md)**

### For API Integration
1. Start: **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**
2. Reference: **[TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md)**
3. See also: `../openapi.json` (OpenAPI spec)

---

## 📊 Document Statistics

| Category | Count | Key Documents |
|----------|-------|---------------|
| Master Planning | 3 | MASTER_PLAN, START_HERE, INDEX |
| Architecture | 3 | ARCHITECTURE, TECHNICAL_REFERENCE, DASHBOARD |
| API | 1 | API_DOCUMENTATION |
| Deployment | 3 | DEPLOYMENT_GUIDE, RUNBOOK, EMERGENCY |
| CI/CD & Monitoring | 3 | CICD setup, quick ref, monitoring |
| Phase Plans | 5 | Phase 1 (Nadia), Phase 3 (action, features, E2E, index) |
| Audits | 3 | Rounds 66, 69, 70 |
| **Total** | **23** | **Active documents** |
| Archived | 61 | Moved to `/archives/plans/` |

---

## 🔗 Related Resources

| Resource | Location |
|----------|----------|
| Business Documentation | `../business_docs/` (120+ files across 15 sections) |
| Architecture Decision Records | `../docs/adr/` (8 ADRs) |
| Root Master Plan | `../MASTER_PLAN.md` |
| OpenAPI Specification | `../openapi.json` (10 paths documented) |
| Kubernetes Configs | `../k8s/`, `../helm/` |
| Archived Plans | `../archives/plans/` (61 historical files) |

---

## 🔄 Update Schedule

| Document Type | Frequency | Responsibility |
|---------------|-----------|----------------|
| Master Plan | Monthly | Project Manager |
| Architecture | On major changes | Lead Architect |
| Deployment Guides | After each deployment | DevOps Team |
| API Documentation | With each API change | Backend Team |
| Audit Reports | Per audit round | QA Team |

---

**Version**: April 2026  
**Maintained By**: Development & Operations Team  
**Review Schedule**: Monthly
