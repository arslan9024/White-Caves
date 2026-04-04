/**
 * Spinner — Unit Tests
 * Tests: rendering, sizes, variants, label accessibility, ref forwarding
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders with role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Loading..."', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('accepts custom label for accessibility', () => {
    render(<Spinner label="Fetching data…" />);
    expect(screen.getByLabelText('Fetching data…')).toBeInTheDocument();
  });

  // ── Size variants ─────────────────────────────────────────────────────

  it('renders small size', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders medium size (default)', () => {
    render(<Spinner size="md" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders large size', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // ── Color variants ────────────────────────────────────────────────────

  it('renders primary variant (default)', () => {
    render(<Spinner variant="primary" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders secondary variant', () => {
    render(<Spinner variant="secondary" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders light variant', () => {
    render(<Spinner variant="light" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className ─────────────────────────────────────────────────────────

  it('passes className to the root element', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    expect(container.firstChild).toHaveClass('custom-spinner');
  });

  // ── displayName ───────────────────────────────────────────────────────

  it('has displayName set to Spinner', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });
});
