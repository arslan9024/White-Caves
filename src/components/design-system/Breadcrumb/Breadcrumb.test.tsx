/**
 * Breadcrumb — Unit Tests
 * Tests: rendering, navigation, separators, active state, accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

// ── Helpers ───────────────────────────────────────────────────────────────

const defaultItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Villa 42', active: true },
];

// ── Tests ─────────────────────────────────────────────────────────────────

describe('Breadcrumb', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={defaultItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Villa 42')).toBeInTheDocument();
  });

  it('renders the container with aria-label="Breadcrumb"', () => {
    render(<Breadcrumb items={defaultItems} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('renders breadcrumb items inside an ordered list', () => {
    render(<Breadcrumb items={defaultItems} />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll('li')).toHaveLength(3);
  });

  // ── Separators ────────────────────────────────────────────────────────

  it('renders / separators between items by default', () => {
    render(<Breadcrumb items={defaultItems} />);
    const seps = screen.getAllByText('/');
    expect(seps).toHaveLength(2); // between 3 items
  });

  it('uses custom separator when provided', () => {
    render(<Breadcrumb items={defaultItems} separator="›" />);
    const seps = screen.getAllByText('›');
    expect(seps).toHaveLength(2);
  });

  it('does not render separator after last item', () => {
    render(<Breadcrumb items={[{ label: 'Only One' }]} />);
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  // ── Active state ──────────────────────────────────────────────────────

  it('marks active item with aria-current="page"', () => {
    render(<Breadcrumb items={defaultItems} />);
    const active = screen.getByText('Villa 42');
    expect(active).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current on non-active items', () => {
    render(<Breadcrumb items={defaultItems} />);
    const home = screen.getByText('Home');
    expect(home).not.toHaveAttribute('aria-current');
  });

  // ── Navigation ────────────────────────────────────────────────────────

  it('renders href when provided', () => {
    render(<Breadcrumb items={defaultItems} />);
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('calls onClick handler when item is clicked', () => {
    const handleClick = vi.fn();
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', onClick: handleClick },
      { label: 'Current', active: true },
    ];
    render(<Breadcrumb items={items} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents default when no href is set', () => {
    const items: BreadcrumbItem[] = [
      { label: 'No Link' },
      { label: 'Current', active: true },
    ];
    render(<Breadcrumb items={items} />);
    const link = screen.getByText('No Link');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const prevented = !link.dispatchEvent(event);
    expect(prevented).toBe(true);
  });

  // ── className ─────────────────────────────────────────────────────────

  it('passes className to the container', () => {
    const { container } = render(<Breadcrumb items={defaultItems} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  it('handles empty items array', () => {
    render(<Breadcrumb items={[]} />);
    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  it('renders single item without separator', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  it('has displayName set to Breadcrumb', () => {
    expect(Breadcrumb.displayName).toBe('Breadcrumb');
  });
});
