import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AtlasProjectsCRM from '../AtlasProjectsCRM';

describe('AtlasProjectsCRM Component', () => {
  it('renders Atlas Projects CRM component without crashing', () => {
    const { container } = render(<AtlasProjectsCRM />);
    expect(container).toBeDefined();
  });

  it('renders project list items', () => {
    render(<AtlasProjectsCRM />);
    expect(screen.getByText('Marina Vista Tower')).toBeDefined();
  });

  it('switches to DLD Escrow Stepper tab and displays EscrowMilestoneTracker', () => {
    render(<AtlasProjectsCRM />);
    const escrowTab = screen.getByTestId('tab-escrow-milestone');
    fireEvent.click(escrowTab);

    expect(screen.getByTestId('escrow-milestone-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('escrow-stepper-track')).toBeInTheDocument();
  });
});
