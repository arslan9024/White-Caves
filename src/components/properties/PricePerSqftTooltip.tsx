import React, { FC, useState } from 'react';
import { HelpCircle, TrendingUp, Info } from 'lucide-react';

export interface PricePerSqftTooltipProps {
  priceAed: number;
  areaSqft: number;
  benchmarkPricePerSqft?: number;
  currency?: string;
  className?: string;
}

export const PricePerSqftTooltip: FC<PricePerSqftTooltipProps> = ({
  priceAed,
  areaSqft,
  benchmarkPricePerSqft = 1850,
  currency = 'AED',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!priceAed || !areaSqft || areaSqft <= 0) return null;

  const pricePerSqft = Math.round(priceAed / areaSqft);
  const variancePct = Math.round(((pricePerSqft - benchmarkPricePerSqft) / benchmarkPricePerSqft) * 100);
  const isCompetitive = variancePct <= 0;

  return (
    <div
      className={`relative inline-flex items-center gap-1 ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="text-xs font-mono font-bold text-slate-300">
        {currency} {pricePerSqft.toLocaleString()}
        <span className="text-[10px] text-slate-400 font-normal">/sqft</span>
      </span>

      <button
        type="button"
        aria-label="Price per square foot market analysis"
        className="p-0.5 text-slate-400 hover:text-white transition-colors cursor-help"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <HelpCircle className="w-3 h-3 text-slate-400 hover:text-red-400" />
      </button>

      {/* Popover Tooltip HUD */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 p-2.5 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px] font-bold text-white">
            <span>DLD Area Valuation</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                isCompetitive
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950 border border-amber-500/40 text-amber-300'
              }`}
            >
              {isCompetitive ? 'High Value' : 'Premium Tier'}
            </span>
          </div>

          <div className="space-y-1 text-[10px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Listed Rate:</span>
              <strong className="text-white">
                {currency} {pricePerSqft.toLocaleString()}/sqft
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DLD Area Median:</span>
              <span className="text-slate-300">
                {currency} {benchmarkPricePerSqft.toLocaleString()}/sqft
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Market Spread:</span>
              <span
                className={`font-bold ${
                  isCompetitive ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`} vs median
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricePerSqftTooltip;
