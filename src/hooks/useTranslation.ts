/**
 * Universal Translation Hook — White Caves Real Estate LLC
 * Seamlessly interfaces with LanguageContext and Locale Dictionary Data Layer
 */

import { useLanguage, type LanguageType } from '../context/LanguageContext';

export interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

export function useTranslation(): UseTranslationReturn {
  const {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
  } = useLanguage();

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
  };
}

export default useTranslation;
