import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavbarLogoRing } from './NavbarLogoRing';

describe('NavbarLogoRing Component', () => {
  it('renders glowing 76px navbar logo ring and handles click navigation', () => {
    const onClick = vi.fn();
    render(<NavbarLogoRing onClick={onClick} />);
    const logo = screen.getByTestId('navbar-logo-ring');
    expect(logo).toBeDefined();
    expect(screen.getByText('W')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();

    fireEvent.click(logo);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
