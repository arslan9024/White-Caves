import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import TenancyContractForm from './TenancyContractForm';

vi.mock('axios');
vi.mock('./TenancyContractForm.css', () => ({}));

vi.mock('./TenancyForms/PropertyInfoForm', () => ({
  default: () => <div>Property Info Form</div>,
}));
vi.mock('./TenancyForms/LandlordForm', () => ({
  default: () => <div>Landlord Form</div>,
}));
vi.mock('./TenancyForms/TenantForm', () => ({
  default: () => <div>Tenant Form</div>,
}));
vi.mock('./TenancyForms/ContactDetailsForm', () => ({
  default: () => <div>Contact Details Form</div>,
}));
vi.mock('./TenancyForms/TenancyTermsForm', () => ({
  default: () => <div>Tenancy Terms Form</div>,
}));

describe('TenancyContractForm — alert elimination', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows inline status banner when draft save succeeds (no window.alert)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          contractId: 'contract-123',
        },
      },
    });

    render(<TenancyContractForm />);

    fireEvent.click(screen.getByRole('button', { name: /Save Draft/i }));

    const banner = await screen.findByRole('status');
    expect(banner).toHaveAttribute('data-testid', 'tenancy-contract-status-banner');
    expect(banner).toHaveTextContent('Draft created successfully');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
