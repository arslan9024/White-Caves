import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobilePropertyQuickActionsLogic, QUICK_ACTIONS } from './MobilePropertyQuickActions.logic';

describe('MobilePropertyQuickActions.logic', () => {
  it('initializes with 8 quick actions and closed modal state', () => {
    const { result } = renderHook(() => useMobilePropertyQuickActionsLogic());

    expect(result.current.actions.length).toBe(8);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeAction).toBeNull();
  });

  it('handles open and close events', () => {
    const { result } = renderHook(() => useMobilePropertyQuickActionsLogic());

    act(() => {
      result.current.handleOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('dispatches action and closes drawer', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMobilePropertyQuickActionsLogic());

    act(() => {
      result.current.handleOpen();
      result.current.handleAction('whatsapp');
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeAction).toBe('whatsapp');

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.activeAction).toBeNull();
    vi.useRealTimers();
  });
});
