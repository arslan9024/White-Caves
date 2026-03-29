import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import translations from '../i18n/translations';
import { safeStorage } from '../utils/safeStorage';

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar'
} as const;

export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];

/** Recursive translation value: either a string leaf or nested object */
type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationRecord = Record<string, TranslationValue>;

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  translations: TranslationRecord;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    if (typeof window !== 'undefined') {
      const stored = safeStorage.get('whitecaves_language');
      if (stored === LANGUAGES.EN || stored === LANGUAGES.AR) {
        return stored;
      }
    }
    return LANGUAGES.EN;
  });

  const isRTL = language === LANGUAGES.AR;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.body.style.fontFamily = isRTL 
        ? "'Cairo', 'Noto Sans Arabic', sans-serif" 
        : "'Montserrat', 'Open Sans', sans-serif";
    }
    if (typeof localStorage !== 'undefined') {
      safeStorage.set('whitecaves_language', language);
    }
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: LanguageType) => {
    if (lang === LANGUAGES.EN || lang === LANGUAGES.AR) {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN);
  }, []);

  const t = useCallback((key: string, params: Record<string, string | number> = {}): string => {
    const keys = key.split('.');
    const langTranslations = (translations as Record<string, TranslationRecord>)[language];
    let value: TranslationValue | undefined = langTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as TranslationRecord)[k];
      } else {
        const fallback: TranslationRecord | undefined = (translations as Record<string, TranslationRecord>)[LANGUAGES.EN];
        let fallbackValue: TranslationValue | undefined = fallback;
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = (fallbackValue as TranslationRecord)[fk];
          } else {
            return key;
          }
        }
        value = fallbackValue;
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    let result = value;
    Object.keys(params).forEach(param => {
      // Escape regex special chars in param name to prevent SyntaxError
      const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(`{${escaped}}`, 'g'), String(params[param]));
    });

    return result;
  }, [language]);

  const formatNumber = useCallback((number: number): string => {
    if (typeof number !== 'number') return String(number);
    return new Intl.NumberFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE').format(number);
  }, [language]);

  const formatCurrency = useCallback((amount: number, currency: string = 'AED'): string => {
    if (typeof amount !== 'number') return String(amount);
    return new Intl.NumberFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [language]);

  const formatDate = useCallback((date: Date | string | undefined, options: Intl.DateTimeFormatOptions = {}): string => {
    if (date === null || date === undefined) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    // Guard against Invalid Date — new Date('garbage') produces NaN
    if (isNaN(dateObj.getTime())) return '';
    return new Intl.DateTimeFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  }, [language]);

  const value: LanguageContextType = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    translations: ((translations as Record<string, TranslationRecord>)[language]) || {}
  }), [language, setLanguage, toggleLanguage, isRTL, t, formatNumber, formatCurrency, formatDate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
