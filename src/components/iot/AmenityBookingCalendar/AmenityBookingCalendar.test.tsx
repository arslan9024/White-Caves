import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmenityBookingCalendar } from './AmenityBookingCalendar';

describe('AmenityBookingCalendar Component', () => {
  it('renders amenity booking calendar and books time slot', () => {
    render(<AmenityBookingCalendar />);
    expect(screen.getByTestId('amenity-booking-calendar')).toBeDefined();
    expect(screen.getByText(/Tennis Court/i)).toBeDefined();
    expect(screen.getByText(/Infinity Pool Cabana/i)).toBeDefined();
    expect(screen.getByText(/Sky BBQ Lounge/i)).toBeDefined();
    expect(screen.getByText(/Private Cinema/i)).toBeDefined();

    const bookBtn = screen.getByRole('button', { name: /Reserve Amenity/i });
    fireEvent.click(bookBtn);
    expect(screen.getByText(/Reservation Confirmed for/i)).toBeDefined();
  });
});
