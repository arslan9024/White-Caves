/**
 * Global Styles
 * Base styles, resets, and utilities for the entire application
 */

import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
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
  }

  body {
    margin: 0;
    padding: 0;
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
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.color};

    &:hover {
      color: ${theme.colors.primaryDark};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
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

    &:focus {
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

    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
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
`;
