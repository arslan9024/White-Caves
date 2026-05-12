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
  label: string | null;
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

export interface OrchestrationSnapshotHistoryPayload {
  items: OrchestrationSnapshotSummary[];
  facets: Array<{ label: string; count: number }>;
  pageInfo: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
    query: string;
    order: 'asc' | 'desc';
    label: string | null;
  };
}

export interface OrchestrationSnapshotComparePayload {
  targetQuery: string;
  source: {
    snapshot: OrchestrationSnapshotSummary;
    quota: {
      weeklyPremiumRemaining: number;
      businessDaysRemaining: number;
      premiumConsumedToday: number;
    };
    metrics: OrchestrationMetricsPayload['metrics'];
  };
  target: {
    kind: 'current' | 'snapshot';
    snapshot: OrchestrationSnapshotSummary | null;
    quota: {
      weeklyPremiumRemaining: number;
      businessDaysRemaining: number;
      premiumConsumedToday: number;
    };
    metrics: OrchestrationMetricsPayload['metrics'];
  };
  delta: {
    totalTasks: number;
    queuedTasks: number;
    runningTasks: number;
    doneTasks: number;
    failedTasks: number;
    blockedTasks: number;
    premiumTasks: number;
    weeklyPremiumRemaining: number;
    businessDaysRemaining: number;
    premiumConsumedToday: number;
  };
}

export interface OrchestrationSnapshotRestoreRecommendationPayload {
  source: {
    fileName: string;
    createdAt: string;
    label: string | null;
  };
  target: string;
  delta: {
    totalTasks: number;
    runningTasks: number;
    failedTasks: number;
    premiumConsumedToday: number;
  };
  recommendation: {
    decision: 'safe' | 'caution' | 'risky';
    score: number;
    reasons: string[];
  };
}

export interface OrchestrationSnapshotRestorePreviewPayload {
  snapshot: OrchestrationSnapshotSummary;
  current: {
    quota: {
      weeklyPremiumRemaining: number;
      businessDaysRemaining: number;
      premiumConsumedToday: number;
    };
    metrics: OrchestrationMetricsPayload['metrics'];
  };
  preview: {
    quota: {
      weeklyPremiumRemaining: number;
      businessDaysRemaining: number;
      premiumConsumedToday: number;
    };
    metrics: OrchestrationMetricsPayload['metrics'];
  };
  delta: {
    totalTasks: number;
    queuedTasks: number;
    runningTasks: number;
    doneTasks: number;
    failedTasks: number;
    blockedTasks: number;
    premiumConsumedToday: number;
  };
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

  async getSnapshotHistory(options?: {
    offset?: number;
    limit?: number;
    q?: string;
    order?: 'asc' | 'desc';
    label?: string;
  }) {
    const params = new URLSearchParams();
    if (typeof options?.offset === 'number' && Number.isFinite(options.offset)) {
      params.set('offset', String(Math.max(0, Math.floor(options.offset))));
    }
    if (typeof options?.limit === 'number' && Number.isFinite(options.limit)) {
      params.set('limit', String(Math.max(1, Math.floor(options.limit))));
    }
    if (typeof options?.q === 'string' && options.q.trim().length > 0) {
      params.set('q', options.q.trim());
    }
    if (options?.order === 'asc' || options?.order === 'desc') {
      params.set('order', options.order);
    }
    if (typeof options?.label === 'string' && options.label.trim().length > 0) {
      params.set('label', options.label.trim());
    }
    const query = params.toString();
    const url = `${BASE}/snapshots/history${query ? `?${query}` : ''}`;

    return (await apiClient.get(url)) as {
      success: boolean;
      data: OrchestrationSnapshotHistoryPayload;
    };
  },

  async getSnapshot(fileName: string) {
    return (await apiClient.get(`${BASE}/snapshots/${encodeURIComponent(fileName)}`)) as {
      success: boolean;
      data: OrchestrationSnapshotDetail;
    };
  },

  async getSnapshotRestorePreview(fileName: string) {
    return (await apiClient.get(`${BASE}/snapshots/${encodeURIComponent(fileName)}/preview`)) as {
      success: boolean;
      data: OrchestrationSnapshotRestorePreviewPayload;
    };
  },

  async getSnapshotCompare(fileName: string, target?: string) {
    const params = new URLSearchParams();
    if (typeof target === 'string' && target.trim().length > 0) {
      params.set('target', target.trim());
    }
    const query = params.toString();
    const url = `${BASE}/snapshots/${encodeURIComponent(fileName)}/compare${query ? `?${query}` : ''}`;

    return (await apiClient.get(url)) as {
      success: boolean;
      data: OrchestrationSnapshotComparePayload;
    };
  },

  async getSnapshotRestoreRecommendation(fileName: string, target?: string) {
    const params = new URLSearchParams();
    if (typeof target === 'string' && target.trim().length > 0) {
      params.set('target', target.trim());
    }
    const query = params.toString();
    const url = `${BASE}/snapshots/${encodeURIComponent(fileName)}/recommend-restore${query ? `?${query}` : ''}`;

    return (await apiClient.get(url)) as {
      success: boolean;
      data: OrchestrationSnapshotRestoreRecommendationPayload;
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
