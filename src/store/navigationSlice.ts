import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { safeStorage } from '../utils/safeStorage';
import { logout } from './authSlice';

interface NavNotification {
  id?: string;
  type: string;
  title?: string;
  message: string;
  timestamp?: string;
  duration?: number;
  read?: boolean;
}

interface NavigationState {
  isOnline: boolean;
  currentTime: string;
  profileMenuOpen: boolean;
  roleMenuOpen: boolean;
  whatsappMenuOpen: boolean;
  mobileMenuOpen: boolean;
  activeRole: string | null;
  theme: string;
  language: string;
  notifications: NavNotification[];
  unreadNotifications: number;
  currentModule: string | null;
  currentSubModule: string | null;
  sidebarCollapsed: boolean;
}

const initialState: NavigationState = {
  isOnline: navigator.onLine,
  currentTime: new Date().toISOString(),
  profileMenuOpen: false,
  roleMenuOpen: false,
  whatsappMenuOpen: false,
  mobileMenuOpen: false,
  activeRole: safeStorage.getJSON<{ role: string }>('userRole')?.role ?? null,
  theme: safeStorage.get('theme', 'light') ?? 'light',
  language: safeStorage.get('language', 'en') ?? 'en',
  notifications: [],
  unreadNotifications: 0,
  currentModule: null,
  currentSubModule: null,
  sidebarCollapsed: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    updateCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    toggleProfileMenu: (state) => {
      state.profileMenuOpen = !state.profileMenuOpen;
      state.roleMenuOpen = false;
      state.whatsappMenuOpen = false;
    },
    closeProfileMenu: (state) => {
      state.profileMenuOpen = false;
    },
    toggleRoleMenu: (state) => {
      state.roleMenuOpen = !state.roleMenuOpen;
      state.profileMenuOpen = false;
      state.whatsappMenuOpen = false;
    },
    closeRoleMenu: (state) => {
      state.roleMenuOpen = false;
    },
    toggleWhatsappMenu: (state) => {
      state.whatsappMenuOpen = !state.whatsappMenuOpen;
      state.profileMenuOpen = false;
      state.roleMenuOpen = false;
    },
    closeWhatsappMenu: (state) => {
      state.whatsappMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    closeAllMenus: (state) => {
      state.profileMenuOpen = false;
      state.roleMenuOpen = false;
      state.whatsappMenuOpen = false;
      state.mobileMenuOpen = false;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      if (action.payload) {
        safeStorage.setJSON('userRole', { role: action.payload });
      } else {
        safeStorage.remove('userRole');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      safeStorage.set('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      safeStorage.set('language', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadNotifications += 1;
    },
    markNotificationsRead: (state) => {
      state.unreadNotifications = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadNotifications = 0;
    },
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
    },
    setCurrentSubModule: (state, action) => {
      state.currentSubModule = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setOnlineStatus,
  updateCurrentTime,
  toggleProfileMenu,
  closeProfileMenu,
  toggleRoleMenu,
  closeRoleMenu,
  toggleWhatsappMenu,
  closeWhatsappMenu,
  toggleMobileMenu,
  closeMobileMenu,
  closeAllMenus,
  setActiveRole,
  setTheme,
  setLanguage,
  addNotification,
  markNotificationsRead,
  clearNotifications,
  setCurrentModule,
  setCurrentSubModule,
  toggleSidebar,
  setSidebarCollapsed,
} = navigationSlice.actions;

export default navigationSlice.reducer;
