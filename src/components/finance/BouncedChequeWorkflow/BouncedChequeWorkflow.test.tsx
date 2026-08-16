import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BouncedChequeWorkflow } from './BouncedChequeWorkflow';

describe('BouncedChequeWorkflow Component', () => {
  it('renders bounced cheque legal workflow and central bank form 4 steps', () => {
    render(<BouncedChequeWorkflow />);
    expect(screen.getByTestId('bounced-cheque-workflow')).toBeDefined();
    expect(screen.getByText(/Bounced Cheque Legal Workflow/i)).toBeDefined();
    expect(screen.getByText(/Mohammed Al Rashid/i)).toBeDefined();
    expect(screen.getByText(/Initiate Legal Workflow/i)).toBeDefined();
  });
});
