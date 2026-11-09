// FILE: src/components/crm/DldEscrowCalculator/DldEscrowCalculatorView.tsx
/**
 * White Caves Real Estate LLC - DLD & Sovereign Escrow Underwriting UI
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Calculator, ShieldCheck, Building2, Landmark, DollarSign, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDldEscrowCalculator } from './DldEscrowCalculator.logic';
import type { PropertyCategory, BuyerType } from './DldEscrowCalculator.types';

export interface DldEscrowCalculatorViewProps {
  initialPrice?: number;
  initialCategory?: PropertyCategory;
  onProceedToEscrow?: (totalFundRequired: number) => void;
}

export const DldEscrowCalculatorView: FC<DldEscrowCalculatorViewProps> = ({
  initialPrice,
  initialCategory,
  onProceedToEscrow,
}) => {
  const {
    input,
    updateField,
    results,
    formattedResults,
    activeTab,
    setActiveTab,
  } = useDldEscrowCalculator({
    ...(initialPrice ? { propertyPrice: initialPrice } : {}),
    ...(initialCategory ? { category: initialCategory } : {}),
  });

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 space-y-6" data-testid="dld-escrow-calculator-root">
      {/* Header Deck */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Landmark size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
                Department 10 / Department 06 Sovereign Underwriting
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Law 50/2022 Compliant
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              DLD Transfer, Escrow & Closing Cost Underwriter
            </h2>
            <p className="text-xs text-slate-400">
              Interactive statutory fee calculations: 4.0% DLD transfer, trustee split, 5% UAE VAT & 9% corporate tax reserves.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'calculator' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Underwriting Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('escrow-flow')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'escrow-flow' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Escrow Settlement Route
          </button>
        </div>
      </div>

      {activeTab === 'calculator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parameter Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calculator size={14} className="text-red-400" />
              Transaction Parameters
            </h3>

            {/* Property Price */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Property Valuation / Purchase Price (AED)
              </label>
              <input
                type="number"
                value={input.propertyPrice}
                onChange={e => updateField('propertyPrice', Number(e.target.value) || 0)}
                data-testid="input-property-price"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Category & Buyer Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Property Category</label>
                <select
                  value={input.category}
                  onChange={e => updateField('category', e.target.value as PropertyCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="READY_RESIDENTIAL">Ready Residential</option>
                  <option value="OFF_PLAN">Off-Plan (Oqood)</option>
                  <option value="COMMERCIAL">Commercial / Retail</option>
                  <option value="LAND">Residential Plot / Land</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Buyer Profile</label>
                <select
                  value={input.buyerType}
                  onChange={e => updateField('buyerType', e.target.value as BuyerType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="INDIVIDUAL_RESIDENT">UAE Resident Individual</option>
                  <option value="INDIVIDUAL_NON_RESIDENT">Non-Resident Foreigner</option>
                  <option value="CORPORATE_LOCAL">Local LLC Corporate</option>
                  <option value="CORPORATE_OFFSHORE">Offshore Holding Entity</option>
                </select>
              </div>
            </div>

            {/* Mortgage Toggle */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={input.hasMortgage}
                  onChange={e => updateField('hasMortgage', e.target.checked)}
                  className="rounded border-slate-700 text-red-600 focus:ring-0"
                />
                <span>Include Bank Mortgage Financing (0.25% DLD Reg)</span>
              </label>

              {input.hasMortgage && (
                <div className="pt-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Financed Principal Amount (AED)</label>
                  <input
                    type="number"
                    value={input.mortgageAmount}
                    onChange={e => updateField('mortgageAmount', Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Agency Commission % */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Brokerage Commission Rate (% + 5% VAT)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={input.commissionPercentage}
                  onChange={e => updateField('commissionPercentage', Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <span className="font-mono text-xs font-bold text-red-400 w-12 text-right">
                  {input.commissionPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Breakdown & Results (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 3 Executive Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">DLD 4% Transfer</span>
                <span className="text-base font-bold font-mono text-red-400" data-testid="stat-dld-fee">
                  {formattedResults.dldFeeStr}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Total Closing Costs</span>
                <span className="text-base font-bold font-mono text-amber-400" data-testid="stat-closing-costs">
                  {formattedResults.totalClosingStr}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30 bg-red-950/10">
                <span className="text-[10px] font-mono text-red-300 uppercase block mb-1">Total Fund Required</span>
                <span className="text-base font-bold font-mono text-white" data-testid="stat-total-funds">
                  {formattedResults.totalFundStr}
                </span>
              </div>
            </div>

            {/* Line-Item Breakdown Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/70">
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Fee Specification</span>
                <span>Amount (AED)</span>
              </div>
              <div className="divide-y divide-slate-800/60 text-xs">
                {results.breakdown.map(item => (
                  <div key={item.key} className="p-3 flex items-center justify-between hover:bg-slate-900/40 transition-colors">
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.isMandatory && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            Gov
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-100">
                      AED {item.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow Dispatch CTA */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-950 border border-red-500/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-red-400 font-bold uppercase block">
                  DLD Escrow Account Verified
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {results.escrowAccountNumber} (Law 50/2022 Account)
                </span>
              </div>
              <button
                type="button"
                onClick={() => onProceedToEscrow?.(results.totalFundRequired)}
                data-testid="btn-proceed-escrow"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Generate Escrow Settlement PDF</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Escrow Flow Diagram Tab */
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            Dubai Land Department (DLD) Sovereign Escrow Settlement Architecture
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All client funds for property conveyancing are routed directly into designated government escrow accounts under UAE Federal Law No. 50 of 2022. White Caves Real Estate LLC acts strictly as licensed broker (ORN 44483, DET 1388443).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-red-400 uppercase">Stage 1 · Form F Signing</div>
              <p className="text-xs text-slate-300">Unified Contract F generated and signed via DLD Smart Portal with 10% manager deposit cheque.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase">Stage 2 · Developer NOC</div>
              <p className="text-xs text-slate-300">Developer issues digital NOC clearing service charges, maintenance fees, and building obligations.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">Stage 3 · Trustee Transfer</div>
              <p className="text-xs text-slate-300">DLD Authorized Registration Trustee dispatches statutory fees and issues official Title Deed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DldEscrowCalculatorView;
