/**
 * Services.test.tsx — Smoke tests for Services component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Services from './Services';

describe('Services', () => {
  it('renders section title', () => {
    render(<Services />);
    expect(screen.getByText('Our Services')).toBeTruthy();
  });

  it('renders tenant service card', () => {
    render(<Services />);
    expect(screen.getByText('For Tenants')).toBeTruthy();
    expect(screen.getByText(/Property matching based on preferences/)).toBeTruthy();
    expect(screen.getByText(/Lease agreement assistance/)).toBeTruthy();
  });

  it('renders buyer service card', () => {
    render(<Services />);
    expect(screen.getByText('For Buyers')).toBeTruthy();
    expect(screen.getByText(/Property search and matching/)).toBeTruthy();
    expect(screen.getByText(/Purchase negotiation/)).toBeTruthy();
  });

  it('renders service descriptions', () => {
    render(<Services />);
    expect(screen.getByText(/We help tenants find and rent their ideal home/)).toBeTruthy();
    expect(screen.getByText(/We assist buyers in purchasing their dream home/)).toBeTruthy();
  });

  it('renders all service items', () => {
    const { container } = render(<Services />);
    // Tenant: 4 items + Buyer: 4 items = 8 total
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(8);
  });
});
