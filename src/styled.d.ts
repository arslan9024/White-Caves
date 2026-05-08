/**
 * Styled Components Theme Type Declarations
 * Extends DefaultTheme to match the custom theme structure
 */

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: unknown;
  }
}
