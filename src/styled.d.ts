/**
 * Styled Components Theme Type Declarations
 * Extends DefaultTheme to match the custom theme structure
 */

import 'styled-components';
import { Theme } from './styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
