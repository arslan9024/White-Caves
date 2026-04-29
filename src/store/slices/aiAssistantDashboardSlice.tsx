// ============================================================================
// AI ASSISTANT DASHBOARD SLICE — Core Redux logic
// Types      → ./aiAssistant/types.ts
// Data       → ./aiAssistant/registry.ts
// State      → ./aiAssistant/initialState.ts
// Selectors  → ./aiAssistant/selectors.ts
// ============================================================================

import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import { logout } from '../authSlice';
import { getErrorMessage } from '../../constants';

// ── Re-export types for consumer convenience ──
export type {
  AIAssistant,
  AssistantMetrics,
  Activity,
  Notification,
  Task,
  ExecutiveSuggestion,
  ExecutiveSuggestionsState,
  OliviaInsights,
  OliviaCoordination,
  MonitoredSite,
  VaultDocument,
  VaultAccessRequest,
  Lead,
  ProcessedLead,
  ComplianceMetrics,
  AIAssistantDashboardState,
} from './aiAssistant/types';

import type {
  AssistantMetrics,
  Activity,
  Notification,
  Task,
  Lead,
  ExecutiveSuggestion,
  ExecutiveSuggestionsState,
  OliviaInsights,
  OliviaCoordination,
  MonitoredSite,
} from './aiAssistant/types';

import {
  AI_ASSISTANTS_REGISTRY,
  DEPARTMENT_COLORS,
} from './aiAssistant/registry';

import {
  getInitialState,
  MAX_RECENT_ASSISTANTS,
  MAX_ACTIVITY_LOG,
  MAX_AUDIT_LOG,
} from './aiAssistant/initialState';

// ── Re-export selectors for consumer convenience ──
export {
  selectAllAssistantsArray,
  selectAssistantById,
  selectCurrentAssistant,
  selectUI,
  selectFavorites,
  selectRecent,
  selectPerformance,
  selectOwnerPreferences,
  selectRecentActivity,
  selectFilteredAssistants,
  selectAssistantsByDepartment,
  selectActiveAssistantsCount,
  selectSidebar,
  selectNotifications,
  selectNotificationsByAssistant,
  selectUnreadCountByAssistant,
  selectGlobalUnreadCount,
  selectAllUnreadCounts,
  selectTasks,
  selectTasksByAssistant,
  selectOliviaAutomation,
  selectExecutiveSuggestions,
  selectFilteredSuggestions,
  selectUnreviewedSuggestionsCount,
  selectCriticalSuggestions,
  selectAssistantStatus,
  selectConfidentialVault,
  selectVaultPendingRequests,
  selectLeadManagementHub,
  selectLeadFunnelMetrics,
  selectComplianceEngine,
  selectComplianceMetrics,
} from './aiAssistant/selectors';

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchAllAssistants = createAsyncThunk(
  'aiAssistantDashboard/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return {
        assistants: AI_ASSISTANTS_REGISTRY,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const updateAssistantMetricsAsync = createAsyncThunk(
  'aiAssistantDashboard/updateMetrics',
  async (
    payload: { assistantId: string; metrics: Partial<AssistantMetrics> },
    { rejectWithValue },
  ) => {
    try {
      return { ...payload, timestamp: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

/**
 * Phase 0.8 — Fetch the markdown plan for a specific assistant from /api/assistants/:id/plan.
 * Requires the user to be authenticated; called lazily when an assistant is selected.
 */
export const fetchAssistantPlan = createAsyncThunk(
  'aiAssistantDashboard/fetchPlan',
  async (assistantId: string, { rejectWithValue }) => {
    try {
      const { assistantsService } = await import('../../services/assistantsService');
      const response = await assistantsService.getPlan(assistantId);
      return { id: assistantId, plan: response.plan };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load assistant plan',
      );
    }
  },
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const aiAssistantDashboardSlice = createSlice({
  name: 'aiAssistantDashboard',
  initialState: getInitialState(),
  reducers: {
    // ── Core assistant selection ────────────────────────────────────────
    selectAssistant: (state, action: PayloadAction<string>) => {
      state.ui.selectedAssistant = action.payload;
      if (!state.recent.includes(action.payload)) {
        state.recent.unshift(action.payload);
        if (state.recent.length > MAX_RECENT_ASSISTANTS) state.recent.pop();
      } else {
        state.recent = state.recent.filter((id) => id !== action.payload);
        state.recent.unshift(action.payload);
      }
      state.ui.dropdownOpen = false;
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
      state.ownerPreferences.favoriteAssistants = [...state.favorites];
    },

    updateAssistantMetrics: (
      state,
      action: PayloadAction<{ assistantId: string; metrics: Partial<AssistantMetrics> }>,
    ) => {
      const { assistantId, metrics } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics = {
          ...state.allAssistants.byId[assistantId].metrics,
          ...metrics,
        };
      }
    },

    updateAssistantHealth: (
      state,
      action: PayloadAction<{ assistantId: string; health: AssistantMetrics['systemHealth'] }>,
    ) => {
      const { assistantId, health } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics.systemHealth = health;
      }
    },

    // ── UI state ────────────────────────────────────────────────────────
    setViewMode: (state, action: PayloadAction<string>) => {
      state.ui.viewMode = action.payload;
    },
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.ui.layout = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.ui.filters.department = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.ui.filters.status = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.filters.searchQuery = action.payload;
    },
    toggleDropdown: (state) => {
      state.ui.dropdownOpen = !state.ui.dropdownOpen;
    },
    closeDropdown: (state) => {
      state.ui.dropdownOpen = false;
    },

    // ── Performance & activity ──────────────────────────────────────────
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const activity = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      } as Activity;
      state.assistantPerformance.recentActivity.unshift(activity);
      if (state.assistantPerformance.recentActivity.length > MAX_ACTIVITY_LOG) {
        state.assistantPerformance.recentActivity.pop();
      }
    },
    addAlert: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.assistantPerformance.criticalAlerts.push(action.payload);
    },
    dismissAlert: (state, action: PayloadAction<string>) => {
      state.assistantPerformance.criticalAlerts =
        state.assistantPerformance.criticalAlerts.filter(
          (alert) => (alert as Record<string, unknown>).id !== action.payload,
        );
    },

    // ── Owner preferences ───────────────────────────────────────────────
    updateOwnerPreferences: (
      state,
      action: PayloadAction<Partial<typeof state.ownerPreferences>>,
    ) => {
      state.ownerPreferences = { ...state.ownerPreferences, ...action.payload };
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.liveUpdates.isConnected = action.payload;
      state.liveUpdates.lastUpdate = new Date().toISOString();
    },

    // ── Sidebar ─────────────────────────────────────────────────────────
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    collapseSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isCollapsed = action.payload;
    },
    setSidebarActiveAssistant: (state, action: PayloadAction<string | null>) => {
      state.sidebar.activeAssistantId = action.payload;
    },

    // ── Notifications ───────────────────────────────────────────────────
    addNotification: (
      state,
      action: PayloadAction<{
        assistantId: string;
        notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>;
      }>,
    ) => {
      const { assistantId, notification } = action.payload;
      if (!state.notifications.byAssistantId[assistantId]) {
        state.notifications.byAssistantId[assistantId] = [];
      }
      state.notifications.byAssistantId[assistantId].unshift({
        ...notification,
        id: `n${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
      } as Notification);
      state.notifications.globalUnreadCount += 1;
    },
    markNotificationRead: (
      state,
      action: PayloadAction<{ assistantId: string; notificationId: string }>,
    ) => {
      const { assistantId, notificationId } = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.notifications.globalUnreadCount = Math.max(
            0,
            state.notifications.globalUnreadCount - 1,
          );
        }
      }
    },
    markAllNotificationsRead: (state, action: PayloadAction<string>) => {
      const assistantId = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        notifications.forEach((n) => { n.isRead = true; });
        state.notifications.globalUnreadCount = Math.max(
          0,
          state.notifications.globalUnreadCount - unreadCount,
        );
      }
    },
    clearNotifications: (state, action: PayloadAction<string>) => {
      state.notifications.byAssistantId[action.payload] = [];
    },

    // ── Task management ─────────────────────────────────────────────────
    addTask: (
      state,
      action: PayloadAction<{
        assistantId: string;
        task: Omit<Task, 'id' | 'createdAt' | 'status'>;
      }>,
    ) => {
      const { assistantId, task } = action.payload;
      if (!state.tasks.byAssistantId[assistantId]) {
        state.tasks.byAssistantId[assistantId] = [];
      }
      state.tasks.byAssistantId[assistantId].push({
        ...task,
        id: `t${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
      } as Task);
      state.tasks.activeTasksCount += 1;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ assistantId: string; taskId: string; status: Task['status'] }>,
    ) => {
      const { assistantId, taskId, status } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          const wasActive = task.status !== 'completed';
          task.status = status;
          if (status === 'completed' && wasActive) {
            state.tasks.activeTasksCount = Math.max(0, state.tasks.activeTasksCount - 1);
          }
        }
      }
    },
    assignTask: (
      state,
      action: PayloadAction<{ assistantId: string; taskId: string; agentId: string }>,
    ) => {
      const { assistantId, taskId, agentId } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          task.assignedTo = agentId;
          task.status = 'assigned';
        }
      }
    },

    // ── Cross-assistant coordination ────────────────────────────────────
    triggerUserAction: (
      state,
      action: PayloadAction<{
        actionType: string;
        sourceAssistant: string;
        targetAssistants: string[];
        data: Record<string, unknown>;
      }>,
    ) => {
      const { actionType, sourceAssistant, targetAssistants, data } = action.payload;
      targetAssistants.forEach((targetId) => {
        if (!state.notifications.byAssistantId[targetId]) {
          state.notifications.byAssistantId[targetId] = [];
        }
        state.notifications.byAssistantId[targetId].unshift({
          id: `n${Date.now()}_${targetId}`,
          type: actionType,
          message: `Action from ${sourceAssistant}: ${(data.message as string) || actionType}`,
          severity: (data.severity as Notification['severity']) || 'info',
          isRead: false,
          timestamp: new Date().toISOString(),
          sourceAssistant,
          data,
        });
        state.notifications.globalUnreadCount += 1;
      });
    },

    // ── Olivia automation ───────────────────────────────────────────────
    updateOliviaSyncSchedule: (state, action: PayloadAction<string>) => {
      state.oliviaAutomation.syncSchedule = action.payload;
    },
    toggleOliviaMonitoring: (state) => {
      state.oliviaAutomation.activeMonitoring = !state.oliviaAutomation.activeMonitoring;
    },
    updateOliviaPropertySync: (state) => {
      state.oliviaAutomation.lastPropertySync = new Date().toISOString();
    },
    updateOliviaMarketResearch: (state) => {
      state.oliviaAutomation.lastMarketResearch = new Date().toISOString();
    },
    updateOliviaInsights: (state, action: PayloadAction<Partial<OliviaInsights>>) => {
      state.oliviaAutomation.insightsData = {
        ...state.oliviaAutomation.insightsData,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
    },
    updateOliviaCoordination: (state, action: PayloadAction<Partial<OliviaCoordination>>) => {
      state.oliviaAutomation.coordination = {
        ...state.oliviaAutomation.coordination,
        ...action.payload,
      };
    },
    updateOliviaSiteStatus: (
      state,
      action: PayloadAction<{
        siteName: string;
        status: MonitoredSite['status'];
        dataPoints?: unknown;
      }>,
    ) => {
      const { siteName, status, dataPoints } = action.payload;
      const site = state.oliviaAutomation.monitoredSites.find((s) => s.name === siteName);
      if (site) {
        site.status = status;
        site.lastCheck = new Date().toISOString();
        if (dataPoints !== undefined) site.dataPoints = dataPoints;
      }
    },
    addOliviaActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const activity = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      } as Activity;
      state.oliviaAutomation.activityLog.unshift(activity);
      if (state.oliviaAutomation.activityLog.length > MAX_ACTIVITY_LOG) {
        state.oliviaAutomation.activityLog.pop();
      }
    },

    // ── Executive suggestions ───────────────────────────────────────────
    addExecutiveSuggestion: (
      state,
      action: PayloadAction<Omit<ExecutiveSuggestion, 'id' | 'timestamp' | 'status'>>,
    ) => {
      const suggestion: ExecutiveSuggestion = {
        id: `sugg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'unreviewed',
        ...action.payload,
      };
      state.executiveSuggestions.inbox.unshift(suggestion);
    },
    updateSuggestionStatus: (
      state,
      action: PayloadAction<{ suggestionId: string; status: ExecutiveSuggestion['status'] }>,
    ) => {
      const { suggestionId, status } = action.payload;
      const suggestion = state.executiveSuggestions.inbox.find((s) => s.id === suggestionId);
      if (suggestion) suggestion.status = status;
    },
    setSuggestionFilters: (
      state,
      action: PayloadAction<Partial<ExecutiveSuggestionsState['filters']>>,
    ) => {
      state.executiveSuggestions.filters = {
        ...state.executiveSuggestions.filters,
        ...action.payload,
      };
    },
    clearSuggestionFilters: (state) => {
      state.executiveSuggestions.filters = {
        priority: 'all',
        department: 'all',
        status: 'unreviewed',
      };
    },

    // ── Confidential vault ──────────────────────────────────────────────
    requestVaultAccess: (
      state,
      action: PayloadAction<{ documentId: string; requesterId: string; reason: string }>,
    ) => {
      const { documentId, requesterId, reason } = action.payload;
      state.confidentialVault.accessRequests.push({
        id: `req_${Date.now()}`,
        documentId,
        requesterId,
        reason,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null,
      });
      state.confidentialVault.vaultStats.pendingRequests += 1;
    },
    approveVaultRequest: (
      state,
      action: PayloadAction<{ requestId: string; approverId: string }>,
    ) => {
      const { requestId, approverId } = action.payload;
      const request = state.confidentialVault.accessRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = 'approved';
        request.reviewedBy = approverId;
        request.reviewedAt = new Date().toISOString();
        state.confidentialVault.vaultStats.pendingRequests = Math.max(
          0,
          state.confidentialVault.vaultStats.pendingRequests - 1,
        );
        state.confidentialVault.vaultStats.recentAccesses += 1;
        const doc = state.confidentialVault.documents.find((d) => d.id === request.documentId);
        if (doc) {
          doc.accessLog.push({
            accessedBy: request.requesterId,
            accessedAt: new Date().toISOString(),
          });
        }
      }
    },
    denyVaultRequest: (
      state,
      action: PayloadAction<{ requestId: string; approverId: string; reason: string }>,
    ) => {
      const { requestId, approverId, reason } = action.payload;
      const request = state.confidentialVault.accessRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = 'denied';
        request.reviewedBy = approverId;
        request.reviewedAt = new Date().toISOString();
        request.denyReason = reason;
        state.confidentialVault.vaultStats.pendingRequests = Math.max(
          0,
          state.confidentialVault.vaultStats.pendingRequests - 1,
        );
      }
    },

    // ── Lead management ─────────────────────────────────────────────────
    addIncomingLead: (state, action: PayloadAction<Omit<Lead, 'id' | 'receivedAt'>>) => {
      state.leadManagementHub.incomingLeads.push({
        id: `lead_${Date.now()}`,
        receivedAt: new Date().toISOString(),
        initialIntent: undefined,
        ...action.payload,
      });
      state.leadManagementHub.funnelMetrics.totalIncoming += 1;
    },
    qualifyLead: (
      state,
      action: PayloadAction<{
        leadId: string;
        assignedIntent: unknown;
        qualificationScore: number;
        structuredData: unknown;
      }>,
    ) => {
      const { leadId, assignedIntent, qualificationScore, structuredData } = action.payload;
      const lead = state.leadManagementHub.incomingLeads.find((l) => l.id === leadId);
      if (lead) {
        state.leadManagementHub.processedLeads[leadId] = {
          status: 'qualified',
          assignedIntent,
          qualificationScore,
          structuredData,
          qualifiedAt: new Date().toISOString(),
          routedTo: null,
          routedAt: null,
        };
      }
    },
    routeLeadToSpecialist: (
      state,
      action: PayloadAction<{ leadId: string; specialist: string }>,
    ) => {
      const { leadId, specialist } = action.payload;
      const processed = state.leadManagementHub.processedLeads[leadId];
      if (processed) {
        processed.status = 'routed';
        processed.routedTo = specialist;
        processed.routedAt = new Date().toISOString();
        if (!state.leadManagementHub.specialistPipelines[specialist]) {
          state.leadManagementHub.specialistPipelines[specialist] = {
            leadIds: [],
            pipelineStages: [],
          };
        }
        state.leadManagementHub.specialistPipelines[specialist].leadIds.push(leadId);
      }
    },
    updateLeadPipelineStage: (
      state,
      action: PayloadAction<{ leadId: string; specialist: string; stage: string }>,
    ) => {
      const { leadId, stage } = action.payload;
      const processed = state.leadManagementHub.processedLeads[leadId];
      if (processed) processed.currentStage = stage;
    },

    // ── Compliance engine ───────────────────────────────────────────────
    addComplianceAuditLog: (
      state,
      action: PayloadAction<Omit<Record<string, unknown>, 'id' | 'timestamp'>>,
    ) => {
      const entry = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.complianceEngine.auditLog.unshift(entry);
      if (state.complianceEngine.auditLog.length > MAX_AUDIT_LOG) {
        state.complianceEngine.auditLog.pop();
      }
    },
    flagTransaction: (
      state,
      action: PayloadAction<Omit<Record<string, unknown>, 'id' | 'flaggedAt' | 'status'>>,
    ) => {
      const transaction = {
        id: `tx_${Date.now()}`,
        flaggedAt: new Date().toISOString(),
        status: 'pending_review',
        ...action.payload,
      };
      state.complianceEngine.amlMonitor.flaggedTransactions.push(transaction);
      state.complianceEngine.amlMonitor.investigationQueue.push(transaction.id as string);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssistants.pending, (state) => {
        state.allAssistants.isLoading = true;
      })
      .addCase(fetchAllAssistants.fulfilled, (state, action) => {
        state.allAssistants.isLoading = false;
        state.allAssistants.lastFetched = action.payload.timestamp;
      })
      .addCase(updateAssistantMetricsAsync.fulfilled, (state, action) => {
        const { assistantId, metrics } = action.payload;
        if (state.allAssistants.byId[assistantId]) {
          state.allAssistants.byId[assistantId].metrics = {
            ...state.allAssistants.byId[assistantId].metrics,
            ...metrics,
          };
        }
      })
      // ── Phase 0.8 — assistant plan loading ────────────────────────────
      .addCase(fetchAssistantPlan.pending, (state, action) => {
        state.plansLoading[action.meta.arg] = true;
        state.plansError[action.meta.arg] = null;
      })
      .addCase(fetchAssistantPlan.fulfilled, (state, action) => {
        state.plansLoading[action.payload.id] = false;
        state.plans[action.payload.id] = action.payload.plan;
      })
      .addCase(fetchAssistantPlan.rejected, (state, action) => {
        state.plansLoading[action.meta.arg] = false;
        state.plansError[action.meta.arg] = (action.payload ?? 'Failed to load plan') as string;
      })
      .addCase(logout, () => getInitialState());
  },
});

// ============================================================================
// ACTION EXPORTS
// ============================================================================

export const {
  selectAssistant,
  toggleFavorite,
  updateAssistantMetrics,
  updateAssistantHealth,
  setViewMode,
  setLayout,
  setDepartmentFilter,
  setStatusFilter,
  setSearchQuery,
  toggleDropdown,
  closeDropdown,
  addActivity,
  addAlert,
  dismissAlert,
  updateOwnerPreferences,
  setConnectionStatus,
  toggleSidebar,
  collapseSidebar,
  setSidebarActiveAssistant,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  addTask,
  updateTaskStatus,
  assignTask,
  triggerUserAction,
  updateOliviaSyncSchedule,
  toggleOliviaMonitoring,
  updateOliviaPropertySync,
  updateOliviaMarketResearch,
  updateOliviaInsights,
  updateOliviaCoordination,
  updateOliviaSiteStatus,
  addOliviaActivity,
  addExecutiveSuggestion,
  updateSuggestionStatus,
  setSuggestionFilters,
  clearSuggestionFilters,
  requestVaultAccess,
  approveVaultRequest,
  denyVaultRequest,
  addIncomingLead,
  qualifyLead,
  routeLeadToSpecialist,
  updateLeadPipelineStage,
  addComplianceAuditLog,
  flagTransaction,
} = aiAssistantDashboardSlice.actions;

export { DEPARTMENT_COLORS };

export default aiAssistantDashboardSlice.reducer;
