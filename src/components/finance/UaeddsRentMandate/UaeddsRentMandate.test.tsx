import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UaeddsRentMandate } from './UaeddsRentMandate';

describe('UaeddsRentMandate Component', () => {
  it('renders UAEDDS electronic rent mandate and registers mandate', () => {
    render(<UaeddsRentMandate />);
    expect(screen.getByTestId('uaedds-rent-mandate')).toBeDefined();
    expect(screen.getByText(/UAEDDS Digital Rent Mandate/i)).toBeDefined();
    expect(screen.getAllByText(/CENTRAL BANK OF UAE/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Per Installment/i)).toBeDefined();
    expect(screen.getByText(/0 \(Paperless\)/i)).toBeDefined();

    const registerBtn = screen.getByRole('button', { name: /Register UAEDDS Electronic Rent Mandate/i });
    fireEvent.click(registerBtn);
    expect(screen.getByText(/UAEDDS Direct Debit Mandate Registered/i)).toBeDefined();
    expect(screen.getByText(/Mandate UMRN:/i)).toBeDefined();
  });
});
