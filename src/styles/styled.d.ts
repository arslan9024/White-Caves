// src/styles/styled.d.ts
// TypeScript declaration for styled-components theme
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: any;
    colors: Record<string, any>;
    spacing: Record<string, any>;
    typography: Record<string, any>;
    transitions: Record<string, any>;
    shadows: Record<string, any>;
    breakpoints: Record<string, any>;
    zIndex: Record<string, any>;
    radius?: Record<string, any>;
    fonts?: Record<string, any>;
  }
}
