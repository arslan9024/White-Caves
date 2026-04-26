/**
 * NotFoundPage.test.tsx — Smoke tests for 404 page
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders 404 heading', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeTruthy();
  });

  it('renders "Page Not Found" message', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Page Not Found')).toBeTruthy();
  });

  it('renders description text', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/doesn't exist or has been moved/i)).toBeTruthy();
  });

  it('shows redirect countdown starting at 5', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText(/Redirecting to home page in/)).toBeTruthy();
  });

  it('counts down over time', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('5')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('4')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('navigates to home after countdown reaches 0', () => {
    render(<NotFoundPage />);

    for (let i = 0; i < 6; i++) {
      act(() => { vi.advanceTimersByTime(1000); });
    }

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has a Go Home button that navigates to /', () => {
    render(<NotFoundPage />);
    const btn = screen.getByRole('button', { name: /home/i });
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders house emoji icon', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('🏠')).toBeTruthy();
  });
});
