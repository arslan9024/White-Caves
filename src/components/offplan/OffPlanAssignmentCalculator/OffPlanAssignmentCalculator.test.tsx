import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OffPlanAssignmentCalculator } from './OffPlanAssignmentCalculator';

describe('OffPlanAssignmentCalculator Component', () => {
  it('renders assignment eligibility calculator and developer thresholds', () => {
    render(<OffPlanAssignmentCalculator />);
    expect(screen.getByTestId('off-plan-assignment-calculator')).toBeDefined();
    expect(screen.getByText(/Off-Plan Assignment Eligibility/i)).toBeDefined();
    expect(screen.getByText(/ASSIGNMENT ELIGIBLE/i)).toBeDefined();
  });
});
