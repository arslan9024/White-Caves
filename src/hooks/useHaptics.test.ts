import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHaptics } from './useHaptics';

describe('useHaptics', () => {
  it('triggers light, medium, heavy, success, and error haptic feedback vibrations', () => {
    const vibrateSpy = vi.fn();
    Object.assign(navigator, { vibrate: vibrateSpy });

    const { result } = renderHook(() => useHaptics());

    act(() => {
      result.current.light();
      result.current.medium();
      result.current.heavy();
      result.current.success();
      result.current.error();
    });

    expect(vibrateSpy).toHaveBeenCalledTimes(5);
  });
});
