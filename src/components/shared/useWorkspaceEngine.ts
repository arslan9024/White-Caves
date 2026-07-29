import { useMemo, useState } from 'react';
import { AED_TO_USD, AED_TO_EUR, AED_TO_GBP } from '../../mocks/dubaiRealEstateMocks';

export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP';

export interface UseWorkspaceEngineOptions {
  initialCurrency?: Currency;
}

export function useWorkspaceEngine(options: UseWorkspaceEngineOptions = {}) {
  const [currency, setCurrency] = useState<Currency>(options.initialCurrency ?? 'AED');

  const convertPrice = useMemo(() => {
    return (priceAED: number, targetCurrency: Currency = currency): string => {
      let converted = priceAED;
      let symbol = 'AED ';

      if (targetCurrency === 'USD') {
        converted = priceAED * AED_TO_USD;
        symbol = '$';
      } else if (targetCurrency === 'EUR') {
        converted = priceAED * AED_TO_EUR;
        symbol = '€';
      } else if (targetCurrency === 'GBP') {
        converted = priceAED * AED_TO_GBP;
        symbol = '£';
      }

      if (converted >= 1_000_000) {
        return `${symbol}${(converted / 1_000_000).toFixed(1)}M`;
      }
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    };
  }, [currency]);

  return {
    currency,
    setCurrency,
    convertPrice,
    exchangeRates: {
      USD: AED_TO_USD,
      EUR: AED_TO_EUR,
      GBP: AED_TO_GBP,
    },
  };
}

export default useWorkspaceEngine;
