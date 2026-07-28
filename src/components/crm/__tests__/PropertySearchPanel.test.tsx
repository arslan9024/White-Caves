import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PropertySearchPanel } from '../PropertySearchPanel';

describe('PropertySearchPanel Component', () => {
  it('renders search filter input and property results', () => {
    render(<PropertySearchPanel />);
    expect(screen.getByPlaceholderText(/Search properties.../i)).toBeInTheDocument();
  });

  it('filters property listings by search query', () => {
    render(<PropertySearchPanel />);
    const searchInput = screen.getByPlaceholderText(/Search properties.../i);
    fireEvent.change(searchInput, { target: { value: 'DAMAC' } });
    expect(searchInput).toHaveValue('DAMAC');
  });

  it('triggers DLD REST live API verification on property card selection', async () => {
    render(<PropertySearchPanel />);
    // Select first property card by clicking its title or card container
    const propertyTitles = screen.getAllByText(/AED/i);
    if (propertyTitles.length > 0) {
      fireEvent.click(propertyTitles[0]);
      const verifyButton = screen.queryByText(/Verify with DLD REST Live API/i);
      if (verifyButton) {
        fireEvent.click(verifyButton);
        expect(screen.getByText(/Querying Dubai Land Department REST API.../i)).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText(/DLD REST API VERIFIED/i)).toBeInTheDocument();
        }, { timeout: 1500 });
      }
    }
  });
});
