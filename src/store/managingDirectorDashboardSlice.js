/**
 * Managing Director Dashboard Redux Slice
 * Manages: selected section, filters, notifications, UI state
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSection: 'overview', // Current tab/section being viewed
  selectedSubsection: null, // For future nested navigation
  
  filters: {
    status: '', // 'hot', 'warm', 'cold', 'active', etc.
    agent: '', // agent_id filter
    dateRange: '', // date range filter
    searchQuery: '',
    department: ''
  },

  ui: {
    leftSidebarOpen: true, // Desktop: true, Mobile: false
    rightSidebarOpen: true,
    isLoading: false,
    error: null
  },

  notifications: {
    unread: 0,
    items: []
  },

  view: 'grid', // 'grid' or 'list'
  sort: {
    field: 'date', // field to sort by
    order: 'desc' // 'asc' or 'desc'
  }
};

const managingDirectorDashboardSlice = createSlice({
  name: 'managingDirectorDashboard',
  initialState,

  reducers: {
    // Section Selection
    selectSection: (state, action) => {
      state.selectedSection = action.payload;
      state.selectedSubsection = null;
    },

    selectSubsection: (state, action) => {
      state.selectedSubsection = action.payload;
    },

    // Filters
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },

    setAgentFilter: (state, action) => {
      state.filters.agent = action.payload;
    },

    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },

    setDepartmentFilter: (state, action) => {
      state.filters.department = action.payload;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // UI State
    toggleLeftSidebar: (state) => {
      state.ui.leftSidebarOpen = !state.ui.leftSidebarOpen;
    },

    toggleRightSidebar: (state) => {
      state.ui.rightSidebarOpen = !state.ui.rightSidebarOpen;
    },

    setLeftSidebarOpen: (state, action) => {
      state.ui.leftSidebarOpen = action.payload;
    },

    setRightSidebarOpen: (state, action) => {
      state.ui.rightSidebarOpen = action.payload;
    },

    setLoading: (state, action) => {
      state.ui.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.ui.error = action.payload;
    },

    // Notifications
    setNotifications: (state, action) => {
      state.notifications.items = action.payload;
      state.notifications.unread = action.payload.filter(n => !n.read).length;
    },

    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.items.find(
        n => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
        state.notifications.unread = Math.max(0, state.notifications.unread - 1);
      }
    },

    clearNotifications: (state) => {
      state.notifications.items = [];
      state.notifications.unread = 0;
    },

    // View & Sort
    setView: (state, action) => {
      state.view = action.payload;
    },

    setSort: (state, action) => {
      state.sort.field = action.payload.field;
      state.sort.order = action.payload.order || state.sort.order;
    },

    toggleSort: (state) => {
      state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
    }
  }
});

// ============== ACTIONS ==============
export const {
  selectSection,
  selectSubsection,
  setStatusFilter,
  setAgentFilter,
  setDateRangeFilter,
  setSearchQuery,
  setDepartmentFilter,
  clearFilters,
  toggleLeftSidebar,
  toggleRightSidebar,
  setLeftSidebarOpen,
  setRightSidebarOpen,
  setLoading,
  setError,
  setNotifications,
  markNotificationAsRead,
  clearNotifications,
  setView,
  setSort,
  toggleSort
} = managingDirectorDashboardSlice.actions;

// ============== SELECTORS ==============
export const selectSelectedSection = (state) =>
  state.managingDirectorDashboard?.selectedSection || 'overview';

export const selectSelectedSubsection = (state) =>
  state.managingDirectorDashboard?.selectedSubsection;

export const selectMDFilters = (state) =>
  state.managingDirectorDashboard?.filters || {};

export const selectStatusFilter = (state) =>
  state.managingDirectorDashboard?.filters?.status || '';

export const selectAgentFilter = (state) =>
  state.managingDirectorDashboard?.filters?.agent || '';

export const selectSearchQuery = (state) =>
  state.managingDirectorDashboard?.filters?.searchQuery || '';

export const selectMDUIState = (state) =>
  state.managingDirectorDashboard?.ui || {};

export const selectLeftSidebarOpen = (state) =>
  state.managingDirectorDashboard?.ui?.leftSidebarOpen ?? true;

export const selectRightSidebarOpen = (state) =>
  state.managingDirectorDashboard?.ui?.rightSidebarOpen ?? true;

export const selectMDLoading = (state) =>
  state.managingDirectorDashboard?.ui?.isLoading ?? false;

export const selectMDError = (state) =>
  state.managingDirectorDashboard?.ui?.error;

export const selectMDNotifications = (state) =>
  state.managingDirectorDashboard?.notifications?.items || [];

export const selectUnreadNotificationCount = (state) =>
  state.managingDirectorDashboard?.notifications?.unread || 0;

export const selectViewType = (state) =>
  state.managingDirectorDashboard?.view || 'grid';

export const selectSort = (state) =>
  state.managingDirectorDashboard?.sort || { field: 'date', order: 'desc' };

export default managingDirectorDashboardSlice.reducer;
