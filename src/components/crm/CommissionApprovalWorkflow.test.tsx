import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommissionApprovalWorkflow from './CommissionApprovalWorkflow';

describe('CommissionApprovalWorkflow Component', () => {
  it('renders deal ID and broker split correctly', () => {
    render(<CommissionApprovalWorkflow dealId="DEAL-TEST-100" brokerSplitAED={15000} />);
    expect(screen.getByText('DEAL RECORD: DEAL-TEST-100')).toBeDefined();
    expect(screen.getByText('AED 15,000')).toBeDefined();
  });

  it('renders all four stepper titles', () => {
    render(<CommissionApprovalWorkflow />);
    expect(screen.getByText('1. Agent Submitted')).toBeDefined();
    expect(screen.getByText('2. Manager Approved')).toBeDefined();
    expect(screen.getByText('3. Finance Locked')).toBeDefined();
    expect(screen.getByText('4. Payment Released')).toBeDefined();
  });
});
