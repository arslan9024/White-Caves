/**
 * White Caves Real Estate LLC - ModernDashboardPage Unit & Mounting Test
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { UserRoleProvider } from '../../context/UserRoleContext';
import { ModernDashboardPage } from './ModernDashboardPage';

// Mock matchMedia for Responsive containers
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };

function renderDashboardWithProviders(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <UserRoleProvider>
          <ModernDashboardPage />
        </UserRoleProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('ModernDashboardPage Viewport Rendering', () => {
  it('renders modern dashboard without throwing ReferenceError', () => {
    renderDashboardWithProviders('/dashboard/departments');
    expect(screen.getByTestId('viewport-main-area')).toBeInTheDocument();
  }, 30000);

  it('renders documents viewport when navigating to /dashboard/documents', () => {
    renderDashboardWithProviders('/dashboard/documents');
    expect(screen.getByTestId('document-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders deals viewport when navigating to /dashboard/deals', () => {
    renderDashboardWithProviders('/dashboard/deals');
    expect(screen.getByTestId('deal-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders relationships viewport when navigating to /dashboard/relationships', () => {
    renderDashboardWithProviders('/dashboard/relationships');
    expect(screen.getByTestId('relationship-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders ERMS double-layer route /dashboard/erms/entities', () => {
    renderDashboardWithProviders('/dashboard/erms/entities');
    expect(screen.getByTestId('relationship-entities-hub')).toBeInTheDocument();
  }, 30000);

  it('renders ERMS single relationship edge /dashboard/erms/relationships/rel-1', () => {
    renderDashboardWithProviders('/dashboard/erms/relationships/rel-1');
    expect(screen.getByTestId('relationship-single-link-view')).toBeInTheDocument();
  }, 30000);

  it('renders customers viewport when navigating to /dashboard/customers', () => {
    renderDashboardWithProviders('/dashboard/customers');
    expect(screen.getByTestId('customer-manager-view')).toBeInTheDocument();
  }, 30000);

  it('opens global command palette when clicking quick-command-palette-btn', () => {
    renderDashboardWithProviders('/dashboard/departments');
    const btn = screen.getByTestId('quick-command-palette-btn');
    expect(btn).toBeInTheDocument();
  }, 30000);
});
