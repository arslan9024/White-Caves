import type { Task } from '../types';
import { enrichTaskWithLifecycle } from './taskLifecycle';
import { coreRawTasks } from './coreTasks.data';
import { growthRawTasks } from './growthTasks.data';
import { intelligenceRawTasks } from './intelligenceTasks.data';
import { marketRawTasks } from './marketTasks.data';
import { advancedRawTasks } from './advancedTasks.data';

export const generateTasks = (): Record<string, Task[]> => {
  const rawTasks: Record<string, Task[]> = {
    ...coreRawTasks,
    ...growthRawTasks,
    ...intelligenceRawTasks,
    ...marketRawTasks,
    ...advancedRawTasks,
  };

  const now = Date.now();
  const enriched: Record<string, Task[]> = {};
  for (const [assistantId, taskList] of Object.entries(rawTasks)) {
    // eslint-disable-next-line security/detect-object-injection
    enriched[assistantId] = taskList.map(t => enrichTaskWithLifecycle(t as Task, now));
  }
  return enriched;
};
