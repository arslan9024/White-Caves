# CRM Task Batching Design Note

**Status:** Active  
**Owner:** Software Engineering  
**Last Updated:** 2026-08-02  
**Source of Truth:** Yes

This note documents the reusable batching utility used by the CRM Tasks & Actions experience. It is intentionally lightweight and designed to be consumed by the React task view without introducing UI-specific branching logic.

## Scope

The current implementation provides a reusable batching helper that:

- groups work items by priority;
- sorts groups by a defined priority order;
- orders items within each group by deadline;
- splits each prioritized group into smaller batches.

## Design summary

The batching behavior is implemented in [../../../src/components/crm/ClaraLeadsCRM_NEW/utils/taskBatching.ts](../../../src/components/crm/ClaraLeadsCRM_NEW/utils/taskBatching.ts) and consumed by [../../../src/components/crm/ClaraLeadsCRM_NEW/tabs/TasksTab.tsx](../../../src/components/crm/ClaraLeadsCRM_NEW/tabs/TasksTab.tsx).

### Core contract

The batching utility expects a list of items shaped like:

- `id`
- `title`
- `priority` (critical, high, medium, low)
- `deadline` (optional numeric urgency value)

It returns a list of batches with a normalized priority label and the items assigned to that batch.

### Behavior

1. Group items by priority using the normalized priority string.
2. Apply the default priority order of critical, high, medium, low.
3. Sort each priority group by the earliest deadline first; missing deadlines fall to the end.
4. Split each group into batches using a default size of three items.

## Verification expectations

The batching contract is covered by focused unit tests at [../../../src/components/crm/ClaraLeadsCRM_NEW/utils/__tests__/taskBatching.test.ts](../../../src/components/crm/ClaraLeadsCRM_NEW/utils/__tests__/taskBatching.test.ts).

## Related references

- Business feature note: [../business_docs/09_crm_features/task-batching-and-priority-grouping.md](../business_docs/09_crm_features/task-batching-and-priority-grouping.md)
- Software docs index: [../INDEX.md](../INDEX.md)
- Planning entrypoint: [../../plans/README.md](../../plans/README.md)
