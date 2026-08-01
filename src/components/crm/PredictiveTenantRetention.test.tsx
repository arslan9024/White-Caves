import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PredictiveTenantRetention } from './PredictiveTenantRetention';

describe('PredictiveTenantRetention Component', () => {
  it('renders tenant retention engine container', () => {
    render(<PredictiveTenantRetention />);
    expect(screen.getByTestId('predictive-tenant-retention')).toBeInTheDocument();
    expect(screen.getByText(/Predictive Tenant Churn & 95-Day Retention Engine/i)).toBeInTheDocument();
  });

  it('triggers retention call action on button click', () => {
    render(<PredictiveTenantRetention />);
    const buttons = screen.getAllByRole('button', { name: /Trigger Nadia Call/i });
    fireEvent.click(buttons[0]);
    expect(screen.getByText('Nadia Call Active')).toBeInTheDocument();
  });
});
