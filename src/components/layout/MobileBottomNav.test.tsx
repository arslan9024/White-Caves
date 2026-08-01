import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { MobileBottomNav } from './MobileBottomNav';

describe('MobileBottomNav Component', () => {
  it('renders all 5 mobile navigation items', () => {
    render(
      <BrowserRouter>
        <MobileBottomNav />
      </BrowserRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Viewings')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});
