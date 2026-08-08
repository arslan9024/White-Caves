# CRM Task Batching and Priority Grouping

<!-- markdownlint-disable MD024 MD050 -->

**Status:** Active  
**Owner:** Product & CRM Delivery  
**Last Updated:** 2026-08-02  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM task batching and priority grouping feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend tasks UX/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

This feature groups CRM tasks into priority-led batches so the Tasks & Actions experience stays readable and easier to act on. The behavior is currently implemented in the Clara Leads CRM task view and is intentionally reusable so the batching logic is not embedded directly inside the UI component.

## Requirement catalog

### REQ-TASK-001: Priority-led task batching

The system shall group CRM tasks by priority and keep the highest priority work first.

**Acceptance criteria:**

- [ ] Critical and high priority tasks appear before lower priorities
- [ ] Missing priority values default to medium
- [ ] Batch labels clearly show priority and item count

**Evidence:** grouped task view and batch render snapshot.

### REQ-TASK-002: Deadline-aware ordering and batch sizing

The system shall sort items within each batch by urgency and maintain a small default batch size.

**Acceptance criteria:**

- [ ] Tasks inside a batch are ordered by earliest deadline
- [ ] Default batch size remains capped at three items
- [ ] Batch generation is deterministic for a fixed input set

**Evidence:** task batching output and ordering test snapshot.

### REQ-TASK-003: Reusable UI integration

The system shall expose batching logic as a reusable utility for task views.

**Acceptance criteria:**

- [ ] The utility can be consumed outside the current task view
- [ ] UI components render batch headers with priority badges
- [ ] Regression tests cover the batching behavior

**Evidence:** utility import path, task view integration, and test output.

## Traceability

- Maps to task-follow-up and CRM prioritization coverage
- Aligns to `WC-SRS-002` and task batching implementation artifacts
- Feeds task triage and dashboard presentation validation

## Purpose and business outcome

- reduce visual overload in the CRM task view by grouping similar work into clearly labeled batches;
- surface the most urgent follow-up work first;
- make task triage easier for agents who need to work through a large list of pending leads and follow-ups.

## Business rules

- Priority order is treated as critical, high, medium, and low.
- When a priority is not explicitly provided, the system defaults to medium.
- Items inside each priority group are sorted by the earliest deadline first.
- The default view uses batches of up to three items.

## User-facing behavior

- The task view renders a batch card for each generated batch.
- Each batch card displays a readable summary label such as “High Priority • Batch 1 • 3 items”.
- The batch header also shows the priority badge so agents can quickly identify where to focus first.

## Acceptance expectations

- High-priority work is displayed before medium- and low-priority work.
- Items within a batch are ordered by urgency and due date.
- The default batch size remains small enough for scanning without sacrificing context.

## Traceability

- Implementation: [../../../src/components/crm/ClaraLeadsCRM_NEW/utils/taskBatching.ts](../../../src/components/crm/ClaraLeadsCRM_NEW/utils/taskBatching.ts)
- UI integration: [../../../src/components/crm/ClaraLeadsCRM_NEW/tabs/TasksTab.tsx](../../../src/components/crm/ClaraLeadsCRM_NEW/tabs/TasksTab.tsx)
- Regression tests: [../../../src/components/crm/ClaraLeadsCRM_NEW/utils/__tests__/taskBatching.test.ts](../../../src/components/crm/ClaraLeadsCRM_NEW/utils/__tests__/taskBatching.test.ts)
- Related business index: [README.md](README.md)
- Related software note: [../../software_docs/02_software_design/crm_task_batching_design.md](../../software_docs/02_software_design/crm_task_batching_design.md)

## Related requirements and planning references

- Business requirements index: [../05_requirements/functional-requirements.md](../05_requirements/functional-requirements.md)
- Planning entrypoint: [../../plans/README.md](../../plans/README.md)
- Wave 32 governance backlog: [../../plans/waves/WAVE_32_IMPLEMENTATION_BACKLOG.md](../../plans/waves/WAVE_32_IMPLEMENTATION_BACKLOG.md)
