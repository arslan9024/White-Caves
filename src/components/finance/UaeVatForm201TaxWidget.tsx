import React, { FC, useState } from 'react';
import {
  Receipt,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Percent,
} from 'lucide-react';
import {
  calculateDealVatAndCorporateTax,
  CORPORATE_TAX_STATUTORY_THRESHOLD_AED,
  type VatAndTaxBreakdown,
} from '../../services/finance/uaeVatAndTaxEngine';

export interface UaeVatForm201TaxWidgetProps {
  defaultCommissionAed?: number;
  defaultAgentXp?: number;
  defaultQuarterProfitAed?: number;
  className?: string;
}

export const UaeVatForm201TaxWidget: FC<UaeVatForm201TaxWidgetProps> = ({
  defaultCommissionAed = 50000,
  defaultAgentXp = 3000,
  defaultQuarterProfitAed = 400000,
  className = '',
}) => {
  const [commissionAed, setCommissionAed] = useState<number>(defaultCommissionAed);
  const [agentXp, setAgentXp] = useState<number>(defaultAgentXp);
  const [quarterProfitAed, setQuarterProfitAed] = useState<number>(defaultQuarterProfitAed);

  const breakdown: VatAndTaxBreakdown = calculateDealVatAndCorporateTax({
    dealId: 'DEAL-2026-LIVE',
    grossTransactionValueAed: commissionAed * 50,
    agencyGrossCommissionAed: commissionAed,
    agentMeritXp: agentXp,
    quarterCumulativeProfitAed: quarterProfitAed,
    isCommercial: false,
  });

  return (
    <div
      role="region"
      aria-label="UAE FTA Form 201 VAT & Corporate Tax Ledger"
      className={`p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">
              FTA Form 201 VAT &amp; 9% Corporate Tax Ledger
            </h4>
            <p className="text-[11px] text-slate-400">
              UAE Decree-Law (8) of 2017 &amp; Law (47) of 2022 · Statutory Rules AEG-028/029
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
          Form 201 Ready
        </span>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 font-bold mb-1">
            Agency Gross Commission (AED)
          </label>
          <input
            type="number"
            aria-label="Agency Gross Commission in AED"
            value={commissionAed}
            onChange={e => setCommissionAed(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-bold mb-1">
            Agent Merit XP Level
          </label>
          <input
            type="number"
            aria-label="Agent Merit XP Level"
            value={agentXp}
            onChange={e => setAgentXp(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-bold mb-1">
            QTD Net Profit (AED)
          </label>
          <input
            type="number"
            aria-label="Quarter to date net profit in AED"
            value={quarterProfitAed}
            onChange={e => setQuarterProfitAed(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Results HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">5% FTA Output VAT</span>
          <p className="text-sm font-extrabold text-amber-400 mt-0.5">
            {breakdown.vatAmountAed.toLocaleString()} AED
          </p>
          <span className="text-[9px] text-slate-500">Box 1a Standard Rated</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total with 5% VAT</span>
          <p className="text-sm font-extrabold text-white mt-0.5">
            {breakdown.totalCommissionWithVatAed.toLocaleString()} AED
          </p>
          <span className="text-[9px] text-slate-500">Invoice Total</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Broker Split ({breakdown.agentCommissionTierPercent}%)
          </span>
          <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
            {breakdown.agentNetPayoutAed.toLocaleString()} AED
          </p>
          <span className="text-[9px] text-slate-500">Tier: {agentXp >= 5000 ? '70% Top' : agentXp >= 2500 ? '65% Senior' : '60% Base'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">9% CT Reserve</span>
          <p className="text-sm font-extrabold text-rose-400 mt-0.5">
            {breakdown.corporateTaxReserveAmountAed.toLocaleString()} AED
          </p>
          <span className="text-[9px] text-slate-500">
            {breakdown.corporateTaxApplicable ? 'Over 375k Cap' : 'SBR Relieved (0%)'}
          </span>
        </div>
      </div>

      {/* Net Retained Strip */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">Company Net Retained P&amp;L:</span>
        <strong className="text-white font-mono text-sm">
          {breakdown.companyNetRetainedAed.toLocaleString()} AED
        </strong>
      </div>
    </div>
  );
};

export default UaeVatForm201TaxWidget;
