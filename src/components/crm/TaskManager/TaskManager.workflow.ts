/**
 * TaskManager.workflow.ts
 * 7-Category Architecture: Workflow Engine Layer
 * Universal 4-Stage I-P-O-V Protocol for 200+ Tasks Execution & Escalation
 */

import type { TaskNode, TaskStatus, TaskReportingChain } from './TaskManager.types';

export interface TaskWorkflowResult {
  success: boolean;
  tasks: TaskNode[];
  message: string;
  awardedXp?: number;
}

/**
 * Stage 1-4 I-P-O-V: Create new statutory or operational task
 */
export function executeCreateTaskWorkflow(
  tasks: TaskNode[],
  payload: Omit<TaskNode, '_id' | 'taskCode'>
): TaskWorkflowResult {
  if (!payload.title?.trim() || !payload.pillarId) {
    return { success: false, tasks, message: 'Task title and operational pillar are required.' };
  }

  const nextNum = tasks.length + 1;
  const newCode = `TSK-${String(nextNum).padStart(3, '0')}`;
  const newTask: TaskNode = {
    ...payload,
    _id: `task-custom-${Date.now()}`,
    taskCode: newCode,
    status: payload.status || 'PENDING',
    createdAt: new Date().toISOString().split('T')[0],
    completionRate: 0,
  };

  return {
    success: true,
    tasks: [newTask, ...tasks],
    message: `Created task ${newCode}: ${newTask.title}. Escalation chain assigned to ${newTask.reportingChain.supervisorName}.`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Update existing task details
 */
export function executeUpdateTaskWorkflow(
  tasks: TaskNode[],
  id: string,
  patch: Partial<TaskNode>
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID is required for update.' };

  const idx = tasks.findIndex(t => t._id === id);
  if (idx === -1) return { success: false, tasks, message: 'Task record not found.' };

  const updatedTasks = [...tasks];
  updatedTasks[idx] = { ...updatedTasks[idx], ...patch };

  return {
    success: true,
    tasks: updatedTasks,
    message: `Updated task ${updatedTasks[idx].taskCode}: ${updatedTasks[idx].title}.`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Advance task status through reporting hierarchy
 */
export function executeAdvanceTaskStatusWorkflow(
  tasks: TaskNode[],
  id: string,
  newStatus: TaskStatus
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID required.' };

  const target = tasks.find(t => t._id === id);
  if (!target) return { success: false, tasks, message: 'Task not found.' };

  const completionRate =
    newStatus === 'COMPLETED'
      ? 100
      : newStatus === 'REVIEW'
        ? 85
        : newStatus === 'IN_PROGRESS'
          ? 50
          : 0;

  const awardedXp =
    newStatus === 'COMPLETED'
      ? target.priority === 'P0'
        ? 135
        : target.priority === 'P1'
          ? 68
          : target.priority === 'P2'
            ? 34
            : 14
      : 0;

  const updated = tasks.map(t => (t._id === id ? { ...t, status: newStatus, completionRate } : t));

  const message =
    newStatus === 'COMPLETED'
      ? `Task ${target.taskCode} marked COMPLETED! +${awardedXp} Merit XP awarded to ${target.reportingChain.supervisorName}.`
      : `Task ${target.taskCode} status transitioned from ${target.status} to ${newStatus}.`;

  return {
    success: true,
    tasks: updated,
    message,
    awardedXp,
  };
}

/**
 * Stage 1-4 I-P-O-V: Reassign Reporting Escalation Chain
 */
export function executeReassignTaskChainWorkflow(
  tasks: TaskNode[],
  id: string,
  chain: TaskReportingChain
): TaskWorkflowResult {
  if (!id) return { success: false, tasks, message: 'Task ID required.' };

  const target = tasks.find(t => t._id === id);
  if (!target) return { success: false, tasks, message: 'Task not found.' };

  const updated = tasks.map(t => (t._id === id ? { ...t, reportingChain: chain } : t));

  return {
    success: true,
    tasks: updated,
    message: `Reassigned escalation chain for ${target.taskCode} to Supervisor ${chain.supervisorName} / Director ${chain.directorName}.`,
  };
}
