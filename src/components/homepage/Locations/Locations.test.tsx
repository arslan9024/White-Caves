/**
 * Locations Component Tests
 * =========================
 * Tests for the homepage Locations section — 4 Dubai neighborhoods,
 * property stats, navigation, hover interactions, accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Capture navigate calls
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock framer-motion — render all motion.* as plain HTML
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
          const safe: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(props)) {
            if (
              !k.startsWith('while') &&
              !k.startsWith('initial') &&
              !k.startsWith('animate') &&
              !k.startsWith('exit') &&
              !k.startsWith('variants') &&
              !k.startsWith('transition') &&
              !k.startsWith('viewport') &&
              k !== 'whileInView' &&
              k !== 'custom'
            ) {
              safe[k] = v;
            }
          }
          return React.createElement(prop, { ...safe, ref });
        }),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Locations from './Locations';

const renderLocations = () =>
  render(
    <MemoryRouter>
      <Locations />
    </MemoryRouter>
  );

describe('Locations', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ──────────────────────────────────────────────────────────
  // Structure
  // ──────────────────────────────────────────────────────────

  it('renders the locations section', () => {
    renderLocations();
    expect(document.querySelector('.locations-section')).toBeTruthy();
  });

  it('renders the section tag "Premier Locations"', () => {
    renderLocations();
    expect(screen.getByText('Premier Locations')).toBeTruthy();
  });

  it('renders the section title', () => {
    renderLocations();
    expect(screen.getByText("Explore Dubai's Finest Neighborhoods")).toBeTruthy();
  });

  it('renders the section subtitle', () => {
    renderLocations();
    expect(
      screen.getByText(/exclusive properties in the most sought-after/i)
    ).toBeTruthy();
  });

  it('has correct id for anchor navigation', () => {
    renderLocations();
    expect(document.querySelector('#locations')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Location Cards (all 4)
  // ──────────────────────────────────────────────────────────

  const locationNames = [
    'Palm Jumeirah',
    'Downtown Dubai',
    'Emirates Hills',
    'Dubai Marina',
  ];

  it('renders all 4 location cards', () => {
    renderLocations();
    for (const name of locationNames) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });

  it('renders descriptions for each location', () => {
    renderLocations();
    expect(screen.getByText(/Iconic waterfront living/i)).toBeTruthy();
    expect(screen.getByText(/Burj Khalifa views/i)).toBeTruthy();
    expect(screen.getByText(/golf course villas/i)).toBeTruthy();
    expect(screen.getByText(/Vibrant waterfront lifestyle/i)).toBeTruthy();
  });

  it('renders alt text matching location names', () => {
    renderLocations();
    for (const name of locationNames) {
      expect(screen.getByAltText(name)).toBeTruthy();
    }
  });

  // ──────────────────────────────────────────────────────────
  // Property Stats
  // ──────────────────────────────────────────────────────────

  it('renders property counts', () => {
    renderLocations();
    expect(screen.getByText(/120 Properties/)).toBeTruthy();
    expect(screen.getByText(/200 Properties/)).toBeTruthy();
    expect(screen.getByText(/45 Properties/)).toBeTruthy();
    expect(screen.getByText(/180 Properties/)).toBeTruthy();
  });

  it('renders trend percentages', () => {
    renderLocations();
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByText('+8%')).toBeTruthy();
    expect(screen.getByText('+15%')).toBeTruthy();
    expect(screen.getByText('+10%')).toBeTruthy();
  });

  it('renders average prices', () => {
    renderLocations();
    expect(screen.getByText('15M AED')).toBeTruthy();
    expect(screen.getByText('8M AED')).toBeTruthy();
    expect(screen.getByText('35M AED')).toBeTruthy();
    expect(screen.getByText('5M AED')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────

  it('navigates to properties page with location filter on card click', () => {
    renderLocations();
    const cards = document.querySelectorAll('.location-card');
    expect(cards.length).toBe(4);

    fireEvent.click(cards[0]); // Palm Jumeirah
    expect(mockNavigate).toHaveBeenCalledWith('/properties?location=Palm Jumeirah');
  });

  it('navigates to correct location for each card', () => {
    renderLocations();
    const cards = document.querySelectorAll('.location-card');

    fireEvent.click(cards[1]); // Downtown Dubai
    expect(mockNavigate).toHaveBeenCalledWith('/properties?location=Downtown Dubai');

    fireEvent.click(cards[2]); // Emirates Hills
    expect(mockNavigate).toHaveBeenCalledWith('/properties?location=Emirates Hills');
  });

  it('"Explore All Locations" button navigates to /properties', () => {
    renderLocations();
    const exploreBtn = screen.getByText('Explore All Locations');
    expect(exploreBtn).toBeTruthy();

    fireEvent.click(exploreBtn.closest('button')!);
    expect(mockNavigate).toHaveBeenCalledWith('/properties');
  });

  // ──────────────────────────────────────────────────────────
  // UI Elements
  // ──────────────────────────────────────────────────────────

  it('renders 4 "View Properties" CTAs', () => {
    renderLocations();
    const ctas = screen.getAllByText('View Properties');
    expect(ctas.length).toBe(4);
  });

  it('renders "Avg. Price" labels', () => {
    renderLocations();
    const labels = screen.getAllByText('Avg. Price');
    expect(labels.length).toBe(4);
  });

  it('renders location images with lazy loading', () => {
    renderLocations();
    const images = document.querySelectorAll<HTMLImageElement>('.location-image');
    expect(images.length).toBe(4);
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });

  // ──────────────────────────────────────────────────────────
  // Card Structure
  // ──────────────────────────────────────────────────────────

  it('renders divider element in header', () => {
    renderLocations();
    expect(document.querySelector('.divider')).toBeTruthy();
  });

  it('renders the locations grid', () => {
    renderLocations();
    expect(document.querySelector('.locations-grid')).toBeTruthy();
  });
});

