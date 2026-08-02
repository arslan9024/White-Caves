import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroSection } from './HeroSection';
import { TranslationProvider } from '../../context/TranslationContext';

describe('HeroSection Component', () => {
  it('renders hero title and localized translation copy', () => {
    render(
      <TranslationProvider>
        <HeroSection />
      </TranslationProvider>
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText('Luxury Dubai Real Estate Redefined')).toBeInTheDocument();
  });
});
