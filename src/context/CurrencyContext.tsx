import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { safeStorage } from '../utils/safeStorage';

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'CNY';

export interface CurrencyItem {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateToAED: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyItem> = {
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', rateToAED: 1 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateToAED: 3.6725 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateToAED: 3.9841 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateToAED: 4.6189 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', rateToAED: 0.9791 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rateToAED: 0.5085 },
};

export interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencies: Record<CurrencyCode, CurrencyItem>;
  formatPrice: (amountInAED: number) => string;
  convertFromAED: (amountInAED: number, targetCurrency?: CurrencyCode) => number;
  convertToAED: (amount: number, fromCurrency?: CurrencyCode) => number;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = safeStorage.get('whitecaves_currency') as CurrencyCode | null;
      if (stored && stored in SUPPORTED_CURRENCIES) {
        return stored;
      }
    }
    return 'AED';
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      safeStorage.set('whitecaves_currency', currency);
    }
  }, [currency]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (code in SUPPORTED_CURRENCIES) {
      setCurrencyState(code);
    }
  }, []);

  const convertFromAED = useCallback(
    (amountInAED: number, targetCurrency?: CurrencyCode): number => {
      const target = targetCurrency || currency;
      const rate = SUPPORTED_CURRENCIES[target]?.rateToAED || 1;
      return amountInAED / rate;
    },
    [currency]
  );

  const convertToAED = useCallback(
    (amount: number, fromCurrency?: CurrencyCode): number => {
      const source = fromCurrency || currency;
      const rate = SUPPORTED_CURRENCIES[source]?.rateToAED || 1;
      return amount * rate;
    },
    [currency]
  );

  const formatPrice = useCallback(
    (amountInAED: number): string => {
      const converted = convertFromAED(amountInAED, currency);
      const curr = SUPPORTED_CURRENCIES[currency];
      const formattedNumber = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(Math.round(converted));

      return `${curr.symbol} ${formattedNumber}`;
    },
    [currency, convertFromAED]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      currencies: SUPPORTED_CURRENCIES,
      formatPrice,
      convertFromAED,
      convertToAED,
    }),
    [currency, setCurrency, formatPrice, convertFromAED, convertToAED]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useGlobalCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useGlobalCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
