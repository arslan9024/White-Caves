/**
 * CavesWhatsAppWidget.logic.test.ts
 * AEGIS Turn 67 — Test Coverage Gap remediation (Target 6)
 * Unit tests for useWhatsAppWidgetLogic hook:
 *   - Returns an openWhatsApp function
 *   - openWhatsApp calls window.open with correct wa.me URL
 *   - URL targets White Caves phone number and contains pre-filled text
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWhatsAppWidgetLogic } from './CavesWhatsAppWidget.logic';

describe('useWhatsAppWidgetLogic', () => {
  let openSpy: ReturnType<typeof vi.fn>;
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    vibrateSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateSpy,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an openWhatsApp function', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    expect(typeof result.current.openWhatsApp).toBe('function');
  });

  it('openWhatsApp calls window.open', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    expect(openSpy).toHaveBeenCalledOnce();
  });

  it('openWhatsApp opens a wa.me URL', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl.startsWith('https://wa.me/')).toBe(true);
  });

  it('openWhatsApp URL contains White Caves phone number digits', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain('971501234567');
  });

  it('openWhatsApp URL contains a pre-filled text query param', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain('text=');
  });

  it('openWhatsApp URL contains "White Caves" brand in the message', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(decodeURIComponent(calledUrl)).toContain('White Caves');
  });

  it('openWhatsApp opens in _blank target', () => {
    const { result } = renderHook(() => useWhatsAppWidgetLogic());
    act(() => result.current.openWhatsApp());
    expect(openSpy.mock.calls[0][1]).toBe('_blank');
  });
});
