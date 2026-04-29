/**
 * UAEPassSuccessPage — Comprehensive Unit Tests
 *
 * Covers: OAuth callback flow, loading state, success display,
 * error handling, redirect timer, retry, missing code param,
 * user data rendering, Redux dispatch
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockAuthFetch = vi.fn();
const mockDispatch = vi.fn();
let mockSearchParams = new URLSearchParams('code=AUTH_CODE_123&state=STATE_456');

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) =>
    selector({ user: { currentUser: null } }),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../store/userSlice', () => ({
  setUser: (payload: Record<string, unknown>) => ({
    type: 'user/setUser',
    payload,
  }),
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('./AuthPages.css', () => ({}));

import UAEPassSuccessPage from './UAEPassSuccessPage';

// ── Test Suite ───────────────────────────────────────────────────

describe('UAEPassSuccessPage', () => {
  const mockUserData = {
    user: {
      name: 'Ahmed Al-Maktoum',
      email: 'ahmed@test.ae',
      uaeId: '784-XXXX-XXXXXXX-X',
      emirate: 'Dubai',
      phone: '+971 50 123 4567',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams('code=AUTH_CODE_123&state=STATE_456');
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUserData),
    });
  });

  afterEach(() => {
    vi.useRealTimers(); // Safety: always restore real timers
    vi.restoreAllMocks();
  });

  // ────── Loading State ──────

  describe('loading state', () => {
    it('shows loading spinner initially', () => {
      mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
      render(<UAEPassSuccessPage />);
      expect(screen.getByText('Authenticating with UAE Pass...')).toBeInTheDocument();
    });
  });

  // ────── Successful Authentication ──────

  describe('successful authentication', () => {
    it('renders welcome message after success', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Welcome!')).toBeInTheDocument();
    });

    it('displays user name', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Ahmed Al-Maktoum')).toBeInTheDocument();
    });

    it('displays user email', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('ahmed@test.ae')).toBeInTheDocument();
    });

    it('displays UAE ID', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('784-XXXX-XXXXXXX-X')).toBeInTheDocument();
    });

    it('displays emirate', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Dubai')).toBeInTheDocument();
    });

    it('displays phone when provided', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('+971 50 123 4567')).toBeInTheDocument();
    });

    it('dispatches setUser to Redux store', async () => {
      render(<UAEPassSuccessPage />);
      await screen.findByText('Welcome!');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'user/setUser',
        payload: {
          id: '784-XXXX-XXXXXXX-X',
          email: 'ahmed@test.ae',
          name: 'Ahmed Al-Maktoum',
          phone: '+971 50 123 4567',
        },
      });
    });

    it('shows redirect message', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/redirected to your dashboard/)).toBeInTheDocument();
    });

    it('shows security notice', async () => {
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/Your Information is Secure/)).toBeInTheDocument();
    });

    it('"Continue to Dashboard" button navigates immediately', async () => {
      render(<UAEPassSuccessPage />);
      const btn = await screen.findByText('Continue to Dashboard');
      fireEvent.click(btn);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('auto-redirects to dashboard after successful auth', async () => {
      render(<UAEPassSuccessPage />);
      await screen.findByText('Welcome!');
      // Wait for the 3-second redirect timer to fire
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 5000 });
    }, 10000);
  });

  // ────── API Call ──────

  describe('API call', () => {
    it('calls authFetch with code and state', async () => {
      render(<UAEPassSuccessPage />);
      await screen.findByText('Welcome!');
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/auth/uae-pass/callback',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'AUTH_CODE_123', state: 'STATE_456' }),
        }),
      );
    });
  });

  // ────── Error Handling ──────

  describe('error handling', () => {
    it('shows error when no code in URL', async () => {
      mockSearchParams = new URLSearchParams('');
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/No authorization code received/)).toBeInTheDocument();
    });

    it('shows error on API failure', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid code' }),
      });
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Invalid code')).toBeInTheDocument();
    });

    it('shows error on network exception', async () => {
      mockAuthFetch.mockRejectedValue(new Error('Network failure'));
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Network failure')).toBeInTheDocument();
    });

    it('shows generic error on non-Error exception', async () => {
      mockAuthFetch.mockRejectedValue('string error');
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/An error occurred during authentication/)).toBeInTheDocument();
    });

    it('shows error when response has no user data', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: null }),
      });
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/Invalid response: missing user data/)).toBeInTheDocument();
    });

    it('renders "Authentication Failed" heading', async () => {
      mockSearchParams = new URLSearchParams('');
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText(/Authentication Failed/)).toBeInTheDocument();
    });

    it('"Try Again" button navigates to login', async () => {
      mockSearchParams = new URLSearchParams('');
      render(<UAEPassSuccessPage />);
      const btn = await screen.findByText('Try Again');
      fireEvent.click(btn);
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    it('shows fallback error on JSON parse failure', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('bad json')),
      });
      render(<UAEPassSuccessPage />);
      expect(await screen.findByText('Authentication failed')).toBeInTheDocument();
    });
  });
});
