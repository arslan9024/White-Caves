/**
 * ErmsContextTriadBar.test.tsx
 * Targeted Vitest test suite for ErmsContextTriadBar
 * Verifies Language, Currency, Density toggles, and RTL direction handling
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsContextTriadBar } from './ErmsContextTriadBar';

describe('ErmsContextTriadBar (Pillar 8 Verification)', () => {
  it('renders all triad controls and default states', () => {
    render(<ErmsContextTriadBar currency="AED" language="en" density="compact" />);

    expect(screen.getByText('Language:')).toBeInTheDocument();
    expect(screen.getByText('Currency:')).toBeInTheDocument();
    expect(screen.getByText('Density:')).toBeInTheDocument();
    expect(screen.getByText('Hotkeys')).toBeInTheDocument();
  });

  it('triggers currency change callback on click', () => {
    const handleCurrency = vi.fn();
    render(<ErmsContextTriadBar onCurrencyChange={handleCurrency} />);

    const usdBtn = screen.getByRole('button', { name: 'USD' });
    fireEvent.click(usdBtn);

    expect(handleCurrency).toHaveBeenCalledWith('USD');
  });

  it('triggers language change callback and updates document direction for Arabic', () => {
    const handleLanguage = vi.fn();
    render(<ErmsContextTriadBar onLanguageChange={handleLanguage} />);

    const arBtn = screen.getByRole('button', { name: 'ar' });
    fireEvent.click(arBtn);

    expect(handleLanguage).toHaveBeenCalledWith('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('triggers density mode change callback', () => {
    const handleDensity = vi.fn();
    render(<ErmsContextTriadBar onDensityChange={handleDensity} />);

    const denseBtn = screen.getByRole('button', { name: 'Dense' });
    fireEvent.click(denseBtn);

    expect(handleDensity).toHaveBeenCalledWith('ultra-dense');
  });
});
