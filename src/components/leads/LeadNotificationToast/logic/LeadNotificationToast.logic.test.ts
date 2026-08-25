import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadNotificationToastLogic } from './LeadNotificationToast.logic';

describe('LeadNotificationToast.logic', () => {
  it('initializes with default toast and sound enabled', () => {
    const { result } = renderHook(() => useLeadNotificationToastLogic());

    expect(result.current.soundEnabled).toBe(true);
    expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);
    expect(result.current.TYPE_ICONS.new_lead).toBe('👤');
  });

  it('toggles sound on and off', () => {
    const { result } = renderHook(() => useLeadNotificationToastLogic());

    act(() => {
      result.current.toggleSound();
    });
    expect(result.current.soundEnabled).toBe(false);

    act(() => {
      result.current.toggleSound();
    });
    expect(result.current.soundEnabled).toBe(true);
  });

  it('dismisses a toast notification', () => {
    const { result } = renderHook(() => useLeadNotificationToastLogic());

    const toastId = result.current.toasts[0]?.id;
    if (toastId) {
      act(() => {
        result.current.dismiss(toastId);
      });
      expect(result.current.toasts.some((t) => t.id === toastId)).toBe(false);
    }
  });
});
