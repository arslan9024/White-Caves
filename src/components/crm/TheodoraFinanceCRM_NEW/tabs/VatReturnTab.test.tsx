import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { VatReturnTab } from './VatReturnTab';

describe('VatReturnTab', () => {
  it('renders UAE FTA Form 201 VAT Return summary and registered TRN', () => {
    render(<VatReturnTab />);

    expect(screen.getByText(/UAE Federal Tax Authority \(FTA\) — Form 201 VAT Return/i)).toBeInTheDocument();
    expect(screen.getByText(/100592837400003/i)).toBeInTheDocument();
    expect(screen.getByText(/Export EmaraTax XML \/ PDF/i)).toBeInTheDocument();
  });
});
