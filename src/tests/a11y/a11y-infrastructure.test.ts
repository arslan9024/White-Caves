/**
 * Accessibility (a11y) Infrastructure — Unit Tests
 *
 * Tests WCAG AA compliance of the White Caves design token system:
 * - Color contrast ratios (WCAG 2.1 SC 1.4.3 / 1.4.11)
 * - Focus indicator styles
 * - useFocusTrap hook
 * - Theme a11y token existence
 */

import { describe, it, expect } from 'vitest';
import { colors } from '../../styles/theme/colors';
import { mediaQueries, TOUCH_TARGET_MIN, breakpointValues } from '../../styles/theme/breakpoints';

/* ──────────────────────────────────────────────────────────────────
 * Helpers — Relative luminance & contrast ratio (WCAG 2.1 algorithm)
 * ──────────────────────────────────────────────────────────────── */

/** Convert hex (#RRGGBB) to [R, G, B] in 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Relative luminance per WCAG 2.1 */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colors */
function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const WHITE = '#FFFFFF';
/* ──────────────────────────────────────────────────────────────────
 * 1. Color Contrast — WCAG 2.1 SC 1.4.3 (Normal Text AA ≥ 4.5:1)
 * ──────────────────────────────────────────────────────────────── */

describe('WCAG Color Contrast (SC 1.4.3 / 1.4.11)', () => {
  describe('a11y text tokens on white background (≥ 4.5:1)', () => {
    it('goldText meets AA for normal text', () => {
      const ratio = contrastRatio(colors.a11y.goldText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('errorText meets AA for normal text', () => {
      const ratio = contrastRatio(colors.a11y.errorText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('warningText meets AA for normal text', () => {
      const ratio = contrastRatio(colors.a11y.warningText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('successText meets AA for normal text', () => {
      const ratio = contrastRatio(colors.a11y.successText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('infoText meets AA for normal text', () => {
      const ratio = contrastRatio(colors.a11y.infoText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('a11y large-text / UI tokens on white (≥ 3:1)', () => {
    it('goldLargeText meets AA for large text', () => {
      const ratio = contrastRatio(colors.a11y.goldLargeText, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('goldUI meets AA for non-text UI elements', () => {
      const ratio = contrastRatio(colors.a11y.goldUI, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('focusRing meets 3:1 for non-text indicators', () => {
      const ratio = contrastRatio(colors.a11y.focusRing, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe('primary brand gold FAILS AA for text (expected)', () => {
    it('primary gold (#D4AF37) fails 4.5:1 on white — use a11y.goldText instead', () => {
      const ratio = contrastRatio(colors.primary, WHITE);
      expect(ratio).toBeLessThan(4.5);
    });
  });

  describe('secondary color (dark green) contrast', () => {
    it('secondary on white meets AA for normal text', () => {
      const ratio = contrastRatio(colors.secondary, WHITE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('white on secondary background meets AA', () => {
      const ratio = contrastRatio(WHITE, colors.secondary);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 2. a11y Token Existence — Ensure all required tokens exist
 * ──────────────────────────────────────────────────────────────── */

describe('a11y Token Existence', () => {
  it('has all required a11y color tokens', () => {
    expect(colors.a11y).toBeDefined();
    expect(colors.a11y.goldText).toBeDefined();
    expect(colors.a11y.goldLargeText).toBeDefined();
    expect(colors.a11y.goldUI).toBeDefined();
    expect(colors.a11y.focusRing).toBeDefined();
    expect(colors.a11y.errorText).toBeDefined();
    expect(colors.a11y.warningText).toBeDefined();
    expect(colors.a11y.successText).toBeDefined();
    expect(colors.a11y.infoText).toBeDefined();
  });

  it('a11y token values are valid hex colors', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    Object.values(colors.a11y).forEach(value => {
      expect(value).toMatch(hexPattern);
    });
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 3. Touch Target Size — WCAG 2.5.8 (Target Size)
 * ──────────────────────────────────────────────────────────────── */

describe('Touch Target Constants', () => {
  it('TOUCH_TARGET_MIN is at least 44px (WCAG 2.5.5 AAA / 2.5.8 AA)', () => {
    expect(parseInt(TOUCH_TARGET_MIN)).toBeGreaterThanOrEqual(44);
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 4. Accessibility Media Queries — prefers-reduced-motion, etc.
 * ──────────────────────────────────────────────────────────────── */

describe('Accessibility Media Queries', () => {
  it('has prefers-reduced-motion query', () => {
    expect(mediaQueries.reducedMotion).toContain('prefers-reduced-motion');
  });

  it('has prefers-color-scheme dark-mode query', () => {
    expect(mediaQueries.darkMode).toContain('prefers-color-scheme: dark');
  });

  it('has hover capability query', () => {
    expect(mediaQueries.hover).toContain('hover: hover');
  });

  it('has touch/coarse pointer query', () => {
    expect(mediaQueries.touch).toContain('pointer: coarse');
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 5. Breakpoint System Integrity
 * ──────────────────────────────────────────────────────────────── */

describe('Breakpoint System', () => {
  it('has numeric breakpoint values for programmatic use', () => {
    expect(breakpointValues.mobile).toBe(480);
    expect(breakpointValues.tablet).toBe(768);
    expect(breakpointValues.desktop).toBe(1024);
    expect(breakpointValues.desktopMd).toBe(1200);
  });

  it('breakpoints are ordered from smallest to largest', () => {
    const orderedValues = [
      breakpointValues.mobile,
      breakpointValues.mobileLg,
      breakpointValues.tablet,
      breakpointValues.tabletLg,
      breakpointValues.desktop,
      breakpointValues.desktopMd,
      breakpointValues.desktopLg,
      breakpointValues.desktopXl,
    ];
    let previous = orderedValues[0];
    for (const current of orderedValues.slice(1)) {
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
  });
});
