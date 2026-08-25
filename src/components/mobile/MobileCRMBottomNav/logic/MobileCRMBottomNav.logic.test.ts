import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useMobileCRMBottomNavLogic, MOBILE_NAV_TABS } from './MobileCRMBottomNav.logic';

describe('MobileCRMBottomNav.logic', () => {
  it('exposes all mobile bottom nav tabs', () => {
    expect(MOBILE_NAV_TABS.length).toBe(5);
    expect(MOBILE_NAV_TABS[0].id).toBe('dashboard');
    expect(MOBILE_NAV_TABS[1].id).toBe('leads');
  });

  it('detects active tab based on current route', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(MemoryRouter, { initialEntries: ['/crm/leads'] }, children);

    const { result } = renderHook(() => useMobileCRMBottomNavLogic(), { wrapper });
    expect(result.current.activeTabId).toBe('leads');
    expect(result.current.tabs).toEqual(MOBILE_NAV_TABS);
    expect(typeof result.current.navigate).toBe('function');
  });
});
