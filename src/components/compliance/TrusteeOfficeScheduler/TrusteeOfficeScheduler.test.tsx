import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrusteeOfficeScheduler } from './TrusteeOfficeScheduler';

describe('TrusteeOfficeScheduler Component', () => {
  it('renders Dubai DLD trustee office transfer scheduler and books slot', () => {
    render(<TrusteeOfficeScheduler />);
    expect(screen.getByTestId('trustee-office-scheduler')).toBeDefined();
    expect(screen.getByText(/Trustee Office Appointment Queue/i)).toBeDefined();
    expect(screen.getByText(/DLD Booking/i)).toBeDefined();
    expect(screen.getByText(/Available Time Slots/i)).toBeDefined();

    fireEvent.click(screen.getByText('08:00'));

    const bookBtn = screen.getByRole('button', { name: /Book 08:00 Slot at DNRD/i });
    fireEvent.click(bookBtn);
    expect(screen.getByText(/Appointment Confirmed!/i)).toBeDefined();
  });
});
