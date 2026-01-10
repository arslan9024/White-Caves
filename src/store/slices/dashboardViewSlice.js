import { createSlice, createSelector } from '@reduxjs/toolkit';

const WORKSPACE_LAYOUTS = {
  executive: {
    id: 'executive',
    name: 'Executive Overview',
    gridColumns: 4,
    widgets: ['kpi-bar', 'lead-funnel', 'agent-performance', 'recent-activity', 'revenue-chart', 'ai-insights']
  },
  leads: {
    id: 'leads',
    name: 'Lead Management',
    gridColumns: 3,
    widgets: ['lead-stats', 'lead-pipeline', 'lead-sources', 'recent-leads']
  },
  properties: {
    id: 'properties',
    name: 'Property Inventory',
    gridColumns: 3,
    widgets: ['property-stats', 'property-grid', 'area-breakdown', 'featured-properties']
  },
  agents: {
    id: 'agents',
    name: 'Team Management',
    gridColumns: 3,
    widgets: ['team-stats', 'agent-grid', 'performance-chart', 'availability']
  },
  finance: {
    id: 'finance',
    name: 'Financial Overview',
    gridColumns: 4,
    widgets: ['revenue-stats', 'commission-breakdown', 'pending-payments', 'transaction-history']
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics & Reports',
    gridColumns: 2,
    widgets: ['market-trends', 'conversion-funnel', 'source-analysis', 'period-comparison']
  },
  'ai-command': {
    id: 'ai-command',
    name: 'AI Command Center',
    gridColumns: 3,
    widgets: ['assistant-grid', 'activity-feed', 'automation-status', 'suggestion-inbox']
  }
};

const initialState = {
  activeWorkspace: 'executive',
  activeAssistant: null,
  activeFeatureTab: null,
  workspaceLayouts: WORKSPACE_LAYOUTS,
  widgetStates: {},
  refreshTimestamps: {},
  viewPreferences: {
    compactMode: false,
    showTimestamps: true,
    autoRefresh: true,
    refreshInterval: 30000
  },
  breadcrumbs: [],
  recentWorkspaces: []
};

const dashboardViewSlice = createSlice({
  name: 'dashboardView',
  initialState,
  reducers: {
    setActiveWorkspace: (state, action) => {
      const workspaceId = action.payload;
      state.activeWorkspace = workspaceId;
      state.activeAssistant = null;
      state.activeFeatureTab = null;
      if (!state.recentWorkspaces.includes(workspaceId)) {
        state.recentWorkspaces = [workspaceId, ...state.recentWorkspaces].slice(0, 5);
      }
    },
    setActiveAssistant: (state, action) => {
      state.activeAssistant = action.payload;
      state.activeFeatureTab = null;
    },
    setActiveFeatureTab: (state, action) => {
      state.activeFeatureTab = action.payload;
    },
    setWidgetState: (state, action) => {
      const { widgetId, widgetState } = action.payload;
      state.widgetStates[widgetId] = {
        ...state.widgetStates[widgetId],
        ...widgetState
      };
    },
    updateRefreshTimestamp: (state, action) => {
      const { widgetId } = action.payload;
      state.refreshTimestamps[widgetId] = Date.now();
    },
    setViewPreference: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.viewPreferences) {
        state.viewPreferences[key] = value;
      }
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    popBreadcrumb: (state) => {
      state.breadcrumbs.pop();
    },
    updateWorkspaceLayout: (state, action) => {
      const { workspaceId, layout } = action.payload;
      if (state.workspaceLayouts[workspaceId]) {
        state.workspaceLayouts[workspaceId] = {
          ...state.workspaceLayouts[workspaceId],
          ...layout
        };
      }
    }
  }
});

export const {
  setActiveWorkspace,
  setActiveAssistant,
  setActiveFeatureTab,
  setWidgetState,
  updateRefreshTimestamp,
  setViewPreference,
  setBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  updateWorkspaceLayout
} = dashboardViewSlice.actions;

const selectDashboardView = state => state.dashboardView;

export const selectActiveWorkspace = createSelector(
  [selectDashboardView],
  dv => dv?.activeWorkspace || 'executive'
);

export const selectActiveAssistant = createSelector(
  [selectDashboardView],
  dv => dv?.activeAssistant
);

export const selectActiveFeatureTab = createSelector(
  [selectDashboardView],
  dv => dv?.activeFeatureTab
);

export const selectWorkspaceLayout = createSelector(
  [selectDashboardView, selectActiveWorkspace],
  (dv, workspaceId) => dv?.workspaceLayouts?.[workspaceId] || WORKSPACE_LAYOUTS.executive
);

export const selectWidgetState = (widgetId) => createSelector(
  [selectDashboardView],
  dv => dv?.widgetStates?.[widgetId] || {}
);

export const selectViewPreferences = createSelector(
  [selectDashboardView],
  dv => dv?.viewPreferences || initialState.viewPreferences
);

export const selectBreadcrumbs = createSelector(
  [selectDashboardView],
  dv => dv?.breadcrumbs || []
);

export const selectRecentWorkspaces = createSelector(
  [selectDashboardView],
  dv => dv?.recentWorkspaces || []
);

export const selectAllWorkspaceLayouts = createSelector(
  [selectDashboardView],
  dv => dv?.workspaceLayouts || WORKSPACE_LAYOUTS
);

export default dashboardViewSlice.reducer;
