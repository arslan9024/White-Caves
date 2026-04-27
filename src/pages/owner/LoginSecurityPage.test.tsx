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
    // Dispatch responses by URL so we tolerate the parallel /security/stats fetch.
    let listCalls = 0;
    mockAuthFetch.mockImplementation((url: unknown, opts?: { method?: string }) => {
      const u = String(url);
      if (u.includes('/security/login-attempts')) {
        listCalls += 1;
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: listCalls === 1 ? sampleAttempts : [],
            meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
          }),
        });
      }
      if (u.includes('/security/stats')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: {
              totals: { logins: 0, loginFailures: 0, passwordChanges: 0, passwordChangeFailures: 0, accountUnlocks: 0 },
              uniqueIpCount: 0, topOffendingIps: [], topTargetedEmails: [], windowMinutes: 1440,
            },
          }),
        });
      }
      if (u.includes('/security/unlock') && opts?.method === 'POST') {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          text: () => Promise.resolve(''),
          json: () => Promise.resolve({
            success: true,
            data: { userId: 'user-1', email: 'ghost@whitecaves.ae', clearedFailures: 5 },
          }),
        });
      }
      return Promise.resolve({ ok: false, status: 404, statusText: 'NF', text: () => Promise.resolve(''), json: () => Promise.resolve({}) });
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

  it('exports the current view as CSV', async () => {
    const createUrl = vi.fn(() => 'blob:mock');
    const revokeUrl = vi.fn();
    // Polyfill jsdom (URL.createObjectURL is undefined)
    (URL as unknown as { createObjectURL: typeof createUrl }).createObjectURL = createUrl;
    (URL as unknown as { revokeObjectURL: typeof revokeUrl }).revokeObjectURL = revokeUrl;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<LoginSecurityPage />);
    const exportBtn = await screen.findByRole('button', { name: /Export current view to CSV/i });
    await waitFor(() => expect(exportBtn).not.toBeDisabled());
    fireEvent.click(exportBtn);

    expect(createUrl).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeUrl).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
  });

  it('renders the Unique IPs stats tile when /security/stats responds', async () => {
    mockAuthFetch.mockImplementation((url: unknown) => {
      const u = String(url);
      if (u.includes('/security/stats')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: {
              totals: { logins: 7, loginFailures: 3, passwordChanges: 1, passwordChangeFailures: 0, accountUnlocks: 2 },
              uniqueIpCount: 42,
              topOffendingIps: [{ ip: '9.9.9.9', failures: 3 }],
              topTargetedEmails: [{ email: 'ghost@x.ae', failures: 3 }],
              windowMinutes: 1440,
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true, status: 200, statusText: 'OK',
        json: () => Promise.resolve({
          success: true, data: [],
          meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
        }),
      });
    });

    render(<LoginSecurityPage />);
    expect(await screen.findByText('Unique IPs')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('9.9.9.9')).toBeInTheDocument();
  });

  it('POSTs to /security/unlock-ip when an IP Unlock button is clicked', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockAuthFetch.mockImplementation((url: unknown, init?: { method?: string }) => {
      const u = String(url);
      if (u.includes('/security/unlock-ip')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({ success: true, data: { ip: '9.9.9.9', clearedFailures: 4 } }),
          text: () => Promise.resolve(''),
        });
      }
      if (u.includes('/security/stats')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: {
              totals: { logins: 0, loginFailures: 4, passwordChanges: 0, passwordChangeFailures: 0, accountUnlocks: 0, ipUnlocks: 0 },
              uniqueIpCount: 1,
              topOffendingIps: [{ ip: '9.9.9.9', failures: 4 }],
              topTargetedEmails: [],
              windowMinutes: 1440,
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true, status: 200, statusText: 'OK',
        json: () => Promise.resolve({
          success: true, data: [],
          meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
        }),
      });
    });

    render(<LoginSecurityPage />);
    const unlockBtn = await screen.findByRole('button', { name: /unlock ip 9\.9\.9\.9/i });
    fireEvent.click(unlockBtn);

    await waitFor(() => {
      const calls = mockAuthFetch.mock.calls.map((c) => String(c[0]));
      expect(calls.some((u) => u.includes('/security/unlock-ip'))).toBe(true);
    });
    confirmSpy.mockRestore();
  });

  it('renders the active-lockouts panel and POSTs /security/unlock when an active account Unlock is clicked', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockAuthFetch.mockImplementation((url: unknown) => {
      const u = String(url);
      if (u.includes('/security/active-lockouts')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: {
              windowMinutes: 15,
              accountThreshold: 5,
              ipThreshold: 20,
              accounts: [
                { userId: 'user-A', email: 'locked@whitecaves.ae', failures: 6, retryAfterSeconds: 600 },
              ],
              ips: [
                { ip: '9.9.9.9', failures: 25, retryAfterSeconds: 540 },
              ],
            },
          }),
        });
      }
      if (u.includes('/security/unlock') && !u.includes('unlock-ip')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          text: () => Promise.resolve(''),
          json: () => Promise.resolve({
            success: true,
            data: { userId: 'user-A', email: 'locked@whitecaves.ae', clearedFailures: 6 },
          }),
        });
      }
      return Promise.resolve({
        ok: true, status: 200, statusText: 'OK',
        json: () => Promise.resolve({
          success: true, data: [],
          meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
        }),
      });
    });

    render(<LoginSecurityPage />);
    expect(await screen.findByText(/Active lockouts/i)).toBeInTheDocument();
    expect(screen.getByText('locked@whitecaves.ae')).toBeInTheDocument();
    expect(screen.getByText('9.9.9.9')).toBeInTheDocument();

    const accountUnlockBtn = screen.getByRole('button', { name: /unlock account locked@whitecaves\.ae/i });
    fireEvent.click(accountUnlockBtn);

    await waitFor(() => {
      const calls = mockAuthFetch.mock.calls.map((c) => ({ url: String(c[0]), init: c[1] }));
      const unlockCall = calls.find(
        (c) => c.url.includes('/security/unlock') && !c.url.includes('unlock-ip') && (c.init as { method?: string })?.method === 'POST',
      );
      expect(unlockCall).toBeTruthy();
    });
    confirmSpy.mockRestore();
  });

  it('renders the active-lockouts panel and POSTs /security/unlock when an active account Unlock is clicked', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockAuthFetch.mockImplementation((url: unknown) => {
      const u = String(url);
      if (u.includes('/security/active-lockouts')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve({
            success: true,
            data: {
              windowMinutes: 15,
              accountThreshold: 5,
              ipThreshold: 20,
              accounts: [
                { userId: 'user-A', email: 'locked@whitecaves.ae', failures: 6, retryAfterSeconds: 600 },
              ],
              ips: [
                { ip: '9.9.9.9', failures: 25, retryAfterSeconds: 540 },
              ],
            },
          }),
        });
      }
      if (u.includes('/security/unlock') && !u.includes('unlock-ip')) {
        return Promise.resolve({
          ok: true, status: 200, statusText: 'OK',
          text: () => Promise.resolve(''),
          json: () => Promise.resolve({
            success: true,
            data: { userId: 'user-A', email: 'locked@whitecaves.ae', clearedFailures: 6 },
          }),
        });
      }
      return Promise.resolve({
        ok: true, status: 200, statusText: 'OK',
        json: () => Promise.resolve({
          success: true, data: [],
          meta: { count: 0, limit: 100, sinceMinutes: 1440, status: 'all', emailFilter: null },
        }),
      });
    });

    render(<LoginSecurityPage />);
    expect(await screen.findByText(/Active lockouts/i)).toBeInTheDocument();
    expect(screen.getByText('locked@whitecaves.ae')).toBeInTheDocument();
    expect(screen.getByText('9.9.9.9')).toBeInTheDocument();

    const accountUnlockBtn = screen.getByRole('button', { name: /unlock account locked@whitecaves\.ae/i });
    fireEvent.click(accountUnlockBtn);

    await waitFor(() => {
      const calls = mockAuthFetch.mock.calls.map((c) => ({ url: String(c[0]), init: c[1] }));
      const unlockCall = calls.find(
        (c) => c.url.includes('/security/unlock') && !c.url.includes('unlock-ip') && (c.init as { method?: string })?.method === 'POST',
      );
      expect(unlockCall).toBeTruthy();
    });
    confirmSpy.mockRestore();
  });
});