import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportsTab from './ReportsTab';

describe('ReportsTab (All Reports Explorer)', () => {
  it('renders all 67 enterprise reports in the explorer table', () => {
    render(<ReportsTab />);

    expect(screen.getByText(/All Reports Explorer — 67 Enterprise Reports/i)).toBeInTheDocument();
    expect(screen.getByText('Profit and Loss')).toBeInTheDocument();
    expect(screen.getByText('3.14.R01')).toBeInTheDocument();
    expect(screen.getByText('VAT Audit Report')).toBeInTheDocument();
  });

  it('filters reports when searching by name or report ID', () => {
    render(<ReportsTab />);

    const searchInput = screen.getByPlaceholderText(/Search by Report Name/i);
    fireEvent.change(searchInput, { target: { value: 'VAT Audit' } });

    expect(screen.getByText('VAT Audit Report')).toBeInTheDocument();
    expect(screen.queryByText('Profit and Loss')).not.toBeInTheDocument();
  });

  it('opens interactive report runner modal on click', () => {
    render(<ReportsTab />);

    const pnlRow = screen.getByText('Profit and Loss');
    fireEvent.click(pnlRow);

    expect(screen.getByText(/UAE Compliance Framework:/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Data Preview/i)).toBeInTheDocument();
    expect(screen.getByText(/Download PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
  });
});
