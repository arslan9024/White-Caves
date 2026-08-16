import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppointmentWhatsAppNotifier } from './AppointmentWhatsAppNotifier';

describe('AppointmentWhatsAppNotifier Component', () => {
  it('renders appointment WhatsApp notifier and preview message template', () => {
    render(<AppointmentWhatsAppNotifier />);
    expect(screen.getByTestId('appointment-whatsapp-notifier')).toBeDefined();
    expect(screen.getByText(/WhatsApp Viewing Notifier & Gate Pass Engine/i)).toBeDefined();
    expect(screen.getByText(/WHATSAPP BUSINESS API/i)).toBeDefined();
    expect(screen.getByDisplayValue('Sir Jonathan Hayes')).toBeDefined();
  });
});
