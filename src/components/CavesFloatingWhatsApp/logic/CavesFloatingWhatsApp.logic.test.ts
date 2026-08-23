/**
 * CavesFloatingWhatsApp.logic.test.ts
 * AEGIS Turn 66 — Test Coverage Gap remediation (Target 11)
 * Unit tests for useCavesFloatingWhatsAppLogic hook:
 *   - Returns correct phone number (default or override)
 *   - handleClick opens the correct wa.me URL via window.open
 *   - URL-encodes the message correctly
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCavesFloatingWhatsAppLogic } from './CavesFloatingWhatsApp.logic';
import { WHATSAPP_WIDGET_TEXT } from '../data/CavesFloatingWhatsApp.data';

describe('useCavesFloatingWhatsAppLogic', () => {
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the default White Caves phone number when no override provided', () => {
    const { result } = renderHook(() => useCavesFloatingWhatsAppLogic());
    expect(result.current.phoneNumber).toBeDefined();
    expect(typeof result.current.phoneNumber).toBe('string');
    expect(result.current.phoneNumber.length).toBeGreaterThan(5);
  });

  it('uses a custom phone number when provided', () => {
    const { result } = renderHook(() =>
      useCavesFloatingWhatsAppLogic({ phoneNumber: '+971501234567' })
    );
    expect(result.current.phoneNumber).toBe('+971501234567');
  });

  it('returns a handleClick function', () => {
    const { result } = renderHook(() => useCavesFloatingWhatsAppLogic());
    expect(typeof result.current.handleClick).toBe('function');
  });

  it('handleClick calls window.open with a wa.me URL', () => {
    const { result } = renderHook(() =>
      useCavesFloatingWhatsAppLogic({ phoneNumber: '+971505110636' })
    );
    result.current.handleClick();
    expect(openSpy).toHaveBeenCalledOnce();
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl.startsWith('https://wa.me/')).toBe(true);
  });

  it('handleClick URL contains the phone digits without non-numeric characters', () => {
    const { result } = renderHook(() =>
      useCavesFloatingWhatsAppLogic({ phoneNumber: '+971 50 511 0636' })
    );
    result.current.handleClick();
    const calledUrl: string = openSpy.mock.calls[0][0];
    // Non-digit/+ chars should be stripped from the phone portion
    expect(calledUrl).toContain('971505110636');
  });

  it('handleClick URL contains a URL-encoded text parameter', () => {
    const { result } = renderHook(() =>
      useCavesFloatingWhatsAppLogic({
        phoneNumber: '+971505110636',
        customMessage: 'Hello White Caves',
      })
    );
    result.current.handleClick();
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain('text=');
    expect(calledUrl).toContain(encodeURIComponent('Hello White Caves'));
  });

  it('handleClick opens the link in a new tab with noopener', () => {
    const { result } = renderHook(() => useCavesFloatingWhatsAppLogic());
    result.current.handleClick();
    expect(openSpy.mock.calls[0][1]).toBe('_blank');
    expect(openSpy.mock.calls[0][2]).toContain('noopener');
  });

  it('uses default message from WHATSAPP_WIDGET_TEXT when no customMessage provided', () => {
    const { result } = renderHook(() =>
      useCavesFloatingWhatsAppLogic({ phoneNumber: '+971505110636' })
    );
    result.current.handleClick();
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain(encodeURIComponent(WHATSAPP_WIDGET_TEXT.defaultMessage));
  });
});
