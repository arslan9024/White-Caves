export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type BatchableWorkItem = {
  id: string;
  title: string;
  priority?: TaskPriority;
  deadline?: number;
};

export type WorkBatch<T extends BatchableWorkItem = BatchableWorkItem> = {
  priority: string;
  items: T[];
};

export function getBatchSummaryLabel<T extends BatchableWorkItem>(
  batch: WorkBatch<T>,
  index: number
): string {
  const priorityLabel = batch.priority.charAt(0).toUpperCase() + batch.priority.slice(1);
  const itemCountLabel = `${batch.items.length} item${batch.items.length === 1 ? '' : 's'}`;
  return `${priorityLabel} Priority • Batch ${index + 1} • ${itemCountLabel}`;
}

export function prepareWorkBatches<T extends BatchableWorkItem>(
  items: T[],
  options: { maxBatchSize?: number; priorityOrder?: TaskPriority[] } = {}
): WorkBatch<T>[] {
  const { maxBatchSize = 5, priorityOrder = ['critical', 'high', 'medium', 'low'] } = options;

  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const key = (item.priority ?? 'medium').toLowerCase();
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  }

  const orderedGroups = Array.from(grouped.entries()).sort(([a], [b]) => {
    const aIndex = priorityOrder.indexOf(a as TaskPriority);
    const bIndex = priorityOrder.indexOf(b as TaskPriority);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  const batches: WorkBatch<T>[] = [];

  for (const [priority, group] of orderedGroups) {
    const sortedGroup = [...group].sort((a, b) => {
      const aDate = a.deadline ?? Number.MAX_SAFE_INTEGER;
      const bDate = b.deadline ?? Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });

    for (let index = 0; index < sortedGroup.length; index += maxBatchSize) {
      batches.push({
        priority,
        items: sortedGroup.slice(index, index + maxBatchSize),
      });
    }
  }

  return batches;
}
