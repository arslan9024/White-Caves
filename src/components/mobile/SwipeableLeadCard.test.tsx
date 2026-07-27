import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SwipeableLeadCard from './SwipeableLeadCard';

const mockLead = {
  id: 'lead-123',
  name: 'Ahmed Al Rashid',
  phone: '+971501234567',
  email: 'ahmed@whitecaves.ae',
  area: 'Palm Jumeirah',
  budget: '2M AED',
  status: 'qualified',
  source: 'website',
};

describe('SwipeableLeadCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders lead information correctly', () => {
    render(
      <SwipeableLeadCard
        lead={mockLead}
        onCall={vi.fn()}
        onSnooze={vi.fn()}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('Ahmed Al Rashid')).toBeDefined();
    expect(screen.getByText('Palm Jumeirah')).toBeDefined();
    expect(screen.getByText('2M AED')).toBeDefined();
    expect(screen.getByText('qualified')).toBeDefined();
  });

  it('triggers onClick handler when card is tapped', () => {
    const handleClick = vi.fn();
    render(
      <SwipeableLeadCard
        lead={mockLead}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Lead: Ahmed Al Rashid/i }));
    expect(handleClick).toHaveBeenCalledWith(mockLead);
  });
});
