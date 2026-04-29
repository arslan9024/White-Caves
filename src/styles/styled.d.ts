// src/styles/styled.d.ts
// TypeScript declaration for styled-components theme
import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    colors: {
      // Primary & Secondary
      primary: string;
      secondary: string;
      
      // Backgrounds (both flat and nested for compatibility)
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      backgroundAlt: string;
      cardBg: string;
      
      // Text
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
      };
      textPrimary: string;
      textSecondary: string;
      textTertiary: string;
      textInverse: string;
      
      // Borders & Dividers
      border: {
        light: string;
        medium: string;
        dark: string;
      };
      borderLight: string;
      divider: string;
      
      // States
      success: string;
      warning: string;
      danger: string;
      error: string;
      info: string;
      
      // Status Indicators
      statusOnline: string;
      statusBusy: string;
      statusOffline: string;
      
      // Interactive
      hover: string;
      active: string;
      disabled: string;
      focus: string;
      
      // Semantic
      activeBg: string;
      hoverBg: string;
      
      // Sidebar specific
      sidebarBg?: string;
    };
    
    spacing: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      12: string;
      16: string;
    };
    
    typography: {
      h1: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      h2: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      h3: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      h4: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      h5: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      body: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      bodySmall: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      caption: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
      button: {
        size: string;
        weight: number;
        lineHeight: number;
        letterSpacing: string;
      };
    };
    
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    
    shadows: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      elevated: string;
    };
    
    transitions: {
      fast: string;
      standard: string;
      slow: string;
    };
    
    easing: {
      in: string;
      out: string;
      inOut: string;
      standard: string;
    };
    
    breakpoints: {
      mobile: string;
      tablet: string;
      laptop: string;
      desktop: string;
      widescreen: string;
    };
    
    zIndex: {
      hide: number;
      base: number;
      dropdown: number;
      sticky: number;
      fixed: number;
      modalBackdrop: number;
      modal: number;
      popover: number;
      tooltip: number;
    };
  }
}
