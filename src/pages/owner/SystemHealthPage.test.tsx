/**
 * SystemHealthPage — Unit Tests
 * Tests: role-based access, loading state, health data rendering,
 * overall status, status colors/icons, error handling, refresh, polling
 */

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
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('./SystemHealthPage.css', () => ({}));

let mockUser: { role: string } | null = { role: 'owner' };
vi.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({ user: { currentUser: mockUser } }),
}));

// ── Helpers ──────────────────────────────────────────────────────

const healthyServices = [
  { service: 'API Server', status: 'healthy', uptime: 99.99, lastChecked: '2 min ago' },
  { service: 'Database', status: 'healthy', uptime: 99.95, lastChecked: '2 min ago' },
  { service: 'Cache', status: 'degraded', uptime: 98.5, lastChecked: '2 min ago' },
];

function okResponse(data: Record<string, unknown>) {
  return Promise.resolve({
    ok: true, status: 200, statusText: 'OK',
    json: () => Promise.resolve(data),
  });
}

function failResponse(status = 500, statusText = 'Internal Server Error') {
  return Promise.resolve({
    ok: false, status, statusText,
    json: () => Promise.resolve({ error: 'Server error' }),
  });
}

import SystemHealthPage from './SystemHealthPage';

describe('SystemHealthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockUser = { role: 'owner' };
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: healthyServices, overall: 'operational' }),
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
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });
    await act(async () => { render(<SystemHealthPage />); });
    expect(screen.getByText('System Health Dashboard')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows admin role to view page', async () => {
    mockUser = { role: 'admin' };
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });
    await act(async () => { render(<SystemHealthPage />); });
    expect(screen.getByText('System Health Dashboard')).toBeInTheDocument();
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
    expect(screen.getByText('Loading system status...')).toBeInTheDocument();
  });

  // ────── Service Data Rendering ──────

  it('renders service cards after loading', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: healthyServices, overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    await waitFor(() => {
      expect(screen.getByText('API Server')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('Cache')).toBeInTheDocument();
    });
  });

  it('shows uptime percentages', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: healthyServices, overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    await waitFor(() => {
      expect(screen.getByText('99.99%')).toBeInTheDocument();
      expect(screen.getByText('99.95%')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
    });
  });

  it('shows empty state when no services', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    await waitFor(() => {
      expect(screen.getByText('No services to display')).toBeInTheDocument();
    });
  });

  // ────── Overall Status ──────

  it('shows operational status', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    expect(screen.getByText(/Operational/)).toBeInTheDocument();
  });

  it('shows degraded status', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'degraded' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    expect(screen.getByText(/Degraded/)).toBeInTheDocument();
  });

  // ────── Status Icons ──────

  it('renders status icons for services', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: healthyServices, overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    await waitFor(() => {
      expect(screen.getAllByText('✓')).toHaveLength(2); // 2 healthy
      expect(screen.getByText('⚠')).toBeInTheDocument(); // 1 degraded
    });
  });

  // ────── Performance Metrics ──────

  it('renders static performance metrics', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('245ms')).toBeInTheDocument();
    expect(screen.getByText('52ms')).toBeInTheDocument();
    expect(screen.getByText('87.3%')).toBeInTheDocument();
    expect(screen.getByText('0.02%')).toBeInTheDocument();
  });

  // ────── Error Handling ──────

  it('shows error message on API failure', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false, status: 500, statusText: 'Internal Server Error',
      json: () => Promise.resolve({}),
    });

    await act(async () => { render(<SystemHealthPage />); });

    // Should set overallStatus to 'down'
    await waitFor(() => {
      expect(screen.getByText(/Down/)).toBeInTheDocument();
    });
  });

  it('shows connection error on network exception', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));

    await act(async () => { render(<SystemHealthPage />); });

    await waitFor(() => {
      expect(screen.getByText(/Down/)).toBeInTheDocument();
    });
  });

  it('ignores AbortError silently', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    mockAuthFetch.mockRejectedValue(abortError);

    await act(async () => { render(<SystemHealthPage />); });

    // Should not show 'Down' for abort
    // page still renders normally (loading may end without setting down)
    expect(screen.getByText('System Health Dashboard')).toBeInTheDocument();
  });

  // ────── Refresh Button ──────

  it('renders refresh button', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    expect(screen.getByText(/Refresh Status/)).toBeInTheDocument();
  });

  it('calls fetchSystemHealth on refresh click', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });

    mockAuthFetch.mockClear();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: healthyServices, overall: 'operational' }),
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Refresh Status/));
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/system/health',
      expect.anything()
    );
  });

  // ────── Polling ──────

  it('fetches health data automatically every 60 seconds', async () => {
    vi.useFakeTimers();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ services: [], overall: 'operational' }),
    });

    await act(async () => { render(<SystemHealthPage />); });
    // Flush the initial fetch microtask
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });

    // Initial fetch
    expect(mockAuthFetch).toHaveBeenCalledTimes(1);

    // Advance 60 seconds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });

    expect(mockAuthFetch).toHaveBeenCalledTimes(2);
  });
});
