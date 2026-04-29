import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResizableSidebar } from './useResizableSidebar';

// Mock safeStorage
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn(() => null),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

import { safeStorage } from '../utils/safeStorage';
const mockGet = safeStorage.get as ReturnType<typeof vi.fn>;
const mockSet = safeStorage.set as ReturnType<typeof vi.fn>;

describe('useResizableSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  // ─── Initial state ──────────────────────────────────────────────
  describe('initial state', () => {
    it('returns default left width (280) when no saved value', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.width).toBe(280);
    });

    it('returns default right width (320) when no saved value', () => {
      const { result } = renderHook(() => useResizableSidebar('right'));
      expect(result.current.width).toBe(320);
    });

    it('starts with isResizing = false', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.isResizing).toBe(false);
    });

    it('exposes MIN_WIDTH and MAX_WIDTH constants', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.MIN_WIDTH).toBe(200);
      expect(result.current.MAX_WIDTH).toBe(500);
    });
  });

  // ─── localStorage persistence ────────────────────────────────────
  describe('localStorage persistence', () => {
    it('reads saved left width from storage', () => {
      mockGet.mockReturnValue('350');
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.width).toBe(350);
      expect(mockGet).toHaveBeenCalledWith('sidebar_width_left');
    });

    it('reads saved right width from storage', () => {
      mockGet.mockReturnValue('400');
      const { result } = renderHook(() => useResizableSidebar('right'));
      expect(result.current.width).toBe(400);
      expect(mockGet).toHaveBeenCalledWith('sidebar_width_right');
    });

    it('saves width to storage on change', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(300); });
      expect(mockSet).toHaveBeenCalledWith('sidebar_width_left', '300');
    });

    it('clamps saved value to MIN_WIDTH', () => {
      mockGet.mockReturnValue('50');
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.width).toBe(200); // MIN_WIDTH
    });

    it('clamps saved value to MAX_WIDTH', () => {
      mockGet.mockReturnValue('999');
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.width).toBe(500); // MAX_WIDTH
    });

    it('falls back to default on non-numeric saved value', () => {
      mockGet.mockReturnValue('invalid');
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.width).toBe(280); // default for left
    });
  });

  // ─── setWidth (with constraints) ────────────────────────────────
  describe('setWidth', () => {
    it('sets width within range', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(350); });
      expect(result.current.width).toBe(350);
    });

    it('clamps below MIN_WIDTH', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(100); });
      expect(result.current.width).toBe(200);
    });

    it('clamps above MAX_WIDTH', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(600); });
      expect(result.current.width).toBe(500);
    });

    it('allows exact MIN_WIDTH', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(200); });
      expect(result.current.width).toBe(200);
    });

    it('allows exact MAX_WIDTH', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(500); });
      expect(result.current.width).toBe(500);
    });
  });

  // ─── resetWidth ─────────────────────────────────────────────────
  describe('resetWidth', () => {
    it('resets left sidebar to 280', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      act(() => { result.current.setWidth(400); });
      expect(result.current.width).toBe(400);

      act(() => { result.current.resetWidth(); });
      expect(result.current.width).toBe(280);
    });

    it('resets right sidebar to 320', () => {
      const { result } = renderHook(() => useResizableSidebar('right'));
      act(() => { result.current.setWidth(400); });
      expect(result.current.width).toBe(400);

      act(() => { result.current.resetWidth(); });
      expect(result.current.width).toBe(320);
    });
  });

  // ─── isResizing ─────────────────────────────────────────────────
  describe('isResizing', () => {
    it('can be toggled via setIsResizing', () => {
      const { result } = renderHook(() => useResizableSidebar('left'));
      expect(result.current.isResizing).toBe(false);

      act(() => { result.current.setIsResizing(true); });
      expect(result.current.isResizing).toBe(true);

      act(() => { result.current.setIsResizing(false); });
      expect(result.current.isResizing).toBe(false);
    });
  });

  // ─── Side-specific storage keys ─────────────────────────────────
  describe('storage key isolation', () => {
    it('uses different storage keys for left and right', () => {
      renderHook(() => useResizableSidebar('left'));
      expect(mockGet).toHaveBeenCalledWith('sidebar_width_left');

      mockGet.mockClear();
      renderHook(() => useResizableSidebar('right'));
      expect(mockGet).toHaveBeenCalledWith('sidebar_width_right');
    });
  });
});
