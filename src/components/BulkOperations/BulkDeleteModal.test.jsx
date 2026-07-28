import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BulkDeleteModal from './BulkDeleteModal';

describe('BulkDeleteModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BulkDeleteModal isOpen={false} count={5} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <BulkDeleteModal isOpen={true} count={5} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: 'Delete Properties' })).toBeInTheDocument();
  });

  it('disables confirm button until required text is typed', () => {
    const handleConfirm = vi.fn();
    render(
      <BulkDeleteModal isOpen={true} count={5} onClose={vi.fn()} onConfirm={handleConfirm} />
    );

    const deleteBtn = screen.getByRole('button', { name: /Delete Properties/i });
    expect(deleteBtn).toBeDisabled();

    const input = screen.getByPlaceholderText(/Type "DELETE" to confirm/i);
    fireEvent.change(input, { target: { value: 'DELETE' } });

    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
