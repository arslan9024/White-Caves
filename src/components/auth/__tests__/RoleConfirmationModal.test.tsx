// FILE: src/components/auth/__tests__/RoleConfirmationModal.test.tsx
/**
 * White Caves Real Estate LLC - RoleConfirmationModal Vitest Unit Suite
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RoleConfirmationModal } from '../RoleConfirmationModal';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../../context/UserRoleContext';

const { mockCompleteSocialRegistration, mockFetchProfile } = vi.hoisted(() => ({
  mockCompleteSocialRegistration: vi.fn(),
  mockFetchProfile: vi.fn(),
}));

vi.mock('../../../services/authService', () => ({
  completeSocialRegistration: mockCompleteSocialRegistration,
  fetchProfile: mockFetchProfile,
}));

describe('RoleConfirmationModal Suite', () => {
  beforeEach(() => {
    mockCompleteSocialRegistration.mockReset();
    mockFetchProfile.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not render when isOpen is false', () => {
    render(
      <UserRoleProvider>
        <RoleConfirmationModal isOpen={false} onClose={vi.fn()} />
      </UserRoleProvider>
    );
    expect(screen.queryByTestId('role-confirmation-modal')).not.toBeInTheDocument();
  });

  it('renders modal with role options when isOpen is true', () => {
    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <RoleConfirmationModal isOpen={true} onClose={vi.fn()} />
      </UserRoleProvider>
    );

    expect(screen.getByTestId('role-confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText(/Confirm Your Sovereign Account Role/i)).toBeInTheDocument();
    expect(screen.getByTestId('role-card-landlord')).toBeInTheDocument();
    expect(screen.getByTestId('role-card-tenant')).toBeInTheDocument();
    expect(screen.getByTestId('role-card-agent')).toBeInTheDocument();
    expect(screen.getByTestId('role-card-buyer')).toBeInTheDocument();
  });

  it('allows selecting the Tenant role and confirms via server endpoint', async () => {
    mockCompleteSocialRegistration.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'server-jwt-tenant',
        pendingApproval: false,
        user: {
          id: 'u-1',
          email: 'guest@whitecaves.com',
          name: 'Omar',
          role: 'tenant',
          isRoleConfirmed: true,
        },
      },
    });

    const handleConfirmed = vi.fn();
    const handleClose = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <RoleConfirmationModal
          isOpen={true}
          onClose={handleClose}
          onRoleConfirmed={handleConfirmed}
        />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('role-card-tenant'));
    fireEvent.click(screen.getByTestId('confirm-role-submit-btn'));

    await waitFor(() => {
      expect(mockCompleteSocialRegistration).toHaveBeenCalledWith('client', 'tenant');
      expect(handleConfirmed).toHaveBeenCalledWith('tenant');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('allows selecting the Landlord role and confirms via server endpoint', async () => {
    mockCompleteSocialRegistration.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'server-jwt-landlord',
        pendingApproval: false,
        user: {
          id: 'u-2',
          email: 'guest@whitecaves.com',
          name: 'Khalid',
          role: 'landlord',
          isRoleConfirmed: true,
        },
      },
    });

    const handleConfirmed = vi.fn();
    const handleClose = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <RoleConfirmationModal
          isOpen={true}
          onClose={handleClose}
          onRoleConfirmed={handleConfirmed}
        />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('role-card-landlord'));
    fireEvent.click(screen.getByTestId('confirm-role-submit-btn'));

    await waitFor(() => {
      expect(mockCompleteSocialRegistration).toHaveBeenCalledWith('client', 'landlord');
      expect(handleConfirmed).toHaveBeenCalledWith('landlord');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('submits Licensed Broker as pending staff approval and never self-elevates to agent (Law T20)', async () => {
    mockCompleteSocialRegistration.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'server-jwt-guest-pending',
        pendingApproval: true,
        requestedRole: 'agent',
        user: {
          id: 'u-3',
          email: 'guest@whitecaves.com',
          name: 'Applicant',
          role: 'guest',
          status: 'pending',
          isRoleConfirmed: false,
        },
      },
    });

    const handleConfirmed = vi.fn();
    const handleClose = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.guest}>
        <RoleConfirmationModal
          isOpen={true}
          onClose={handleClose}
          onRoleConfirmed={handleConfirmed}
        />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByTestId('role-card-agent'));
    fireEvent.click(screen.getByTestId('confirm-role-submit-btn'));

    await waitFor(() => {
      expect(mockCompleteSocialRegistration).toHaveBeenCalledWith('staff', 'agent');
      expect(screen.getByTestId('broker-pending-approval-banner')).toBeInTheDocument();
    });

    expect(handleConfirmed).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking Cancel button', () => {
    const handleClose = vi.fn();

    render(
      <UserRoleProvider>
        <RoleConfirmationModal isOpen={true} onClose={handleClose} />
      </UserRoleProvider>
    );

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
