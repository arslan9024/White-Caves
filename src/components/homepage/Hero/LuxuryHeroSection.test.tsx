import { describe, it, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../context/ThemeContext';
import { LanguageProvider, useLanguage } from '../../../context/LanguageContext';
import Component from './LuxuryHeroSection';

const LanguageControls = () => {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage('ar')}>Select Arabic</button>;
};

const renderHero = () =>
  render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <LanguageControls />
          <Component />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );

describe('LuxuryHeroSection Component', () => {
  it('switches between dark and light theme using the shared theme preference', () => {
    window.localStorage.setItem('themeMode', 'dark');
    const { container } = renderHero();

    const hero = container.querySelector('.luxury-hero');
    expect(hero).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(hero).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('renders Arabic copy with RTL direction when Arabic is selected', () => {
    window.localStorage.setItem('themeMode', 'dark');
    const { container } = renderHero();

    fireEvent.click(screen.getByRole('button', { name: 'Select Arabic' }));

    const hero = container.querySelector('.luxury-hero');
    expect(hero).toHaveAttribute('lang', 'ar');
    expect(hero).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('عقار أحلامك')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'التبديل إلى الوضع الفاتح' })).toBeInTheDocument();
  });
});
