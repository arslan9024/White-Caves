// src/styles/styled.d.ts
// TypeScript declaration for styled-components theme
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: unknown;
    colors: Record<string, unknown>;
    spacing: Record<string, unknown>;
    typography: Record<string, unknown>;
    transitions: Record<string, unknown>;
    shadows: Record<string, unknown>;
    breakpoints: Record<string, unknown>;
    zIndex: Record<string, unknown>;
    radius?: Record<string, unknown>;
    fonts?: Record<string, unknown>;
  }
}
