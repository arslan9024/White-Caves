# Wave 34 — Implementation Backlog

**Wave:** 34  
**Focus:** Software Docs Canon Sync and Architecture Reconciliation  
**Status:** planned  
**Date:** 2026-08-07  
**Entry Gate:** Wave 33 complete or sufficiently stabilized + readiness above 60%

---

| ID | Priority | Task | Owner | Validation |
| --- | --- | --- | --- | --- |
| W34-001 | P0 | Refresh `docs/software_docs/INDEX.md`, `project_vision_manifest.md`, and `core_engineering_manifest.md` to match current folder topology and canon | @Ada + @Mala | Markdown diagnostics clean + topology review |
| W34-002 | P0 | Reconcile `database_architecture.md`, `database_architecture_sdd.md`, and `database_topology.md` into an explicit active/historical layering | @Barbara + @Mala | No contradictory database-stack statements remain unresolved |
| W34-003 | P0 | Reconcile `rbac_state_gating.md` and `rbac_state_gating_sdd.md` into an explicit overview-vs-implementation split | @Ada + @Daniela | RBAC layering note published |
| W34-004 | P1 | Refresh `architecture/FOLDER_STRUCTURE_BLUEPRINT.md` to current runtime/governance and design-token reality | @Mala + @Una | Folder blueprint aligned to current repo truth |
| W34-005 | P1 | Publish `WAVE_34_ARCHITECTURE_TRACEABILITY_MATRIX.md` and `WAVE_34_API_CONTRACT_CATALOG.md` | @Margaret + @Mira | Companion docs published |
| W34-006 | P1 | Publish `WAVE_34_ADR_COVERAGE_INDEX.md` covering active architecture decisions and missing ADR areas | @Ada + @Margaret | ADR coverage index published |
| W34-007 | P0 | Sync planning trackers and wave index for Wave 34 registration | @Margaret | `npm run plans:validate` |

---

## Sequencing

1. Root technical canon (`W34-001`)
2. Database family reconciliation (`W34-002`)
3. RBAC/folder-structure reconciliation (`W34-003`, `W34-004`)
4. Companion architecture artifacts (`W34-005`, `W34-006`)
5. Tracker synchronization (`W34-007`)

## Acceptance Gate

Wave 34 is complete only when:

1. Software-doc root manifests no longer contradict folder reality.
2. Database and RBAC families have explicit canonical layering.
3. Architecture companion artifacts exist and are referenced.
4. Tracker references reflect Wave 34 as a registered future documentation wave.
5. `npm run plans:validate` passes.
