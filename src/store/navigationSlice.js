import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: navigator.onLine,
  currentTime: new Date().toISOString(),
  profileMenuOpen: false,
  roleMenuOpen: false,
  whatsappMenuOpen: false,
  mobileMenuOpen: false,
  activeRole: localStorage.getItem('userRole') ? JSON.parse(localStorage.getItem('userRole'))?.role : null,
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'en',
  notifications: [],
  unreadNotifications: 0,
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
        localStorage.setItem('userRole', JSON.stringify({ role: action.payload }));
      } else {
        localStorage.removeItem('userRole');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.body.className = action.payload === 'dark' ? 'dark-mode' : '';
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
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
} = navigationSlice.actions;

export default navigationSlice.reducer;
