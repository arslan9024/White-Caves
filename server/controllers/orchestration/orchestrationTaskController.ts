import { Response } from 'express';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import {
  ASSISTANT_ENDPOINT_CONTRACT,
  ASSISTANT_EXECUTION_PROFILES,
  ModelTier,
  OrchestrationTask,
  RouteRequest,
  TASK_STATES,
  TASK_STATE_TRANSITIONS,
  TaskState,
  TaskType,
  getTaskState,
  orchestrationTasks,
  persistState,
} from './orchestrationCommon.js';

export const getTasks = asyncHandler(async (req: RouteRequest, res: Response) => {
  const assistantId = typeof req.query.assistantId === 'string' ? req.query.assistantId : null;

  const filtered = assistantId
    ? orchestrationTasks.filter(task => task.assistantId === assistantId)
    : orchestrationTasks;

  res.json({ success: true, data: filtered.slice(0, 50) });
});

export const getAssistantEndpointsContract = asyncHandler(async (_req: RouteRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      ...ASSISTANT_ENDPOINT_CONTRACT,
      generatedAt: new Date().toISOString(),
    },
  });
});

export const createTask = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { assistantId, taskType, title, requestedTier } = req.body as {
    assistantId?: string;
    taskType?: TaskType;
    title?: string;
    requestedTier?: ModelTier;
  };

  if (!assistantId || !taskType || !title) {
    throw new AppError('assistantId, taskType, and title are required', 400);
  }

  const profile = Object.values(ASSISTANT_EXECUTION_PROFILES).find(
    candidate => candidate.id === assistantId
  );
  if (!profile) {
    throw new AppError(`Unknown assistant '${assistantId}'`, 404);
  }

  if (!profile.taskTypes.includes(taskType)) {
    throw new AppError(
      `Task type '${taskType}' is not allowed for assistant '${assistantId}'`,
      400
    );
  }

  const tier = requestedTier ?? profile.modelPolicy.defaultTier;
  const statusInfo = getTaskState(profile, tier);

  const task: OrchestrationTask = {
    id: `orch_${Date.now()}`,
    assistantId,
    taskType,
    title: title.trim(),
    state: statusInfo.state,
    requestedTier: tier,
    blockedReason: statusInfo.blockedReason,
    createdAt: new Date().toISOString(),
  };

  orchestrationTasks.unshift(task);
  persistState();

  res.status(201).json({ success: true, data: task });
});

export const updateTaskState = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { id } = req.params as Record<string, string>;
  const { state, blockedReason } = req.body as { state?: TaskState; blockedReason?: string };

  if (!state) {
    throw new AppError('state is required', 400);
  }

  if (!TASK_STATES.includes(state)) {
    throw new AppError(`Invalid task state '${state}'`, 400);
  }

  const task = orchestrationTasks.find(item => item.id === id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const allowedNext = TASK_STATE_TRANSITIONS[task.state];
  if (!allowedNext.includes(state)) {
    throw new AppError(`Invalid state transition from '${task.state}' to '${state}'`, 400);
  }

  task.state = state;
  task.blockedReason =
    state === 'blocked'
      ? typeof blockedReason === 'string' && blockedReason.trim().length > 0
        ? blockedReason.trim()
        : (task.blockedReason ?? 'Blocked by orchestration policy')
      : null;

  persistState();

  res.json({ success: true, data: task });
});
