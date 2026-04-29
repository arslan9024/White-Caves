/**
 * Global Styles
 * Base styles, resets, and utilities for the entire application
 */

import { createGlobalStyle } from 'styled-components';
import { lightTheme as theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* ═══ CSS Variables Bridge ═══════════════════════════════════
     Maps JS design tokens → CSS custom properties so .css files
     (homepage, auth, etc.) can consume the same palette.
     ─────────────────────────────────────────────────────────── */
  :root {
    /* Brand */
    --primary-color: ${theme.colors.primary};
    --primary-dark: ${theme.colors.primaryDark};
    --primary-light: ${theme.colors.primaryLight};
    --primary-very-light: ${theme.colors.primaryVeryLight};
    --accent-gold: ${theme.colors.primary};
    --secondary-color: ${theme.colors.secondary};
    --secondary-dark: ${theme.colors.secondaryDark};

    /* Backgrounds */
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};

    /* Text */
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.tertiary};

    /* Borders */
    --border-color: ${theme.colors.border};
    --border-light: ${theme.colors.borderLight};

    /* Typography */
    --font-heading: ${theme.typography.fontFamily.heading};
    --font-body: ${theme.typography.fontFamily.primary};

    /* Radius */
    --radius-xs: ${theme.radius.xs};
    --radius-sm: ${theme.radius.sm};
    --radius-md: ${theme.radius.md};
    --radius-lg: ${theme.radius.lg};
    --radius-xl: ${theme.radius.xl};
    --radius-xxl: ${theme.radius.xxl};
    --radius-full: ${theme.radius.full};

    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};

    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;

    /* Semantic */
    --success-color: ${theme.colors.success};
    --error-color: ${theme.colors.error};
    --warning-color: ${theme.colors.warning};
    --info-color: ${theme.colors.info};

    /* WCAG AA Contrast-Safe Variants */
    --a11y-gold-text: ${theme.colors.a11y.goldText};
    --a11y-gold-large: ${theme.colors.a11y.goldLargeText};
    --a11y-gold-ui: ${theme.colors.a11y.goldUI};
    --a11y-focus-ring: ${theme.colors.a11y.focusRing};
    --a11y-error-text: ${theme.colors.a11y.errorText};
    --a11y-warning-text: ${theme.colors.a11y.warningText};

    /* Legacy alias (DepartmentContentPanel, Modal) */
    --primary-red: var(--primary-color);
  }

  /* CSS Reset & Base Styles */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.styles.body.size};
    line-height: ${theme.typography.styles.body.lineHeight};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
    transition: ${theme.transitions.background};
  }

  /* Typography Reset */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-weight: 600;
    line-height: 1.2;
    color: ${theme.colors.text.primary};
  }

  h1 {
    font-size: ${theme.typography.styles.h1.size};
    line-height: ${theme.typography.styles.h1.lineHeight};
  }

  h2 {
    font-size: ${theme.typography.styles.h2.size};
    line-height: ${theme.typography.styles.h2.lineHeight};
  }

  h3 {
    font-size: ${theme.typography.styles.h3.size};
    line-height: ${theme.typography.styles.h3.lineHeight};
  }

  h4 {
    font-size: ${theme.typography.styles.h4.size};
    line-height: ${theme.typography.styles.h4.lineHeight};
  }

  h5 {
    font-size: ${theme.typography.styles.h5.size};
    line-height: ${theme.typography.styles.h5.lineHeight};
  }

  h6 {
    font-size: ${theme.typography.styles.h6.size};
    line-height: ${theme.typography.styles.h6.lineHeight};
  }

  p {
    margin: 0;
    overflow-wrap: break-word;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.color};

    &:hover {
      color: ${theme.colors.primaryDark};
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 3px solid ${theme.colors.a11y.focusRing};
      outline-offset: 2px;
      border-radius: 2px;
    }

    /* Remove outline for mouse-only focus (keyboard users still see it) */
    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  /* Form Elements */
  input,
  textarea,
  select,
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  input,
  textarea,
  select {
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.spacing.xs};
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    transition: ${theme.transitions.color};

    &:hover {
      border-color: ${theme.colors.borderDark};
    }

    &:focus-visible {
      outline: 3px solid ${theme.colors.a11y.focusRing};
      outline-offset: 2px;
      border-color: ${theme.colors.a11y.goldUI};
      box-shadow: none;
    }

    &:focus:not(:focus-visible) {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: ${theme.shadows.focus};
    }

    &:disabled {
      background-color: ${theme.colors.background.tertiary};
      color: ${theme.colors.text.disabled};
      cursor: not-allowed;
    }

    &::placeholder {
      color: ${theme.colors.text.tertiary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    transition: ${theme.transitions.all};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:focus-visible {
      outline: 3px solid ${theme.colors.a11y.focusRing};
      outline-offset: 2px;
      border-radius: 2px;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  /* Lists */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  th, td {
    padding: ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
  }

  th {
    background-color: ${theme.colors.background.secondary};
    font-weight: 600;
    color: ${theme.colors.text.secondary};
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${theme.colors.borderDark};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
  }

  /* Main Layout */
  #root {
    width: 100%;
    min-height: 100vh;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .no-scroll {
    overflow: hidden;
  }

  /* Animations */
  ${theme.keyframes.fadeIn}
  ${theme.keyframes.fadeOut}
  ${theme.keyframes.scaleIn}
  ${theme.keyframes.slideInLeft}
  ${theme.keyframes.slideInRight}
  ${theme.keyframes.slideInUp}
  ${theme.keyframes.slideOutDown}
  ${theme.keyframes.spin}
  ${theme.keyframes.pulse}

  /* Animation Utility Classes */
  .theme-transition {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive Font Sizing */
  @media (max-width: ${theme.breakpoints.tablet}) {
    html {
      font-size: 15px;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }

  /* Accessibility: Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Print Styles */
  @media print {
    body {
      background-color: white;
      color: black;
    }
    a {
      text-decoration: underline;
    }
  }

  /* Accessibility: skip-to-content link */
  .skip-to-content {
    position: absolute;
    top: -100px;
    left: 16px;
    background: ${theme.colors.secondary};
    color: #FFFFFF;
    padding: 12px 24px;
    z-index: var(--z-max, 9999);
    border-radius: 0 0 8px 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: top 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .skip-to-content:focus,
  .skip-to-content:focus-visible {
    top: 0;
    outline: 3px solid ${theme.colors.a11y.focusRing};
    outline-offset: 2px;
  }
`;
