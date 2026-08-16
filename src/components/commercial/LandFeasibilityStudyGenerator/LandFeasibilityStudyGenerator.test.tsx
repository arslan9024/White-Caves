import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LandFeasibilityStudyGenerator } from './LandFeasibilityStudyGenerator';

describe('LandFeasibilityStudyGenerator Component', () => {
  it('renders land plot feasibility generator and calculates GFA, BUA, and development costs', () => {
    render(<LandFeasibilityStudyGenerator />);
    expect(screen.getByTestId('land-feasibility-study-generator')).toBeDefined();
    expect(screen.getByText(/Land Plot Feasibility & GFA\/BUA Architectural Math/i)).toBeDefined();
    expect(screen.getByText(/DEVELOPER ADVISORY/i)).toBeDefined();
    expect(screen.getByText(/Permitted GFA/i)).toBeDefined();
    expect(screen.getByText(/Total Dev Cost/i)).toBeDefined();
    expect(screen.getByText(/Export Feasibility PDF/i)).toBeDefined();
  });
});
