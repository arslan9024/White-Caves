import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockAuthFetch = vi.fn();

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import AuditLogPage from './AuditLogPage';

describe('AuditLogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockImplementation(async (url: string) => {
      const requestUrl = new URL(url, 'https://whitecaves.test');
      const page = Number(requestUrl.searchParams.get('page') || '1');
      const search = requestUrl.searchParams.get('search') || '';

      return {
        ok: true,
        json: async () => ({
          data: [
            {
              id: `${search || 'audit'}-${page}`,
              type: 'lead',
              action: 'created',
              description: search ? `Matched ${search}` : `Audit entry ${page}`,
              createdAt: '2026-05-25T00:00:00.000Z',
              user: { id: 'user-1', name: 'Agent Smith', email: 'agent@whitecaves.ae' },
              lead: { id: 'lead-1', name: 'John Client' },
            },
          ],
          pagination: { total: 45 },
        }),
      };
    });
  });

  it('applies search on submit instead of every keystroke and resets to page 1', async () => {
    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledTimes(1);
    });
    expect(mockAuthFetch.mock.calls[0]?.[0]).toContain('page=1');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledTimes(2);
    });
    expect(mockAuthFetch.mock.calls[1]?.[0]).toContain('page=2');

    const searchInput = screen.getByPlaceholderText('Search description, user, lead...');
    fireEvent.change(searchInput, { target: { value: 'lead-99' } });

    expect(mockAuthFetch).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledTimes(3);
    });

    const lastRequestUrl = mockAuthFetch.mock.calls[2]?.[0] as string;
    expect(lastRequestUrl).toContain('page=1');
    expect(lastRequestUrl).toContain('search=lead-99');
  });
});
