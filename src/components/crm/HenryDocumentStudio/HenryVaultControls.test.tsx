import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HenryVaultControls from './HenryVaultControls';
vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
import { authFetch } from '../../../utils/authFetch';

describe('Henry archive controls', () => {
  it('uses exact-reference expiry filters, selected replacement and unconfirmed suggestions', async () => {
    const onOptions = vi.fn(); const onSuggestion = vi.fn();
    vi.mocked(authFetch).mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ id: 'record', referenceNumber: '••••2026', expiryStatus: 'soon_expiring' }], hasMore: false })));
    render(<HenryVaultControls docType="title_deed" options={{}} onOptions={onOptions} onSuggestion={onSuggestion} />);
    fireEvent.change(screen.getByLabelText('Exact reference'), { target: { value: '123/2026' } });
    fireEvent.change(screen.getByLabelText('Expiry filter'), { target: { value: 'soon_expiring' } });
    fireEvent.click(screen.getByText('Search archive'));
    await screen.findByText(/••••2026/);
    expect(authFetch).toHaveBeenCalledWith('/api/henry/documents/search', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType: 'title_deed', page: 1, limit: 10, referenceNumber: '123/2026', expiryStatus: 'soon_expiring' }),
    });
    expect(vi.mocked(authFetch).mock.calls[0][0]).not.toContain('123');
    fireEvent.click(screen.getByText('Select for replacement'));
    expect(onOptions).toHaveBeenCalledWith({ replacesId: 'record' });
    vi.mocked(authFetch).mockResolvedValueOnce(new Response(JSON.stringify({ data: { referenceNumber: '123/2026', extractedJson: { reviewConfirmed: true, ownerNameEn: 'TEST OWNER' } } })));
    fireEvent.click(screen.getByText('Suggest from latest reviewed record'));
    fireEvent.click(await screen.findByText('Use suggestion for review'));
    await waitFor(() => expect(onSuggestion).toHaveBeenCalledWith({ reviewConfirmed: false, ownerNameEn: 'TEST OWNER' }));
  });
});
