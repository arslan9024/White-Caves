import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import LindaWhatsAppCRM from '../LindaWhatsAppCRM';
import { ThemeProvider } from '../../../context/ThemeContext';

afterEach(() => {
  cleanup();
});

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

vi.mock('../../../utils/apiClient', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({
      success: true,
      data: { status: 'connected', isConnected: true },
    }),
    post: vi.fn().mockResolvedValue({
      success: true,
      data: { output: '12/12 Doctor checks passed' },
    }),
  },
}));

describe('LindaWhatsAppCRM — Upgraded Visual Operations Center (v2.0.0-enterprise)', () => {
  it('renders all upgraded Linda components in unified view', () => {
    renderWithTheme(<LindaWhatsAppCRM />);

    expect(
      screen.getByRole('heading', { name: /Linda — WhatsApp Bot Visual Operations Center/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/v2.0.0-enterprise · 200\/200 Upgrades/i)).toBeInTheDocument();

    // 4-Panel Terminal & Feature Catalog (F1-F35) & Playbooks (P1-P6)
    expect(
      screen.getByText(/\[PANEL 1 · HEADER\] LINDA VISUAL TERMINAL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\[PANEL 2 · FEATURE CATALOG F1–F35\]/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\[PANEL 3 · MULTI-STEP PLAYBOOKS P1–P10 & DOTTED MENU\]/i)
    ).toBeInTheDocument();

    // Multi-Account Sessions & Device Linking Desk
    expect(
      screen.getByText(/Multi-Account WhatsApp Sessions & Device Linking Desk/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/\[MASTER\] PowerAgent/i)).toBeInTheDocument();

    // Outreach Campaigns & Area Owner Outreach Planner (F35)
    expect(
      screen.getByText(/Outreach Campaigns & Drip Broadcasts/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Area Owner Outreach Planner \(Feature F35 · Menu 9\.1\)/i)
    ).toBeInTheDocument();

    // Conversation Analyzer (F34) & 10 Architectural Pillars
    expect(
      screen.getByText(/WhatsApp Conversation Analyzer \(F34 · Menu 8\.11\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Linda Master System Registry — 10 Pillars/i)
    ).toBeInTheDocument();
  });

  it('executes quick actions and opens script output modal when clicked', async () => {
    renderWithTheme(<LindaWhatsAppCRM />);

    const doctorBtn = screen.getByRole('button', { name: /Health Doctor \(12\/12\)/i });
    fireEvent.click(doctorBtn);

    const dialog = await screen.findByRole('dialog', { name: /Linda Script Output Modal/i });
    expect(dialog).toBeInTheDocument();
  });
});
