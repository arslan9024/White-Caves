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
      className={`w-full bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}
      aria-label="Currency and Measurement Switcher"
    >
      {/* Left: FX Currency Toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold text-slate-800">
          <Coins className="w-3.5 h-3.5 text-red-400" />
          Currency:
        </span>
        <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
          {currencies.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleCurrencySelect(c)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedCurrency === c
                  ? 'bg-red-500 text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {selectedCurrency !== 'AED' && (
          <span className="text-[11px] text-slate-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />1 {selectedCurrency} ≈{' '}
            {(1 / FX_RATES_TO_AED[selectedCurrency]).toFixed(3)} AED
          </span>
        )}
      </div>

      {/* Right: Dimension Unit Toggle */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-slate-800">
          <Ruler className="w-3.5 h-3.5 text-amber-400" />
          Unit:
        </span>
        <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
          {units.map(u => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitSelect(u)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedUnit === u
                  ? 'bg-red-500 text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
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
