import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardLiveTicker } from './DashboardLiveTicker';

describe('DashboardLiveTicker', () => {
  it('renders live corporate ticker items including USD/AED and DLD Volume', () => {
    render(<DashboardLiveTicker />);

    expect(screen.getByText(/USD \/ AED:/i)).toBeInTheDocument();
    expect(screen.getByText(/3.6725 \(Fixed\)/i)).toBeInTheDocument();
    expect(screen.getByText(/DLD Daily Volume:/i)).toBeInTheDocument();
  });
});
