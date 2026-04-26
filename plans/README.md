# /plans — Strategic Planning & Operational Documentation

> **Last Updated:** April 26, 2026  
> **Priority Reset:** Frontend-first development order effective April 2026

---

## 🚀 Active Phase Plans (Start Here)

| File | Description | Priority |
|------|-------------|----------|
| **[PHASE_1_HOMEPAGE.md](./PHASE_1_HOMEPAGE.md)** | Public homepage — full UI with dummy data | **#1 — Now** |
| **[PHASE_2_CRM_SUPERUSER.md](./PHASE_2_CRM_SUPERUSER.md)** | CRM + login for one super user (`owner@whitecaves.ae`) | **#2 — Next** |
| **[PHASE_3_AND_BEYOND.md](./PHASE_3_AND_BEYOND.md)** | All deferred features (WhatsApp, compliance, portals, Arabic) | **#3 — Later** |
| **[MASTER_PLAN.md](./MASTER_PLAN.md)** | Top-level plan with foundation summary and priority table | Reference |

---

## 🏗️ Technical Reference (Still Valid)

- **ARCHITECTURE.md** — System architecture, component patterns, data flow, tech stack
- **API_DOCUMENTATION.md** — Complete API specs, endpoint docs, auth details
- **TECHNICAL_REFERENCE.md** — Specs, database schemas, performance benchmarks

---

## 🚀 Deployment & Operations

- **DEPLOYMENT_GUIDE.md** — Environment setup, infrastructure config, deployment checklist
- **PRODUCTION_DEPLOYMENT_RUNBOOK.md** — Step-by-step production deployment + rollback
- **PRODUCTION_EXECUTION_CHECKLIST.md** — Pre-deployment verification items
- **MONITORING_AND_ALERTING_SETUP.md** — Monitoring setup, alerts, dashboards
- **CICD_SETUP_DOCUMENTATION.md** — GitHub Actions CI/CD configuration
- **EMERGENCY_RESPONSE_PROCEDURES.md** — Incident response procedures

---

## 📋 How to Use This Directory

### Starting Fresh / First Time
1. Read: **MASTER_PLAN.md** (root or plans/MASTER_PLAN.md)
2. Review: **PHASE_1_HOMEPAGE.md** for immediate tasks
3. Review: **ARCHITECTURE.md** to understand the system

### Working on Homepage (Phase 1)
1. Open: **PHASE_1_HOMEPAGE.md**
2. Work through sections 1.1–1.11 in order
3. Mark each item `[x]` when done

### Working on CRM (Phase 2)
1. Open: **PHASE_2_CRM_SUPERUSER.md**
2. Start with section 2.1 (Sign-In flow)
3. Use seed: `npm run db:seed` → login `owner@whitecaves.ae` / `password123`

### Deploying to Production
1. Follow: **PRODUCTION_DEPLOYMENT_RUNBOOK.md**
2. Verify: **PRODUCTION_EXECUTION_CHECKLIST.md**
3. Monitor: **MONITORING_AND_ALERTING_SETUP.md**

---

## 📁 Historical Files (Archive)

The remaining files in this folder are historical session summaries and reports from earlier development sessions. They are kept for reference but are **not active work items**:

- `SESSION_8_*.md`, `SESSION_9_*.md`, `SESSION_10_*.md` — Per-session delivery reports
- `PACKAGE_*_DELIVERY_SUMMARY.md` — Package delivery summaries
- `PHASE_2_*.md`, `PHASE_3_*.md` — Old phase reports (superseded by new PHASE_1/2/3 files)
- `WEEK_*_*.md` — Weekly action plans from early development
- `audit-round-*.md` — Security audit findings (66, 69, 70)
- `READINESS_SUMMARY_MARCH_18.md` — March 2026 readiness snapshot

---

**Maintained By:** Development Team  
**Review Schedule:** Update after completing each phase task

