/**
 * Error.test.tsx — Smoke tests for Error component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

import Error from './Error';

describe('Error component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders default error message', () => {
    render(<Error />);
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Something went wrong. Please try again.')).toBeTruthy();
  });

  it('renders custom error message', () => {
    render(<Error message="Network error occurred" />);
    expect(screen.getByText('Network error occurred')).toBeTruthy();
  });

  it('shows error icon', () => {
    render(<Error />);
    expect(screen.getByText('⚠️')).toBeTruthy();
  });

  it('shows redirect countdown', () => {
    render(<Error redirectDelay={10} />);
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('counts down over time', () => {
    render(<Error redirectDelay={5} />);
    expect(screen.getByText('5')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('4')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('navigates to home after countdown', () => {
    render(<Error redirectDelay={2} />);

    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { vi.advanceTimersByTime(1000); });
    act(() => { vi.advanceTimersByTime(1000); });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates home on button click', () => {
    render(<Error />);
    const btn = screen.getByRole('button', { name: /home/i });
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
