import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContractTimeline } from './ContractTimeline';

describe('ContractTimeline Component', () => {
  it('renders sale contract journey timeline and shows stage milestones', () => {
    render(<ContractTimeline />);
    expect(screen.getByTestId('contract-timeline')).toBeDefined();
    expect(screen.getByText(/Sale Contract Journey Timeline/i)).toBeDefined();
    expect(screen.getByText(/MOU Signed/i)).toBeDefined();
    expect(screen.getByText(/Security Deposit Paid/i)).toBeDefined();
    expect(screen.getByText(/DLD NOC from Developer/i)).toBeDefined();
    expect(screen.getByText(/DLD Transfer Appointment/i)).toBeDefined();
    expect(screen.getByText(/Keys & Handover/i)).toBeDefined();
  });
});
