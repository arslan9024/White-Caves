import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VipResponseSlaTracker } from './VipResponseSlaTracker';

describe('VipResponseSlaTracker Component', () => {
  it('renders 5-minute VIP response law tracker and active enquiries', () => {
    render(<VipResponseSlaTracker />);
    expect(screen.getByTestId('vip-response-sla-tracker')).toBeDefined();
    expect(screen.getByText(/VIP SLA Response Tracker/i)).toBeDefined();
    expect(screen.getByText(/Sheikh Abdullah Al Nahyan/i)).toBeDefined();
    expect(screen.getByText(/Prince Rashed Al Qasimi/i)).toBeDefined();
  });

  it('escalates an overdue enquiry when its action button is triggered', () => {
    render(<VipResponseSlaTracker />);
    const escalateButtons = screen.getAllByRole('button', { name: /Escalate/i });

    fireEvent.click(escalateButtons[0]);

    expect(screen.getAllByRole('button', { name: /Escalate/i })).toHaveLength(1);
    expect(screen.getByText(/Sheikh Abdullah Al Nahyan/i)).toBeDefined();
  });
});
