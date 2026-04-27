/**
 * Features Component Tests
 * ========================
 * Tests for the homepage Features section — 8 service cards with animations
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion — render all motion.* as plain HTML
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
          const filteredProps: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(props)) {
            if (
              !key.startsWith('while') &&
              !key.startsWith('initial') &&
              !key.startsWith('animate') &&
              !key.startsWith('exit') &&
              !key.startsWith('variants') &&
              !key.startsWith('transition') &&
              !key.startsWith('viewport') &&
              key !== 'whileInView'
            ) {
              filteredProps[key] = value;
            }
          }
          return React.createElement(prop, { ...filteredProps, ref });
        });
      },
    }
  ),
}));

import Features from './Features';

describe('Features', () => {
  // ──────────────────────────────────────────────────────────
  // Structure
  // ──────────────────────────────────────────────────────────

  it('renders the features section', () => {
    render(<Features />);
    const section = document.querySelector('.features-section');
    expect(section).toBeTruthy();
  });

  it('renders the section tag "Our Services"', () => {
    render(<Features />);
    expect(screen.getByText('Our Services')).toBeTruthy();
  });

  it('renders the section title', () => {
    render(<Features />);
    expect(screen.getByText('Why Choose White Caves?')).toBeTruthy();
  });

  it('renders the section subtitle', () => {
    render(<Features />);
    expect(
      screen.getByText(/Comprehensive real estate solutions/i)
    ).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Feature Cards (all 8)
  // ──────────────────────────────────────────────────────────

  const featureTitles = [
    'Premium Properties',
    'Rental Services',
    'Investment Advisory',
    'RERA Certified',
    'Expert Agents',
    'Financial Tools',
    'Virtual Tours',
    'Digital Contracts',
  ];

  it('renders all 8 feature cards', () => {
    render(<Features />);
    for (const title of featureTitles) {
      expect(screen.getByText(title)).toBeTruthy();
    }
  });

  it.each(featureTitles)('renders "%s" feature with description', (title) => {
    render(<Features />);
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('renders 8 "Learn more" links', () => {
    render(<Features />);
    const links = screen.getAllByText('Learn more');
    expect(links.length).toBe(8);
  });

  // ──────────────────────────────────────────────────────────
  // Accessibility
  // ──────────────────────────────────────────────────────────

  it('has aria-label on each "Learn more" link', () => {
    render(<Features />);
    for (const title of featureTitles) {
      expect(
        screen.getByLabelText(`Learn more about ${title}`)
      ).toBeTruthy();
    }
  });

  it('has the correct section id for anchor navigation', () => {
    render(<Features />);
    const section = document.querySelector('#features');
    expect(section).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Content
  // ──────────────────────────────────────────────────────────

  it('renders feature descriptions', () => {
    render(<Features />);
    expect(
      screen.getByText(/Palm Jumeirah, Emirates Hills/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/mortgage calculator/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Ejari-compliant/i)
    ).toBeTruthy();
  });

  it('renders the divider element', () => {
    render(<Features />);
    const divider = document.querySelector('.divider');
    expect(divider).toBeTruthy();
  });

  it('renders arrow symbols in learn-more links', () => {
    render(<Features />);
    const arrows = document.querySelectorAll('.arrow');
    expect(arrows.length).toBe(8);
  });
});

