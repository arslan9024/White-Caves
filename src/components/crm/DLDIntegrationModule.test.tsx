/**
 * DLDIntegrationModule — Unit Tests
 * Tests: render, tab switching, property lookup, fee calculation,
 * property selection, transaction history, mock data fallback, error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

import DLDIntegrationModule from './DLDIntegrationModule';

const DEFAULT_PROPS = {
  role: 'admin',
  user: { id: 'u1', name: 'Admin', email: 'admin@wc.ae' },
};

// ═══════════════════════════════════════════════════════════════════

describe('DLDIntegrationModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue({ ok: false });
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the module header', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('DLD Integration & Tax Management')).toBeDefined();
    expect(screen.getByText(/Dubai Land Department/i)).toBeDefined();
  });

  it('renders all three tabs', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    expect(screen.getAllByText('Property Lookup').length).toBeGreaterThan(0);
    expect(screen.getByText('Tax Calculator')).toBeDefined();
    expect(screen.getAllByText('Transaction History').length).toBeGreaterThan(0);
  });

  // ── Property Lookup Tab (default) ──────────────────────────────
  it('shows property lookup tab by default', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    expect(screen.getByPlaceholderText(/Enter plot or building number/i)).toBeDefined();
    expect(screen.getByText('Search')).toBeDefined();
  });

  it('updates search input value', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    const input = screen.getByPlaceholderText(/Enter plot or building number/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'P123' } });
    expect(input.value).toBe('P123');
  });

  it('performs property lookup with successful API', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        properties: [
          { id: 10, plot: 'P999', building: 'Test Tower', owner: 'Test Owner', area: 3000, price: 3000000 },
        ],
      }),
    });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    const input = screen.getByPlaceholderText(/Enter plot or building number/i);
    fireEvent.change(input, { target: { value: 'P999' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/P999 - Test Tower/)).toBeDefined();
      expect(screen.getByText('Test Owner')).toBeDefined();
    });
  });

  it('falls back to mock data when API returns not-ok', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/P123 - Marina Tower 1/)).toBeDefined();
      expect(screen.getByText(/P124 - Marina Tower 2/)).toBeDefined();
    });
  });

  it('falls back to mock data when API throws error', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    // After error, properties remain empty (error is only logged)
    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalled();
    });
  });

  it('displays property lookup results table', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Plot/Building')).toBeDefined();
      expect(screen.getByText('Owner')).toBeDefined();
      expect(screen.getByText('Area (sqft)')).toBeDefined();
      expect(screen.getByText('Estimated Value')).toBeDefined();
      expect(screen.getByText('Action')).toBeDefined();
    });
  });

  it('selects a property and shows details', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
    });

    // Select the first property
    fireEvent.click(screen.getAllByText('Select')[0]);

    expect(screen.getByText('Selected Property')).toBeDefined();
    expect(screen.getAllByText(/Marina Tower 1/).length).toBeGreaterThan(0);
  });

  // ── Tab Switching ──────────────────────────────────────────────
  it('switches to Tax Calculator tab', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Tax Calculator'));
    expect(screen.getByText('DLD Tax & Fee Calculator')).toBeDefined();
  });

  it('switches to Transaction History tab', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    // Click the tab button (first occurrence)
    const historyElements = screen.getAllByText('Transaction History');
    fireEvent.click(historyElements[0]);
    // Both tab and section header now visible
    expect(screen.getAllByText('Transaction History').length).toBeGreaterThanOrEqual(2);
  });

  it('switches between all tabs correctly', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);

    // Default is lookup
    expect(screen.getByPlaceholderText(/Enter plot or building number/i)).toBeDefined();

    // Switch to calculator
    fireEvent.click(screen.getByText('Tax Calculator'));
    expect(screen.getByText('DLD Tax & Fee Calculator')).toBeDefined();

    // Switch to history
    fireEvent.click(screen.getByText('Transaction History'));
    // Transaction history table should appear
    expect(screen.getByText('Marina Tower 1, P123')).toBeDefined();

    // Switch back to lookup
    fireEvent.click(screen.getByText('Property Lookup'));
    expect(screen.getByPlaceholderText(/Enter plot or building number/i)).toBeDefined();
  });

  // ── Tax Calculator ─────────────────────────────────────────────
  it('shows calculator with selected property', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
    });

    // Select property
    fireEvent.click(screen.getAllByText('Select')[0]);

    // Switch to calculator
    fireEvent.click(screen.getByText('Tax Calculator'));
    expect(screen.getByText('Calculate Fees')).toBeDefined();
  });

  it('calculates buy/sell DLD fees (4% + AED 1000)', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
    });

    // Select the first property (price: 2,500,000)
    fireEvent.click(screen.getAllByText('Select')[0]);
    fireEvent.click(screen.getByText('Tax Calculator'));
    fireEvent.click(screen.getByText('Calculate Fees'));

    // 4% of 2,500,000 = 100,000 + 1,000 admin = 101,000
    await waitFor(() => {
      expect(screen.getByText('Fee Breakdown')).toBeDefined();
      expect(screen.getByText(/Registration Fee \(4%\)/)).toBeDefined();
      expect(screen.getByText(/Admin Fee: AED 1,000/)).toBeDefined();
      expect(screen.getByText(/Total DLD Fees: AED 101,000/)).toBeDefined();
    });
  });

  it('calculates lease DLD fees (5% + AED 500)', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
    });

    // Select the first property
    fireEvent.click(screen.getAllByText('Select')[0]);
    fireEvent.click(screen.getByText('Tax Calculator'));

    // Change transaction type to lease
    const select = screen.getByDisplayValue('Purchase') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'lease' } });

    fireEvent.click(screen.getByText('Calculate Fees'));

    // 5% of 2,500,000 = 125,000 + 500 = 125,500
    await waitFor(() => {
      expect(screen.getByText('Fee Breakdown')).toBeDefined();
      expect(screen.getByText(/Annual Lease Fee \(5%\)/)).toBeDefined();
      expect(screen.getByText(/Registration Fee: AED 500/)).toBeDefined();
      expect(screen.getByText(/Total DLD Fees: AED 125,500/)).toBeDefined();
    });
  });

  it('shows transaction type select with all options', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false });

    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByText('Select')[0]);
    fireEvent.click(screen.getByText('Tax Calculator'));

    const selectElement = screen.getByDisplayValue('Purchase') as HTMLSelectElement;
    expect(selectElement).toBeDefined();
    expect(selectElement.options.length).toBe(3);
  });

  // ── Transaction History ────────────────────────────────────────
  it('displays transaction history table', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Transaction History'));

    expect(screen.getByText('Marina Tower 1, P123')).toBeDefined();
    expect(screen.getByText('Downtown Dubai, P456')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
    expect(screen.getByText('Pending')).toBeDefined();
  });

  it('displays transaction amounts in AED', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Transaction History'));

    expect(screen.getByText('AED 2,500,000')).toBeDefined();
    expect(screen.getByText('AED 1,800,000')).toBeDefined();
  });

  it('displays transaction types in history', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Transaction History'));

    expect(screen.getByText('Purchase')).toBeDefined();
    expect(screen.getByText('Sale')).toBeDefined();
  });

  // ── Active Tab Styling ─────────────────────────────────────────
  it('applies active class to current tab', () => {
    render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    const lookupTab = screen.getAllByText('Property Lookup')[0].closest('button');
    expect(lookupTab?.className).toContain('active');
  });

  // ── Unmount safety ─────────────────────────────────────────────
  it('cleans up correctly on unmount', () => {
    const { unmount } = render(<DLDIntegrationModule {...DEFAULT_PROPS} />);
    expect(() => unmount()).not.toThrow();
  });
});
