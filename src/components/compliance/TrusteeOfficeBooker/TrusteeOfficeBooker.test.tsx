import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrusteeOfficeBooker } from './TrusteeOfficeBooker';

describe('TrusteeOfficeBooker Component', () => {
  it('renders DLD trustee office booking interface and books appointment', () => {
    render(<TrusteeOfficeBooker />);
    expect(screen.getByTestId('trustee-office-booker')).toBeDefined();
    expect(screen.getByText(/DLD Trustee Office Appointment/i)).toBeDefined();
    expect(screen.getByText(/DNRD Trustee Office/i)).toBeDefined();
    expect(screen.getByText(/Emaar Properties Office/i)).toBeDefined();
    expect(screen.getByText(/Total Payable at Trustee/i)).toBeDefined();

    const bookBtn = screen.getByRole('button', { name: /Book Appointment/i });
    fireEvent.click(bookBtn);
    expect(screen.getByText(/Appointment Confirmed at DNRD Trustee Office!/i)).toBeDefined();
  });
});
