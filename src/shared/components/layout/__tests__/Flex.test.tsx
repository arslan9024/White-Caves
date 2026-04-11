/**
 * @file Flex.test.tsx
 * @description Comprehensive tests for Flex layout component
 * Tests: rendering, direction, alignment, gap, wrap, polymorphic, memo, children
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import Flex from '../Flex';

// Minimal theme to satisfy styled-components
const theme = {
  colors: { background: '#fff', text: '#000', border: '#ccc', primary: '#007bff' },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem' },
} as any;

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Flex', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Basic Rendering ────────────────────────────────────
  describe('Rendering', () => {
    it('renders children', () => {
      renderWithTheme(<Flex><span>Child</span></Flex>);
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithTheme(
        <Flex>
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </Flex>
      );
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('renders with no children', () => {
      const { container } = renderWithTheme(<Flex />);
      expect(container.firstChild).toBeTruthy();
    });

    it('renders a div by default', () => {
      const { container } = renderWithTheme(<Flex>content</Flex>);
      expect(container.firstChild!.nodeName).toBe('DIV');
    });

    it('has displayName "Flex"', () => {
      expect(Flex.displayName).toBe('Flex');
    });
  });

  // ── Polymorphic (as prop) ──────────────────────────────
  describe('Polymorphic', () => {
    it('renders as section when as="section"', () => {
      const { container } = renderWithTheme(<Flex as="section">content</Flex>);
      expect(container.firstChild!.nodeName).toBe('SECTION');
    });

    it('renders as nav when as="nav"', () => {
      const { container } = renderWithTheme(<Flex as="nav">content</Flex>);
      expect(container.firstChild!.nodeName).toBe('NAV');
    });

    it('renders as ul when as="ul"', () => {
      const { container } = renderWithTheme(<Flex as="ul"><li>item</li></Flex>);
      expect(container.firstChild!.nodeName).toBe('UL');
    });
  });

  // ── Direction ──────────────────────────────────────────
  describe('Direction', () => {
    it('defaults to row direction', () => {
      const { container } = renderWithTheme(<Flex>test</Flex>);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveStyle({ flexDirection: 'row' });
    });

    it('applies column direction', () => {
      const { container } = renderWithTheme(<Flex direction="column">test</Flex>);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveStyle({ flexDirection: 'column' });
    });

    it('applies row-reverse direction', () => {
      const { container } = renderWithTheme(<Flex direction="row-reverse">test</Flex>);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveStyle({ flexDirection: 'row-reverse' });
    });

    it('applies column-reverse direction', () => {
      const { container } = renderWithTheme(<Flex direction="column-reverse">test</Flex>);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveStyle({ flexDirection: 'column-reverse' });
    });
  });

  // ── Justify Content ────────────────────────────────────
  describe('Justify', () => {
    it('applies center justify', () => {
      const { container } = renderWithTheme(<Flex justify="center">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ justifyContent: 'center' });
    });

    it('applies space-between justify', () => {
      const { container } = renderWithTheme(<Flex justify="space-between">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ justifyContent: 'space-between' });
    });

    it('applies space-around justify', () => {
      const { container } = renderWithTheme(<Flex justify="space-around">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ justifyContent: 'space-around' });
    });
  });

  // ── Align Items ────────────────────────────────────────
  describe('Align', () => {
    it('applies center alignment', () => {
      const { container } = renderWithTheme(<Flex align="center">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ alignItems: 'center' });
    });

    it('applies flex-end alignment', () => {
      const { container } = renderWithTheme(<Flex align="flex-end">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ alignItems: 'flex-end' });
    });

    it('applies baseline alignment', () => {
      const { container } = renderWithTheme(<Flex align="baseline">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ alignItems: 'baseline' });
    });
  });

  // ── Wrap ───────────────────────────────────────────────
  describe('Wrap', () => {
    it('defaults to nowrap', () => {
      const { container } = renderWithTheme(<Flex>test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexWrap: 'nowrap' });
    });

    it('applies wrap', () => {
      const { container } = renderWithTheme(<Flex wrap="wrap">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexWrap: 'wrap' });
    });

    it('applies wrap-reverse', () => {
      const { container } = renderWithTheme(<Flex wrap="wrap-reverse">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexWrap: 'wrap-reverse' });
    });
  });

  // ── Gap ────────────────────────────────────────────────
  describe('Gap', () => {
    it('applies none gap', () => {
      const { container } = renderWithTheme(<Flex gap="none">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '0' });
    });

    it('applies small gap', () => {
      const { container } = renderWithTheme(<Flex gap="small">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '0.5rem' });
    });

    it('applies large gap', () => {
      const { container } = renderWithTheme(<Flex gap="large">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ gap: '1.5rem' });
    });
  });

  // ── Flex Properties ────────────────────────────────────
  describe('Flex Properties', () => {
    it('applies flex shorthand', () => {
      const { container } = renderWithTheme(<Flex flex="1 1 auto">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flex: '1 1 auto' });
    });

    it('applies flex-grow', () => {
      const { container } = renderWithTheme(<Flex grow={2}>test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexGrow: '2' });
    });

    it('applies flex-shrink', () => {
      const { container } = renderWithTheme(<Flex shrink={1}>test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexShrink: '1' });
    });

    it('applies flex-basis', () => {
      const { container } = renderWithTheme(<Flex basis="50%">test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ flexBasis: '50%' });
    });
  });

  // ── Inline ─────────────────────────────────────────────
  describe('Inline', () => {
    it('is flex by default', () => {
      const { container } = renderWithTheme(<Flex>test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ display: 'flex' });
    });

    it('is inline-flex when inline is true', () => {
      const { container } = renderWithTheme(<Flex inline>test</Flex>);
      expect(container.firstChild as HTMLElement).toHaveStyle({ display: 'inline-flex' });
    });
  });

  // ── HTML Attributes ────────────────────────────────────
  describe('HTML Attributes', () => {
    it('passes data attributes', () => {
      renderWithTheme(<Flex data-testid="my-flex">test</Flex>);
      expect(screen.getByTestId('my-flex')).toBeInTheDocument();
    });

    it('passes className', () => {
      const { container } = renderWithTheme(<Flex className="extra">test</Flex>);
      expect(container.firstChild).toHaveClass('extra');
    });

    it('passes aria attributes', () => {
      renderWithTheme(<Flex role="navigation" aria-label="Main">test</Flex>);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main');
    });

    it('passes onClick handler', () => {
      const onClick = vi.fn();
      renderWithTheme(<Flex onClick={onClick}>test</Flex>);
      screen.getByText('test').click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
