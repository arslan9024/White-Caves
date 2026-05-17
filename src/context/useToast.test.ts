/**
 * useToast — Comprehensive Tests
 * Tests for the Toast notification system hooks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider } from './ToastContext';

import {
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast,
  useCustomToast,
} from './useToast';

// ─── Wrapper ────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(ToastProvider, null, children);
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══ CORE HOOK ════════════════════════════════════════════════════════

  describe('useToast (base hook)', () => {
    it('returns the context value with show, dismiss, dismissAll', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(result.current).toBeDefined();
      expect(typeof result.current.show).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
      expect(typeof result.current.dismissAll).toBe('function');
      expect(Array.isArray(result.current.toasts)).toBe(true);
    });

    it('throws when used outside ToastProvider', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used inside a ToastProvider');
      consoleErrorSpy.mockRestore();
    });

    it('show returns a toast ID', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      let id = '';
      act(() => {
        id = result.current.show({
          message: 'Test',
          type: 'info',
          position: 'bottom-right',
        });
      });
      expect(id).toBeTruthy();
      expect(id.startsWith('toast-')).toBe(true);
    });

    it('show adds a toast to the list', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.show({
          message: 'Hello',
          type: 'success',
          position: 'bottom-right',
        });
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Hello');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('dismiss removes a specific toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      let id = '';
      act(() => {
        id = result.current.show({
          message: 'Toast 1',
          type: 'info',
          position: 'bottom-right',
        });
        result.current.show({
          message: 'Toast 2',
          type: 'info',
          position: 'bottom-right',
        });
      });
      expect(result.current.toasts).toHaveLength(2);
      act(() => {
        result.current.dismiss(id);
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Toast 2');
    });

    it('dismissAll removes all toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.show({ message: 'A', type: 'info', position: 'bottom-right' });
        result.current.show({ message: 'B', type: 'info', position: 'bottom-right' });
        result.current.show({ message: 'C', type: 'info', position: 'bottom-right' });
      });
      expect(result.current.toasts).toHaveLength(3);
      act(() => {
        result.current.dismissAll();
      });
      expect(result.current.toasts).toHaveLength(0);
    });
  });

  // ═══ CONVENIENCE HOOKS ════════════════════════════════════════════════

  describe('useSuccessToast', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useSuccessToast(), { wrapper });
      expect(typeof result.current).toBe('function');
    });

    it('creates a success toast with default duration', () => {
      const { result: toastResult } = renderHook(() => useToast(), { wrapper });
      const { result: successResult } = renderHook(() => useSuccessToast(), {
        wrapper,
      });
      // Different hook instances share the same provider? No, different wrappers.
      // Use a combined hook instead:
      const { result } = renderHook(() => {
        const toast = useToast();
        const showSuccess = useSuccessToast();
        return { toast, showSuccess };
      }, { wrapper });

      act(() => {
        result.current.showSuccess('Operation successful');
      });
      expect(result.current.toast.toasts).toHaveLength(1);
      expect(result.current.toast.toasts[0].type).toBe('success');
      expect(result.current.toast.toasts[0].message).toBe('Operation successful');
      expect(result.current.toast.toasts[0].position).toBe('bottom-right');
      expect(result.current.toast.toasts[0].duration).toBe(3000);
    });

    it('accepts custom duration', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showSuccess = useSuccessToast();
        return { toast, showSuccess };
      }, { wrapper });

      act(() => {
        result.current.showSuccess('Success!', 5000);
      });
      expect(result.current.toast.toasts[0].duration).toBe(5000);
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useSuccessToast(), { wrapper });
      let id = '';
      act(() => {
        id = result.current('msg');
      });
      expect(id).toBeTruthy();
      expect(id.startsWith('toast-')).toBe(true);
    });
  });

  describe('useErrorToast', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useErrorToast(), { wrapper });
      expect(typeof result.current).toBe('function');
    });

    it('creates an error toast with 4000ms default duration', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showError = useErrorToast();
        return { toast, showError };
      }, { wrapper });

      act(() => {
        result.current.showError('Something went wrong');
      });
      expect(result.current.toast.toasts[0].type).toBe('error');
      expect(result.current.toast.toasts[0].duration).toBe(4000);
    });

    it('accepts custom duration', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showError = useErrorToast();
        return { toast, showError };
      }, { wrapper });

      act(() => {
        result.current.showError('Error!', 6000);
      });
      expect(result.current.toast.toasts[0].duration).toBe(6000);
    });
  });

  describe('useWarningToast', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useWarningToast(), { wrapper });
      expect(typeof result.current).toBe('function');
    });

    it('creates a warning toast with 3500ms default duration', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showWarning = useWarningToast();
        return { toast, showWarning };
      }, { wrapper });

      act(() => {
        result.current.showWarning('Be careful');
      });
      expect(result.current.toast.toasts[0].type).toBe('warning');
      expect(result.current.toast.toasts[0].duration).toBe(3500);
    });
  });

  describe('useInfoToast', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useInfoToast(), { wrapper });
      expect(typeof result.current).toBe('function');
    });

    it('creates an info toast with 3000ms default duration', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showInfo = useInfoToast();
        return { toast, showInfo };
      }, { wrapper });

      act(() => {
        result.current.showInfo('FYI');
      });
      expect(result.current.toast.toasts[0].type).toBe('info');
      expect(result.current.toast.toasts[0].duration).toBe(3000);
    });
  });

  // ═══ ADVANCED HOOK ═══════════════════════════════════════════════════

  describe('useCustomToast', () => {
    it('returns show, dismiss, dismissAll functions', () => {
      const { result } = renderHook(() => useCustomToast(), { wrapper });
      expect(typeof result.current.show).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
      expect(typeof result.current.dismissAll).toBe('function');
    });

    it('show creates a toast with full config', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const custom = useCustomToast();
        return { toast, custom };
      }, { wrapper });

      act(() => {
        result.current.custom.show({
          message: 'Custom toast',
          type: 'warning',
          position: 'top-center',
          duration: 5000,
        });
      });
      expect(result.current.toast.toasts[0].message).toBe('Custom toast');
      expect(result.current.toast.toasts[0].type).toBe('warning');
      expect(result.current.toast.toasts[0].position).toBe('top-center');
    });

    it('dismiss removes a toast by id', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const custom = useCustomToast();
        return { toast, custom };
      }, { wrapper });

      let id = '';
      act(() => {
        id = result.current.custom.show({
          message: 'To dismiss',
          type: 'info',
          position: 'bottom-right',
        });
      });
      expect(result.current.toast.toasts).toHaveLength(1);
      act(() => {
        result.current.custom.dismiss(id);
      });
      expect(result.current.toast.toasts).toHaveLength(0);
    });

    it('dismissAll removes all toasts', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const custom = useCustomToast();
        return { toast, custom };
      }, { wrapper });

      act(() => {
        result.current.custom.show({ message: 'A', type: 'info', position: 'bottom-right' });
        result.current.custom.show({ message: 'B', type: 'info', position: 'bottom-right' });
      });
      expect(result.current.toast.toasts).toHaveLength(2);
      act(() => {
        result.current.custom.dismissAll();
      });
      expect(result.current.toast.toasts).toHaveLength(0);
    });
  });

  // ═══ EDGE CASES ═══════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('empty message is handled', () => {
      const { result } = renderHook(() => {
        const toast = useToast();
        const showSuccess = useSuccessToast();
        return { toast, showSuccess };
      }, { wrapper });

      act(() => {
        result.current.showSuccess('');
      });
      expect(result.current.toast.toasts[0].message).toBe('');
    });

    it('very long message is passed through', () => {
      const longMessage = 'A'.repeat(1000);
      const { result } = renderHook(() => {
        const toast = useToast();
        const showInfo = useInfoToast();
        return { toast, showInfo };
      }, { wrapper });

      act(() => {
        result.current.showInfo(longMessage);
      });
      expect(result.current.toast.toasts[0].message).toBe(longMessage);
    });

    it('multiple toasts can be created and tracked', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.show({ message: '1', type: 'info', position: 'bottom-right' });
        result.current.show({ message: '2', type: 'success', position: 'bottom-right' });
        result.current.show({ message: '3', type: 'warning', position: 'bottom-right' });
      });
      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts.map(t => t.message)).toEqual(['1', '2', '3']);
    });

    it('each toast has a unique ID', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      const ids: string[] = [];
      act(() => {
        ids.push(result.current.show({ message: 'A', type: 'info', position: 'bottom-right' }));
        ids.push(result.current.show({ message: 'B', type: 'info', position: 'bottom-right' }));
        ids.push(result.current.show({ message: 'C', type: 'info', position: 'bottom-right' }));
      });
      expect(new Set(ids).size).toBe(3);
    });
  });
});
