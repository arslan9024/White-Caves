/**
 * LoginSecurityPage — Smoke Tests
 * Verifies role guard, list rendering, and unlock flow.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockAuthFetch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('./LoginSecurityPage.css', () => ({}));

let mockUser: { role: string } | null = { role: 'owner' };
vi.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({ user: { currentUser: mockUser } }),
}));

const sampleAttempts = [
  {
    id: 'a1',
    action: 'login_failed',
    description: 'Failed login: invalid_password',
    createdAt: new Date().toISOString(),
    userId: 'user-1',
    user: { id: 'user-1', email: 'ghost@whitecaves.ae', name: 'Ghost', role: 'agent' },
    metadata: { reason: 'invalid_password', ip: '10.0.0.5', userAgent: 'curl/8' },
  },
  {
    id: 'a2',
    action: 'login',
    description: 'Successful login',
    createdAt: new Date().toISOString(),
    userId: 'user-2',
    user: { id: 'user-2', email: 'owner@whitecaves.ae', name: 'Owner', role: 'owner' },
    metadata: { ip: '10.0.0.6', userAgent: 'Mozilla/5.0' },
  },
];

import LoginSecurityPage from './LoginSecurityPage';

describe('LoginSecurityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { role: 'owner' };
    mockAuthFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () =>
        Promise.resolve({
          success: true,
          data: sampleAttempts,
          meta: { count: 2, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
        }),
    });
  });

  it('redirects non-privileged users to home', () => {
    mockUser = { role: 'tenant' };
    render(<LoginSecurityPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders attempts and summary counts after fetching', async () => {
    render(<LoginSecurityPage />);
    await waitFor(() => {
      expect(screen.getByText('ghost@whitecaves.ae')).toBeInTheDocument();
      expect(screen.getByText('owner@whitecaves.ae')).toBeInTheDocument();
    });
    // Calls the list endpoint on mount
    const url = String(mockAuthFetch.mock.calls[0][0]);
    expect(url).toContain('/api/auth/security/login-attempts');
    expect(url).toContain('status=all');
  });

  it('issues unlock request when Unlock button is clicked', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    // First call (mount) returns list; second (unlock) returns ok; third (refetch) returns list.
    mockAuthFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () =>
          Promise.resolve({
            success: true,
            data: sampleAttempts,
            meta: { count: 2, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(''),
        json: () =>
          Promise.resolve({
            success: true,
            data: { userId: 'user-1', email: 'ghost@whitecaves.ae', clearedFailures: 5 },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () =>
          Promise.resolve({
            success: true,
            data: [],
            meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
          }),
      });

    render(<LoginSecurityPage />);
    const unlockBtn = await screen.findByRole('button', { name: /Unlock$/i });
    fireEvent.click(unlockBtn);

    await waitFor(() => {
      const unlockCall = mockAuthFetch.mock.calls.find(
        (c) => String(c[0]).endsWith('/api/auth/security/unlock'),
      );
      expect(unlockCall).toBeTruthy();
      expect(unlockCall![1]).toMatchObject({ method: 'POST' });
    });

    confirmSpy.mockRestore();
  });
});
