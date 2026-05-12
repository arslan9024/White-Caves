import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TenancyContractForm from './TenancyContractForm';

const mockAuthFetch = vi.fn();
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args) => mockAuthFetch(...args),
}));
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
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { id: 'agreement-123' } }),
    });
  });

  it('shows inline error banner on invalid draft save (no window.alert)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<TenancyContractForm />);

    fireEvent.click(screen.getByRole('button', { name: /Save Draft/i }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveAttribute('data-testid', 'tenancy-contract-status-banner');
    expect(banner.textContent).toMatch(/required|Error/i);
    expect(mockAuthFetch).toHaveBeenCalled();
    expect(mockAuthFetch.mock.calls[0][0]).toBe('/api/tenancy-agreements');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
