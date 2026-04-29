import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ─── Basic behaviour ─────────────────────────────────────────────
  describe('basic behaviour', () => {
    it('returns the initial value immediately', () => {
      const { result } = renderHook(() => useDebouncedValue('hello', 300));
      expect(result.current).toBe('hello');
    });

    it('does not update before the delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'hello' } }
      );

      rerender({ value: 'world' });
      act(() => { vi.advanceTimersByTime(100); });
      expect(result.current).toBe('hello');
    });

    it('updates after the delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'hello' } }
      );

      rerender({ value: 'world' });
      act(() => { vi.advanceTimersByTime(300); });
      expect(result.current).toBe('world');
    });

    it('uses default delay of 300ms', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      act(() => { vi.advanceTimersByTime(299); });
      expect(result.current).toBe('initial');

      act(() => { vi.advanceTimersByTime(1); });
      expect(result.current).toBe('updated');
    });
  });

  // ─── Debounce reset ──────────────────────────────────────────────
  describe('debounce reset on rapid changes', () => {
    it('only emits the last value when changed rapidly', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 500),
        { initialProps: { value: 'a' } }
      );

      rerender({ value: 'ab' });
      act(() => { vi.advanceTimersByTime(200); });
      rerender({ value: 'abc' });
      act(() => { vi.advanceTimersByTime(200); });
      rerender({ value: 'abcd' });
      act(() => { vi.advanceTimersByTime(200); });

      // Not enough time since last change
      expect(result.current).toBe('a');

      // Complete the remaining delay
      act(() => { vi.advanceTimersByTime(300); });
      expect(result.current).toBe('abcd');
    });

    it('resets timer on each change', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'first' } }
      );

      // Change at t=100
      act(() => { vi.advanceTimersByTime(100); });
      rerender({ value: 'second' });

      // At t=300, only 200ms since 'second', should still be 'first'
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toBe('first');

      // At t=400, 300ms since 'second' → should update
      act(() => { vi.advanceTimersByTime(100); });
      expect(result.current).toBe('second');
    });
  });

  // ─── Different data types ────────────────────────────────────────
  describe('generic type support', () => {
    it('works with numbers', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 200),
        { initialProps: { value: 0 } }
      );

      rerender({ value: 42 });
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toBe(42);
    });

    it('works with booleans', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 200),
        { initialProps: { value: false } }
      );

      rerender({ value: true });
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toBe(true);
    });

    it('works with objects', () => {
      const obj1 = { search: '' };
      const obj2 = { search: 'test' };

      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 200),
        { initialProps: { value: obj1 } }
      );

      rerender({ value: obj2 });
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toEqual({ search: 'test' });
    });

    it('works with arrays', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 200),
        { initialProps: { value: [1, 2] } }
      );

      rerender({ value: [1, 2, 3] });
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toEqual([1, 2, 3]);
    });

    it('works with null', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue<string | null>(value, 200),
        { initialProps: { value: 'hello' as string | null } }
      );

      rerender({ value: null });
      act(() => { vi.advanceTimersByTime(200); });
      expect(result.current).toBeNull();
    });
  });

  // ─── Different delay values ──────────────────────────────────────
  describe('different delay values', () => {
    it('works with 0ms delay (updates on next tick)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 0),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'instant' });
      act(() => { vi.advanceTimersByTime(0); });
      expect(result.current).toBe('instant');
    });

    it('works with long delay (1000ms)', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 1000),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      act(() => { vi.advanceTimersByTime(999); });
      expect(result.current).toBe('initial');

      act(() => { vi.advanceTimersByTime(1); });
      expect(result.current).toBe('updated');
    });
  });

  // ─── Cleanup ─────────────────────────────────────────────────────
  describe('cleanup', () => {
    it('clears timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'hello' } }
      );

      rerender({ value: 'world' });
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('clears previous timer when value changes', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'a' } }
      );

      rerender({ value: 'b' });
      rerender({ value: 'c' });

      // clearTimeout called for cleanup of previous effect
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  // ─── Same value re-render ────────────────────────────────────────
  describe('same value handling', () => {
    it('does not trigger unnecessary updates when value is unchanged', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'same' } }
      );

      rerender({ value: 'same' });
      act(() => { vi.advanceTimersByTime(300); });
      expect(result.current).toBe('same');
    });
  });

  // ─── Delay change ────────────────────────────────────────────────
  describe('delay changes', () => {
    it('respects new delay when it changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebouncedValue(value, delay),
        { initialProps: { value: 'hello', delay: 500 } }
      );

      // Change both value and delay
      rerender({ value: 'world', delay: 100 });
      act(() => { vi.advanceTimersByTime(100); });
      expect(result.current).toBe('world');
    });
  });
});
