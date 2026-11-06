// FILE: src/components/auth/__tests__/RoleConfirmationModal.test.tsx
/**
 * White Caves Real Estate LLC - RoleConfirmationModal Vitest Unit Suite
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { RoleConfirmationModal } from '../RoleConfirmationModal';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../../context/UserRoleContext';

describe('RoleConfirmationModal Suite', () => {
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

  it('allows selecting the Tenant role and confirming', async () => {
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

    const tenantCard = screen.getByTestId('role-card-tenant');
    fireEvent.click(tenantCard);

    const submitBtn = screen.getByTestId('confirm-role-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleConfirmed).toHaveBeenCalledWith('tenant');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('allows selecting the Landlord role and confirming', async () => {
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

    const landlordCard = screen.getByTestId('role-card-landlord');
    fireEvent.click(landlordCard);

    const submitBtn = screen.getByTestId('confirm-role-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleConfirmed).toHaveBeenCalledWith('landlord');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('calls onClose when clicking Cancel button', () => {
    const handleClose = vi.fn();

    render(
      <UserRoleProvider>
        <RoleConfirmationModal isOpen={true} onClose={handleClose} />
      </UserRoleProvider>
    );

    const cancelBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
