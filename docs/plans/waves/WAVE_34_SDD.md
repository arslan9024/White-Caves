# Wave 34 — SDD

**Wave:** 34  
**Title:** Software Docs Canon Sync and Architecture Reconciliation  
**Status:** planned  
**Date:** 2026-08-07  
**Predecessor:** Wave 33 (business docs canonicalization and coverage completion)

---

## 1) Objective

Reconcile overlapping or contradictory software documentation so `docs/software_docs/` functions as a single reliable technical reference layer. This wave clarifies canonical architecture ownership, resolves stale technical narratives, strengthens index quality, and aligns architecture/design docs with current runtime reality.

---

## 2) Scope

### In scope

1. Canonical refresh of software-doc root indexes and manifests.
2. Architecture supersession mapping across database, RBAC, navigation, and folder-structure docs.
3. Reconciliation of older stack statements with current runtime truth.
4. Strengthening of API-contract and ADR discoverability in the software-doc layer.
5. Publication of companion architecture crosswalk artifacts.

### Out of scope

- Source-code refactors in application/runtime files.
- Auto-generation of architecture docs from code.
- Exhaustive per-endpoint test authoring.

---

## 3) Primary Deliverables

### 3.1 Canonical technical entrypoints

- `docs/software_docs/INDEX.md`
- `docs/software_docs/project_vision_manifest.md`
- `docs/software_docs/core_engineering_manifest.md`

### 3.2 Architecture reconciliation targets

- `docs/software_docs/02_software_design/database_architecture.md`
- `docs/software_docs/02_software_design/database_architecture_sdd.md`
- `docs/software_docs/02_software_design/database_topology.md`
- `docs/software_docs/02_software_design/rbac_state_gating.md`
- `docs/software_docs/02_software_design/rbac_state_gating_sdd.md`
- `docs/software_docs/architecture/FOLDER_STRUCTURE_BLUEPRINT.md`

---

## 4) Quality Rules

All Wave 34 updates must:

- declare active vs historical vs superseded technical docs;
- align stack statements with the current runtime authority and repo instructions;
- avoid parallel architecture truths without explicit layering or supersession notes;
- link major design docs to relevant ADR, planning, and requirement surfaces.

---

## 5) Dependencies

- Wave 33 canonical business-doc front-door stabilization.
- Current runtime ownership notes already established in `docs/software_docs/INDEX.md` and related governance docs.
- Existing traceability framing from Wave 32 outputs.

---

## 6) Completion Criteria

Wave 34 is complete only when:

1. Software-doc root indexes and manifests reflect the actual current folder topology.
2. Contradictory architecture stack statements are removed, reconciled, or explicitly superseded.
3. Database and RBAC design docs have an unambiguous canonical layering.
4. Architecture companion matrices/catalogs exist and are linked from the wave bundle.
5. `npm run plans:validate` passes after tracker synchronization.
