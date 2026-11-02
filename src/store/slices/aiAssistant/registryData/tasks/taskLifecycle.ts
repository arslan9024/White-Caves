import type { Task, TaskAction, TaskLifecycleStage } from '../../types';

export /**
 * Adds lifecycle fields (lifecycleStage, actions, startedAt, updatedAt) to a
 * raw seed task based on its current status.  Used only by generateTasks().
 */
const enrichTaskWithLifecycle = (task: Task, nowMs: number): Task => {
  const TWO_HOURS_MS = 7_200_000;
  const ONE_HOUR_MS = 3_600_000;
  const THIRTY_MINUTES_MS = 1_800_000;

  const createdMs = nowMs - TWO_HOURS_MS;
  const startedMs = nowMs - ONE_HOUR_MS;
  const updatedMs = nowMs - THIRTY_MINUTES_MS;

  const stage: TaskLifecycleStage =
    task.status === 'in_progress' || task.status === 'assigned' ? 'in_progress' : 'queued';

  const actions: TaskAction[] = [
    {
      id: `${task.id}_act_created`,
      type: 'created',
      description: `Task "${task.title}" was created and queued`,
      actor: 'system',
      timestamp: new Date(createdMs).toISOString(),
      status: 'success',
      result: 'Task added to queue',
    },
  ];

  if (stage === 'in_progress') {
    actions.push({
      id: `${task.id}_act_started`,
      type: 'started',
      description: `Work commenced on: ${task.title}`,
      actor: task.assignedTo ?? 'system',
      timestamp: new Date(startedMs).toISOString(),
      status: 'success',
      result: 'Task is now in progress',
    });
  }

  return {
    ...task,
    lifecycleStage: stage,
    actions,
    startedAt: stage === 'in_progress' ? new Date(startedMs).toISOString() : undefined,
    updatedAt: new Date(updatedMs).toISOString(),
    createdAt: task.createdAt ?? new Date(createdMs).toISOString(),
  };
};
