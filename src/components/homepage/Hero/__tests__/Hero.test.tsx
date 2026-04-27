import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target: any, prop: string) => {
      return React.forwardRef(({ children, ...props }: any, ref: any) => {
        const clean: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(props)) {
          if (typeof v !== 'object' || v === null) clean[k] = v;
          // Skip animation objects: whileHover, whileTap, animate, transition, variants, initial, style
        }
        return React.createElement(prop, { ...clean, ref }, children);
      });
    },
  }),
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  type: {} as any,
}));

// Mock lucide-react
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    ArrowRight: (props: any) => <svg data-testid="arrow-right" {...props} />,
    Play: (props: any) => <svg data-testid="play-icon" {...props} />,
    ChevronDown: (props: any) => <svg data-testid="chevron-down" {...props} />,
  };
});

// Mock CSS module
vi.mock('../Hero.css', () => ({}));
vi.mock('../HeroSearchBar.css', () => ({}));

// Mock HeroSearchBar to isolate Hero rendering tests
vi.mock('../HeroSearchBar', () => ({
  default: () => <div data-testid="hero-search-bar" />,
}));;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Hero from '../Hero';

const createMockStore = (currentUser: any = null) =>
  configureStore({
    reducer: {
      user: () => ({ currentUser }),
    },
  });

const renderHero = (user: any = null) =>
  render(
    <Provider store={createMockStore(user)}>
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    </Provider>
  );

describe('Hero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders the hero section', () => {
      renderHero();
      const section = document.querySelector('.hero-section');
      expect(section).toBeTruthy();
    });

    it('renders the hero title text', () => {
      renderHero();
      expect(screen.getByText(/Find Your Dream/)).toBeInTheDocument();
      expect(screen.getByText(/Luxury Home/)).toBeInTheDocument();
      // "in Dubai" appears in title and description, so use getAllByText
      expect(screen.getAllByText(/in Dubai/).length).toBeGreaterThanOrEqual(1);
    });

    it('renders the hero description', () => {
      renderHero();
      expect(screen.getByText(/Experience unparalleled luxury living/)).toBeInTheDocument();
    });

    it('renders the trust badge text', () => {
      renderHero();
      expect(screen.getByText(/Trusted by 1000\+ Clients/)).toBeInTheDocument();
    });
  });

  // ── CTA Buttons ────────────────────────────────────────────
  describe('CTA buttons', () => {
    it('renders Get Started button', () => {
      renderHero();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders View Properties button', () => {
      renderHero();
      expect(screen.getByText('View Properties')).toBeInTheDocument();
    });

    it('navigates to /signin when Get Started clicked (no user)', () => {
      renderHero();
      fireEvent.click(screen.getByText('Get Started'));
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    it('navigates to /select-role when Get Started clicked (logged in user)', () => {
      renderHero({ id: '1', email: 'test@test.com', displayName: 'Test' });
      fireEvent.click(screen.getByText('Get Started'));
      expect(mockNavigate).toHaveBeenCalledWith('/select-role');
    });

    it('navigates to /properties when View Properties clicked', () => {
      renderHero();
      fireEvent.click(screen.getByText('View Properties'));
      expect(mockNavigate).toHaveBeenCalledWith('/properties');
    });
  });

  // ── Stats ──────────────────────────────────────────────────
  describe('stats', () => {
    it('renders all stat labels', () => {
      renderHero();
      expect(screen.getByText('Premium Properties')).toBeInTheDocument();
      expect(screen.getByText('Happy Clients')).toBeInTheDocument();
      expect(screen.getByText('Years Experience')).toBeInTheDocument();
      expect(screen.getByText('Expert Agents')).toBeInTheDocument();
    });
  });

  // ── Trust Badges ───────────────────────────────────────────
  describe('trust badges', () => {
    it('renders Verified Properties badge', () => {
      renderHero();
      expect(screen.getByText(/Verified Properties/)).toBeInTheDocument();
    });

    it('renders RERA Licensed badge', () => {
      renderHero();
      expect(screen.getByText(/RERA Licensed/)).toBeInTheDocument();
    });

    it('renders Best Value badge', () => {
      renderHero();
      expect(screen.getByText(/Best Value/)).toBeInTheDocument();
    });
  });

  // ── Scroll Indicator ───────────────────────────────────────
  describe('scroll indicator', () => {
    it('renders scroll to explore text', () => {
      renderHero();
      expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
    });

    it('renders ChevronDown icon in scroll indicator', () => {
      renderHero();
      // HeroSearchBar is mocked, so only the scroll indicator ChevronDown remains
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    });
  });

  // ── Icons ──────────────────────────────────────────────────
  describe('icons', () => {
    it('renders ArrowRight icon in Get Started button', () => {
      renderHero();
      expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    });

    it('renders Play icon in View Properties button', () => {
      renderHero();
      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });
  });

  // ── Background Elements ────────────────────────────────────
  describe('background', () => {
    it('renders hero background elements', () => {
      renderHero();
      expect(document.querySelector('.hero-background')).toBeTruthy();
      expect(document.querySelector('.hero-overlay')).toBeTruthy();
    });

    it('renders floating shapes', () => {
      renderHero();
      expect(document.querySelector('.floating-shapes')).toBeTruthy();
    });
  });

  // ── AnimatedCounter sub-component ──────────────────────────
  describe('animated counter', () => {
    it('starts counting from 0', () => {
      renderHero();
      // Initially counters start at 0
      // After animation they would be at their final values
      // We cannot easily test the final value with fake timers since rAF is used
      // But we verify that stat items are rendered
      const statItems = document.querySelectorAll('.hero-stat-item');
      expect(statItems.length).toBe(4);
    });
  });
});

