import { createSlice, createSelector } from '@reduxjs/toolkit';

const ROLE_PERMISSIONS = {
  owner: {
    canViewAllDashboards: true,
    canManageAgents: true,
    canManageFinances: true,
    canAccessAIAssistants: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessAnalytics: true,
    canManageSettings: true,
    canViewExecutiveReports: true,
    dashboards: ['executive', 'agents', 'properties', 'leads', 'finance', 'analytics', 'settings', 'ai-command']
  },
  agent: {
    canViewAllDashboards: false,
    canManageAgents: false,
    canManageFinances: false,
    canAccessAIAssistants: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessAnalytics: false,
    canManageSettings: false,
    canViewExecutiveReports: false,
    dashboards: ['agent', 'my-properties', 'my-leads', 'tasks']
  },
  buyer: {
    canViewAllDashboards: false,
    canManageAgents: false,
    canManageFinances: false,
    canAccessAIAssistants: false,
    canManageProperties: false,
    canManageLeads: false,
    canAccessAnalytics: false,
    canManageSettings: false,
    canViewExecutiveReports: false,
    dashboards: ['search', 'favorites', 'inquiries', 'profile']
  },
  seller: {
    canViewAllDashboards: false,
    canManageAgents: false,
    canManageFinances: false,
    canAccessAIAssistants: false,
    canManageProperties: true,
    canManageLeads: false,
    canAccessAnalytics: false,
    canManageSettings: false,
    canViewExecutiveReports: false,
    dashboards: ['my-listings', 'inquiries', 'analytics', 'profile']
  },
  tenant: {
    canViewAllDashboards: false,
    canManageAgents: false,
    canManageFinances: false,
    canAccessAIAssistants: false,
    canManageProperties: false,
    canManageLeads: false,
    canAccessAnalytics: false,
    canManageSettings: false,
    canViewExecutiveReports: false,
    dashboards: ['rentals', 'applications', 'contracts', 'profile']
  }
};

const initialState = {
  activeRole: 'owner',
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  isAuthenticated: false,
  permissions: ROLE_PERMISSIONS.owner,
  featureFlags: {
    aiAssistants: true,
    whatsappIntegration: true,
    advancedAnalytics: true,
    documentManagement: true,
    paymentProcessing: true
  },
  sessionInfo: {
    loginTime: null,
    lastActivity: null,
    deviceType: null
  }
};

const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      const role = action.payload;
      if (ROLE_PERMISSIONS[role]) {
        state.activeRole = role;
        state.permissions = ROLE_PERMISSIONS[role];
      }
    },
    setUserInfo: (state, action) => {
      const { userId, userName, userEmail, userAvatar, role } = action.payload;
      state.userId = userId;
      state.userName = userName;
      state.userEmail = userEmail;
      state.userAvatar = userAvatar;
      state.isAuthenticated = true;
      if (role && ROLE_PERMISSIONS[role]) {
        state.activeRole = role;
        state.permissions = ROLE_PERMISSIONS[role];
      }
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.userAvatar = null;
      state.isAuthenticated = false;
      state.activeRole = 'owner';
      state.permissions = ROLE_PERMISSIONS.owner;
    },
    updateFeatureFlag: (state, action) => {
      const { flag, enabled } = action.payload;
      if (flag in state.featureFlags) {
        state.featureFlags[flag] = enabled;
      }
    },
    updateSessionInfo: (state, action) => {
      state.sessionInfo = { ...state.sessionInfo, ...action.payload };
    }
  }
});

export const {
  setActiveRole,
  setUserInfo,
  clearUserInfo,
  updateFeatureFlag,
  updateSessionInfo
} = accessControlSlice.actions;

const selectAccessControl = state => state.accessControl;

export const selectActiveRole = createSelector(
  [selectAccessControl],
  ac => ac?.activeRole || 'owner'
);

export const selectPermissions = createSelector(
  [selectAccessControl],
  ac => ac?.permissions || ROLE_PERMISSIONS.owner
);

export const selectUserInfo = createSelector(
  [selectAccessControl],
  ac => ({
    userId: ac?.userId,
    userName: ac?.userName,
    userEmail: ac?.userEmail,
    userAvatar: ac?.userAvatar,
    isAuthenticated: ac?.isAuthenticated || false
  })
);

export const selectFeatureFlags = createSelector(
  [selectAccessControl],
  ac => ac?.featureFlags || initialState.featureFlags
);

export const selectCanAccessDashboard = (dashboardId) => createSelector(
  [selectPermissions],
  permissions => permissions?.dashboards?.includes(dashboardId) || false
);

export const selectHasPermission = (permission) => createSelector(
  [selectPermissions],
  permissions => permissions?.[permission] || false
);

export const selectIsOwner = createSelector(
  [selectActiveRole],
  role => role === 'owner'
);

export const selectIsAgent = createSelector(
  [selectActiveRole],
  role => role === 'agent'
);

export const ROLE_PERMISSIONS_MAP = ROLE_PERMISSIONS;

export default accessControlSlice.reducer;
