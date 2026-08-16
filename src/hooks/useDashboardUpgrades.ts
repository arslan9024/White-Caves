import { useState, useCallback } from 'react';

export interface DashboardWidget {
  id: string;
  title: string;
  category: 'md' | 'sales' | 'inventory' | 'compliance' | 'ai';
  order: number;
}

export interface MicroSparklineData {
  label: string;
  currentValue: string;
  changePercent: string;
  trend: 'up' | 'down' | 'stable';
  points: number[];
}

export const INITIAL_DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: 'md_overview', title: 'Managing Director Sovereign Suite', category: 'md', order: 1 },
  { id: 'live_ticker', title: 'Live Corporate Ticker & DLD Volume', category: 'md', order: 2 },
  { id: 'sales_performance', title: 'Sales & Leasing Closing Pipeline', category: 'sales', order: 3 },
  { id: 'inventory_matrix', title: 'Master Property Inventory Matrix', category: 'inventory', order: 4 },
  { id: 'compliance_status', title: 'RERA Compliance & AML Audit', category: 'compliance', order: 5 },
  { id: 'nadia_whatsapp', title: 'Nadia WhatsApp Automation Desk', category: 'ai', order: 6 },
];

export function useDashboardUpgrades() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(INITIAL_DASHBOARD_WIDGETS);

  const reorderWidgets = useCallback((draggedId: string, targetId: string) => {
    setWidgets((prev) => {
      const draggedIndex = prev.findIndex((w) => w.id === draggedId);
      const targetIndex = prev.findIndex((w) => w.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(draggedIndex, 1);
      newWidgets.splice(targetIndex, 0, removed);
      return newWidgets.map((w, idx) => ({ ...w, order: idx + 1 }));
    });
  }, []);

  const microSparklines: Record<string, MicroSparklineData> = {
    revenue: {
      label: 'Monthly Escrow Volume',
      currentValue: 'AED 48.5M',
      changePercent: '+14.2%',
      trend: 'up',
      points: [22, 28, 34, 38, 42, 48.5],
    },
    leads: {
      label: 'Qualified Inbound Leads',
      currentValue: '1,420',
      changePercent: '+8.7%',
      trend: 'up',
      points: [900, 1050, 1180, 1260, 1340, 1420],
    },
    deals: {
      label: 'Active Pipeline Deals',
      currentValue: '142',
      changePercent: '+5.1%',
      trend: 'up',
      points: [110, 118, 125, 130, 138, 142],
    },
    sla: {
      label: 'SLA Response Rate',
      currentValue: '99.6%',
      changePercent: '+0.4%',
      trend: 'stable',
      points: [98.5, 98.8, 99.1, 99.4, 99.5, 99.6],
    },
  };

  const liveMetrics = {
    activeBrokers: 42,
    closingRatePercent: 86.4,
    dailyDldVolumeAed: '1.48B',
    aiOperationalCount: '26/26',
  };

  return {
    widgets,
    reorderWidgets,
    microSparklines,
    liveMetrics,
  };
}
