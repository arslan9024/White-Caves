/**
 * Global Styles
 * Base styles, resets, and utilities for the entire application
 */

import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const themeColors = theme.colors as Record<string, unknown>;
const borderColor = String(themeColors.borderColor ?? themeColors.border ?? '#E5E7EB');
const borderDark = String(themeColors.borderDark ?? borderColor);
const borderLight = String(themeColors.borderLight ?? borderColor);

const primaryDark = (theme.colors as { primaryDark?: string }).primaryDark ?? theme.colors.primary;
const primaryLight = (theme.colors as { primaryLight?: string }).primaryLight ?? '#FCE4E6';
const primaryVeryLight =
  (theme.colors as { primaryVeryLight?: string }).primaryVeryLight ?? '#FFF5F5';
const secondaryDark =
  (theme.colors as { secondaryDark?: string }).secondaryDark ?? theme.colors.secondary;

const a11yColors = (
  theme.colors as {
    a11y?: {
      goldText?: string;
      goldLargeText?: string;
      goldUI?: string;
      focusRing?: string;
      errorText?: string;
      warningText?: string;
    };
  }
).a11y;

const a11yFocusRing = a11yColors?.focusRing ?? theme.colors.focus ?? theme.colors.info;
const a11yGoldText = a11yColors?.goldText ?? '#8A6A1D';
const a11yGoldLargeText = a11yColors?.goldLargeText ?? '#A07822';
const a11yGoldUI = a11yColors?.goldUI ?? theme.colors.primary;
const a11yErrorText = a11yColors?.errorText ?? theme.colors.error;
const a11yWarningText = a11yColors?.warningText ?? theme.colors.warning;

const fontHeading =
  (theme.typography as { fontFamily?: { heading?: string } }).fontFamily?.heading ??
  'Inter, system-ui, -apple-system, sans-serif';
const fontBody =
  (theme.typography as { fontFamily?: { primary?: string } }).fontFamily?.primary ??
  'Inter, system-ui, -apple-system, sans-serif';

const bodyStyle = (theme.typography as { body?: { size?: string; lineHeight?: string | number } })
  .body;
const h1Style = (theme.typography as { h1?: { size?: string; lineHeight?: string | number } }).h1;
const h2Style = (theme.typography as { h2?: { size?: string; lineHeight?: string | number } }).h2;
const h3Style = (theme.typography as { h3?: { size?: string; lineHeight?: string | number } }).h3;
const h4Style = (theme.typography as { h4?: { size?: string; lineHeight?: string | number } }).h4;
const h5Style = (theme.typography as { h5?: { size?: string; lineHeight?: string | number } }).h5;

const radius = theme.borderRadius;
const spacingSm = theme.spacing[2];
const spacingMd = theme.spacing[4];
const spacingXs = theme.spacing[1];

const transitionFast = theme.transitions.fast;
const transitionStandard = theme.transitions.standard;
const transitionSlow = theme.transitions.slow;
const transitionAll = transitionStandard;
const transitionColor = transitionStandard;
const transitionBackground = transitionStandard;

const focusShadow = `0 0 0 3px ${a11yFocusRing}33`;

export const GlobalStyles = createGlobalStyle`
  /* ═══ CSS Variables Bridge ═══════════════════════════════════
     Maps JS design tokens → CSS custom properties so .css files
     (homepage, auth, etc.) can consume the same palette.
     ─────────────────────────────────────────────────────────── */
  :root {
    /* Brand */
    --primary-color: ${theme.colors.primary};
    --primary-dark: ${primaryDark};
    --primary-light: ${primaryLight};
    --primary-very-light: ${primaryVeryLight};
    --accent-gold: ${theme.colors.primary};
    --secondary-color: ${theme.colors.secondary};
    --secondary-dark: ${secondaryDark};

    /* Backgrounds */
    --bg-primary: ${theme.colors.background.primary};
    --bg-secondary: ${theme.colors.background.secondary};
    --bg-tertiary: ${theme.colors.background.tertiary};

    /* Text */
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.tertiary};

    /* Borders */
    --border-color: ${borderColor};
    --border-light: ${borderLight};

    /* Typography */
    --font-heading: ${fontHeading};
    --font-body: ${fontBody};

    /* Radius */
    --radius-xs: ${radius.xs};
    --radius-sm: ${radius.sm};
    --radius-md: ${radius.md};
    --radius-lg: ${radius.lg};
    --radius-xl: ${radius.xl};
    --radius-xxl: ${radius.xl};
    --radius-full: ${radius.full};

    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};

    /* Transitions */
    --transition-fast: ${transitionFast};
    --transition-normal: ${transitionStandard};
    --transition-slow: ${transitionSlow};

    /* Semantic */
    --success-color: ${theme.colors.success};
    --error-color: ${theme.colors.error};
    --warning-color: ${theme.colors.warning};
    --info-color: ${theme.colors.info};

    /* WCAG AA Contrast-Safe Variants */
    --a11y-gold-text: ${a11yGoldText};
    --a11y-gold-large: ${a11yGoldLargeText};
    --a11y-gold-ui: ${a11yGoldUI};
    --a11y-focus-ring: ${a11yFocusRing};
    --a11y-error-text: ${a11yErrorText};
    --a11y-warning-text: ${a11yWarningText};

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

  /* ── Global focus ring (WCAG 2.1 AA — Emerald Green 2px) ─────── */
  :focus-visible {
    outline: 2px solid #10B981;
    outline-offset: 2px;
  }
  :focus:not(:focus-visible) {
    outline: none;
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
    font-family: ${fontBody};
    font-size: ${bodyStyle?.size ?? '14px'};
    line-height: ${bodyStyle?.lineHeight ?? 1.6};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
    transition: ${transitionBackground};
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
    font-size: ${h1Style?.size ?? '2rem'};
    line-height: ${h1Style?.lineHeight ?? 1.2};
  }

  h2 {
    font-size: ${h2Style?.size ?? '1.75rem'};
    line-height: ${h2Style?.lineHeight ?? 1.3};
  }

  h3 {
    font-size: ${h3Style?.size ?? '1.5rem'};
    line-height: ${h3Style?.lineHeight ?? 1.35};
  }

  h4 {
    font-size: ${h4Style?.size ?? '1.25rem'};
    line-height: ${h4Style?.lineHeight ?? 1.4};
  }

  h5 {
    font-size: ${h5Style?.size ?? '1.1rem'};
    line-height: ${h5Style?.lineHeight ?? 1.45};
  }

  h6 {
    font-size: ${bodyStyle?.size ?? '1rem'};
    line-height: ${bodyStyle?.lineHeight ?? 1.5};
  }

  p {
    margin: 0;
    overflow-wrap: break-word;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${transitionColor};

    &:hover {
      color: ${theme.colors.primaryDark};
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 3px solid ${a11yFocusRing};
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
    padding: ${spacingSm};
    border: 1px solid ${borderColor};
    border-radius: ${spacingXs};
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    transition: ${transitionColor};

    &:hover {
      border-color: ${borderDark};
    }

    &:focus-visible {
      outline: 3px solid ${a11yFocusRing};
      outline-offset: 2px;
      border-color: ${a11yGoldUI};
      box-shadow: none;
    }

    &:focus:not(:focus-visible) {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: ${focusShadow};
    }

    &:disabled {
      background-color: ${theme.colors.background.tertiary};
      color: ${theme.colors.disabled};
      cursor: not-allowed;
    }

    &::placeholder {
      color: ${theme.colors.text.tertiary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    transition: ${transitionAll};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:focus-visible {
      outline: 3px solid ${a11yFocusRing};
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
    padding: ${spacingMd};
    text-align: left;
    border-bottom: 1px solid ${borderColor};
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
    background: ${borderColor};
    border-radius: 4px;

    &:hover {
      background: ${borderDark};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${primaryLight};
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
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideOutDown {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(12px); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

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
    background: #C9A84C;
    color: #FFFFFF;
    padding: 8px 16px;
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
    outline: 3px solid ${a11yFocusRing};
    outline-offset: 2px;
  }
`;
