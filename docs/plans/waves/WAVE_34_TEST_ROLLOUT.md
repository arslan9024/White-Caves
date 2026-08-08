# Wave 34 — Test Rollout

**Wave:** 34  
**Status:** planned  
**Date:** 2026-08-07

---

## Validation Matrix

| Scope | Validation Type | Target | Pass Criteria |
| --- | --- | --- | --- |
| Software-doc root index | Markdown diagnostics | `docs/software_docs/INDEX.md` | No markdown diagnostics |
| Core manifest | Topology review | `docs/software_docs/core_engineering_manifest.md` | Folder paths match current repo canon |
| Project vision manifest | Canon review | `docs/software_docs/project_vision_manifest.md` | No stale architecture/path framing |
| Database design family | Contradiction audit | `database_architecture.md`, `database_architecture_sdd.md`, `database_topology.md` | Explicit layering; no unresolved stack conflicts |
| RBAC design family | Layering review | `rbac_state_gating.md`, `rbac_state_gating_sdd.md` | Clear overview vs implementation split |
| Companion artifacts | Presence review | Wave 34 companion files | Files published and linked |
| Planning sync | Script | `npm run plans:validate` | Pass |

## Suggested Commands

- `npm run plans:validate`
- Markdown diagnostics on all touched software-doc and planning files
- targeted reference review against canonical runtime ownership notes

## Evidence Capture

- software-doc canon snapshot
- architecture traceability matrix snapshot
- ADR coverage index snapshot
- tracker snapshot after Wave 34 registration
