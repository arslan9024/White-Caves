import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoldenVisaEligibilityWidget } from './GoldenVisaEligibilityWidget';

describe('GoldenVisaEligibilityWidget Component', () => {
  it('renders below threshold state with default valuation', () => {
    render(<GoldenVisaEligibilityWidget />);
    expect(screen.getByTestId('golden-visa-eligibility-widget')).toBeDefined();
    expect(screen.getByText(/UAE Golden Visa Eligibility/i)).toBeDefined();
    expect(screen.getByText(/BELOW THRESHOLD/i)).toBeDefined();
  });

  it('updates to eligible state when property value exceeds AED 2M threshold', () => {
    render(<GoldenVisaEligibilityWidget />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2500000' } });
    expect(screen.getByText(/ELIGIBLE FOR GOLDEN VISA/i)).toBeDefined();
  });
});
