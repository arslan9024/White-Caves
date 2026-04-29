import { createSlice, createSelector } from '@reduxjs/toolkit';

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
};

const initialState = {
  sidebar: {
    isCollapsed: false,
    activeSection: null,
    activeDepartment: null,
    searchQuery: '',
    pinnedItems: []
  },
  topBar: {
    searchOpen: false,
    searchQuery: '',
    notificationsOpen: false,
    profileMenuOpen: false
  },
  layout: {
    breakpoint: 'desktop',
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1440,
    isMobileMenuOpen: false
  },
  modals: {
    activeModal: null,
    modalData: null
  },
  quickActions: {
    recentActions: [],
    favoriteActions: []
  }
};

const navigationUISlice = createSlice({
  name: 'navigationUI',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebar.isCollapsed = action.payload;
    },
    setActiveSection: (state, action) => {
      state.sidebar.activeSection = action.payload;
    },
    setActiveDepartment: (state, action) => {
      state.sidebar.activeDepartment = action.payload;
    },
    setSidebarSearch: (state, action) => {
      state.sidebar.searchQuery = action.payload;
    },
    togglePinnedItem: (state, action) => {
      const id = action.payload;
      const idx = state.sidebar.pinnedItems.indexOf(id);
      if (idx >= 0) {
        state.sidebar.pinnedItems.splice(idx, 1);
      } else {
        state.sidebar.pinnedItems.push(id);
      }
    },
    setTopBarSearch: (state, action) => {
      state.topBar.searchQuery = action.payload;
      state.topBar.searchOpen = action.payload.length > 0;
    },
    toggleSearchOpen: (state) => {
      state.topBar.searchOpen = !state.topBar.searchOpen;
      if (!state.topBar.searchOpen) {
        state.topBar.searchQuery = '';
      }
    },
    toggleNotifications: (state) => {
      state.topBar.notificationsOpen = !state.topBar.notificationsOpen;
      if (state.topBar.notificationsOpen) {
        state.topBar.profileMenuOpen = false;
      }
    },
    toggleProfileMenu: (state) => {
      state.topBar.profileMenuOpen = !state.topBar.profileMenuOpen;
      if (state.topBar.profileMenuOpen) {
        state.topBar.notificationsOpen = false;
      }
    },
    closeAllDropdowns: (state) => {
      state.topBar.notificationsOpen = false;
      state.topBar.profileMenuOpen = false;
      state.topBar.searchOpen = false;
    },
    setBreakpoint: (state, action) => {
      state.layout.windowWidth = action.payload;
      if (action.payload < BREAKPOINTS.mobile) {
        state.layout.breakpoint = 'mobile';
        state.sidebar.isCollapsed = true;
      } else if (action.payload < BREAKPOINTS.tablet) {
        state.layout.breakpoint = 'tablet';
      } else if (action.payload < BREAKPOINTS.desktop) {
        state.layout.breakpoint = 'desktop';
      } else {
        state.layout.breakpoint = 'wide';
      }
    },
    toggleMobileMenu: (state) => {
      state.layout.isMobileMenuOpen = !state.layout.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.layout.isMobileMenuOpen = false;
    },
    openModal: (state, action) => {
      state.modals.activeModal = action.payload.modal;
      state.modals.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.modals.activeModal = null;
      state.modals.modalData = null;
    },
    addRecentAction: (state, action) => {
      state.quickActions.recentActions = [
        action.payload,
        ...state.quickActions.recentActions.filter(a => a.id !== action.payload.id)
      ].slice(0, 10);
    },
    toggleFavoriteAction: (state, action) => {
      const id = action.payload;
      const idx = state.quickActions.favoriteActions.indexOf(id);
      if (idx >= 0) {
        state.quickActions.favoriteActions.splice(idx, 1);
      } else {
        state.quickActions.favoriteActions.push(id);
      }
    }
  }
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveSection,
  setActiveDepartment,
  setSidebarSearch,
  togglePinnedItem,
  setTopBarSearch,
  toggleSearchOpen,
  toggleNotifications,
  toggleProfileMenu,
  closeAllDropdowns,
  setBreakpoint,
  toggleMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
  addRecentAction,
  toggleFavoriteAction
} = navigationUISlice.actions;

const selectNavigationUI = state => state.navigationUI;

export const selectSidebar = createSelector(
  [selectNavigationUI],
  nav => nav?.sidebar || initialState.sidebar
);

export const selectTopBar = createSelector(
  [selectNavigationUI],
  nav => nav?.topBar || initialState.topBar
);

export const selectLayout = createSelector(
  [selectNavigationUI],
  nav => nav?.layout || initialState.layout
);

export const selectModals = createSelector(
  [selectNavigationUI],
  nav => nav?.modals || initialState.modals
);

export const selectQuickActions = createSelector(
  [selectNavigationUI],
  nav => nav?.quickActions || initialState.quickActions
);

export const selectIsMobile = createSelector(
  [selectLayout],
  layout => layout.breakpoint === 'mobile'
);

export const selectIsTablet = createSelector(
  [selectLayout],
  layout => layout.breakpoint === 'tablet'
);

export const selectIsDesktop = createSelector(
  [selectLayout],
  layout => layout.breakpoint === 'desktop' || layout.breakpoint === 'wide'
);

export default navigationUISlice.reducer;
