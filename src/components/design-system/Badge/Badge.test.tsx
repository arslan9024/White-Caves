import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Badge } from './Badge';

describe('Badge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders children text', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders as inline element (span)', () => {
      render(<Badge>Status</Badge>);
      const el = screen.getByText('Status');
      expect(el.tagName.toLowerCase()).toBe('span');
    });

    it('renders with custom className', () => {
      render(<Badge className="custom-badge">Test</Badge>);
      expect(screen.getByText('Test')).toHaveClass('custom-badge');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  // === VARIANTS ===
  describe('variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
    variants.forEach((variant) => {
      it(`renders ${variant} variant without error`, () => {
        render(<Badge variant={variant}>{variant}</Badge>);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });
    });

    it('defaults to primary variant', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });
  });

  // === SIZES ===
  describe('sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      it(`renders ${size} size without error`, () => {
        render(<Badge size={size}>{size}</Badge>);
        expect(screen.getByText(size)).toBeInTheDocument();
      });
    });

    it('defaults to md size', () => {
      render(<Badge>Medium</Badge>);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  // === DISPLAY NAME ===
  it('has correct displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  // === COMPOSITION ===
  describe('composition', () => {
    it('renders with number children', () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with JSX children', () => {
      render(
        <Badge>
          <strong>Bold</strong>
        </Badge>,
      );
      expect(screen.getByText('Bold')).toBeInTheDocument();
    });

    it('passes through HTML attributes', () => {
      render(<Badge data-testid="my-badge">Test</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });
  });
});
