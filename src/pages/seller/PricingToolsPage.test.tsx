import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('../RolePages.css', () => ({}));

// Mock formatCurrency
vi.mock('../../utils', () => ({
  formatCurrency: (amount: number) => `AED ${amount?.toLocaleString('en-US') ?? '0'}`,
}));

// Mock Config
vi.mock('../../config/constants', () => ({
  Config: {
    DLD_FEES: {
      TRANSFER_FEE_RATE: 0.04,
      NOC_FEE: 5000,
    },
    REAL_ESTATE: {
      AGENCY_COMMISSION_RATE: 0.02,
    },
  },
}));

import PricingToolsPage from './PricingToolsPage';

describe('PricingToolsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders page title', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Pricing Tools')).toBeInTheDocument();
    });

    it('renders page description', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Get market insights and estimate your property value')).toBeInTheDocument();
    });

    it('renders Property Details heading', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    it('renders Valuation heading', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Valuation')).toBeInTheDocument();
    });
  });

  // ── Form Inputs ────────────────────────────────────────────
  describe('form inputs', () => {
    it('renders Property Type select', () => {
      render(<PricingToolsPage />);
      expect(screen.getByLabelText('Property Type')).toBeInTheDocument();
    });

    it('renders Location select', () => {
      render(<PricingToolsPage />);
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
    });

    it('renders Bedrooms select', () => {
      render(<PricingToolsPage />);
      expect(screen.getByLabelText('Bedrooms')).toBeInTheDocument();
    });

    it('renders Property Size input', () => {
      render(<PricingToolsPage />);
      expect(screen.getByLabelText('Property Size (sqft)')).toBeInTheDocument();
    });

    it('renders all property type options', () => {
      render(<PricingToolsPage />);
      const select = screen.getByLabelText('Property Type') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      expect(options).toEqual(['Apartment', 'Villa', 'Townhouse', 'Penthouse']);
    });

    it('renders all location options', () => {
      render(<PricingToolsPage />);
      const select = screen.getByLabelText('Location') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      expect(options).toContain('Dubai Marina');
      expect(options).toContain('Downtown Dubai');
      expect(options).toContain('Palm Jumeirah');
      expect(options).toContain('JBR');
      expect(options).toContain('Emirates Hills');
      expect(options).toContain('Arabian Ranches');
    });

    it('renders bedroom options from Studio to 5+', () => {
      render(<PricingToolsPage />);
      const select = screen.getByLabelText('Bedrooms') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      expect(options).toContain('Studio');
      expect(options).toContain('5+ Bedrooms');
    });
  });

  // ── Default Calculations ───────────────────────────────────
  describe('default calculations', () => {
    it('defaults to apartment in Dubai Marina', () => {
      render(<PricingToolsPage />);
      const typeSelect = screen.getByLabelText('Property Type') as HTMLSelectElement;
      const locSelect = screen.getByLabelText('Location') as HTMLSelectElement;
      expect(typeSelect.value).toBe('apartment');
      expect(locSelect.value).toBe('dubai-marina');
    });

    it('defaults to 1500 sqft', () => {
      render(<PricingToolsPage />);
      const input = screen.getByLabelText('Property Size (sqft)') as HTMLInputElement;
      expect(input.value).toBe('1500');
    });

    it('calculates estimated price (2100 × 1500 = 3,150,000)', () => {
      render(<PricingToolsPage />);
      // Dubai Marina apartment = 2100/sqft × 1500 sqft = 3,150,000
      expect(screen.getByText('AED 3,150,000')).toBeInTheDocument();
    });

    it('renders Estimated Price label', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Estimated Price')).toBeInTheDocument();
    });

    it('renders Price Range label', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });

    it('renders Net Proceeds label', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Net Proceeds')).toBeInTheDocument();
    });

    it('renders price range (±10%)', () => {
      render(<PricingToolsPage />);
      // Low: 3,150,000 * 0.9 = 2,835,000; High: 3,150,000 * 1.1 = 3,465,000
      expect(screen.getByText(/AED 2,835,000/)).toBeInTheDocument();
      expect(screen.getByText(/AED 3,465,000/)).toBeInTheDocument();
    });
  });

  // ── Input Changes ──────────────────────────────────────────
  describe('input changes', () => {
    it('recalculates when location changes', () => {
      render(<PricingToolsPage />);
      const locSelect = screen.getByLabelText('Location');
      fireEvent.change(locSelect, { target: { value: 'downtown' } });
      // Downtown apartment = 2500/sqft × 1500 = 3,750,000
      expect(screen.getByText('AED 3,750,000')).toBeInTheDocument();
    });

    it('recalculates when property type changes', () => {
      render(<PricingToolsPage />);
      const locSelect = screen.getByLabelText('Location');
      fireEvent.change(locSelect, { target: { value: 'palm-jumeirah' } });
      const typeSelect = screen.getByLabelText('Property Type');
      fireEvent.change(typeSelect, { target: { value: 'villa' } });
      // Palm Jumeirah villa = 3500/sqft × 1500 = 5,250,000
      expect(screen.getByText('AED 5,250,000')).toBeInTheDocument();
    });

    it('recalculates when sqft changes', () => {
      render(<PricingToolsPage />);
      const input = screen.getByLabelText('Property Size (sqft)');
      fireEvent.change(input, { target: { value: '2000' } });
      // Dubai Marina apartment = 2100/sqft × 2000 = 4,200,000
      expect(screen.getByText('AED 4,200,000')).toBeInTheDocument();
    });

    it('falls back to 2000/sqft for missing market data', () => {
      render(<PricingToolsPage />);
      // Dubai Marina villa = 0 → fallback 2000
      const typeSelect = screen.getByLabelText('Property Type');
      fireEvent.change(typeSelect, { target: { value: 'villa' } });
      // 2000 × 1500 = 3,000,000
      expect(screen.getByText('AED 3,000,000')).toBeInTheDocument();
    });

    it('updates bedroom selection', () => {
      render(<PricingToolsPage />);
      const bedsSelect = screen.getByLabelText('Bedrooms') as HTMLSelectElement;
      fireEvent.change(bedsSelect, { target: { value: '3' } });
      expect(bedsSelect.value).toBe('3');
    });
  });

  // ── Net Proceeds ───────────────────────────────────────────
  describe('net proceeds', () => {
    it('shows Net Proceeds heading', () => {
      render(<PricingToolsPage />);
      expect(screen.getByText('Net Proceeds (After Costs)')).toBeInTheDocument();
    });

    it('calculates net proceeds correctly for default values', () => {
      render(<PricingToolsPage />);
      // Estimated: 3,150,000
      // DLD fee: 3,150,000 * 0.02 = 63,000 (seller half)
      // Agency: 3,150,000 * 0.02 = 63,000
      // NOC: 5,000
      // Total costs: 131,000
      // Net: 3,150,000 - 131,000 = 3,019,000
      expect(screen.getByText('AED 3,019,000')).toBeInTheDocument();
    });
  });
});
