# /plans — Planning Workspace

**Last Updated:** 2026-05-22  
**Canonical Roadmap:** [`MASTER_PLAN.md`](./MASTER_PLAN.md)

This directory is for active planning and reference documentation only.

---

## Governance First

- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Phase template: [`PHASE_PLAN_TEMPLATE.md`](./PHASE_PLAN_TEMPLATE.md)
- Planning DoD: [`PLANNING_DOC_DEFINITION_OF_DONE.md`](./PLANNING_DOC_DEFINITION_OF_DONE.md)

---

## Canonical Planning Sources

- Roadmap authority: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Pending queue authority: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Active execution index: [`INDEX.md`](./INDEX.md)

---

## Active Streams (Canonical Queue)

- Stream S1: Errors Stabilization lane (source of truth: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md))
- Stream S2: Deferred closeout ([`PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md`](./PHASE_26_CONTEXT_ENRICHMENT_SPRINT.md))
- Stream S3: Planned micro-wave execution ([`PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md`](./PHASE_27_SUBAGENT_NEXT_LEVEL_90_READINESS.md))
- Active wave artifacts: `./waves/WAVE_08_*`

## Legacy Plan References (Non-Canonical)

- [`PHASE_23_24_25_IMPLEMENTATION_PLAN.md`](./PHASE_23_24_25_IMPLEMENTATION_PLAN.md)
- [`PHASE_24_MODULE_TRACEABILITY_MATRIX.md`](./PHASE_24_MODULE_TRACEABILITY_MATRIX.md)
- [`PHASE_24_ACCEPTANCE_TEST_PLAN.md`](./PHASE_24_ACCEPTANCE_TEST_PLAN.md)
- [`PHASE_25_OPERATIONAL_VERIFICATION_LOG.md`](./PHASE_25_OPERATIONAL_VERIFICATION_LOG.md)
- [`PHASE_25_EXECUTION_GUIDE.md`](./PHASE_25_EXECUTION_GUIDE.md)

---

## Archive Policy

- Completed plans: `../archives/plans/completed/`
- Superseded/ad-hoc plans: `../archives/plans/superseded/`
- `plans/` should not retain `Pasted-*` files.

---

## Validation

Run:

- `npm run plans:validate`
- after every planning update
