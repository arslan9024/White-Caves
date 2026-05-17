// src/styles/styled.d.ts
// TypeScript declaration for styled-components theme
import 'styled-components';
import type { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
