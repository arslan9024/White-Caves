import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { WhatsAppPairingModal } from './WhatsAppPairingModal';

describe('WhatsAppPairingModal Component', () => {
  it('renders WhatsApp pairing code modal and active pairing code', () => {
    render(<WhatsAppPairingModal />);
    expect(screen.getByTestId('whatsapp-pairing-modal')).toBeDefined();
    expect(screen.getByText(/WhatsApp Web Pairing Code Modal/i)).toBeDefined();
    expect(screen.getByText(/LOCAL AUTH ACTIVE/i)).toBeDefined();
    expect(screen.getByText('8K29-WF94')).toBeDefined();
  });
});
