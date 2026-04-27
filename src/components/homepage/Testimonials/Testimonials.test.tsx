/**
 * Testimonials Component Tests
 * ============================
 * Tests for the homepage Testimonials carousel — 4 testimonials,
 * navigation, autoplay, indicator dots, accessibility
 */

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock framer-motion
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

// Mock TIMING constants with short values for tests
vi.mock('../../../constants/app', () => ({
  TIMING: {
    CAROUSEL_AUTOPLAY: 100, // fast for tests
    CAROUSEL_RESUME: 200,
  },
}));

import Testimonials from './Testimonials';

describe('Testimonials', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ──────────────────────────────────────────────────────────
  // Structure & Static Content
  // ──────────────────────────────────────────────────────────

  it('renders the testimonials section', () => {
    render(<Testimonials />);
    expect(document.querySelector('.testimonials-section')).toBeTruthy();
  });

  it('renders the section tag "Testimonials"', () => {
    render(<Testimonials />);
    expect(screen.getByText('Testimonials')).toBeTruthy();
  });

  it('renders the section title', () => {
    render(<Testimonials />);
    expect(screen.getByText('What Our Clients Say')).toBeTruthy();
  });

  it('renders the section subtitle', () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/satisfied clients who found their dream/i)
    ).toBeTruthy();
  });

  it('has correct section id for anchor navigation', () => {
    render(<Testimonials />);
    expect(document.querySelector('#testimonials')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // First Testimonial (default)
  // ──────────────────────────────────────────────────────────

  it('shows the first testimonial by default', () => {
    render(<Testimonials />);
    expect(screen.getByText('James Richardson')).toBeTruthy();
    expect(screen.getByText('Property Investor')).toBeTruthy();
    expect(screen.getByText('Palm Jumeirah Villa')).toBeTruthy();
  });

  it('renders star ratings', () => {
    render(<Testimonials />);
    const stars = document.querySelectorAll('.testimonial-rating svg');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('renders testimonial text inside a blockquote', () => {
    render(<Testimonials />);
    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeTruthy();
    expect(blockquote?.textContent).toContain('seamless');
  });

  it('renders the author avatar with lazy loading', () => {
    render(<Testimonials />);
    const avatar = document.querySelector<HTMLImageElement>('.testimonial-avatar');
    expect(avatar).toBeTruthy();
    expect(avatar?.getAttribute('loading')).toBe('lazy');
    expect(avatar?.alt).toBe('James Richardson');
  });

  // ──────────────────────────────────────────────────────────
  // Navigation Buttons
  // ──────────────────────────────────────────────────────────

  it('renders prev and next navigation buttons', () => {
    render(<Testimonials />);
    expect(screen.getByLabelText('Previous testimonial')).toBeTruthy();
    expect(screen.getByLabelText('Next testimonial')).toBeTruthy();
  });

  it('navigates to next testimonial on "Next" click', () => {
    render(<Testimonials />);

    expect(screen.getByText('James Richardson')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Next testimonial'));

    expect(screen.getByText('Maria Santos')).toBeTruthy();
    expect(screen.getByText('Business Executive')).toBeTruthy();
  });

  it('navigates to previous testimonial on "Prev" click', () => {
    render(<Testimonials />);

    // Prev from index 0 wraps to last (index 3)
    fireEvent.click(screen.getByLabelText('Previous testimonial'));

    expect(screen.getByText('Sophie Chen')).toBeTruthy();
    expect(screen.getByText('Entrepreneur')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Carousel Indicators
  // ──────────────────────────────────────────────────────────

  it('renders 4 indicator dots', () => {
    render(<Testimonials />);
    const indicators = screen.getAllByRole('tab');
    expect(indicators.length).toBe(4);
  });

  it('first indicator is active by default', () => {
    render(<Testimonials />);
    const indicators = screen.getAllByRole('tab');
    expect(indicators[0].className).toContain('active');
  });

  it('indicator click navigates to that testimonial', () => {
    render(<Testimonials />);

    const indicators = screen.getAllByRole('tab');
    fireEvent.click(indicators[2]); // third testimonial (index 2)

    expect(screen.getByText('Ahmed Al Mansouri')).toBeTruthy();
    expect(screen.getByText(/CEO, Tech Startup/i)).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Autoplay
  // ──────────────────────────────────────────────────────────

  it('auto-advances to the next testimonial after CAROUSEL_AUTOPLAY ms', () => {
    render(<Testimonials />);

    expect(screen.getByText('James Richardson')).toBeTruthy();

    // Advance past the autoplay interval (100ms in mocked TIMING)
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByText('Maria Santos')).toBeTruthy();
  });

  it('pauses autoplay on manual navigation', () => {
    render(<Testimonials />);

    // Navigate manually
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    expect(screen.getByText('Maria Santos')).toBeTruthy();

    // Advance past autoplay — should NOT auto-advance because autoplay is paused
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Still on Maria Santos (autoplay paused)
    expect(screen.getByText('Maria Santos')).toBeTruthy();
  });

  it('resumes autoplay after CAROUSEL_RESUME ms', () => {
    render(<Testimonials />);

    // Navigate manually — pauses autoplay
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    expect(screen.getByText('Maria Santos')).toBeTruthy();

    // Advance past CAROUSEL_RESUME (200ms) to allow autoplay to resume
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Now advance past one autoplay cycle
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should have advanced from Maria Santos to Ahmed Al Mansouri
    expect(screen.getByText('Ahmed Al Mansouri')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Accessibility
  // ──────────────────────────────────────────────────────────

  it('indicators have proper aria-label', () => {
    render(<Testimonials />);
    expect(screen.getByLabelText('Go to testimonial 1')).toBeTruthy();
    expect(screen.getByLabelText('Go to testimonial 2')).toBeTruthy();
    expect(screen.getByLabelText('Go to testimonial 3')).toBeTruthy();
    expect(screen.getByLabelText('Go to testimonial 4')).toBeTruthy();
  });

  it('indicator tablist has proper role and label', () => {
    render(<Testimonials />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeTruthy();
    expect(tablist.getAttribute('aria-label')).toBe('Testimonial navigation');
  });

  it('active indicator has aria-current', () => {
    render(<Testimonials />);
    const indicators = screen.getAllByRole('tab');
    expect(indicators[0].getAttribute('aria-current')).toBe('true');
    expect(indicators[1].getAttribute('aria-current')).toBeNull();
  });

  // ──────────────────────────────────────────────────────────
  // Wrap-Around
  // ──────────────────────────────────────────────────────────

  it('wraps from last to first on "Next"', () => {
    render(<Testimonials />);

    // Navigate: 0→1→2→3→0
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    fireEvent.click(screen.getByLabelText('Next testimonial'));

    // Should be back to first
    expect(screen.getByText('James Richardson')).toBeTruthy();
  });
});

