/**
 * Design System Theme
 * Centralized export of all design tokens
 */

export { colors, type Colors } from './colors';
export { spacing, type Spacing } from './spacing';
export { typography, type Typography } from './typography';
export { zIndex, type ZIndex } from './zIndex';
export { breakpoints, mediaQueries, type Breakpoints, type MediaQueries } from './breakpoints';
export { shadows, type Shadows } from './shadows';
export { transitions, keyframes, type Transitions, type Keyframes } from './transitions';

// Combined theme object for ThemeProvider
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { zIndex } from './zIndex';
import { breakpoints, mediaQueries } from './breakpoints';
import { shadows } from './shadows';
import { transitions, keyframes } from './transitions';

export const theme = {
  colors,
  spacing,
  typography,
  zIndex,
  breakpoints,
  mediaQueries,
  shadows,
  transitions,
  keyframes,
};

export type Theme = typeof theme;
