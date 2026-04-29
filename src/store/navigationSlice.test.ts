/**
 * navigationSlice.test.ts — Comprehensive tests for the Navigation Redux slice
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests: Menu toggles (profile, role, whatsapp, mobile), exclusive-close
 *        behavior, theme/language persistence, notifications, sidebar,
 *        module tracking, and security-critical logout reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ setOnlineStatus, updateCurrentTime
 *   ✓ toggleProfileMenu / closeProfileMenu (exclusive-close behavior)
 *   ✓ toggleRoleMenu / closeRoleMenu (exclusive-close behavior)
 *   ✓ toggleWhatsappMenu / closeWhatsappMenu (exclusive-close behavior)
 *   ✓ toggleMobileMenu / closeMobileMenu
 *   ✓ closeAllMenus
 *   ✓ setActiveRole (with safeStorage persistence + null removal)
 *   ✓ setTheme (with safeStorage + DOM attribute)
 *   ✓ setLanguage (with safeStorage)
 *   ✓ addNotification, markNotificationsRead, clearNotifications
 *   ✓ setCurrentModule, setCurrentSubModule
 *   ✓ toggleSidebar, setSidebarCollapsed
 *   ✓ SECURITY: logout resets all navigation state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import navigationReducer, {
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
} from './navigationSlice';
import { logout } from './authSlice';

// ─── Mock safeStorage ────────────────────────────────────────────────────
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn(() => null),
    getJSON: vi.fn(() => null),
    set: vi.fn(),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────
const getInitialState = () => navigationReducer(undefined, { type: 'unknown' });

function makeNotification(overrides: Record<string, unknown> = {}) {
  return { type: 'info', message: 'Test notification', title: 'Test', ...overrides };
}

// ==========================================================================
// TESTS
// ==========================================================================

describe('navigationSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.isOnline).toBeDefined();
      expect(state.currentTime).toBeDefined();
      expect(state.profileMenuOpen).toBe(false);
      expect(state.roleMenuOpen).toBe(false);
      expect(state.whatsappMenuOpen).toBe(false);
      expect(state.mobileMenuOpen).toBe(false);
      expect(state.notifications).toEqual([]);
      expect(state.unreadNotifications).toBe(0);
      expect(state.currentModule).toBeNull();
      expect(state.currentSubModule).toBeNull();
      expect(state.sidebarCollapsed).toBe(false);
    });
  });

  // ========================================================================
  // 2. ONLINE STATUS & TIME
  // ========================================================================
  describe('online status and time', () => {
    it('setOnlineStatus should set online status', () => {
      const state = navigationReducer(getInitialState(), setOnlineStatus(false));
      expect(state.isOnline).toBe(false);
    });

    it('setOnlineStatus should toggle back to true', () => {
      let state = navigationReducer(getInitialState(), setOnlineStatus(false));
      state = navigationReducer(state, setOnlineStatus(true));
      expect(state.isOnline).toBe(true);
    });

    it('updateCurrentTime should update timestamp', () => {
      const time = '2026-03-24T12:00:00.000Z';
      const state = navigationReducer(getInitialState(), updateCurrentTime(time));
      expect(state.currentTime).toBe(time);
    });
  });

  // ========================================================================
  // 3. PROFILE MENU (exclusive-close)
  // ========================================================================
  describe('profile menu', () => {
    it('toggleProfileMenu should open profile menu', () => {
      const state = navigationReducer(getInitialState(), toggleProfileMenu());
      expect(state.profileMenuOpen).toBe(true);
    });

    it('toggleProfileMenu should close profile menu when open', () => {
      let state = navigationReducer(getInitialState(), toggleProfileMenu());
      state = navigationReducer(state, toggleProfileMenu());
      expect(state.profileMenuOpen).toBe(false);
    });

    it('toggleProfileMenu should close role and whatsapp menus', () => {
      let state = navigationReducer(getInitialState(), toggleRoleMenu());
      state = navigationReducer(state, toggleWhatsappMenu());
      state = navigationReducer(state, toggleProfileMenu());
      expect(state.profileMenuOpen).toBe(true);
      expect(state.roleMenuOpen).toBe(false);
      expect(state.whatsappMenuOpen).toBe(false);
    });

    it('closeProfileMenu should close profile menu', () => {
      let state = navigationReducer(getInitialState(), toggleProfileMenu());
      state = navigationReducer(state, closeProfileMenu());
      expect(state.profileMenuOpen).toBe(false);
    });
  });

  // ========================================================================
  // 4. ROLE MENU (exclusive-close)
  // ========================================================================
  describe('role menu', () => {
    it('toggleRoleMenu should open role menu', () => {
      const state = navigationReducer(getInitialState(), toggleRoleMenu());
      expect(state.roleMenuOpen).toBe(true);
    });

    it('toggleRoleMenu should close role menu when open', () => {
      let state = navigationReducer(getInitialState(), toggleRoleMenu());
      state = navigationReducer(state, toggleRoleMenu());
      expect(state.roleMenuOpen).toBe(false);
    });

    it('toggleRoleMenu should close profile and whatsapp menus', () => {
      let state = navigationReducer(getInitialState(), toggleProfileMenu());
      state = navigationReducer(state, toggleRoleMenu());
      expect(state.roleMenuOpen).toBe(true);
      expect(state.profileMenuOpen).toBe(false);
      expect(state.whatsappMenuOpen).toBe(false);
    });

    it('closeRoleMenu should close role menu', () => {
      let state = navigationReducer(getInitialState(), toggleRoleMenu());
      state = navigationReducer(state, closeRoleMenu());
      expect(state.roleMenuOpen).toBe(false);
    });
  });

  // ========================================================================
  // 5. WHATSAPP MENU (exclusive-close)
  // ========================================================================
  describe('whatsapp menu', () => {
    it('toggleWhatsappMenu should open whatsapp menu', () => {
      const state = navigationReducer(getInitialState(), toggleWhatsappMenu());
      expect(state.whatsappMenuOpen).toBe(true);
    });

    it('toggleWhatsappMenu should close whatsapp menu when open', () => {
      let state = navigationReducer(getInitialState(), toggleWhatsappMenu());
      state = navigationReducer(state, toggleWhatsappMenu());
      expect(state.whatsappMenuOpen).toBe(false);
    });

    it('toggleWhatsappMenu should close profile and role menus', () => {
      let state = navigationReducer(getInitialState(), toggleProfileMenu());
      state = navigationReducer(state, toggleWhatsappMenu());
      expect(state.whatsappMenuOpen).toBe(true);
      expect(state.profileMenuOpen).toBe(false);
      expect(state.roleMenuOpen).toBe(false);
    });

    it('closeWhatsappMenu should close whatsapp menu', () => {
      let state = navigationReducer(getInitialState(), toggleWhatsappMenu());
      state = navigationReducer(state, closeWhatsappMenu());
      expect(state.whatsappMenuOpen).toBe(false);
    });
  });

  // ========================================================================
  // 6. MOBILE MENU
  // ========================================================================
  describe('mobile menu', () => {
    it('toggleMobileMenu should open mobile menu', () => {
      const state = navigationReducer(getInitialState(), toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(true);
    });

    it('toggleMobileMenu should close mobile menu when open', () => {
      let state = navigationReducer(getInitialState(), toggleMobileMenu());
      state = navigationReducer(state, toggleMobileMenu());
      expect(state.mobileMenuOpen).toBe(false);
    });

    it('closeMobileMenu should close mobile menu', () => {
      let state = navigationReducer(getInitialState(), toggleMobileMenu());
      state = navigationReducer(state, closeMobileMenu());
      expect(state.mobileMenuOpen).toBe(false);
    });
  });

  // ========================================================================
  // 7. CLOSE ALL MENUS
  // ========================================================================
  describe('closeAllMenus', () => {
    it('should close all open menus at once', () => {
      let state = getInitialState();
      state = navigationReducer(state, toggleProfileMenu());
      state = navigationReducer(state, toggleMobileMenu());

      state = navigationReducer(state, closeAllMenus());
      expect(state.profileMenuOpen).toBe(false);
      expect(state.roleMenuOpen).toBe(false);
      expect(state.whatsappMenuOpen).toBe(false);
      expect(state.mobileMenuOpen).toBe(false);
    });
  });

  // ========================================================================
  // 8. ACTIVE ROLE (with storage persistence)
  // ========================================================================
  describe('setActiveRole', () => {
    it('should set active role', () => {
      const state = navigationReducer(getInitialState(), setActiveRole('buyer'));
      expect(state.activeRole).toBe('buyer');
    });

    it('should persist role to safeStorage when set', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      navigationReducer(getInitialState(), setActiveRole('agent'));
      expect(safeStorage.setJSON).toHaveBeenCalledWith('userRole', { role: 'agent' });
    });

    it('should remove role from safeStorage when set to null', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      navigationReducer(getInitialState(), setActiveRole(null));
      expect(safeStorage.remove).toHaveBeenCalledWith('userRole');
    });
  });

  // ========================================================================
  // 9. THEME (with storage + DOM)
  // ========================================================================
  describe('setTheme', () => {
    it('should set theme', () => {
      const state = navigationReducer(getInitialState(), setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('should persist theme to safeStorage', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      navigationReducer(getInitialState(), setTheme('dark'));
      expect(safeStorage.set).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should set data-theme attribute on document', () => {
      navigationReducer(getInitialState(), setTheme('dark'));
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  // ========================================================================
  // 10. LANGUAGE (with storage)
  // ========================================================================
  describe('setLanguage', () => {
    it('should set language', () => {
      const state = navigationReducer(getInitialState(), setLanguage('ar'));
      expect(state.language).toBe('ar');
    });

    it('should persist language to safeStorage', async () => {
      const { safeStorage } = await import('../utils/safeStorage');
      navigationReducer(getInitialState(), setLanguage('fr'));
      expect(safeStorage.set).toHaveBeenCalledWith('language', 'fr');
    });
  });

  // ========================================================================
  // 11. NOTIFICATIONS
  // ========================================================================
  describe('notifications', () => {
    it('addNotification should prepend a notification', () => {
      const state = navigationReducer(getInitialState(), addNotification(makeNotification()));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].message).toBe('Test notification');
    });

    it('addNotification should increment unread count', () => {
      let state = navigationReducer(getInitialState(), addNotification(makeNotification()));
      expect(state.unreadNotifications).toBe(1);
      state = navigationReducer(state, addNotification(makeNotification({ message: 'Second' })));
      expect(state.unreadNotifications).toBe(2);
    });

    it('addNotification should prepend (most recent first)', () => {
      let state = navigationReducer(getInitialState(), addNotification(makeNotification({ message: 'First' })));
      state = navigationReducer(state, addNotification(makeNotification({ message: 'Second' })));
      expect(state.notifications[0].message).toBe('Second');
    });

    it('markNotificationsRead should reset unread count', () => {
      let state = navigationReducer(getInitialState(), addNotification(makeNotification()));
      state = navigationReducer(state, addNotification(makeNotification()));
      state = navigationReducer(state, markNotificationsRead());
      expect(state.unreadNotifications).toBe(0);
    });

    it('markNotificationsRead should not remove notifications', () => {
      let state = navigationReducer(getInitialState(), addNotification(makeNotification()));
      state = navigationReducer(state, markNotificationsRead());
      expect(state.notifications).toHaveLength(1);
    });

    it('clearNotifications should remove all notifications and reset count', () => {
      let state = navigationReducer(getInitialState(), addNotification(makeNotification()));
      state = navigationReducer(state, addNotification(makeNotification()));
      state = navigationReducer(state, clearNotifications());
      expect(state.notifications).toEqual([]);
      expect(state.unreadNotifications).toBe(0);
    });
  });

  // ========================================================================
  // 12. MODULE TRACKING
  // ========================================================================
  describe('module tracking', () => {
    it('setCurrentModule should set current module', () => {
      const state = navigationReducer(getInitialState(), setCurrentModule('crm'));
      expect(state.currentModule).toBe('crm');
    });

    it('setCurrentModule(null) should clear module', () => {
      let state = navigationReducer(getInitialState(), setCurrentModule('crm'));
      state = navigationReducer(state, setCurrentModule(null));
      expect(state.currentModule).toBeNull();
    });

    it('setCurrentSubModule should set sub-module', () => {
      const state = navigationReducer(getInitialState(), setCurrentSubModule('leads'));
      expect(state.currentSubModule).toBe('leads');
    });
  });

  // ========================================================================
  // 13. SIDEBAR
  // ========================================================================
  describe('sidebar', () => {
    it('toggleSidebar should toggle collapsed state', () => {
      let state = navigationReducer(getInitialState(), toggleSidebar());
      expect(state.sidebarCollapsed).toBe(true);
      state = navigationReducer(state, toggleSidebar());
      expect(state.sidebarCollapsed).toBe(false);
    });

    it('setSidebarCollapsed should set explicit value', () => {
      const state = navigationReducer(getInitialState(), setSidebarCollapsed(true));
      expect(state.sidebarCollapsed).toBe(true);
    });
  });

  // ========================================================================
  // 14. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset navigation state on logout', () => {
      let state = getInitialState();
      state = navigationReducer(state, toggleProfileMenu());
      state = navigationReducer(state, setActiveRole('admin'));
      state = navigationReducer(state, setTheme('dark'));
      state = navigationReducer(state, addNotification(makeNotification()));
      state = navigationReducer(state, setCurrentModule('crm'));
      state = navigationReducer(state, setSidebarCollapsed(true));

      // Verify populated
      expect(state.profileMenuOpen).toBe(true);
      expect(state.activeRole).toBe('admin');
      expect(state.notifications).toHaveLength(1);

      // Logout should wipe everything
      state = navigationReducer(state, logout());
      expect(state.profileMenuOpen).toBe(false);
      expect(state.roleMenuOpen).toBe(false);
      expect(state.notifications).toEqual([]);
      expect(state.unreadNotifications).toBe(0);
      expect(state.currentModule).toBeNull();
      expect(state.sidebarCollapsed).toBe(false);
    });
  });
});
