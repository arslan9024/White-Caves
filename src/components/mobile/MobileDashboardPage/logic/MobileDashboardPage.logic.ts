/**
 * MobileDashboardPage.logic.ts — Hook Layer
 */

import { useState, useCallback } from 'react';

export interface RecentActivity {
  id: string;
  type: 'lead' | 'viewing' | 'payment' | 'maintenance';
  title: string;
  detail: string;
  time: string;
  icon: string;
  color: string;
}

const ACTIVITY_DATA: RecentActivity[] = [
  {
    id: 'A1',
    type: 'lead',
    title: 'New lead assigned',
    detail: 'Mohammed Al Rashidi — Dubai Marina AED 3.5M',
    time: '5m ago',
    icon: 'Users',
    color: '#3b82f6',
  },
  {
    id: 'A2',
    type: 'viewing',
    title: 'Viewing confirmed',
    detail: 'Burj Vista Unit 2204 — Tomorrow 11:00 AM',
    time: '22m ago',
    icon: 'Eye',
    color: '#8b5cf6',
  },
  {
    id: 'A3',
    type: 'payment',
    title: 'Rent payment received',
    detail: 'AED 95,000 — Tenant: Rajesh Kumar',
    time: '1h ago',
    icon: 'DollarSign',
    color: '#22c55e',
  },
  {
    id: 'A4',
    type: 'maintenance',
    title: 'Maintenance ticket opened',
    detail: 'AC fault — Unit 1502, JVC Cluster Q',
    time: '2h ago',
    icon: 'Wrench',
    color: '#f97316',
  },
  {
    id: 'A5',
    type: 'lead',
    title: 'Lead SLA breach alert',
    detail: 'Sarah Williams — 17 minutes without response',
    time: '3h ago',
    icon: 'AlertCircle',
    color: '#ef4444',
  },
];

export interface UseMobileDashboardPageReturn {
  activities: RecentActivity[];
  isRefreshing: boolean;
  agentName: string;
  handleRefresh: () => Promise<void>;
}

export function useMobileDashboardPageLogic(): UseMobileDashboardPageReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsRefreshing(false);
  }, []);

  return {
    activities: ACTIVITY_DATA,
    isRefreshing,
    agentName: 'Arslan Malik',
    handleRefresh,
  };
}
