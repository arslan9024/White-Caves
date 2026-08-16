import React from 'react';

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencySelectorProps {
  currentCurrency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  className?: string;
}

export const CURRENCY_OPTIONS: Array<{ code: CurrencyCode; label: string; symbol: string; flag: string }> = [
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency = 'AED',
  onCurrencyChange,
  className = '',
}) => {
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <select
        value={currentCurrency}
        onChange={(e) => onCurrencyChange?.(e.target.value as CurrencyCode)}
        className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 cursor-pointer hover:border-slate-500 transition-colors"
        aria-label="Select currency"
      >
        {CURRENCY_OPTIONS.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
