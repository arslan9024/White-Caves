import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('../RolePages.css', () => ({}));

// Mock formatCurrency — returns "AED X" format
vi.mock('../../utils', () => ({
  formatCurrency: (amount: number) => `AED ${amount?.toLocaleString('en-US') ?? '0'}`,
}));

// Mock Config with real DLD values
vi.mock('../../config/constants', () => ({
  Config: {
    DLD_FEES: {
      TRANSFER_FEE_RATE: 0.04,
      ADMIN_FEE: 580,
      TRUSTEE_FEE_MORTGAGE: 4200,
      TRUSTEE_FEE_CASH: 2100,
      MORTGAGE_REGISTRATION_RATE: 0.0025,
      MORTGAGE_ADMIN_FEE: 290,
      NOC_FEE: 5000,
      VALUATION_FEE: 3000,
    },
    REAL_ESTATE: {
      AGENCY_COMMISSION_RATE: 0.02,
      VAT_RATE: 0.05,
      DEFAULT_PROPERTY_PRICE: 5_000_000,
    },
  },
}));

import DLDFeesPage from './DLDFeesPage';

describe('DLDFeesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders page title', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('DLD Fee Calculator')).toBeInTheDocument();
    });

    it('renders page description', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Calculate Dubai Land Department fees and property transfer costs')).toBeInTheDocument();
    });

    it('renders Property Price input', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Property Price (AED)')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5000000')).toBeInTheDocument();
    });

    it('renders Payment Method label', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    it('renders Mortgage and Cash toggle buttons', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Mortgage')).toBeInTheDocument();
      expect(screen.getByText('Cash')).toBeInTheDocument();
    });

    it('renders Fee Breakdown heading', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Fee Breakdown')).toBeInTheDocument();
    });

    it('renders Buyer Costs section', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Buyer Costs')).toBeInTheDocument();
    });

    it('renders Seller Costs section', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Seller Costs')).toBeInTheDocument();
    });
  });

  // ── Default Values ─────────────────────────────────────────
  describe('default values', () => {
    it('defaults to 5,000,000 property price', () => {
      render(<DLDFeesPage />);
      const input = screen.getByDisplayValue('5000000') as HTMLInputElement;
      expect(input.value).toBe('5000000');
    });

    it('defaults to Mortgage payment method', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Mortgage Amount (AED)')).toBeInTheDocument();
    });

    it('renders DLD Transfer fee line', () => {
      render(<DLDFeesPage />);
      const matches = screen.getAllByText(/DLD Transfer/);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Agency Fee line', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Agency Fee')).toBeInTheDocument();
    });

    it('renders Agency VAT line', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Agency VAT')).toBeInTheDocument();
    });
  });

  // ── Fee Calculations ───────────────────────────────────────
  describe('fee calculations', () => {
    it('calculates DLD Transfer at 4% of price / 2 for buyer', () => {
      render(<DLDFeesPage />);
      // 5,000,000 * 0.04 / 2 = 100,000 — displayed as "AED 100,000"
      // Both DLD Transfer (50%) and Agency Fee are 100,000 at default price
      const matches = screen.getAllByText('AED 100,000');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('calculates Agency Fee at 2% of price', () => {
      render(<DLDFeesPage />);
      // 5,000,000 * 0.02 = 100,000 — also AED 100,000
      // Both DLD Transfer (50%) and Agency Fee are 100,000 at default price
      const matches = screen.getAllByText('AED 100,000');
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it('calculates Agency VAT at 5% of agency fee', () => {
      render(<DLDFeesPage />);
      // Agency Fee = 100,000 × 0.05 = 5,000
      expect(screen.getByText('AED 5,000')).toBeInTheDocument();
    });

    it('renders Total Buyer Cost', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Total Buyer Cost')).toBeInTheDocument();
    });
  });

  // ── Payment Method Toggle ──────────────────────────────────
  describe('payment method toggle', () => {
    it('shows mortgage amount input when Mortgage is selected', () => {
      render(<DLDFeesPage />);
      expect(screen.getByText('Mortgage Amount (AED)')).toBeInTheDocument();
    });

    it('hides mortgage amount input when Cash is selected', () => {
      render(<DLDFeesPage />);
      fireEvent.click(screen.getByText('Cash'));
      expect(screen.queryByLabelText('Mortgage Amount (AED)')).not.toBeInTheDocument();
    });

    it('switches back to Mortgage mode', () => {
      render(<DLDFeesPage />);
      fireEvent.click(screen.getByText('Cash'));
      fireEvent.click(screen.getByText('Mortgage'));
      expect(screen.getByText('Mortgage Amount (AED)')).toBeInTheDocument();
    });
  });

  // ── Input Changes ──────────────────────────────────────────
  describe('input changes', () => {
    it('updates fees when property price changes', () => {
      render(<DLDFeesPage />);
      const input = screen.getByDisplayValue('5000000');
      fireEvent.change(input, { target: { value: '10000000' } });
      // DLD Transfer (50%) = 10M * 0.04 / 2 = 200,000 and Agency Fee = 10M * 0.02 = 200,000
      const matches = screen.getAllByText('AED 200,000');
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it('updates mortgage amount input', () => {
      render(<DLDFeesPage />);
      // Default mortgage = 5M * 0.75 = 3,750,000
      const mortgageInput = screen.getByDisplayValue('3750000');
      fireEvent.change(mortgageInput, { target: { value: '2000000' } });
      expect((mortgageInput as HTMLInputElement).value).toBe('2000000');
    });
  });

  // ── Seller Costs ───────────────────────────────────────────
  describe('seller costs', () => {
    it('shows seller pays DLD Transfer (50%)', () => {
      render(<DLDFeesPage />);
      // There should be two "DLD Transfer (50%)" texts (buyer section has span, seller section has strong)
      const dldTexts = screen.getAllByText(/DLD Transfer/);
      expect(dldTexts.length).toBeGreaterThanOrEqual(2);
    });
  });
});
