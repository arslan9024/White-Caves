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
import {
  dictionaries,
  supportedLocales,
  SupportedLanguageCode,
} from '../locales';
import { safeStorage } from '../utils/safeStorage';

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
  ES: 'es',
  RU: 'ru',
} as const;

export type LanguageType = SupportedLanguageCode;

/** Recursive translation value: either a string leaf or nested object */
type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationRecord = Record<string, TranslationValue>;

export interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  translations: TranslationRecord;
  supportedLanguages: typeof supportedLocales;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    if (typeof window !== 'undefined') {
      const stored = safeStorage.get('whitecaves_language') as LanguageType | null;
      if (stored && stored in supportedLocales) {
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
        : "'Inter', 'Montserrat', 'Open Sans', sans-serif";
    }
    if (typeof localStorage !== 'undefined') {
      safeStorage.set('whitecaves_language', language);
    }
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: LanguageType) => {
    if (lang in supportedLocales) {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => {
      if (prev === LANGUAGES.EN) return LANGUAGES.AR;
      if (prev === LANGUAGES.AR) return LANGUAGES.ES;
      if (prev === LANGUAGES.ES) return LANGUAGES.RU;
      return LANGUAGES.EN;
    });
  }, []);

  const t = useCallback(
    (key: string, params: Record<string, string | number> = {}): string => {
      const keys = key.split('.');
      const langTranslations = (dictionaries as Record<string, TranslationRecord>)[language];
      let value: TranslationValue | undefined = langTranslations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as TranslationRecord)[k];
        } else {
          // Fallback to English dictionary
          const fallback: TranslationRecord | undefined = dictionaries[LANGUAGES.EN] as unknown as TranslationRecord;
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
        const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(`{${escaped}}`, 'g'), String(params[param]));
      });

      return result;
    },
    [language]
  );

  const formatNumber = useCallback(
    (number: number): string => {
      const locale = language === 'ar' ? 'ar-AE' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'en-AE';
      return new Intl.NumberFormat(locale).format(number);
    },
    [language]
  );

  const formatCurrency = useCallback(
    (amount: number, currency: string = 'AED'): string => {
      const locale = language === 'ar' ? 'ar-AE' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'en-AE';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    },
    [language]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      const locale = language === 'ar' ? 'ar-AE' : language === 'es' ? 'es-ES' : language === 'ru' ? 'ru-RU' : 'en-AE';
      return d.toLocaleDateString(locale, options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isRTL,
      t,
      formatNumber,
      formatCurrency,
      formatDate,
      translations: (dictionaries[language] || dictionaries[LANGUAGES.EN]) as unknown as TranslationRecord,
      supportedLanguages: supportedLocales,
    }),
    [language, setLanguage, toggleLanguage, isRTL, t, formatNumber, formatCurrency, formatDate]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
