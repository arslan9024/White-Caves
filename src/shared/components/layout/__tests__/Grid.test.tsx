/**
 * @file Grid.test.tsx
 * @description Comprehensive tests for Grid layout component
 * Tests: rendering, columns, gap, alignment, responsive defaults, memo, children
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import Grid from '../Grid';

const theme = {
  colors: { background: '#fff', text: '#000', border: '#ccc', primary: '#007bff' },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem' },
};

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Grid', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Basic Rendering ────────────────────────────────────
  describe('Rendering', () => {
    it('renders children', () => {
      renderWithTheme(<Grid><div>Item 1</div></Grid>);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithTheme(
        <Grid>
          <div>A</div>
          <div>B</div>
          <div>C</div>
        </Grid>
      );
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('renders with no children', () => {
      const { container } = renderWithTheme(<Grid />);
      expect(container.firstChild).toBeTruthy();
    });

    it('renders a div element', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild!.nodeName).toBe('DIV');
    });

    it('has displayName "Grid"', () => {
      expect(Grid.displayName).toBe('Grid');
    });
  });

  // ── Grid Display ───────────────────────────────────────
  describe('Display', () => {
    it('uses CSS grid display', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ display: 'grid' });
    });

    it('has 100% width', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ width: '100%' });
    });
  });

  // ── Gap ────────────────────────────────────────────────
  describe('Gap', () => {
    it('applies none gap', () => {
      const { container } = renderWithTheme(<Grid gap="none">test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '0' });
    });

    it('applies small gap', () => {
      const { container } = renderWithTheme(<Grid gap="small">test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '0.75rem' });
    });

    it('applies medium gap (default)', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '1.25rem' });
    });

    it('applies large gap', () => {
      const { container } = renderWithTheme(<Grid gap="large">test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '2rem' });
    });
  });

  // ── Alignment ──────────────────────────────────────────
  describe('Alignment', () => {
    it('defaults alignItems to stretch', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ alignItems: 'stretch' });
    });

    it('applies custom alignItems', () => {
      const { container } = renderWithTheme(<Grid alignItems="center">test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ alignItems: 'center' });
    });

    it('defaults justifyItems to stretch', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ justifyItems: 'stretch' });
    });

    it('applies custom justifyItems', () => {
      const { container } = renderWithTheme(<Grid justifyItems="center">test</Grid>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ justifyItems: 'center' });
    });
  });

  // ── Columns ────────────────────────────────────────────
  describe('Columns', () => {
    it('accepts custom column config', () => {
      const { container } = renderWithTheme(
        <Grid columns={{ mobile: 2, tablet: 3, desktop: 4 }}>test</Grid>
      );
      // In jsdom we can't test media queries, but the component renders
      expect(container.firstChild).toBeTruthy();
    });

    it('renders with default columns when not specified', () => {
      const { container } = renderWithTheme(<Grid>test</Grid>);
      expect(container.firstChild).toBeTruthy();
    });

    it('handles partial column config', () => {
      const { container } = renderWithTheme(
        <Grid columns={{ mobile: 1 }}>test</Grid>
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  // ── HTML Attributes ────────────────────────────────────
  describe('HTML Attributes', () => {
    it('passes data-testid', () => {
      renderWithTheme(<Grid data-testid="my-grid">test</Grid>);
      expect(screen.getByTestId('my-grid')).toBeInTheDocument();
    });

    it('passes className', () => {
      const { container } = renderWithTheme(<Grid className="custom">test</Grid>);
      expect(container.firstChild).toHaveClass('custom');
    });

    it('passes aria attributes', () => {
      renderWithTheme(<Grid role="list" aria-label="Items">test</Grid>);
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Items');
    });

    it('passes id', () => {
      const { container } = renderWithTheme(<Grid id="grid-1">test</Grid>);
      expect(container.firstChild).toHaveAttribute('id', 'grid-1');
    });

    it('passes style overrides', () => {
      const { container } = renderWithTheme(
        <Grid style={{ border: '1px solid red' }}>test</Grid>
      );
      expect(container.firstChild as HTMLElement).toHaveStyle({ border: '1px solid red' });
    });
  });

  // ── Memo Behavior ──────────────────────────────────────
  describe('Memo', () => {
    it('is wrapped in React.memo', () => {
      // React.memo wraps the component — Grid.$$typeof exists
      expect(typeof Grid).toBe('object');
    });
  });
});
