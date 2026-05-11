# Pending Tasks Only (Compact Execution Mode)

**Purpose:** Single daily execution queue.  
**Owner:** @Margaret  
**Update cadence:** Daily

## Objective (May 11, 2026)

- Remove planning friction and start implementation faster.
- Reduce true blockers by **50%** before implementation waves.
- Baseline blockers: **27** (from `plans/waves/WAVE_01_READINESS_PACKET.md`).
- Target blockers: **<=13**.

---

## 3-Level Gate Model (Replaces Heavy Daily Gating)

### Gate 0 — Ready to Draft Docs

- Owner + target file defined
- One upstream dependency (if any)
- Minimal output contract

### Gate 1 — Ready to Implement Module

- Business rule + API contract + data shape available
- At least one unit/integration test scenario listed
- Critical blocker count for module <=3

### Gate 2 — Ready to Release

- Build + targeted tests pass
- Risk + rollback note logged
- Production checks completed

> Governance depth checks remain required, but enforced in weekly review instead of daily hard-stop.

---

## Minimal Handoff Contract (Daily)

Required on every planning output:

- `CONSUMES←@Agent: file/path.md#section`
- `FEEDS→@Agent: file/path.md#section`
- Done criteria (1–3 bullet points)

Deferred to weekly quality audit:

- `FEEDS_ACK` matrix
- Full DU/DRI evidence table

---

## Blocker Reduction Program (Active)

### Current Blocker Burn-Down

| Metric                          | Value       |
| ------------------------------- | ----------- |
| Baseline blockers               | 27          |
| Target blockers (50% reduction) | <=13        |
| Reduction required              | 14          |
| Status                          | IN PROGRESS |

### Triage Buckets

- **B1 (Immediate blockers):** Critical-path docs needed for next 5 implementation phases.
- **B2 (Near-term blockers):** Important but not blocking current sprint start.
- **B3 (Deferred backlog):** Non-critical expansion docs moved out of critical path.

### Policy for Immediate De-Blocking

1. Reclassify non-critical blockers from BLOCKED → DEFERRED.
2. Allow implementation when module reaches Gate 1 (not full deep-doc completion).
3. Limit cross-wave dependencies to 1 per module.

---

## Fast-Track Lane (Enabled)

Use fast-track for modules that already have reusable backend/frontend patterns.

Eligible examples:

- Auth flow improvements
- Portal data wiring
- CRM tab integration
- Route consistency and test hardening

Fast-track rule:

- If pattern exists and risk is low, proceed after Gate 1 and log weekly governance follow-up.

---

## Next 5 Phases (Execution-First)

1. Auth/login hardening + route consistency
2. Tenant portal live data parity
3. Managing-director CRM critical tabs end-to-end
4. Top 3 stub endpoint conversions (revenue-impact first)
5. Test + release hardening (build, smoke E2E, deployment gate)

---

## Now / Next / Later

### Now (Implementation-critical)

- [ ] N+1 Auth/login hardening + route consistency
- [ ] N+2 Tenant portal live data parity
- [ ] N+3 Managing-director CRM critical tabs end-to-end

### Next (High impact, not blocking today)

- [ ] N+4 Convert top 3 revenue-impact stub endpoints
- [ ] N+5 Test + release hardening (build + smoke E2E + release gate)
- [ ] Phase 26 compliance/KPI audit closure

### Later (Deferred backlog)

- [ ] Non-critical depth expansions and historical plan consolidation
- [ ] Large reference doc cleanup beyond active planning surface

## Canonical References (Execution)

- [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- [`INDEX.md`](./INDEX.md)
- [`DAILY_WAVE_COMMAND_CENTER.md`](./DAILY_WAVE_COMMAND_CENTER.md)
- [`waves/WAVE_01_READINESS_PACKET.md`](./waves/WAVE_01_READINESS_PACKET.md)

## Active Audit Inputs

- [ ] [`audit-round-66.md`](./audit-round-66.md)
- [ ] [`audit-round-69.md`](./audit-round-69.md)
- [ ] [`audit-round-70.md`](./audit-round-70.md)

## Archive Rule

Completed/superseded phase docs move to `../archives/plans/completed/`.
