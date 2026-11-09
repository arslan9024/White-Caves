import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDashboardQueryState } from './useDashboardQueryState';

describe('useDashboardQueryState', () => {
  it('reads initial empty drawer state and opens drawer with query params', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/dashboard/deals']}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useDashboardQueryState(), { wrapper });

    expect(result.current.drawerState.drawer).toBeNull();
    expect(result.current.drawerState.selectedId).toBeNull();

    act(() => {
      result.current.openDrawer('edit-deal', 'DL-100', 'edit');
    });

    expect(result.current.drawerState.drawer).toBe('edit-deal');
    expect(result.current.drawerState.selectedId).toBe('DL-100');
    expect(result.current.drawerState.mode).toBe('edit');

    act(() => {
      result.current.closeDrawer();
    });

    expect(result.current.drawerState.drawer).toBeNull();
    expect(result.current.drawerState.selectedId).toBeNull();
  });

  it('reads pre-existing query params from URL (e.g. deep link or bookmark)', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/dashboard/deals?drawer=create&mode=create']}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useDashboardQueryState(), { wrapper });

    expect(result.current.drawerState.drawer).toBe('create');
    expect(result.current.drawerState.mode).toBe('create');
  });
});
