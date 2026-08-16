import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { VendorRatingMatrix } from './VendorRatingMatrix';

describe('VendorRatingMatrix Component', () => {
  it('renders vendor rating matrix and procurement audit KPIs', () => {
    render(<VendorRatingMatrix />);
    expect(screen.getByTestId('vendor-rating-matrix')).toBeDefined();
    expect(screen.getByText(/Facilities Vendor Performance & OpEx Rating Matrix/i)).toBeDefined();
    expect(screen.getByText(/PROCUREMENT AUDIT/i)).toBeDefined();
    expect(screen.getByText(/CoolTech HVAC Solutions/i)).toBeDefined();
    expect(screen.getByText(/Emirates Plumbing LLC/i)).toBeDefined();
    expect(screen.getByText(/AED 1.48M/i)).toBeDefined();
    expect(screen.getByText(/96.2% On-Time/i)).toBeDefined();
  });
});
