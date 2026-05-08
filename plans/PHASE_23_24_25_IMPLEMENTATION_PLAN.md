# White Caves — Phase 23–25 Implementation Plan

**Date:** May 2, 2026  
**Status:** Active (Canonical)  
**Priority Order:** 1) Business docs + module logic alignment, 2) homepage improvement planning, 3) dev/build operational verification, 4) git governance hardening

---

## Executive Intent

This phase starts implementation of the multi-agent research outcomes with one practical objective: **align business truth, module logic truth, and delivery governance truth** before new feature expansion.

---

## Phase 23 (Week 1) — Documentation & Logic Alignment Baseline

### Goals

1. Eliminate contradictions across requirements, feature specs, and implementation status.
2. Standardize endpoint naming and module status labels.
3. Publish traceability map for each core module.

### Deliverables

- Requirements correction for commission/finance model.
- Canonical API namespace policy (`/api/commissions` primary; legacy aliases documented).
- CRM feature docs consistency pass (Leads, Inventory, Sales, Finance, Leasing, WhatsApp).
- Tracker/index updates (`PROJECT_PROGRESS`, plans index files) reflecting active Phase 23–25.

### Exit Criteria

- No contradictory status labels across core business docs.
- Core modules have explicit business-rule + endpoint references.
- Plan indexes point to Phase 23–25 as active canonical stream.

---

## Phase 24 (Week 2) — Module Business Logic Hardening

### Goals

1. Strengthen module-level business rules and transitions.
2. Add traceability from UI/workflow to API rules and role checks.
3. Define acceptance gates per module.

### Module Scope

- **Leads:** source attribution, lifecycle, SLA and assignment rules.
- **Inventory:** listing lifecycle states, compliance fields, validation gates.
- **Sales:** dedicated pipeline stages and forecasting constraints.
- **Finance/Commission:** approval/payment controls, immutable paid state.
- **Leasing:** Ejari + PDC + renewal transitions and role permissions.
- **WhatsApp:** current implemented scope vs planned integration scope.

### Exit Criteria

- Each core module has: business rules, endpoint matrix, role matrix, and acceptance checklist.
- Cross-module dependencies are documented (Leads → Sales → Commission → Finance reports).

---

## Phase 25 (Week 3) — Homepage & Operational Readiness

### Goals

1. Lock homepage improvement backlog with measurable quality targets.
2. Codify operational validation for dev/build/deploy readiness.
3. Enforce branch/release governance policy.

### Deliverables

- Homepage improvement checklist (LCP, fallback UX, SEO assets, accessibility).
- Standard runbook for `npm run dev` and `npm run build` verification.
- Monthly release rule documented and aligned across branch policy docs.

### Exit Criteria

- Homepage checklist approved with ownership + dates.
- Dev/build checks pass consistently in execution sessions.
- Branch docs uniformly enforce development-daily + main-monthly release promotion.

---

## Mandatory Merge & Quality Gates

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- unit + integration smoke checks for touched scope
- E2E smoke for critical user journeys

---

## Git Governance (Authoritative)

1. **Daily coding/commits** on `development` and feature branches.
2. **No routine direct work on `main`.**
3. **Promotion to `main` only once per month** in approved release window.
4. Emergency hotfixes to `main` require explicit approval and immediate back-merge to `development`.

---

## Ownership

- Architecture: @Ada
- Planning & tracker updates: @Margaret
- Module implementation alignment: @Mira
- QA gates: @Katherine
- Security controls: @Radia
- DevOps and release governance: @Gwynne
- Data and index consistency: @Barbara
- SEO/CWV and homepage growth: @Rachel

---

## This Plan Supersedes

- `PHASE_20_21_22_PARALLEL_EXECUTION_MASTER_PLAN.md` (kept as predecessor baseline)
- `PHASE_19_NEXT_PHASE_EXECUTION_CHECKLIST_APR27.md` (historical sprint checklist)
