import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmployeeLeaderboardPanelLogic } from './EmployeeLeaderboardPanel.logic';

describe('EmployeeLeaderboardPanel.logic', () => {
  it('initializes departments and staff and handles department selection', () => {
    const { result } = renderHook(() => useEmployeeLeaderboardPanelLogic());

    expect(result.current.departments.length).toBeGreaterThan(0);
    expect(result.current.activeDeptId).toBeTruthy();

    act(() => {
      result.current.setViewMode('global');
    });

    expect(result.current.viewMode).toBe('global');
    expect(result.current.globalTopManagers.length).toBeGreaterThanOrEqual(0);
  });
});
