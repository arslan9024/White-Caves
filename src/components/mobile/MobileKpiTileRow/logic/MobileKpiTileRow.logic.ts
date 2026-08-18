/**
 * MobileKpiTileRow.logic.ts — Hook Layer
 */

export interface KpiTile {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
  color: string;
}

export interface UseMobileKpiTileRowReturn {
  tiles: KpiTile[];
}

export function useMobileKpiTileRowLogic(): UseMobileKpiTileRowReturn {
  const tiles: KpiTile[] = [
    {
      id: 'leads',
      label: 'New Leads',
      value: '47',
      delta: '+12%',
      deltaPositive: true,
      icon: 'Users',
      color: '#3b82f6',
    },
    {
      id: 'viewings',
      label: 'Viewings',
      value: '18',
      delta: '+3',
      deltaPositive: true,
      icon: 'Eye',
      color: '#8b5cf6',
    },
    {
      id: 'offers',
      label: 'Offers',
      value: '6',
      delta: '-1',
      deltaPositive: false,
      icon: 'FileText',
      color: '#f97316',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: 'AED 215K',
      delta: '+8%',
      deltaPositive: true,
      icon: 'TrendingUp',
      color: '#ef4444',
    },
    {
      id: 'active',
      label: 'Active Leases',
      value: '143',
      delta: '+2',
      deltaPositive: true,
      icon: 'Home',
      color: '#22c55e',
    },
    {
      id: 'sla',
      label: 'SLA Breach',
      value: '2',
      delta: '-3',
      deltaPositive: true,
      icon: 'AlertCircle',
      color: '#dc2626',
    },
  ];
  return { tiles };
}
