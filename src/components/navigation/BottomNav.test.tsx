import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BottomNav from './BottomNav';

describe('BottomNav component', () => {
  it('renders all 5 navigation tabs', () => {
    render(<BottomNav currentPath="/" />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Leads')).toBeDefined();
    expect(screen.getByText('Properties')).toBeDefined();
    expect(screen.getByText('Viewings')).toBeDefined();
    expect(screen.getByText('More')).toBeDefined();
  });
});
