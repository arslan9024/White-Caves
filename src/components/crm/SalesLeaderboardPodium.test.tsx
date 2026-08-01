import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SalesLeaderboardPodium from './SalesLeaderboardPodium';

describe('SalesLeaderboardPodium Component', () => {
  it('renders sales leaderboard header', () => {
    render(<SalesLeaderboardPodium />);
    expect(screen.getByText('Monthly Broker Sales Leaderboard')).toBeDefined();
  });

  it('renders top producer badge', () => {
    render(<SalesLeaderboardPodium />);
    expect(screen.getByText('★ Top Producer')).toBeDefined();
    expect(screen.getByText('Sarah Al Maktoum')).toBeDefined();
  });
});
