import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormADigitalGenerator } from './FormADigitalGenerator';
describe('FormADigitalGenerator', () => {
  it('renders form input fields', () => {
    render(<FormADigitalGenerator />);
    expect(screen.getByTestId('form-a-generator')).toBeTruthy();
    expect(screen.getByText('Form A — Seller Listing Agreement Generator')).toBeTruthy();
  });
});
