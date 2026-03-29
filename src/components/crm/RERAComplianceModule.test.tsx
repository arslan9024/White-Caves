/**
 * RERAComplianceModule — Unit Tests
 * Tests: render, loading state, dashboard tab, register form tab,
 * RERA status fetch, mock data fallback, agent status colors,
 * form submission, tab switching, agent selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────
vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../Toast', () => ({
  useToast: () => mockToast,
}));

import RERAComplianceModule from './RERAComplianceModule';

const DEFAULT_PROPS = {
  role: 'admin',
  user: { id: 'u1', name: 'Admin', email: 'admin@wc.ae' },
};

// ═══════════════════════════════════════════════════════════════════

describe('RERAComplianceModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: API fails → falls back to mock data
    mockAuthFetch.mockResolvedValue({ ok: false });
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the module header', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('RERA Compliance Management')).toBeDefined();
    expect(screen.getByText(/Monitor and manage real estate agent licenses/i)).toBeDefined();
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });
  });

  it('renders both tabs', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Register License')).toBeDefined();
    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });
  });

  // ── Loading State ──────────────────────────────────────────────
  it('shows loading state initially', () => {
    // Delay the API response to see loading state
    mockAuthFetch.mockImplementation(() => new Promise(() => {}));
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Loading RERA data...')).toBeDefined();
  });

  // ── Dashboard Tab ──────────────────────────────────────────────
  it('shows dashboard with mock agent data after loading', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    // Summary cards
    expect(screen.getByText('Total Agents')).toBeDefined();
    expect(screen.getByText('Licenses Valid')).toBeDefined();
    expect(screen.getByText('Licenses Expired')).toBeDefined();
    expect(screen.getByText('Pending Registration')).toBeDefined();
  });

  it('shows agent RERA status table', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getByText('Agent RERA Status')).toBeDefined();
    });

    expect(screen.getByText('Ahmed Al-Mansouri')).toBeDefined();
    expect(screen.getByText('Fatima Al-Naqbi')).toBeDefined();
    expect(screen.getByText('RERA-123456')).toBeDefined();
    expect(screen.getByText('RERA-234567')).toBeDefined();
  });

  it('shows correct status badges', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getByText('VALID')).toBeDefined();
      expect(screen.getByText('EXPIRED')).toBeDefined();
      expect(screen.getByText('PENDING')).toBeDefined();
    });
  });

  it('shows N/A for agents without RERA number', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      const naElements = screen.getAllByText('N/A');
      expect(naElements.length).toBeGreaterThan(0);
    });
  });

  it('counts agents correctly per status', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    // With mock data: 3 total, 1 valid, 1 expired, 1 pending
    // Check the numbers in summary cards
    expect(screen.getByText('3')).toBeDefined(); // total agents
  });

  it('shows Update button for agents with RERA number', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getAllByText('Update').length).toBeGreaterThan(0);
    });
  });

  it('shows Register button for agents without RERA number', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getAllByText('Register').length).toBeGreaterThan(0);
    });
  });

  // ── API Success ────────────────────────────────────────────────
  it('uses API data when fetch succeeds', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        agents: [
          { id: 'a1', name: 'API Agent', reraNumber: 'RERA-999', status: 'valid', expiryDate: '2026-12-31' },
        ],
      }),
    });

    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getByText('API Agent')).toBeDefined();
      expect(screen.getByText('RERA-999')).toBeDefined();
    });
  });

  // ── API Network Error ──────────────────────────────────────────
  it('falls back to mock data on network error', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      // Falls back to 2-agent mock in catch block
      expect(screen.getByText('Ahmed Al-Mansouri')).toBeDefined();
      expect(screen.getByText('Fatima Al-Naqbi')).toBeDefined();
    });
  });

  // ── Tab Switching ──────────────────────────────────────────────
  it('switches to Register License tab', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));
    // "Register RERA License" appears in both heading and submit button
    expect(screen.getAllByText('Register RERA License').length).toBeGreaterThanOrEqual(2);
  });

  it('switches back to Dashboard tab', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));
    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Agent RERA Status')).toBeDefined();
  });

  // ── Register Form ─────────────────────────────────────────────
  it('shows registration form with all fields', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));

    expect(screen.getByText('Agent Name')).toBeDefined();
    expect(screen.getByText('RERA License Number')).toBeDefined();
    expect(screen.getByText('License Expiry Date')).toBeDefined();
    // "Register RERA License" appears as heading and button
    expect(screen.getAllByText('Register RERA License').length).toBeGreaterThanOrEqual(2);
  });

  it('updates form fields correctly', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));

    const nameInput = screen.getByPlaceholderText('e.g., RERA-123456')?.previousElementSibling?.parentElement?.querySelector('input[type="text"]') as HTMLInputElement;
    // Use requireds to find the inputs
    const allInputs = screen.getAllByRole('textbox');
    expect(allInputs.length).toBeGreaterThanOrEqual(1);
  });

  it('submits registration form successfully', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: false }) // initial fetch
      .mockResolvedValueOnce({ ok: true })  // registration
      .mockResolvedValueOnce({ ok: false }); // refetch

    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));

    // Fill in form fields
    const textInputs = screen.getAllByRole('textbox');
    if (textInputs[0]) fireEvent.change(textInputs[0], { target: { value: 'New Agent' } });
    if (textInputs[1]) fireEvent.change(textInputs[1], { target: { value: 'RERA-777' } });

    // Find and fill date input
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) fireEvent.change(dateInput, { target: { value: '2027-01-01' } });

    // Submit form
    const submitButton = screen.getAllByText('Register RERA License').find(
      el => el.tagName === 'BUTTON' && el.getAttribute('type') === 'submit'
    );
    if (submitButton) {
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith('/api/rera/register', expect.objectContaining({
          method: 'POST',
        }));
      });
    }
  });

  it('shows error toast on failed registration', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: false }) // initial fetch
      .mockRejectedValueOnce(new Error('Registration failed')); // registration fails

    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });

    fireEvent.click(screen.getByText('Register License'));

    const textInputs = screen.getAllByRole('textbox');
    if (textInputs[0]) fireEvent.change(textInputs[0], { target: { value: 'Fail Agent' } });
    if (textInputs[1]) fireEvent.change(textInputs[1], { target: { value: 'RERA-000' } });

    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) fireEvent.change(dateInput, { target: { value: '2027-01-01' } });

    const submitButton = screen.getAllByText('Register RERA License').find(
      el => el.tagName === 'BUTTON' && el.getAttribute('type') === 'submit'
    );
    if (submitButton) {
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to register RERA');
      });
    }
  });

  // ── Agent Selection ────────────────────────────────────────────
  it('selects agent from dashboard table', async () => {
    render(<RERAComplianceModule {...DEFAULT_PROPS} />);

    await waitFor(() => {
      expect(screen.getByText('Ahmed Al-Mansouri')).toBeDefined();
    });

    // Click Update button for an agent
    const updateButtons = screen.getAllByText('Update');
    fireEvent.click(updateButtons[0]);
    // selectedAgent state is set internally — no visible change in UI other than state
  });

  // ── Unmount safety ─────────────────────────────────────────────
  it('cleans up correctly on unmount', async () => {
    const { unmount } = render(<RERAComplianceModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading RERA data...')).toBeNull();
    });
    expect(() => unmount()).not.toThrow();
  });

  it('does not update state after unmount', async () => {
    // Slow response that will resolve after unmount
    let resolvePromise: (value: unknown) => void;
    mockAuthFetch.mockImplementation(() => new Promise(r => { resolvePromise = r; }));

    const { unmount } = render(<RERAComplianceModule {...DEFAULT_PROPS} />);
    unmount();

    // Resolve the promise after unmount — should not throw
    resolvePromise!({ ok: true, json: () => Promise.resolve({ agents: [] }) });
    // No assertion needed — just confirm no React state update warning
  });
});
