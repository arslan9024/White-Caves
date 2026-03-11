/**
 * Managing Director Dashboard Redux Slice
 * Manages: selected section, filters, notifications, UI state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Filters {
  status: string;
  agent: string;
  dateRange: string;
  searchQuery: string;
  department: string;
}

interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface Notification {
  id: string;
  read: boolean;
  [key: string]: any;
}

interface NotificationState {
  unread: number;
  items: Notification[];
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface ManagingDirectorDashboardState {
  selectedSection: string;
  selectedSubsection: string | null;
  filters: Filters;
  ui: UIState;
  notifications: NotificationState;
  view: string;
  sort: SortConfig;
}

const initialState: ManagingDirectorDashboardState = {
  selectedSection: 'overview',
  selectedSubsection: null,
  
  filters: {
    status: '',
    agent: '',
    dateRange: '',
    searchQuery: '',
    department: ''
  },

  ui: {
    leftSidebarOpen: true,
    rightSidebarOpen: true,
    isLoading: false,
    error: null
  },

  notifications: {
    unread: 0,
    items: []
  },

  view: 'grid',
  sort: {
    field: 'date',
    order: 'desc'
  }
};

const managingDirectorDashboardSlice = createSlice({
  name: 'managingDirectorDashboard',
  initialState,

  reducers: {
    // Section Selection
    selectSection: (state, action: PayloadAction<string>) => {
      state.selectedSection = action.payload;
      state.selectedSubsection = null;
    },

    selectSubsection: (state, action: PayloadAction<string>) => {
      state.selectedSubsection = action.payload;
    },

    // Filters
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },

    setAgentFilter: (state, action: PayloadAction<string>) => {
      state.filters.agent = action.payload;
    },

    setDateRangeFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateRange = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },

    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.department = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {
        status: '',
        agent: '',
        dateRange: '',
        searchQuery: '',
        department: ''
      };
    },

    // UI State
    toggleLeftSidebar: (state) => {
      state.ui.leftSidebarOpen = !state.ui.leftSidebarOpen;
    },

    toggleRightSidebar: (state) => {
      state.ui.rightSidebarOpen = !state.ui.rightSidebarOpen;
    },

    setLeftSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.leftSidebarOpen = action.payload;
    },

    setRightSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.rightSidebarOpen = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.ui.error = action.payload;
    },

    // Notifications
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications.items = action.payload;
      state.notifications.unread = action.payload.filter(n => !n.read).length;
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
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
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },

    setSort: (state, action: PayloadAction<{ field: string; order?: 'asc' | 'desc' }>) => {
      state.sort.field = action.payload.field;
      if (action.payload.order) {
        state.sort.order = action.payload.order;
      }
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
export const selectSelectedSection = (state: any): string =>
  state.managingDirectorDashboard?.selectedSection || 'overview';

export const selectSelectedSubsection = (state: any): string | null =>
  state.managingDirectorDashboard?.selectedSubsection || null;

export const selectMDFilters = (state: any): Filters =>
  state.managingDirectorDashboard?.filters || {};

export const selectStatusFilter = (state: any): string =>
  state.managingDirectorDashboard?.filters?.status || '';

export const selectAgentFilter = (state: any): string =>
  state.managingDirectorDashboard?.filters?.agent || '';

export const selectSearchQuery = (state: any): string =>
  state.managingDirectorDashboard?.filters?.searchQuery || '';

export const selectMDUIState = (state: any): UIState =>
  state.managingDirectorDashboard?.ui || {};

export const selectLeftSidebarOpen = (state: any): boolean =>
  state.managingDirectorDashboard?.ui?.leftSidebarOpen ?? true;

export const selectRightSidebarOpen = (state: any): boolean =>
  state.managingDirectorDashboard?.ui?.rightSidebarOpen ?? true;

export const selectMDLoading = (state: any): boolean =>
  state.managingDirectorDashboard?.ui?.isLoading ?? false;

export const selectMDError = (state: any): string | null =>
  state.managingDirectorDashboard?.ui?.error || null;

export const selectMDNotifications = (state: any): Notification[] =>
  state.managingDirectorDashboard?.notifications?.items || [];

export const selectUnreadNotificationCount = (state: any): number =>
  state.managingDirectorDashboard?.notifications?.unread || 0;

export const selectViewType = (state: any): string =>
  state.managingDirectorDashboard?.view || 'grid';

export const selectSort = (state: any): SortConfig =>
  state.managingDirectorDashboard?.sort || { field: 'date', order: 'desc' };

export default managingDirectorDashboardSlice.reducer;
