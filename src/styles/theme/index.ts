/**
 * Design System Theme
 * Centralized export of all design tokens
 */

export { colors, type Colors } from './colors';
export { spacing, type Spacing } from './spacing';
export { radius, type Radius } from './radius';
export { typography, type Typography } from './typography';
export { zIndex, type ZIndex } from './zIndex';
export { breakpoints, breakpointValues, mediaQueries, responsiveClamp, TOUCH_TARGET_MIN, type Breakpoints, type BreakpointValues, type MediaQueries } from './breakpoints';
export { shadows, type Shadows } from './shadows';
export { transitions, keyframes, type Transitions, type Keyframes } from './transitions';

// Combined theme object for ThemeProvider
import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { zIndex } from './zIndex';
import { breakpoints, breakpointValues, mediaQueries, responsiveClamp, TOUCH_TARGET_MIN } from './breakpoints';
import { shadows } from './shadows';
import { transitions, keyframes } from './transitions';

// Fonts alias for styled-components
const fonts = {
  heading: typography.fontFamily.primary,
  body: typography.fontFamily.primary,
  mono: typography.fontFamily.mono,
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  fonts,
  zIndex,
  breakpoints,
  breakpointValues,
  mediaQueries,
  shadows,
  transitions,
  keyframes,
  responsiveClamp,
  TOUCH_TARGET_MIN,
};

export type Theme = typeof theme;
