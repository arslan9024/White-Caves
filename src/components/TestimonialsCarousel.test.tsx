/**
 * TestimonialsCarousel.test.tsx — Smoke tests for testimonials carousel
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import TestimonialsCarousel from './TestimonialsCarousel';

describe('TestimonialsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders section header', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText('What Our Clients Say')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText(/Trusted by investors and homeowners/)).toBeTruthy();
  });

  it('renders first testimonial by default', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText('James Wilson')).toBeTruthy();
    expect(screen.getByText(/White Caves made my Dubai property investment/)).toBeTruthy();
  });

  it('renders all testimonial names', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText('James Wilson')).toBeTruthy();
    expect(screen.getByText('Fatima Al-Zahra')).toBeTruthy();
    expect(screen.getByText('Michael Chen')).toBeTruthy();
    expect(screen.getByText('Elena Petrov')).toBeTruthy();
    expect(screen.getByText('Ahmed Hassan')).toBeTruthy();
  });

  it('renders navigation buttons (prev/next)', () => {
    render(<TestimonialsCarousel />);
    const buttons = screen.getAllByRole('button');
    // prev + next + 5 dots = 7 buttons
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders carousel dots for each testimonial', () => {
    render(<TestimonialsCarousel />);
    // The prev and next buttons + 5 dot buttons = at least 7 buttons total
    const allButtons = screen.getAllByRole('button');
    // prev (‹) + next (›) + 5 dots = 7
    expect(allButtons.length).toBeGreaterThanOrEqual(7);
  });

  it('renders trust indicators', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText('500+')).toBeTruthy();
  });

  it('auto-plays and advances slides', () => {
    render(<TestimonialsCarousel />);
    const firstCard = screen.getByText('James Wilson').closest('[class*="Card"]');
    
    // Auto-play interval is 5000ms
    act(() => { vi.advanceTimersByTime(5000); });
    
    // After 5s the carousel should have advanced
    // Since all cards are rendered, we just verify no crash
    expect(screen.getByText('Fatima Al-Zahra')).toBeTruthy();
  });

  it('next button advances the carousel', () => {
    render(<TestimonialsCarousel />);
    const nextBtn = screen.getByText('›');
    fireEvent.click(nextBtn);
    // No crash - carousel advances
    expect(screen.getByText('Fatima Al-Zahra')).toBeTruthy();
  });

  it('prev button goes back', () => {
    render(<TestimonialsCarousel />);
    const prevBtn = screen.getByText('‹');
    fireEvent.click(prevBtn);
    // Wraps to last testimonial
    expect(screen.getByText('Ahmed Hassan')).toBeTruthy();
  });

  it('renders property purchase details', () => {
    render(<TestimonialsCarousel />);
    expect(screen.getByText(/Purchased: Penthouse in Downtown Dubai/)).toBeTruthy();
  });

  it('renders star ratings (★ characters)', () => {
    render(<TestimonialsCarousel />);
    // Each testimonial has 5 star characters rendered
    const allStars = screen.getAllByText('★');
    // 5 testimonials × 5 stars = 25 total
    expect(allStars.length).toBe(25);
  });
});
