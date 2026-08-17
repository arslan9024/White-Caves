import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CavesFloatingWhatsApp } from './CavesFloatingWhatsApp';

describe('CavesFloatingWhatsApp Component', () => {
  it('renders floating WhatsApp button and opens wa.me link on click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<CavesFloatingWhatsApp />);
    const btn = screen.getByTestId('caves-floating-whatsapp');
    expect(btn).toBeDefined();

    fireEvent.click(btn);
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/'),
      '_blank',
      'noopener,noreferrer'
    );

    openSpy.mockRestore();
  });
});
