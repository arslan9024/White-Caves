/**
 * Responsive Breakpoints
 * Media query breakpoints for responsive design
 *
 * Mobile-first approach:
 *   Defaults → mobile styles
 *   tabletUp (≥768px) → tablet adjustments
 *   desktopUp (≥1024px) → desktop layout
 *   desktopMdUp (≥1200px) → wide desktop
 *
 * Max-width queries for progressive degradation:
 *   mobile (≤480px) → small phone overrides
 *   tablet (≤768px) → tablet/mobile overrides
 */

export const breakpoints = {
  mobile: '480px',
  mobileLg: '576px',
  tablet: '768px',
  tabletLg: '992px',
  desktop: '1024px',
  desktopMd: '1200px',
  desktopLg: '1920px',
  desktopXl: '2560px',
};

/** Numeric breakpoint values (px) for JS comparisons and useMediaQuery */
export const breakpointValues = {
  mobile: 480,
  mobileLg: 576,
  tablet: 768,
  tabletLg: 992,
  desktop: 1024,
  desktopMd: 1200,
  desktopLg: 1920,
  desktopXl: 2560,
} as const;

export const mediaQueries = {
  // Max-width queries (progressive degradation)
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  mobileLg: `@media (max-width: ${breakpoints.mobileLg})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  tabletLg: `@media (max-width: ${breakpoints.tabletLg})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopMd: `@media (min-width: ${breakpoints.desktopMd})`,
  desktopLg: `@media (min-width: ${breakpoints.desktopLg})`,
  desktopXl: `@media (min-width: ${breakpoints.desktopXl})`,

  // Mobile-first (min-width)
  tabletUp: `@media (min-width: ${breakpoints.tablet})`,
  tabletLgUp: `@media (min-width: ${breakpoints.tabletLg})`,
  desktopUp: `@media (min-width: ${breakpoints.desktop})`,
  desktopMdUp: `@media (min-width: ${breakpoints.desktopMd})`,

  // Accessibility / preference
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
  darkMode: `@media (prefers-color-scheme: dark)`,
  hover: `@media (hover: hover)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
};

/**
 * CSS clamp() helper for fluid responsive values.
 * Usage in styled-components:
 *   font-size: ${responsiveClamp('14px', '18px', '480px', '1200px')};
 */
export function responsiveClamp(
  minValue: string,
  maxValue: string,
  minViewport: string = breakpoints.mobile,
  maxViewport: string = breakpoints.desktopMd,
): string {
  return `clamp(${minValue}, calc(${minValue} + (${parseFloat(maxValue)} - ${parseFloat(minValue)}) * ((100vw - ${minViewport}) / (${parseFloat(maxViewport)} - ${parseFloat(minViewport)}))), ${maxValue})`;
}

/** Minimum touch target size per WCAG 2.1 AA (44×44 CSS pixels) */
export const TOUCH_TARGET_MIN = '44px';

export type Breakpoints = typeof breakpoints;
export type BreakpointValues = typeof breakpointValues;
export type MediaQueries = typeof mediaQueries;
