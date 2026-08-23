/**
 * CavesFloatingWhatsApp.data.test.ts
 * AEGIS Turn 66 — Test Coverage Gap remediation (Target 10)
 * Verifies that WHATSAPP_WIDGET_TEXT export has correct shape and White Caves
 * phone number / message content.
 */

import { describe, it, expect } from 'vitest';
import { WHATSAPP_WIDGET_TEXT } from './CavesFloatingWhatsApp.data';

describe('CavesFloatingWhatsApp.data — WHATSAPP_WIDGET_TEXT', () => {
  it('exports a WHATSAPP_WIDGET_TEXT object', () => {
    expect(WHATSAPP_WIDGET_TEXT).toBeDefined();
    expect(typeof WHATSAPP_WIDGET_TEXT).toBe('object');
  });

  it('has a non-empty ariaLabel for accessibility', () => {
    expect(typeof WHATSAPP_WIDGET_TEXT.ariaLabel).toBe('string');
    expect(WHATSAPP_WIDGET_TEXT.ariaLabel.length).toBeGreaterThan(0);
    expect(WHATSAPP_WIDGET_TEXT.ariaLabel.toLowerCase()).toContain('whatsapp');
  });

  it('has a tooltip string', () => {
    expect(typeof WHATSAPP_WIDGET_TEXT.tooltip).toBe('string');
    expect(WHATSAPP_WIDGET_TEXT.tooltip.length).toBeGreaterThan(0);
  });

  it('defaultMessage contains White Caves branding', () => {
    expect(typeof WHATSAPP_WIDGET_TEXT.defaultMessage).toBe('string');
    expect(WHATSAPP_WIDGET_TEXT.defaultMessage).toContain('White Caves');
  });

  it('phoneNumber starts with the UAE country code +971', () => {
    expect(typeof WHATSAPP_WIDGET_TEXT.phoneNumber).toBe('string');
    expect(WHATSAPP_WIDGET_TEXT.phoneNumber.startsWith('+971')).toBe(true);
  });

  it('phoneNumber contains only digits, +, and spaces after the country code', () => {
    const cleaned = WHATSAPP_WIDGET_TEXT.phoneNumber.replace(/[+\s\d]/g, '');
    expect(cleaned).toBe('');
  });
});
