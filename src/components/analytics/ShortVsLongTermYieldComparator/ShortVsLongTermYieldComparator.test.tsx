import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ShortVsLongTermYieldComparator } from './ShortVsLongTermYieldComparator';

describe('ShortVsLongTermYieldComparator Component', () => {
  it('renders Airbnb vs Ejari yield comparator and winner badge', () => {
    render(<ShortVsLongTermYieldComparator />);
    expect(screen.getByTestId('short-vs-long-yield-comparator')).toBeDefined();
    expect(screen.getByText(/Short-term vs Long-term Yield/i)).toBeDefined();
    expect(screen.getByText(/Short-Term \(Airbnb\)/i)).toBeDefined();
    expect(screen.getByText(/Long-Term \(Ejari\)/i)).toBeDefined();
    expect(screen.getByText(/Property Value \(AED\)/i)).toBeDefined();
  });
});
