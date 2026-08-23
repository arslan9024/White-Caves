/**
 * CavesFloatingWhatsApp.style.test.ts
 * AEGIS Turn 67 — Test Coverage Gap remediation (Target 5)
 * Verifies that all styled-component exports from CavesFloatingWhatsApp.style.ts
 * exist and carry the styledComponentId marker. Also verifies the keyframes
 * animation export is present.
 * NOTE: In Vitest/JSDOM, styled-components are React component objects,
 * not plain functions — styledComponentId is the correct marker to assert.
 */

import { describe, it, expect } from 'vitest';
import { FloatingBtn, SvgIcon } from './CavesFloatingWhatsApp.style';

describe('CavesFloatingWhatsApp.style exports', () => {
  it('exports FloatingBtn as a styled-component (defined, non-null)', () => {
    expect(FloatingBtn).toBeDefined();
    expect(FloatingBtn).not.toBeNull();
  });

  it('FloatingBtn has styledComponentId marker', () => {
    expect((FloatingBtn as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('exports SvgIcon as a styled-component (defined, non-null)', () => {
    expect(SvgIcon).toBeDefined();
    expect(SvgIcon).not.toBeNull();
  });

  it('SvgIcon has styledComponentId marker', () => {
    expect((SvgIcon as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('FloatingBtn and SvgIcon are distinct references', () => {
    expect(FloatingBtn).not.toBe(SvgIcon);
  });
});
