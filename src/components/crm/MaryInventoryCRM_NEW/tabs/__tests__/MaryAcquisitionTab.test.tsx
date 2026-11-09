import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MaryAcquisitionTab from '../MaryAcquisitionTab';
import * as authFetchModule from '../../../../../utils/authFetch';

vi.mock('../../../../../utils/authFetch', () => ({
  authFetch: vi.fn(),
}));

describe('MaryAcquisitionTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders property acquisition form sections cleanly', () => {
    render(<MaryAcquisitionTab />);
    expect(screen.getByRole('heading', { level: 3, name: /Property Acquisition Form/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Property Details/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Pricing & Availability/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Landlord Contact/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: /Document Checklist/i })).toBeInTheDocument();
  });

  it('allows filling property title, unit number, and landlord info', () => {
    render(<MaryAcquisitionTab />);

    const titleInput = screen.getByPlaceholderText(/e\.g\. 2BR Apartment in Downtown Dubai/i);
    fireEvent.change(titleInput, { target: { value: 'Luxury 3BR Villa DAMAC Hills' } });
    expect(titleInput).toHaveValue('Luxury 3BR Villa DAMAC Hills');

    const unitInput = screen.getByPlaceholderText(/e\.g\. A-1204/i);
    fireEvent.change(unitInput, { target: { value: 'Villa 101' } });
    expect(unitInput).toHaveValue('Villa 101');

    const landlordNameInput = screen.getByPlaceholderText(/Full Name/i);
    fireEvent.change(landlordNameInput, { target: { value: 'Rashid Al Maktoum' } });
    expect(landlordNameInput).toHaveValue('Rashid Al Maktoum');
  });

  it('submits valid property intake payload via authFetch', async () => {
    const mockAuthFetch = vi.mocked(authFetchModule.authFetch);
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { id: 'prop_999' } }),
    } as any);

    render(<MaryAcquisitionTab />);

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 2BR Apartment in Downtown Dubai/i), {
      target: { value: 'Akoya Oxygen 3BR' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Marina Gate Tower 1, Dubai Marina/i), {
      target: { value: 'DAMAC Hills 2, Dubai' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: 'Hamdan Al Nahyan' },
    });

    const submitBtn = screen.getByRole('button', { name: /\+ Add to Inventory/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/properties',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Property Acquired!/i)).toBeInTheDocument();
    });
  });

  it('handles backend submission rejection gracefully', async () => {
    const mockAuthFetch = vi.mocked(authFetchModule.authFetch);
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ success: false, message: 'DLD Title Deed verification required' }),
    } as any);

    render(<MaryAcquisitionTab />);

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 2BR Apartment in Downtown Dubai/i), {
      target: { value: 'Unverified Unit' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Marina Gate Tower 1, Dubai Marina/i), {
      target: { value: 'Downtown Dubai' },
    });

    const submitBtn = screen.getByRole('button', { name: /\+ Add to Inventory/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/DLD Title Deed verification required/i)).toBeInTheDocument();
    });
  });
});
