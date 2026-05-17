/**
 * Skeleton — Unit Tests
 *
 * Tests the animated placeholder component for loading states and CLS prevention.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders with default variant (rect)', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('renders with custom width and height as numbers', () => {
    render(<Skeleton width={300} height={200} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('renders with CSS string dimensions', () => {
    render(<Skeleton width="100%" height="3rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '100%', height: '3rem' });
  });

  it('renders with custom border radius', () => {
    render(<Skeleton borderRadius="16px" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ borderRadius: '16px' });
  });

  // ── Variants ───────────────────────────────────────────────────

  it('renders text variant', () => {
    render(<Skeleton variant="text" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ height: '16px' });
  });

  it('renders circle variant', () => {
    render(<Skeleton variant="circle" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '48px', height: '48px', borderRadius: '50%' });
  });

  it('renders card variant', () => {
    render(<Skeleton variant="card" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ borderRadius: '12px' });
  });

  // ── Multi-line text ────────────────────────────────────────────

  it('renders multiple text lines', () => {
    render(<Skeleton variant="text" lines={3} />);
    const group = screen.getByTestId('skeleton');
    // The group should contain 3 child skeleton blocks
    expect(group.children).toHaveLength(3);
  });

  it('makes the last line shorter in multi-line mode', () => {
    render(<Skeleton variant="text" lines={3} />);
    const group = screen.getByTestId('skeleton');
    const lastLine = group.children[2] as HTMLElement;
    expect(lastLine).toHaveStyle({ width: '60%' });
  });

  // ── Accessibility ──────────────────────────────────────────────

  it('has aria-label for screen readers', () => {
    render(<Skeleton aria-label="Loading property image" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('aria-label', 'Loading property image');
  });

  it('uses default aria-label when none provided', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('aria-label', 'Loading content');
  });

  it('has role="status" for live region semantics', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('role', 'status');
  });

  // ── Custom className ───────────────────────────────────────────

  it('accepts custom className', () => {
    render(<Skeleton className="my-skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveClass('my-skeleton');
  });
});
