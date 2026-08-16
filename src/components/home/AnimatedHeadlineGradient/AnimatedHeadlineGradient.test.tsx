import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimatedHeadlineGradient } from './AnimatedHeadlineGradient';

describe('AnimatedHeadlineGradient Component', () => {
  it('renders default animated headline gradient typography', () => {
    render(<AnimatedHeadlineGradient />);
    expect(screen.getByTestId('animated-headline-gradient')).toBeDefined();
    expect(screen.getByText(/Dubai Luxury Real Estate\. Sovereign Precision\./i)).toBeDefined();
  });

  it('renders custom title when provided', () => {
    render(<AnimatedHeadlineGradient title="White Caves Sovereign Portfolio" />);
    expect(screen.getByText(/White Caves Sovereign Portfolio/i)).toBeDefined();
  });
});
