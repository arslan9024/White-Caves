import React from 'react';

export interface LeasingMetricsProps {
  activeTenancies?: number;
  ejariRegistered?: number;
  upcomingRenewals?: number;
}

export const LeasingMetrics: React.FC<LeasingMetricsProps> = ({
  activeTenancies = 412,
  ejariRegistered = 398,
  upcomingRenewals = 28,
}) => {
  return (
    <div data-testid="leasing-metrics" className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Leasing & Tenancy Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-slate-500 block">Active Tenancies</span>
          <span className="text-base font-bold text-slate-900">{activeTenancies}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">EJARI Verified</span>
          <span className="text-base font-bold text-slate-700">{ejariRegistered}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Renewals (30 Days)</span>
          <span className="text-base font-bold text-[#EF4444]">{upcomingRenewals}</span>
        </div>
      </div>
    </div>
  );
};

export default LeasingMetrics;
