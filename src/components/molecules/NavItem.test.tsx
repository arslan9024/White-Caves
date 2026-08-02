import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NavItem } from './NavItem';

describe('NavItem component', () => {
  it('renders label and handles click event', () => {
    const handleClick = vi.fn();
    render(<NavItem label="Properties" onClick={handleClick} />);

    const labelElement = screen.getByText('Properties');
    expect(labelElement).toBeDefined();

    fireEvent.click(labelElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders badge count when provided', () => {
    render(<NavItem label="Leads" badge={5} />);
    expect(screen.getByText('5')).toBeDefined();
  });
});
