import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BroadcastCampaignSegmenter } from './BroadcastCampaignSegmenter';

describe('BroadcastCampaignSegmenter Component', () => {
  it('renders broadcast campaign segmenter and default audience size', () => {
    render(<BroadcastCampaignSegmenter />);
    expect(screen.getByTestId('broadcast-campaign-segmenter')).toBeDefined();
    expect(screen.getByText(/Luxury Inbound Broadcast Campaign Segmenter/i)).toBeDefined();
    expect(screen.getByText(/OLIVIA ENGINE/i)).toBeDefined();
    expect(screen.getByText(/482 Verified Leads/i)).toBeDefined();
  });
});
