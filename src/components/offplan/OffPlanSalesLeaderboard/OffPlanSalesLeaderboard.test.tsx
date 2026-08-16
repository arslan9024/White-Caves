import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OffPlanSalesLeaderboard } from './OffPlanSalesLeaderboard';

describe('OffPlanSalesLeaderboard Component', () => {
  it('renders off-plan sales leaderboard and top broker ranks', () => {
    render(<OffPlanSalesLeaderboard />);
    expect(screen.getByTestId('off-plan-sales-leaderboard')).toBeDefined();
    expect(screen.getByText(/Off-Plan Sales Leaderboard & Target Gauge Cockpit/i)).toBeDefined();
    expect(screen.getByText(/MONTHLY SALES SPRINT/i)).toBeDefined();
    expect(screen.getByText(/AED 316\.5M/i)).toBeDefined();
    expect(screen.getByText(/Arsalan Malik/i)).toBeDefined();
    expect(screen.getByText(/AED 142\.0M/i)).toBeDefined();
    expect(screen.getByText(/Sarah Connor/i)).toBeDefined();
  });
});
