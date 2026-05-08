import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyOpportunityList from './PropertyOpportunityList';

vi.mock('./PropertyOpportunityList.css', () => ({}));

describe('PropertyOpportunityList — alert elimination', () => {
  it('shows status banner when adding a fully verified opportunity', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<PropertyOpportunityList />);

    fireEvent.click(screen.getByText('Jumeirah')); // opp_4 is fully_verified
    fireEvent.click(await screen.findByRole('button', { name: /Add to Mary Inventory/i }));

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Property queued for Mary Inventory successfully.');
    expect(banner).toHaveAttribute('data-testid', 'opportunity-status-banner');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
