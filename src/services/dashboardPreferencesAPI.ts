import { apiClient } from '../utils/apiClient';
import { createLogger } from '../utils/logger';
import type { DashboardWidgetConfig } from '../config/dashboardConfigs';

const logger = createLogger('dashboardPreferencesAPI');

export interface DashboardPreferences {
  role: string;
  widgets: DashboardWidgetConfig[];
  layout: string;
  updatedAt?: string;
}

interface DashboardApiResponse<T> {
  success: boolean;
  data: T;
}

const normalizeWidgets = (widgets: unknown): DashboardWidgetConfig[] => {
  if (!Array.isArray(widgets)) {
    return [];
  }

  return widgets
    .map(item => {
      if (typeof item !== 'object' || item === null) {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const id = typeof candidate.id === 'string' ? candidate.id : '';
      const title = typeof candidate.title === 'string' ? candidate.title : '';
      const enabled = typeof candidate.enabled === 'boolean' ? candidate.enabled : false;

      if (!id || !title) {
        return null;
      }

      return { id, title, enabled };
    })
    .filter((item): item is DashboardWidgetConfig => item !== null);
};

const parsePreferencesPayload = (payload: unknown): DashboardPreferences => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid dashboard preferences payload');
  }

  const dataEnvelope = payload as DashboardApiResponse<Record<string, unknown>>;
  const data = dataEnvelope.data;

  if (typeof data !== 'object' || data === null) {
    throw new Error('Dashboard preferences response missing data');
  }

  const role = typeof data.role === 'string' ? data.role : 'agent';
  const layout = typeof data.layout === 'string' ? data.layout : 'default';
  const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : undefined;

  return {
    role,
    layout,
    updatedAt,
    widgets: normalizeWidgets(data.widgets),
  };
};

export const fetchDashboardPreferences = async (): Promise<DashboardPreferences> => {
  try {
    const response = await apiClient.get('/dashboard/preferences');
    return parsePreferencesPayload(response);
  } catch (error) {
    logger.error('Failed to fetch dashboard preferences', error);
    throw error;
  }
};

export const saveDashboardPreferences = async (
  widgets: DashboardWidgetConfig[],
  layout = 'default'
): Promise<DashboardPreferences> => {
  try {
    const response = await apiClient.put('/dashboard/preferences', {
      widgets,
      layout,
    });

    return parsePreferencesPayload(response);
  } catch (error) {
    logger.error('Failed to save dashboard preferences', error);
    throw error;
  }
};

export const fetchRoleDashboardConfig = async (): Promise<DashboardPreferences> => {
  try {
    const response = await apiClient.get('/dashboard/config');
    const parsed = parsePreferencesPayload(response);

    return {
      ...parsed,
      layout: 'default',
    };
  } catch (error) {
    logger.error('Failed to fetch role dashboard config', error);
    throw error;
  }
};
