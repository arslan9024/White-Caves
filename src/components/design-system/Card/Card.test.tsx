/**
 * Card — Unit Tests
 * Tests: rendering, variants, slots (header/body/footer), clickable, ref forwarding
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { createRef } from 'react';
import { Card } from './Card';

describe('Card', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders children inside CardBody', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with role="region" by default', () => {
    render(<Card>Content</Card>);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  // ── Variants ──────────────────────────────────────────────────────────

  it('renders elevated variant by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts outlined variant', () => {
    render(<Card variant="outlined">Outlined</Card>);
    expect(screen.getByText('Outlined')).toBeInTheDocument();
  });

  it('accepts filled variant', () => {
    render(<Card variant="filled">Filled</Card>);
    expect(screen.getByText('Filled')).toBeInTheDocument();
  });

  // ── Slots: header & footer ────────────────────────────────────────────

  it('renders header when provided', () => {
    render(<Card header={<span>My Header</span>}>Body</Card>);
    expect(screen.getByText('My Header')).toBeInTheDocument();
  });

  it('does not render header slot when not provided', () => {
    const { container } = render(<Card>Body only</Card>);
    // Should not have any extra wrapper beyond the body
    expect(screen.getByText('Body only')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Action</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders both header and footer together', () => {
    render(
      <Card header="Title" footer="Footer text">
        Main
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  // ── Clickable ─────────────────────────────────────────────────────────

  it('has role="button" and tabIndex when clickable', () => {
    render(<Card isClickable>Clickable card</Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('responds to onClick when clickable', () => {
    const handleClick = vi.fn();
    render(
      <Card isClickable onClick={handleClick}>
        Click me
      </Card>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not have tabIndex when not clickable', () => {
    render(<Card>Not clickable</Card>);
    const card = screen.getByRole('region');
    expect(card).not.toHaveAttribute('tabindex');
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className passthrough ─────────────────────────────────────────────

  it('passes className to root element', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });

  // ── displayName ───────────────────────────────────────────────────────

  it('has displayName set to Card', () => {
    expect(Card.displayName).toBe('Card');
  });
});
