// FILE: src/components/crm/LindaWhatsAppCRM/LindaLiveWhatsAppWeb.test.tsx
/**
 * White Caves Real Estate LLC - Linda WhatsApp Web Test Suite
 * Standard: AEGIS 12-Way Architecture Standard
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LindaLiveWhatsAppWeb } from './LindaLiveWhatsAppWeb';
import { INITIAL_LINDA_CONVERSATIONS } from './LindaWhatsAppCRM.data';

describe('LindaLiveWhatsAppWeb Component Suite', () => {
  it('renders dual-pane WhatsApp Web interface with chat list and active thread', () => {
    render(<LindaLiveWhatsAppWeb conversations={INITIAL_LINDA_CONVERSATIONS} />);

    expect(screen.getByTestId('linda-live-whatsapp-web')).toBeInTheDocument();
    expect(screen.getByTestId('wa-chat-search')).toBeInTheDocument();
    expect(screen.getByTestId('wa-message-thread')).toBeInTheDocument();
    expect(screen.getByTestId('wa-message-input')).toBeInTheDocument();
    expect(screen.getByTestId('wa-send-btn')).toBeInTheDocument();
  });

  it('filters conversation list when typing in search input', () => {
    render(<LindaLiveWhatsAppWeb conversations={INITIAL_LINDA_CONVERSATIONS} />);

    const searchInput = screen.getByTestId('wa-chat-search');
    fireEvent.change(searchInput, { target: { value: 'Tariq' } });

    expect(screen.getByTestId('wa-chat-item-conv-1')).toBeInTheDocument();
    expect(screen.queryByTestId('wa-chat-item-conv-2')).not.toBeInTheDocument();
  });

  it('dispatches message on send button click', () => {
    const handleSend = vi.fn();
    render(
      <LindaLiveWhatsAppWeb
        conversations={INITIAL_LINDA_CONVERSATIONS}
        onSendMessage={handleSend}
      />
    );

    const input = screen.getByTestId('wa-message-input');
    fireEvent.change(input, { target: { value: 'Confirmed viewing for 4 PM.' } });

    const sendBtn = screen.getByTestId('wa-send-btn');
    fireEvent.click(sendBtn);

    expect(handleSend).toHaveBeenCalledWith('conv-1', 'Confirmed viewing for 4 PM.');
    expect(screen.getByText('Confirmed viewing for 4 PM.')).toBeInTheDocument();
  });

  it('autofills prompt when clicking Linda Copilot Draft', () => {
    const handleAi = vi.fn();
    render(
      <LindaLiveWhatsAppWeb
        conversations={INITIAL_LINDA_CONVERSATIONS}
        onAutoReplyWithAI={handleAi}
      />
    );

    const draftBtn = screen.getByTestId('linda-ai-draft-btn');
    fireEvent.click(draftBtn);

    const input = screen.getByTestId('wa-message-input') as HTMLInputElement;
    expect(input.value).toContain('White Caves Luxury Desk has reviewed your');
    expect(handleAi).toHaveBeenCalled();
  });
});

