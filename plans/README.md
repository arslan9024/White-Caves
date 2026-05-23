# /plans — Planning Workspace

**Last Updated:** 2026-05-22  
**Canonical Roadmap:** [`MASTER_PLAN.md`](./MASTER_PLAN.md)

This directory contains **active planning and governance documents only**.  
293 completed/legacy docs are in `plans/archives/`.

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

- Stream S1: Wave 08 — TypeScript/errors stabilization (source: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md))
- Stream S2: Wave 09 — UX hardening (planned; source: [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md))
- Stream S3: Wave 10 — Performance + SEO + security (planned; source: [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md))
- Active wave artifacts: `./waves/WAVE_08_*`

---

## Archive Policy

- All completed/legacy docs: `plans/archives/`
- `plans/` should not retain ad-hoc delivery reports, session summaries, or `Pasted-*` files.
- New planning docs must update an existing file or be created as a `waves/WAVE_##_*` bundle.

---

## Validation

Run:

- `npm run plans:validate`
- after every planning update
