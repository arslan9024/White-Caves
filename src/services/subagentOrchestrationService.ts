import { apiClient } from '../utils/apiClient';

export type ModelTier = 'free' | 'standard' | 'premium';
export type TaskState = 'queued' | 'running' | 'done' | 'failed' | 'blocked';
export type TaskType =
  | 'research'
  | 'planning'
  | 'implementation'
  | 'review'
  | 'qa'
  | 'compliance'
  | 'documentation';

export interface AssistantExecutionProfile {
  id: string;
  role: string;
  modelPolicy: {
    defaultTier: ModelTier;
    premiumAllowed: boolean;
    requiresContextGate: boolean;
  };
  capabilities: string[];
  taskTypes: TaskType[];
}

export interface CollaborationEdge {
  from: string;
  to: string;
  reason: string;
}

export interface OrchestrationTask {
  id: string;
  assistantId: string;
  taskType: TaskType;
  title: string;
  state: TaskState;
  requestedTier: ModelTier;
  blockedReason: string | null;
  createdAt: string;
}

export interface OrchestrationStatusPayload {
  profiles: Record<string, AssistantExecutionProfile>;
  collaborationGraph: CollaborationEdge[];
  quota: {
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    dailyCap: number;
    premiumConsumedToday: number;
    premiumRemainingToday: number;
  };
  metrics?: {
    totalTasks: number;
    queuedTasks: number;
    runningTasks: number;
    doneTasks: number;
    failedTasks: number;
    blockedTasks: number;
    premiumTasks: number;
    standardTasks: number;
    freeTasks: number;
    lastTaskCreatedAt: string | null;
  };
  tasks: OrchestrationTask[];
}

export interface OrchestrationMetricsPayload {
  quota: {
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    dailyCap: number;
    premiumConsumedToday: number;
    premiumRemainingToday: number;
  };
  metrics: {
    totalTasks: number;
    queuedTasks: number;
    runningTasks: number;
    doneTasks: number;
    failedTasks: number;
    blockedTasks: number;
    premiumTasks: number;
    standardTasks: number;
    freeTasks: number;
    lastTaskCreatedAt: string | null;
  };
}

export interface OrchestrationSnapshotSummary {
  fileName: string;
  createdAt: string;
  taskCount: number;
}

export interface OrchestrationSnapshotDetail extends OrchestrationSnapshotSummary {
  quota: {
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    premiumConsumedToday: number;
  };
  metrics: OrchestrationMetricsPayload['metrics'];
  tasks: OrchestrationTask[];
}

const BASE = '/orchestration';

export const subagentOrchestrationService = {
  async getStatus() {
    return (await apiClient.get(`${BASE}/status`)) as {
      success: boolean;
      data: OrchestrationStatusPayload;
    };
  },

  async getTasks(assistantId?: string) {
    const query = assistantId ? `?assistantId=${encodeURIComponent(assistantId)}` : '';
    return (await apiClient.get(`${BASE}/tasks${query}`)) as {
      success: boolean;
      data: OrchestrationTask[];
    };
  },

  async getMetrics() {
    return (await apiClient.get(`${BASE}/metrics`)) as {
      success: boolean;
      data: OrchestrationMetricsPayload;
    };
  },

  async getSnapshots() {
    return (await apiClient.get(`${BASE}/snapshots`)) as {
      success: boolean;
      data: OrchestrationSnapshotSummary[];
    };
  },

  async getSnapshot(fileName: string) {
    return (await apiClient.get(`${BASE}/snapshots/${encodeURIComponent(fileName)}`)) as {
      success: boolean;
      data: OrchestrationSnapshotDetail;
    };
  },

  async exportSnapshot(label?: string) {
    const payload =
      typeof label === 'string' && label.trim().length > 0 ? { label: label.trim() } : {};

    return (await apiClient.post(`${BASE}/snapshots/export`, payload)) as {
      success: boolean;
      data: OrchestrationSnapshotSummary;
    };
  },

  async restoreSnapshot(fileName?: string) {
    const payload =
      typeof fileName === 'string' && fileName.trim().length > 0
        ? { fileName: fileName.trim() }
        : {};

    return (await apiClient.post(`${BASE}/snapshots/restore`, payload)) as {
      success: boolean;
      data: {
        snapshot: OrchestrationSnapshotSummary;
        metrics: OrchestrationMetricsPayload['metrics'];
      };
    };
  },

  async deleteSnapshot(fileName: string) {
    return (await apiClient.delete(`${BASE}/snapshots/${encodeURIComponent(fileName)}`)) as {
      success: boolean;
      data: {
        snapshot: OrchestrationSnapshotSummary;
        remaining: OrchestrationSnapshotSummary[];
      };
    };
  },

  async createTask(payload: {
    assistantId: string;
    taskType: TaskType;
    title: string;
    requestedTier?: ModelTier;
  }) {
    return (await apiClient.post(`${BASE}/tasks`, payload)) as {
      success: boolean;
      data: OrchestrationTask;
    };
  },

  async updateTaskState(id: string, state: TaskState, blockedReason?: string) {
    const payload =
      typeof blockedReason === 'string' && blockedReason.trim().length > 0
        ? { state, blockedReason: blockedReason.trim() }
        : { state };

    return (await apiClient.patch(`${BASE}/tasks/${id}/state`, payload)) as {
      success: boolean;
      data: OrchestrationTask;
    };
  },
};
