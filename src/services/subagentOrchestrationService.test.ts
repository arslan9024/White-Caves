import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from '../utils/apiClient';
import { subagentOrchestrationService } from './subagentOrchestrationService';

const mApiGet = apiClient.get as ReturnType<typeof vi.fn>;
const mApiPost = apiClient.post as ReturnType<typeof vi.fn>;
const mApiPatch = apiClient.patch as ReturnType<typeof vi.fn>;
const mApiDelete = apiClient.delete as ReturnType<typeof vi.fn>;

describe('subagentOrchestrationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getStatus calls GET /orchestration/status', async () => {
    const response = {
      success: true,
      data: {
        profiles: {},
        collaborationGraph: [],
        quota: {
          weeklyPremiumRemaining: 10,
          businessDaysRemaining: 5,
          dailyCap: 2,
          premiumConsumedToday: 0,
          premiumRemainingToday: 2,
        },
        tasks: [],
      },
    };
    mApiGet.mockResolvedValue(response);

    const result = await subagentOrchestrationService.getStatus();

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/status');
    expect(result).toEqual(response);
  });

  it('getTasks calls GET /orchestration/tasks without query when assistantId not provided', async () => {
    mApiGet.mockResolvedValue({ success: true, data: [] });

    await subagentOrchestrationService.getTasks();

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/tasks');
  });

  it('getTasks URL-encodes assistantId query param', async () => {
    mApiGet.mockResolvedValue({ success: true, data: [] });

    await subagentOrchestrationService.getTasks('henry + qa');

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/tasks?assistantId=henry%20%2B%20qa');
  });

  it('getMetrics calls GET /orchestration/metrics', async () => {
    const response = {
      success: true,
      data: {
        quota: {
          weeklyPremiumRemaining: 10,
          businessDaysRemaining: 5,
          dailyCap: 2,
          premiumConsumedToday: 1,
          premiumRemainingToday: 1,
        },
        metrics: {
          totalTasks: 3,
          queuedTasks: 1,
          runningTasks: 1,
          doneTasks: 1,
          failedTasks: 0,
          blockedTasks: 0,
          premiumTasks: 1,
          standardTasks: 2,
          freeTasks: 0,
          lastTaskCreatedAt: null,
        },
      },
    };
    mApiGet.mockResolvedValue(response);

    const result = await subagentOrchestrationService.getMetrics();

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/metrics');
    expect(result).toEqual(response);
  });

  it('getSnapshots calls GET /orchestration/snapshots', async () => {
    const response = { success: true, data: [] };
    mApiGet.mockResolvedValue(response);

    const result = await subagentOrchestrationService.getSnapshots();

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/snapshots');
    expect(result).toEqual(response);
  });

  it('getSnapshotHistory calls GET /orchestration/snapshots/history with encoded query', async () => {
    const response = {
      success: true,
      data: {
        items: [],
        pageInfo: { offset: 0, limit: 5, total: 0, hasMore: false, query: 'nightly label' },
      },
    };
    mApiGet.mockResolvedValue(response);

    const result = await subagentOrchestrationService.getSnapshotHistory({
      offset: 0,
      limit: 5,
      q: 'nightly label',
    });

    expect(mApiGet).toHaveBeenCalledWith(
      '/orchestration/snapshots/history?offset=0&limit=5&q=nightly+label'
    );
    expect(result).toEqual(response);
  });

  it('exportSnapshot calls POST /orchestration/snapshots/export', async () => {
    const response = {
      success: true,
      data: {
        fileName: 'orch-snapshot-test.json',
        createdAt: '2026-05-12',
        taskCount: 1,
        label: 'nightly',
      },
    };
    mApiPost.mockResolvedValue(response);

    const result = await subagentOrchestrationService.exportSnapshot('nightly');

    expect(mApiPost).toHaveBeenCalledWith('/orchestration/snapshots/export', { label: 'nightly' });
    expect(result).toEqual(response);
  });

  it('getSnapshot calls GET /orchestration/snapshots/:fileName', async () => {
    const response = {
      success: true,
      data: {
        fileName: 'orch-snapshot-test.json',
        createdAt: '',
        taskCount: 1,
        label: 'nightly',
        tasks: [],
      },
    };
    mApiGet.mockResolvedValue(response);

    const result = await subagentOrchestrationService.getSnapshot('orch-snapshot-test.json');

    expect(mApiGet).toHaveBeenCalledWith('/orchestration/snapshots/orch-snapshot-test.json');
    expect(result).toEqual(response);
  });

  it('restoreSnapshot calls POST /orchestration/snapshots/restore', async () => {
    const response = {
      success: true,
      data: {
        snapshot: { fileName: 'orch-snapshot-test.json', createdAt: '', taskCount: 1 },

        metrics: { totalTasks: 1 },
      },
    };
    mApiPost.mockResolvedValue(response);

    const result = await subagentOrchestrationService.restoreSnapshot('orch-snapshot-test.json');

    expect(mApiPost).toHaveBeenCalledWith('/orchestration/snapshots/restore', {
      fileName: 'orch-snapshot-test.json',
    });
    expect(result).toEqual(response);
  });

  it('deleteSnapshot calls DELETE /orchestration/snapshots/:fileName', async () => {
    const response = {
      success: true,
      data: {
        snapshot: { fileName: 'orch-snapshot-test.json', createdAt: '', taskCount: 1 },

        remaining: [],
      },
    };
    mApiDelete.mockResolvedValue(response);

    const result = await subagentOrchestrationService.deleteSnapshot('orch-snapshot-test.json');

    expect(mApiDelete).toHaveBeenCalledWith('/orchestration/snapshots/orch-snapshot-test.json');
    expect(result).toEqual(response);
  });

  it('createTask calls POST /orchestration/tasks with payload', async () => {
    const payload = {
      assistantId: 'henry',
      taskType: 'review' as const,
      title: 'Review handoff contracts',
      requestedTier: 'standard' as const,
    };
    const response = {
      success: true,
      data: {
        id: 't-1',
        assistantId: 'henry',
        taskType: 'review',
        title: 'Review handoff contracts',
        state: 'queued',
        requestedTier: 'standard',
        blockedReason: null,
        createdAt: new Date().toISOString(),
      },
    };
    mApiPost.mockResolvedValue(response);

    const result = await subagentOrchestrationService.createTask(payload);

    expect(mApiPost).toHaveBeenCalledWith('/orchestration/tasks', payload);
    expect(result).toEqual(response);
  });

  it('updateTaskState calls PATCH /orchestration/tasks/:id/state', async () => {
    const response = {
      success: true,
      data: {
        id: 't-1',
        assistantId: 'henry',
        taskType: 'review',
        title: 'Review handoff contracts',
        state: 'running',
        requestedTier: 'standard',
        blockedReason: null,
        createdAt: new Date().toISOString(),
      },
    };
    mApiPatch.mockResolvedValue(response);

    const result = await subagentOrchestrationService.updateTaskState('t-1', 'running');

    expect(mApiPatch).toHaveBeenCalledWith('/orchestration/tasks/t-1/state', { state: 'running' });
    expect(result).toEqual(response);
  });

  it('updateTaskState includes trimmed blockedReason when provided', async () => {
    mApiPatch.mockResolvedValue({ success: true, data: { id: 't-2' } });

    await subagentOrchestrationService.updateTaskState('t-2', 'blocked', '  waiting legal  ');

    expect(mApiPatch).toHaveBeenCalledWith('/orchestration/tasks/t-2/state', {
      state: 'blocked',
      blockedReason: 'waiting legal',
    });
  });
});
