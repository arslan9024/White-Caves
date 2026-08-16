import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RealtimeExecutiveTicker } from './RealtimeExecutiveTicker';

describe('RealtimeExecutiveTicker Component', () => {
  it('renders realtime executive continuous ticker with live feed badge and events', () => {
    render(<RealtimeExecutiveTicker />);
    expect(screen.getByTestId('realtime-executive-ticker')).toBeDefined();
    expect(screen.getByText(/LIVE FEED/i)).toBeDefined();
    expect(screen.getByText(/Deal Closed: Villa 14B Palm Jumeirah/i)).toBeDefined();
    expect(screen.getByText(/Hot Lead Ingest: Lord Harrington/i)).toBeDefined();
    expect(screen.getByText(/RERA Notarized: Ejari/i)).toBeDefined();
  });
});
