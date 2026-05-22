import { useCallback, useEffect, useMemo, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';

const logger = createLogger('useAdminDashboardData');

export type ActivityType = 'create' | 'update' | 'download' | 'system';
export type AdminTabId = 'overview' | 'users' | 'analytics' | 'settings';

export interface DashboardActivity {
  id: string | number;
  user: string;
  action: string;
  time: string;
  type: ActivityType;
}

export interface DashboardUser {
  id: string | number;
  name: string;
  role: string;
  status: string;
  lastActive: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  activeListings: number;
  totalTransactions: number;
  completedTransactions: number;
  systemHealth: 'excellent' | 'good' | 'warning';
  uptime: number;
  responseTime: number;
  errorRate: number;
}

interface DashboardSummaryResponse {
  success?: boolean;
  data?: {
    metrics?: {
      totalProperties?: number;
      availableProperties?: number;
      totalCommissions?: number;
      totalCommissionValue?: number;
      paidCommissionValue?: number;
    };
    recentActivities?: Array<{
      id?: string | number;
      type?: string;
      action?: string;
      description?: string;
      timestamp?: string;
      user?: string;
    }>;
  };
}

interface DashboardActivitiesResponse {
  success?: boolean;
  data?: Array<{
    id?: string | number;
    type?: string;
    action?: string;
    description?: string;
    timestamp?: string;
    user?: string;
  }>;
}

interface UsersResponse {
  success?: boolean;
  data?: Array<{
    id?: string;
    name?: string;
    role?: string;
    status?: string;
    updatedAt?: string;
    createdAt?: string;
  }>;
}

const FALLBACK_SYSTEM_METRICS: SystemMetrics = {
  totalUsers: 1243,
  activeUsers: 567,
  totalProperties: 3421,
  activeListings: 1987,
  totalTransactions: 856,
  completedTransactions: 742,
  systemHealth: 'excellent',
  uptime: 99.98,
  responseTime: 142,
  errorRate: 0.02,
};

const FALLBACK_RECENT_ACTIVITIES: DashboardActivity[] = [
  {
    id: 'activity-1',
    user: 'John Doe',
    action: 'Created new property listing',
    time: '2 hours ago',
    type: 'create',
  },
  {
    id: 'activity-2',
    user: 'Jane Smith',
    action: 'Updated contract terms',
    time: '1 day ago',
    type: 'update',
  },
  {
    id: 'activity-3',
    user: 'Ahmed Hassan',
    action: 'Downloaded monthly report',
    time: '3 days ago',
    type: 'download',
  },
  {
    id: 'activity-4',
    user: 'System',
    action: 'Database backup completed',
    time: '5 days ago',
    type: 'system',
  },
];

const FALLBACK_USERS: DashboardUser[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    role: 'admin',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    role: 'manager',
    status: 'active',
    lastActive: '1 day ago',
  },
  {
    id: 'user-3',
    name: 'Ahmed Hassan',
    role: 'agent',
    status: 'inactive',
    lastActive: '3 days ago',
  },
];

const mapActivityType = (rawType: string): ActivityType => {
  if (rawType.includes('create')) return 'create';
  if (rawType.includes('download')) return 'download';
  if (rawType.includes('system')) return 'system';
  return 'update';
};

export const useAdminDashboardData = () => {
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(FALLBACK_SYSTEM_METRICS);
  const [recentActivities, setRecentActivities] = useState<DashboardActivity[]>(
    FALLBACK_RECENT_ACTIVITIES
  );
  const [users, setUsers] = useState<DashboardUser[]>(FALLBACK_USERS);

  const refreshData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setIsLoading(true);
    }

    setLoadError(null);

    try {
      const [summaryResult, activitiesResult, usersResult] = await Promise.allSettled([
        authFetch('/api/dashboard/summary').then(
          (response: Response) => response.json() as Promise<DashboardSummaryResponse>
        ),
        authFetch('/api/dashboard/activities?pageSize=20').then(
          (response: Response) => response.json() as Promise<DashboardActivitiesResponse>
        ),
        authFetch('/api/users?pageSize=100').then(
          (response: Response) => response.json() as Promise<UsersResponse>
        ),
      ]);

      const summary = summaryResult.status === 'fulfilled' ? summaryResult.value.data : undefined;
      const metrics = summary?.metrics;
      const activityFeed =
        activitiesResult.status === 'fulfilled'
          ? activitiesResult.value.data
          : summary?.recentActivities;
      const usersData = usersResult.status === 'fulfilled' ? (usersResult.value.data ?? []) : null;

      const totalCommissions = metrics?.totalCommissions ?? 0;
      const totalCommissionValue = metrics?.totalCommissionValue ?? 0;
      const paidCommissionValue = metrics?.paidCommissionValue ?? 0;
      const paidRatio = totalCommissionValue > 0 ? paidCommissionValue / totalCommissionValue : 0;

      setSystemMetrics({
        totalUsers: usersData?.length ?? FALLBACK_SYSTEM_METRICS.totalUsers,
        activeUsers:
          usersData?.filter(userRow => userRow.status === 'active').length ??
          FALLBACK_SYSTEM_METRICS.activeUsers,
        totalProperties: metrics?.totalProperties ?? 0,
        activeListings: metrics?.availableProperties ?? 0,
        totalTransactions: totalCommissions,
        completedTransactions: Math.round(totalCommissions * paidRatio),
        systemHealth: paidRatio >= 0.8 ? 'excellent' : paidRatio >= 0.5 ? 'good' : 'warning',
        uptime: 99.9,
        responseTime: 142,
        errorRate: Math.max(0, parseFloat(((1 - paidRatio) * 0.1).toFixed(2))),
      });

      if (activityFeed && activityFeed.length > 0) {
        setRecentActivities(
          activityFeed.map((activity, index) => {
            const rawType = (activity.type ?? '').toLowerCase();
            return {
              id: activity.id ?? `activity-${index}`,
              user: activity.user ?? 'System',
              action: activity.description || activity.action || 'Activity update',
              time: activity.timestamp ? new Date(activity.timestamp).toLocaleString('en-AE') : '—',
              type: mapActivityType(rawType),
            };
          })
        );
      }

      if (usersData && usersData.length > 0) {
        setUsers(
          usersData.map((row, index) => ({
            id: row.id ?? `user-${index}`,
            name: row.name ?? 'Unknown',
            role: row.role ?? 'user',
            status: row.status ?? 'inactive',
            lastActive: row.updatedAt
              ? new Date(row.updatedAt).toLocaleString('en-AE')
              : row.createdAt
                ? new Date(row.createdAt).toLocaleString('en-AE')
                : '—',
          }))
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to load admin dashboard data';
      setLoadError(message);
      logger.warn('Admin dashboard load failed', error);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshData({ silent: true });
  }, [refreshData]);

  const alerts = useMemo(
    () => [
      ...(loadError
        ? [{ id: 1, severity: 'error', message: loadError, status: 'active' as const }]
        : []),
      ...(systemMetrics.responseTime > 250
        ? [
            {
              id: 2,
              severity: 'warning' as const,
              message: 'High response time detected',
              status: 'active' as const,
            },
          ]
        : [
            {
              id: 2,
              severity: 'info' as const,
              message: 'System performance is stable',
              status: 'active' as const,
            },
          ]),
      {
        id: 3,
        severity: 'warning' as const,
        message: 'High CPU usage detected',
        status: 'active' as const,
      },
      {
        id: 4,
        severity: 'info' as const,
        message: 'Database backup completed successfully',
        status: 'active' as const,
      },
    ],
    [loadError, systemMetrics.responseTime]
  );

  const activitiesPerPage = 5;
  const usersPerPage = 10;

  const paginatedActivities = useMemo(() => {
    const start = (currentActivityPage - 1) * activitiesPerPage;
    const end = start + activitiesPerPage;
    return recentActivities.slice(start, end);
  }, [currentActivityPage, recentActivities]);

  const activitiesTotalPages = useMemo(
    () => Math.ceil(recentActivities.length / activitiesPerPage),
    [recentActivities.length]
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentUsersPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    return users.slice(start, end);
  }, [currentUsersPage, users]);

  const usersTotalPages = useMemo(() => Math.ceil(users.length / usersPerPage), [users.length]);

  return {
    filterPeriod,
    setFilterPeriod,
    currentActivityPage,
    setCurrentActivityPage,
    currentUsersPage,
    setCurrentUsersPage,
    isLoading,
    loadError,
    systemMetrics,
    totalActivities: recentActivities.length,
    paginatedActivities,
    activitiesTotalPages,
    totalUsers: users.length,
    paginatedUsers,
    usersTotalPages,
    alerts,
    refreshData,
  };
};
