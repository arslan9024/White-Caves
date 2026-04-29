/**
 * PropertyValuationModule — Unit Tests
 * Tests: render, tab switching, form interactions, valuation calculation,
 * API call, fallback estimation, comparables display, market analysis
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

import PropertyValuationModule from './PropertyValuationModule';

const DEFAULT_PROPS = {
  role: 'admin',
  user: { id: 'u1', name: 'Admin', email: 'admin@wc.ae' },
};

// ═══════════════════════════════════════════════════════════════════

describe('PropertyValuationModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the module header', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Property Valuation Tools')).toBeDefined();
    expect(screen.getByText(/ML-based property price estimation/i)).toBeDefined();
  });

  it('renders both tabs', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Valuation Calculator')).toBeDefined();
    expect(screen.getByText('Market Analysis')).toBeDefined();
  });

  // ── Valuation Tab (default) ─────────────────────────────────────
  it('shows valuation calculator by default', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Property Valuation Calculator')).toBeDefined();
  });

  it('renders all form fields', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Location')).toBeDefined();
    expect(screen.getByText('Property Type')).toBeDefined();
    expect(screen.getByText('Area (sqft)')).toBeDefined();
    expect(screen.getByText('Bedrooms')).toBeDefined();
    expect(screen.getByText('Bathrooms')).toBeDefined();
    expect(screen.getByText('Property Age (years)')).toBeDefined();
  });

  it('renders the Estimate Value button', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Estimate Value')).toBeDefined();
  });

  it('has correct default form values', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    const areaInput = screen.getByDisplayValue('1500');
    expect(areaInput).toBeDefined();
    // bedrooms=2 and bathrooms=2 both match '2'
    const twoValueInputs = screen.getAllByDisplayValue('2');
    expect(twoValueInputs.length).toBe(2);
  });

  // ── Form Interactions ───────────────────────────────────────────
  it('updates location when changed', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    const selects = screen.getAllByRole('combobox');
    const locationSelect = selects[0]; // first combobox is location
    fireEvent.change(locationSelect, { target: { value: 'Marina' } });
    expect((locationSelect as HTMLSelectElement).value).toBe('Marina');
  });

  it('updates property type when changed', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects[1]; // second combobox is type
    fireEvent.change(typeSelect, { target: { value: 'villa' } });
    expect((typeSelect as HTMLSelectElement).value).toBe('villa');
  });

  it('updates area when changed', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    const areaInput = screen.getByDisplayValue('1500');
    fireEvent.change(areaInput, { target: { value: '2000' } });
    expect((areaInput as HTMLInputElement).value).toBe('2000');
  });

  it('updates bedrooms when changed', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    // The first spinbutton with value "2" is bedrooms
    const spinbuttons = screen.getAllByRole('spinbutton');
    const bedroomInput = spinbuttons.find((el) => (el as HTMLInputElement).value === '2');
    if (bedroomInput) {
      fireEvent.change(bedroomInput, { target: { value: '4' } });
      expect((bedroomInput as HTMLInputElement).value).toBe('4');
    }
  });

  // ── API Valuation (Success) ─────────────────────────────────────
  it('calls the valuation API when Estimate Value is clicked', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        estimate: { low: 2700000, mid: 3000000, high: 3300000, confidence: 85 },
        comparables: [],
      }),
    });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/valuation/estimate', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('displays valuation results after successful API call', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        estimate: { low: 2700000, mid: 3000000, high: 3300000, confidence: 85 },
        comparables: [
          { property: 'Test Property', price: 3000000, area: 1500, pricePerSqft: 2000 },
        ],
      }),
    });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      expect(screen.getByText('Estimated Value')).toBeDefined();
      expect(screen.getByText('Low Estimate')).toBeDefined();
      expect(screen.getByText('Mid Estimate')).toBeDefined();
      expect(screen.getByText('High Estimate')).toBeDefined();
      expect(screen.getByText(/AED 2,700,000/)).toBeDefined();
      // Mid/High values may match multiple elements (e.g., comparable table)
      expect(screen.getAllByText(/AED 3,000,000/).length).toBeGreaterThan(0);
      expect(screen.getByText(/AED 3,300,000/)).toBeDefined();
      expect(screen.getByText(/Confidence Level: 85%/)).toBeDefined();
    });
  });

  it('displays comparable properties table', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        estimate: { low: 2700000, mid: 3000000, high: 3300000, confidence: 85 },
        comparables: [
          { property: 'Marina Tower 1', price: 2100000, area: 1500, pricePerSqft: 1400 },
          { property: 'JBR Suite', price: 1900000, area: 1200, pricePerSqft: 1580 },
        ],
      }),
    });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      expect(screen.getByText('Comparable Properties')).toBeDefined();
      expect(screen.getByText('Marina Tower 1')).toBeDefined();
      expect(screen.getByText('JBR Suite')).toBeDefined();
    });
  });

  // ── API Fallback ────────────────────────────────────────────────
  it('uses fallback estimation when API fails', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      expect(screen.getByText('Estimated Value')).toBeDefined();
      // Fallback: 2000 * 1500 = 3,000,000. Low = 2,700,000
      expect(screen.getByText(/AED 2,700,000/)).toBeDefined();
      expect(screen.getByText(/Confidence Level: 60%/)).toBeDefined();
    });
  });

  it('fallback applies Marina multiplier for Marina location', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    // Set location to Marina
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Marina' } });
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      // Fallback: 2000 * 1500 * 1.3 = 3,900,000. Mid = 3,900,000
      expect(screen.getByText(/AED 3,900,000/)).toBeDefined();
    });
  });

  it('fallback shows dummy comparable properties', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    await waitFor(() => {
      expect(screen.getByText('Marina Tower 1 - 2BR')).toBeDefined();
      expect(screen.getByText('JBR - 2BR')).toBeDefined();
      expect(screen.getByText('Downtown - 2BR')).toBeDefined();
    });
  });

  // ── Network Error ───────────────────────────────────────────────
  it('handles network error gracefully', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Estimate Value'));

    // Should still render, no crash
    await waitFor(() => {
      expect(screen.getByText('Property Valuation Calculator')).toBeDefined();
    });
  });

  // ── Tab Switching ───────────────────────────────────────────────
  it('switches to Market Analysis tab', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Market Analysis'));
    // 'Market Analysis' appears in both the tab and the heading
    expect(screen.getAllByText(/Market Analysis/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Price Trend/)).toBeDefined();
    expect(screen.getByText(/Average growth: 3-5%/)).toBeDefined();
  });

  it('switches back to Valuation tab', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Market Analysis'));
    fireEvent.click(screen.getByText('Valuation Calculator'));
    expect(screen.getByText('Property Valuation Calculator')).toBeDefined();
  });

  // ── Location Options ────────────────────────────────────────────
  it('renders all location options', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Marina')).toBeDefined();
    expect(screen.getByText('Downtown Dubai')).toBeDefined();
    expect(screen.getByText('Jumeirah Beach Residence')).toBeDefined();
    expect(screen.getByText('The Palm')).toBeDefined();
  });

  it('renders all property type options', () => {
    render(<PropertyValuationModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Apartment')).toBeDefined();
    expect(screen.getByText('Villa')).toBeDefined();
    expect(screen.getByText('Townhouse')).toBeDefined();
    expect(screen.getByText('Commercial')).toBeDefined();
  });
});
