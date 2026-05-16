// ============================================================================
// AI ASSISTANT DASHBOARD — SELECTORS
// Extracted from aiAssistantDashboardSlice.tsx for maintainability
// ============================================================================
/* eslint-disable security/detect-object-injection */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// ── Stable empty references (prevent unnecessary re-renders) ────────────
const EMPTY_ARRAY: readonly never[] = Object.freeze([]);
const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({});
const EMPTY_SUGGESTIONS = Object.freeze({ inbox: [] as const, filters: {} as const });
const EMPTY_VAULT = Object.freeze({
  documents: [] as const,
  accessRequests: [] as const,
  permissions: {} as const,
  vaultStats: {} as const,
});
const EMPTY_LEAD_HUB = Object.freeze({
  incomingLeads: [] as const,
  processedLeads: {} as const,
  funnelMetrics: {} as const,
});
const EMPTY_COMPLIANCE = Object.freeze({
  kycProfiles: {} as const,
  amlMonitor: {} as const,
  auditLog: [] as const,
  complianceMetrics: {} as const,
});

// ── Base selectors ──────────────────────────────────────────────────────
const selectAssistantsState = (state: RootState) =>
  state.aiAssistantDashboard?.allAssistants?.byId ?? EMPTY_OBJECT;
const selectAllIds = (state: RootState) =>
  state.aiAssistantDashboard?.allAssistants?.allIds ?? EMPTY_ARRAY;

// ── Core Assistants ─────────────────────────────────────────────────────

export const selectAllAssistantsArray = createSelector(
  [selectAssistantsState, selectAllIds],
  (byId, allIds) => allIds.map(id => byId[id]).filter(Boolean)
);

export const selectAssistantById = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];

export const selectCurrentAssistant = (state: RootState) => {
  const selectedId = state.aiAssistantDashboard?.ui?.selectedAssistant;
  return state.aiAssistantDashboard?.allAssistants?.byId?.[selectedId];
};

// ── UI & Preferences ────────────────────────────────────────────────────

export const selectUI = (state: RootState) => state.aiAssistantDashboard?.ui;
export const selectFavorites = (state: RootState) =>
  state.aiAssistantDashboard?.favorites ?? EMPTY_ARRAY;
export const selectRecent = (state: RootState) => state.aiAssistantDashboard?.recent ?? EMPTY_ARRAY;
export const selectPerformance = (state: RootState) =>
  state.aiAssistantDashboard?.assistantPerformance;
export const selectOwnerPreferences = (state: RootState) =>
  state.aiAssistantDashboard?.ownerPreferences;
export const selectRecentActivity = (state: RootState) =>
  state.aiAssistantDashboard?.assistantPerformance?.recentActivity ?? EMPTY_ARRAY;

// ── Filtered / Grouped Assistants ───────────────────────────────────────

export const selectFilteredAssistants = createSelector(
  [selectAllAssistantsArray, selectUI],
  (assistants, ui) => {
    let filtered = assistants;
    if (ui?.filters?.department && ui.filters.department !== 'all') {
      filtered = filtered.filter(a => a.department === ui.filters.department);
    }
    if (ui?.filters?.status && ui.filters.status !== 'all') {
      filtered = filtered.filter(a => a.metrics.systemHealth === ui.filters.status);
    }
    if (ui?.filters?.searchQuery) {
      const query = ui.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.name.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.department.toLowerCase().includes(query)
      );
    }
    return filtered;
  }
);

export const selectAssistantsByDepartment = createSelector([selectAllAssistantsArray], assistants =>
  assistants.reduce(
    (acc, assistant) => {
      if (!acc[assistant.department]) acc[assistant.department] = [];
      acc[assistant.department].push(assistant);
      return acc;
    },
    {} as Record<string, typeof assistants>
  )
);

export const selectActiveAssistantsCount = createSelector(
  [selectAllAssistantsArray],
  assistants => assistants.filter(a => a.metrics.systemHealth === 'optimal').length
);

// ── Sidebar ─────────────────────────────────────────────────────────────

export const selectSidebar = (state: RootState) => state.aiAssistantDashboard?.sidebar;

// ── Notifications ───────────────────────────────────────────────────────

export const selectNotifications = (state: RootState) => state.aiAssistantDashboard?.notifications;

export const selectNotificationsByAssistant = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;

export const selectUnreadCountByAssistant = (assistantId: string) => (state: RootState) => {
  const notifications =
    state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
  return notifications.filter((n: { isRead: boolean }) => !n.isRead).length;
};

export const selectGlobalUnreadCount = (state: RootState) =>
  state.aiAssistantDashboard?.notifications?.globalUnreadCount ?? 0;

export const selectAllUnreadCounts = createSelector(
  [selectNotifications, selectAllIds],
  (notifications, allIds) => {
    const counts: Record<string, number> = {};
    allIds.forEach(id => {
      const assistantNotifications = notifications?.byAssistantId?.[id] || [];
      counts[id] = assistantNotifications.filter(n => !n.isRead).length;
    });
    return counts;
  }
);

// ── Tasks ───────────────────────────────────────────────────────────────

export const selectTasks = (state: RootState) => state.aiAssistantDashboard?.tasks;

export const selectTasksByAssistant = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;

const deriveLifecycleStage = (task: { lifecycleStage?: string; status?: string }) => {
  if (task.lifecycleStage) return task.lifecycleStage;
  if (task.status === 'in_progress') return 'in_progress';
  if (task.status === 'completed') return 'completed';
  if (task.status === 'assigned' || task.status === 'pending') return 'queued';
  return 'created';
};

export const selectTasksByLifecycleStage =
  (assistantId: string, stage: string) => (state: RootState) => {
    const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
    return tasks.filter(task => deriveLifecycleStage(task) === stage);
  };

export const selectPendingActionsCount = (assistantId: string) => (state: RootState) => {
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
  return tasks.filter(task => {
    const stage = deriveLifecycleStage(task);
    return stage === 'created' || stage === 'queued' || stage === 'pending_review';
  }).length;
};

export const selectCompletedTasksCount = (assistantId: string) => (state: RootState) => {
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
  return tasks.filter(task => deriveLifecycleStage(task) === 'completed').length;
};

export const selectInProgressTasksCount = (assistantId: string) => (state: RootState) => {
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
  return tasks.filter(task => deriveLifecycleStage(task) === 'in_progress').length;
};

// ── Olivia Automation ───────────────────────────────────────────────────

export const selectOliviaAutomation = (state: RootState) =>
  state.aiAssistantDashboard?.oliviaAutomation ?? EMPTY_OBJECT;

// ── Executive Suggestions ───────────────────────────────────────────────

export const selectExecutiveSuggestions = (state: RootState) =>
  state.aiAssistantDashboard?.executiveSuggestions ?? EMPTY_SUGGESTIONS;

export const selectFilteredSuggestions = createSelector(
  [selectExecutiveSuggestions],
  suggestions => {
    let filtered = suggestions.inbox || [];
    const filters = suggestions.filters || {};
    if (filters.priority && filters.priority !== 'all')
      filtered = filtered.filter(s => s.priority === filters.priority);
    if (filters.department && filters.department !== 'all')
      filtered = filtered.filter(s => s.assistantDepartment === filters.department);
    if (filters.status && filters.status !== 'all')
      filtered = filtered.filter(s => s.status === filters.status);
    return filtered;
  }
);

export const selectUnreviewedSuggestionsCount = createSelector(
  [selectExecutiveSuggestions],
  suggestions => (suggestions.inbox || []).filter(s => s.status === 'unreviewed').length
);

export const selectCriticalSuggestions = createSelector([selectExecutiveSuggestions], suggestions =>
  (suggestions.inbox || []).filter(s => s.priority === 'critical' && s.status === 'unreviewed')
);

// ── Assistant Status (composite) ────────────────────────────────────────

export const selectAssistantStatus = (assistantId: string) => (state: RootState) => {
  const assistant = state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] ?? EMPTY_ARRAY;
  const activeTasks = tasks.filter((t: { status: string }) => t.status !== 'completed').length;
  if (!assistant) return 'offline';
  if (activeTasks > 0) return 'busy';
  if (assistant.metrics?.systemHealth === 'optimal') return 'active';
  return 'idle';
};

// ── Confidential Vault ──────────────────────────────────────────────────

export const selectConfidentialVault = (state: RootState) =>
  state.aiAssistantDashboard?.confidentialVault ?? EMPTY_VAULT;

export const selectVaultPendingRequests = createSelector([selectConfidentialVault], vault =>
  vault.accessRequests.filter(r => r.status === 'pending')
);

// ── Lead Management ─────────────────────────────────────────────────────

export const selectLeadManagementHub = (state: RootState) =>
  state.aiAssistantDashboard?.leadManagementHub ?? EMPTY_LEAD_HUB;

export const selectLeadFunnelMetrics = (state: RootState) =>
  state.aiAssistantDashboard?.leadManagementHub?.funnelMetrics ?? EMPTY_OBJECT;

// ── Compliance ──────────────────────────────────────────────────────────

export const selectComplianceEngine = (state: RootState) =>
  state.aiAssistantDashboard?.complianceEngine ?? EMPTY_COMPLIANCE;

export const selectComplianceMetrics = (state: RootState) =>
  state.aiAssistantDashboard?.complianceEngine?.complianceMetrics ?? EMPTY_OBJECT;

// ── Phase 0.8 — Assistant Plans ─────────────────────────────────────────────

export const selectAssistantPlan =
  (id: string) =>
  (state: RootState): string | null =>
    state.aiAssistantDashboard?.plans?.[id] ?? null;

export const selectAssistantPlanLoading =
  (id: string) =>
  (state: RootState): boolean =>
    state.aiAssistantDashboard?.plansLoading?.[id] ?? false;

export const selectAssistantPlanError =
  (id: string) =>
  (state: RootState): string | null =>
    state.aiAssistantDashboard?.plansError?.[id] ?? null;
