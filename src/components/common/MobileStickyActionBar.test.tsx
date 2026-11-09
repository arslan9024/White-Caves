import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileStickyActionBar } from './MobileStickyActionBar';

describe('MobileStickyActionBar (DOM-03: Mobile Touch Targets & 375px)', () => {
  it('renders sticky action bar with starting price and touch-accessible actions', () => {
    const handleWhatsApp = vi.fn();
    const handleCall = vi.fn();
    const handleViewing = vi.fn();

    render(
      <MobileStickyActionBar
        propertyPrice="AED 4,500,000"
        onWhatsAppClick={handleWhatsApp}
        onCallClick={handleCall}
        onBookViewingClick={handleViewing}
      />
    );

    expect(screen.getByTestId('mobile-sticky-action-bar')).toBeInTheDocument();
    expect(screen.getByText('AED 4,500,000')).toBeInTheDocument();

    const waBtn = screen.getByRole('button', { name: /WhatsApp/i });
    expect(waBtn).toBeInTheDocument();
    fireEvent.click(waBtn);
    expect(handleWhatsApp).toHaveBeenCalledTimes(1);

    const callBtn = screen.getByRole('button', { name: /Call/i });
    expect(callBtn).toBeInTheDocument();
    fireEvent.click(callBtn);
    expect(handleCall).toHaveBeenCalledTimes(1);

    const viewingBtn = screen.getByRole('button', { name: /Book Viewing/i });
    expect(viewingBtn).toBeInTheDocument();
    fireEvent.click(viewingBtn);
    expect(handleViewing).toHaveBeenCalledTimes(1);
  });
});
