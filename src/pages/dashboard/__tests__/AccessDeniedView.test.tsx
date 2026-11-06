// FILE: src/pages/dashboard/__tests__/AccessDeniedView.test.tsx
/**
 * White Caves Real Estate LLC - AccessDeniedView Vitest Suite
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AccessDeniedView } from '../AccessDeniedView';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../../context/UserRoleContext';

describe('AccessDeniedView Suite', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders access restricted title and active user role', () => {
    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.landlord}>
        <AccessDeniedView requiredRole="Corporate Directorate (L3+)" />
      </UserRoleProvider>
    );

    expect(screen.getByTestId('rbac-access-denied-view')).toBeInTheDocument();
    expect(screen.getByText(/Access Restricted by Sovereign RBAC/i)).toBeInTheDocument();
    expect(screen.getByText(/Corporate Directorate \(L3\+\)/i)).toBeInTheDocument();
  });

  it('triggers onNavigateBack when clicking Go Back', () => {
    const handleBack = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.landlord}>
        <AccessDeniedView onNavigateBack={handleBack} />
      </UserRoleProvider>
    );

    const backBtn = screen.getByTestId('access-denied-back-btn');
    fireEvent.click(backBtn);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('triggers onNavigateHome when clicking Return to My Portal', () => {
    const handleHome = vi.fn();

    render(
      <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.landlord}>
        <AccessDeniedView onNavigateHome={handleHome} />
      </UserRoleProvider>
    );

    const homeBtn = screen.getByTestId('access-denied-home-btn');
    fireEvent.click(homeBtn);

    expect(handleHome).toHaveBeenCalledTimes(1);
  });
});
