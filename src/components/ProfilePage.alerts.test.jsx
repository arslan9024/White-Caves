import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from './ProfilePage';

vi.mock('./ProfilePage.css', () => ({}));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}));

describe('ProfilePage — alert elimination', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows inline status banner when profile save succeeds (no window.alert)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'Test User',
          email: 'test@example.com',
          role: 'agent',
          profileCompletion: { percentage: 60 },
          address: {},
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: { name: 'Updated User' } }),
      });

    render(<ProfilePage />);

    fireEvent.click(await screen.findByRole('button', { name: /Edit Profile/i }));
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    const banner = await screen.findByRole('status');
    expect(banner).toHaveAttribute('data-testid', 'profile-status-banner');
    expect(banner).toHaveTextContent('Profile updated successfully!');

    await waitFor(() => {
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });
});
