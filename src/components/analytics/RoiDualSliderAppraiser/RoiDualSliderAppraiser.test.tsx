import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoiDualSliderAppraiser } from './RoiDualSliderAppraiser';

describe('RoiDualSliderAppraiser Component', () => {
  it('renders ROI dual slider appraiser and calculations', () => {
    render(<RoiDualSliderAppraiser />);
    expect(screen.getByTestId('roi-dual-slider-appraiser')).toBeDefined();
    expect(screen.getAllByText(/Rental Yield/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Property Value \(AED\)/i)).toBeDefined();
  });
});
