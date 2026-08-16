import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BulkUnitReservationLock } from './BulkUnitReservationLock';

describe('BulkUnitReservationLock Component', () => {
  it('renders bulk launch day unit reservation locking engine and locks available unit', () => {
    render(<BulkUnitReservationLock />);
    expect(screen.getByTestId('bulk-unit-reservation-lock')).toBeDefined();
    expect(screen.getByText(/Bulk Launch Day Unit Reservation Locking Engine/i)).toBeDefined();
    expect(screen.getByText(/LAUNCH DAY MULTI-LOCK/i)).toBeDefined();
    expect(screen.getByText(/Unit 101/i)).toBeDefined();
    expect(screen.getByText(/Unit 104/i)).toBeDefined();

    // Click available Unit 101 to lock it
    const unit101 = screen.getByText(/Unit 101/i);
    fireEvent.click(unit101);
    expect(screen.getAllByText(/🔒 LOCKED/i).length).toBeGreaterThan(2);
  });
});
