import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BackToTopButton } from './BackToTopButton';

describe('BackToTopButton Component', () => {
  it('renders nothing when scrollY <= 400', () => {
    window.scrollY = 0;
    render(<BackToTopButton />);
    expect(screen.queryByTestId('back-to-top-button')).toBeNull();
  });

  it('renders button when scrollY > 400 and handles smooth scroll to top', () => {
    window.scrollTo = vi.fn();
    render(<BackToTopButton />);
    
    // Simulate scroll past 400px
    window.scrollY = 600;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByTestId('back-to-top-button');
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
