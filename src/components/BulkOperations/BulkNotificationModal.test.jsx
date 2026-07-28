import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BulkNotificationModal from './BulkNotificationModal';

describe('BulkNotificationModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BulkNotificationModal isOpen={false} selectedProperties={[]} onClose={vi.fn()} onSend={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog when isOpen is true', () => {
    render(
      <BulkNotificationModal isOpen={true} selectedProperties={[{ id: 'p1' }]} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('heading', { name: /Send Notification/i })).toBeInTheDocument();
  });

  it('handles message typing and send click', () => {
    const handleConfirm = vi.fn();
    render(
      <BulkNotificationModal isOpen={true} selectedProperties={[{ id: 'p1' }]} onClose={vi.fn()} onConfirm={handleConfirm} />
    );

    const textarea = screen.getByPlaceholderText(/Enter your message here.../i);
    fireEvent.change(textarea, { target: { value: 'Important update' } });

    const sendBtn = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
