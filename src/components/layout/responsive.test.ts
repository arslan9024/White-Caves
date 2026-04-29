/**
 * Responsive Infrastructure Tests — Phase 4E.1
 *
 * Validates:
 * - Breakpoints system (tokens, mediaQueries, helpers)
 * - Typography responsive scales
 * - Touch target constants
 * - responsiveClamp() utility
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import {
  breakpoints,
  breakpointValues,
  mediaQueries,
  responsiveClamp,
  TOUCH_TARGET_MIN,
} from '../../styles/theme/breakpoints';
import { typography } from '../../styles/theme/typography';

// ─── Breakpoints ──────────────────────────────────────────────────────────

describe('breakpoints', () => {
  it('exports all 8 breakpoint string values', () => {
    expect(Object.keys(breakpoints)).toEqual([
      'mobile', 'mobileLg', 'tablet', 'tabletLg',
      'desktop', 'desktopMd', 'desktopLg', 'desktopXl',
    ]);
  });

  it('all values end with "px"', () => {
    Object.values(breakpoints).forEach(val => {
      expect(val).toMatch(/^\d+px$/);
    });
  });

  it('values are in ascending order', () => {
    const nums = Object.values(breakpoints).map(v => parseInt(v));
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeGreaterThan(nums[i - 1]);
    }
  });

  it('includes new tabletLg (992px) breakpoint', () => {
    expect(breakpoints.tabletLg).toBe('992px');
  });
});

describe('breakpointValues', () => {
  it('exports numeric versions of all breakpoints', () => {
    expect(breakpointValues.mobile).toBe(480);
    expect(breakpointValues.tablet).toBe(768);
    expect(breakpointValues.tabletLg).toBe(992);
    expect(breakpointValues.desktop).toBe(1024);
    expect(breakpointValues.desktopMd).toBe(1200);
    expect(breakpointValues.desktopLg).toBe(1920);
    expect(breakpointValues.desktopXl).toBe(2560);
  });

  it('numeric values match string values', () => {
    Object.entries(breakpointValues).forEach(([key, numVal]) => {
      const strVal = breakpoints[key as keyof typeof breakpoints];
      expect(parseInt(strVal)).toBe(numVal);
    });
  });
});

// ─── Media Queries ────────────────────────────────────────────────────────

describe('mediaQueries', () => {
  it('has max-width queries: mobile, mobileLg, tablet, tabletLg', () => {
    expect(mediaQueries.mobile).toContain('max-width');
    expect(mediaQueries.mobileLg).toContain('max-width');
    expect(mediaQueries.tablet).toContain('max-width');
    expect(mediaQueries.tabletLg).toContain('max-width');
  });

  it('has min-width queries: desktop, desktopMd, desktopLg, desktopXl', () => {
    expect(mediaQueries.desktop).toContain('min-width');
    expect(mediaQueries.desktopMd).toContain('min-width');
    expect(mediaQueries.desktopLg).toContain('min-width');
    expect(mediaQueries.desktopXl).toContain('min-width');
  });

  it('has mobile-first aliases: tabletUp, tabletLgUp, desktopUp, desktopMdUp', () => {
    expect(mediaQueries.tabletUp).toContain('min-width: 768px');
    expect(mediaQueries.tabletLgUp).toContain('min-width: 992px');
    expect(mediaQueries.desktopUp).toContain('min-width: 1024px');
    expect(mediaQueries.desktopMdUp).toContain('min-width: 1200px');
  });

  it('has accessibility queries: reducedMotion, darkMode', () => {
    expect(mediaQueries.reducedMotion).toBe('@media (prefers-reduced-motion: reduce)');
    expect(mediaQueries.darkMode).toBe('@media (prefers-color-scheme: dark)');
  });

  it('has input modality queries: hover, touch', () => {
    expect(mediaQueries.hover).toBe('@media (hover: hover)');
    expect(mediaQueries.touch).toBe('@media (hover: none) and (pointer: coarse)');
  });
});

// ─── responsiveClamp ──────────────────────────────────────────────────────

describe('responsiveClamp', () => {
  it('returns a CSS clamp() expression', () => {
    const result = responsiveClamp('14px', '18px');
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain('14px');
    expect(result).toContain('18px');
  });

  it('uses default viewport range (480px–1200px)', () => {
    const result = responsiveClamp('14px', '18px');
    expect(result).toContain('480px');
    expect(result).toContain('1200');
  });

  it('accepts custom viewport range', () => {
    const result = responsiveClamp('12px', '24px', '320px', '1920px');
    expect(result).toContain('320px');
    expect(result).toContain('1920');
  });
});

// ─── Touch Target ─────────────────────────────────────────────────────────

describe('TOUCH_TARGET_MIN', () => {
  it('is 44px (WCAG 2.1 AA)', () => {
    expect(TOUCH_TARGET_MIN).toBe('44px');
  });
});

// ─── Responsive Typography ────────────────────────────────────────────────

describe('typography.responsive', () => {
  it('exports responsive scale for h1-h6', () => {
    expect(typography.responsive.h1).toContain('clamp(');
    expect(typography.responsive.h2).toContain('clamp(');
    expect(typography.responsive.h3).toContain('clamp(');
    expect(typography.responsive.h4).toContain('clamp(');
    expect(typography.responsive.h5).toContain('clamp(');
    expect(typography.responsive.h6).toContain('clamp(');
  });

  it('exports responsive scale for body, hero, display', () => {
    expect(typography.responsive.body).toContain('clamp(');
    expect(typography.responsive.hero).toContain('clamp(');
    expect(typography.responsive.display).toContain('clamp(');
  });

  it('h1 scales from 24px to 32px', () => {
    expect(typography.responsive.h1).toContain('24px');
    expect(typography.responsive.h1).toContain('32px');
  });

  it('hero scales from 28px to 48px', () => {
    expect(typography.responsive.hero).toContain('28px');
    expect(typography.responsive.hero).toContain('48px');
  });
});
