import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import translations from '../i18n/translations';

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar'
} as const;

export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('whitecaves_language') as LanguageType) || LANGUAGES.EN;
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
      localStorage.setItem('whitecaves_language', language);
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
    let value: any = (translations as any)[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        const fallback = (translations as any)[LANGUAGES.EN];
        let fallbackValue: any = fallback;
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
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
      result = result.replace(new RegExp(`{${param}}`, 'g'), String(params[param]));
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
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    translations: (translations as any)[language]
  };

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
