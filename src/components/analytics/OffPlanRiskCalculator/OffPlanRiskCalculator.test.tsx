import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OffPlanRiskCalculator from './OffPlanRiskCalculator';

describe('OffPlanRiskCalculator Component', () => {
  it('renders without crashing and displays the off-plan risk analysis cockpit', () => {
    render(<OffPlanRiskCalculator />);
    expect(screen.getByTestId('offplan-risk-calculator')).toBeInTheDocument();
  });
});
