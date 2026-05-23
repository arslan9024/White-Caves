/**
 * ClickToChat – comprehensive test suite
 * Covers trigger, popup, quick messages, custom message, contact apps, accessibility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClickToChat from './ClickToChat';

/* ── Mock Config ──────────────────────────────────────────────── */
vi.mock('../config/constants', () => ({
  Config: {
    COMPANY: {
      WHATSAPP: '971563616136',
      NAME: 'White Caves Real Estate LLC',
    },
  },
}));

/* ── Mock import.meta.env ─────────────────────────────────────── */
const originalEnv = import.meta.env;

/* ── Mock styled-components ──────────────────────────────────── */
vi.mock('./ClickToChat.styles', () => {
  const { createElement, forwardRef } = require('react');
  const el = (name: string, tag = 'div') => {
    const C = forwardRef(
      (
        {
          children,
          onClick,
          className,
          style,
          src,
          alt,
          role,
          type,
          value,
          onChange,
          placeholder,
          disabled,
          ...rest
        }: any,
        ref: any
      ) => {
        if (tag === 'button')
          return createElement(
            'button',
            {
              ref,
              'data-testid': name,
              onClick,
              disabled,
              'aria-label': rest['aria-label'],
              'aria-expanded': rest['aria-expanded'],
              title: rest.title,
            },
            children
          );
        if (tag === 'input')
          return createElement('input', {
            'data-testid': name,
            type: type || 'text',
            value,
            onChange,
            placeholder,
            'aria-label': rest['aria-label'],
          });
        if (tag === 'form')
          return createElement('form', { 'data-testid': name, onSubmit: onClick }, children);
        if (tag === 'img') return createElement('img', { 'data-testid': name, src, alt });
        if (tag === 'svg') return createElement('svg', { 'data-testid': name }, children);
        return createElement(
          'div',
          { ref, 'data-testid': name, onClick, role, className, style },
          children
        );
      }
    );
    C.displayName = name;
    return C;
  };
  return {
    ClickToChatContainer: el('ClickToChatContainer'),
    ChatTrigger: el('ChatTrigger', 'button'),
    ChatLabel: el('ChatLabel'),
    WhatsAppIconSmall: el('WhatsAppIconSmall', 'svg'),
    ChatPopup: el('ChatPopup'),
    ChatHeader: el('ChatHeader'),
    ChatHeaderInfo: el('ChatHeaderInfo'),
    ChatAvatar: el('ChatAvatar', 'img'),
    ChatHeaderTitle: el('ChatHeaderTitle'),
    OnlineStatus: el('OnlineStatus'),
    CloseChat: el('CloseChat', 'button'),
    ChatBody: el('ChatBody'),
    WelcomeMessage: el('WelcomeMessage'),
    QuickMessages: el('QuickMessages'),
    QuickLabel: el('QuickLabel'),
    QuickMessageBtn: el('QuickMessageBtn', 'button'),
    CustomMessageForm: el('CustomMessageForm', 'form'),
    MessageInput: el('MessageInput', 'input'),
    SendBtn: el('SendBtn', 'button'),
    ContactAppsContainer: el('ContactAppsContainer'),
    ChatAppBtn: el('ChatAppBtn', 'button'),
  };
});

import React from 'react';

/* ── Track window.open calls ──────────────────────────────────── */
const mockWindowOpen = vi.fn();
const origOpen = window.open;

describe('ClickToChat', () => {
  const openContactTab = () => {
    fireEvent.click(screen.getByTestId('ChatTrigger'));
    fireEvent.click(screen.getByRole('button', { name: /contact us/i }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.open = mockWindowOpen;
  });

  afterEach(() => {
    window.open = origOpen;
  });

  /* ── Trigger ────────────────────────────────────────────────── */
  describe('trigger', () => {
    it('renders chat trigger button', () => {
      render(<ClickToChat />);
      expect(screen.getByTestId('ChatTrigger')).toBeInTheDocument();
    });

    it('renders Chat label', () => {
      render(<ClickToChat />);
      expect(screen.getByText('Chat')).toBeInTheDocument();
    });

    it('opens popup on click', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.getByTestId('ChatPopup')).toBeInTheDocument();
    });

    it('closes popup on second click', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.getByTestId('ChatPopup')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.queryByTestId('ChatPopup')).not.toBeInTheDocument();
    });
  });

  /* ── Popup content ──────────────────────────────────────────── */
  describe('popup', () => {
    it('renders header with White Caves Support', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.getByText('White Caves Support')).toBeInTheDocument();
    });

    it('renders welcome message', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(
        screen.getByText('Welcome to White Caves Real Estate! How can we assist you today?')
      ).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.getByTestId('CloseChat')).toBeInTheDocument();
    });

    it('closes on close button click', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      fireEvent.click(screen.getByTestId('CloseChat'));
      expect(screen.queryByTestId('ChatPopup')).not.toBeInTheDocument();
    });
  });

  /* ── Quick messages ─────────────────────────────────────────── */
  describe('quick messages', () => {
    it('renders all 5 quick message buttons', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByText('Property Inquiry')).toBeInTheDocument();
      expect(screen.getByText('Schedule Viewing')).toBeInTheDocument();
      expect(screen.getByText('Rental Information')).toBeInTheDocument();
      expect(screen.getByText('Investment Advice')).toBeInTheDocument();
      expect(screen.getByText('General Inquiry')).toBeInTheDocument();
    });

    it('opens WhatsApp on quick message click', () => {
      render(<ClickToChat />);
      openContactTab();
      fireEvent.click(screen.getByText('Property Inquiry'));
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('closes popup after quick message click', () => {
      render(<ClickToChat />);
      openContactTab();
      fireEvent.click(screen.getByText('Property Inquiry'));
      expect(screen.queryByTestId('ChatPopup')).not.toBeInTheDocument();
    });
  });

  /* ── Custom message ─────────────────────────────────────────── */
  describe('custom message', () => {
    it('renders message input', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });

    it('renders send button', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByTestId('SendBtn')).toBeInTheDocument();
    });

    it('send button disabled when empty', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByTestId('SendBtn')).toBeDisabled();
    });

    it('updates message input', () => {
      render(<ClickToChat />);
      openContactTab();
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello!' } });
      expect(input).toHaveValue('Hello!');
    });
  });

  /* ── Contact apps ───────────────────────────────────────────── */
  describe('contact apps', () => {
    it('renders contact us via label', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByText('Contact us via:')).toBeInTheDocument();
    });

    it('renders WhatsApp, Botim, GoChat, Call buttons', () => {
      render(<ClickToChat />);
      openContactTab();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Botim')).toBeInTheDocument();
      expect(screen.getByText('GoChat UAE')).toBeInTheDocument();
      expect(screen.getByText('Call Us')).toBeInTheDocument();
    });

    it('opens WhatsApp link on WhatsApp button click', () => {
      render(<ClickToChat />);
      openContactTab();
      fireEvent.click(screen.getByText('WhatsApp'));
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('opens Call link on Call Us button click', () => {
      render(<ClickToChat />);
      openContactTab();
      fireEvent.click(screen.getByText('Call Us'));
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('tel:'),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  /* ── Accessibility ──────────────────────────────────────────── */
  describe('accessibility', () => {
    it('trigger has aria-label', () => {
      render(<ClickToChat />);
      expect(screen.getByTestId('ChatTrigger')).toHaveAttribute('aria-label', 'Open chat widget');
    });

    it('trigger has aria-expanded=false initially', () => {
      render(<ClickToChat />);
      expect(screen.getByTestId('ChatTrigger')).toHaveAttribute('aria-expanded', 'false');
    });

    it('popup has dialog role', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      expect(screen.getByTestId('ChatPopup')).toHaveAttribute('role', 'dialog');
    });
  });

  /* ── Online status ──────────────────────────────────────────── */
  describe('online status', () => {
    it('renders online status text', () => {
      render(<ClickToChat />);
      fireEvent.click(screen.getByTestId('ChatTrigger'));
      // Status depends on Dubai time, either "Online now" or "Away"
      const status = screen.getByTestId('OnlineStatus');
      expect(status.textContent).toMatch(/Online now|Away - Leave a message/);
    });
  });
});
