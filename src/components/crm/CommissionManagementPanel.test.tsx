import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CommissionManagementPanel } from './CommissionManagementPanel';

describe('CommissionManagementPanel — production quality tests', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<CommissionManagementPanel />);
    expect(screen.getByText(/Commission Management/i)).toBeInTheDocument();
  });

  it('renders summary KPI cards with revenue & VAT', () => {
    render(<CommissionManagementPanel />);
    expect(screen.getByText(/Total Gross Commission/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid Out YTD/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Payouts/i)).toBeInTheDocument();
    expect(screen.getByText(/VAT Collected/i)).toBeInTheDocument();
  });

  it('renders Commission Ledger tab by default', () => {
    render(<CommissionManagementPanel />);
    expect(screen.getByRole('button', { name: /Commission Ledger/i })).toBeInTheDocument();
  });

  it('switches to Agent Summary tab', () => {
    render(<CommissionManagementPanel />);
    const summaryTab = screen.getByText(/Agent Summary/i);
    fireEvent.click(summaryTab);
    expect(screen.getByText(/Nadia Yusuf/i)).toBeInTheDocument();
  });

  it('does not trigger window.alert on any user interaction', () => {
    render(<CommissionManagementPanel />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      try {
        fireEvent.click(btn);
      } catch (e) {
        // ignore modal state errors
      }
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
