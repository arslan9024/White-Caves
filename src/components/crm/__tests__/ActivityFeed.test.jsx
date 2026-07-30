import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ActivityFeed from '../ActivityFeed';

describe('ActivityFeed Component', () => {
  it('renders empty activity feed state when activities list is empty', () => {
    render(<ActivityFeed activities={[]} />);
    expect(screen.getByText('No recent activity')).toBeDefined();
  });

  it('renders activity items when provided', () => {
    const mockActivities = [
      { id: 1, title: 'Lead Contacted', timestamp: new Date().toISOString(), type: 'call' }
    ];
    render(<ActivityFeed activities={mockActivities} />);
    expect(screen.getByText('Lead Contacted')).toBeDefined();
  });
});
