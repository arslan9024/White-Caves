import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardUpgrades, INITIAL_DASHBOARD_WIDGETS } from './useDashboardUpgrades';

describe('useDashboardUpgrades', () => {
  it('initializes with initial widgets and micro-sparklines', () => {
    const { result } = renderHook(() => useDashboardUpgrades());

    expect(result.current.widgets.length).toBe(INITIAL_DASHBOARD_WIDGETS.length);
    expect(result.current.microSparklines.revenue).toBeDefined();
  });

  it('reorders widgets on demand', () => {
    const { result } = renderHook(() => useDashboardUpgrades());

    act(() => {
      result.current.reorderWidgets('md_overview', 'live_ticker');
    });

    expect(result.current.widgets[0].id).toBe('live_ticker');
  });
});
