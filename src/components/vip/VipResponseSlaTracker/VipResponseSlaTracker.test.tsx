import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VipResponseSlaTracker } from './VipResponseSlaTracker';

describe('VipResponseSlaTracker Component', () => {
  it('renders 5-minute VIP response law tracker and active enquiries', () => {
    render(<VipResponseSlaTracker />);
    expect(screen.getByTestId('vip-response-sla-tracker')).toBeDefined();
    expect(screen.getByText(/VIP SLA Response Tracker/i)).toBeDefined();
    expect(screen.getByText(/Sheikh Rashid Al Maktoum/i)).toBeDefined();
  });

  it('marks pending enquiry as responded when action button is triggered', () => {
    render(<VipResponseSlaTracker />);
    const respondBtn = screen.getByRole('button', { name: /Reply ✓/i });
    fireEvent.click(respondBtn);
    expect(screen.getByText(/All enquiries responded to/i)).toBeDefined();
  });
});
