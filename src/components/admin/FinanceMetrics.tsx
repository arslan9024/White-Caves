import React from 'react';

export interface FinanceMetricsProps {
  totalRevenueAED?: number;
  monthlyCommissionAED?: number;
  pendingEscrowAED?: number;
}

export const FinanceMetrics: React.FC<FinanceMetricsProps> = ({
  totalRevenueAED = 4850000,
  monthlyCommissionAED = 320000,
  pendingEscrowAED = 1250000,
}) => {
  return (
    <div data-testid="finance-metrics" className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Finance Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-slate-500 block">Total Revenue</span>
          <span className="text-base font-bold text-slate-900">AED {totalRevenueAED.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Monthly Commission</span>
          <span className="text-base font-bold text-[#EF4444]">AED {monthlyCommissionAED.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Pending Escrow</span>
          <span className="text-base font-bold text-slate-700">AED {pendingEscrowAED.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceMetrics;
