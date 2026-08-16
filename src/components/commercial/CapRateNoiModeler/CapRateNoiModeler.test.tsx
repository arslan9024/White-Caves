import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CapRateNoiModeler } from './CapRateNoiModeler';

describe('CapRateNoiModeler Component', () => {
  it('renders commercial building cap rate and NOI modeler calculations', () => {
    render(<CapRateNoiModeler />);
    expect(screen.getByTestId('cap-rate-noi-modeler')).toBeDefined();
    expect(screen.getByText(/Commercial CRE Building Cap Rate & NOI Modeler/i)).toBeDefined();
    expect(screen.getByText(/AED 1,750,000/i)).toBeDefined();
    expect(screen.getByText(/7.00%/i)).toBeDefined();
    expect(screen.getByText(/AED 25.0M/i)).toBeDefined();
  });
});
