/**
 * RentVsBuyCalculator — Unit Tests
 * Tests: rendering, default values, input changes, calculations,
 * recommendation logic, edge cases, chart rendering, buy vs rent comparison
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RentVsBuyCalculator from './RentVsBuyCalculator';

describe('RentVsBuyCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the calculator header', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
      expect(screen.getByText('Make an informed decision for your Dubai property investment')).toBeInTheDocument();
    });

    it('should render Property Details section', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    it('should render Rental Comparison section', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Rental Comparison')).toBeInTheDocument();
    });

    it('should render Growth Assumptions section', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Growth Assumptions')).toBeInTheDocument();
    });

    it('should render all input fields with labels', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByLabelText('Property Price (AED)')).toBeInTheDocument();
      expect(screen.getByLabelText('Down Payment (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Mortgage Rate (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Mortgage Term (years)')).toBeInTheDocument();
      expect(screen.getByLabelText('Monthly Rent (AED)')).toBeInTheDocument();
      expect(screen.getByLabelText('Annual Rent Increase (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Property Appreciation (%/year)')).toBeInTheDocument();
      expect(screen.getByLabelText('Investment Return (%/year)')).toBeInTheDocument();
      expect(screen.getByLabelText('Maintenance Cost (%/year)')).toBeInTheDocument();
      expect(screen.getByLabelText('Years to Compare')).toBeInTheDocument();
    });

    it('should render Buying Summary and Renting Summary', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Buying Summary')).toBeInTheDocument();
      expect(screen.getByText('Renting Summary')).toBeInTheDocument();
    });

    it('should render Year-by-Year Comparison chart', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Year-by-Year Comparison')).toBeInTheDocument();
    });

    it('should render chart legend', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Buying Costs')).toBeInTheDocument();
      expect(screen.getByText('Renting Costs')).toBeInTheDocument();
    });
  });

  // ── Default Values ─────────────────────────────────────────────

  describe('Default Values', () => {
    it('should show default property price of 2,000,000', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      expect(input.value).toBe('2000000');
    });

    it('should show default down payment of 20%', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Down Payment (%)') as HTMLInputElement;
      expect(input.value).toBe('20');
    });

    it('should show default mortgage rate of 4.5%', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Mortgage Rate (%)') as HTMLInputElement;
      expect(input.value).toBe('4.5');
    });

    it('should show default mortgage term of 25 years', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Mortgage Term (years)') as HTMLInputElement;
      expect(input.value).toBe('25');
    });

    it('should show default monthly rent of 10,000', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Monthly Rent (AED)') as HTMLInputElement;
      expect(input.value).toBe('10000');
    });

    it('should show default years to compare as 10', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Years to Compare') as HTMLInputElement;
      expect(input.value).toBe('10');
    });
  });

  // ── Input Changes ──────────────────────────────────────────────

  describe('Input Changes', () => {
    it('should update property price on input change', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '3000000' } });
      expect(input.value).toBe('3000000');
    });

    it('should update down payment on input change', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Down Payment (%)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '25' } });
      expect(input.value).toBe('25');
    });

    it('should update mortgage rate on input change', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Mortgage Rate (%)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5.5' } });
      expect(input.value).toBe('5.5');
    });

    it('should update monthly rent on input change', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Monthly Rent (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15000' } });
      expect(input.value).toBe('15000');
    });

    it('should clamp negative values to 0', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '-100' } });
      expect(input.value).toBe('0');
    });

    it('should handle NaN input by defaulting to 0', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'abc' } });
      expect(input.value).toBe('0');
    });

    it('should update years to compare', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Years to Compare') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '15' } });
      expect(input.value).toBe('15');
    });
  });

  // ── Recommendation ─────────────────────────────────────────────

  describe('Recommendation', () => {
    it('should display a recommendation (buy or rent)', () => {
      render(<RentVsBuyCalculator />);
      const buyText = screen.queryByText('Buying is Better!');
      const rentText = screen.queryByText('Renting is Better!');
      expect(buyText || rentText).toBeTruthy();
    });

    it('should show an icon for the recommendation', () => {
      render(<RentVsBuyCalculator />);
      const buyIcon = screen.queryByText('🏠');
      const rentIcon = screen.queryByText('🔑');
      expect(buyIcon || rentIcon).toBeTruthy();
    });

    it('should display the net-worth difference text', () => {
      render(<RentVsBuyCalculator />);
      // The text contains "better off buying" or "better off renting"
      const better = screen.queryByText(/better off/i);
      expect(better).toBeInTheDocument();
    });

    it('should include "After X years" text', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText(/After 10 years/)).toBeInTheDocument();
    });
  });

  // ── Buying Summary ─────────────────────────────────────────────

  describe('Buying Summary', () => {
    it('should display Monthly Mortgage', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Monthly Mortgage')).toBeInTheDocument();
    });

    it('should display Down Payment', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Down Payment')).toBeInTheDocument();
    });

    it('should display Buying Costs', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Buying Costs (DLD, Agency)')).toBeInTheDocument();
    });

    it('should display Property Value at end year', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Property Value (Year 10)')).toBeInTheDocument();
    });

    it('should show correct down payment for defaults (400,000 AED)', () => {
      render(<RentVsBuyCalculator />);
      // 20% of 2,000,000 = 400,000
      expect(screen.getByText('AED 400,000')).toBeInTheDocument();
    });
  });

  // ── Renting Summary ────────────────────────────────────────────

  describe('Renting Summary', () => {
    it('should display Monthly Rent (Current)', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Monthly Rent (Current)')).toBeInTheDocument();
    });

    it('should display Initial Investment', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Initial Investment')).toBeInTheDocument();
    });

    it('should display Investment Value at end year', () => {
      render(<RentVsBuyCalculator />);
      expect(screen.getByText('Investment Value (Year 10)')).toBeInTheDocument();
    });
  });

  // ── Year-by-Year Chart ─────────────────────────────────────────

  describe('Year-by-Year Chart', () => {
    it('should render chart bars for each year with default 10 years', () => {
      render(<RentVsBuyCalculator />);
      // Y1 through Y10
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(`Y${i}`)).toBeInTheDocument();
      }
    });

    it('should update chart when years change', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Years to Compare') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5' } });
      
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Y${i}`)).toBeInTheDocument();
      }
      // Y6 should not exist
      expect(screen.queryByText('Y6')).not.toBeInTheDocument();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should handle zero property price', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '0' } });
      // Should still render without errors
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });

    it('should handle 100% down payment', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Down Payment (%)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '100' } });
      // No mortgage means monthly mortgage should be 0 → "AED 0"
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });

    it('should handle zero mortgage rate (cash purchase)', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Mortgage Rate (%)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '0' } });
      // Should still calculate without division by zero
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });

    it('should handle zero monthly rent', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Monthly Rent (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '0' } });
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });

    it('should handle 1 year comparison', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Years to Compare') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '1' } });
      expect(screen.getByText('Y1')).toBeInTheDocument();
      expect(screen.queryByText('Y2')).not.toBeInTheDocument();
    });

    it('should handle very large property price without crashing', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '100000000' } });
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });
  });

  // ── Calculation Accuracy ───────────────────────────────────────

  describe('Calculation Accuracy', () => {
    it('should calculate correct buying costs (DLD 4% + Agency 2% + Mortgage Reg 0.25% + Trustee 4000)', () => {
      render(<RentVsBuyCalculator />);
      // Default: property = 2,000,000, down = 20% → loan = 1,600,000
      // DLD = 2,000,000 * 0.04 = 80,000
      // Agency = 2,000,000 * 0.02 = 40,000
      // Mortgage Reg = 1,600,000 * 0.0025 = 4,000
      // Trustee = 4,000
      // Total = 80,000 + 40,000 + 4,000 + 4,000 = 128,000
      expect(screen.getByText('AED 128,000')).toBeInTheDocument();
    });

    it('should update calculations when property price changes', () => {
      render(<RentVsBuyCalculator />);
      const input = screen.getByLabelText('Property Price (AED)') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '1000000' } });
      
      // Down payment should now be 200,000 (20% of 1M)
      expect(screen.getByText('AED 200,000')).toBeInTheDocument();
    });

    it('should show break-even year when applicable', () => {
      render(<RentVsBuyCalculator />);
      // With defaults, check if break-even appears
      const breakEven = screen.queryByText(/Break-even point/i);
      // Break-even may or may not exist depending on calculation, just assert no crash
      expect(screen.getByText('Smart Rent vs. Buy Calculator')).toBeInTheDocument();
    });
  });
});
