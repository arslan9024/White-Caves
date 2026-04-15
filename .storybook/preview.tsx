import type { Preview } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '../src/styles/theme';

/**
 * Global styles for Storybook — mirrors the app's global CSS
 */
const StorybookGlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

/**
 * Minimal Redux store for Storybook — add slices as needed
 */
const mockStore = configureStore({
  reducer: {
    // Add required slice reducers here as components need them
    _placeholder: (state = {}) => state,
  },
});

/**
 * Storybook preview configuration
 */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: theme.colors.background.primary },
        { name: 'dark', value: '#1a1a2e' },
        { name: 'card', value: theme.colors.background.secondary },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
        wide: { name: 'Wide', styles: { width: '1920px', height: '1080px' } },
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <StorybookGlobalStyle />
          <Story />
        </ThemeProvider>
      </Provider>
    ),
  ],
};

export default preview;
