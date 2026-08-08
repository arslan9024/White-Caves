import { describe, expect, it } from 'vitest';
import { getBatchSummaryLabel, prepareWorkBatches } from '../taskBatching';

describe('prepareWorkBatches', () => {
  it('creates readable labels for batches in the CRM task view', () => {
    const batches = prepareWorkBatches(
      [{ id: 'task-1', title: 'Review contract', priority: 'high' as const, deadline: 1 }],
      { maxBatchSize: 1 }
    );

    expect(getBatchSummaryLabel(batches[0], 0)).toBe('High Priority • Batch 1 • 1 item');
  });

  it('groups work items by priority, sorts by deadline, and splits them into batches', () => {
    const items = [
      { id: 'task-1', title: 'Review contract', priority: 'high' as const, deadline: 3 },
      { id: 'task-2', title: 'Sync CRM', priority: 'medium' as const, deadline: 1 },
      { id: 'task-3', title: 'Escalate bug', priority: 'high' as const, deadline: 2 },
      { id: 'task-4', title: 'Prepare report', priority: 'low' as const, deadline: 5 },
    ];

    const batches = prepareWorkBatches(items, { maxBatchSize: 2 });

    expect(batches).toHaveLength(3);
    expect(batches[0]).toMatchObject({ priority: 'high', items: [{ id: 'task-3' }, { id: 'task-1' }] });
    expect(batches[1]).toMatchObject({ priority: 'medium', items: [{ id: 'task-2' }] });
    expect(batches[2]).toMatchObject({ priority: 'low', items: [{ id: 'task-4' }] });
  });
});
