/**
 * MortgageCalculatorPage — Unit Tests
 * Tests: default render, calculations, user interactions, amortization
 * Covers: UI rendering, mortgage math, slider interactions, edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock dependencies
vi.mock('../../utils', () => ({
  formatCurrency: (amount: number) => `AED ${Math.round(amount).toLocaleString()}`,
}));
vi.mock('../../config/constants', () => ({
  Config: {
    REAL_ESTATE: { DEFAULT_PROPERTY_PRICE: 5_000_000 },
    MORTGAGE: {
      DEFAULT_DOWN_PAYMENT: 25,
      DEFAULT_INTEREST_RATE: 4.99,
      DEFAULT_LOAN_TERM: 25,
    },
  },
}));

import MortgageCalculatorPage from './MortgageCalculatorPage';

describe('MortgageCalculatorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Render ────────────────────────────────────────────────────
  it('renders the page with title and description', () => {
    render(<MortgageCalculatorPage />);
    expect(screen.getByText('Mortgage Calculator')).toBeDefined();
    expect(screen.getByText(/calculate your monthly payments/i)).toBeDefined();
  });

  it('renders all input labels', () => {
    render(<MortgageCalculatorPage />);
    expect(screen.getByText('Property Price (AED)')).toBeDefined();
    expect(screen.getByText('Down Payment (%)')).toBeDefined();
    expect(screen.getByText('Interest Rate (%)')).toBeDefined();
    expect(screen.getByText('Loan Term (Years)')).toBeDefined();
  });

  it('renders all result sections', () => {
    render(<MortgageCalculatorPage />);
    expect(screen.getByText('Loan Amount')).toBeDefined();
    expect(screen.getByText('Monthly Payment')).toBeDefined();
    expect(screen.getByText(/Total Interest Over/)).toBeDefined();
    expect(screen.getByText('Total Amount Paid')).toBeDefined();
  });

  // ── Default Calculations ──────────────────────────────────────
  it('calculates correct default loan amount (75% of 5M = 3,750,000)', () => {
    render(<MortgageCalculatorPage />);
    // Loan = 5,000,000 * (1 - 25/100) = 3,750,000
    expect(screen.getByText('AED 3,750,000')).toBeDefined();
  });

  it('displays default down payment percentage and amount', () => {
    render(<MortgageCalculatorPage />);
    // Down payment = 25% of 5,000,000 = 1,250,000
    expect(screen.getByText(/25%.*AED 1,250,000/)).toBeDefined();
  });

  it('displays default interest rate', () => {
    render(<MortgageCalculatorPage />);
    expect(screen.getByText('4.99%')).toBeDefined();
  });

  it('displays default loan term', () => {
    render(<MortgageCalculatorPage />);
    expect(screen.getByText('25 years')).toBeDefined();
  });

  // ── Mortgage Math Verification ────────────────────────────────
  it('calculates monthly payment correctly with standard amortization formula', () => {
    render(<MortgageCalculatorPage />);
    // Manual calculation:
    // Loan = 3,750,000, rate = 4.99/100/12 = 0.0041583, n = 300
    // Monthly = 3750000 * (0.0041583 * 1.0041583^300) / (1.0041583^300 - 1)
    // ≈ 21,917 AED
    const monthlyPaymentElements = screen.getAllByText(/AED 2[12],\d{3}/);
    expect(monthlyPaymentElements.length).toBeGreaterThan(0);
  });

  it('shows total interest over loan term', () => {
    render(<MortgageCalculatorPage />);
    // Total interest = (monthly * 300) - 3,750,000 > 2M AED
    expect(screen.getByText(/Total Interest Over 25 Years/)).toBeDefined();
  });

  // ── Slider Interactions ───────────────────────────────────────
  it('updates loan amount when property price changes', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');
    const priceSlider = sliders[0]; // first slider is property price

    fireEvent.change(priceSlider, { target: { value: '10000000' } });

    // New loan = 10,000,000 * 0.75 = 7,500,000
    expect(screen.getByText('AED 7,500,000')).toBeDefined();
  });

  it('updates down payment calculation when slider changes', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');
    const downPaymentSlider = sliders[1]; // second slider

    fireEvent.change(downPaymentSlider, { target: { value: '50' } });

    // New down payment = 50% of 5,000,000 = 2,500,000
    expect(screen.getByText(/50%.*AED 2,500,000/)).toBeDefined();
    // Loan = 2,500,000
    expect(screen.getByText('AED 2,500,000')).toBeDefined();
  });

  it('updates interest rate display when slider changes', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');
    const rateSlider = sliders[2]; // third slider

    fireEvent.change(rateSlider, { target: { value: '3.5' } });

    expect(screen.getByText('3.50%')).toBeDefined();
  });

  it('updates loan term when slider changes', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');
    const termSlider = sliders[3]; // fourth slider

    fireEvent.change(termSlider, { target: { value: '15' } });

    expect(screen.getByText('15 years')).toBeDefined();
    expect(screen.getByText(/Total Interest Over 15 Years/)).toBeDefined();
  });

  // ── Edge Cases ────────────────────────────────────────────────
  it('handles minimum property price (500K)', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');

    fireEvent.change(sliders[0], { target: { value: '500000' } });

    // Loan = 500,000 * 0.75 = 375,000
    expect(screen.getByText('AED 375,000')).toBeDefined();
  });

  it('handles maximum down payment (80%)', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');

    fireEvent.change(sliders[1], { target: { value: '80' } });

    // Loan = 5,000,000 * 0.2 = 1,000,000
    expect(screen.getByText('AED 1,000,000')).toBeDefined();
  });

  it('handles minimum loan term (5 years)', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');

    fireEvent.change(sliders[3], { target: { value: '5' } });

    expect(screen.getByText('5 years')).toBeDefined();
    expect(screen.getByText(/Total Interest Over 5 Years/)).toBeDefined();
  });

  // ── Multiple slider changes ───────────────────────────────────
  it('recalculates after multiple slider changes', () => {
    render(<MortgageCalculatorPage />);
    const sliders = screen.getAllByRole('slider');

    // Set to 2M at 40% down, 3% rate, 10 years
    fireEvent.change(sliders[0], { target: { value: '2000000' } });
    fireEvent.change(sliders[1], { target: { value: '40' } });
    fireEvent.change(sliders[2], { target: { value: '3' } });
    fireEvent.change(sliders[3], { target: { value: '10' } });

    // Loan = 2,000,000 * 0.6 = 1,200,000
    expect(screen.getByText('AED 1,200,000')).toBeDefined();
    expect(screen.getByText('10 years')).toBeDefined();
    expect(screen.getByText('3.00%')).toBeDefined();
  });
});
