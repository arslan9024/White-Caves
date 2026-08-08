# CRM Task Batching and Priority Grouping

**Status:** Active  
**Owner:** Product & CRM Delivery  
**Last Updated:** 2026-08-02  
**Source of Truth:** Yes

This feature groups CRM tasks into priority-led batches so the Tasks & Actions experience stays readable and easier to act on. The behavior is currently implemented in the Clara Leads CRM task view and is intentionally reusable so the batching logic is not embedded directly inside the UI component.

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
