import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormABarcodeValidator } from './FormABarcodeValidator';

describe('FormABarcodeValidator Component', () => {
  it('renders RERA Form A Trakheesi permit validator and validates permit', () => {
    render(<FormABarcodeValidator />);
    expect(screen.getByTestId('form-a-barcode-validator')).toBeDefined();
    expect(screen.getByText(/RERA Form A Listing & Trakheesi Permit Validator/i)).toBeDefined();
    expect(screen.getByText(/DLD REST API VERIFIED/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Validate Permit/i })).toBeDefined();

    const input = screen.getByPlaceholderText(/Enter 10-digit Trakheesi Permit No\./i);
    fireEvent.change(input, { target: { value: '7117849999' } });
    const btn = screen.getByRole('button', { name: /Validate Permit/i });
    fireEvent.click(btn);
    expect(screen.getByText(/DLD REST API VERIFIED/i)).toBeDefined();
  });
});
