# Software Docs Index

**Last Updated:** 2026-08-02

This is the canonical software architecture and project-management documentation root for White Caves.

Legacy root files in this folder that predate the canonical 2026 structure should be treated as
historical or normalization targets unless explicitly linked from this index, the ADR index, or
the active planning stack.

---

## Start Here

1. [`project_vision_manifest.md`](./project_vision_manifest.md)
2. [`core_engineering_manifest.md`](./core_engineering_manifest.md)
3. [`adr/README.md`](./adr/README.md)
4. [`PROJECT_MANAGEMENT_GOVERNANCE_INDEX_2026-08-02.md`](./PROJECT_MANAGEMENT_GOVERNANCE_INDEX_2026-08-02.md)
5. [`BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md`](./BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md)
6. [`../business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md`](../business_docs/IMPLEMENTATION_TRACEABILITY_AND_DELIVERY_MAP_2026-08-03.md)
7. [`RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md`](./RELEASE_READINESS_AND_WAVE_TRACEABILITY_TEMPLATE_2026-08-03.md)
8. [`IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md`](./IMPLEMENTATION_READINESS_CHECKLIST_2026-08-03.md)
9. [`../IMPLEMENTATION_EXECUTION_PLAYBOOK_2026-08-03.md`](../IMPLEMENTATION_EXECUTION_PLAYBOOK_2026-08-03.md)
10. [`SOFTWARE_DOCS_UPGRADE_ROADMAP_2026-Q3.md`](./SOFTWARE_DOCS_UPGRADE_ROADMAP_2026-Q3.md)
11. [`01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](./01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)
12. [`02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`](./02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md)
13. [`03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`](./03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md)
14. [`04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md`](./04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md)
15. [`IMPLEMENTATION_TEST_READINESS_MASTER.md`](./IMPLEMENTATION_TEST_READINESS_MASTER.md)
16. [`frontend/FRONTEND_400_PERCENT_PROGRAM.md`](./frontend/FRONTEND_400_PERCENT_PROGRAM.md)
17. [`DOCS_INTEGRATION_AND_CONSISTENCY_SYSTEM_2026-08-03.md`](./DOCS_INTEGRATION_AND_CONSISTENCY_SYSTEM_2026-08-03.md)
18. [`01_requirements_engineering/RUP_INCEPTION_PHASE_MASTER_CHECKLIST.md`](./01_requirements_engineering/RUP_INCEPTION_PHASE_MASTER_CHECKLIST.md)

---

## Architecture and Requirements Layers

- `01_requirements_engineering/` — requirement baselines and change history
- `02_software_design/` — SDD and technical design contracts, including [02_software_design/crm_task_batching_design.md](./02_software_design/crm_task_batching_design.md) and [02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md](./02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md)
- `03_use_cases/` — operational behavior contracts, including [03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md](./03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md)
- `04_flowcharts/` — process/navigation/system flow artifacts, including [04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md](./04_flowcharts/FLOWCHART_MASTER_CATALOG_36X.md)
- `adr/` — architecture decision records and rationale

---

## PM Governance Bridge

Primary planning authorities this software docs layer feeds:

- [`../plans/MASTER_PLAN.md`](../plans/MASTER_PLAN.md)
- [`../plans/PENDING_TASKS_ONLY.md`](../plans/PENDING_TASKS_ONLY.md)
- [`../plans/waves/README.md`](../plans/waves/README.md)

Business policy and release governance references:

- [`../business_docs/README.md`](../business_docs/README.md)
- [`../business_docs/15_release_management/README.md`](../business_docs/15_release_management/README.md)

---

## 3000% Software Documentation Uplift

The software-docs layer has been upgraded into a more complete engineering operating system for requirements, design, delivery, and release governance.

### What is now stronger

- The software stack now gives teams a clearer route from requirement to architecture to implementation to test evidence.
- Design and implementation contracts are easier to discover and reuse across modules.
- Release readiness now has a more explicit bridge to business goals, planning waves, and operational verification.
- Architecture decisions, flow artifacts, and implementation checklists are grouped for faster onboarding and lower ambiguity.

### Core acceleration documents

- [SOFTWARE_ENGINEERING_MATURITY_BLUEPRINT.md](./SOFTWARE_ENGINEERING_MATURITY_BLUEPRINT.md) — end-to-end engineering maturity and delivery blueprint.
- [BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md](./BUSINESS_TO_SOFTWARE_CROSSWALK_2026-08-03.md) — business-to-implementation traceability map.
- [01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md](./01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md) — requirements baseline.
- [02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md](./02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md) — design contract base.
- [03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md](./03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md) — behavior and workflow contracts.
- [IMPLEMENTATION_TEST_READINESS_MASTER.md](./IMPLEMENTATION_TEST_READINESS_MASTER.md) — verification and rollout readiness package.

### Engineering maturity expectations

1. Every major component should be traceable to a requirement, design contract, and validation artifact.
2. Architecture decisions should be documented with rationale and migration implications.
3. Release-impacting change must show rollback, risk, and verification evidence.
4. The docs layer should remain usable by both technical and non-technical reviewers.

## Documentation Quality Expectations

Each major software document should include:

- objective and scope;
- ownership and update cadence;
- explicit related business requirement or policy references where applicable;
- traceability links to plans wave/task artifacts;
- quality gate evidence expectations;
- release or rollback references for operationally significant changes.

## Normalization rules

- New architecture decisions must use the canonical `ADR-###-title.md` format.
- Legacy pre-canonical implementation notes may remain for history, but must be marked or indexed
  as historical if they overlap with active documents.
- When a root-level software doc conflicts with `docs/plans/*` or the ADR series, the canonical
  planning stack and ADR series win.
