import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WhatsAppConciergePill from './WhatsAppConciergePill';

describe('WhatsAppConciergePill Component', () => {
  it('renders trigger button with VIP Concierge label', () => {
    render(<WhatsAppConciergePill />);
    expect(screen.getByRole('button', { name: /Open luxury property WhatsApp concierge/i })).toBeInTheDocument();
    expect(screen.getByText('VIP Concierge')).toBeInTheDocument();
  });

  it('opens concierge menu on button click and shows options', () => {
    render(<WhatsAppConciergePill />);
    const trigger = screen.getByRole('button', { name: /Open luxury property WhatsApp concierge/i });
    fireEvent.click(trigger);

    expect(screen.getByText('VIP Concierge Desk')).toBeInTheDocument();
    expect(screen.getByText('Book Private Villa Viewing')).toBeInTheDocument();
    expect(screen.getByText('Off-Plan Investment Launches')).toBeInTheDocument();
  });

  it('triggers window.open with formatted WhatsApp URL on option click', () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(<WhatsAppConciergePill />);
    const trigger = screen.getByRole('button', { name: /Open luxury property WhatsApp concierge/i });
    fireEvent.click(trigger);

    const option = screen.getByText('Book Private Villa Viewing');
    fireEvent.click(option);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/971585919024'),
      '_blank',
      'noopener,noreferrer'
    );

    window.open = originalOpen;
  });
});
