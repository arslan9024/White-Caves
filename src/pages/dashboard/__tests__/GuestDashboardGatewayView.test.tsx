// FILE: src/pages/dashboard/__tests__/GuestDashboardGatewayView.test.tsx
/**
 * White Caves Real Estate LLC - GuestDashboardGatewayView Vitest Suite
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { GuestDashboardGatewayView } from '../GuestDashboardGatewayView';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../../context/UserRoleContext';

describe('GuestDashboardGatewayView Suite', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders gateway hero title and warning banner for guest session', () => {
    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <GuestDashboardGatewayView />
      </UserRoleProvider>
    );

    expect(screen.getByTestId('guest-dashboard-gateway')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to White Caves Real Estate/i)).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Identity Gateway • Role Verification/i)).toBeInTheDocument();
  });

  it('renders all four sovereign portal entry cards', () => {
    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <GuestDashboardGatewayView />
      </UserRoleProvider>
    );

    expect(screen.getByTestId('gateway-channel-landlord')).toBeInTheDocument();
    expect(screen.getByTestId('gateway-channel-tenant')).toBeInTheDocument();
    expect(screen.getByTestId('gateway-channel-broker')).toBeInTheDocument();
    expect(screen.getByTestId('gateway-channel-founder')).toBeInTheDocument();
  });

  it('confirms role and navigates when clicking Enter as Landlord', () => {
    const handleNavigate = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <GuestDashboardGatewayView onNavigate={handleNavigate} />
      </UserRoleProvider>
    );

    const landlordBtn = screen.getByTestId('enter-landlord-btn');
    fireEvent.click(landlordBtn);

    expect(handleNavigate).toHaveBeenCalledWith('/dashboard/landlord');
  });

  it('confirms role and navigates when clicking Enter as Tenant', () => {
    const handleNavigate = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <GuestDashboardGatewayView onNavigate={handleNavigate} />
      </UserRoleProvider>
    );

    const tenantBtn = screen.getByTestId('enter-tenant-btn');
    fireEvent.click(tenantBtn);

    expect(handleNavigate).toHaveBeenCalledWith('/dashboard/tenant');
  });

  it('triggers onOpenRoleModal when clicking verify role button', () => {
    const handleOpenRoleModal = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <GuestDashboardGatewayView onOpenRoleModal={handleOpenRoleModal} />
      </UserRoleProvider>
    );

    const verifyBtn = screen.getByTestId('gateway-verify-role-btn');
    fireEvent.click(verifyBtn);

    expect(handleOpenRoleModal).toHaveBeenCalledTimes(1);
  });
});
