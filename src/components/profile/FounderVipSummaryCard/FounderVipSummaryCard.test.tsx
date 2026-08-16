import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FounderVipSummaryCard } from './FounderVipSummaryCard';

describe('FounderVipSummaryCard Component', () => {
  it('renders founder VIP summary card and executive credential badges', () => {
    render(<FounderVipSummaryCard />);
    expect(screen.getByTestId('founder-vip-summary-card')).toBeDefined();
    expect(screen.getByText(/Arsalan Malik/i)).toBeDefined();
    expect(screen.getByText(/Founder, Managing Director & Chief Executive/i)).toBeDefined();
    expect(screen.getByText(/LEVEL 5 SOVEREIGN SUPERUSER/i)).toBeDefined();
    expect(screen.getByText(/DED #1388443 · RERA ORN #44483/i)).toBeDefined();
  });
});
