import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExpenseClaimForm } from './ExpenseClaimForm';

describe('ExpenseClaimForm', () => {
  it('renders the bilingual-safe form and validates an incomplete draft', () => {
    render(<ExpenseClaimForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Validate draft' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Review the highlighted fields.');
  });

  it('calls onValidated for a complete draft', () => {
    const onValidated = vi.fn();
    render(<ExpenseClaimForm onValidated={onValidated} />);

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'employee-123' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '125.50' } });
    fireEvent.change(screen.getByLabelText('Incurred on'), { target: { value: '2026-09-06' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), {
      target: { value: 'Client taxi fare' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Validate draft' }));

    expect(onValidated).toHaveBeenCalledOnce();
  });

  it('rejects an unsupported local receipt file without uploading it', () => {
    render(<ExpenseClaimForm />);
    const file = new File(['unsafe'], 'receipt.exe', { type: 'application/octet-stream' });
    fireEvent.change(screen.getByLabelText('Receipt file (local validation only)'), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Validate draft' }));

    expect(screen.getByText('Receipt must be a PDF, JPEG, or PNG file.')).toBeInTheDocument();
  });
});
