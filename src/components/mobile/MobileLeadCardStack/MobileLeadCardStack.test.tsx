/**
 * MobileLeadCardStack.test.tsx — Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileLeadCardStack } from './MobileLeadCardStack';

vi.mock('./logic/MobileLeadCardStack.logic', () => ({
  useMobileLeadCardStackLogic: () => ({
    cards: [
      {
        id: 'L001',
        name: 'Mohammed Al Rashidi',
        phone: '+971 50 123 4567',
        budget: 'AED 3.5M',
        area: 'Dubai Marina',
        stage: 'Hot',
        source: 'PropertyFinder',
        lastContact: '2h ago',
      },
    ],
    activeIndex: 0,
    stageColor: () => '#ef4444',
    handleSwipeLeft: vi.fn(),
    handleSwipeRight: vi.fn(),
  }),
}));

describe('MobileLeadCardStack', () => {
  it('renders lead card with name and badge', () => {
    render(<MobileLeadCardStack />);
    expect(screen.getByTestId('mobile-lead-card-stack')).toBeDefined();
    expect(screen.getByText('Mohammed Al Rashidi')).toBeDefined();
    expect(screen.getByText('Hot')).toBeDefined();
  });

  it('shows Contact and Skip action buttons', () => {
    render(<MobileLeadCardStack />);
    expect(screen.getByText('Contact')).toBeDefined();
    expect(screen.getByText('Skip')).toBeDefined();
  });
});
