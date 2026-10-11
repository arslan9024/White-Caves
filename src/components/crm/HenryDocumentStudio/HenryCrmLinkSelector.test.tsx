import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HenryVaultControls from './HenryVaultControls';
import { authFetch } from '../../../utils/authFetch';
vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));

describe('authorized CRM selection', () => {
  beforeEach(() => vi.clearAllMocks());
  it('loads explicitly, searches names only in memory and resets confirmation on selection', async () => {
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({
      data: [{ id: 'lead1', name: 'Alice Synthetic' }, { id: 'lead2', name: 'Bob Synthetic' }], hasMore: false,
    })));
    const onOptions = vi.fn();
    render(<HenryVaultControls docType="title_deed" options={{}} onOptions={onOptions} onSuggestion={vi.fn()} />);
    expect(authFetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Load authorized leads'));
    await screen.findByRole('option', { name: 'Alice Synthetic' });
    fireEvent.change(screen.getByLabelText('Search lead names'), { target: { value: 'Alice' } });
    expect(screen.queryByRole('option', { name: 'Bob Synthetic' })).not.toBeInTheDocument();
    expect(authFetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(authFetch).mock.calls[0]![0]).not.toContain('Alice');
    fireEvent.change(screen.getByLabelText('Select authorized lead'), { target: { value: 'lead1' } });
    const confirm = screen.getByLabelText('Confirm these existing CRM links (server checks ownership)');
    expect(confirm).not.toBeChecked();
    fireEvent.click(confirm);
    expect(onOptions).toHaveBeenLastCalledWith({ leadId: 'lead1', propertyId: undefined });
    fireEvent.change(screen.getByLabelText('Select authorized lead'), { target: { value: '' } });
    expect(confirm).not.toBeChecked();
    expect(onOptions).toHaveBeenLastCalledWith({ leadId: undefined, propertyId: undefined });
  });
  it('offers retry after protected fetch failure', async () => {
    vi.mocked(authFetch).mockResolvedValue(new Response('{}', { status: 403 }));
    render(<HenryVaultControls docType="title_deed" options={{}} onOptions={vi.fn()} onSuggestion={vi.fn()} />);
    fireEvent.click(screen.getByText('Load authorized properties'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load authorized CRM options');
    expect(screen.getByText('Load authorized properties')).not.toBeDisabled();
  });
});
