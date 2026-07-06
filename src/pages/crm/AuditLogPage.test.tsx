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

  it('renders page heading and filter controls', async () => {
    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );
    expect(screen.getByText('🧾 Audit Log')).toBeInTheDocument();
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));
    expect(screen.getByPlaceholderText(/search description/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Audit log immutability note')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Export XLSX')).toBeInTheDocument();
  });

  it('loads and renders audit entries', async () => {
    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(screen.getByText(/Audit entry 1/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Agent Smith')).toBeInTheDocument();
    expect(screen.getByText('John Client')).toBeInTheDocument();
  });

  it('calls CSV export endpoint when Export CSV is clicked', async () => {
    // Use vi.fn stubs for URL and anchor to avoid DOM contamination
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const createObjectURL = vi.fn(() => 'blob:test-csv');
    const revokeObjectURL = vi.fn();
    // @ts-expect-error vitest jsdom URL mock
    globalThis.URL.createObjectURL = createObjectURL;
    // @ts-expect-error vitest jsdom URL mock
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

    // Set up export mock AFTER initial load
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['id,type\n1,lead'], { type: 'text/csv' }),
    });

    fireEvent.click(screen.getByText('Export CSV'));
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    expect(mockAuthFetch.mock.calls[1]?.[0]).toContain('/export/csv');
    clickSpy.mockRestore();
  });

  it('calls XLSX export endpoint when Export XLSX is clicked', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const createObjectURL = vi.fn(() => 'blob:test-xlsx');
    // @ts-expect-error vitest jsdom URL mock
    globalThis.URL.createObjectURL = createObjectURL;
    // @ts-expect-error vitest jsdom URL mock
    globalThis.URL.revokeObjectURL = vi.fn();

    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () =>
        new Blob(['xlsx content'], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
    });

    fireEvent.click(screen.getByText('Export XLSX'));
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(createObjectURL).toHaveBeenCalled());
    expect(mockAuthFetch.mock.calls[1]?.[0]).toContain('/export/xlsx');
    clickSpy.mockRestore();
  });

  it('shows error message when export fails', async () => {
    render(
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    );
    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(1));

    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Access denied' }),
    });

    fireEvent.click(screen.getByText('Export CSV'));
    await waitFor(() => {
      expect(screen.getByText('Access denied')).toBeInTheDocument();
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
