/**
 * notificationSlice.test.ts — Comprehensive tests for the Notification Redux slice
 * ────────────────────────────────────────────────────────────────────────────────
 * Tests: Notification queue management (add, remove, clear), auto-generated IDs,
 *        default values, type safety, and security-critical logout reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ addNotification (auto-id, default type/duration, createdAt)
 *   ✓ addNotification with explicit type and duration
 *   ✓ removeNotification by id
 *   ✓ clearAllNotifications
 *   ✓ Multiple notifications ordering
 *   ✓ SECURITY: logout resets all notification data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import notificationReducer, {
  addNotification,
  removeNotification,
  clearAllNotifications,
} from './notificationSlice';
import type { AppNotification } from './notificationSlice';
import { logout } from '../authSlice';

// ─── Helpers ─────────────────────────────────────────────────────────────
const getInitialState = () => notificationReducer(undefined, { type: 'unknown' });

// ==========================================================================
// TESTS
// ==========================================================================

describe('notificationSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.notifications).toEqual([]);
    });
  });

  // ========================================================================
  // 2. addNotification
  // ========================================================================
  describe('addNotification', () => {
    it('should add a notification with defaults', () => {
      const state = notificationReducer(getInitialState(), addNotification({
        title: 'Test',
        message: 'Test message',
      }));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].title).toBe('Test');
      expect(state.notifications[0].message).toBe('Test message');
      expect(state.notifications[0].type).toBe('info'); // default
      expect(state.notifications[0].duration).toBe(3000); // default
    });

    it('should auto-generate unique id', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'Msg1' }));
      state = notificationReducer(state, addNotification({ title: 'N2', message: 'Msg2' }));
      expect(state.notifications[0].id).not.toBe(state.notifications[1].id);
    });

    it('should set createdAt timestamp', () => {
      const state = notificationReducer(getInitialState(), addNotification({ title: 'T', message: 'M' }));
      expect(state.notifications[0].createdAt).toBeDefined();
      expect(typeof state.notifications[0].createdAt).toBe('number');
      expect(state.notifications[0].createdAt).toBeGreaterThan(0);
    });

    it('should respect explicit type', () => {
      const state = notificationReducer(getInitialState(), addNotification({
        title: 'Error',
        message: 'Something failed',
        type: 'error',
      }));
      expect(state.notifications[0].type).toBe('error');
    });

    it('should respect explicit duration', () => {
      const state = notificationReducer(getInitialState(), addNotification({
        title: 'Long',
        message: 'Long notification',
        duration: 10000,
      }));
      expect(state.notifications[0].duration).toBe(10000);
    });

    it('should support all notification types', () => {
      const types: AppNotification['type'][] = ['info', 'success', 'warning', 'error'];
      let state = getInitialState();
      for (const type of types) {
        state = notificationReducer(state, addNotification({ title: type, message: `${type} msg`, type }));
      }
      expect(state.notifications).toHaveLength(4);
      expect(state.notifications.map(n => n.type)).toEqual(types);
    });

    it('should append notifications (queue order)', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'First', message: 'M1' }));
      state = notificationReducer(state, addNotification({ title: 'Second', message: 'M2' }));
      state = notificationReducer(state, addNotification({ title: 'Third', message: 'M3' }));
      expect(state.notifications).toHaveLength(3);
      expect(state.notifications[0].title).toBe('First');
      expect(state.notifications[2].title).toBe('Third');
    });
  });

  // ========================================================================
  // 3. removeNotification
  // ========================================================================
  describe('removeNotification', () => {
    it('should remove notification by id', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'M' }));
      const id = state.notifications[0].id;
      state = notificationReducer(state, removeNotification(id));
      expect(state.notifications).toHaveLength(0);
    });

    it('should only remove the matching notification', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'M1' }));
      state = notificationReducer(state, addNotification({ title: 'N2', message: 'M2' }));
      state = notificationReducer(state, addNotification({ title: 'N3', message: 'M3' }));
      const idToRemove = state.notifications[1].id;
      state = notificationReducer(state, removeNotification(idToRemove));
      expect(state.notifications).toHaveLength(2);
      expect(state.notifications.find(n => n.id === idToRemove)).toBeUndefined();
    });

    it('should handle removal of non-existent id gracefully', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'M' }));
      state = notificationReducer(state, removeNotification(999999));
      expect(state.notifications).toHaveLength(1);
    });
  });

  // ========================================================================
  // 4. clearAllNotifications
  // ========================================================================
  describe('clearAllNotifications', () => {
    it('should clear all notifications', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'M1' }));
      state = notificationReducer(state, addNotification({ title: 'N2', message: 'M2' }));
      state = notificationReducer(state, addNotification({ title: 'N3', message: 'M3' }));
      state = notificationReducer(state, clearAllNotifications());
      expect(state.notifications).toEqual([]);
    });

    it('should handle clearing already empty list', () => {
      const state = notificationReducer(getInitialState(), clearAllNotifications());
      expect(state.notifications).toEqual([]);
    });
  });

  // ========================================================================
  // 5. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset notification state on logout', () => {
      let state = notificationReducer(getInitialState(), addNotification({ title: 'N1', message: 'M1', type: 'error' }));
      state = notificationReducer(state, addNotification({ title: 'N2', message: 'M2', type: 'success' }));
      expect(state.notifications).toHaveLength(2);

      state = notificationReducer(state, logout());
      expect(state.notifications).toEqual([]);
    });
  });

  // ========================================================================
  // 6. EDGE CASES
  // ========================================================================
  describe('edge cases', () => {
    it('should handle many notifications', () => {
      let state = getInitialState();
      for (let i = 0; i < 100; i++) {
        state = notificationReducer(state, addNotification({
          title: `Notification ${i}`,
          message: `Message ${i}`,
        }));
      }
      expect(state.notifications).toHaveLength(100);
    });

    it('should handle special characters in title and message', () => {
      const state = notificationReducer(getInitialState(), addNotification({
        title: '<script>alert("xss")</script>',
        message: 'Price: 1,000,000 AED — 20% discount! "Best deal"',
      }));
      expect(state.notifications[0].title).toBe('<script>alert("xss")</script>');
      expect(state.notifications[0].message).toContain('20% discount');
    });

    it('should handle empty strings', () => {
      const state = notificationReducer(getInitialState(), addNotification({
        title: '',
        message: '',
      }));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].title).toBe('');
    });
  });
});
