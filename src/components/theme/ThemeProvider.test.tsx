import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme, LuxuryTokens } from './ThemeProvider';

const TestComponent = () => {
  const theme = useTheme();
  return <div data-testid="theme-test">{theme.colors.goldFoil}</div>;
};

describe('ThemeProvider', () => {
  it('provides LuxuryTokens through useTheme hook', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const el = screen.getByTestId('theme-test');
    expect(el.textContent).toBe(LuxuryTokens.colors.goldFoil);
  });
});
