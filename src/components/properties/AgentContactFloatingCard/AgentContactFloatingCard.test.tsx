import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentContactFloatingCard } from './AgentContactFloatingCard';

describe('AgentContactFloatingCard', () => {
  it('renders agent details and verified RERA badge', () => {
    render(
      <AgentContactFloatingCard
        name="Arsalan Malik"
        role="Managing Director"
        reraNumber="BRN #58921"
      />
    );

    expect(screen.getByTestId('agent-contact-floating-card')).toBeDefined();
    expect(screen.getByText('Arsalan Malik')).toBeDefined();
    expect(screen.getByText('Managing Director')).toBeDefined();
    expect(screen.getByText('RERA BRN #58921 · Verified')).toBeDefined();
  });

  it('triggers WhatsApp and Call buttons on click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<AgentContactFloatingCard phone="+971 50 882 1940" />);

    const waBtn = screen.getByText('WhatsApp');
    const callBtn = screen.getByText('Call Desk');

    fireEvent.click(waBtn);
    expect(openSpy).toHaveBeenCalledWith('https://wa.me/971508821940');

    fireEvent.click(callBtn);
    expect(openSpy).toHaveBeenCalledWith('tel:+971 50 882 1940');

    openSpy.mockRestore();
  });
});
