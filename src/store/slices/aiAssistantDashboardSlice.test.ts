/* eslint-disable security/detect-object-injection */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, {
  // Async thunks
  fetchAllAssistants,
  updateAssistantMetricsAsync,
  // Core assistant selection
  selectAssistant,
  toggleFavorite,
  updateAssistantMetrics,
  updateAssistantHealth,
  // UI state
  setViewMode,
  setLayout,
  setDepartmentFilter,
  setStatusFilter,
  setSearchQuery,
  toggleDropdown,
  closeDropdown,
  // Performance & activity
  addActivity,
  addAlert,
  dismissAlert,
  // Owner preferences
  updateOwnerPreferences,
  setConnectionStatus,
  // Sidebar
  toggleSidebar,
  collapseSidebar,
  setSidebarActiveAssistant,
  // Notifications
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  // Task management
  addTask,
  updateTaskStatus,
  assignTask,
  // Cross-assistant coordination
  triggerUserAction,
  // Olivia automation
  updateOliviaSyncSchedule,
  toggleOliviaMonitoring,
  updateOliviaPropertySync,
  updateOliviaMarketResearch,
  updateOliviaInsights,
  updateOliviaCoordination,
  updateOliviaSiteStatus,
  addOliviaActivity,
  // Executive suggestions
  addExecutiveSuggestion,
  updateSuggestionStatus,
  setSuggestionFilters,
  clearSuggestionFilters,
  // Confidential vault
  requestVaultAccess,
  approveVaultRequest,
  denyVaultRequest,
  // Lead management
  addIncomingLead,
  qualifyLead,
  routeLeadToSpecialist,
  updateLeadPipelineStage,
  // Compliance
  addComplianceAuditLog,
  flagTransaction,
  // Lifecycle
  advanceTaskLifecycle,
  addTaskAction,
  setTaskResult,
  // Re-exports
  DEPARTMENT_COLORS,
} from './aiAssistantDashboardSlice';

import {
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
  selectGlobalUnreadCount,
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
  selectTasksByLifecycleStage,
  selectPendingActionsCount,
  selectCompletedTasksCount,
  selectInProgressTasksCount,
} from './aiAssistantDashboardSlice';

import type { RootState } from '../store';

// ── Helpers ─────────────────────────────────────────────────────────────

const initialState = () => reducer(undefined, { type: '@@INIT' });
type SliceState = ReturnType<typeof initialState>;

const rootWith = (overrides: Partial<SliceState> = {}): RootState =>
  ({ aiAssistantDashboard: { ...initialState(), ...overrides } }) as unknown as RootState;

// ═══════════════════════════════════════════════════════════════════════
describe('aiAssistantDashboardSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────
  describe('initial state', () => {
    it('has all assistants loaded (17 assistants)', () => {
      const s = initialState();
      expect(s.allAssistants.allIds.length).toBeGreaterThanOrEqual(10);
      expect(s.allAssistants.byId.mary).toBeDefined();
      expect(s.allAssistants.byId.nadia).toBeDefined();
    });

    it('defaults to mary as selected assistant', () => {
      expect(initialState().ui.selectedAssistant).toBe('mary');
    });

    it('starts with grid layout and dashboard view', () => {
      const s = initialState();
      expect(s.ui.layout).toBe('grid');
      expect(s.ui.viewMode).toBe('dashboard');
    });

    it('has initial favorites', () => {
      expect(initialState().favorites).toContain('nadia');
      expect(initialState().favorites).toContain('mary');
    });

    it('configures sidebar as open and right-positioned', () => {
      const sb = initialState().sidebar;
      expect(sb.isOpen).toBe(true);
      expect(sb.position).toBe('right');
      expect(sb.isCollapsed).toBe(false);
    });

    it('is initialized', () => {
      expect(initialState().initialized).toBe(true);
    });

    it('has vault documents', () => {
      expect(initialState().confidentialVault.documents.length).toBeGreaterThan(0);
    });

    it('has executive suggestions in inbox', () => {
      expect(initialState().executiveSuggestions.inbox.length).toBeGreaterThan(0);
    });
  });

  // ── Core assistant selection ──────────────────────────────────────
  describe('selectAssistant', () => {
    it('sets selectedAssistant and adds to recent', () => {
      const state = reducer(initialState(), selectAssistant('nadia'));
      expect(state.ui.selectedAssistant).toBe('nadia');
      expect(state.recent[0]).toBe('nadia');
    });

    it('moves existing recent to front without duplicating', () => {
      let state = reducer(initialState(), selectAssistant('olivia'));
      state = reducer(state, selectAssistant('clara'));
      state = reducer(state, selectAssistant('olivia'));
      const uniqueIds = new Set(state.recent);
      expect(uniqueIds.size).toBe(state.recent.length); // no duplicates
      expect(state.recent[0]).toBe('olivia');
    });

    it('closes dropdown', () => {
      let state = reducer(initialState(), toggleDropdown());
      expect(state.ui.dropdownOpen).toBe(true);
      state = reducer(state, selectAssistant('theodora'));
      expect(state.ui.dropdownOpen).toBe(false);
    });

    it('limits recent to MAX_RECENT_ASSISTANTS (5)', () => {
      let state = initialState();
      for (const id of ['mary', 'nadia', 'olivia', 'clara', 'sophia', 'theodora', 'zoe']) {
        state = reducer(state, selectAssistant(id));
      }
      expect(state.recent.length).toBeLessThanOrEqual(5);
    });
  });

  // ── toggleFavorite ────────────────────────────────────────────────
  describe('toggleFavorite', () => {
    it('adds to favorites when not present', () => {
      const state = reducer(initialState(), toggleFavorite('theodora'));
      expect(state.favorites).toContain('theodora');
    });

    it('removes from favorites when already present', () => {
      const state = reducer(initialState(), toggleFavorite('nadia'));
      expect(state.favorites).not.toContain('nadia');
    });

    it('syncs ownerPreferences.favoriteAssistants', () => {
      const state = reducer(initialState(), toggleFavorite('theodora'));
      expect(state.ownerPreferences.favoriteAssistants).toContain('theodora');
    });
  });

  // ── updateAssistantMetrics ────────────────────────────────────────
  describe('updateAssistantMetrics', () => {
    it('merges metrics for existing assistant', () => {
      const state = reducer(
        initialState(),
        updateAssistantMetrics({ assistantId: 'mary', metrics: { tasksCompleted: 999 } })
      );
      expect(state.allAssistants.byId.mary.metrics.tasksCompleted).toBe(999);
    });

    it('does nothing for non-existent assistant', () => {
      const before = initialState();
      const after = reducer(before, updateAssistantMetrics({ assistantId: 'xxx', metrics: {} }));
      expect(Object.keys(after.allAssistants.byId)).toEqual(Object.keys(before.allAssistants.byId));
    });
  });

  // ── updateAssistantHealth ─────────────────────────────────────────
  describe('updateAssistantHealth', () => {
    it('updates systemHealth for existing assistant', () => {
      const state = reducer(
        initialState(),
        updateAssistantHealth({ assistantId: 'nadia', health: 'degraded' })
      );
      expect(state.allAssistants.byId.nadia.metrics.systemHealth).toBe('degraded');
    });
  });

  // ── UI state actions ──────────────────────────────────────────────
  describe('UI actions', () => {
    it('setViewMode', () => {
      const state = reducer(initialState(), setViewMode('analytics'));
      expect(state.ui.viewMode).toBe('analytics');
    });

    it('setLayout', () => {
      const state = reducer(initialState(), setLayout('list'));
      expect(state.ui.layout).toBe('list');
    });

    it('setDepartmentFilter', () => {
      const state = reducer(initialState(), setDepartmentFilter('sales'));
      expect(state.ui.filters.department).toBe('sales');
    });

    it('setStatusFilter', () => {
      const state = reducer(initialState(), setStatusFilter('degraded'));
      expect(state.ui.filters.status).toBe('degraded');
    });

    it('setSearchQuery', () => {
      const state = reducer(initialState(), setSearchQuery('mary'));
      expect(state.ui.filters.searchQuery).toBe('mary');
    });

    it('toggleDropdown toggles', () => {
      let state = reducer(initialState(), toggleDropdown());
      expect(state.ui.dropdownOpen).toBe(true);
      state = reducer(state, toggleDropdown());
      expect(state.ui.dropdownOpen).toBe(false);
    });

    it('closeDropdown', () => {
      let state = reducer(initialState(), toggleDropdown());
      state = reducer(state, closeDropdown());
      expect(state.ui.dropdownOpen).toBe(false);
    });
  });

  // ── Performance & activity ────────────────────────────────────────
  describe('performance & activity', () => {
    it('addActivity prepends activity', () => {
      const before = initialState().assistantPerformance.recentActivity.length;
      const state = reducer(
        initialState(),
        addActivity({ assistantId: 'mary', action: 'test', target: 'test', type: 'info' })
      );
      expect(state.assistantPerformance.recentActivity.length).toBe(before + 1);
      expect(state.assistantPerformance.recentActivity[0].action).toBe('test');
    });

    it('addAlert pushes alert', () => {
      const state = reducer(initialState(), addAlert({ id: 'a1', message: 'cpu high' }));
      expect(state.assistantPerformance.criticalAlerts).toHaveLength(1);
    });

    it('dismissAlert removes by id', () => {
      let state = reducer(initialState(), addAlert({ id: 'a1', message: 'cpu high' }));
      state = reducer(state, dismissAlert('a1'));
      expect(state.assistantPerformance.criticalAlerts).toHaveLength(0);
    });
  });

  // ── Owner preferences ─────────────────────────────────────────────
  describe('owner preferences', () => {
    it('updateOwnerPreferences merges', () => {
      const state = reducer(initialState(), updateOwnerPreferences({ dashboardLayout: 'compact' }));
      expect(state.ownerPreferences.dashboardLayout).toBe('compact');
      expect(state.ownerPreferences.defaultAssistant).toBe('mary'); // unchanged
    });

    it('setConnectionStatus', () => {
      const state = reducer(initialState(), setConnectionStatus(true));
      expect(state.liveUpdates.isConnected).toBe(true);
      expect(state.liveUpdates.lastUpdate).not.toBeNull();
    });
  });

  // ── Sidebar ───────────────────────────────────────────────────────
  describe('sidebar', () => {
    it('toggleSidebar', () => {
      let state = reducer(initialState(), toggleSidebar());
      expect(state.sidebar.isOpen).toBe(false);
      state = reducer(state, toggleSidebar());
      expect(state.sidebar.isOpen).toBe(true);
    });

    it('collapseSidebar', () => {
      const state = reducer(initialState(), collapseSidebar(true));
      expect(state.sidebar.isCollapsed).toBe(true);
    });

    it('setSidebarActiveAssistant', () => {
      const state = reducer(initialState(), setSidebarActiveAssistant('nadia'));
      expect(state.sidebar.activeAssistantId).toBe('nadia');
    });
  });

  // ── Notifications ─────────────────────────────────────────────────
  describe('notifications', () => {
    it('addNotification creates notification and increments unread', () => {
      const before = initialState().notifications.globalUnreadCount;
      const state = reducer(
        initialState(),
        addNotification({
          assistantId: 'mary',
          notification: { type: 'alert', message: 'test', severity: 'info' },
        })
      );
      expect(state.notifications.byAssistantId.mary.length).toBeGreaterThan(0);
      expect(state.notifications.globalUnreadCount).toBe(before + 1);
    });

    it('markNotificationRead marks and decrements unread', () => {
      // Add one so we have a known unread
      let state = reducer(
        initialState(),
        addNotification({
          assistantId: 'laila',
          notification: { type: 'alert', message: 'check', severity: 'warning' },
        })
      );
      const notifId = state.notifications.byAssistantId.laila[0].id;
      const unreadBefore = state.notifications.globalUnreadCount;
      state = reducer(
        state,
        markNotificationRead({ assistantId: 'laila', notificationId: notifId })
      );
      expect(state.notifications.globalUnreadCount).toBe(unreadBefore - 1);
      expect(state.notifications.byAssistantId.laila[0].isRead).toBe(true);
    });

    it('markNotificationRead does not double-decrement', () => {
      let state = reducer(
        initialState(),
        addNotification({
          assistantId: 'laila',
          notification: { type: 'a', message: 'b', severity: 'info' },
        })
      );
      const notifId = state.notifications.byAssistantId.laila[0].id;
      state = reducer(
        state,
        markNotificationRead({ assistantId: 'laila', notificationId: notifId })
      );
      const count = state.notifications.globalUnreadCount;
      state = reducer(
        state,
        markNotificationRead({ assistantId: 'laila', notificationId: notifId })
      );
      expect(state.notifications.globalUnreadCount).toBe(count); // unchanged
    });

    it('markAllNotificationsRead marks all and adjusts count', () => {
      let state = initialState();
      state = reducer(
        state,
        addNotification({
          assistantId: 'sophia',
          notification: { type: 'a', message: 'b', severity: 'info' },
        })
      );
      state = reducer(
        state,
        addNotification({
          assistantId: 'sophia',
          notification: { type: 'a', message: 'c', severity: 'info' },
        })
      );
      const before = state.notifications.globalUnreadCount;
      state = reducer(state, markAllNotificationsRead('sophia'));
      expect(state.notifications.byAssistantId.sophia.every(n => n.isRead)).toBe(true);
      expect(state.notifications.globalUnreadCount).toBeLessThan(before);
    });

    it('clearNotifications empties assistant notifications', () => {
      const state = reducer(initialState(), clearNotifications('nadia'));
      expect(state.notifications.byAssistantId.nadia).toEqual([]);
    });
  });

  // ── Task management ───────────────────────────────────────────────
  describe('task management', () => {
    it('addTask creates pending task and increments activeTasksCount', () => {
      const before = initialState().tasks.activeTasksCount;
      const state = reducer(
        initialState(),
        addTask({
          assistantId: 'nadia',
          task: {
            title: 'Test task',
            priority: 'high',
            assignedTo: null,
            dueDate: new Date().toISOString(),
          },
        })
      );
      expect(state.tasks.activeTasksCount).toBe(before + 1);
      const tasks = state.tasks.byAssistantId.nadia;
      const newTask = tasks[tasks.length - 1];
      expect(newTask.title).toBe('Test task');
      expect(newTask.status).toBe('pending');
    });

    it('updateTaskStatus to completed decrements activeTasksCount', () => {
      let state = reducer(
        initialState(),
        addTask({
          assistantId: 'clara',
          task: { title: 'Task', priority: 'medium', assignedTo: null, dueDate: '' },
        })
      );
      const taskId = state.tasks.byAssistantId.clara[state.tasks.byAssistantId.clara.length - 1].id;
      const before = state.tasks.activeTasksCount;
      state = reducer(
        state,
        updateTaskStatus({ assistantId: 'clara', taskId, status: 'completed' })
      );
      expect(state.tasks.activeTasksCount).toBe(before - 1);
    });

    it('assignTask sets assignedTo and status=assigned', () => {
      let state = reducer(
        initialState(),
        addTask({
          assistantId: 'mary',
          task: { title: 'Assign me', priority: 'low', assignedTo: null, dueDate: '' },
        })
      );
      const taskId = state.tasks.byAssistantId.mary[state.tasks.byAssistantId.mary.length - 1].id;
      state = reducer(state, assignTask({ assistantId: 'mary', taskId, agentId: 'agent-1' }));
      const task = state.tasks.byAssistantId.mary.find(t => t.id === taskId);
      expect(task?.assignedTo).toBe('agent-1');
      expect(task?.status).toBe('assigned');
    });
  });

  // ── Cross-assistant coordination ──────────────────────────────────
  describe('triggerUserAction', () => {
    it('sends notifications to target assistants', () => {
      const state = reducer(
        initialState(),
        triggerUserAction({
          actionType: 'data_request',
          sourceAssistant: 'olivia',
          targetAssistants: ['mary', 'theodora'],
          data: { message: 'Need report' },
        })
      );
      expect(state.notifications.byAssistantId.mary[0].message).toContain('olivia');
      expect(state.notifications.byAssistantId.theodora[0].message).toContain('olivia');
      // globalUnreadCount increased by 2
      expect(state.notifications.globalUnreadCount).toBe(
        initialState().notifications.globalUnreadCount + 2
      );
    });
  });

  // ── Olivia automation ─────────────────────────────────────────────
  describe('olivia automation', () => {
    it('updateOliviaSyncSchedule', () => {
      const state = reducer(initialState(), updateOliviaSyncSchedule('daily'));
      expect(state.oliviaAutomation.syncSchedule).toBe('daily');
    });

    it('toggleOliviaMonitoring', () => {
      const before = initialState().oliviaAutomation.activeMonitoring;
      const state = reducer(initialState(), toggleOliviaMonitoring());
      expect(state.oliviaAutomation.activeMonitoring).toBe(!before);
    });

    it('updateOliviaPropertySync sets timestamp', () => {
      const state = reducer(initialState(), updateOliviaPropertySync());
      expect(state.oliviaAutomation.lastPropertySync).not.toBeNull();
    });

    it('updateOliviaMarketResearch sets timestamp', () => {
      const state = reducer(initialState(), updateOliviaMarketResearch());
      expect(state.oliviaAutomation.lastMarketResearch).not.toBeNull();
    });

    it('updateOliviaInsights merges and sets lastUpdated', () => {
      const state = reducer(initialState(), updateOliviaInsights({ priceIndex: 200 }));
      expect(state.oliviaAutomation.insightsData.priceIndex).toBe(200);
      expect(state.oliviaAutomation.insightsData.lastUpdated).toBeDefined();
    });

    it('updateOliviaCoordination merges', () => {
      const state = reducer(initialState(), updateOliviaCoordination({ maryConnected: false }));
      expect(state.oliviaAutomation.coordination.maryConnected).toBe(false);
    });

    it('updateOliviaSiteStatus updates matching site', () => {
      const state = reducer(
        initialState(),
        updateOliviaSiteStatus({ siteName: 'Bayut', status: 'degraded' })
      );
      const site = state.oliviaAutomation.monitoredSites.find(s => s.name === 'Bayut');
      expect(site?.status).toBe('degraded');
      expect(site?.lastCheck).not.toBeNull();
    });

    it('addOliviaActivity prepends to log', () => {
      const state = reducer(
        initialState(),
        addOliviaActivity({
          assistantId: 'olivia',
          action: 'sync',
          target: 'market',
          type: 'success',
        })
      );
      expect(state.oliviaAutomation.activityLog[0].action).toBe('sync');
    });
  });

  // ── Executive suggestions ─────────────────────────────────────────
  describe('executive suggestions', () => {
    it('addExecutiveSuggestion prepends to inbox', () => {
      const before = initialState().executiveSuggestions.inbox.length;
      const state = reducer(
        initialState(),
        addExecutiveSuggestion({
          fromAssistant: 'clara',
          assistantDepartment: 'sales',
          priority: 'high',
          type: 'opportunity',
          title: 'New deal found',
          analysis: 'Big deal',
          dataPoints: ['point1'],
          projectedImpact: 'High',
          confidence: 0.9,
        })
      );
      expect(state.executiveSuggestions.inbox.length).toBe(before + 1);
      expect(state.executiveSuggestions.inbox[0].status).toBe('unreviewed');
    });

    it('updateSuggestionStatus', () => {
      const id = initialState().executiveSuggestions.inbox[0].id;
      const state = reducer(
        initialState(),
        updateSuggestionStatus({ suggestionId: id, status: 'acknowledged' })
      );
      expect(state.executiveSuggestions.inbox.find(s => s.id === id)?.status).toBe('acknowledged');
    });

    it('setSuggestionFilters merges', () => {
      const state = reducer(initialState(), setSuggestionFilters({ priority: 'critical' }));
      expect(state.executiveSuggestions.filters.priority).toBe('critical');
    });

    it('clearSuggestionFilters resets to defaults', () => {
      let state = reducer(
        initialState(),
        setSuggestionFilters({ priority: 'high', department: 'sales' })
      );
      state = reducer(state, clearSuggestionFilters());
      expect(state.executiveSuggestions.filters).toEqual({
        priority: 'all',
        department: 'all',
        status: 'unreviewed',
      });
    });
  });

  // ── Confidential vault ────────────────────────────────────────────
  describe('confidential vault', () => {
    it('requestVaultAccess adds pending request', () => {
      const state = reducer(
        initialState(),
        requestVaultAccess({
          documentId: 'doc_001',
          requesterId: 'theodora',
          reason: 'Need Q4 report',
        })
      );
      expect(state.confidentialVault.accessRequests).toHaveLength(1);
      expect(state.confidentialVault.accessRequests[0].status).toBe('pending');
      expect(state.confidentialVault.vaultStats.pendingRequests).toBe(1);
    });

    it('approveVaultRequest approves and logs access', () => {
      let state = reducer(
        initialState(),
        requestVaultAccess({ documentId: 'doc_001', requesterId: 'theodora', reason: 'Need it' })
      );
      const reqId = state.confidentialVault.accessRequests[0].id;
      state = reducer(state, approveVaultRequest({ requestId: reqId, approverId: 'zoe' }));
      const req = state.confidentialVault.accessRequests.find(r => r.id === reqId);
      expect(req?.status).toBe('approved');
      expect(req?.reviewedBy).toBe('zoe');
      expect(state.confidentialVault.vaultStats.pendingRequests).toBe(0);
      expect(state.confidentialVault.vaultStats.recentAccesses).toBe(1);
      // Document access log updated
      const doc = state.confidentialVault.documents.find(d => d.id === 'doc_001');
      expect(doc?.accessLog).toHaveLength(1);
    });

    it('denyVaultRequest denies with reason', () => {
      let state = reducer(
        initialState(),
        requestVaultAccess({ documentId: 'doc_002', requesterId: 'nancy', reason: 'Review' })
      );
      const reqId = state.confidentialVault.accessRequests[0].id;
      state = reducer(
        state,
        denyVaultRequest({ requestId: reqId, approverId: 'zoe', reason: 'Not authorized' })
      );
      const req = state.confidentialVault.accessRequests.find(r => r.id === reqId);
      expect(req?.status).toBe('denied');
      expect(req?.denyReason).toBe('Not authorized');
    });
  });

  // ── Lead management ───────────────────────────────────────────────
  describe('lead management', () => {
    it('addIncomingLead increments funnel', () => {
      const before = initialState().leadManagementHub.funnelMetrics.totalIncoming;
      const state = reducer(
        initialState(),
        addIncomingLead({ name: 'Ahmed', phone: '+971501234567' } as never)
      );
      expect(state.leadManagementHub.incomingLeads).toHaveLength(1);
      expect(state.leadManagementHub.funnelMetrics.totalIncoming).toBe(before + 1);
    });

    it('qualifyLead creates processed lead entry', () => {
      let state = reducer(initialState(), addIncomingLead({ name: 'Test' } as never));
      const leadId = state.leadManagementHub.incomingLeads[0].id;
      state = reducer(
        state,
        qualifyLead({
          leadId,
          assignedIntent: 'buy',
          qualificationScore: 85,
          structuredData: { budget: '2M' },
        })
      );
      expect(state.leadManagementHub.processedLeads[leadId]).toBeDefined();
      expect(state.leadManagementHub.processedLeads[leadId].status).toBe('qualified');
    });

    it('routeLeadToSpecialist routes qualified lead', () => {
      let state = reducer(initialState(), addIncomingLead({ name: 'Route me' } as never));
      const leadId = state.leadManagementHub.incomingLeads[0].id;
      state = reducer(
        state,
        qualifyLead({ leadId, assignedIntent: 'rent', qualificationScore: 70, structuredData: {} })
      );
      state = reducer(state, routeLeadToSpecialist({ leadId, specialist: 'sophia' }));
      expect(state.leadManagementHub.processedLeads[leadId].status).toBe('routed');
      expect(state.leadManagementHub.processedLeads[leadId].routedTo).toBe('sophia');
      expect(state.leadManagementHub.specialistPipelines.sophia.leadIds).toContain(leadId);
    });

    it('updateLeadPipelineStage updates stage', () => {
      let state = reducer(initialState(), addIncomingLead({ name: 'Stage me' } as never));
      const leadId = state.leadManagementHub.incomingLeads[0].id;
      state = reducer(
        state,
        qualifyLead({ leadId, assignedIntent: 'buy', qualificationScore: 90, structuredData: {} })
      );
      state = reducer(
        state,
        updateLeadPipelineStage({ leadId, specialist: 'sophia', stage: 'Negotiation' })
      );
      expect(state.leadManagementHub.processedLeads[leadId].currentStage).toBe('Negotiation');
    });
  });

  // ── Compliance engine ─────────────────────────────────────────────
  describe('compliance engine', () => {
    it('addComplianceAuditLog prepends entry', () => {
      const state = reducer(
        initialState(),
        addComplianceAuditLog({ action: 'KYC check', actor: 'laila' })
      );
      expect(state.complianceEngine.auditLog).toHaveLength(1);
      expect((state.complianceEngine.auditLog[0] as Record<string, unknown>).action).toBe(
        'KYC check'
      );
    });

    it('flagTransaction adds to flagged and investigation queue', () => {
      const state = reducer(initialState(), flagTransaction({ amount: 500000, source: 'unknown' }));
      expect(state.complianceEngine.amlMonitor.flaggedTransactions).toHaveLength(1);
      expect(state.complianceEngine.amlMonitor.investigationQueue).toHaveLength(1);
    });
  });

  // ── Async thunks ──────────────────────────────────────────────────
  describe('fetchAllAssistants', () => {
    it('sets isLoading on pending', () => {
      const state = reducer(initialState(), fetchAllAssistants.pending('r1'));
      expect(state.allAssistants.isLoading).toBe(true);
    });

    it('clears isLoading on fulfilled', () => {
      const payload = { assistants: {}, timestamp: '2026-01-01T00:00:00Z' };
      const state = reducer(initialState(), fetchAllAssistants.fulfilled(payload, 'r1'));
      expect(state.allAssistants.isLoading).toBe(false);
      expect(state.allAssistants.lastFetched).toBe('2026-01-01T00:00:00Z');
    });
  });

  describe('updateAssistantMetricsAsync', () => {
    it('merges metrics on fulfilled', () => {
      const args = { assistantId: 'mary', metrics: { tasksCompleted: 1000 } };
      const payload = { ...args, timestamp: new Date().toISOString() };
      const state = reducer(
        initialState(),
        updateAssistantMetricsAsync.fulfilled(payload, 'r1', args)
      );
      expect(state.allAssistants.byId.mary.metrics.tasksCompleted).toBe(1000);
    });
  });

  // ── Logout resets state ───────────────────────────────────────────
  describe('logout', () => {
    it('resets to initial state', () => {
      let state = initialState();
      state = reducer(state, selectAssistant('nadia'));
      state = reducer(state, setViewMode('analytics'));
      state = reducer(state, addAlert({ id: 'x', msg: 'y' }));

      const reset = reducer(state, { type: 'auth/logout' });
      expect(reset.ui.selectedAssistant).toBe('mary');
      expect(reset.ui.viewMode).toBe('dashboard');
      expect(reset.assistantPerformance.criticalAlerts).toEqual([]);
    });
  });

  // ── DEPARTMENT_COLORS re-export ───────────────────────────────────
  describe('DEPARTMENT_COLORS', () => {
    it('exports department color map', () => {
      expect(DEPARTMENT_COLORS).toBeDefined();
      expect(DEPARTMENT_COLORS.sales).toContain('gradient');
      expect(DEPARTMENT_COLORS.finance).toContain('gradient');
    });
  });

  // ── Selectors ─────────────────────────────────────────────────────
  describe('selectors', () => {
    it('selectAllAssistantsArray returns array of all assistants', () => {
      const result = selectAllAssistantsArray(rootWith());
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(10);
    });

    it('selectAssistantById returns correct assistant', () => {
      expect(selectAssistantById('mary')(rootWith())?.name).toBe('Mary');
      expect(selectAssistantById('nonexistent')(rootWith())).toBeUndefined();
    });

    it('selectCurrentAssistant returns selected assistant', () => {
      expect(selectCurrentAssistant(rootWith())?.id).toBe('mary');
    });

    it('selectUI returns UI state', () => {
      const ui = selectUI(rootWith());
      expect(ui?.layout).toBe('grid');
      expect(ui?.viewMode).toBe('dashboard');
    });

    it('selectFavorites returns favorites array', () => {
      expect(selectFavorites(rootWith())).toContain('nadia');
    });

    it('selectRecent returns recent array', () => {
      expect(selectRecent(rootWith())).toContain('mary');
    });

    it('selectPerformance returns performance data', () => {
      expect(selectPerformance(rootWith())?.overallHealth).toBe(95);
    });

    it('selectOwnerPreferences', () => {
      expect(selectOwnerPreferences(rootWith())?.defaultAssistant).toBe('mary');
    });

    it('selectRecentActivity returns array', () => {
      expect(selectRecentActivity(rootWith()).length).toBeGreaterThan(0);
    });

    it('selectFilteredAssistants with department filter', () => {
      const state = rootWith();
      // Reset memoized selector
      selectFilteredAssistants.resetRecomputations?.();
      const all = selectFilteredAssistants(state);
      expect(all.length).toBeGreaterThan(0);
    });

    it('selectAssistantsByDepartment groups correctly', () => {
      const grouped = selectAssistantsByDepartment(rootWith());
      expect(grouped.operations).toBeDefined();
      expect(grouped.sales).toBeDefined();
    });

    it('selectActiveAssistantsCount counts optimal', () => {
      const count = selectActiveAssistantsCount(rootWith());
      expect(count).toBeGreaterThan(0);
    });

    it('selectSidebar', () => {
      expect(selectSidebar(rootWith())?.isOpen).toBe(true);
    });

    it('selectNotifications', () => {
      expect(selectNotifications(rootWith())?.byAssistantId).toBeDefined();
    });

    it('selectNotificationsByAssistant', () => {
      const notifs = selectNotificationsByAssistant('nadia')(rootWith());
      expect(Array.isArray(notifs)).toBe(true);
    });

    it('selectGlobalUnreadCount', () => {
      expect(typeof selectGlobalUnreadCount(rootWith())).toBe('number');
    });

    it('selectTasks', () => {
      expect(selectTasks(rootWith())?.byAssistantId).toBeDefined();
    });

    it('selectTasksByAssistant', () => {
      expect(Array.isArray(selectTasksByAssistant('nadia')(rootWith()))).toBe(true);
    });

    it('selectOliviaAutomation', () => {
      const oa = selectOliviaAutomation(rootWith());
      expect(oa).toBeDefined();
    });

    it('selectExecutiveSuggestions', () => {
      const es = selectExecutiveSuggestions(rootWith());
      expect(es.inbox.length).toBeGreaterThan(0);
    });

    it('selectFilteredSuggestions with default filters returns unreviewed', () => {
      const filtered = selectFilteredSuggestions(rootWith());
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(s => s.status === 'unreviewed')).toBe(true);
    });

    it('selectUnreviewedSuggestionsCount', () => {
      expect(selectUnreviewedSuggestionsCount(rootWith())).toBeGreaterThan(0);
    });

    it('selectCriticalSuggestions', () => {
      const critical = selectCriticalSuggestions(rootWith());
      expect(critical.every(s => s.priority === 'critical')).toBe(true);
    });

    it('selectAssistantStatus returns status string', () => {
      const status = selectAssistantStatus('mary')(rootWith());
      expect(['active', 'busy', 'idle', 'offline']).toContain(status);
    });

    it('selectConfidentialVault', () => {
      expect(selectConfidentialVault(rootWith()).documents.length).toBeGreaterThan(0);
    });

    it('selectVaultPendingRequests starts empty', () => {
      expect(selectVaultPendingRequests(rootWith())).toHaveLength(0);
    });

    it('selectLeadManagementHub', () => {
      expect(selectLeadManagementHub(rootWith())).toBeDefined();
    });

    it('selectLeadFunnelMetrics', () => {
      const metrics = selectLeadFunnelMetrics(rootWith());
      expect(metrics).toBeDefined();
    });

    it('selectComplianceEngine', () => {
      expect(selectComplianceEngine(rootWith())).toBeDefined();
    });

    it('selectComplianceMetrics', () => {
      const m = selectComplianceMetrics(rootWith());
      expect(m).toBeDefined();
    });
  });

  // ── Task lifecycle reducers ───────────────────────────────────────
  describe('advanceTaskLifecycle', () => {
    it('moves task to in_progress stage and sets status', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.nadia[0].id;
      const state = reducer(
        s,
        advanceTaskLifecycle({ assistantId: 'nadia', taskId, stage: 'in_progress' })
      );
      const task = state.tasks.byAssistantId.nadia.find(t => t.id === taskId);
      expect(task?.lifecycleStage).toBe('in_progress');
      expect(task?.status).toBe('in_progress');
      expect(task?.startedAt).toBeDefined();
      expect(task?.updatedAt).toBeDefined();
    });

    it('moves task to completed and decrements activeTasksCount', () => {
      // First get an in_progress task
      const s = initialState();
      const inProgressTask = Object.values(s.tasks.byAssistantId)
        .flat()
        .find(t => t.status === 'in_progress');
      expect(inProgressTask).toBeDefined();
      const { id: taskId } = inProgressTask!;
      const assistantId = Object.entries(s.tasks.byAssistantId).find(([, tasks]) =>
        tasks.some(t => t.id === taskId)
      )![0];
      const countBefore = s.tasks.activeTasksCount;
      const state = reducer(s, advanceTaskLifecycle({ assistantId, taskId, stage: 'completed' }));
      const task = state.tasks.byAssistantId[assistantId].find(t => t.id === taskId);
      expect(task?.lifecycleStage).toBe('completed');
      expect(task?.status).toBe('completed');
      expect(task?.completedAt).toBeDefined();
      expect(state.tasks.activeTasksCount).toBe(Math.max(0, countBefore - 1));
    });

    it('auto-fires a notification with correct severity', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.clara[0].id;
      const unreadBefore = s.notifications.globalUnreadCount;

      let state = reducer(
        s,
        advanceTaskLifecycle({ assistantId: 'clara', taskId, stage: 'pending_review' })
      );
      expect(state.notifications.globalUnreadCount).toBe(unreadBefore + 1);
      const notif = state.notifications.byAssistantId.clara[0];
      expect(notif.type).toBe('task_lifecycle');
      expect(notif.severity).toBe('warning');
      expect(notif.isRead).toBe(false);

      state = reducer(
        state,
        advanceTaskLifecycle({ assistantId: 'clara', taskId, stage: 'failed' })
      );
      const failNotif = state.notifications.byAssistantId.clara[0];
      expect(failNotif.severity).toBe('critical');

      state = reducer(
        state,
        advanceTaskLifecycle({ assistantId: 'clara', taskId, stage: 'completed' })
      );
      const doneNotif = state.notifications.byAssistantId.clara[0];
      expect(doneNotif.severity).toBe('info');
    });

    it('fires info notification for queued stage', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.mary[0].id;
      const state = reducer(
        s,
        advanceTaskLifecycle({ assistantId: 'mary', taskId, stage: 'queued' })
      );
      const notif = state.notifications.byAssistantId.mary[0];
      expect(notif.type).toBe('task_lifecycle');
      expect(notif.severity).toBe('info');
      expect(notif.message).toContain('queued');
    });

    it('does nothing for non-existent task', () => {
      const before = initialState();
      const after = reducer(
        before,
        advanceTaskLifecycle({ assistantId: 'nadia', taskId: 'not_a_real_id', stage: 'completed' })
      );
      expect(after.tasks.activeTasksCount).toBe(before.tasks.activeTasksCount);
      expect(after.notifications.globalUnreadCount).toBe(before.notifications.globalUnreadCount);
    });
  });

  describe('addTaskAction', () => {
    it('appends action to task and fires success notification', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.mary[0].id;
      const unreadBefore = s.notifications.globalUnreadCount;
      const state = reducer(
        s,
        addTaskAction({
          assistantId: 'mary',
          taskId,
          taskAction: {
            type: 'file_uploaded',
            description: 'Excel file uploaded with 30 units',
            actor: 'agent_3',
            status: 'success',
            result: '30 records ready for import',
          },
        })
      );
      const task = state.tasks.byAssistantId.mary.find(t => t.id === taskId);
      expect(task?.actions?.length).toBeGreaterThanOrEqual(1);
      const lastAction = task!.actions![task!.actions!.length - 1];
      expect(lastAction.type).toBe('file_uploaded');
      expect(lastAction.status).toBe('success');
      expect(lastAction.id).toMatch(/^ta_/);
      expect(lastAction.timestamp).toBeDefined();
      expect(task?.updatedAt).toBeDefined();
      // notification
      expect(state.notifications.globalUnreadCount).toBe(unreadBefore + 1);
      const notif = state.notifications.byAssistantId.mary[0];
      expect(notif.type).toBe('task_action');
      expect(notif.severity).toBe('info');
    });

    it('fires warning notification for pending action', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.theodora[0].id;
      const state = reducer(
        s,
        addTaskAction({
          assistantId: 'theodora',
          taskId,
          taskAction: {
            type: 'review_requested',
            description: 'Awaiting MD approval',
            actor: 'system',
            status: 'pending',
          },
        })
      );
      const notif = state.notifications.byAssistantId.theodora[0];
      expect(notif.severity).toBe('warning');
      expect(notif.message).toContain('Pending action');
    });

    it('fires critical notification for failed action', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.laila[0].id;
      const state = reducer(
        s,
        addTaskAction({
          assistantId: 'laila',
          taskId,
          taskAction: {
            type: 'api_error',
            description: 'KYC API timeout',
            actor: 'system',
            status: 'failed',
          },
        })
      );
      const notif = state.notifications.byAssistantId.laila[0];
      expect(notif.severity).toBe('critical');
      expect(notif.message).toContain('Action failed');
    });

    it('does nothing for non-existent task', () => {
      const before = initialState();
      const after = reducer(
        before,
        addTaskAction({
          assistantId: 'nadia',
          taskId: 'ghost_task',
          taskAction: { type: 'x', description: 'y', actor: 'z', status: 'success' },
        })
      );
      expect(after.notifications.globalUnreadCount).toBe(before.notifications.globalUnreadCount);
    });
  });

  describe('setTaskResult', () => {
    it('writes result, marks completed, decrements activeTasksCount', () => {
      const s = initialState();
      const inProgressTask = Object.values(s.tasks.byAssistantId)
        .flat()
        .find(t => t.status === 'in_progress');
      expect(inProgressTask).toBeDefined();
      const { id: taskId } = inProgressTask!;
      const assistantId = Object.entries(s.tasks.byAssistantId).find(([, tasks]) =>
        tasks.some(t => t.id === taskId)
      )![0];
      const countBefore = s.tasks.activeTasksCount;
      const completedAt = new Date().toISOString();

      const state = reducer(
        s,
        setTaskResult({
          assistantId,
          taskId,
          result: {
            outcome: 'success',
            summary: '23 units imported successfully',
            completedAt,
            metrics: { unitsImported: 23, errors: 0 },
          },
        })
      );
      const task = state.tasks.byAssistantId[assistantId].find(t => t.id === taskId);
      expect(task?.result?.outcome).toBe('success');
      expect(task?.result?.summary).toBe('23 units imported successfully');
      expect(task?.lifecycleStage).toBe('completed');
      expect(task?.status).toBe('completed');
      expect(task?.completedAt).toBe(completedAt);
      expect(state.tasks.activeTasksCount).toBe(Math.max(0, countBefore - 1));
    });

    it('fires info notification for successful result', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.sophia[0].id;
      const unreadBefore = s.notifications.globalUnreadCount;
      const state = reducer(
        s,
        setTaskResult({
          assistantId: 'sophia',
          taskId,
          result: {
            outcome: 'success',
            summary: 'All 6 leads assigned',
            completedAt: new Date().toISOString(),
          },
        })
      );
      expect(state.notifications.globalUnreadCount).toBe(unreadBefore + 1);
      const notif = state.notifications.byAssistantId.sophia[0];
      expect(notif.type).toBe('task_result');
      expect(notif.severity).toBe('info');
      expect(notif.message).toContain('✓ Completed');
    });

    it('fires warning notification for partial result and sets pending_review stage', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.olivia[0].id;
      const state = reducer(
        s,
        setTaskResult({
          assistantId: 'olivia',
          taskId,
          result: {
            outcome: 'partial',
            summary: '3 of 5 posts scheduled',
            completedAt: new Date().toISOString(),
          },
        })
      );
      const task = state.tasks.byAssistantId.olivia.find(t => t.id === taskId);
      // partial outcome → pending_review stage (needs further action)
      expect(task?.lifecycleStage).toBe('pending_review');
      const notif = state.notifications.byAssistantId.olivia[0];
      expect(notif.severity).toBe('warning');
      expect(notif.message).toContain('⚠ Partially completed');
    });

    it('fires critical notification and keeps task active for failed result', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.aurora[0].id;
      const state = reducer(
        s,
        setTaskResult({
          assistantId: 'aurora',
          taskId,
          result: {
            outcome: 'failed',
            summary: 'Deployment rolled back',
            completedAt: new Date().toISOString(),
            errorMessage: 'Container crashed on startup',
          },
        })
      );
      const task = state.tasks.byAssistantId.aurora.find(t => t.id === taskId);
      expect(task?.lifecycleStage).toBe('failed');
      expect(task?.status).toBe('in_progress'); // not changed for failed
      const notif = state.notifications.byAssistantId.aurora[0];
      expect(notif.severity).toBe('critical');
      expect(notif.message).toContain('✗ Failed');
    });

    it('does nothing for non-existent task', () => {
      const before = initialState();
      const after = reducer(
        before,
        setTaskResult({
          assistantId: 'nadia',
          taskId: 'phantom',
          result: { outcome: 'success', summary: 'ok', completedAt: new Date().toISOString() },
        })
      );
      expect(after.notifications.globalUnreadCount).toBe(before.notifications.globalUnreadCount);
    });
  });

  // ── Task lifecycle selectors ──────────────────────────────────────
  describe('task lifecycle selectors', () => {
    it('selectTasksByLifecycleStage returns tasks at the given stage', () => {
      const state = rootWith();
      // All seed tasks are enriched to queued or in_progress
      const inProgressTasks = selectTasksByLifecycleStage('nadia', 'in_progress')(state);
      const queuedTasks = selectTasksByLifecycleStage('nadia', 'queued')(state);
      expect(Array.isArray(inProgressTasks)).toBe(true);
      expect(Array.isArray(queuedTasks)).toBe(true);
      // Total should equal all tasks for nadia
      expect(inProgressTasks.length + queuedTasks.length).toBe(
        selectTasksByAssistant('nadia')(state).length
      );
    });

    it('selectTasksByLifecycleStage returns empty array for unknown assistant', () => {
      expect(selectTasksByLifecycleStage('nobody', 'in_progress')(rootWith())).toHaveLength(0);
    });

    it('selectPendingActionsCount returns count of pending/queued tasks', () => {
      const count = selectPendingActionsCount('nadia')(rootWith());
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('selectPendingActionsCount returns 0 for unknown assistant', () => {
      expect(selectPendingActionsCount('nobody')(rootWith())).toBe(0);
    });

    it('selectCompletedTasksCount returns 0 before any completions', () => {
      // Seed tasks are all queued or in_progress, never completed
      const count = selectCompletedTasksCount('nadia')(rootWith());
      expect(count).toBe(0);
    });

    it('selectCompletedTasksCount increases after setTaskResult success', () => {
      const s = initialState();
      const taskId = s.tasks.byAssistantId.nadia[0].id;
      const state = reducer(
        s,
        setTaskResult({
          assistantId: 'nadia',
          taskId,
          result: { outcome: 'success', summary: 'Done', completedAt: new Date().toISOString() },
        })
      );
      const count = selectCompletedTasksCount('nadia')(rootWith({ tasks: state.tasks }));
      expect(count).toBe(1);
    });

    it('selectInProgressTasksCount matches in_progress tasks', () => {
      const count = selectInProgressTasksCount('nadia')(rootWith());
      const tasks = selectTasksByAssistant('nadia')(rootWith());
      const expected = tasks.filter(t => t.status === 'in_progress').length;
      expect(count).toBe(expected);
    });

    it('selectInProgressTasksCount returns 0 for unknown assistant', () => {
      expect(selectInProgressTasksCount('nobody')(rootWith())).toBe(0);
    });
  });
});
