# Software Project Management Governance Index — 2026-08-02

**Purpose:** Provide a single project-management navigation layer for software delivery governance, SDLC control, quality gates, release discipline, and traceability.

---

## 1) Governance Coverage Matrix

| Domain                           | Coverage             | Canonical Source(s)                                                   | Upgrade Note                                                              |
| -------------------------------- | -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| SDLC model & execution rules     | ✅ Strong            | `core_engineering_manifest.md`                                        | Keep RUP paths aligned with actual folder names in `docs/software_docs/*` |
| Requirements traceability        | ✅ Strong            | `01_requirements_engineering/*`                                       | Add explicit requirement-to-wave mapping table quarterly                  |
| Architecture decision governance | ✅ Strong            | `adr/README.md`, `adr/*.md`                                           | Enforce ADR references in wave readiness packets                          |
| Quality gates & validation       | ✅ Strong            | `core_engineering_manifest.md`, `tech_replacement_rules.md`           | Include command ownership + evidence links per gate                       |
| Release/change management bridge | 🟡 Partial-to-Strong | `../business_docs/15_release_management/*` + software docs references | Add software-facing release-readiness checklist entrypoint                |
| Risk & issue management          | 🟡 Partial           | `docs/plans/*`, selected software docs                                | Add canonical software risk register pointer in this index                |
| Test strategy governance         | ✅ Strong            | `../business_docs/13_testing/*`, wave test rollout docs               | Link test artifacts to software docs “Definition of Ready/Done”           |
| RACI / ownership model           | 🟡 Partial           | `AGENTS.md`, plans docs                                               | Add software docs ownership matrix for architecture artifacts             |

---

## 2) Canonical PM Navigation

1. **Vision & Engineering Constitution**
   - `project_vision_manifest.md`
   - `core_engineering_manifest.md`
2. **Requirements & Scope Baseline**
   - `01_requirements_engineering/functional_specifications.md`
   - `01_requirements_engineering/change_log_v2026.md`
3. **Design Authority**
   - `02_software_design/*`
   - `adr/*`
4. **Execution Use Cases & Flow Contracts**
   - `03_use_cases/*`
   - `04_flowcharts/*`
5. **Planning + Delivery Gates (bridge into plans)**
   - `../plans/MASTER_PLAN.md`
   - `../plans/PENDING_TASKS_ONLY.md`
   - `../plans/waves/README.md`

---

## 3) Quality Gate Ladder (Software PM View)

| Gate             | Required Evidence                                                      |
| ---------------- | ---------------------------------------------------------------------- |
| Scope Ready      | Requirements updated + acceptance criteria clear + non-overlap checked |
| Design Ready     | Data contracts + API contracts + dependencies + ADR deltas logged      |
| Build Ready      | Typecheck + lint + targeted tests green for affected scope             |
| Release Ready    | Risk assessment + rollback notes + release communication prepared      |
| Governance Ready | `npm run plans:validate` pass + tracker sync complete                  |

---

## 4) Traceability Rules

- Every wave task should link to at least one software docs source section.
- Every significant architecture change should link to an ADR.
- Every quality gate should include command evidence path (log or CI artifact).
- Every completed wave should include test rollout closure evidence.

---

## 5) Immediate Upgrade Actions

1. Add software docs upgrade roadmap (Q3) with ownership and cadence.
2. Normalize folder references in manifest docs to match `docs/software_docs/*` reality.
3. Introduce software PM “risk-and-dependency watch” bridge into `docs/plans`.
4. Add release-readiness handoff template aligned with business release management docs.
