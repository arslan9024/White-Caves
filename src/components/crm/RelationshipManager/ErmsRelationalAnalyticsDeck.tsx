/**
 * ErmsRelationalAnalyticsDeck.tsx
 * White Caves Real Estate LLC - High-Velocity Financial & Relationship Matrix Analytics
 * Pillar 2 (Upgrades 12 & 16) & Pillar 5 (Upgrades 41, 42, & 43)
 * Standards: 5% UAE VAT, 9% UAE Corporate Tax, 70/30 Commission Splits
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { DollarSign, Percent, TrendingUp, ShieldAlert, Award, Calculator, Filter } from 'lucide-react';

export interface ErmsRelationalAnalyticsDeckProps {
  grossDealVolumeAED?: number;
  totalDealsCount?: number;
  onFilterPresetChange?: (preset: string) => void;
}

export const ErmsRelationalAnalyticsDeck: FC<ErmsRelationalAnalyticsDeckProps> = ({
  grossDealVolumeAED = 14500000,
  totalDealsCount = 18,
  onFilterPresetChange,
}) => {
  const [activePreset, setActivePreset] = useState<string>('ALL');

  // FinTech Computations (Pillar 5 Upgrades)
  const vatRate = 0.05; // 5% UAE FTA VAT (Upgrade 42)
  const corporateTaxRate = 0.09; // 9% Corporate Tax provision (Upgrade 43)
  const standardCommissionRate = 0.02; // 2% Real Estate Standard Commission

  const grossCommissionAED = grossDealVolumeAED * standardCommissionRate;
  const agentShareAED = grossCommissionAED * 0.7; // 70% Agent Split (Upgrade 41)
  const brokerageShareAED = grossCommissionAED * 0.3; // 30% Brokerage Cut (Upgrade 41)
  const uaeVatAED = grossCommissionAED * vatRate; // 5% VAT
  const corporateTaxReserveAED = brokerageShareAED * corporateTaxRate; // 9% Corporate Tax Reserve

  const handlePresetSelect = (preset: string) => {
    setActivePreset(preset);
    onFilterPresetChange?.(preset);
  };

  const presets = [
    { id: 'ALL', label: 'All Active Relations' },
    { id: 'LEASES', label: 'Active Leases' },
    { id: 'ESCROW', label: 'Escrow Sync' },
    { id: 'MORTGAGE', label: 'Mortgage Pipeline' },
    { id: 'HIGH_VALUE', label: 'High-Value (>10M)' },
  ];

  return (
    <div
      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 space-y-4"
      data-testid="erms-relational-analytics-deck"
    >
      {/* Header & Filter Presets (Upgrade 16) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-red-500" />
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Relational FinTech & Split Underwriter</h3>
            <p className="text-xs text-zinc-400">
              UAE Statutory Compliance: 5% VAT · 9% Corporate Tax Reserve · 70/30 Merit Splits
            </p>
          </div>
        </div>

        {/* Filter Presets Pill Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1.5 mr-0.5" />
          {presets.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activePreset === p.id
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row (Upgrades 41, 42, 43) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Deal Mesh Volume */}
        <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Gross Pipeline Volume</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-extrabold text-zinc-100 font-mono">
            AED {grossDealVolumeAED.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">{totalDealsCount} Active Deals in Graph</div>
        </div>

        {/* Agent 70% Dynamic Split */}
        <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Agent 70% Split Pool</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-extrabold text-amber-400 font-mono">
            AED {Math.round(agentShareAED).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">70% Merit Allocation (V5.0)</div>
        </div>

        {/* UAE 5% FTA VAT */}
        <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>UAE FTA 5% VAT</span>
            <Percent className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-base font-extrabold text-blue-400 font-mono">
            AED {Math.round(uaeVatAED).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Statutory FTA VAT Accrual</div>
        </div>

        {/* UAE 9% Corporate Tax Reserve */}
        <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Corporate Tax Reserve</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-base font-extrabold text-red-400 font-mono">
            AED {Math.round(corporateTaxReserveAED).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">9% UAE Corporate Tax Buffer</div>
        </div>
      </div>
    </div>
  );
};
