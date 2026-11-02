import React, { FC, useState } from 'react';
import { Coins, Ruler, TrendingUp } from 'lucide-react';
import { SupportedCurrency, FX_RATES_TO_AED } from '../../utils/currency';

export type SupportedUnit = 'SqFt' | 'SqM';

export interface CurrencyUnitBarProps {
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  onUnitChange?: (unit: SupportedUnit) => void;
  className?: string;
}

export const CurrencyUnitBar: FC<CurrencyUnitBarProps> = ({
  onCurrencyChange,
  onUnitChange,
  className = '',
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('AED');
  const [selectedUnit, setSelectedUnit] = useState<SupportedUnit>('SqFt');

  const handleCurrencySelect = (c: SupportedCurrency) => {
    setSelectedCurrency(c);
    onCurrencyChange?.(c);
  };

  const handleUnitSelect = (u: SupportedUnit) => {
    setSelectedUnit(u);
    onUnitChange?.(u);
  };

  const currencies: SupportedCurrency[] = ['AED', 'USD', 'EUR', 'GBP'];
  const units: SupportedUnit[] = ['SqFt', 'SqM'];

  return (
    <div
      className={`w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}
      aria-label="Currency and Measurement Switcher"
    >
      {/* Left: FX Currency Toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <Coins className="w-3.5 h-3.5 text-red-400" />
          Currency:
        </span>
        <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {currencies.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleCurrencySelect(c)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedCurrency === c
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {selectedCurrency !== 'AED' && (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            1 {selectedCurrency} ≈ {(1 / FX_RATES_TO_AED[selectedCurrency]).toFixed(3)} AED
          </span>
        )}
      </div>

      {/* Right: Dimension Unit Toggle */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <Ruler className="w-3.5 h-3.5 text-amber-400" />
          Unit:
        </span>
        <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {units.map(u => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitSelect(u)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedUnit === u
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyUnitBar;
