/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockAuthFetch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('./SystemHealthPage.css', () => ({}));

let mockUser: { role: string; email?: string } | null = {
  role: 'owner',
  email: 'arslanmalikgoraha@gmail.com',
};
const mockDispatch = vi.fn();

vi.mock('react-redux', () => {
  const mockAnalyticsState = {
    performance: { score: 90, status: 'good' },
    traffic: { pageViews: 1000, activeUsers: 50, avgSessionDuration: 120, bounceRate: 35 },
    webVitals: {
      lcp: { value: 1200, rating: 'good' },
      inp: { value: 80, rating: 'good' },
      cls: { value: 0.05, rating: 'good' },
    },
  };
  return {
    useSelector: (fn: (s: unknown) => unknown) =>
      fn({
        user: { currentUser: mockUser },
        analytics: mockAnalyticsState,
      }),
    useDispatch: () => mockDispatch,
  };
});

// ── Helpers ──────────────────────────────────────────────────────

const mockHealthData = {
  server: { status: 'healthy', uptime: '99.99%', environment: 'production', port: 5001 },
  mongodb: { status: 'healthy', storageMode: 'atlas', database: 'whitecaves', error: null },
  firebase: {
    status: 'healthy',
    projectId: 'whitecaves-prod',
    authDomain: 'whitecaves.firebaseapp.com',
    adminSdk: 'initialized',
  },
  stripe: { status: 'healthy', configured: true, mode: 'live' },
  googleDrive: { status: 'healthy', configured: true, error: null },
  googleMaps: { status: 'healthy', configured: true },
  whatsapp: { status: 'healthy', configured: true, phoneNumberId: '12345', chatbotEnabled: true },
  envVars: [
    { name: 'DATABASE_URL', set: true },
    { name: 'JWT_SECRET', set: true },
  ],
  productionReadiness: {
    isDeployable: true,
    score: 100,
    passedChecks: 5,
    totalChecks: 5,
    criticalIssues: 0,
  },
  deploymentChecks: [
    {
      name: 'Database Connection',
      status: 'production',
      critical: true,
      message: 'Connected to production database',
    },
  ],
};

import SystemHealthPage from './SystemHealthPage';

describe('SystemHealthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockUser = { role: 'owner', email: 'arslanmalikgoraha@gmail.com' };
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHealthData),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ────── Role-based Access ──────

  it('redirects non-owner/admin users to home', () => {
    mockUser = { role: 'tenant' };
    render(<SystemHealthPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows owner role to view page', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });
    expect(screen.getByText('System Health Monitor')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows admin role to view page', async () => {
    mockUser = { role: 'admin', email: 'arslanmalikgoraha@gmail.com' };
    await act(async () => {
      render(<SystemHealthPage />);
    });
    expect(screen.getByText('System Health Monitor')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects when user is null', () => {
    mockUser = null;
    render(<SystemHealthPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // ────── Loading State ──────

  it('shows loading indicator while fetching', () => {
    mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<SystemHealthPage />);
    expect(screen.getByText('Checking system health...')).toBeInTheDocument();
  });

  // ────── Service Data Rendering ──────

  it('renders service cards after loading', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Server')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Firebase')).toBeInTheDocument();
      expect(screen.getByText('Stripe')).toBeInTheDocument();
    });
  });

  it('shows server metadata', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('99.99%')).toBeInTheDocument();
      expect(screen.getByText('production')).toBeInTheDocument();
    });
  });

  it('handles empty fields gracefully', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Server')).toBeInTheDocument();
    });
  });

  // ────── Overall Status ──────

  it('shows operational status', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/healthy/i).length).toBeGreaterThan(0);
    });
  });

  it('shows degraded status', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ...mockHealthData,
          server: { status: 'degraded' },
        }),
    });

    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/degraded/i)).toBeInTheDocument();
    });
  });

  // ────── Status Icons ──────

  it('renders status icons for services', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('✓').length).toBeGreaterThan(0);
    });
  });

  // ────── Performance Metrics ──────

  it('renders vitals metrics', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    expect(screen.getByText('Largest Contentful Paint')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });

  // ────── Error Handling ──────

  it('shows error message on API failure', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Internal Server Error'));

    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch health status')).toBeInTheDocument();
    });
  });

  it('shows connection error on network exception', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch health status')).toBeInTheDocument();
    });
  });

  it('ignores AbortError silently', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    mockAuthFetch.mockRejectedValue(abortError);

    await act(async () => {
      render(<SystemHealthPage />);
    });

    expect(screen.getByText('System Health Monitor')).toBeInTheDocument();
  });

  // ────── Refresh Button ──────

  it('renders refresh button', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Refresh Status/)).toBeInTheDocument();
    });
  });

  it('calls fetchSystemHealth on refresh click', async () => {
    await act(async () => {
      render(<SystemHealthPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Refresh Status/)).toBeInTheDocument();
    });

    mockAuthFetch.mockClear();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHealthData),
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Refresh Status/));
    });

    expect(mockAuthFetch).toHaveBeenCalledWith('/api/system/health');
  });

  // ────── Polling ──────

  it('fetches health data automatically every 30 seconds', async () => {
    vi.useFakeTimers();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHealthData),
    });

    await act(async () => {
      render(<SystemHealthPage />);
    });
    // Flush the initial fetch microtask
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    // Initial fetch
    expect(mockAuthFetch).toHaveBeenCalledTimes(1);

    // Advance 30 seconds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });

    expect(mockAuthFetch).toHaveBeenCalledTimes(2);
  });
});
