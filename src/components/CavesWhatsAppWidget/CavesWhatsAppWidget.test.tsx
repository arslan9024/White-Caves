/**
 * CavesWhatsAppWidget.test.tsx
 * AEGIS Turn 67 — Test Coverage Gap remediation (Target 8)
 * Integration tests for the CavesWhatsAppWidget component:
 *   - Renders without crashing
 *   - Contains a button element
 *   - Has correct aria title attribute for accessibility
 *   - Clicking the button triggers window.open with a wa.me URL
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CavesWhatsAppWidget } from './CavesWhatsAppWidget';

describe('CavesWhatsAppWidget', () => {
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    vi.stubGlobal('open', openSpy);
    // Stub navigator.vibrate for the logic hook
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    expect(() => render(<CavesWhatsAppWidget />)).not.toThrow();
  });

  it('renders a button element', () => {
    render(<CavesWhatsAppWidget />);
    const button = screen.getByTitle('Contact Agent via WhatsApp');
    expect(button).toBeDefined();
  });

  it('button has the correct title for accessibility', () => {
    render(<CavesWhatsAppWidget />);
    const button = screen.getByTitle('Contact Agent via WhatsApp');
    expect(button.getAttribute('title')).toBe('Contact Agent via WhatsApp');
  });

  it('clicking the button opens a wa.me URL in a new tab', () => {
    render(<CavesWhatsAppWidget />);
    const button = screen.getByTitle('Contact Agent via WhatsApp');
    fireEvent.click(button);
    expect(openSpy).toHaveBeenCalledOnce();
    const calledUrl: string = openSpy.mock.calls[0][0];
    expect(calledUrl.startsWith('https://wa.me/')).toBe(true);
  });

  it('clicking the button opens in _blank target', () => {
    render(<CavesWhatsAppWidget />);
    const button = screen.getByTitle('Contact Agent via WhatsApp');
    fireEvent.click(button);
    expect(openSpy.mock.calls[0][1]).toBe('_blank');
  });
});
