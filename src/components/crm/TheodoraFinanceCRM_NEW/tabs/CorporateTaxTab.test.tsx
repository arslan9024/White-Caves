import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CorporateTaxTab } from './CorporateTaxTab';

describe('CorporateTaxTab', () => {
  it('renders UAE Corporate Tax header and 9% statutory rate computation', () => {
    render(<CorporateTaxTab />);

    expect(screen.getByText(/UAE Corporate Tax \(CT\) — Federal Decree-Law No. 47 of 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/Small Business Relief/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Corporate Tax Due/i)).toBeInTheDocument();
    expect(screen.getByText(/Download CT Computation Binder/i)).toBeInTheDocument();
  });
});
