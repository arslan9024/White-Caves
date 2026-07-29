import React from 'react';

export interface LeadMetricsProps {
  totalLeads?: number;
  hotLeads?: number;
  conversionRate?: number;
}

export const LeadMetrics: React.FC<LeadMetricsProps> = ({
  totalLeads = 1240,
  hotLeads = 185,
  conversionRate = 14.2,
}) => {
  return (
    <div data-testid="lead-metrics" className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Lead Conversion Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-slate-500 block">Total Pipeline Leads</span>
          <span className="text-base font-bold text-slate-900">{totalLeads}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Hot Leads (Score ≥75)</span>
          <span className="text-base font-bold text-[#EF4444]">{hotLeads}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Conversion Rate</span>
          <span className="text-base font-bold text-slate-700">{conversionRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default LeadMetrics;
