/**
 * LeadImportModal Tests — P1-001
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import LeadImportModal from './LeadImportModal';

function makeProps(
  overrides: Partial<{ onClose: () => void; onSuccess: (n: number) => void }> = {}
) {
  return {
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...overrides,
  };
}

describe('LeadImportModal — P1-001', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input step with CSV textarea', () => {
    render(<LeadImportModal {...makeProps()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('CSV data input')).toBeInTheDocument();
    expect(screen.getByText(/Next: Map Fields/i)).toBeInTheDocument();
  });

  it('disables Next button when no CSV text is entered', () => {
    render(<LeadImportModal {...makeProps()} />);
    const nextBtn = screen.getByText(/Next: Map Fields/i);
    expect(nextBtn).toBeDisabled();
  });

  it('advances to mapping step after parsing valid CSV', async () => {
    render(<LeadImportModal {...makeProps()} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, {
      target: { value: 'name,email,phone\nJohn Smith,john@test.ae,+971501234567' },
    });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => {
      expect(screen.getByText(/Map each CSV column/i)).toBeInTheDocument();
    });
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('phone')).toBeInTheDocument();
  });

  it('auto-detects column mapping from standard header names', async () => {
    render(<LeadImportModal {...makeProps()} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, {
      target: { value: 'name,email,budget\nJane,jane@wc.ae,500000' },
    });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => {
      expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Email')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Budget (AED)')).toBeInTheDocument();
  });

  it('shows 1 row detected in mapping step', async () => {
    render(<LeadImportModal {...makeProps()} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, {
      target: { value: 'name,email\nAlice,alice@test.ae' },
    });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => {
      expect(screen.getByText(/1 row\(s\) detected/i)).toBeInTheDocument();
    });
  });

  it('calls API and shows result on successful import', async () => {
    const onSuccess = vi.fn();
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { imported: 2, total: 2 } }),
    });

    render(<LeadImportModal {...makeProps({ onSuccess })} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, {
      target: { value: 'name,email\nAlice,alice@test.ae\nBob,bob@test.ae' },
    });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => screen.getByText(/Import 2 Lead/i));
    fireEvent.click(screen.getByText(/Import 2 Lead/i));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/2 lead\(s\) imported successfully/i)).toBeInTheDocument();
    });
    expect(onSuccess).toHaveBeenCalledWith(2);
  });

  it('shows API error message on failed import', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Maximum 500 leads per batch' }),
    });

    render(<LeadImportModal {...makeProps()} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, { target: { value: 'name\nAlice' } });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => screen.getByText(/Import 1 Lead/i));
    fireEvent.click(screen.getByText(/Import 1 Lead/i));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/i);
    });
  });

  it('allows navigating back from mapping to input step', async () => {
    render(<LeadImportModal {...makeProps()} />);
    const textarea = screen.getByLabelText('CSV data input');
    fireEvent.change(textarea, { target: { value: 'name\nAlice' } });
    fireEvent.click(screen.getByText(/Next: Map Fields/i));
    await waitFor(() => screen.getByText(/← Back/i));
    fireEvent.click(screen.getByText(/← Back/i));
    expect(screen.getByLabelText('CSV data input')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(<LeadImportModal {...makeProps({ onClose })} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<LeadImportModal {...makeProps({ onClose })} />);
    fireEvent.click(screen.getByLabelText('Close import modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
