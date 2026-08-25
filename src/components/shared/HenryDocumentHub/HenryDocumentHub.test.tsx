import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentHub } from './HenryDocumentHub';

describe('HenryDocumentHub', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<HenryDocumentHub isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders wizard modal when open and handles close action', () => {
    const onClose = vi.fn();
    render(<HenryDocumentHub isOpen={true} onClose={onClose} />);

    expect(screen.getByTestId('henry-wizard-modal')).toBeDefined();
    expect(screen.getByText(/Henry Document Hub/i)).toBeDefined();

    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
