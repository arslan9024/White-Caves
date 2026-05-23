import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./WhatsAppButton.styles', () => ({
  WhatsAppFloatingBtn: ({ children, ...props }: any) => React.createElement('button', props, children),
  WhatsAppIcon: ({ children, ...props }: any) => React.createElement('svg', { ...props, 'data-testid': 'whatsapp-icon' }, children),
}));

// Mock Config
vi.mock('../config/constants', () => ({
  Config: {
    COMPANY: {
      WHATSAPP: '971563616136',
    },
  },
}));

import WhatsAppButton from './WhatsAppButton';

describe('WhatsAppButton', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null) as any;
  });

  describe('rendering', () => {
    it('renders the button', () => {
      render(<WhatsAppButton />);
      expect(screen.getByLabelText('Chat on WhatsApp')).toBeInTheDocument();
    });

    it('renders the WhatsApp icon SVG', () => {
      render(<WhatsAppButton />);
      expect(screen.getByTestId('whatsapp-icon')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<WhatsAppButton />);
      expect(screen.getByLabelText('Chat on WhatsApp')).toBeInTheDocument();
    });
  });

  describe('click behavior', () => {
    it('opens WhatsApp URL on click', () => {
      render(<WhatsAppButton />);
      fireEvent.click(screen.getByLabelText('Chat on WhatsApp'));
      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    });

    it('opens with correct wa.me URL and phone number', () => {
      render(<WhatsAppButton />);
      fireEvent.click(screen.getByLabelText('Chat on WhatsApp'));
      const url = windowOpenSpy.mock.calls[0][0] as string;
      expect(url).toContain('https://wa.me/971563616136');
    });

    it('includes encoded message in URL', () => {
      render(<WhatsAppButton />);
      fireEvent.click(screen.getByLabelText('Chat on WhatsApp'));
      const url = windowOpenSpy.mock.calls[0][0] as string;
      expect(url).toContain('text=');
      expect(url).toContain('White%20Caves');
    });

    it('opens in new tab with noopener,noreferrer', () => {
      render(<WhatsAppButton />);
      fireEvent.click(screen.getByLabelText('Chat on WhatsApp'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.any(String),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});
