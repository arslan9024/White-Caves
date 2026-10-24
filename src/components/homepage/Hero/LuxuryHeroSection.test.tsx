import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { LanguageProvider } from '../../../context/LanguageContext';
import LuxuryHeroSection from './LuxuryHeroSection';

vi.mock('framer-motion', async () => {
  const ReactModule = await import('react');
  const motion = new Proxy({} as Record<string, React.ComponentType<Record<string, unknown>>>, {
    get: (_target, tag) =>
      ReactModule.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
        const {
          animate,
          initial,
          variants,
          transition,
          whileHover,
          whileTap,
          style,
          ...nativeProps
        } = props;
        void [animate, initial, variants, transition, whileHover, whileTap, style];
        return ReactModule.createElement(String(tag), { ...nativeProps, ref });
      }),
  });

  return {
    motion,
    useReducedMotion: () => true,
    useScroll: () => ({ scrollY: 0 }),
    useTransform: () => 0,
  };
});

const CurrentLocation = () => {
  const { pathname, search } = useLocation();
  return (
    <output data-testid="current-location">
      {pathname}
      {search}
    </output>
  );
};

const renderHero = (language: 'en' | 'ar', onSearchClick = vi.fn()) => {
  localStorage.setItem('whitecaves_language', language);
  const view = render(
    <LanguageProvider>
      <MemoryRouter>
        <LuxuryHeroSection onSearchClick={onSearchClick} />
        <CurrentLocation />
      </MemoryRouter>
    </LanguageProvider>
  );

  return { ...view, onSearchClick };
};

afterEach(() => {
  localStorage.removeItem('whitecaves_language');
});

describe('LuxuryHeroSection', () => {
  it('renders localized English content with accessible search and navigation actions', () => {
    const { onSearchClick } = renderHero('en');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Dream Property');
    expect(screen.getByText('RERA Licensed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Search Dubai luxury properties' }));
    expect(onSearchClick).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: 'Emaar' }));
    expect(screen.getByTestId('current-location').textContent).toBe('/properties?developer=Emaar');
  });

  it('renders Arabic copy in RTL direction', () => {
    renderHero('ar');

    expect(screen.getByTestId('hero-section').getAttribute('dir')).toBe('rtl');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('عقارك المثالي');
    expect(
      screen.getByRole('button', { name: 'ابحث عن العقارات الفاخرة في دبي' })
    ).toBeInTheDocument();
  });
});
