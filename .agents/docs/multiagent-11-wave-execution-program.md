# White Caves — Multiagent 11-Wave Execution Program

**Date:** May 15, 2026  
**Status:** Drafted for coordinated execution  
**Mode:** Multi-agent, macro/huge-wave delivery (do together operationally, merge separately)  
**Inputs consolidated from:** `plans/PHASE_6_COMPLIANCE.md`, `plans/PHASE_7_ANALYTICS.md`, `plans/PHASE_8_ARABIC.md`, `plans/PHASE_9_RBAC.md`, `plans/PHASE_10_PWA.md`, `plans/MASTER_PLAN.md`, `PROJECT_PROGRESS.md`, archived Phase 16–19 planning, and subagent synthesis from @Ada, @Margaret, guardian, and @Dena.

---

## Executive Decision

**Yes — the next 11 implementation phases can be completed together with all subagents working together.**

However, they must be executed as **11 coordinated macro/huge-waves** with shared planning, clear ownership, and strict validation gates.  
**Do not merge them as one mega-change.**

### Delivery Rule

- **Together operationally** = multiple subagents and work lanes move in parallel.
- **Separately in code** = each wave merges only after passing its own build, test, and quality gates.

---

## Critical Constraint Identified

There is an active governance conflict in the repo:

- `PROJECT_PROGRESS.md` reports a **1000% depth + 92% readiness threshold**.
- `plans/waves/WAVE_01_READINESS_PACKET.md` has previously indicated a much lower readiness snapshot.

### Immediate Rule

Before premium coding begins for any wave, use a **single canonical readiness source** and log the approval for that wave.

---

## The 11-Wave Program

| Wave | Theme                                           | Primary Outcome                                                                   | Lead Agents                      |
| ---- | ----------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------- |
| 1    | Governance Reconciliation + Contract Freeze     | One canonical readiness model, one execution backlog, one route/data contract map | @Ada, @Margaret, guardian        |
| 2    | WhatsApp CRM Revenue Capture                    | Production-ready WhatsApp lead capture, routing, templates, CRM sync              | @Jaime, @Nadia, @Mira            |
| 3    | Compliance Baseline                             | KYC/AML/PDPL/RERA baseline enforcement, consent logging, audit-safe workflows     | @Sofia, @Timnit, @Mira, @Barbara |
| 4    | RBAC + Audit Hardening                          | Server-authoritative permissions, role flow wiring, audit log expansion           | @Daniela, @Radia, @Mira          |
| 5    | Analytics + Attribution Backbone                | Real event telemetry, source attribution, KPI wiring, dashboard truth layer       | @Cassie, @Anima, @Mira           |
| 6    | Portal Syndication + Off-Plan/RERA Expansion    | Listing distribution, lead webhooks, off-plan workflow, publication controls      | @Mary, @Maya, @Timnit, @Mira     |
| 7    | Arabic RTL + Arabic Communications              | Arabic UI coverage, RTL correctness, Arabic WhatsApp/user flows                   | @Inas, @Rachel, @Una, @Lea       |
| 8    | PWA + Mobile Field Productivity                 | Installability, offline-safe read mode, push flows, mobile nav                    | @Lisa, @Tracy, @Mira             |
| 9    | Code Quality + Type Debt Ratchet                | No new lint debt, no new production `any`, touched files cleaner                  | @Katherine, @Mala, @Gwynne       |
| 10   | E2E + Integration + CI/Security                 | Reliable regression pack, secure workflows, CI gate enforcement                   | @Katherine, @Radia, @Gwynne      |
| 11   | Performance + Observability + Release Candidate | Runtime visibility, performance budgets, health checks, RC launch pack            | @Ruchi, @Lila, @Gwynne, guardian |

---

## Why This Sequence

This sequence balances:

1. **Business ROI** — WhatsApp, syndication, off-plan, Arabic, and mobile move revenue and response time.
2. **Regulatory safety** — compliance and RBAC come early enough to prevent unsafe scaling.
3. **Architecture safety** — event telemetry, contracts, and auditability are established before full expansion.
4. **Release safety** — code quality, CI/security, testing, and observability are deliberately later but mandatory before the final bundled release candidate.

---

## Safe Parallel Lanes

### Lane A — Revenue & Market Expansion

- Wave 2 — WhatsApp CRM
- Wave 5 — Analytics + Attribution
- Wave 6 — Syndication + Off-Plan Expansion
- Wave 7 — Arabic RTL
- Wave 8 — PWA/Mobile

### Lane B — Governance & Trust

- Wave 1 — Governance reconciliation
- Wave 3 — Compliance baseline
- Wave 4 — RBAC + Audit hardening

### Lane C — Platform Reliability

- Wave 9 — Code quality + type debt
- Wave 10 — E2E + integration + CI/security
- Wave 11 — Performance + observability + release candidate

### Parallel Rule

Only waves with **stable contracts and non-overlapping high-risk files** should run concurrently.

---

## Mandatory Gate Before Any Wave Starts

Each wave must have, at minimum:

1. `WAVE_##_SDD.md`
2. `WAVE_##_READINESS_PACKET.md`
3. `WAVE_##_IMPLEMENTATION_BACKLOG.md`
4. `WAVE_##_TEST_ROLLOUT.md`

And the wave must define:

- business rules
- API/route list
- data/schema impact
- permission model impact
- rollback note
- test map

---

## Merge Rules

### For every wave merge

- `npm run build` must pass
- Type check must pass
- Touched-file lint must be clean
- No new production `any`
- Unit/integration tests for touched logic must pass
- At least one critical-path smoke test must pass
- Security negative tests must pass for auth/compliance/webhook-sensitive work

### Final combined release candidate requires

- repo-wide lint green
- clean coverage evidence on critical modules
- CI checks green
- health checks green
- performance evidence attached
- observability hooks active for all new jobs/routes

---

## Business Priority Notes

### Fastest ROI waves

1. **Wave 2 — WhatsApp CRM**
2. **Wave 6 — Portal Syndication + Off-Plan/RERA Expansion**
3. **Wave 5 — Analytics + Attribution**
4. **Wave 7 — Arabic RTL + Arabic Communications**

### Highest-risk waves

1. **Wave 3 — Compliance Baseline**
2. **Wave 4 — RBAC + Audit Hardening**
3. **Wave 10 — E2E + Integration + CI/Security**

---

## Subagent Collaboration Model

### Planning / orchestration

- **@Ada** — architecture and dependency decisions
- **@Margaret** — wave sequencing, milestones, progress logging
- **guardian** — quality gates, stop conditions, release criteria
- **@Dena** — market-value sequencing and external dependency priority

### Implementation lanes

- **Security/Auth:** @Daniela, @Radia
- **Backend/API:** @Mira, @Barbara, @Ruchi
- **Frontend/UX:** @Lea, @Una, @Tracy, @Inas
- **Data/Analytics:** @Cassie, @Anima, @Joelle
- **Operations/Release:** @Katherine, @Gwynne, @Lila

### Free-planning support

Free planning agents expand business docs, acceptance criteria, KPI definitions, and compliance specifics before senior coding waves begin.

---

## Immediate Next Actions

### Step 1 — approve Wave 1

Create the compact artifact bundle for **Wave 1: Governance Reconciliation + Contract Freeze**.

### Step 2 — begin the first high-ROI delivery pair

After Wave 1 gate passes:

- start **Wave 2 — WhatsApp CRM Revenue Capture**
- prepare **Wave 3 — Compliance Baseline** in parallel

### Step 3 — maintain macro/huge-wave discipline

Keep execution in 3–6 module dependency-safe bundles per day with internal validation checkpoints.

---

## Bottom Line

**We can do the next 11 phases together with all subagents working together.**  
The correct execution model is:

- **11 coordinated waves**
- **3 parallel lanes**
- **strict per-wave gates**
- **one final release candidate after hardening**

This is the fastest safe path for White Caves.
