import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('../../utils/apiClient', () => ({
  apiClient: mockApiClient,
}));

import {
  fetchDashboardPreferences,
  fetchRoleDashboardConfig,
  saveDashboardPreferences,
} from '../dashboardPreferencesAPI';

describe('dashboardPreferencesAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDashboardPreferences', () => {
    it('returns normalized preferences from API payload', async () => {
      mockApiClient.get.mockResolvedValueOnce({
        success: true,
        data: {
          role: 'manager',
          widgets: [
            { id: 'team-kpis', title: 'Team KPIs', enabled: true },
            { id: 'bad-widget', enabled: true },
          ],
          layout: 'compact',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
      });

      const result = await fetchDashboardPreferences();

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/preferences');
      expect(result).toEqual({
        role: 'manager',
        layout: 'compact',
        updatedAt: '2026-03-01T00:00:00.000Z',
        widgets: [{ id: 'team-kpis', title: 'Team KPIs', enabled: true }],
      });
    });

    it('throws on invalid payload structure', async () => {
      mockApiClient.get.mockResolvedValueOnce(null);

      await expect(fetchDashboardPreferences()).rejects.toThrow(
        'Invalid dashboard preferences payload'
      );
    });
  });

  describe('saveDashboardPreferences', () => {
    it('persists payload and returns normalized response', async () => {
      const widgets = [{ id: 'kpi-overview', title: 'KPI Overview', enabled: false }];
      mockApiClient.put.mockResolvedValueOnce({
        success: true,
        data: {
          role: 'owner',
          widgets,
          layout: 'default',
        },
      });

      const result = await saveDashboardPreferences(widgets, 'default');

      expect(mockApiClient.put).toHaveBeenCalledWith('/dashboard/preferences', {
        widgets,
        layout: 'default',
      });
      expect(result.widgets).toEqual(widgets);
      expect(result.role).toBe('owner');
      expect(result.layout).toBe('default');
    });
  });

  describe('fetchRoleDashboardConfig', () => {
    it('returns role config with forced default layout', async () => {
      mockApiClient.get.mockResolvedValueOnce({
        success: true,
        data: {
          role: 'admin',
          widgets: [{ id: 'system-health', title: 'System Health', enabled: true }],
          layout: 'custom',
        },
      });

      const result = await fetchRoleDashboardConfig();

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/config');
      expect(result.role).toBe('admin');
      expect(result.layout).toBe('default');
      expect(result.widgets).toEqual([
        { id: 'system-health', title: 'System Health', enabled: true },
      ]);
    });
  });
});
