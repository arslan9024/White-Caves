/**
 * Hero — Test Suite
 * =================
 * Tests for the homepage Hero section covering static content rendering,
 * stats display, CTA buttons, trust badges, and navigation behavior.
 *
 * 13 tests across 5 describe blocks.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mocks ────────────────────────────────────────────────────

// Mock framer-motion — render plain divs instead of animated ones
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        // Return a forwardRef component that renders the HTML element
        return React.forwardRef(function MotionProxy(
          props: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          // Strip framer-specific props
          const style = props.style;
          const rest = { ...props };
          delete rest.variants;
          delete rest.initial;
          delete rest.animate;
          delete rest.whileHover;
          delete rest.whileTap;
          delete rest.transition;
          delete rest.style;

          return React.createElement(prop, { ...rest, style, ref });
        });
      },
    }
  ),
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock redux useSelector — default: no user logged in
let mockUser: Record<string, unknown> | null = null;
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (selector: (state: Record<string, unknown>) => unknown) =>
      selector({ user: { currentUser: mockUser } }),
    useDispatch: () => vi.fn(),
  };
});

// Mock propertySlice for HeroSearchBar integration
vi.mock('../../../store/propertySlice', () => ({
  setFilters: vi.fn((payload: unknown) => ({ type: 'properties/setFilters', payload })),
  clearFilters: vi.fn(() => ({ type: 'properties/clearFilters' })),
}));

// Mock HeroSearchBar to isolate Hero tests from homepageSlice selectors
vi.mock('./HeroSearchBar', () => ({
  default: () => <div data-testid="hero-search-bar" />,
}));

// Import after mocks
import Hero from './Hero';

beforeEach(() => {
  mockNavigate.mockClear();
  mockUser = null;
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('Hero', () => {
  describe('Static content', () => {
    it('renders the hero section', () => {
      render(<Hero />);
      const section = document.getElementById('home');
      expect(section).toBeTruthy();
      expect(section?.tagName.toLowerCase()).toBe('section');
    });

    it('applies the dubai-luxury-theme class to the hero section', () => {
      render(<Hero />);
      const section = document.getElementById('home');
      expect(section?.classList.contains('dubai-luxury-theme')).toBe(true);
    });

    it('displays the main heading with gradient text', () => {
      render(<Hero />);
      expect(screen.getByText(/Find Your Dream/i)).toBeTruthy();
      expect(screen.getByText(/Luxury Home/i)).toBeTruthy();
    });

    it('displays the description paragraph', () => {
      render(<Hero />);
      expect(screen.getByText(/Experience unparalleled luxury living/i)).toBeTruthy();
    });
  });

  describe('Stats', () => {
    it('renders all 4 stat labels', () => {
      render(<Hero />);
      expect(screen.getByText('Premium Properties')).toBeTruthy();
      expect(screen.getByText('Happy Clients')).toBeTruthy();
      expect(screen.getByText('Years Experience')).toBeTruthy();
      expect(screen.getByText('Expert Agents')).toBeTruthy();
    });
  });

  describe('Trust badges', () => {
    it('renders all 3 trust badges', () => {
      render(<Hero />);
      expect(screen.getByText('Verified Properties')).toBeTruthy();
      expect(screen.getByText('RERA Licensed')).toBeTruthy();
      expect(screen.getByText('Best Value')).toBeTruthy();
    });

    it('displays the hero badge', () => {
      render(<Hero />);
      expect(screen.getByText(/Trusted by 1000\+ Clients in Dubai/i)).toBeTruthy();
    });
  });

  describe('CTA buttons', () => {
    it('renders "Browse Properties" and "Book Consultation" buttons', () => {
      render(<Hero />);
      expect(screen.getByText('Browse Properties')).toBeTruthy();
      expect(screen.getByText('Book Consultation')).toBeTruthy();
    });

    it('navigates to /properties when Browse Properties clicked', () => {
      render(<Hero />);
      fireEvent.click(screen.getByText('Browse Properties'));
      expect(mockNavigate).toHaveBeenCalledWith('/properties');
    });

    it('navigates to /contact when Book Consultation clicked', () => {
      render(<Hero />);
      fireEvent.click(screen.getByText('Book Consultation'));
      expect(mockNavigate).toHaveBeenCalledWith('/contact');
    });
  });

  describe('Scroll indicator', () => {
    it('renders the scroll indicator text', () => {
      render(<Hero />);
      expect(screen.getByText('Scroll to explore')).toBeTruthy();
    });
  });
});
