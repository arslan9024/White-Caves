/**
 * Styled Components Theme Type Declarations
 * Extends DefaultTheme to match the custom theme structure
 */

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: unknown;
    colors?: Record<string, string>;
    spacing?: Record<string, string>;
    typography?: Record<string, unknown>;
    transitions?: Record<string, string>;
    shadows?: Record<string, string>;
    breakpoints?: Record<string, string>;
    zIndex?: Record<string, number>;
    radius?: Record<string, string>;
    fonts?: Record<string, string>;
  }
}
