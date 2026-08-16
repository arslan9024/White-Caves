import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CareerMilestoneTimeline } from './CareerMilestoneTimeline';

describe('CareerMilestoneTimeline Component', () => {
  it('renders corporate growth milestones and statutory track record', () => {
    render(<CareerMilestoneTimeline />);
    expect(screen.getByTestId('career-milestone-timeline')).toBeDefined();
    expect(screen.getByText(/Corporate Growth & Strategic Milestones/i)).toBeDefined();
    expect(screen.getByText(/SOVEREIGN TRACK RECORD/i)).toBeDefined();
    expect(screen.getByText(/AEGIS Sovereign OS V3\.0 Complete/i)).toBeDefined();
    expect(screen.getByText(/AED 500M\+ Transaction Volume Milestone/i)).toBeDefined();
    expect(screen.getByText(/White Caves Real Estate LLC Inception/i)).toBeDefined();
  });
});
