# Inception Open Decisions and Assumptions Register

**Status:** Closed Decision Register (Inception gate)  
**Owner:** Architecture + Product + Compliance  
**Last Updated:** 2026-08-03

## 1. Purpose

Track unresolved inception decisions and core assumptions that must be closed before declaring Inception 100% complete.

## 2. Open decisions

| Decision ID | Topic | Decision Needed | Owner | Due | Impact if Delayed | Status |
| --- | --- | --- | --- | --- | --- | --- |
| INC-DEC-001 | Scope boundary | Final approved in-scope/out-of-scope list for Wave 31/32 handoff | Product + Architecture | 2026-08-10 | Scope drift and requirement churn | Closed (2026-08-03) |
| INC-DEC-002 | Compliance taxonomy | Publish and approve initial `POL-*` seed index with control owners | Compliance | 2026-08-10 | Weak compliance traceability and delayed audit readiness | Closed (2026-08-03) |
| INC-DEC-003 | Inception closure criteria | Formal signoff ceremony criteria and approver quorum | Governance | 2026-08-12 | Cannot formally close Inception phase | Closed (2026-08-03) |

## 3. Inception assumptions

| Assumption ID | Assumption | Validation Method | Owner | Status |
| --- | --- | --- | --- | --- |
| INC-ASM-001 | Canonical docs under `docs/` remain the single source of truth | Weekly index and link consistency checks | Governance | Active |
| INC-ASM-002 | 10,000-UC decomposition model is planning capacity, not immediate writing volume | Phase allocation in UC portfolio planning | Product | Active |
| INC-ASM-003 | Wave 31 implementation can start once Inception exit score reaches `>= 90` and blockers close | Exit scorecard verification and signoff | Architecture | Active |

## 4. Closure rule

This register must be fully closed (`Open` → `Closed`) before claiming Inception 100% complete.

## 4.1 Closure evidence snapshot (2026-08-03)

1. `INC-DEC-001` closure evidence: approved scope packet in `./INCEPTION_SCOPE_BOUNDARY_DECISION_PACKET.md` section 7.
2. `INC-DEC-002` closure evidence: policy taxonomy linkage confirmed via `../business_docs/05_requirements/POLICY_CONTROL_INDEX_POL_SEED.md` and scorecard compliance controls.
3. `INC-DEC-003` closure evidence: quorum and signoff reflected in `./INCEPTION_EXIT_READINESS_SCORECARD.md` section 5.

## 5. Linkage

- `./INCEPTION_EXIT_READINESS_SCORECARD.md`
- `../software_docs/01_requirements_engineering/RUP_INCEPTION_PHASE_MASTER_CHECKLIST.md`
- `../business_docs/INCEPTION_BUSINESS_DISCOVERY_LOG_2026-08-03.md`
- `./MASTER_PLAN.md`
- `./PENDING_TASKS_ONLY.md`
