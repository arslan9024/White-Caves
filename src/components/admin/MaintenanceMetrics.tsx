import React from 'react';

export interface MaintenanceMetricsProps {
  openTickets?: number;
  urgentTickets?: number;
  avgResolutionHours?: number;
}

export const MaintenanceMetrics: React.FC<MaintenanceMetricsProps> = ({
  openTickets = 34,
  urgentTickets = 5,
  avgResolutionHours = 4.2,
}) => {
  return (
    <div data-testid="maintenance-metrics" className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Operations & Maintenance Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-slate-500 block">Open Maintenance Tickets</span>
          <span className="text-base font-bold text-slate-900">{openTickets}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Urgent SLA Dispatch</span>
          <span className="text-base font-bold text-[#EF4444]">{urgentTickets}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Avg Resolution Time</span>
          <span className="text-base font-bold text-slate-700">{avgResolutionHours}h</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMetrics;
