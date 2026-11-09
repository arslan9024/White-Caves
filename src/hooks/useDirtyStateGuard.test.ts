import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyStateGuard } from './useDirtyStateGuard';

describe('useDirtyStateGuard', () => {
  it('does not show prompt on exit when clean', () => {
    const nextAction = vi.fn();
    const { result } = renderHook(() =>
      useDirtyStateGuard({ isDirty: false })
    );

    act(() => {
      result.current.confirmExit(nextAction);
    });

    expect(result.current.showPrompt).toBe(false);
    expect(nextAction).toHaveBeenCalledTimes(1);
  });

  it('shows prompt on exit when dirty and intercepts navigation', () => {
    const nextAction = vi.fn();
    const { result } = renderHook(() =>
      useDirtyStateGuard({ isDirty: true })
    );

    act(() => {
      result.current.confirmExit(nextAction);
    });

    expect(result.current.showPrompt).toBe(true);
    expect(nextAction).not.toHaveBeenCalled();

    // Proceeding dismisses prompt and executes the intercepted action
    act(() => {
      result.current.proceed();
    });

    expect(result.current.showPrompt).toBe(false);
    expect(nextAction).toHaveBeenCalledTimes(1);
  });

  it('cancelling prompt stays in edit mode without executing action', () => {
    const nextAction = vi.fn();
    const { result } = renderHook(() =>
      useDirtyStateGuard({ isDirty: true })
    );

    act(() => {
      result.current.confirmExit(nextAction);
    });

    expect(result.current.showPrompt).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.showPrompt).toBe(false);
    expect(nextAction).not.toHaveBeenCalled();
  });
});
