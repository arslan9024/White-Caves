import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolsDashboard } from './ToolsDashboard';

describe('ToolsDashboard Component', () => {
  it('renders 3-column tools dashboard with mortgage sliders and yield gauges', () => {
    render(<ToolsDashboard />);

    expect(screen.getByTestId('tools-dashboard')).toBeDefined();
    expect(screen.getByTestId('mortgage-calculator-card')).toBeDefined();
    expect(screen.getByTestId('yield-calculator-card')).toBeDefined();
    expect(screen.getByTestId('dld-fees-card')).toBeDefined();

    const slider = screen.getByTestId('slider-property-price');
    fireEvent.change(slider, { target: { value: '5000000' } });
    expect(screen.getByText(/AED 5,000,000/i)).toBeDefined();
  });
});
