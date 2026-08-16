import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { OfflineAlertBanner } from './OfflineAlertBanner';

describe('OfflineAlertBanner Component', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when browser is online', () => {
    render(<OfflineAlertBanner />);
    expect(screen.queryByTestId('offline-alert-banner')).toBeNull();
  });

  it('renders offline alert banner when offline event fires', () => {
    render(<OfflineAlertBanner />);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByTestId('offline-alert-banner')).toBeDefined();
    expect(screen.getByText(/You are currently offline/i)).toBeDefined();
  });
});
