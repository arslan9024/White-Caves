/**
 * WhatsAppAnalyticsPage — Unit Tests
 * Tests: role-based access, loading state, analytics rendering,
 * date range selector, keywords, error handling, AbortController
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

vi.mock('./WhatsAppAnalyticsPage.css', () => ({}));

let mockUser: { role: string } | null = { role: 'owner' };
vi.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({ user: { currentUser: mockUser } }),
}));

// ── Helpers ──────────────────────────────────────────────────────

const sampleAnalytics = {
  totalMessages: 1250,
  sentMessages: 780,
  receivedMessages: 470,
  averageResponseTime: '2.5m',
  topKeywords: ['pricing', 'villa', 'marina', 'rent', 'viewing'],
};

import WhatsAppAnalyticsPage from './WhatsAppAnalyticsPage';

describe('WhatsAppAnalyticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockUser = { role: 'owner' };
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve(sampleAnalytics),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ────── Role-based Access ──────

  it('redirects non-owner/admin users', () => {
    mockUser = { role: 'tenant' };
    render(<WhatsAppAnalyticsPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows owner to view', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    expect(screen.getByText('WhatsApp Analytics')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows admin to view', async () => {
    mockUser = { role: 'admin' };
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    expect(screen.getByText('WhatsApp Analytics')).toBeInTheDocument();
  });

  it('redirects when user is null', () => {
    mockUser = null;
    render(<WhatsAppAnalyticsPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // ────── Loading State ──────

  it('shows loading while fetching', () => {
    mockAuthFetch.mockReturnValue(new Promise(() => {}));
    render(<WhatsAppAnalyticsPage />);
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
  });

  // ────── Analytics Rendering ──────

  it('renders total messages', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('1250')).toBeInTheDocument();
    });
  });

  it('renders sent messages', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('780')).toBeInTheDocument();
    });
  });

  it('renders received messages', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('470')).toBeInTheDocument();
    });
  });

  it('renders average response time', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('2.5m')).toBeInTheDocument();
    });
  });

  it('renders stat labels', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('Total Messages')).toBeInTheDocument();
      expect(screen.getByText('Sent')).toBeInTheDocument();
      expect(screen.getByText('Received')).toBeInTheDocument();
      expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    });
  });

  // ────── Keywords ──────

  it('renders top keywords', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('pricing')).toBeInTheDocument();
      expect(screen.getByText('villa')).toBeInTheDocument();
      expect(screen.getByText('marina')).toBeInTheDocument();
      expect(screen.getByText('rent')).toBeInTheDocument();
      expect(screen.getByText('viewing')).toBeInTheDocument();
    });
  });

  it('shows no data when keywords empty', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ ...sampleAnalytics, topKeywords: [] }),
    });
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  // ────── Date Range Selector ──────

  it('shows date range dropdown with default 7d', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    const select = screen.getByLabelText('Date Range:') as HTMLSelectElement;
    expect(select.value).toBe('7d');
  });

  it('has all date range options', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 90 Days')).toBeInTheDocument();
    expect(screen.getByText('Last Year')).toBeInTheDocument();
  });

  it('refetches analytics when date range changes', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });

    // Initial fetch
    expect(mockAuthFetch).toHaveBeenCalledTimes(1);
    expect(mockAuthFetch).toHaveBeenCalledWith(
      expect.stringContaining('range=7d'),
      expect.anything()
    );

    mockAuthFetch.mockClear();
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve(sampleAnalytics),
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Date Range:'), { target: { value: '30d' } });
    });

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        expect.stringContaining('range=30d'),
        expect.anything()
      );
    });
  });

  // ────── Chart Placeholders ──────

  it('renders chart placeholders', async () => {
    await act(async () => { render(<WhatsAppAnalyticsPage />); });
    await waitFor(() => {
      expect(screen.getByText('Message Volume (7 days)')).toBeInTheDocument();
      expect(screen.getByText('Response Time Distribution')).toBeInTheDocument();
    });
  });

  // ────── Error Handling ──────

  it('handles failed fetch gracefully', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false, status: 500,
      json: () => Promise.resolve({}),
    });

    await act(async () => { render(<WhatsAppAnalyticsPage />); });

    // Should show zeros (initial state) not crash — multiple "0" elements expected
    await waitFor(() => {
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('ignores AbortError silently', async () => {
    mockAuthFetch.mockRejectedValue(new DOMException('Aborted', 'AbortError'));

    await act(async () => { render(<WhatsAppAnalyticsPage />); });

    expect(screen.getByText('WhatsApp Analytics')).toBeInTheDocument();
  });

  it('handles network exception gracefully', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));

    await act(async () => { render(<WhatsAppAnalyticsPage />); });

    // Should render with initial zero state
    expect(screen.getByText('WhatsApp Analytics')).toBeInTheDocument();
  });
});
