# White Caves — Phase 20–22 Parallel Execution Master Plan

**Date:** May 1, 2026  
**Prepared by:** Multi-Agent Planning Sprint (@Ada, @Margaret, @Mira, @Katherine, @Dena, @Radia, @Gwynne, @Barbara, @Rachel)  
**Execution Mode:** Parallel workstreams with strict quality/security gates

---

## Executive Summary

This plan defines the next **3 implementation phases** to accelerate delivery while keeping production safety high:

- **Phase 20 (P0): Workflow Completion + Contract Stabilization**
- **Phase 21 (P0): Reliability, Security, and Test Gate Expansion**
- **Phase 22 (P1): Release Governance, SEO/CWV uplift, and Production Optimization**

Primary strategy: run frontend/backend/QA/security/devops in parallel with daily checkpoints and merge gates.

---

## Phase 20 — Workflow Completion + Contract Stabilization (Week 1)

### Goals

1. Complete business-critical workflow integration (homepage/search/leads/commission/contracts).
2. Align frontend/backend contract boundaries (typed DTOs + normalized response envelope).
3. Lock RBAC and privileged route behavior across UI + API.

### Parallel Workstreams

- **Architecture/Auth:** Shared capability matrix, role guard parity (frontend + API).
- **Implementation:** Commission and lead workflow completion (UI + thunk + endpoint validation).
- **Data:** Enum normalization and relation integrity checks.
- **QA:** P0 smoke suite for auth, dashboard shell, leads lifecycle, commission lifecycle.

### Exit Criteria

- P0 flows pass in local and CI smoke suites.
- API contracts documented and enforced for touched endpoints.
- No unresolved build/type/lint blockers.

---

## Phase 21 — Reliability, Security, and Test Gate Expansion (Week 2)

### Goals

1. Raise regression confidence through integration + E2E hardening.
2. Implement OWASP-focused security controls (validation, sanitization, rate limits, CORS/headers, logging).
3. Improve observability and defect triage speed.

### Parallel Workstreams

- **QA:** Coverage expansion + flaky-test quarantine + required merge checks.
- **Security:** AuthZ audits, payload sanitization, NoSQL injection guards, abuse-rate controls.
- **DevOps:** Enforce PR required checks, staged environment promotion, artifact upload on failures.
- **Backend/Data:** Index strategy and performance validation on hot queries.

### Exit Criteria

- Required checks green for all merges (typecheck/lint/tests/build/smoke).
- Security acceptance gates pass (no critical vulnerabilities, sanitized writes, protected routes).
- Query/index baseline report completed for leads/commissions/contracts/inventory.

---

## Phase 22 — Release Governance + SEO/CWV + Production Optimization (Week 3)

### Goals

1. Finalize release-governed deployment model with rollback readiness.
2. Improve Core Web Vitals and structured data coverage on high-value pages.
3. Deliver measurable business improvements in lead quality and conversion velocity.

### Parallel Workstreams

- **DevOps/Release:** `develop -> staging -> prod` promotion flow with manual approval gate.
- **SEO/Growth:** Dubai intent page optimization, schema completeness, funnel tracking alignment.
- **Performance:** Route-level bundle/perf optimization and CWV fixes.
- **Ops/QA:** Two consecutive green release-candidate runs.

### Exit Criteria

- Staging and production gate checklist fully green.
- Rollback runbook tested (<15 min app rollback target).
- CWV and tracking targets met on core templates.

---

## Dependency Order (High Level)

1. **Phase 20 contract + RBAC stabilization** (foundation)
2. **Phase 21 quality + security hardening** (safety)
3. **Phase 22 release + growth optimization** (scale)

---

## Merge & Quality Gates (Must Pass)

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Unit tests (changed scope) + integration smoke
- E2E smoke for P0 flows
- Security dependency scan (no unresolved critical/high runtime issues)

---

## Copilot Within Limits Policy (Time/Cost Efficient)

1. **Local-first validation** before expensive full pipelines.
2. **Batch related tasks** per domain/file to reduce context thrash.
3. **Use subagents only for cross-cutting complexity** (security, architecture, migrations, CI).
4. **Ask for minimal diffs, not rewrites**.
5. **Tiered testing strategy**: changed files -> feature suite -> full regression at phase gates.
6. **Hard stop criteria per task**: done only when build/tests/acceptance criteria pass.

---

## Ownership Matrix

- **Architecture:** @Ada
- **Roadmap & Tracking:** @Margaret
- **Implementation:** @Mira
- **QA Gates:** @Katherine
- **Security:** @Radia
- **DevOps/Release:** @Gwynne
- **Data & Indexing:** @Barbara
- **SEO/CWV Growth:** @Rachel
- **Business Prioritization:** @Dena

---

## 15-Day Snapshot (Condensed)

- **Days 1–5:** Phase 20 implementation + contract/RBAC stabilization
- **Days 6–10:** Phase 21 test/security/reliability hardening
- **Days 11–15:** Phase 22 release readiness + SEO/CWV + production rollout prep

---

## Final Success Criteria

- Build stable, protected routes stable, and P0 regression stable.
- Security controls auditable and CI-enforced.
- Deployments governed, rollback tested.
- Measurable improvement in conversion and performance KPIs.
