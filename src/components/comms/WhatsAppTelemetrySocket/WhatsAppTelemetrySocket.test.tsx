import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { WhatsAppTelemetrySocket } from './WhatsAppTelemetrySocket';

describe('WhatsAppTelemetrySocket Component', () => {
  it('renders WhatsApp telemetry stream and connection metrics', () => {
    render(<WhatsAppTelemetrySocket />);
    expect(screen.getByTestId('whatsapp-telemetry-socket')).toBeDefined();
    expect(screen.getByText(/WhatsApp Webhook & Telemetry Stream/i)).toBeDefined();
    expect(screen.getByText(/SOCKET: CONNECTED/i)).toBeDefined();
    expect(screen.getByText('99.2%')).toBeDefined();
    expect(screen.getByText('88.7%')).toBeDefined();
    expect(screen.getByText(/Viewing Gate Pass Dispatched/i)).toBeDefined();
  });
});
