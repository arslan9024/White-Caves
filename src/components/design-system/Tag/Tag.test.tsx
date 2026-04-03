import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Tag } from './Tag';

describe('Tag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders label text', () => {
      render(<Tag label="JavaScript" />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('renders as inline element (span)', () => {
      render(<Tag label="React" />);
      const el = screen.getByText('React');
      expect(el.tagName.toLowerCase()).toBe('span');
    });

    it('renders with custom className', () => {
      render(<Tag label="Tag" className="custom-tag" />);
      expect(screen.getByText('Tag')).toHaveClass('custom-tag');
    });
  });

  // === VARIANTS ===
  describe('variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'error'] as const;
    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Tag label={variant} variant={variant} />);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });
    });

    it('defaults to primary variant', () => {
      render(<Tag label="Default" />);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });
  });

  // === SIZES ===
  describe('sizes', () => {
    it('renders sm size', () => {
      render(<Tag label="Small" size="sm" />);
      expect(screen.getByText('Small')).toBeInTheDocument();
    });

    it('renders md size', () => {
      render(<Tag label="Medium" size="md" />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('defaults to md size', () => {
      render(<Tag label="Default" />);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });
  });

  // === REMOVABLE ===
  describe('removable', () => {
    it('does not show remove button by default', () => {
      render(<Tag label="Fixed" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows remove button when removable', () => {
      render(<Tag label="Removable" removable />);
      expect(screen.getByRole('button', { name: /remove removable/i })).toBeInTheDocument();
    });

    it('calls onRemove when remove button clicked', () => {
      const onRemove = vi.fn();
      render(<Tag label="Test" removable onRemove={onRemove} />);
      fireEvent.click(screen.getByRole('button', { name: /remove test/i }));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('has accessible label on remove button', () => {
      render(<Tag label="TypeScript" removable />);
      expect(screen.getByLabelText('Remove TypeScript')).toBeInTheDocument();
    });
  });

  // === DISPLAY NAME ===
  it('has correct displayName', () => {
    expect(Tag.displayName).toBe('Tag');
  });
});
