import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExecutiveLiveTicker } from './ExecutiveLiveTicker';

describe('ExecutiveLiveTicker Component', () => {
  it('renders live executive ticker with deals and transaction updates', () => {
    render(<ExecutiveLiveTicker />);
    expect(screen.getByTestId('executive-live-ticker')).toBeDefined();
    expect(screen.getAllByText(/Palm Signature Villa SOLD/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ejari Lease Contract Verified/i).length).toBeGreaterThan(0);
  });
});
