/**
 * Breadcrumb.test.tsx — Smoke tests for Breadcrumb navigation component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Breadcrumb from './Breadcrumb';

/**
 * Helper: render Breadcrumb at a given route.
 */
function renderAtRoute(route: string, props: { showHome?: boolean; customItems?: any[] } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Breadcrumb {...props} />
    </MemoryRouter>,
  );
}

describe('Breadcrumb', () => {
  it('renders nothing on homepage (/)', () => {
    const { container } = renderAtRoute('/');
    expect(container.querySelector('nav')).toBeNull();
  });

  it('renders Home link by default', () => {
    renderAtRoute('/properties');
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renders current page as non-link', () => {
    renderAtRoute('/properties');
    const current = screen.getByText('Properties');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('renders breadcrumb trail for nested route', () => {
    renderAtRoute('/buyer/mortgage-calculator');
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Buyer')).toBeTruthy();
    expect(screen.getByText('Mortgage Calculator')).toBeTruthy();
  });

  it('renders separator characters between items', () => {
    renderAtRoute('/buyer/dld-fees');
    // Home / Buyer / DLD Fee Calculator = separators are "/" characters
    const slashes = screen.getAllByText('/');
    expect(slashes.length).toBeGreaterThanOrEqual(2);
  });

  it('hides Home link when showHome=false', () => {
    renderAtRoute('/about', { showHome: false });
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.getByText('About')).toBeTruthy();
  });

  it('uses customItems when provided', () => {
    const customItems = [
      { path: '/custom', label: 'Custom', isLast: false },
      { path: '/custom/page', label: 'My Page', isLast: true },
    ];
    renderAtRoute('/custom/page', { customItems });
    expect(screen.getByText('Custom')).toBeTruthy();
    expect(screen.getByText('My Page')).toBeTruthy();
  });

  it('renders aria-label on nav element', () => {
    renderAtRoute('/services');
    const nav = screen.getByLabelText('Breadcrumb');
    expect(nav).toBeTruthy();
  });

  it('maps known route segments to labels', () => {
    renderAtRoute('/owner/system-health');
    expect(screen.getByText('Owner')).toBeTruthy();
    expect(screen.getByText('System Health')).toBeTruthy();
  });

  it('formats unknown segments as title case', () => {
    renderAtRoute('/some-custom-path');
    expect(screen.getByText('Some Custom Path')).toBeTruthy();
  });
});
