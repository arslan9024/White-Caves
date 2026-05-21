/**
 * Styled Components Theme Type Declarations
 * Extends DefaultTheme to match the custom theme structure
 */

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: any;
    colors?: any;
    spacing?: any;
    typography?: any;
    transitions?: any;
    shadows?: any;
    breakpoints?: any;
    zIndex?: any;
    radius?: any;
    fonts?: any;
  }
}
