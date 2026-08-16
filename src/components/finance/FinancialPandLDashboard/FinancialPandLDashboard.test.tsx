import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FinancialPandLDashboard } from './FinancialPandLDashboard';

describe('FinancialPandLDashboard Component', () => {
  it('renders P&L financial dashboard with budget-vs-actual variance and net profit', () => {
    render(<FinancialPandLDashboard />);
    expect(screen.getByTestId('financial-pandl-dashboard')).toBeDefined();
    expect(screen.getByText(/P&L Dashboard — 2025/i)).toBeDefined();
    expect(screen.getAllByText(/NET PROFIT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Commission Income/i)).toBeDefined();
  });
});
