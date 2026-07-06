import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

  // ── Export buttons — W18.1-P1-002 ────────────────────────────────────────

  describe('Export buttons (W18.1-P1-002)', () => {
    beforeEach(() => {
      // jsdom does not implement URL.createObjectURL / revokeObjectURL
      Object.defineProperty(URL, 'createObjectURL', {
        writable: true,
        configurable: true,
        value: vi.fn().mockReturnValue('blob:test-url'),
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        writable: true,
        configurable: true,
        value: vi.fn(),
      });
    });

    it('renders Export CSV and Export XLSX buttons', async () => {
      render(
        <MemoryRouter>
          <AuditLogPage />
        </MemoryRouter>,
      );
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export xlsx/i })).toBeInTheDocument();
    });

    it('calls /api/activities/export/csv on CSV export click', async () => {
      mockAuthFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], pagination: { total: 0 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: async () => new Blob(['ID,Type\nact-1,lead'], { type: 'text/csv' }),
          json: async () => ({}),
        });

      render(
        <MemoryRouter>
          <AuditLogPage />
        </MemoryRouter>,
      );
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

      fireEvent.click(screen.getByRole('button', { name: /export csv/i }));

      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
      const csvCall = mockAuthFetch.mock.calls[1]?.[0] as string;
      expect(csvCall).toContain('/api/activities/export/csv');
    });

    it('calls /api/activities/export/xlsx on XLSX export click', async () => {
      mockAuthFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], pagination: { total: 0 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: async () =>
            new Blob(['XLSX_BINARY'], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          json: async () => ({}),
        });

      render(
        <MemoryRouter>
          <AuditLogPage />
        </MemoryRouter>,
      );
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

      fireEvent.click(screen.getByRole('button', { name: /export xlsx/i }));

      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
      const xlsxCall = mockAuthFetch.mock.calls[1]?.[0] as string;
      expect(xlsxCall).toContain('/api/activities/export/xlsx');
    });

    it('shows error message when XLSX export fails', async () => {
      mockAuthFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], pagination: { total: 0 } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          blob: async () => new Blob(),
          json: async () => ({ error: 'Export limit exceeded' }),
        });

      render(
        <MemoryRouter>
          <AuditLogPage />
        </MemoryRouter>,
      );
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

      fireEvent.click(screen.getByRole('button', { name: /export xlsx/i }));

      await waitFor(() => {
        expect(screen.getByText(/export limit exceeded/i)).toBeInTheDocument();
      });
    });
  });
});
