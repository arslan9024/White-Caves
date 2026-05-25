import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

const { mockAuthFetch } = vi.hoisted(() => ({
  mockAuthFetch: vi.fn(),
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: Parameters<typeof mockAuthFetch>) => mockAuthFetch(...args),
}));

import HenryDocumentHub from './HenryDocumentHub';

describe('HenryDocumentHub archive actions', () => {
  beforeEach(() => {
    mockAuthFetch.mockReset();
    mockAuthFetch.mockResolvedValue({
      json: async () => ({
        success: true,
        data: {
          records: [
            {
              id: 'record-1',
              templateKey: 'tenancy_contract',
              templateLabel: 'Tenancy Contract',
              fileName: 'tenancy-contract.pdf',
              recordPath: '/tmp/tenancy-contract.pdf',
              isDraft: true,
              status: 'pending_signature',
              copyNumber: 1,
              createdAt: '2026-05-25T00:00:00.000Z',
            },
          ],
        },
      }),
    });
  });

  it('renders the mark signed action with an accessible label and button type', async () => {
    render(<HenryDocumentHub />);

    fireEvent.click(await screen.findByRole('button', { name: /archive \(1\)/i }));

    const markSignedButton = await screen.findByRole('button', { name: 'Mark signed' });

    expect(markSignedButton).toHaveAttribute('aria-label', 'Mark signed');
    expect(markSignedButton).toHaveAttribute('type', 'button');
  });
});
