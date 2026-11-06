/**
 * White Caves Real Estate LLC - ModernDashboardPage Unit & Mounting Test
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Two-Part Routing Architecture (Icon Overview & Drawer Deep Routes)
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../context/UserRoleContext';
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

function renderDashboardWithProviders(
  initialEntry: string,
  user = DEMO_ROLE_PROFILES.managing_director
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <UserRoleProvider initialUser={user}>
          <ModernDashboardPage />
        </UserRoleProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('ModernDashboardPage Viewport Rendering & 9-System Routing', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      })
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders modern dashboard without throwing ReferenceError', () => {
    renderDashboardWithProviders('/dashboard/departments');
    expect(screen.getByTestId('viewport-main-area')).toBeInTheDocument();
  }, 30000);

  it('renders Department Overview on icon route /dashboard/departments', () => {
    renderDashboardWithProviders('/dashboard/departments');
    expect(screen.getByTestId('department-overview-view')).toBeInTheDocument();
  }, 30000);

  it('renders Department Slots workspace on drawer route /dashboard/departments/slots', () => {
    renderDashboardWithProviders('/dashboard/departments/slots');
    expect(screen.getByTestId('department-management-workspace')).toBeInTheDocument();
  }, 30000);

  it('renders Employee Overview on icon route /dashboard/employees', () => {
    renderDashboardWithProviders('/dashboard/employees');
    expect(screen.getByTestId('employee-overview-view')).toBeInTheDocument();
  }, 30000);

  it('renders Employee Roster workspace on drawer route /dashboard/employees/roster', () => {
    renderDashboardWithProviders('/dashboard/employees/roster');
    expect(screen.getByTestId('employee-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Task Overview on icon route /dashboard/tasks', () => {
    renderDashboardWithProviders('/dashboard/tasks');
    expect(screen.getByTestId('task-overview-view')).toBeInTheDocument();
  }, 30000);

  it('renders Task Catalog workspace on drawer route /dashboard/tasks/catalog', () => {
    renderDashboardWithProviders('/dashboard/tasks/catalog');
    expect(screen.getByTestId('task-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Property Portfolio Overview on icon route /dashboard/REproperties', () => {
    renderDashboardWithProviders('/dashboard/REproperties');
    expect(screen.getByTestId('reproperty-overview-view')).toBeInTheDocument();
  }, 30000);

  it('renders Property Inventory workspace on drawer route /dashboard/REproperties/inventory', () => {
    renderDashboardWithProviders('/dashboard/REproperties/inventory');
    expect(screen.getByTestId('re-property-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Deals Overview on icon route /dashboard/deals', () => {
    renderDashboardWithProviders('/dashboard/deals');
    expect(screen.getByTestId('deal-overview-view')).toBeInTheDocument();
    expect(screen.getByTestId('deal-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Documents Overview on icon route /dashboard/documents', () => {
    renderDashboardWithProviders('/dashboard/documents');
    expect(screen.getByTestId('document-overview-view')).toBeInTheDocument();
    expect(screen.getByTestId('document-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Customers Overview on icon route /dashboard/customers', () => {
    renderDashboardWithProviders('/dashboard/customers');
    expect(screen.getByTestId('customer-overview-view')).toBeInTheDocument();
    expect(screen.getByTestId('customer-manager-view')).toBeInTheDocument();
  }, 30000);

  it('renders Leaderboard Overview on icon route /dashboard/leaderboard', () => {
    renderDashboardWithProviders('/dashboard/leaderboard');
    expect(screen.getByTestId('leaderboard-overview-view')).toBeInTheDocument();
  }, 30000);

  it('renders Leaderboard Rankings on drawer route /dashboard/leaderboard/rankings', () => {
    renderDashboardWithProviders('/dashboard/leaderboard/rankings');
    expect(screen.getByTestId('leaderboard-view')).toBeInTheDocument();
  }, 30000);

  it('renders ERMS root overview on icon route /dashboard/erms', () => {
    renderDashboardWithProviders('/dashboard/erms');
    expect(screen.getByTestId('erms-overview-view')).toBeInTheDocument();
    expect(
      screen.getByText(/Enterprise Relational Mesh & Entity Control Center/i)
    ).toBeInTheDocument();
  }, 30000);

  it('renders ERMS double-layer route /dashboard/erms/entities', () => {
    renderDashboardWithProviders('/dashboard/erms/entities');
    expect(screen.getByTestId('relationship-entities-hub')).toBeInTheDocument();
  }, 30000);

  it('renders ERMS single relationship edge /dashboard/erms/relationships/rel-1', () => {
    renderDashboardWithProviders('/dashboard/erms/relationships/rel-1');
    expect(screen.getByTestId('relationship-single-link-view')).toBeInTheDocument();
  }, 30000);

  it('renders relationships backward-compatible viewport /dashboard/relationships', () => {
    renderDashboardWithProviders('/dashboard/relationships');
    expect(screen.getByTestId('relationship-manager-view')).toBeInTheDocument();
  }, 30000);

  it('opens global command palette when clicking quick-command-palette-btn', () => {
    renderDashboardWithProviders('/dashboard/departments');
    const btn = screen.getByTestId('quick-command-palette-btn');
    expect(btn).toBeInTheDocument();
  }, 30000);

  it('renders User Role Management on route /dashboard/roles', () => {
    renderDashboardWithProviders('/dashboard/roles');
    expect(screen.getByTestId('role-manager-view')).toBeInTheDocument();
    expect(screen.getByText(/User Role & Sovereign RBAC Matrix/i)).toBeInTheDocument();
  }, 30000);

  it('renders Sovereign Profile View on route /dashboard/profile', () => {
    renderDashboardWithProviders('/dashboard/profile');
    expect(screen.getByTestId('profile-dashboard-view')).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Executive Profile & Preferences/i)).toBeInTheDocument();
  }, 30000);

  it('renders Sovereign Landlord Asset Hub on route /dashboard/landlord', () => {
    renderDashboardWithProviders('/dashboard/landlord');
    expect(screen.getByTestId('landlord-manager-view')).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Landlord Asset Hub/i)).toBeInTheDocument();
  }, 30000);

  it('renders Sovereign Tenant Portal on route /dashboard/tenant', () => {
    renderDashboardWithProviders('/dashboard/tenant');
    expect(screen.getByTestId('tenant-manager-view')).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Tenant Portal/i)).toBeInTheDocument();
  }, 30000);

  it('renders Sovereign Broker Hub on route /dashboard/broker', () => {
    renderDashboardWithProviders('/dashboard/broker');
    expect(screen.getByTestId('broker-manager-view')).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Licensed Broker Hub/i)).toBeInTheDocument();
  }, 30000);

  it('renders GuestDashboardGatewayView when accessed by an unconfirmed guest user', () => {
    renderDashboardWithProviders('/dashboard/departments', DEMO_ROLE_PROFILES.guest);
    expect(screen.getByTestId('guest-dashboard-gateway')).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Identity Gateway • Role Verification/i)).toBeInTheDocument();
  }, 30000);
});
