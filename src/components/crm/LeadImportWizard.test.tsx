/**
 * LeadImportWizard tests — W18.1-P1-001
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import LeadImportWizard from './LeadImportWizard';

function makeFile(name = 'leads.csv', type = 'text/csv') {
  return new File(['Name,Email\nJohn,john@test.com'], name, { type });
}

function makeXlsxFile() {
  return new File([new ArrayBuffer(8)], 'leads.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

describe('LeadImportWizard (W18.1-P1-001)', () => {
  beforeEach(() => {
    mockAuthFetch.mockReset();
  });

  // ── Upload step ────────────────────────────────────────────────────────
  it('renders upload step by default', () => {
    render(<LeadImportWizard />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Import Leads')).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<LeadImportWizard onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Close import wizard'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows error for unsupported file type', async () => {
    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    const badFile = new File(['data'], 'leads.txt', { type: 'text/plain' });
    // fireEvent bypasses accept-attribute filtering (userEvent v14 respects accept)
    fireEvent.change(input, { target: { files: [badFile] } });
    expect(screen.getByRole('alert')).toHaveTextContent(/Only .csv and .xlsx/);
  });

  it('shows error for file exceeding 10 MB', async () => {
    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    const bigFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.csv', {
      type: 'text/csv',
    });
    await userEvent.upload(input, bigFile);
    expect(screen.getByRole('alert')).toHaveTextContent(/too large/);
  });

  // ── Confirm step ───────────────────────────────────────────────────────
  it('advances to confirm step after valid CSV file selected', async () => {
    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    expect(screen.getByTestId('file-name')).toHaveTextContent('leads.csv');
    expect(screen.getByText('Import Now')).toBeInTheDocument();
  });

  it('advances to confirm step for XLSX file', async () => {
    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeXlsxFile());
    expect(screen.getByTestId('file-name')).toHaveTextContent('leads.xlsx');
  });

  it('goes back to upload step when Back is clicked', async () => {
    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Back'));
    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  // ── Import (server interaction) ────────────────────────────────────────
  it('calls authFetch with FormData on Import Now click', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { imported: 5, duplicates: 1, errors: [], total: 6 } }),
    });

    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/leads/import/file',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows result step with correct counts on success', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { imported: 10, duplicates: 3, errors: [], total: 13 },
      }),
    });

    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(screen.getByText('10')).toBeInTheDocument());
    expect(screen.getByText('3')).toBeInTheDocument(); // duplicates
    expect(screen.getByText('0')).toBeInTheDocument(); // errors
  });

  it('shows per-row errors in result step', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          imported: 1,
          duplicates: 0,
          errors: [{ row: 3, field: 'email', message: 'Invalid email: badmail' }],
          total: 2,
        },
      }),
    });

    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(screen.getByText(/Per-row errors/)).toBeInTheDocument());
    expect(screen.getByText(/Row 3.*email.*Invalid email/)).toBeInTheDocument();
  });

  it('shows server error message when import fails', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Maximum 500 rows per import' }),
    });

    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/Maximum 500 rows/);
  });

  it('calls onComplete with result data on success', async () => {
    const onComplete = vi.fn();
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { imported: 2, duplicates: 0, errors: [], total: 2 } }),
    });

    render(<LeadImportWizard onComplete={onComplete} />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(onComplete).toHaveBeenCalledWith({
      imported: 2,
      duplicates: 0,
      errors: [],
      total: 2,
    }));
  });

  it('resets to upload step when Import Another is clicked', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { imported: 1, duplicates: 0, errors: [], total: 1 } }),
    });

    render(<LeadImportWizard />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(screen.getByText('Import Another')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Import Another'));

    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  it('shows Done button in result step when onClose is provided', async () => {
    const onClose = vi.fn();
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { imported: 1, duplicates: 0, errors: [], total: 1 } }),
    });

    render(<LeadImportWizard onClose={onClose} />);
    const input = screen.getByLabelText('File upload input');
    await userEvent.upload(input, makeFile());
    await userEvent.click(screen.getByText('Import Now'));

    await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── Drag-and-drop ──────────────────────────────────────────────────────
  it('accepts file via drag-and-drop', async () => {
    render(<LeadImportWizard />);
    const dropZone = screen.getByLabelText('Drop zone for CSV or XLSX file');

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [makeFile()] },
    });

    await waitFor(() => expect(screen.getByTestId('file-name')).toHaveTextContent('leads.csv'));
  });
});
