import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FounderEscrowModal } from './FounderEscrowModal';

describe('FounderEscrowModal (DOM-08 / Targets T-0701 & T-0710)', () => {
  it('renders Dubai Law No. 8 Escrow accounts and goAML screening desk when open', () => {
    const handleClose = vi.fn();
    render(<FounderEscrowModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('Law No. 8 Escrow & goAML Compliance Desk')).toBeInTheDocument();
    expect(screen.getByText(/Active Law No. 8 Escrow Trust Accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/Statutory goAML Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/AED 55,000/i)).toBeInTheDocument();

    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when closed', () => {
    render(<FounderEscrowModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Law No. 8 Escrow & goAML Compliance Desk')).not.toBeInTheDocument();
  });
});
