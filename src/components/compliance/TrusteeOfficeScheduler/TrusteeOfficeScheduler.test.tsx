import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrusteeOfficeScheduler } from './TrusteeOfficeScheduler';

describe('TrusteeOfficeScheduler Component', () => {
  it('renders Dubai DLD trustee office transfer scheduler and books slot', () => {
    render(<TrusteeOfficeScheduler />);
    expect(screen.getByTestId('trustee-office-scheduler')).toBeDefined();
    expect(screen.getByText(/Dubai DLD Trustee Office Transfer Scheduler/i)).toBeDefined();
    expect(screen.getByText(/DLD TRUSTEE PORTAL/i)).toBeDefined();
    expect(screen.getByText(/Available Registration Trustee Appointment Slots/i)).toBeDefined();

    const bookBtn = screen.getByRole('button', { name: /Confirm DLD Trustee Office Booking Slot/i });
    fireEvent.click(bookBtn);
    expect(screen.getByText(/Trustee Appointment Confirmed for/i)).toBeDefined();
  });
});
