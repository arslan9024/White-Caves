/**
 * Spacing System - 8px Base Grid
 * All spacing values follow 8px grid for consistency
 */

export const spacing = {
  // Base increments
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',

  // Composite spacing (used in layouts)
  section: '48px',
  component: '24px',
  element: '16px',

  // Padding presets
  paddingSmall: '8px 16px',
  paddingMedium: '12px 24px',
  paddingLarge: '16px 32px',

  // Margin presets
  marginSmall: '8px',
  marginMedium: '16px',
  marginLarge: '24px',

  // Gap presets (for flex/grid)
  gapSmall: '8px',
  gapMedium: '16px',
  gapLarge: '24px',
  gapXL: '32px',
};

export type Spacing = typeof spacing;
