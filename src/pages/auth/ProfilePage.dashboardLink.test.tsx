import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockAuthFetch = vi.fn();
const mockUseUserProfile = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../hooks/useUserProfile', () => ({
  useUserProfile: () => mockUseUserProfile(),
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricSetup: () => <div data-testid="biometric-setup">Biometric setup</div>,
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import ProfilePage from './ProfilePage.tsx';

describe('ProfilePage dashboard link routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserProfile.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@whitecaves.ae',
        phone: '+971501234567',
      },
      userRole: { role: 'owner', locked: true },
      profileName: 'Ahmed Al-Rashid',
      setProfileName: vi.fn(),
      profilePhone: '+971501234567',
      setProfilePhone: vi.fn(),
      profileLanguage: 'en',
      setProfileLanguage: vi.fn(),
      isSaving: false,
      handleLogout: vi.fn(),
      handleSaveProfile: vi.fn(),
      getRoleLabel: (role: string) => role,
    });
    mockAuthFetch.mockResolvedValue({
      json: async () => ({ success: true, data: { twoFactorEnabled: false } }),
    });
  });

  it('routes owner users to the owner dashboard link', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const dashboardLink = await waitFor(() => screen.getByRole('link', { name: 'Dashboard' }));
    expect(dashboardLink.getAttribute('href')).toBe('/owner/dashboard');
  });
});
