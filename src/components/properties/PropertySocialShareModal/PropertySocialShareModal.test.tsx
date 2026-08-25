import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertySocialShareModal } from './PropertySocialShareModal';

describe('PropertySocialShareModal', () => {
  it('renders modal with listing title, QR box and share channels', () => {
    render(
      <PropertySocialShareModal
        propertyUrl="https://whitecaves.ae/properties/palm-villa-14b"
        propertyTitle="Signature Beachfront Villa"
      />
    );

    expect(screen.getByTestId('property-social-share-modal')).toBeDefined();
    expect(screen.getByText('Signature Beachfront Villa')).toBeDefined();
    expect(screen.getByText('WhatsApp')).toBeDefined();
    expect(screen.getByText('LinkedIn')).toBeDefined();
  });

  it('handles copy link action', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<PropertySocialShareModal />);
    const copyBtn = screen.getByText('Copy');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
