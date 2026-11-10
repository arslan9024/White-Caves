// FILE: src/components/crm/VipPitchBookModal/VipPitchBookModal.test.tsx
/**
 * White Caves Real Estate LLC - VIP Luxury Pitch Book Modal Test Suite
 * Standard: Vitest + Testing Library
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { compilePitchBookData } from './VipPitchBookModal.logic';
import { VipPitchBookModalView } from './VipPitchBookModalView';
import type { REPropertyNode } from '../REPropertyManager/REPropertyManager.types';

const MOCK_PROPERTY: REPropertyNode = {
  _id: 'mock-1',
  repropertyId: 'REP-001',
  title: 'Palm Jumeirah Signature Villa',
  propertyType: 'VILLA',
  purpose: 'BUY',
  status: 'AVAILABLE',
  location: 'Palm Jumeirah',
  subLocation: 'Frond N',
  priceAED: 25000000,
  areaSqft: 7500,
  bedrooms: 6,
  bathrooms: 7,
  developer: 'Nakheel',
  completionStatus: 'READY',
  trakheesiPermit: 'TRAK-2026-8812',
  dldTitleDeedNumber: 'TD-9021-PJ',
  assignedBroker: 'Arslan Malik',
  supervisorCode: 'SUP-01',
  featured: true,
  images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
  description: 'Ultra-prime beachfront luxury estate with panoramic Dubai skyline vistas.',
  features: ['Private Beach', 'Infinity Pool', 'Smart Home Automation'],
  createdAt: '2026-11-09',
};

afterEach(() => {
  cleanup();
});

describe('compilePitchBookData logic layer', () => {
  it('correctly calculates 4% DLD transfer fee and closing costs', () => {
    const data = compilePitchBookData(MOCK_PROPERTY);

    expect(data.dldTransferFee).toBe(1000000); // 4% of 25,000,000
    expect(data.trusteeFee).toBe(4200);
    expect(data.investorYieldPct).toBeGreaterThan(0);
    expect(data.totalFundRequired).toBeGreaterThan(25000000);
  });
});

describe('VipPitchBookModalView UI mounting and interaction', () => {
  it('renders modal when open is true with property specifications', () => {
    render(<VipPitchBookModalView property={MOCK_PROPERTY} isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByTestId('vip-pitch-book-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Palm Jumeirah Signature Villa/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/AED 25,000,000/i)).toBeInTheDocument();
    expect(screen.getByTestId('btn-print-pitch-book')).toBeInTheDocument();
  });

  it('handles window print dispatch when print button clicked', () => {
    const printSpy = vi.fn();
    window.open = vi.fn().mockReturnValue({
      document: { write: vi.fn(), close: vi.fn() },
      focus: vi.fn(),
      print: printSpy,
    });

    render(<VipPitchBookModalView property={MOCK_PROPERTY} isOpen={true} onClose={vi.fn()} />);
    const printBtn = screen.getByTestId('btn-print-pitch-book');
    fireEvent.click(printBtn);

    expect(window.open).toHaveBeenCalled();
  });
});
