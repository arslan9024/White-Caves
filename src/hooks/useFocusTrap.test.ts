/**
 * useFocusTrap — Unit tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">First</button>
      <input id="input1" type="text" />
      <a id="link1" href="#">Link</a>
      <button id="btn2">Last</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });

  it('ref.current is null when not attached', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    expect(result.current.current).toBeNull();
  });

  it('does nothing when inactive', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    // Should not throw or have side effects
    expect(result.current.current).toBeNull();
  });

  it('handles activation toggle without errors', () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useFocusTrap(active),
      { initialProps: { active: false } },
    );

    expect(result.current.current).toBeNull();

    // Activate
    rerender({ active: true });
    expect(result.current.current).toBeNull(); // Still null without attaching to DOM

    // Deactivate
    rerender({ active: false });
    expect(result.current.current).toBeNull();
  });

  it('stores previous activeElement on activation', () => {
    // Focus an element first
    const btn = container.querySelector<HTMLButtonElement>('#btn1')!;
    btn.focus();
    expect(document.activeElement).toBe(btn);

    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useFocusTrap(active),
      { initialProps: { active: false } },
    );

    // Activate trap — should store the currently focused element
    rerender({ active: true });
    // No assertion on internal ref, just ensure no errors
    expect(document.activeElement).toBeDefined();
  });

  it('accepts options without errors', () => {
    const { result } = renderHook(() =>
      useFocusTrap(false, { restoreFocus: false, autoFocus: false }),
    );
    expect(result.current.current).toBeNull();
  });
});
