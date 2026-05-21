// src/styles/styled.d.ts
// TypeScript declaration for styled-components theme
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: any;
  }
}
