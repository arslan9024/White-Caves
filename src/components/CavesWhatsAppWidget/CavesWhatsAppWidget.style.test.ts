/**
 * CavesWhatsAppWidget.style.test.ts
 * AEGIS Turn 67 — Test Coverage Gap remediation (Target 7)
 * Verifies that WhatsAppButton styled-component export exists and carries
 * the styledComponentId marker. Uses motion.button as base — still resolves
 * as an object with styledComponentId in Vitest/JSDOM.
 */

import { describe, it, expect } from 'vitest';
import { WhatsAppButton } from './CavesWhatsAppWidget.style';

describe('CavesWhatsAppWidget.style exports', () => {
  it('exports WhatsAppButton as a styled-component (defined, non-null)', () => {
    expect(WhatsAppButton).toBeDefined();
    expect(WhatsAppButton).not.toBeNull();
  });

  it('WhatsAppButton has styledComponentId marker', () => {
    expect(
      (WhatsAppButton as unknown as { styledComponentId?: string }).styledComponentId
    ).toBeTruthy();
  });

  it('WhatsAppButton is an object (React component, not a primitive)', () => {
    expect(typeof WhatsAppButton).toBe('object');
  });
});
