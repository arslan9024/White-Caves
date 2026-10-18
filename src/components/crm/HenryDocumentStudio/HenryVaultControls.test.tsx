import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HenryVaultControls from './HenryVaultControls';
vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
import { authFetch } from '../../../utils/authFetch';
import deed from '../../../services/HenryTitleDeedScannerService';

describe('Henry archive controls', () => {
  it.each([{}, { data: null }, { data: {} }, { data: 'invalid' }, null])(
    'handles malformed search responses without crashing: %j',
    async result => {
      vi.mocked(authFetch).mockResolvedValueOnce(new Response(JSON.stringify(result)));
      render(
        <HenryVaultControls
          docType="title_deed"
          options={{}}
          onOptions={vi.fn()}
          onSuggestion={vi.fn()}
        />
      );
      fireEvent.click(screen.getByText('Search archive'));
      expect(await screen.findByText('No matching active documents.')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeDisabled();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }
  );

  it('uses exact-reference expiry filters, selected replacement and unconfirmed suggestions', async () => {
    const onOptions = vi.fn();
    const onSuggestion = vi.fn();
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [{ id: 'record', referenceNumber: '••••2026', expiryStatus: 'soon_expiring' }],
          hasMore: false,
        })
      )
    );
    render(
      <HenryVaultControls
        docType="title_deed"
        options={{}}
        onOptions={onOptions}
        onSuggestion={onSuggestion}
      />
    );
    fireEvent.change(screen.getByLabelText('Exact reference'), { target: { value: '123/2026' } });
    fireEvent.change(screen.getByLabelText('Expiry filter'), {
      target: { value: 'soon_expiring' },
    });
    fireEvent.click(screen.getByText('Search archive'));
    await screen.findByText(/••••2026/);
    expect(authFetch).toHaveBeenCalledWith('/api/henry/documents/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docType: 'title_deed',
        page: 1,
        limit: 10,
        referenceNumber: '123/2026',
        expiryStatus: 'soon_expiring',
      }),
    });
    expect(vi.mocked(authFetch).mock.calls[0][0]).not.toContain('123');
    fireEvent.click(screen.getByText('Select for replacement'));
    expect(onOptions).toHaveBeenCalledWith({ replacesId: 'record' });
    let resolveSearch!: (response: Response) => void;
    vi.mocked(authFetch).mockReturnValueOnce(
      new Promise(resolve => {
        resolveSearch = resolve;
      })
    );
    fireEvent.click(screen.getByText('Search archive'));
    expect(screen.getByText('Select for replacement')).toBeDisabled();
    onOptions.mockClear();
    fireEvent.click(screen.getByText('Select for replacement'));
    expect(onOptions).not.toHaveBeenCalled();
    resolveSearch(
      new Response(
        JSON.stringify({
          data: [{ id: 'record', referenceNumber: '••••2026', expiryStatus: 'soon_expiring' }],
          hasMore: false,
        })
      )
    );
    await waitFor(() => expect(screen.getByText('Select for replacement')).not.toBeDisabled());
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            id: 'a'.repeat(24),
            docType: 'title_deed',
            referenceNumber: '123/2026',
            extractedJson: {
              ...deed.getDemoExtractedData(),
              demoOnly: false,
              reviewConfirmed: true,
              ownerNameEn: 'TEST OWNER',
            },
          },
        })
      )
    );
    fireEvent.click(screen.getByText('Suggest from latest reviewed record'));
    fireEvent.click(await screen.findByText('Use suggestion for review'));
    await waitFor(() =>
      expect(onSuggestion).toHaveBeenCalledWith(
        expect.objectContaining({
          reviewConfirmed: false,
          demoOnly: false,
          ownerNameEn: 'TEST OWNER',
          vaultSource: expect.objectContaining({
            documentId: 'a'.repeat(24),
            docType: 'title_deed',
          }),
        })
      )
    );
  });

  it('loads selected detail through authenticated endpoint and requires fresh source review', async () => {
    const onSuggestion = vi.fn();
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'b'.repeat(24),
              docType: 'title_deed',
              referenceNumber: 'masked',
              expiryStatus: 'unknown',
            },
          ],
        })
      )
    );
    render(
      <HenryVaultControls
        docType="title_deed"
        options={{}}
        onOptions={vi.fn()}
        onSuggestion={onSuggestion}
      />
    );
    fireEvent.click(screen.getByText('Search archive'));
    vi.mocked(authFetch).mockRejectedValueOnce(new Error('Synthetic unavailable detail'));
    fireEvent.click(await screen.findByText('Load reviewed fields'));
    expect(onSuggestion).not.toHaveBeenCalled();
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            id: 'b'.repeat(24),
            docType: 'title_deed',
            referenceNumber: '123/2026',
            extractedJson: {
              ...deed.getDemoExtractedData(),
              demoOnly: false,
              reviewConfirmed: true,
            },
          },
        })
      )
    );
    // A failed detail request must not publish anything; retry explicitly.
    await screen.findByRole('alert');
    fireEvent.click(screen.getByText('Load reviewed fields'));
    fireEvent.click(await screen.findByText('Use suggestion for review'));
    await waitFor(() =>
      expect(onSuggestion).toHaveBeenCalledWith(expect.objectContaining({ reviewConfirmed: false }))
    );
    expect(authFetch).toHaveBeenCalledWith(`/api/henry/documents/${'b'.repeat(24)}`, undefined);
  });

  it.each(['emirates_id', 'malformed'])(
    'rejects %s suggestions without invoking scanner hydration callback',
    async kind => {
      const onSuggestion = vi.fn();
      vi.mocked(authFetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              id: 'c'.repeat(24),
              docType: kind === 'malformed' ? 'title_deed' : kind,
              referenceNumber: '123/2026',
              extractedJson: { reviewConfirmed: true, demoOnly: false, ownerNameEn: 'TEST OWNER' },
            },
          })
        )
      );
      render(
        <HenryVaultControls
          docType="title_deed"
          options={{}}
          onOptions={vi.fn()}
          onSuggestion={onSuggestion}
        />
      );
      fireEvent.click(screen.getByText('Suggest from latest reviewed record'));
      fireEvent.click(await screen.findByText('Use suggestion for review'));
      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(onSuggestion).not.toHaveBeenCalled();
    }
  );
  it('downloads the actual authenticated original and revokes its object URL even if download activation fails', async () => {
    const id = 'd'.repeat(24);
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ data: { id, docType: 'title_deed', referenceNumber: 'masked' } })
      )
    );
    render(
      <HenryVaultControls
        docType="title_deed"
        options={{}}
        onOptions={vi.fn()}
        onSuggestion={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Suggest from latest reviewed record'));
    const download = await screen.findByText('Download suggested original');
    const revoke = vi.fn();
    const create = vi.fn(() => 'blob:synthetic-original');
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create;
        static revokeObjectURL = revoke;
      }
    );
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw new Error('Synthetic download blocked');
    });
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response('%PDF-synthetic', { headers: { 'Content-Type': 'application/pdf' } })
    );
    vi.useFakeTimers();
    try {
      await act(async () => {
        fireEvent.click(download);
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(authFetch).toHaveBeenCalledWith(`/api/henry/documents/${id}/download?side=0`);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'application/pdf', size: 14 })
      );
      expect(revoke).toHaveBeenCalledWith('blob:synthetic-original');
    } finally {
      click.mockRestore();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });
});
