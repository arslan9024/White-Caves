/**
 * ErmsCorporateUmbrellaBanner.test.tsx
 * Targeted Vitest test suite for ErmsCorporateUmbrellaBanner
 * Verifies rendering of White Caves apex credentials, dual trade license activities, and navigation
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsCorporateUmbrellaBanner } from './ErmsCorporateUmbrellaBanner';

describe('ErmsCorporateUmbrellaBanner', () => {
  it('renders company name, apex umbrella badge, and official credentials', () => {
    render(<ErmsCorporateUmbrellaBanner />);

    expect(screen.getByText('White Caves Real Estate LLC')).toBeInTheDocument();
    expect(screen.getByText('Apex Corporate Umbrella')).toBeInTheDocument();
    expect(screen.getByText('DLD ORN: 28491')).toBeInTheDocument();
    expect(screen.getByText('DET: CN-1094821')).toBeInTheDocument();
    expect(screen.getByText('FTA TRN: 100458920100003')).toBeInTheDocument();
  });

  it('renders both statutory trade license activities with correct codes', () => {
    render(<ErmsCorporateUmbrellaBanner />);

    expect(screen.getByText('Real Estate Buying & Selling Brokerage')).toBeInTheDocument();
    expect(screen.getByText('Code 7010.01')).toBeInTheDocument();

    expect(screen.getByText('Leasing Property Brokerage Agents')).toBeInTheDocument();
    expect(screen.getByText('Code 7020.01')).toBeInTheDocument();
  });

  it('triggers onNavigate callback when clicking command center link', () => {
    const handleNavigate = vi.fn();
    render(<ErmsCorporateUmbrellaBanner onNavigate={handleNavigate} />);

    const linkBtn = screen.getByRole('button', { name: /View Corporate Command Center/i });
    fireEvent.click(linkBtn);

    expect(handleNavigate).toHaveBeenCalledWith('/dashboard/overview');
  });
});
