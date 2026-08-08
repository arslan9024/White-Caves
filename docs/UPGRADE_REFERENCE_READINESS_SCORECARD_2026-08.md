# Upgrade Reference Readiness Scorecard — 2026-08

**Status:** Active  
**Owner:** Documentation Governance + Product/Engineering Leads  
**Last Updated:** 2026-08-07  
**Purpose:** Durable future-upgrade reference for closing documentation drift, preserving SRS quality, and keeping business intent aligned with implementation evidence.

---

## 1) Executive RAG snapshot

| Domain | Score | Status | Notes |
| --- | ---: | --- | --- |
| Business docs coverage | 8.7 / 10 | 🟡 Strong | Broad domain coverage; remaining consolidation/traceability gaps. |
| Vision consistency | 8.0 / 10 | 🟡 Strong | Canonical vision is solid; stale legacy narratives still exist. |
| SRS scale target | 10 / 10 | 🟢 Complete | `srs:audit` baseline reached/exceeded 5000 target. |
| SRS semantic completeness | 7.9 / 10 | 🟡 Improving | Needs stronger requirement → endpoint/service → test → release linkage. |

### Locked baseline metrics

- SRS audit result: **5121 total / 5061 unique** requirement IDs.
- Canonical register owner: `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`.
- Priority lane sequence remains: **Listings → Leasing → Receipts → Cross-cutting**.

---

## 2) Canonical source-of-truth stack

Use this order for all feature and wave work:

1. Business intent + policy (`docs/business_docs/`)
2. Software requirement/design contract (`docs/software_docs/`)
3. Wave execution and governance (`docs/plans/`)
4. Release and rollout evidence (`docs/*release*`, wave test rollout artifacts)

When conflicts occur, canonical planning + software architecture stacks are authoritative over legacy root-level summaries.

---

## 3) Known drift patterns to prevent

1. **Stale implementation narrative drift**
   - Docs claim “stubbed/not implemented” after implementation landed.
2. **Endpoint-contract drift**
   - Business docs specify endpoints that differ from runtime route contracts.
3. **Dual-runtime ownership ambiguity**
   - `server/` and `src/server/` both present without explicit authority note.
4. **Traceability dilution at scale**
   - High requirement count without consistent implementation evidence linkage.

---

## 4) P0 / P1 / P2 upgrade backlog

### P0 (must close first)

1. Reconcile stale implementation claims in canonical business references.
2. Resolve receipt API contract alignment (documented receipt flow vs runtime routes).
3. Publish backend source-of-truth declaration (`server/` vs `src/server/`).

### P1 (next governance-hardening wave)

1. Add feature-level traceability rows for Listings/Leasing/Receipts lanes.
2. Consolidate HR policy navigation into one canonical index path.
3. Expand scenario-library rollout from seed batches to wave-gated growth milestones.

### P2 (sustainability and prevention)

1. Add a docs freshness SLA (e.g., 30-day review cadence for canonical indexes).
2. Add automated endpoint-reference consistency checks against route registrations.
3. Add quarterly governance review packet with trend, compliance, and release evidence summaries.

---

## 5) Upgrade execution checklist (future waves)

- [ ] Business reference updated and owner assigned.
- [ ] Software requirement/design artifacts linked.
- [ ] Planning task/wave linkage added.
- [ ] Endpoint/service symbols verified against runtime routes.
- [ ] Test and evidence references attached.
- [ ] Release note/rollback expectations documented.
- [ ] `npm run plans:validate` passed.
- [ ] `npm run srs:audit` passed (and baseline impact explained, if changed).

---

## 6) Acceptance criteria for this scorecard

1. Scorecard is linked from canonical indexes (`docs`, `software_docs`, and planning root references).
2. Contains explicit RAG scoring + upgrade backlog + prevention controls.
3. Can be reused by future waves without replaying historical context.

---

## 7) Active execution lane

- Docs-only autopilot governance lane (100 turns): `docs/plans/AEGIS_DOCS_AUTOPILOT_100_TURN_2026-08-07.md`
