import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  /* ============================================
     BROWSER RESET & NORMALIZATION
     ============================================ */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    min-height: 100vh;
    line-height: 1.5;
    font-family: ${theme.typography.fontFamily.primary};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.primary};
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  }

  ul,
  ol {
    list-style: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.2;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  /* ============================================
     INTERACTIVE ELEMENTS FOCUS STYLES
     ============================================ */
  button,
  a,
  input,
  textarea,
  select {
    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
      border-radius: ${theme.spacing.xs};
    }
  }

  /* ============================================
     SCROLLBAR STYLING
     ============================================ */
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
    transition: background 0.2s ease;

    &:hover {
      background: ${theme.colors.text.secondary};
    }
  }

  /* ============================================
     ANIMATIONS
     ============================================ */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes themeChange {
    0% {
      opacity: 0.7;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* ============================================
     UTILITY CLASSES (LEGACY SUPPORT)
     ============================================ */
  .theme-transition {
    animation: themeChange 0.4s ease-in-out;
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

  /* ============================================
     RESPONSIVE DESIGN UTILITIES
     ============================================ */
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

  /* ============================================
     ACCESSIBILITY
     ============================================ */
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

  @media (prefers-color-scheme: dark) {
    body {
      background-color: ${theme.colors.background.primary};
      color: ${theme.colors.text.primary};
    }
  }

  /* ============================================
     PRINT STYLES
     ============================================ */
  @media print {
    body {
      background-color: white;
      color: black;
    }

    a {
      text-decoration: underline;
    }
  }
`;

export default GlobalStyle;
