# /plans — Pending-First Planning Workspace

> **Last Updated:** April 27, 2026
> **Canonical Master Plan:** [`MASTER_PLAN.md`](./MASTER_PLAN.md)

This folder now prioritizes **active pending work only**. Completed and historical phase-plan files have been moved to:

- `../archives/plans/completed/`

---

## Active Pending Plans

- [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md) — fastest pending-only tracker
- [`MASTER_PLAN.md`](./MASTER_PLAN.md) — single source of truth for status and roadmap
- [`MASTER_PLAN_CRM_EXCELLENCE.md`](./MASTER_PLAN_CRM_EXCELLENCE.md) — longer-horizon CRM excellence roadmap
- [`PHASE_1_HOMEPAGE.md`](./PHASE_1_HOMEPAGE.md) — current visible product phase
- [`PHASE_2_LANDLORD_TENANT.md`](./PHASE_2_LANDLORD_TENANT.md) — next client-facing portal phase
- [`PHASE_3_CRM_SUPERUSER.md`](./PHASE_3_CRM_SUPERUSER.md) — managing director CRM completion phase
- [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md) — deferred future phases
- [`PHASE_19_NEXT_PHASE_EXECUTION_CHECKLIST_APR27.md`](./PHASE_19_NEXT_PHASE_EXECUTION_CHECKLIST_APR27.md) — immediate execution checklist
- [`IMPROVEMENTS_BACKLOG.md`](./IMPROVEMENTS_BACKLOG.md) — master list of 38 improvements (all categories + phase assignments)
- [`IMPROVEMENTS_CRITICAL.md`](./IMPROVEMENTS_CRITICAL.md) — 5 critical/broken items (WhatsApp, Stripe, 2FA, Arabic, AI registry)
- [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) — 7 incomplete features (scheduler, PDF, email, portals, VR, images, notifications)
- [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md) — 6 architecture items (Zod, versioning, errors, pagination, Redux, env validation)
- [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md) — 4 performance items (Redis, image CDN, bundle split, DB pool)
- [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md) — 4 security items (JWT refresh, CSRF, rate limits, seed secrets)
- [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md) — 3 SEO items (OG tags, sitemap, JSON-LD)
- [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) — 4 UX items (skeletons, accessibility, mobile CRM, PWA groundwork)
- [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md) — 5 product items (lead scoring, mortgage calc, calendar, audit log, multi-currency)
- [`audit-round-66.md`](./audit-round-66.md) — active audit findings
- [`audit-round-69.md`](./audit-round-69.md) — active audit findings
- [`audit-round-70.md`](./audit-round-70.md) — active audit findings

---

## AI Assistants Planning Hub

- [`ai_assistants/README.md`](./ai_assistants/README.md) — **Master index of all 40 AI assistants** with status, department, and file links
  - 18 assistants currently registered in code (`src/store/slices/aiAssistant/registry.ts`)
  - 22 assistants planned across Phases 3–10
  - Each assistant has a dedicated `.md` file with full detail: capabilities, end-to-end flow, API endpoints, data flows, frontend components, backend services, access control, implementation checklist, dependencies, and future enhancements

---

## Department Planning Hub

- [`departments/README.md`](./departments/README.md) — **Master index of all 12 departments** with AI assistant assignments, color codes, and file links
  - 10 existing departments (Executive, Sales, Operations, Finance, Communications, Compliance, Legal, Technology, Marketing, Intelligence)
  - 2 new departments added (Customer Experience, Data & AI)
  - Each department has a dedicated `.md` file with full detail: mission, team structure, responsibilities, assigned AI assistants, end-to-end workflows, API endpoints, KPIs, inter-department data flows, implementation status, and future roadmap

---

## Reference Docs

- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
- [`TECHNICAL_REFERENCE.md`](./TECHNICAL_REFERENCE.md)
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- [`PRODUCTION_DEPLOYMENT_RUNBOOK.md`](./PRODUCTION_DEPLOYMENT_RUNBOOK.md)
- [`CICD_SETUP_DOCUMENTATION.md`](./CICD_SETUP_DOCUMENTATION.md)
- [`CICD_QUICK_REFERENCE.md`](./CICD_QUICK_REFERENCE.md)
- [`MONITORING_AND_ALERTING_SETUP.md`](./MONITORING_AND_ALERTING_SETUP.md)
- [`EMERGENCY_RESPONSE_PROCEDURES.md`](./EMERGENCY_RESPONSE_PROCEDURES.md)
- [`DASHBOARD_INTEGRATION_GUIDE.md`](./DASHBOARD_INTEGRATION_GUIDE.md)
- [`PHASE_3_E2E_TEST_PLAN.md`](./PHASE_3_E2E_TEST_PLAN.md)

---

## Master Plan Governance

- **Canonical file:** `plans/MASTER_PLAN.md`
- **Root `MASTER_PLAN.md`:** redirect/pointer only, not a second source of truth
- **Update cadence:** whenever phase status or priorities materially change
- **Archive policy:** completed phase plans move to `archives/plans/completed/`
