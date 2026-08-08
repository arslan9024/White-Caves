# Wave 32 — SDD

**Wave:** 32  
**Title:** Documentation Governance, Traceability & Progress Intelligence  
**Status:** planned  
**Date:** 2026-08-02  
**Predecessor:** Wave 31 (planned / in progress)

---

## 1) Objective

Establish a canonical, measurable, and visually reportable documentation system across:

- `docs/business_docs/`
- `docs/software_docs/`
- `docs/plans/`
- `PROJECT_PROGRESS.md`

This wave converts documentation from partially conflicting reference material into a governed delivery system with explicit traceability, canonical ownership, and progress intelligence outputs.

---

## 2) Scope

### In scope

1. Canonicalization of root business/software document indexes.
2. ADR governance normalization and historical-record classification.
3. Cross-domain traceability bridge artifacts:
   - requirements crosswalk
   - RBAC role-to-level map
   - SLA reconciliation matrix
   - compliance control matrix
4. Progress reporting upgrades:
   - dashboard markdown
   - wave summary markdown
   - executive tracker alignment
5. Planning tracker updates for documentation waves and governance status.

### Out of scope

- Bulk rewriting every individual business/software document in a single pass.
- Automatic generation of all traceability links from source code.
- Frontend UI implementation of progress intelligence dashboards.

---

## 3) Primary Deliverables

### 3.1 Canonical Entry Points

- `docs/business_docs/README.md`
- `docs/software_docs/INDEX.md`
- `docs/software_docs/adr/README.md`

### 3.2 Traceability Bridge Artifacts

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`
- `docs/plans/documentation/SLA_RECONCILIATION_MATRIX.md`
- `docs/plans/documentation/COMPLIANCE_CONTROL_MATRIX.md`

### 3.3 Progress Intelligence Artifacts

- `docs/plans/PROGRESS_DASHBOARD.md`
- `docs/plans/WAVE_PROGRESS_SUMMARY.md`
- aligned `PROJECT_PROGRESS.md`

---

## 4) Quality Rules

All new or upgraded governance docs in this wave must:

- use canonical `docs/` paths;
- state owner, status, and last-updated information;
- distinguish active vs historical/superseded artifacts;
- link to planning authority (`MASTER_PLAN`, `PENDING_TASKS_ONLY`, wave bundle index);
- support measurable documentation quality uplift.

---

## 5) Dependencies

- Wave 31 documentation governance tasks (`W31-011` to `W31-013`)
- existing wave tracker conventions under `docs/plans/waves/`
- current business/software documentation upgrade roadmaps

---

## 6) Completion Criteria

Wave 32 is complete only when:

1. Canonical business/software root indexes are normalized and validated.
2. Historical ADR numbering ambiguity is documented and governed.
3. The four traceability bridge artifacts exist with initial usable mappings.
4. `PROGRESS_DASHBOARD.md` and `WAVE_PROGRESS_SUMMARY.md` are published.
5. `PROJECT_PROGRESS.md`, `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, and `waves/README.md` no longer contradict active wave reality.
6. `npm run plans:validate` passes after tracker synchronization.
