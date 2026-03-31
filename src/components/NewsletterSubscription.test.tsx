/**
 * NewsletterSubscription.test.tsx — Smoke tests for newsletter component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import NewsletterSubscription from './NewsletterSubscription';

describe('NewsletterSubscription', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders heading', () => {
    render(<NewsletterSubscription />);
    expect(screen.getByText('Stay Updated on Dubai Real Estate')).toBeTruthy();
  });

  it('renders email input and subscribe button', () => {
    render(<NewsletterSubscription />);
    expect(screen.getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(screen.getByText('Subscribe')).toBeTruthy();
  });

  it('renders benefits list', () => {
    render(<NewsletterSubscription />);
    expect(screen.getByText(/First access to new property listings/)).toBeTruthy();
    expect(screen.getByText(/Weekly market analysis & trends/)).toBeTruthy();
    expect(screen.getByText(/Investment tips from experts/)).toBeTruthy();
    expect(screen.getByText(/Exclusive subscriber offers/)).toBeTruthy();
  });

  it('renders privacy note', () => {
    render(<NewsletterSubscription />);
    expect(screen.getByText(/Privacy Policy/)).toBeTruthy();
  });

  it('renders subscriber count', () => {
    render(<NewsletterSubscription />);
    expect(screen.getByText(/12,000\+/)).toBeTruthy();
  });

  it('shows error for invalid email (no @ sign)', () => {
    render(<NewsletterSubscription />);
    const input = screen.getByPlaceholderText('Enter your email address');

    // The component checks email.includes('@') — so a value without @ triggers the error
    fireEvent.change(input, { target: { value: 'notemail' } });

    // Submit via the form element directly
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('shows error for empty email', () => {
    render(<NewsletterSubscription />);
    const button = screen.getByText('Subscribe');
    fireEvent.click(button);
    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('shows success message after valid submission', () => {
    render(<NewsletterSubscription />);
    const input = screen.getByPlaceholderText('Enter your email address');
    const button = screen.getByText('Subscribe');

    fireEvent.change(input, { target: { value: 'user@example.com' } });
    fireEvent.click(button);

    // Advance past the simulated API delay
    act(() => { vi.advanceTimersByTime(2000); });

    expect(screen.getByText(/Thank you for subscribing/)).toBeTruthy();
  });
});
