# WAVE_02_READINESS_SOURCE_OF_TRUTH

**Date:** May 15, 2026  
**Owner:** @Ada + @Margaret  
**Status:** ACTIVE

---

## Purpose

Reconcile readiness conflicts across historical and active planning artifacts and define one canonical policy for the 11-wave execution program.

---

## Canonical Sources (in order)

1. `plans/waves/WAVE_02_READINESS_PACKET.md` — current entry gate for the 11-wave program
2. Per-wave readiness packet (`WAVE_03_READINESS_PACKET.md`, `WAVE_04_READINESS_PACKET.md`, etc.)
3. `plans/MASTER_PLAN.md` — canonical queue and Gate 1 execution intent
4. `PROJECT_PROGRESS.md` — operational tracker and quota log

Historical snapshot file:

- `plans/waves/WAVE_01_READINESS_PACKET.md` is a baseline snapshot and **not** the active coding gate for the 11-wave program.

---

## Unified Gate Model

### Gate 1 — Fast-track implementation gate

- Minimum readiness: **>=60%**
- Scope: low-risk or isolated modules with clear rollback
- Required artifacts: SDD + readiness packet + implementation backlog + test rollout
- Approval phrase:
  - `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

### Gate 2 — Full premium-wave gate

- Minimum readiness: **>=92%** with deep evidence coverage
- Scope: multi-module/high-risk/cross-cutting releases
- Requires stronger governance depth and sign-offs before broad premium execution

---

## Wave 02 Reconciliation Decision

- Readiness conflict has been reconciled using the unified gate model above.
- Wave 02 closes as a governance-entry wave.
- Wave 03 and Wave 04 may proceed under **Gate 1** once @Ada approves.

---

## Operational Rule

When two planning docs conflict, the active wave packet and this source-of-truth policy take precedence for the current execution wave.
