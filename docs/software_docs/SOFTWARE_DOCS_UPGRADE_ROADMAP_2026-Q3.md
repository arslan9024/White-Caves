# Software Docs Upgrade Roadmap — 2026 Q3

**Objective:** Upgrade software documentation for stronger project-management quality, better execution order, and tighter planning traceability.

---

## Workstreams

| ID    | Priority | Workstream                                   | Owner Lane              | Output                                                                              |
| ----- | -------- | -------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------- |
| SD-01 | P0       | Manifest path normalization                  | Architecture            | Align all references with `docs/software_docs/*` and `docs/plans/*` canonical paths |
| SD-02 | P0       | Requirement-to-wave traceability map         | Architecture + Planning | Mapping table from requirements to active/next wave tasks                           |
| SD-03 | P1       | Software risk/dependency watch               | Architecture + QA       | Risk register pointer + dependency drift checklist                                  |
| SD-04 | P1       | Release-readiness handoff template           | DevOps + QA             | Software release packet template linked to business release docs                    |
| SD-05 | P1       | Ownership/RACI matrix for software artifacts | Architecture + PM       | Matrix for requirement/design/use-case/flowchart/ADR ownership                      |
| SD-06 | P0       | Governance evidence discipline               | QA + Planning           | Standard section for quality gate command outputs and artifacts                     |

---

## Cadence

- **Weekly:** update requirement drift and dependency watch
- **Bi-weekly:** architecture + ADR alignment review
- **Per wave closeout:** release-ready evidence pack and test-traceability sync

---

## Dependency into Planning

Outputs from SD-01..SD-06 must be referenced by:

- `docs/plans/waves/WAVE_31_READINESS_PACKET.md`
- `docs/plans/waves/WAVE_31_IMPLEMENTATION_BACKLOG.md`
- `docs/plans/waves/WAVE_31_TEST_ROLLOUT.md`

and the next planning cycle baseline in `docs/plans/MASTER_PLAN.md`.
