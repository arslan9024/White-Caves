import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecordHighlight } from './useRecordHighlight';

describe('useRecordHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets highlighted ID and clears it after specified duration', () => {
    const { result } = renderHook(() => useRecordHighlight(2000));

    expect(result.current.highlightedId).toBeNull();

    act(() => {
      result.current.triggerHighlight('DL-999', false);
    });

    expect(result.current.highlightedId).toBe('DL-999');

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.highlightedId).toBe('DL-999');

    // Advance past duration
    act(() => {
      vi.advanceTimersByTime(1050);
    });
    expect(result.current.highlightedId).toBeNull();
  });

  it('allows manual clearHighlight', () => {
    const { result } = renderHook(() => useRecordHighlight(5000));

    act(() => {
      result.current.triggerHighlight('DL-555', false);
    });

    expect(result.current.highlightedId).toBe('DL-555');

    act(() => {
      result.current.clearHighlight();
    });

    expect(result.current.highlightedId).toBeNull();
  });
});
