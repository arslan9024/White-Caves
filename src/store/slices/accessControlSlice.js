import { createSlice, createSelector } from '@reduxjs/toolkit';

const ROLE_PERMISSIONS = {
  super_admin: {
    canViewAllDashboards: true,
    canManageAgents: true,
    canManageFinances: true,
    canAccessAIAssistants: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessAnalytics: true,
    canManageSettings: true,
    canViewExecutiveReports: true,
    canAccessConfidentialVault: true,
    canManageAllUsers: true,
    canManageSystemSettings: true,
    isSuperUser: true,
    isDecisionMaker: true,
    isCreator: true,
    isFounder: true,
    dashboards: [
      'executive',
      'agents',
      'properties',
      'leads',
      'finance',
      'analytics',
      'settings',
      'ai-command',
      'system',
      'admin',
    ],
  },
  md: {
    canViewAllDashboards: true,
    canManageAgents: true,
    canManageFinances: true,
    canAccessAIAssistants: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessAnalytics: true,
    canManageSettings: true,
    canViewExecutiveReports: true,
    canAccessConfidentialVault: true,
    isSuperUser: true,
    isDecisionMaker: true,
    dashboards: [
      'executive',
      'agents',
      'properties',
      'leads',
      'finance',
      'analytics',
      'settings',
      'ai-command',
    ],
  },
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
    dashboards: [
      'executive',
      'agents',
      'properties',
      'leads',
      'finance',
      'analytics',
      'settings',
      'ai-command',
    ],
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
    dashboards: ['agent', 'my-properties', 'my-leads', 'tasks'],
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
    dashboards: ['search', 'favorites', 'inquiries', 'profile'],
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
    dashboards: ['my-listings', 'inquiries', 'analytics', 'profile'],
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
    dashboards: ['rentals', 'applications', 'contracts', 'profile'],
  },
};

const getRolePermissions = role => {
  switch (role) {
    case 'super_admin':
      return ROLE_PERMISSIONS.super_admin;
    case 'md':
      return ROLE_PERMISSIONS.md;
    case 'owner':
      return ROLE_PERMISSIONS.owner;
    case 'agent':
      return ROLE_PERMISSIONS.agent;
    case 'buyer':
      return ROLE_PERMISSIONS.buyer;
    case 'seller':
      return ROLE_PERMISSIONS.seller;
    case 'tenant':
      return ROLE_PERMISSIONS.tenant;
    default:
      return null;
  }
};

const setFeatureFlagValue = (featureFlags, flag, enabled) => {
  switch (flag) {
    case 'aiAssistants':
      featureFlags.aiAssistants = enabled;
      break;
    case 'whatsappIntegration':
      featureFlags.whatsappIntegration = enabled;
      break;
    case 'advancedAnalytics':
      featureFlags.advancedAnalytics = enabled;
      break;
    case 'documentManagement':
      featureFlags.documentManagement = enabled;
      break;
    case 'paymentProcessing':
      featureFlags.paymentProcessing = enabled;
      break;
    default:
      break;
  }
};

const initialState = {
  activeRole: null,
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  isAuthenticated: false,
  permissions: {},
  featureFlags: {
    aiAssistants: true,
    whatsappIntegration: true,
    advancedAnalytics: true,
    documentManagement: true,
    paymentProcessing: true,
  },
  sessionInfo: {
    loginTime: null,
    lastActivity: null,
    deviceType: null,
  },
};

const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      const role = action.payload;
      const permissions = getRolePermissions(role);
      if (permissions) {
        state.activeRole = role;
        state.permissions = permissions;
      }
    },
    setUserInfo: (state, action) => {
      const { userId, userName, userEmail, userAvatar, role } = action.payload;
      state.userId = userId;
      state.userName = userName;
      state.userEmail = userEmail;
      state.userAvatar = userAvatar;
      state.isAuthenticated = true;
      const permissions = role ? getRolePermissions(role) : null;
      if (permissions) {
        state.activeRole = role;
        state.permissions = permissions;
      }
    },
    clearUserInfo: state => {
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.userAvatar = null;
      state.isAuthenticated = false;
      state.activeRole = null;
      state.permissions = {};
    },
    updateFeatureFlag: (state, action) => {
      const { flag, enabled } = action.payload;
      setFeatureFlagValue(state.featureFlags, flag, enabled);
    },
    updateSessionInfo: (state, action) => {
      state.sessionInfo = { ...state.sessionInfo, ...action.payload };
    },
  },
});

export const { setActiveRole, setUserInfo, clearUserInfo, updateFeatureFlag, updateSessionInfo } =
  accessControlSlice.actions;

const selectAccessControl = state => state.accessControl;

export const selectActiveRole = createSelector(
  [selectAccessControl],
  ac => ac?.activeRole || 'owner'
);

export const selectPermissions = createSelector(
  [selectAccessControl],
  ac => ac?.permissions || ROLE_PERMISSIONS.owner
);

export const selectUserInfo = createSelector([selectAccessControl], ac => ({
  userId: ac?.userId,
  userName: ac?.userName,
  userEmail: ac?.userEmail,
  userAvatar: ac?.userAvatar,
  isAuthenticated: ac?.isAuthenticated || false,
}));

export const selectFeatureFlags = createSelector(
  [selectAccessControl],
  ac => ac?.featureFlags || initialState.featureFlags
);

export const selectCanAccessDashboard = dashboardId =>
  createSelector(
    [selectPermissions],
    permissions => permissions?.dashboards?.includes(dashboardId) || false
  );

export const selectHasPermission = permission =>
  createSelector([selectPermissions], permissions => {
    switch (permission) {
      case 'canViewAllDashboards':
        return Boolean(permissions?.canViewAllDashboards);
      case 'canManageAgents':
        return Boolean(permissions?.canManageAgents);
      case 'canManageFinances':
        return Boolean(permissions?.canManageFinances);
      case 'canAccessAIAssistants':
        return Boolean(permissions?.canAccessAIAssistants);
      case 'canManageProperties':
        return Boolean(permissions?.canManageProperties);
      case 'canManageLeads':
        return Boolean(permissions?.canManageLeads);
      case 'canAccessAnalytics':
        return Boolean(permissions?.canAccessAnalytics);
      case 'canManageSettings':
        return Boolean(permissions?.canManageSettings);
      case 'canViewExecutiveReports':
        return Boolean(permissions?.canViewExecutiveReports);
      case 'canAccessConfidentialVault':
        return Boolean(permissions?.canAccessConfidentialVault);
      case 'isSuperUser':
        return Boolean(permissions?.isSuperUser);
      case 'isDecisionMaker':
        return Boolean(permissions?.isDecisionMaker);
      default:
        return false;
    }
  });

export const selectIsOwner = createSelector([selectActiveRole], role => role === 'owner');

export const selectIsAgent = createSelector([selectActiveRole], role => role === 'agent');

export const ROLE_PERMISSIONS_MAP = ROLE_PERMISSIONS;

export default accessControlSlice.reducer;
