/**
 * usePublicFavorites — Unit Tests
 * Tests: localStorage guest mode, Redux auth mode, merge on login,
 * toggle, isFavorite, favoriteCount
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../store/dashboardSlice';
import authReducer from '../store/authSlice';
import { usePublicFavorites } from './usePublicFavorites';

// ── localStorage Mock ────────────────────────────────────────────
// jsdom may not provide a functional localStorage; we create a
// Map-backed mock and install it on both `window` and `globalThis`.

let _store: Record<string, string> = {};

const mockLocalStorage = {
  getItem: vi.fn((key: string): string | null => _store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    _store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete _store[key];
  }),
  clear: vi.fn(() => {
    _store = {};
  }),
  get length() {
    return Object.keys(_store).length;
  },
  key: vi.fn((i: number): string | null => Object.keys(_store)[i] ?? null),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

// ── Helpers ──────────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = 'white-caves-favorites';

const createStore = (isLoggedIn = false, favorites: Array<{ id: string; title: string; location: string; price: string; image?: string }> = []) =>
  configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: isLoggedIn ? 'tok' : null,
        refreshToken: null,
        session: { isLoggedIn, lastActive: null, sessions: [], expiresAt: null, activeSessionId: null },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 30,
        loading: false,
        error: null,
      } as ReturnType<typeof authReducer>,
      dashboard: {
        favorites,
        favoriteIds: favorites.map((f) => f.id),
        favoritesLoading: false,
        // Include other dashboard state defaults
        stats: null,
        activities: [],
        leads: [],
        isLoading: false,
        error: null,
        lastUpdated: null,
        sidebarCollapsed: false,
        selectedPeriod: 'month',
        notifications: [],
        performance: null,
        filter: 'all',
        currentTab: 'overview',
      } as unknown as ReturnType<typeof dashboardReducer>,
    },
  });

const wrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

// ── Tests ────────────────────────────────────────────────────────

describe('usePublicFavorites', () => {
  beforeEach(() => {
    _store = {};
    vi.clearAllMocks();
  });

  afterEach(() => {
    _store = {};
  });

  // ── Guest Mode (localStorage) ──────────────────────────────────

  describe('Guest Mode (not authenticated)', () => {
    it('should return empty favorites initially', () => {
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.favorites).toEqual([]);
      expect(result.current.favoriteCount).toBe(0);
    });

    it('should add favorite to localStorage', () => {
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });

      act(() => {
        result.current.toggleFavorite({
          id: 'p1',
          title: 'Palm Villa',
          location: 'Palm Jumeirah',
          price: '8,000,000',
        });
      });

      const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('p1');
    });

    it('should remove favorite from localStorage', () => {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([{ id: 'p1', title: 'T', location: 'L', price: '0' }])
      );
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });

      expect(result.current.isFavorite('p1')).toBe(true);

      act(() => {
        result.current.toggleFavorite({
          id: 'p1',
          title: 'T',
          location: 'L',
          price: '0',
        });
      });

      const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      expect(stored).toHaveLength(0);
    });

    it('should correctly report isFavorite', () => {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([{ id: 'p1', title: 'T', location: 'L', price: '0' }])
      );
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });

      expect(result.current.isFavorite('p1')).toBe(true);
      expect(result.current.isFavorite('p2')).toBe(false);
    });

    it('should return favoriteCount for guest', () => {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([
          { id: 'p1', title: 'A', location: 'L', price: '0' },
          { id: 'p2', title: 'B', location: 'L', price: '0' },
        ])
      );
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.favoriteCount).toBe(2);
    });

    it('should handle corrupted localStorage gracefully', () => {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, 'not-json{{{');
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.favorites).toEqual([]);
    });
  });

  // ── Authenticated Mode (Redux) ─────────────────────────────────

  describe('Authenticated Mode', () => {
    it('should use Redux favorites when authenticated', () => {
      const store = createStore(true, [
        { id: 'p1', title: 'Redux Fav', location: 'L', price: '1M' },
      ]);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].title).toBe('Redux Fav');
    });

    it('should report isAuthenticated true', () => {
      const store = createStore(true);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should report isAuthenticated false for guest', () => {
      const store = createStore(false);
      const { result } = renderHook(() => usePublicFavorites(), { wrapper: wrapper(store) });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
